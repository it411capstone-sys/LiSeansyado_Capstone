
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registrations, getStatusIcon, Registration } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, FilePenLine, Eye, Loader2 } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const REGISTRATIONS_PER_PAGE = 6;

export default function MyRegistrationsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, userData } = useAuth();
    const [allMyRegistrations, setAllMyRegistrations] = useState<Registration[]>([]);
    const [visibleRegistrations, setVisibleRegistrations] = useState<Registration[]>([]);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (userData) {
            const userRegs = registrations.filter(r => r.ownerName === userData.displayName);
            setAllMyRegistrations(userRegs);
            setVisibleRegistrations(userRegs.slice(0, REGISTRATIONS_PER_PAGE));
            setHasMore(userRegs.length > REGISTRATIONS_PER_PAGE);
        }
    }, [userData]);
    
    const loadMoreRegistrations = () => {
        setIsLoading(true);
        setTimeout(() => {
            const currentLength = visibleRegistrations.length;
            const nextSlice = allMyRegistrations.slice(currentLength, currentLength + REGISTRATIONS_PER_PAGE);
            setVisibleRegistrations(prev => [...prev, ...nextSlice]);
            if (currentLength + REGISTRATIONS_PER_PAGE >= allMyRegistrations.length) {
                setHasMore(false);
            }
            setIsLoading(false);
        }, 500); // Simulate network delay
    };

    const handleRenew = (registrationId: string) => {
        const currentYear = new Date().getFullYear();
        const newExpiryDate = new Date(currentYear, 11, 31).toISOString().split('T')[0];
        
        const updateInPlace = (regs: Registration[]) => 
            regs.map(reg => {
                if (reg.id === registrationId) {
                    const newHistory = [...reg.history, {
                        action: 'Renewed',
                        date: new Date().toISOString().split('T')[0],
                        actor: reg.ownerName
                    }];
                    return { ...reg, status: 'Approved' as 'Approved', expiryDate: newExpiryDate, history: newHistory };
                }
                return reg;
            });
        
        setAllMyRegistrations(updateInPlace(allMyRegistrations));
        setVisibleRegistrations(updateInPlace(visibleRegistrations));

        // This is a mock update, in a real scenario you'd update the master data source
        const globalIndex = registrations.findIndex(reg => reg.id === registrationId);
        if (globalIndex > -1) {
            const regToUpdate = registrations[globalIndex];
            const newHistory = [...regToUpdate.history, {
                    action: 'Renewed',
                    date: new Date().toISOString().split('T')[0],
                    actor: regToUpdate.ownerName
                }];
            registrations[globalIndex] = { ...regToUpdate, status: 'Approved', expiryDate: newExpiryDate, history: newHistory };
        }

        toast({
            title: "License Renewed",
            description: `Registration ${registrationId} has been renewed until ${newExpiryDate}.`,
        });
    };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedRegistration(null)}>
        <div className="container mx-auto p-4 md:p-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">{t("My Registrations")}</h1>
            <p className="text-muted-foreground">
            {t("Here is a list of all your registered vessels and fishing gear.")}
            </p>
        </div>

        {allMyRegistrations.length === 0 ? (
            <Card>
            <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold">{t("No Registrations Found")}</h3>
                <p className="text-muted-foreground mt-1">{t("You have not registered any vessels or gear yet.")}</p>
                {userData?.isVerified ? (
                    <Button asChild className="mt-4">
                        <Link href="/fisherfolk/register">{t("Register Now")}</Link>
                    </Button>
                ) : (
                    <Button asChild className="mt-4">
                        <Link href="/fisherfolk/home">{t("Verify Account")}</Link>
                    </Button>
                )}
            </CardContent>
            </Card>
        ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRegistrations.map((reg) => {
                const Icon = getStatusIcon(reg.status);
                return (
                <Card key={reg.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant={reg.status === 'Pending' ? 'secondary' : reg.status === 'Rejected' || reg.status === 'Expired' ? 'destructive' : 'default'} className="capitalize mb-2">
                                <Icon className="mr-1 h-3 w-3" />
                                {t(reg.status)}
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
                        {reg.status !== 'Pending' && (
                            <Button variant="default" size="sm" className="flex-1" onClick={() => handleRenew(reg.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" /> {t("Renew")}
                            </Button>
                        )}
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRegistration(reg)}>
                                <Eye className="mr-2 h-4 w-4" /> {t("Details")}
                            </Button>
                        </DialogTrigger>
                    </div>
                </Card>
                )
            })}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-8">
                    <Button onClick={loadMoreRegistrations} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("Load More")}
                    </Button>
                </div>
            )}
            </>
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
