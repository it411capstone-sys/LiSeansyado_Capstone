
'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { License } from "@/lib/types";
import Image from "next/image";
import React from "react";

interface LicenseTemplateProps {
    license: License;
}

export const LicenseTemplate = React.forwardRef<HTMLDivElement, LicenseTemplateProps>(({ license }, ref) => {
    return (
        <div ref={ref}>
            <Card className="font-serif shadow-lg break-inside-avoid w-full max-w-md mx-auto portrait">
                <CardHeader className="p-4 bg-primary/5">
                    <div className="flex items-center gap-4">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/assets%2FCantilan-logo.png?alt=media&token=a829a286-932b-47e3-a631-de33719b59fe" width={80} height={80} alt="Municipal Seal" />
                        <div className="text-center flex-grow">
                            <p className="text-sm">Republic of the Philippines</p>
                            <p className="text-sm">Province of Surigao del Sur</p>
                            <p className="font-bold text-lg">MUNICIPALITY OF CANTILAN</p>
                            <p className="font-bold text-primary text-xl">OFFICE OF THE MAYOR</p>
                        </div>
                        <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/assets%2Flogo.png?alt=media&token=e9063541-8a9a-4129-89e4-18406114f709" width={80} height={80} alt="LiSEAnsyado Logo" />
                    </div>
                    <Separator className="my-2 bg-primary/20"/>
                    <h2 className="text-center font-bold text-2xl tracking-wider text-primary">FISHING VESSEL/GEAR LICENSE</h2>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">DATE ISSUED</p>
                            <p className="font-semibold">{license.issueDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">VALID UNTIL</p>
                            <p className="font-semibold">{license.expiryDate}</p>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <p className="text-xs italic text-muted-foreground text-center">This license is granted in accordance with all applicable laws and municipal ordinances. This is non-transferable and must be presented upon demand by any authorized personnel.</p>
                        
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-center">
                                <p className="font-bold uppercase">PHILIP A. PICHAY</p>
                                <Separator className="w-2/3 mx-auto my-1"/>
                                <p className="text-sm">Municipal Mayor</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${license.registrationId}`}
                                    width={100}
                                    height={100}
                                    alt={`QR Code for ${license.id}`}
                                    className="rounded-md border p-1"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-4">
                        <p className="text-xs font-mono text-destructive/80">NOT VALID WITHOUT OFFICIAL SEAL</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

LicenseTemplate.displayName = "LicenseTemplate";
