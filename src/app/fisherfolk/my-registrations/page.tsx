
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registrations, getStatusIcon, Registration } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, FilePenLine, Eye } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function MyRegistrationsPage() {
    const { t } = useTranslation();
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const myRegistrations = registrations.filter(r => r.ownerName === 'Juan Dela Cruz');

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedRegistration(null)}>
        <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{t("My Registrations")}</h1>
            <p className="text-muted-foreground">
            {t("Here is a list of all your registered vessels and fishing gear.")}
            </p>
        </div>

        {myRegistrations.length === 0 ? (
            <Card>
            <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold">{t("No Registrations Found")}</h3>
                <p className="text-muted-foreground mt-1">{t("You have not registered any vessels or gear yet.")}</p>
                <Button asChild className="mt-4">
                <Link href="/fisherfolk/register">{t("Register Now")}</Link>
                </Button>
            </CardContent>
            </Card>
        ) : (
            <div className="space-y-4">
            {myRegistrations.map((reg) => {
                const Icon = getStatusIcon(reg.status);
                return (
                <Card key={reg.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="p-6 md:col-span-3">
                        <div className="flex justify-between items-start">
                        <div>
                            <Badge variant={reg.status === 'Pending' ? 'secondary' : reg.status === 'Rejected' || reg.status === 'Expired' ? 'destructive' : 'default'} className="capitalize mb-2">
                            <Icon className="mr-1 h-3 w-3" />
                            {t(reg.status)}
                            </Badge>
                            <CardTitle className="mb-1">{reg.type === 'Vessel' ? reg.vesselName : reg.gearType}</CardTitle>
                            <CardDescription>ID: {reg.id}</CardDescription>
                        </div>
                        </div>

                        <div className="mt-4 text-sm text-muted-foreground">
                        <p><strong>{t("Registration Date:")}</strong> {reg.registrationDate}</p>
                        <p><strong>{t("Expiry Date:")}</strong> {reg.expiryDate}</p>
                        </div>

                        <div className="mt-6 flex gap-2">
                        <Button variant="default">
                            <RefreshCw className="mr-2 h-4 w-4" /> {t("Renew")}
                        </Button>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedRegistration(reg)}>
                                <Eye className="mr-2 h-4 w-4" /> {t("Show Details")}
                            </Button>
                        </DialogTrigger>
                        </div>
                    </div>
                    </div>
                </Card>
                )
            })}
            </div>
        )}
        </div>
        {selectedRegistration && (
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t("Registration Details")}</DialogTitle>
                    <DialogDescription>
                        {t("Summary for registration ID")}: {selectedRegistration.id}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                     <div>
                        <h4 className="font-medium text-sm mb-2">{t("Owner Information")}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                             <p><strong>{t("Name")}:</strong> {selectedRegistration.ownerName}</p>
                             <p><strong>{t("Address")}:</strong> {selectedRegistration.address}</p>
                             <p><strong>{t("Contact")}:</strong> {selectedRegistration.contact}</p>
                        </div>
                    </div>
                    <Separator />
                    {selectedRegistration.type === 'Vessel' ? (
                        <div>
                            <h4 className="font-medium text-sm mb-2">{t("Vessel Details")}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRegistration.vesselDetails}</p>
                        </div>
                    ) : (
                        <div>
                            <h4 className="font-medium text-sm mb-2">{t("Fishing Gear Details")}</h4>
                             <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRegistration.fishingGearDetails}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        )}
    </Dialog>
  );
}
