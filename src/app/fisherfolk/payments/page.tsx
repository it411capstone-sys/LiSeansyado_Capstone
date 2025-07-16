import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FisherfolkPaymentsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Settle your regulatory fees for licenses and other services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Balance</CardTitle>
          <CardDescription>You have one pending payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">New Registration Fee</p>
                    <p className="text-sm text-muted-foreground">For: REG-003 (La Niña)</p>
                </div>
                <p className="text-2xl font-bold">₱150.00</p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <p className="text-sm text-muted-foreground">Pay with</p>
              <img src="https://placehold.co/100x40.png" data-ai-hint="gcash logo" alt="GCash Logo" className="h-8"/>
            </div>
             <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">Pay with GCash</Button>
          </div>
        </CardContent>
      </Card>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No payment history available.</p>
        </CardContent>
      </Card>
    </div>
  );
}
