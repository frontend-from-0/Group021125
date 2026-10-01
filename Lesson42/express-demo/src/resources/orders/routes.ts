import { Router } from 'express';
import { checkJwt, requireAdmin } from '../../common/auth';
import { getMyOrders, getOneById, listAll } from './controller';

const router = Router();

/**
 * TODO (Student exercise): Add `checkJwt` and implement `getMyOrders`.
 */
router.get('/', checkJwt, getMyOrders);

router.get('/all', checkJwt, requireAdmin, listAll);

/**
 * TODO (Student exercise): Add `checkJwt` and implement `getOneById`.
 */
router.get('/:id', checkJwt, getOneById);



export { router as ordersRouter };
