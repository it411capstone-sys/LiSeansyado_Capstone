
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";

const translationKeys = [
    "Payments",
    "Settle your regulatory fees for licenses and other services.",
    "Outstanding Balance",
    "You have one pending payment.",
    "New Registration Fee",
    "For: REG-003 (La Niña)",
    "Pay with",
    "Pay with GCash",
    "Payment History",
    "No payment history available."
];

export default function FisherfolkPaymentsPage() {
    const { t } = useTranslation(translationKeys);
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Payments")}</h1>
        <p className="text-muted-foreground">
          {t("Settle your regulatory fees for licenses and other services.")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Outstanding Balance")}</CardTitle>
          <CardDescription>{t("You have one pending payment.")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{t("New Registration Fee")}</p>
                    <p className="text-sm text-muted-foreground">{t("For: REG-003 (La Niña)")}</p>
                </div>
                <p className="text-2xl font-bold">₱150.00</p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <p className="text-sm text-muted-foreground">{t("Pay with")}</p>
              <img src="https://placehold.co/100x40.png" data-ai-hint="gcash logo" alt="GCash Logo" className="h-8"/>
            </div>
             <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">{t("Pay with GCash")}</Button>
          </div>
        </CardContent>
      </Card>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("Payment History")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{t("No payment history available.")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
