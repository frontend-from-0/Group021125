import { Router } from 'express';
import { ordersRouter } from '../resources/orders/routes';

const router: Router = Router();

// Orders routes (protected by Auth0 checkJwt middleware)
router.use('/orders', ordersRouter);

// NOTE: Users and products live in the Next.js app (Auth0 v4 + your DB).
// This Express API only handles Stripe webhooks and order retrieval.

export default router;

