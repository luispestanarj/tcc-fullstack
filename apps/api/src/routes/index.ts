import { Router } from 'express';
import authRoutes from './auth';
import listRoutes from './lists';
import itemRoutes from './items';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
router.use('/auth', authRoutes);
router.use('/lists', listRoutes);
router.use('/items', itemRoutes);

export default router;
