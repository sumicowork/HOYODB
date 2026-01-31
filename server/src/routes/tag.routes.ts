import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// 获取所有标签（公开接口）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type) where.type = type;

    const tags = await prisma.tag.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取标签列表失败', error });
  }
});

// 获取单个标签及其素材
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { slug: slug as string },
      include: {
        materials: {
          where: {
            material: {
              status: 'PUBLISHED',
            },
          },
          include: {
            material: {
              include: {
                game: true,
                category: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ success: false, message: '标签不存在' });
    }

    res.json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取标签详情失败', error });
  }
});

export default router;

