import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import './env';

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
 *   import { checkJwt, checkScopes } from './common/auth';
 *   router.get('/protected', checkJwt, handler);
 *   router.get('/admin', checkJwt, checkScopes('read:admin'), handler);
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

/**
 * Scope-checking middleware — use after checkJwt.
 *
 * Example: checkScopes('read:orders') requires the token to have that scope.
 * The scope/permission must exist on the Auth0 API and be requested by the client.
 */
export const checkScopes = requiredScopes;
