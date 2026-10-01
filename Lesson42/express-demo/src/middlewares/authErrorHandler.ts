import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';

/**
 * Auth0 error-handling middleware.
 *
 * Place this AFTER routes to catch JWT validation errors from `checkJwt`
 * and return JSON instead of Express's default HTML error page.
 * `InvalidTokenError` is a subclass of `UnauthorizedError`, so one check covers both.
 */
export const authErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode || 401).json({
      error: 'Unauthorized',
      message: err.message || 'Authentication required',
    });
  }

  return next(err);
};
