import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { NextResponse } from 'next/server';

import { upsertUserFromLogin } from '@/lib/users';

function redirectAfterLogin(appBaseUrl: string | undefined, returnTo: string | undefined) {
  if (!appBaseUrl) {
    return new NextResponse('appBaseUrl could not be resolved for the callback redirect.', {
      status: 500,
    });
  }

  const path =
    returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/';
  const base = appBaseUrl.endsWith('/') ? appBaseUrl : `${appBaseUrl}/`;

  return NextResponse.redirect(new URL(path.slice(1), base));
}

export const auth0 = new Auth0Client({
  authorizationParameters: process.env.AUTH0_AUDIENCE
    ? { audience: process.env.AUTH0_AUDIENCE }
    : undefined,
  async onCallback(error, ctx, session) {
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    if (session) {
      await upsertUserFromLogin(session.user);
    }

    return redirectAfterLogin(ctx.appBaseUrl, ctx.returnTo);
  },
});
