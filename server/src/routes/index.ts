import { Router } from 'express';
import gameRoutes from './game.routes';
import materialRoutes from './material.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/materials', materialRoutes);

export default router;

