
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";

export default function AdminLicensesPage() {
    const { t } = useTranslation();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
            <CardHeader>
                <CardTitle>{t("Licenses")}</CardTitle>
                <CardDescription>{t("Manage and issue licenses for approved registrations.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t("Licenses page content will go here.")}</p>
            </CardContent>
        </Card>
    </div>
  );
}
