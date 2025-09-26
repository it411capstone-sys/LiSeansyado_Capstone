
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/lib/types";
import { LicenseTemplate } from "@/components/admin/license-template";

export default function AdminLicensesPage() {
    const { t } = useTranslation();
    const [licenses, setLicenses] = useState<License[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "licenses"), (snapshot) => {
            const licensesData: License[] = [];
            snapshot.forEach((doc) => {
                licensesData.push({ id: doc.id, ...doc.data() } as License);
            });
            setLicenses(licensesData);
        });
        return () => unsubscribe();
    }, []);

    const handlePrint = () => {
        window.print();
    }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8 print:hidden">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Issued Licenses")}</h1>
        <p className="text-muted-foreground">
          {t("View and manage all official fishing licenses.")}
        </p>
         <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t("Print All")}
            </Button>
        </div>
      </div>

      {licenses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold">{t("No Licenses Found")}</h3>
            <p className="text-muted-foreground mt-1">{t("No licenses have been issued yet.")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {licenses.map((license) => (
            <LicenseTemplate key={license.id} license={license} />
          ))}
        </div>
      )}
    </div>
  );
}
