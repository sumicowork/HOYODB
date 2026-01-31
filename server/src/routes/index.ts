import { Router } from 'express';
import gameRoutes from './game.routes';
import materialRoutes from './material.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/materials', materialRoutes);
router.use('/tags', tagRoutes);
router.use('/admin', adminRoutes);

export default router;

