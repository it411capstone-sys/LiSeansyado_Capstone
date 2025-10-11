
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Bug, Wand2, LogOut, Replace } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsPage() {
    const { t } = useTranslation();
    const { user, userData, loading } = useAuth();
    
    if (loading) {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

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
                    <Input id="name" defaultValue={userData?.displayName || ''} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="designation">{t("Designation")}</Label>
                    <Input id="designation" defaultValue={(userData as any)?.role === 'mao' ? "Municipal Administrator" : "Treasury Officer"} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="municipality">{t("Assigned Municipality")}</Label>
                    <Input id="municipality" defaultValue="Cantilan, Surigao del Sur" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t("Contact Email")}</Label>
                    <Input id="email" type="email" defaultValue={userData?.email || ''} />
                </div>
                 <div className="space-y-2">
                    <Label>{t("Current Role")}</Label>
                    <p className="text-sm text-muted-foreground font-mono p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{(userData as any)?.role === 'mao' ? t("Super Admin (Full Access)") : t("MTO (Payments Only)")}</p>
                </div>
            </div>
            <Button>{t("Edit Details")}</Button>
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
                <CardTitle>{t("Session Management")}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="destructive" asChild>
                    <Link href="/">
                        <LogOut className="mr-2"/>{t("Logout")}
                    </Link>
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
