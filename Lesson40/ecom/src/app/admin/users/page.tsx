import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export const metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <main className="space-y-6 p-6">
      <div className="space-y-1">
        <Typography variant="page-title">Users</Typography>
        <Typography variant="muted">
          Manage store customers and admin accounts.
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            User management will be added in a future lesson.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
