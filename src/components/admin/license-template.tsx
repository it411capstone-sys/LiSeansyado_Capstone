
'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { License } from "@/lib/types";
import Image from "next/image";
import React from "react";
import '@/app/print.css';

interface LicenseTemplateProps {
    license: License;
}

export const LicenseTemplate = React.forwardRef<HTMLDivElement, LicenseTemplateProps>(({ license }, ref) => (
    <div ref={ref} className="printable-area">
        <Card className="font-serif shadow-lg break-inside-avoid w-full max-w-4xl mx-auto aspect-[210/297] a4-paper">
            <CardHeader className="p-6 bg-primary/5">
                <div className="flex items-center justify-center gap-4">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.firebasestorage.app/o/290740153_106577928781280_6031693587778787365_n.jpg?alt=media&token=71446c9a-be69-43e5-8bb9-5f6c1a133fff" width={80} height={80} alt="Municipal Seal" />
                    <div className="text-center flex-grow space-y-1">
                        <p className="text-sm">Republic of the Philippines</p>
                        <p className="font-bold text-lg">MUNICIPALITY OF CANTILAN</p>
                        <p className="font-bold text-primary text-xl">OFFICE OF THE MAYOR</p>
                    </div>
                </div>
                <Separator className="my-4 bg-primary/20"/>
                <h2 className="text-center font-bold text-2xl tracking-wider text-primary">FISHING VESSEL/GEAR LICENSE</h2>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 gap-4">
                 <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">LICENSE NO.</p>
                        <p className="font-bold">{license.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">REGISTRATION ID</p>
                        <p className="font-semibold">{license.registrationId}</p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">NAME OF OWNER</p>
                        <p className="font-bold uppercase">{license.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">TYPE</p>
                        <p className="font-semibold">{license.type}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">CONTACT</p>
                        <p className="font-semibold">{license.contact || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">ADDRESS</p>
                        <p className="font-semibold">{license.address || 'N/A'}</p>
                    </div>
                     <div className="grid grid-cols-2 col-span-2 gap-x-8">
                        <div>
                            <p className="text-xs text-muted-foreground">DATE ISSUED</p>
                            <p className="font-semibold">{license.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">VALID UNTIL</p>
                            <p className="font-semibold">{license.expiryDate}</p>
                        </div>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t text-center">
                    <p className="text-xs italic text-muted-foreground">This license is granted in accordance with all applicable laws and municipal ordinances. This is non-transferable and must be presented upon demand by any authorized personnel.</p>
                    <div className="text-center w-1/3 mx-auto mt-12">
                        <p className="font-bold uppercase">HON. RODRIGO L. ELEAZAR</p>
                        <Separator className="w-2/3 mx-auto my-1"/>
                        <p className="text-sm">Municipal Mayor</p>
                    </div>
                </div>
                <p className="text-xs font-mono text-destructive/80 text-center mt-2">NOT VALID WITHOUT OFFICIAL SEAL</p>
            </CardContent>
        </Card>
    </div>
));

LicenseTemplate.displayName = "LicenseTemplate";
