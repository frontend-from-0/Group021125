import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { STRIPE_ENDPOINT_SECRET, stripe } from '../../common/stripe';
import { upsertOrder, markOrderExpired } from '../orders/store';
import logger from '../../common/logger';

/**
 * Stripe webhook handler.
 *
 * IMPORTANT: This route must be registered with `express.raw({ type: 'application/json' })`
 * BEFORE `express.json()` middleware, so the raw body is available for signature verification.
 */
const receiveUpdates = async (request: Request, response: Response, _next: NextFunction) => {
  let event: Stripe.Event;
  logger.info('receiveUpdates');

  if (STRIPE_ENDPOINT_SECRET) {
    const signature = request.headers['stripe-signature'];

    if (!signature) {
      logger.error('Stripe signature is missing from the request');
      return response.sendStatus(400);
    }

    try {
      event = stripe.webhooks.constructEvent(request.body, signature, STRIPE_ENDPOINT_SECRET);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Webhook signature verification failed: ${message}`);
      return response.sendStatus(400);
    }
  } else {
    event = request.body as Stripe.Event;
    logger.warn('No STRIPE_WEBHOOK_SECRET set — skipping signature verification (not safe for production)');
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      logger.info(`checkout.session.completed — session ${session.id}`);

      const order = upsertOrder(session.id, {
        userId: (session.metadata?.userId as string) ?? null,
        customerEmail: session.customer_details?.email ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
        status: 'paid',
      });

      logger.info(`Order created/updated: ${order.id}`);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      logger.info(`checkout.session.expired — session ${session.id}`);
      markOrderExpired(session.id);
      break;
    }

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  response.sendStatus(200);
};

export { receiveUpdates };
