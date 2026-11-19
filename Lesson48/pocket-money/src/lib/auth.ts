import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";
import { requireMongoUserId } from "@/lib/users";

export type SessionUser = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user?.sub) return null;

  return {
    sub: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?returnTo=/home");
  return user;
}

export async function requireUserWithDbId(): Promise<{
  user: SessionUser;
  mongoUserId: string;
}> {
  const user = await requireUser();
  const mongoUserId = await requireMongoUserId(user.sub);
  return { user, mongoUserId };
}
