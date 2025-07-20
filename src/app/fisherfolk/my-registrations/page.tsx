
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registrations, getStatusIcon } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QrCode, RefreshCw, FilePenLine } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";

const translationKeys = [
    "My Registrations",
    "Here is a list of all your registered vessels and fishing gear.",
    "No Registrations Found",
    "You have not registered any vessels or gear yet.",
    "Register Now",
    "Approved",
    "Pending",
    "Rejected",
    "Expired",
    "Registration Date:",
    "Expiry Date:",
    "Renew",
    "Update Details",
    "Scan QR Code"
];

export default function MyRegistrationsPage() {
    const { t } = useTranslation(translationKeys);
  const myRegistrations = registrations.filter(r => r.ownerName === 'Juan Dela Cruz');

  return (
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
                  <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant={reg.status === 'Pending' ? 'secondary' : reg.status === 'Rejected' || reg.status === 'Expired' ? 'destructive' : 'default'} className="capitalize mb-2">
                          <Icon className="mr-1 h-3 w-3" />
                          {t(reg.status)}
                        </Badge>
                        <CardTitle className="mb-1">{reg.vesselName}</CardTitle>
                        <CardDescription>{reg.gearType} | ID: {reg.id}</CardDescription>
                      </div>
                       <div className="hidden md:block">
                            <Image src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=REG-001" width={100} height={100} alt="QR Code" />
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
                      <Button variant="outline">
                        <FilePenLine className="mr-2 h-4 w-4" /> {t("Update Details")}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-6 flex flex-col items-center justify-center md:hidden">
                        <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=REG-001" width={150} height={150} alt="QR Code" />
                        <p className="mt-2 text-sm text-muted-foreground">{t("Scan QR Code")}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
