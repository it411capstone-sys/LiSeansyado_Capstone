
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BellRing, CalendarCheck, Wallet } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Notification } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FisherfolkNotificationsPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if(user) {
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
            notifications.map(notification => (
                 <Alert key={notification.id} className="border-accent/50">
                    <BellRing className="h-4 w-4 text-accent" />
                    <AlertTitle>{t(notification.title)}</AlertTitle>
                    <AlertDescription>
                        {t(notification.message)}
                    </AlertDescription>
                </Alert>
            ))
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
