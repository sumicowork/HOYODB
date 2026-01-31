import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import webdavService from '../services/webdav.service';

const router = Router();

// 配置 multer 内存存储
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB 限制
  },
});

// 所有管理员路由都需要认证
router.use(authMiddleware);

// ==================== 游戏管理 ====================

// 获取所有游戏（包括未激活的）
router.get('/games', async (req: AuthRequest, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { materials: true, categories: true }
        }
      }
    });
    res.json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取游戏列表失败', error });
  }
});

// 创建游戏
router.post('/games', async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, icon, sortOrder, isActive } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: '游戏名称和 slug 不能为空' });
    }

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        icon,
        sortOrder: sortOrder || 0,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({ success: true, data: game });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: '游戏名称或 slug 已存在' });
    }
    res.status(500).json({ success: false, message: '创建游戏失败', error });
  }
});

// 更新游戏
router.put('/games/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, slug, icon, sortOrder, isActive } = req.body;

    const game = await prisma.game.update({
      where: { id },
      data: {
        name,
        slug,
        icon,
        sortOrder,
        isActive,
      },
    });

    res.json({ success: true, data: game });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '游戏不存在' });
    }
    res.status(500).json({ success: false, message: '更新游戏失败', error });
  }
});

// 删除游戏
router.delete('/games/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    await prisma.game.delete({ where: { id } });

    res.json({ success: true, message: '游戏已删除' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '游戏不存在' });
    }
    res.status(500).json({ success: false, message: '删除游戏失败', error });
  }
});

// ==================== 分类管理 ====================

// 获取所有分类
router.get('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const { gameId } = req.query;

    const where: any = {};
    if (gameId) {
      where.gameId = parseInt(gameId as string);
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        game: true,
        parent: true,
        _count: { select: { materials: true } }
      },
      orderBy: [{ gameId: 'asc' }, { sortOrder: 'asc' }],
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取分类列表失败', error });
  }
});

// 创建分类
router.post('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const { gameId, name, slug, parentId, sortOrder } = req.body;

    if (!gameId || !name || !slug) {
      return res.status(400).json({ success: false, message: '游戏ID、分类名称和 slug 不能为空' });
    }

    const category = await prisma.category.create({
      data: {
        gameId,
        name,
        slug,
        parentId,
        sortOrder: sortOrder || 0,
      },
    });

    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: '该游戏下已存在相同的分类 slug' });
    }
    res.status(500).json({ success: false, message: '创建分类失败', error });
  }
});

// 更新分类
router.put('/categories/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, slug, parentId, sortOrder } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parentId, sortOrder },
    });

    res.json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    res.status(500).json({ success: false, message: '更新分类失败', error });
  }
});

// 删除分类
router.delete('/categories/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    await prisma.category.delete({ where: { id } });

    res.json({ success: true, message: '分类已删除' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    res.status(500).json({ success: false, message: '删除分类失败', error });
  }
});

// ==================== 素材管理 ====================

// 获取所有素材（包括草稿和归档）
router.get('/materials', async (req: AuthRequest, res: Response) => {
  try {
    const {
      gameId,
      categoryId,
      status,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (gameId) where.gameId = parseInt(gameId as string);
    if (categoryId) where.categoryId = parseInt(categoryId as string);
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        include: {
          game: true,
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.material.count({ where }),
    ]);

    res.json({
      success: true,
      data: materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取素材列表失败', error });
  }
});

// 创建素材
router.post('/materials', async (req: AuthRequest, res: Response) => {
  try {
    const {
      gameId,
      categoryId,
      title,
      description,
      filePath,
      fileSize,
      fileType,
      duration,
      resolution,
      version,
      isFeatured,
      status,
      tagIds,
    } = req.body;

    if (!gameId || !categoryId || !title || !filePath || !fileSize || !fileType) {
      return res.status(400).json({
        success: false,
        message: '游戏ID、分类ID、标题、文件路径、文件大小和文件类型不能为空',
      });
    }

    const material = await prisma.material.create({
      data: {
        gameId,
        categoryId,
        title,
        description,
        filePath,
        fileSize: BigInt(fileSize),
        fileType,
        duration,
        resolution,
        version,
        isFeatured: isFeatured || false,
        status: status || 'PUBLISHED',
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId: number) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        game: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    console.error('创建素材失败:', error);
    res.status(500).json({ success: false, message: '创建素材失败', error });
  }
});

// 创建素材（带文件上传的原子操作）
router.post('/materials/with-upload', upload.single('file'), async (req: AuthRequest, res: Response) => {
  let uploadedFilePath: string | null = null;
  let uploadedFilename: string | null = null;

  try {
    const {
      gameId,
      gameSlug,
      categoryId,
      categorySlug,
      title,
      description,
      duration,
      resolution,
      version,
      isFeatured,
      status,
      tagIds,
    } = req.body;

    // 验证必填字段
    if (!gameId || !categoryId || !title) {
      return res.status(400).json({
        success: false,
        message: '游戏ID、分类ID和标题不能为空',
      });
    }

    // 如果有文件上传，先上传到 WebDAV
    let filePath = req.body.filePath || '';
    let fileSize = req.body.fileSize || '0';
    let fileType = req.body.fileType || '';

    if (req.file) {
      const remotePath = categorySlug
        ? `/${gameSlug}/${categorySlug}`
        : `/${gameSlug}`;

      // 生成唯一文件名
      const ext = path.extname(req.file.originalname);
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const filename = `${timestamp}-${randomStr}${ext}`;

      // 上传到 WebDAV
      filePath = await webdavService.uploadFile(
        req.file.buffer,
        remotePath,
        filename
      );

      // 记录上传的文件信息用于失败时回滚
      uploadedFilePath = remotePath;
      uploadedFilename = filename;

      fileSize = String(req.file.size);
      fileType = req.file.mimetype;
    }

    if (!filePath || !fileSize || !fileType) {
      return res.status(400).json({
        success: false,
        message: '必须上传文件或提供文件路径、大小和类型',
      });
    }

    // 解析 tagIds
    let parsedTagIds: number[] = [];
    if (tagIds) {
      try {
        parsedTagIds = typeof tagIds === 'string' ? JSON.parse(tagIds) : tagIds;
      } catch {
        parsedTagIds = [];
      }
    }

    // 创建素材记录
    const material = await prisma.material.create({
      data: {
        gameId: parseInt(gameId),
        categoryId: parseInt(categoryId),
        title,
        description: description || undefined,
        filePath,
        fileSize: BigInt(fileSize),
        fileType,
        duration: duration ? parseInt(duration) : undefined,
        resolution: resolution || undefined,
        version: version || undefined,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        status: status || 'PUBLISHED',
        tags: parsedTagIds.length
          ? {
              create: parsedTagIds.map((tagId: number) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        game: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    console.error('创建素材失败:', error);

    // 如果素材创建失败且已上传文件，则删除已上传的文件
    if (uploadedFilePath && uploadedFilename) {
      try {
        await webdavService.deleteFile(uploadedFilePath, uploadedFilename);
        console.log('已回滚上传的文件:', uploadedFilePath, uploadedFilename);
      } catch (rollbackError) {
        console.error('回滚文件删除失败:', rollbackError);
      }
    }

    res.status(500).json({ success: false, message: '创建素材失败', error });
  }
});

// 更新素材
router.put('/materials/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const {
      title,
      description,
      filePath,
      fileSize,
      fileType,
      duration,
      resolution,
      version,
      isFeatured,
      status,
      tagIds,
    } = req.body;

    // 如果提供了 tagIds，先删除旧的关联再创建新的
    if (tagIds !== undefined) {
      await prisma.materialTag.deleteMany({
        where: { materialId: id },
      });
    }

    const material = await prisma.material.update({
      where: { id },
      data: {
        title,
        description,
        filePath,
        fileSize: fileSize ? BigInt(fileSize) : undefined,
        fileType,
        duration,
        resolution,
        version,
        isFeatured,
        status,
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId: number) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        game: true,
        category: true,
        tags: { include: { tag: true } },
      },
    });

    res.json({ success: true, data: material });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '素材不存在' });
    }
    res.status(500).json({ success: false, message: '更新素材失败', error });
  }
});

// 删除素材
router.delete('/materials/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    await prisma.material.delete({ where: { id } });

    res.json({ success: true, message: '素材已删除' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '素材不存在' });
    }
    res.status(500).json({ success: false, message: '删除素材失败', error });
  }
});

// ==================== 标签管理 ====================

// 获取所有标签
router.get('/tags', async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type) where.type = type;

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: { select: { materials: true } }
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取标签列表失败', error });
  }
});

// 创建标签
router.post('/tags', async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, type } = req.body;

    if (!name || !slug || !type) {
      return res.status(400).json({ success: false, message: '标签名称、slug 和类型不能为空' });
    }

    const tag = await prisma.tag.create({
      data: { name, slug, type },
    });

    res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: '标签名称或 slug 已存在' });
    }
    res.status(500).json({ success: false, message: '创建标签失败', error });
  }
});

// 更新标签
router.put('/tags/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, slug, type } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: { name, slug, type },
    });

    res.json({ success: true, data: tag });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '标签不存在' });
    }
    res.status(500).json({ success: false, message: '更新标签失败', error });
  }
});

// 删除标签
router.delete('/tags/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    await prisma.tag.delete({ where: { id } });

    res.json({ success: true, message: '标签已删除' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: '标签不存在' });
    }
    res.status(500).json({ success: false, message: '删除标签失败', error });
  }
});

// ==================== 统计数据 ====================

// 获取仪表盘统计
router.get('/dashboard/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalMaterials,
      totalDownloads,
      totalGames,
      totalCategories,
      recentMaterials,
      popularMaterials,
    ] = await Promise.all([
      prisma.material.count(),
      prisma.material.aggregate({ _sum: { downloadCount: true } }),
      prisma.game.count(),
      prisma.category.count(),
      prisma.material.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { game: true, category: true },
      }),
      prisma.material.findMany({
        take: 5,
        orderBy: { downloadCount: 'desc' },
        include: { game: true, category: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalMaterials,
          totalDownloads: totalDownloads._sum.downloadCount || 0,
          totalGames,
          totalCategories,
        },
        recentMaterials,
        popularMaterials,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取统计数据失败', error });
  }
});

export default router;

