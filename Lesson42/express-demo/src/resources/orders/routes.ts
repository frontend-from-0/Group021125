import { Router } from 'express';
import { checkJwt, requireAdmin } from '../../common/auth';
import { getMyOrders, getOneById, listAll } from './controller';

const router = Router();

/**
 * SOLUTION: checkJwt added — validates Auth0 JWT and populates req.auth.payload.sub
 */
router.get('/', checkJwt, getMyOrders);

router.get('/all', checkJwt, requireAdmin, listAll);

/**
 * SOLUTION: checkJwt added — validates Auth0 JWT and populates req.auth.payload.sub
 */
router.get('/:id', checkJwt, getOneById);

export { router as ordersRouter };
