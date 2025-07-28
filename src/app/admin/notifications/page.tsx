
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, File, Users, Clock, MessageSquareWarning } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/contexts/language-context";

const notificationCategories = [
  { title: "New Registration", count: 2, icon: File },
  { title: "Pending Approvals", count: 5, icon: Clock },
  { title: "Inspection Reports", count: 3, icon: Check },
  { title: "Scheduled Today", count: 1, icon: Users },
  { title: "New Feedback", count: 4, icon: MessageSquareWarning },
  { title: "Monthly Report Due", count: 1, icon: Bell },
];

const notificationSummaries = [
    { user: "Crisostomo Ibarra", action: "submitted a new registration for 'La Niña'." },
    { user: "Admin", action: "approved the registration for 'Bantay Dagat 1'." },
    { user: "Jane Smith", action: "uploaded an inspection report for 'Freedom'." },
    { user: "Juan Dela Cruz", action: "sent new feedback regarding the mobile app." },
    { user: "Emilio Aguinaldo", action: "submitted a new registration for 'Magdalo'." },
    { user: "System", action: "Your monthly report for June is due in 3 days." },
    { user: "Maria Clara", action: "renewed their license for 'Ocean's Pride'." },
    { user: "John Doe", action: "scheduled an inspection for 'La Niña'." },
    { user: "Andres Bonifacio", action: "license for 'Katipunan' has expired." },
    { user: "Gabriela Silang", action: "registration for 'Freedom' was rejected." },
];

export default function AdminNotificationsPage() {
    const { t } = useTranslation();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
       <Card>
        <CardHeader>
          <CardTitle>{t("Notification Center")}</CardTitle>
          <CardDescription>{t("Recent activities and alerts across the system.")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {notificationCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <Card key={cat.title} className="flex flex-col justify-between p-4 hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-start justify-between">
                                <Icon className="h-6 w-6 text-muted-foreground" />
                                <p className="text-2xl font-bold">{cat.count}</p>
                            </div>
                            <p className="text-sm font-medium mt-2">{t(cat.title)}</p>
                        </Card>
                    )
                })}
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{t("Recent Activity")}</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">{t("Mark All as Read")}</Button>
                        <Button variant="ghost" size="sm">{t("Clear All")}</Button>
                    </div>
                </div>
                 <div className="rounded-md border">
                    {notificationSummaries.map((note, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border-b last:border-b-0">
                           <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${note.user}`} alt={note.user} />
                                <AvatarFallback>{note.user.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{note.user}</span> {t(note.action)}
                           </p>
                        </div>
                    ))}
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
