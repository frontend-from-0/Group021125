import { Request, Response, NextFunction } from 'express';
import { getAllOrders, getOrderById, getOrdersByUserId } from './store';

/**
 * Orders controller.
 *
 * NOTE: Orders are CREATED by the Stripe webhook (`checkout.session.completed`),
 * NOT by a POST endpoint. This controller only provides read access.
 *
 * Auth0 `checkJwt` middleware populates `req.auth.payload.sub` with the user id.
 */

/**
 * GET /v1/orders
 * Returns orders for the authenticated user (by Auth0 `sub`).
 *
 * This route is protected by `checkJwt` — the Auth0 JWT middleware.
 * The token's `sub` claim identifies the user.
 */
const getMyOrders = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({ error: 'Unauthorized — missing user identity' });
  }

  const orders = getOrdersByUserId(userId);
  res.status(200).json(orders);
};

/**
 * GET /v1/orders/:id
 *
 * TODO (Student exercise): Implement this endpoint.
 *
 * Requirements:
 * 1. Extract the order `id` from `req.params.id`
 * 2. Use `getOrderById(id)` to fetch the order from the store
 * 3. If no order is found, return 404 with { error: 'Order not found' }
 * 4. SECURITY: Verify the order belongs to the authenticated user
 *    (compare order.userId with req.auth?.payload?.sub)
 *    If not, return 403 with { error: 'Forbidden' }
 * 5. Return the order as JSON with status 200
 */
const getOneById = async (req: Request, res: Response, _next: NextFunction) => {
  // TODO: Implement this endpoint (see requirements above)
  res.status(501).json({ error: 'Not implemented — student exercise' });
};

/**
 * GET /v1/orders/all — requires `read:orders` scope.
 *
 * Protected by checkScopes('read:orders') in routes.ts.
 * Returns all orders (useful for admin dashboards or debugging).
 */
const listAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const orders = getAllOrders();
  res.status(200).json(orders);
};

export { getMyOrders, getOneById, listAll };
