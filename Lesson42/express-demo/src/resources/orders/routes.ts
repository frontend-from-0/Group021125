import { Router } from 'express';
import { checkJwt, requireAdmin } from '../../common/auth';
import { getMyOrders, getOneById, listAll } from './controller';

const router = Router();

/**
 * TODO (Student exercise): Add `checkJwt` and implement `getMyOrders`.
 */
router.get('/', getMyOrders);

router.get('/all', checkJwt, requireAdmin, listAll);

/**
 * TODO (Student exercise): Add `checkJwt` and implement `getOneById`.
 */
router.get('/:id', getOneById);

export { router as ordersRouter };
