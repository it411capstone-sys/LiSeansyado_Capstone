
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";

export default function AdminVerificationPage() {
    const { t } = useTranslation();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
            <CardHeader>
                <CardTitle>{t("Verification")}</CardTitle>
                <CardDescription>{t("Verify fisherfolk and vessel/gear registrations.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t("Verification page content will go here.")}</p>
            </CardContent>
        </Card>
    </div>
  );
}
