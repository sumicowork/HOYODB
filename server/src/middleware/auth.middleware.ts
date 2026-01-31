import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    username: string;
  };
}

// 验证管理员身份的中间件
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      id: number;
      username: string;
    };

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: '认证令牌无效或已过期' });
  }
};

