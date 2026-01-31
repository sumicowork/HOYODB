import { Router, Request, Response } from 'express';
import prisma from '../prisma';

const router = Router();

// 获取所有游戏
router.get('/', async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取游戏列表失败', error });
  }
});

// 获取单个游戏详情
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        categories: {
          where: { parentId: null },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ success: false, message: '游戏不存在' });
    }

    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取游戏详情失败', error });
  }
});

export default router;

