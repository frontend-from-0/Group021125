import { auth0 } from '@/lib/auth0';

export const metadata = {
  title: 'Random Quotes App',
};

export default async function UserLayout({ children }) {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div>
        <p>Please log in to continue</p>
        <a href="/auth/login">Log in</a>
      </div>
    )
  }
  return <>{children}</>;
}
