
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Bug, Wand2, LogOut, Replace } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";

export default function AdminSettingsPage() {
    const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">{t("Account Settings")}</h2>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Profile Info")}</CardTitle>
            <CardDescription>{t("Manage your personal and municipal information.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t("Name")}</Label>
                    <Input id="name" defaultValue="Admin User" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="designation">{t("Designation")}</Label>
                    <Input id="designation" defaultValue="Municipal Administrator" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="municipality">{t("Assigned Municipality")}</Label>
                    <Input id="municipality" defaultValue="Cantilan, Surigao del Sur" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t("Contact Email")}</Label>
                    <Input id="email" type="email" defaultValue="mao.liseansyado@gmail.com" />
                </div>
            </div>
            <Button>{t("Edit Details")}</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("Security & Access")}</CardTitle>
            <CardDescription>{t("Manage password, two-factor authentication, and roles.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button>{t("Change Password")}</Button>
            <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">{t("Two-Factor Authentication")}</Label>
            </div>
            <div>
                <Label>{t("Current Role")}</Label>
                <p className="text-sm text-muted-foreground font-mono p-2 bg-muted rounded-md mt-1">{t("Super Admin (Full Access)")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Database Sync")}</CardTitle>
            <CardDescription>{t("Manage cloud synchronization and backups.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">{t("Cloud Sync")}</p>
                    <p className="text-sm text-muted-foreground">{t("Last synced: Just now")}</p>
                </div>
                <Button variant="outline">{t("Sync to Cloud")}</Button>
             </div>
             <Button>{t("Backup Now")}</Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>{t("Audit Log Access")}</CardTitle>
            <CardDescription>{t("View login history and a record of major actions in the system.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">{t("Access Full Audit Log")}</Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t("System Help & Feedback")}</CardTitle>
                <CardDescription>{t("Get help or report issues.")}</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline"><HelpCircle className="mr-2"/>{t("Access Training Manual")}</Button>
                <Button variant="outline"><Bug className="mr-2"/>{t("Report a Bug")}</Button>
                <Button variant="outline"><Wand2 className="mr-2"/>{t("Request a Feature")}</Button>
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
