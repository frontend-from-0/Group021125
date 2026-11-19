import type { User as Auth0User } from "@auth0/nextjs-auth0/types";

import { db } from "@/prisma/db";

function toIsoNow(): string {
  return new Date().toISOString();
}

export async function findMongoUserIdByAuth0Id(
  auth0Id: string,
): Promise<string | null> {
  const stored = await db.orm.users.where({ auth0_id: auth0Id }).first();
  if (!stored) return null;
  return String(stored.id);
}

export async function upsertUserFromLogin(user: Auth0User) {
  const auth0Id = user.sub?.trim();
  if (!auth0Id) {
    throw new Error("Auth0 login is missing a user id");
  }

  const now = toIsoNow();

  const saved = await db.orm.users.where({ auth0_id: auth0Id }).upsert({
    create: {
      auth0_id: auth0Id,
      createdAt: now,
      updatedAt: now,
    },
    update: {
      updatedAt: now,
    },
  });

  if (!saved) {
    throw new Error(`Upsert returned no user for ${auth0Id}`);
  }

  return saved;
}

export async function requireMongoUserId(auth0Id: string): Promise<string> {
  const existing = await findMongoUserIdByAuth0Id(auth0Id);
  if (existing) return existing;

  const saved = await upsertUserFromLogin({ sub: auth0Id } as Auth0User);
  return String(saved.id);
}
