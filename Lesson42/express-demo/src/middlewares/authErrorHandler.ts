import { Request, Response, NextFunction } from 'express';
import {
  UnauthorizedError,
  InvalidTokenError,
  InsufficientScopeError,
} from 'express-oauth2-jwt-bearer';

/**
 * Auth0 error-handling middleware.
 *
 * Place this AFTER routes to catch JWT validation errors and return clear JSON.
 * See: https://auth0.com/docs/quickstart/backend/nodejs
 */
export const authErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof InsufficientScopeError) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Insufficient scope — permission denied',
    });
  }

  if (err instanceof InvalidTokenError) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message || 'Authentication required',
    });
  }

  return next(err);
};
