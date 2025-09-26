
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/lib/types";
import { LicenseTemplate } from "@/components/admin/license-template";
import { useReactToPrint } from "react-to-print";

const LicenseCard = ({ license }: { license: License }) => {
    const { t } = useTranslation();
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div>
                        <CardTitle>{license.name}</CardTitle>
                        <CardDescription>{t("License ID")}: {license.id}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            {t("Print")}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <LicenseTemplate license={license} />
                <div style={{ display: 'none' }}>
                    <LicenseTemplate ref={printRef} license={license} />
                </div>
            </CardContent>
        </Card>
    );
};

export default function FisherfolkLicensesPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [licenses, setLicenses] = useState<License[]>([]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "licenses"), where("ownerEmail", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const licensesData: License[] = [];
            snapshot.forEach((doc) => {
                licensesData.push({ id: doc.id, ...doc.data() } as License);
            });
            setLicenses(licensesData);
        });
        return () => unsubscribe();
    }, [user]);

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
        <div className="space-y-8">
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      )}
    </div>
  );
}
