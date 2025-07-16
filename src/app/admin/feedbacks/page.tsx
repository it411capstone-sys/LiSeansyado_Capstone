import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFeedbacksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Feedbacks</h2>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Feedback Inbox</CardTitle>
          <CardDescription>Review feedback, suggestions, and complaints from fisherfolk.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No Feedback Yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                New submissions from fisherfolk will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
