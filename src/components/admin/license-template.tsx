
'use client';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { License } from "@/lib/types";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import '@/app/print.css';

interface LicenseTemplateProps {
    license: License;
}

export const LicenseTemplate = React.forwardRef<HTMLDivElement, LicenseTemplateProps>(({ license }, ref) => {
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);
    
    return (
    <div ref={ref} className="bg-gray-100 p-4 font-serif">
        <div className="w-full max-w-4xl mx-auto aspect-[210/297] bg-white border-4 border-[#15bdb9]/50 shadow-lg flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.firebasestorage.app/o/municipalseal.png?alt=media&token=e957c284-b157-4555-8f44-778b1fcd13fc" width={100} height={100} alt="Municipal Seal" className="w-16 h-16 sm:w-24 sm:h-24" />
                    <div className="text-center space-y-0.5">
                        <p className="text-xs sm:text-sm">Republic of the Philippines</p>
                        <p className="font-bold text-xs sm:text-sm">PROVINCE OF SURIGAO DEL SUR</p>
                        <p className="font-bold text-[#15bdb9] text-sm sm:text-base">MUNICIPALITY OF CANTILAN</p>
                    </div>
                    <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.firebasestorage.app/o/liseansyadologo.png?alt=media&token=22f8d308-c362-4bad-8ebe-52499f093e6c" width={100} height={100} alt="LiSEAnsyado Seal" className="w-16 h-16 sm:w-24 sm:h-24" />
                </div>
                <hr className="my-2 sm:my-4 border-[#15bdb9]" />
                <p className="text-center text-lg sm:text-xl font-bold text-[#15bdb9]">LICENSE TO OPERATE</p>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 flex-grow">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 border flex items-center justify-center bg-gray-100 p-1 mx-auto sm:mx-0">
                        {/* Registration QR Code */}
                        {origin && license.registrationId && (
                           <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(`${origin}/profile/${license.registrationId}`)}`}
                                width={128}
                                height={128}
                                alt={`QR Code for ${license.registrationId}`}
                                className="object-contain"
                            />
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">License Number</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md font-mono">{license.id}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">License Type</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md">{license.type}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="space-y-2">
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Registration ID</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md font-mono">{license.registrationId}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Date Issued</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md">{license.issueDate}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Date of Expiry</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md text-red-600 font-semibold">{license.expiryDate}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Issued To</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md font-semibold">{license.name}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Address</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md">{license.address || 'N/A'}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase">Contact Number</p>
                            <p className="border bg-gray-50 p-2 text-sm rounded-md">{license.contact || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 sm:p-6 text-center mt-auto">
                <div className="mb-4 sm:mb-8">
                    <p className="font-bold uppercase text-xs sm:text-sm underline decoration-1">HON. RODRIGO L. ELEAZAR</p>
                    <p className="text-xs">Municipal Mayor</p>
                </div>
                <div className="text-[10px] sm:text-xs italic text-gray-600 space-y-1">
                    <p>This license is granted in accordance with all applicable laws and municipal ordinances.</p>
                    <p>This is non-transferable and must be presented upon demand by any authorized personnel.</p>
                    <p>Alteration or misuse of this license is punishable by law.</p>
                </div><br></br>
                <p className="text-xs text-red-600 font-bold mt-2">NOT VALID WITHOUT OFFICIAL DRY SEAL</p>
            </div>
        </div>
    </div>
)});

LicenseTemplate.displayName = "LicenseTemplate";
