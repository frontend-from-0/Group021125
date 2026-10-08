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
 *
 * TODO (Student exercise): Implement this endpoint.
 *
 * Requirements:
 * 1. Protect the route with `checkJwt` in routes.ts
 * 2. Read the user id from `req.auth?.payload?.sub`
 * 3. If it is missing, return 401 with { error: 'Unauthorized — missing user identity' }
 * 4. Use `getOrdersByUserId(userId)` to fetch that user's orders
 * 5. Return the orders as JSON with status 200
 */
const getMyOrders = async (req: Request, res: Response, _next: NextFunction) => {

  const userId = req.auth?.payload?.sub;

  if(!userId){
   
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
   
  }
  const orders = getOrdersByUserId(userId as string);
  res.status(200).json(orders);
  
}
/**
 * GET /v1/orders/:id
 *
 * TODO (Student exercise): Implement this endpoint.
 *
 * Requirements:
 * 1. Protect the route with `checkJwt` in routes.ts
 * 2. Extract the order `id` from `req.params.id`
 * 3. Use `getOrderById(id)` to fetch the order from the store
 * 4. If no order is found, return 404 with { error: 'Order not found' }
 * 5. Verify the order belongs to the authenticated user
 *    (compare `order.userId` with `req.auth?.payload?.sub`)
 *    If not, return 403 with { error: 'Forbidden' }
 * 6. Return the order as JSON with status 200
 */
const getOneById = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if(!userId){
   
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
   
  }
  
  const id = req.params.id;
  const order = getOrderById(id);
  if(!order){
    res.status(404).json({ error: 'Order is not found' })
  }
  if(order?.userId !== userId)
  {
    res.status(404).json({ error: 'Forbidden' })
  }
  res.status(200).json(order);

};

/**
 * GET /v1/orders/all
 *
 * Protected by checkJwt and requireAdmin. Returns all orders.
 */
const listAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const orders = getAllOrders();
  res.status(200).json(orders);
};

export { getMyOrders, getOneById, listAll };
