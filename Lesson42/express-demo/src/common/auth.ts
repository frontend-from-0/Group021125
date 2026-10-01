import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import './env';

const ROLES_CLAIM = 'https://pyp-admin/roles';
const ADMIN_ROLE = 'admin';

/**
 * Auth0 JWT middleware for Express.
 *
 * Uses `express-oauth2-jwt-bearer` — the recommended library for protecting
 * Express APIs with Auth0 access tokens.
 *
 * Configuration (from .env):
 *   AUTH0_DOMAIN   — your tenant domain, e.g. your-tenant.auth0.com
 *   AUTH0_AUDIENCE — the API identifier you registered in Auth0
 *
 * Usage:
 *   import { checkJwt, requireAdmin } from './common/auth';
 *   router.get('/protected', checkJwt, handler);
 *   router.get('/admin-only', checkJwt, requireAdmin, handler);
 *
 * The middleware validates the JWT signature and claims. On success it
 * populates `req.auth` with the token payload (including `sub` — the user id).
 *
 * In the Next.js front-end (Auth0 v4 SDK), obtain an access token for this API:
 *   const { token } = await getAccessToken({ audience: 'YOUR_API_IDENTIFIER' });
 * Then pass it as `Authorization: Bearer ${token}` on fetch/axios calls.
 */
export const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

function getRoles(req: Request): string[] {
  const value = req.auth?.payload?.[ROLES_CLAIM];
  if (!Array.isArray(value)) return [];
  return value.filter((role): role is string => typeof role === 'string');
}

/** Use after checkJwt. Requires the Auth0 `admin` role on the access token. */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!getRoles(req).includes(ADMIN_ROLE)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
};
