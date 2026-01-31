import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const router = Router();

// 管理员登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '登录失败', error });
  }
});

// 验证 token
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: '未提供 token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true },
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: { admin } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token 无效' });
  }
});

export default router;

