# Bearer tokens and JWTs

Next.js talks to the Express orders API with:

```ts
headers: { Authorization: `Bearer ${token}` }
```

That sends:

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Headers

An HTTP request is more than a URL. **Headers** are extra fields the server reads before looking at the body.

`Authorization` is the standard header for “who is making this request?”

## Bearer token

Two parts:

1. **`Bearer`** — the scheme. It means “here is a token; whoever holds it is allowed in.” It is not a username and password. Anyone who has the token can use it, so it must not go in the URL.
2. **`${token}`** — the Auth0 **access token**. Next.js gets it with `getAccessToken({ audience: ... })`. Express `checkJwt` reads this header.

Without that header, Express has no token → **401**.  
A fake string after `Bearer` is still a header, but the token is invalid → **401**.

One line: Next.js is saying “let me into the orders API. Proof: this Auth0 access token.” Express does not look up a session cookie. It only looks at that header.

## JWT

A **JWT** (JSON Web Token) is that access token: a signed string that proves “this request is from a logged-in user, for this API.”

It has three Base64 pieces separated by dots:

```text
header.payload.signature
```

- **Header** — how it is signed (this project uses RS256).
- **Payload** — claims: `sub` (user id), `aud` (your API identifier), `iss` (Auth0), expiry, and `https://pyp-admin/roles`.
- **Signature** — Auth0’s seal. Express checks it with Auth0’s public key. If anyone changes the payload, the signature no longer matches.

A JWT is **not** a session stored on Express. Next.js sends it on every call. `checkJwt` then checks:

1. Signature is valid
2. Issuer is your Auth0 domain (`iss`)
3. Audience is this API (`aud` = `AUTH0_AUDIENCE`)
4. It is not expired

If those pass, Express trusts `req.auth.payload.sub` as the user id. It does not call Auth0 again on every request.

One line: a JWT is a signed ID badge. Auth0 prints it; Express checks the seal and the “valid for” stamp (`aud`), then lets the request in.
