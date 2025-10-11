
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Bug, Wand2, LogOut, Replace, Loader2 } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { doc, getDoc, getDocs, collection, enableNetwork, disableNetwork } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function AdminSettingsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, userData, loading } = useAuth();
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(new Date());

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await disableNetwork(db);
            await enableNetwork(db);
            setLastSynced(new Date());
            toast({ title: "Sync Complete", description: "Your local data has been synchronized with the cloud." });
        } catch (error) {
            toast({ variant: "destructive", title: "Sync Failed", description: "Could not sync with the cloud. Please check your connection." });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            const registrationsCollection = collection(db, "registrations");
            const paymentsCollection = collection(db, "payments");
            const feedbacksCollection = collection(db, "feedbacks");

            const [registrationsSnapshot, paymentsSnapshot, feedbacksSnapshot] = await Promise.all([
                getDocs(registrationsCollection),
                getDocs(paymentsCollection),
                getDocs(feedbacksCollection),
            ]);

            const dataToExport = {
                registrations: registrationsSnapshot.docs.map(doc => doc.data()),
                payments: paymentsSnapshot.docs.map(doc => doc.data()),
                feedbacks: feedbacksSnapshot.docs.map(doc => doc.data()),
            };

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(dataToExport.registrations, null, 2)));
            XLSX.utils.book_append_sheet(wb, ws, "Registrations");
            
            const paymentsWs = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(dataToExport.payments, null, 2)));
            XLSX.utils.book_append_sheet(wb, paymentsWs, "Payments");

            const feedbacksWs = XLSX.utils.json_to_sheet(JSON.parse(JSON.stringify(dataToExport.feedbacks, null, 2)));
            XLSX.utils.book_append_sheet(wb, feedbacksWs, "Feedbacks");

            XLSX.writeFile(wb, `liseansyado_backup_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast({ title: "Backup Successful", description: "A backup file has been downloaded." });

        } catch (error) {
            toast({ variant: "destructive", title: "Backup Failed", description: "Could not export data." });
        } finally {
            setIsBackingUp(false);
        }
    };
    
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
                    <Label>{t("Name")}</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{userData?.displayName || ''}</p>
                </div>
                 <div className="space-y-2">
                    <Label>{t("Designation")}</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{(userData as any)?.role === 'mao' ? "Municipal Administrator" : "Treasury Officer"}</p>
                </div>
                 <div className="space-y-2">
                    <Label>{t("Assigned Municipality")}</Label>
                     <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md mt-1 h-10 flex items-center">Cantilan, Surigao del Sur</p>
                </div>
                <div className="space-y-2">
                    <Label>{t("Contact Email")}</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{userData?.email || ''}</p>
                </div>
                 <div className="space-y-2">
                    <Label>{t("Current Role")}</Label>
                    <p className="text-sm text-muted-foreground font-mono p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{(userData as any)?.role === 'mao' ? t("Super Admin (Full Access)") : t("MTO (Payments Only)")}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        {(userData as any)?.role === 'mao' && (
            <>
                <Card>
                <CardHeader>
                    <CardTitle>{t("Database Sync")}</CardTitle>
                    <CardDescription>{t("Manage cloud synchronization and backups.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">{t("Cloud Sync")}</p>
                            <p className="text-sm text-muted-foreground">
                                {t("Last synced:")} {lastSynced ? formatDistanceToNow(lastSynced, { addSuffix: true }) : 'Never'}
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
                            {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isSyncing ? t("Syncing...") : t("Sync to Cloud")}
                        </Button>
                    </div>
                    <Button onClick={handleBackup} disabled={isBackingUp}>
                        {isBackingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isBackingUp ? t("Backing up...") : t("Backup Now")}
                    </Button>
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
            </>
        )}
      </div>
    </div>
  );
}
