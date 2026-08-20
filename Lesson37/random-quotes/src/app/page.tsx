import { getQuotes } from '@/actions/quotes';
import { auth0 } from '@/lib/auth0';
import { HomeQuotes } from '@/components/HomeQuotes';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [quotes, session] = await Promise.all([
    getQuotes(),
    auth0.getSession(),
  ]);

  return (
    <HomeQuotes initialQuotes={quotes} userId={session?.user?.sub ?? null} />
  );
}
