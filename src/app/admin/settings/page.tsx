
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
import { doc, getDoc, getDocs, collection, enableNetwork, disableNetwork, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
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
            const collectionsToBackup = [
                "registrations",
                "licenseRenewals",
                "payments",
                "feedbacks",
                "inspections",
                "licenses",
                "verificationSubmissions",
                "fisherfolk",
                "admins"
            ];
            
            const backupData: Record<string, any[]> = {};

            for (const collectionName of collectionsToBackup) {
                const snapshot = await getDocs(query(collection(db, collectionName)));
                backupData[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            
            const jsonString = JSON.stringify(backupData, (key, value) => {
                // Firestore Timestamps need special handling for JSON.stringify
                if (value && typeof value === 'object' && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')) {
                    return new Date(value.seconds * 1000).toISOString();
                }
                return value;
            }, 2);

            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `liseansyado_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            toast({ title: "Backup Successful", description: "A JSON backup file has been downloaded." });

        } catch (error) {
            console.error("Backup error:", error);
            toast({ variant: "destructive", title: "Backup Failed", description: "Could not export data." });
        } finally {
            setIsBackingUp(false);
        }
    };
    
    const getDesignation = (role: string) => {
        switch(role) {
            case 'mao': return "Municipal Administrator";
            case 'mto': return "Treasury Officer";
            case 'mao_inspector': return "Inspector";
            default: return "Unknown";
        }
    }

    const getRoleDescription = (role: string) => {
        switch(role) {
            case 'mao': return t("Super Admin (Full Access)");
            case 'mto': return t("MTO (Payments Only)");
            case 'mao_inspector': return t("MAO Inspector (Inspection Only)");
            default: return "Unknown Role";
        }
    }
    
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
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{getDesignation((userData as any)?.role)}</p>
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
                    <p className="text-sm text-muted-foreground font-mono p-2 bg-muted rounded-md mt-1 h-10 flex items-center">{getRoleDescription((userData as any)?.role)}</p>
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
