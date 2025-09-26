
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusIcon, Registration } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, FilePenLine, Eye, Loader2, Clock } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const REGISTRATIONS_PER_PAGE = 6;

export default function MyRegistrationsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, userData } = useAuth();
    const [allMyRegistrations, setAllMyRegistrations] = useState<Registration[]>([]);
    const [allRenewals, setAllRenewals] = useState<Registration[]>([]);
    
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            const regQuery = query(
                collection(db, "registrations"), 
                where("ownerId", "==", user.uid)
            );
            
            const renewalQuery = query(
                collection(db, "licenseRenewals"),
                where("ownerId", "==", user.uid)
            );

            const unsubRegistrations = onSnapshot(regQuery, (querySnapshot) => {
                const userRegs: Registration[] = [];
                querySnapshot.forEach((doc) => {
                    userRegs.push({ id: doc.id, ...doc.data() } as Registration);
                });
                
                const unsubRenewals = onSnapshot(renewalQuery, (snapshot) => {
                    const renewalsData: Registration[] = [];
                    snapshot.forEach(doc => {
                        renewalsData.push({ id: doc.id, ...doc.data()} as Registration)
                    });
                    setAllRenewals(renewalsData);
                    
                    const combined = [...userRegs, ...renewalsData];
                    combined.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
                    setAllMyRegistrations(combined);
                    setIsLoading(false);
                });
                
            }, (error) => {
                console.error("Error fetching registrations: ", error);
                toast({
                    variant: "destructive",
                    title: "Failed to load registrations",
                    description: "There was an issue fetching your data. Please try again later."
                })
                setIsLoading(false);
            });

            return () => {
                unsubRegistrations();
            };
        }
    }, [user, toast]);
    
    const { activeAndPendingRegistrations, expiredRegistrations } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeAndPending = allMyRegistrations.filter(reg => {
            const expiryDate = new Date(reg.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            return reg.status !== 'Expired' && expiryDate >= today;
        });

        const expired = allMyRegistrations.filter(reg => {
            const expiryDate = new Date(reg.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            return reg.status === 'Expired' || expiryDate < today;
        });
        
        return { activeAndPendingRegistrations: activeAndPending, expiredRegistrations: expired };

    }, [allMyRegistrations]);

    const renderRegistrationCard = (reg: Registration, isExpired: boolean = false) => {
        const Icon = getStatusIcon(reg.status as Registration['status']);
        
        return (
            <Card key={reg.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge 
                                variant={reg.status === 'Pending' ? 'secondary' : 
                                    reg.status === 'Rejected' || reg.status === 'Expired' || isExpired ? 'destructive' : 
                                    'default'
                                } 
                                className="capitalize mb-2"
                            >
                            <Icon className="mr-1 h-3 w-3" />
                            {isExpired && reg.status !== 'Expired' ? t('Expired') : t(reg.status)}
                            </Badge>
                            <CardTitle className="text-lg">{reg.type === 'Vessel' ? reg.vesselName : reg.gearType}</CardTitle>
                            <CardDescription>ID: {reg.id}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                    <p><strong>{t("Registration Date:")}</strong> {reg.registrationDate}</p>
                    <p><strong>{t("Expiry Date:")}</strong> {reg.expiryDate}</p>
                </CardContent>
                <div className="p-6 pt-0 flex gap-2">
                    {isExpired ? (
                        <Button asChild variant="default" size="sm" className="flex-1">
                            <Link href={`/fisherfolk/renew/${reg.id}`}>
                                <RefreshCw className="mr-2 h-4 w-4" /> {t("Renew")}
                            </Link>
                        </Button>
                    ) : null}
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRegistration(reg)}>
                            <Eye className="mr-2 h-4 w-4" /> {t("Details")}
                        </Button>
                    </DialogTrigger>
                </div>
            </Card>
        )
    }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedRegistration(null)}>
        <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{t("My Registrations")}</h1>
            <p className="text-muted-foreground">
            {t("Here is a list of all your registered vessels and fishing gear.")}
            </p>
        </div>

        {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : allMyRegistrations.length === 0 ? (
            <Card>
            <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold">{t("No Registrations Found")}</h3>
                <p className="text-muted-foreground mt-1">{t("You have not registered any vessels or gear yet.")}</p>
            </CardContent>
            </Card>
        ) : (
            <div className="space-y-12">
                <div>
                     <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">{t("Active & Pending")}</h2>
                     {activeAndPendingRegistrations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeAndPendingRegistrations.map(reg => renderRegistrationCard(reg, false))}
                        </div>
                     ) : (
                        <p className="text-muted-foreground">{t("No active or pending registrations.")}</p>
                     )}
                </div>
                
                {expiredRegistrations.length > 0 && (
                    <div>
                        <Separator className="my-8" />
                        <h2 className="text-2xl font-bold font-headline tracking-tight mb-4">{t("Expired Registrations")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {expiredRegistrations.map(reg => renderRegistrationCard(reg, true))}
                        </div>
                    </div>
                )}
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
