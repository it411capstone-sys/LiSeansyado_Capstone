
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/lib/types";
import { LicenseTemplate } from "@/components/admin/license-template";
import { Badge } from "@/components/ui/badge";
import { Award, Eye, Printer } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function FisherfolkLicensesPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [licenses, setLicenses] = useState<License[]>([]);
    const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "licenses"), where("ownerEmail", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const licensesData: License[] = [];
            snapshot.forEach((doc) => {
                licensesData.push({ id: doc.id, ...doc.data() } as License);
            });
            setLicenses(licensesData.sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()));
        });
        return () => unsubscribe();
    }, [user]);

    const getStatusBadgeVariant = (status: License['status']) => {
        switch(status) {
            case 'Active': return 'default';
            case 'Expired': return 'destructive';
            case 'Revoked': return 'destructive';
            default: return 'outline';
        }
    };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedLicense(null)}>
        <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{t("My Licenses")}</h1>
            <p className="text-muted-foreground">
            {t("View and manage your official fishing licenses.")}
            </p>
        </div>

        {licenses.length === 0 ? (
            <Card>
            <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold">{t("No Licenses Found")}</h3>
                <p className="text-muted-foreground mt-1">{t("You do not have any active licenses yet.")}</p>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {licenses.map((license) => (
                     <Card key={license.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                     <Badge variant={getStatusBadgeVariant(license.status)} className="capitalize mb-2">
                                        <Award className="mr-1 h-3 w-3" />
                                        {t(license.status)}
                                    </Badge>
                                    <CardTitle className="text-lg">{t(license.type)}</CardTitle>
                                    <CardDescription>ID: {license.id}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                             <p><strong>{t("Issue Date:")}</strong> {license.issueDate}</p>
                             <p><strong>{t("Expiry Date:")}</strong> {license.expiryDate}</p>
                        </CardContent>
                        <div className="p-6 pt-0 flex gap-2">
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedLicense(license)}>
                                    <Eye className="mr-2 h-4 w-4" /> {t("View License")}
                                </Button>
                            </DialogTrigger>
                        </div>
                    </Card>
                ))}
            </div>
        )}
        </div>
        {selectedLicense && (
            <DialogContent className="max-w-4xl no-print">
                <DialogHeader>
                    <DialogTitle>{t("License Details")}</DialogTitle>
                    <DialogDescription>
                        {t("License ID")}: {selectedLicense.id}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                    <div className="printable-area p-1">
                        <LicenseTemplate license={selectedLicense} />
                    </div>
                </ScrollArea>
            </DialogContent>
        )}
    </Dialog>
  );
}
