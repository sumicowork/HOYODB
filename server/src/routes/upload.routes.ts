import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import webdavService from '../services/webdav.service';

const router = Router();

// 配置 multer 内存存储
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB 限制
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedMimes = [
      // 图片
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // 音频
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/aac',
      // 视频
      'video/mp4',
      'video/webm',
      'video/ogg',
      // 文档
      'application/pdf',
      'application/zip',
      'application/x-rar-compressed',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`不支持的文件类型: ${file.mimetype}`));
    }
  },
});

// 上传单个文件
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }

    const { gameSlug, categorySlug } = req.body;

    if (!gameSlug) {
      return res.status(400).json({ success: false, message: '缺少游戏标识' });
    }

    // 构建存储路径: /hoyodb/{gameSlug}/{categorySlug}/
    const remotePath = categorySlug
      ? `/${gameSlug}/${categorySlug}`
      : `/${gameSlug}`;

    // 生成唯一文件名
    const ext = path.extname(req.file.originalname);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomStr}${ext}`;

    // 上传到 WebDAV
    const fileUrl = await webdavService.uploadFile(
      req.file.buffer,
      remotePath,
      filename
    );

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        path: remotePath,
      },
    });
  } catch (error: any) {
    console.error('文件上传失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '文件上传失败',
    });
  }
});

// 批量上传文件
router.post('/upload/batch', upload.array('files', 20), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }

    const { gameSlug, categorySlug } = req.body;

    if (!gameSlug) {
      return res.status(400).json({ success: false, message: '缺少游戏标识' });
    }

    const remotePath = categorySlug
      ? `/${gameSlug}/${categorySlug}`
      : `/${gameSlug}`;

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `${timestamp}-${randomStr}${ext}`;

        const fileUrl = await webdavService.uploadFile(
          file.buffer,
          remotePath,
          filename
        );

        results.push({
          url: fileUrl,
          filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          path: remotePath,
        });
      } catch (err: any) {
        errors.push({
          originalName: file.originalname,
          error: err.message,
        });
      }
    }

    res.json({
      success: true,
      data: {
        uploaded: results,
        failed: errors,
        total: files.length,
        successCount: results.length,
        failedCount: errors.length,
      },
    });
  } catch (error: any) {
    console.error('批量上传失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '批量上传失败',
    });
  }
});

// 删除文件
router.delete('/delete', async (req: Request, res: Response) => {
  try {
    const { path: remotePath, filename } = req.body;

    if (!remotePath || !filename) {
      return res.status(400).json({ success: false, message: '缺少路径或文件名' });
    }

    await webdavService.deleteFile(remotePath, filename);

    res.json({ success: true, message: '文件删除成功' });
  } catch (error: any) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '删除文件失败',
    });
  }
});

// 列出目录
router.get('/list', async (req: Request, res: Response) => {
  try {
    const { path: remotePath = '/' } = req.query;

    const files = await webdavService.listDirectory(remotePath as string);

    res.json({
      success: true,
      data: files.map(file => ({
        name: file.basename,
        type: file.type,
        size: file.size,
        lastModified: file.lastmod,
        path: file.filename,
      })),
    });
  } catch (error: any) {
    console.error('列出目录失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '列出目录失败',
    });
  }
});

// 获取存储信息
router.get('/storage', async (req: Request, res: Response) => {
  try {
    const info = await webdavService.getStorageInfo();

    if (info) {
      res.json({
        success: true,
        data: {
          used: info.used,
          available: info.available,
          usedFormatted: formatBytes(info.used),
          availableFormatted: formatBytes(info.available),
        },
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: '无法获取存储信息',
      });
    }
  } catch (error: any) {
    console.error('获取存储信息失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取存储信息失败',
    });
  }
});

// 检查 WebDAV 连接状态
router.get('/status', async (req: Request, res: Response) => {
  try {
    const client = webdavService.getWebDAVClient();
    const exists = await client.exists('/');

    res.json({
      success: true,
      data: {
        connected: exists,
        webdavUrl: process.env.WEBDAV_URL || 'http://localhost:5244/dav',
      },
    });
  } catch (error: any) {
    res.json({
      success: false,
      data: {
        connected: false,
        error: error.message,
      },
    });
  }
});

// 格式化字节数
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;

