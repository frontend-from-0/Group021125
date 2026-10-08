import { Router } from 'express';
import { ordersRouter } from '../resources/orders/routes';

const router: Router = Router();

router.use('/orders', ordersRouter);

export default router;

