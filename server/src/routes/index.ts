import { Router } from 'express';
import gameRoutes from './game.routes';
import materialRoutes from './material.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import tagRoutes from './tag.routes';
import uploadRoutes from './upload.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/materials', materialRoutes);
router.use('/tags', tagRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', authMiddleware, uploadRoutes); // 需要认证

export default router;

