
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import Image from "next/image";

// Mock data for licenses
const licenses = [
  {
    id: "LIC-VES-1024",
    type: "Vessel",
    name: "Bantay Dagat 1",
    issueDate: "2025-06-15",
    expiryDate: "2026-06-14",
    status: "Active",
  },
  {
    id: "LIC-GEAR-5801",
    type: "Gear",
    name: "Hook and Line",
    issueDate: "2025-05-01",
    expiryDate: "2026-04-30",
    status: "Active",
  },
];

export default function FisherfolkLicensesPage() {
    const { t } = useTranslation();

  return (
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
        <div className="space-y-4">
          {licenses.map((license) => (
            <Card key={license.id}>
              <CardHeader>
                <CardTitle>{t(license.name)}</CardTitle>
                <CardDescription>{t("License ID")}: {license.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">{t("Type")}</p>
                            <p className="font-medium">{t(license.type)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">{t("Issue Date")}</p>
                            <p className="font-medium">{license.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">{t("Expiry Date")}</p>
                            <p className="font-medium">{license.expiryDate}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">{t("Status")}</p>
                            <p className="font-medium">{t(license.status)}</p>
                        </div>
                        <div className="col-span-2 md:col-span-4 flex gap-2 mt-4">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                {t("Download")}
                            </Button>
                            <Button variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                {t("Print")}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                         <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${license.id}`}
                            width={120}
                            height={120}
                            alt={`QR Code for ${license.id}`}
                            className="rounded-md"
                        />
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
