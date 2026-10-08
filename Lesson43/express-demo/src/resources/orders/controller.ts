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

const getMyOrders = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
    return;
  }

  const orders = await getOrdersByUserId(userId);
  res.status(200).json(orders);
};

const getOneById = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized — missing user identity' });
    return;
  }

  const id = req.params.id;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(400).json({ error: 'Order id is not a valid id' });
    return;
  }

  const order = await getOrderById(id);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  if (order.userId !== userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  res.status(200).json(order);
};

const listAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const orders = await getAllOrders();
  res.status(200).json(orders);
};

export { getMyOrders, getOneById, listAll };
