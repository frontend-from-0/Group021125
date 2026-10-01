import { auth } from 'express-oauth2-jwt-bearer';
import './env';

/**
 * Auth0 JWT middleware for Express.
 *
 * Uses `express-oauth2-jwt-bearer` — the recommended library for protecting
 * Express APIs with Auth0 access tokens.
 *
 * Configuration:
 *   AUTH0_ISSUER_BASE_URL  — e.g. https://your-tenant.auth0.com
 *   AUTH0_AUDIENCE         — the API identifier you registered in Auth0
 *
 * Usage:
 *   import { checkJwt } from './common/auth';
 *   router.get('/protected', checkJwt, handler);
 *
 * The middleware validates the JWT signature and claims. On success it
 * populates `req.auth` with the token payload (including `sub` — the user id).
 *
 * In the Next.js front-end (Auth0 v4 SDK), obtain an access token for this API:
 *   const { accessToken } = await getAccessToken({ audience: 'YOUR_API_IDENTIFIER' });
 * Then pass it as `Authorization: Bearer <accessToken>` on fetch/axios calls.
 */
export const checkJwt = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
});
