'use client';

import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function UserSettingPage() {
  const { user, error, isLoading } = useUser();

  if (error) throw Error('Failed loading user');

  if (isLoading) {
    return <p>Loading....</p>
  }


  return (
    <div>
      <h1>Setting page</h1>
      <div>
        {user?.picture ? (
          <Image
            src={user?.picture}
            alt={`A profile picture of ${user?.email ?? 'user'}`}
            width='50'
            height='50'
          />
        ) : (
          <></>
        )}
      </div>
      <span>Name: {user?.name}</span>
      <span>Email: {user?.email}</span>
    </div>
  );
}
