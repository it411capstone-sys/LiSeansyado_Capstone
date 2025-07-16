import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Notifications</h2>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>Recent activities and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">All Caught Up!</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
