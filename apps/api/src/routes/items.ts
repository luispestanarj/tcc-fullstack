import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import * as itemController from '../controllers/itemController';

const router = Router();

router.use(authenticate);

router.put('/:id', itemController.update);
router.patch('/:id/toggle', itemController.toggle);
router.delete('/:id', itemController.remove);

export default router;
