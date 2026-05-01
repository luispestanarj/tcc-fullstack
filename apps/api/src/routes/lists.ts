import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import * as listController from '../controllers/listController';
import * as itemController from '../controllers/itemController';

const router = Router();

router.use(authenticate);

router.get('/', listController.index);
router.post('/', listController.create);
router.get('/:id', listController.show);
router.put('/:id', listController.update);
router.delete('/:id', listController.remove);

router.get('/:listId/items', itemController.index);
router.post('/:listId/items', itemController.create);

export default router;
