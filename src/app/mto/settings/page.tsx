
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Bug, Wand2, LogOut, Replace, Wallet } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";

export default function MtoSettingsPage() {
    const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{t("MTO Account Settings")}</h2>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Profile Info")}</CardTitle>
            <CardDescription>{t("Manage your personal and office information.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t("Name")}</Label>
                    <Input id="name" defaultValue="MTO Admin" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="designation">{t("Designation")}</Label>
                    <Input id="designation" defaultValue="Municipal Treasurer Officer" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="municipality">{t("Assigned Municipality")}</Label>
                    <Input id="municipality" defaultValue="Cantilan, Surigao del Sur" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t("Contact Email")}</Label>
                    <Input id="email" type="email" defaultValue="mto@liseansyado.gov.ph" />
                </div>
            </div>
            <Button>{t("Edit Details")}</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("Security & Access")}</CardTitle>
            <CardDescription>{t("Manage password and two-factor authentication.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button>{t("Change Password")}</Button>
            <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">{t("Two-Factor Authentication")}</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t("Session Management")}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="destructive"><LogOut className="mr-2"/>{t("Logout")}</Button>
                <Button variant="outline"><Replace className="mr-2"/>{t("Switch Account")}</Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
