import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import routes from './common/routes';
import unknownEndpoint from './middlewares/unknownEndpoint';
import { authErrorHandler } from './middlewares/authErrorHandler';
import { receiveUpdates } from './resources/webhooks/controller';

import './common/env';

const app: Application = express();

app.disable('x-powered-by');
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '100kb',
  }),
);

// IMPORTANT: Stripe webhook route MUST come BEFORE express.json() middleware.
// Stripe signature verification requires the raw request body.
// See: https://github.com/stripe/stripe-node/issues/341
app.post('/v1/stripe/webhook', express.raw({ type: 'application/json' }), receiveUpdates);

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    'health-check': 'OK: top level api working',
  });
});

app.use('/v1/', routes);

app.use('*', unknownEndpoint);

// Auth0 error handler — returns JSON for JWT 401s from checkJwt
app.use(authErrorHandler);

export default app;

