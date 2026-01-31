import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// 获取素材列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      gameId,
      categoryId,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (gameId) {
      where.gameId = parseInt(gameId as string);
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

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
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { uploadTime: 'desc' },
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

// 获取素材详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const materialId = parseInt(id);

    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: {
        game: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!material) {
      return res.status(404).json({ success: false, message: '素材不存在' });
    }

    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取素材详情失败', error });
  }
});

// 记录下载
router.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const materialId = parseInt(id);
    const ip = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    await Promise.all([
      prisma.downloadLog.create({
        data: {
          materialId: materialId,
          ip,
          userAgent,
        },
      }),
      prisma.material.update({
        where: { id: materialId },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      }),
    ]);

    res.json({ success: true, message: '下载记录已保存' });
  } catch (error) {
    res.status(500).json({ success: false, message: '记录下载失败', error });
  }
});

export default router;

