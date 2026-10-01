import { Router } from 'express';
import { checkJwt, checkScopes } from '../../common/auth';
import { getMyOrders, getOneById, listAll } from './controller';

const router = Router();

/**
 * Orders routes — protected by Auth0 JWT middleware (`checkJwt`).
 *
 * NOTE: Orders are created via Stripe webhook, not via POST.
 * These routes provide read-only access to orders.
 *
 * To call these routes from Next.js (Auth0 v4 SDK):
 *   const { token } = await getAccessToken({ audience: 'YOUR_API_IDENTIFIER' });
 *   fetch('http://localhost:8000/v1/orders', {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 */

router.get('/', checkJwt, getMyOrders);

/**
 * GET /v1/orders/all — requires `read:orders` scope.
 *
 * This demonstrates scope-based authorization with Auth0:
 * - The `read:orders` permission must be defined on your Auth0 API
 * - The client must request this scope when getting the access token
 * - In Next.js: getAccessToken({ audience: '...', scope: 'read:orders' })
 */
router.get('/all', checkJwt, checkScopes('read:orders'), listAll);

/**
 * TODO (Student exercise): This route stub is protected but not implemented.
 * Complete the `getOneById` controller function.
 */
router.get('/:id', checkJwt, getOneById);

export { router as ordersRouter };
