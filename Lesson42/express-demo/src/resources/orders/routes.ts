import { Router } from 'express';
import { checkJwt } from '../../common/auth';
import { getMyOrders, getOneById, listAll } from './controller';

const router = Router();

/**
 * Orders routes — protected by Auth0 JWT middleware (`checkJwt`).
 *
 * NOTE: Orders are created via Stripe webhook, not via POST.
 * These routes provide read-only access to orders.
 *
 * To call these routes from Next.js (Auth0 v4 SDK):
 *   const { accessToken } = await getAccessToken({ audience: 'YOUR_API_IDENTIFIER' });
 *   fetch('http://localhost:8000/v1/orders', {
 *     headers: { Authorization: `Bearer ${accessToken}` },
 *   });
 */

router.get('/', checkJwt, getMyOrders);

router.get('/all', checkJwt, listAll);

/**
 * TODO (Student exercise): This route stub is protected but not implemented.
 * Complete the `getOneById` controller function.
 */
router.get('/:id', checkJwt, getOneById);

export { router as ordersRouter };
