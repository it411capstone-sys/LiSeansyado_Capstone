
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BellRing, CheckCircle, Info, XCircle } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Notification } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'Success':
            return CheckCircle;
        case 'Error':
            return XCircle;
        case 'Alert':
            return BellRing;
        case 'Info':
        default:
            return Info;
    }
};

export default function FisherfolkNotificationsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if(user && user.email) {
            const q = query(
                collection(db, "notifications"), 
                where("userId", "==", user.email),
                orderBy("date", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userNotifications: Notification[] = [];
                querySnapshot.forEach((doc) => {
                    userNotifications.push({ id: doc.id, ...doc.data() } as Notification);
                });
                setNotifications(userNotifications);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleMarkAsRead = async (id: string) => {
        const notifRef = doc(db, "notifications", id);
        await updateDoc(notifRef, { isRead: true });
    };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Notifications")}</h1>
        <p className="text-muted-foreground">
          {t("Important updates and reminders about your registrations.")}
        </p>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
            notifications.map(notification => {
                const Icon = getNotificationIcon(notification.type);
                return (
                 <Alert 
                    key={notification.id} 
                    className={cn(
                        !notification.isRead && "bg-primary/5 border-primary/20",
                        "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                 >
                    <Icon className={cn("h-4 w-4", !notification.isRead ? "text-primary" : "text-muted-foreground")} />
                    <AlertTitle className={cn(!notification.isRead && "font-bold text-primary")}>
                        {t(notification.title)}
                    </AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">
                        {t(notification.message)}
                    </AlertDescription>
                </Alert>
            )})
        ) : (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{t("You have no new notifications.")}</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
