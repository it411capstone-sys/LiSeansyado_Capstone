
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/contexts/language-context";

const translationKeys = [
    "Account Settings",
    "Profile Info",
    "Manage your personal information.",
    "Name",
    "Email",
    "Update Profile",
    "Security & Access",
    "Update your password for account security.",
    "Change Password",
    "Logout & Switch Account",
    "Securely log out or switch to another account.",
    "Logout",
    "Switch Account"
];

export default function FisherfolkSettingsPage() {
    const { t } = useTranslation(translationKeys);

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Account Settings")}</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Profile Info")}</CardTitle>
            <CardDescription>{t("Manage your personal information.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">{t("Name")}</Label>
                <Input id="name" defaultValue="Juan Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email")}</Label>
                <Input id="email" type="email" defaultValue="juan.delacruz@email.com" />
              </div>
              <Button>{t("Update Profile")}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Security & Access")}</CardTitle>
            <CardDescription>{t("Update your password for account security.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>{t("Change Password")}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Logout & Switch Account")}</CardTitle>
            <CardDescription>{t("Securely log out or switch to another account.")}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="destructive">{t("Logout")}</Button>
            <Button variant="outline">{t("Switch Account")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
