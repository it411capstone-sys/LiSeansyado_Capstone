
'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { License } from "@/lib/types";
import Image from "next/image";
import React from "react";
import '@/app/print.css';
import { Badge } from "../ui/badge";

interface LicenseTemplateProps {
    license: License;
}

export const LicenseTemplate = React.forwardRef<HTMLDivElement, LicenseTemplateProps>(({ license }, ref) => (
    <div ref={ref} className="printable-area bg-gray-100 p-4">
        <Card className="font-serif shadow-lg break-inside-avoid w-full max-w-4xl mx-auto aspect-[210/297] a4-paper border-4 border-primary/50 bg-background">
            <CardHeader className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 z-0"></div>
                <div className="relative z-10 flex items-center justify-between gap-4">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.firebasestorage.app/o/municipalseal.png?alt=media&token=e957c284-b157-4555-8f44-778b1fcd13fc" width={100} height={100} alt="Municipal Seal" />
                    <div className="text-center flex-grow space-y-1">
                        <p className="text-sm tracking-wider">Republic of the Philippines</p>
                        <p className="font-bold text-lg uppercase">Province of Surigao del Sur</p>
                        <p className="font-bold text-primary text-2xl uppercase">Municipality of Cantilan</p>
                    </div>
                     <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/assets%2Flogo.png?alt=media&token=e9063541-8a9a-4129-89e4-18406114f709" width={100} height={100} alt="LiSEAnsyado Seal" />
                </div>
                 <Separator className="my-4 bg-primary/20"/>
                <h1 className="text-center font-bold text-3xl tracking-widest text-primary uppercase">License to Operate</h1>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-3 gap-8">
                 <div className="col-span-2 space-y-6">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">License Number</p>
                        <p className="font-bold text-lg font-mono">{license.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Issued To</p>
                        <p className="font-bold text-xl uppercase">{license.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                            <p className="font-semibold">{license.address || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Contact Number</p>
                            <p className="font-semibold">{license.contact || 'N/A'}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">License Type</p>
                            <p className="font-semibold text-lg">{license.type}</p>
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Registration ID</p>
                            <p className="font-semibold font-mono">{license.registrationId}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Date Issued</p>
                            <p className="font-semibold">{license.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Date of Expiry</p>
                            <p className="font-semibold text-destructive">{license.expiryDate}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 flex flex-col items-center justify-between space-y-8 border-l pl-8">
                     <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${license.registrationId}`)}`}
                        width={150}
                        height={150}
                        alt="License QR Code"
                        className="border-4 border-primary/50 p-1"
                    />
                    <div className="text-center space-y-6">
                        <div className="h-20"></div>
                        <div className="w-48 mx-auto">
                            <p className="font-bold uppercase text-sm">HON. RODRIGO L. ELEAZAR</p>
                            <Separator className="bg-primary/50 my-1"/>
                            <p className="text-xs">Municipal Mayor</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 border-t mt-4 pt-4 text-center">
                    <p className="text-xs italic text-muted-foreground">
                        This license is granted in accordance with all applicable laws and municipal ordinances. This is non-transferable and must be presented upon demand by any authorized personnel.
                        Alteration or misuse of this license is punishable by law.
                    </p>
                    <p className="text-xs font-mono text-destructive/80 text-center mt-2">NOT VALID WITHOUT OFFICIAL DRY SEAL</p>
                </div>
            </CardContent>
        </Card>
    </div>
));

LicenseTemplate.displayName = "LicenseTemplate";
