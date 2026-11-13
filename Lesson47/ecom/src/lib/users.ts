import type { User as Auth0User } from '@auth0/nextjs-auth0/types';

import { db } from '@/prisma/db';

function optionalText(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function namesFromProfile(user: Auth0User): {
  firstName: string | null;
  lastName: string | null;
} {
  const firstName = optionalText(user.given_name);
  const lastName = optionalText(user.family_name);

  if (firstName || lastName) {
    return { firstName, lastName };
  }

  const name = optionalText(user.name);
  if (!name) {
    return { firstName: null, lastName: null };
  }

  const space = name.indexOf(' ');
  if (space === -1) {
    return { firstName: name, lastName: null };
  }

  return {
    firstName: name.slice(0, space),
    lastName: optionalText(name.slice(space + 1)),
  };
}

export async function findMongoUserIdByAuth0Id(auth0Id: string): Promise<string | null> {
  const stored = await db.orm.users.where({ auth0_id: auth0Id }).first();
  if (!stored) return null;
  return String(stored._id);
}

export async function upsertUserFromLogin(user: Auth0User) {
  const auth0Id = user.sub.trim();
  const email = user.email?.trim();

  if (!auth0Id) {
    throw new Error('Auth0 login is missing a user id, so the user cannot be stored');
  }

  if (!email) {
    throw new Error('Auth0 login is missing an email, so the user cannot be stored');
  }

  const { firstName, lastName } = namesFromProfile(user);
  const now = new Date();
  const profile = {
    email,
    firstName,
    lastName,
    profilePictureUrl: optionalText(user.picture),
  };

  const saved = await db.orm.users.where({ auth0_id: auth0Id }).upsert({
    create: {
      auth0_id: auth0Id,
      ...profile,
      createdAt: now,
      updatedAt: now,
    },
    update: {
      ...profile,
      updatedAt: now,
    },
  });

  if (!saved) {
    throw new Error(`Upsert returned no user for ${auth0Id}`);
  }

  return saved;
}
