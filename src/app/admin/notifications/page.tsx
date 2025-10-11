
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, File, Users, Clock, MessageSquareWarning, FileText, CalendarCheck, Wallet, Award, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { AdminNotification } from "@/lib/types";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy, writeBatch, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const categoryIcons = {
    Registration: FileText,
    Verification: ShieldCheck,
    Inspection: CalendarCheck,
    Payment: Wallet,
    License: Award,
    Feedback: MessageSquareWarning,
};

export default function AdminNotificationsPage() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [filter, setFilter] = useState<string>('All');

    useEffect(() => {
        const q = query(collection(db, "adminNotifications"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs: AdminNotification[] = [];
            snapshot.forEach(doc => {
                const data = { id: doc.id, ...doc.data() } as AdminNotification;
                notifs.push(data);
            });
            setNotifications(notifs);
        });
        return () => unsubscribe();
    }, []);

    const markAllAsRead = async () => {
        const unreadNotifs = notifications.filter(n => !n.isRead);
        if (unreadNotifs.length === 0) return;

        const batch = writeBatch(db);
        unreadNotifs.forEach(notif => {
            const notifRef = doc(db, "adminNotifications", notif.id);
            batch.update(notifRef, { isRead: true });
        });
        await batch.commit();
    };

    const markOneAsRead = async (id: string) => {
        const notifRef = doc(db, "adminNotifications", id);
        await updateDoc(notifRef, { isRead: true });
    };

    const filteredNotifications = notifications.filter(n => filter === 'All' || n.category === filter);
    const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("Notification Center")}</CardTitle>
              <CardDescription>{t("Recent activities and alerts across the system.")}</CardDescription>
            </div>
             <Button onClick={markAllAsRead} disabled={!hasUnread}>
                {t("Mark All as Read")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{t("Recent Activity")}</h3>
                </div>
                 <div className="rounded-md border max-h-[75vh] overflow-y-auto">
                    {filteredNotifications.length > 0 ? filteredNotifications.map(notif => {
                        const Icon = categoryIcons[notif.category] || Bell;
                        return (
                            <Alert 
                                key={notif.id} 
                                className={cn("border-l-4 rounded-none border-x-0 border-t-0 last:border-b-0", !notif.isRead ? `border-l-primary` : `border-l-transparent`)}
                                onClick={() => !notif.isRead && markOneAsRead(notif.id)}
                            >
                                <Icon className="h-5 w-5" />
                                <AlertTitle>{t(notif.title)}</AlertTitle>
                                <AlertDescription className="flex justify-between items-center">
                                    <Link href={notif.link} className="hover:underline">
                                        <p>{notif.message}</p>
                                    </Link>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(notif.date), { addSuffix: true })}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        )
                    }) : (
                        <div className="text-center p-8 text-muted-foreground">
                            <p>No notifications for this category.</p>
                        </div>
                    )}
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
