import { Typography } from "@/components/ui/typography";

import { OrdersApiTester } from "./orders-api-tester";

export const metadata = {
  title: "Orders API test",
};

export default function TestPage() {
  return (
    <main className="space-y-6 p-6">
      <div className="space-y-1">
        <Typography variant="page-title">Orders API test</Typography>
        <Typography variant="muted">
          Call the Express orders endpoints with the logged-in admin&apos;s
          Auth0 access token. If token errors appear, log out and log back in
          so Auth0 can issue a token for the Express API.
        </Typography>
      </div>
      <OrdersApiTester />
    </main>
  );
}
