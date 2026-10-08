import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export const metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <main className="space-y-6 p-6">
      <div className="space-y-1">
        <Typography variant="page-title">Orders</Typography>
        <Typography variant="muted">
          View and manage customer orders.
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            Order management will be added in a future lesson.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
