
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BellRing, CalendarCheck, Wallet } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";

export default function FisherfolkNotificationsPage() {
    const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Notifications")}</h1>
        <p className="text-muted-foreground">
          {t("Important updates and reminders about your registrations.")}
        </p>
      </div>

      <div className="space-y-4">
        <Alert className="border-accent/50">
            <BellRing className="h-4 w-4 text-accent" />
            <AlertTitle>{t("License Expiring Soon")}</AlertTitle>
            <AlertDescription>
                {t("Your license for 'Bantay Dagat 1' (REG-001) will expire in 30 days. Please renew to avoid penalties.")}
            </AlertDescription>
        </Alert>
        <Alert>
            <CalendarCheck className="h-4 w-4" />
            <AlertTitle>{t("Inspection Scheduled")}</AlertTitle>
            <AlertDescription>
                {t("An inspection for 'La Niña' (REG-003) is scheduled for July 25, 2024.")}
            </AlertDescription>
        </Alert>
        <Alert>
            <Wallet className="h-4 w-4" />
            <AlertTitle>{t("Payment Due")}</AlertTitle>
            <AlertDescription>
                {t("A payment for your new registration is due. Please visit the payments page.")}
            </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
