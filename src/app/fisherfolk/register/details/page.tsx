
'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck2, Upload, X } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  registrationType: z.enum(["vessel", "gear"], { required_error: "You need to select a registration type."}),
  vesselId: z.string().optional(),
  vesselName: z.string().optional(),
  vesselType: z.string().optional(),
  horsePower: z.string().optional(),
  engineMake: z.string().optional(),
  engineSerialNumber: z.string().optional(),
  grossTonnage: z.string().optional(),
  length: z.string().optional(),
  breadth: z.string().optional(),
  depth: z.string().optional(),
  gearId: z.string().optional(),
  gearType: z.string().optional(),
  specifications: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.registrationType === 'vessel') {
        if (!data.vesselName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel name is required.", path: ["vesselName"] });
        if (!data.vesselType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel type is required.", path: ["vesselType"] });
        if (!data.horsePower) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Horse power is required.", path: ["horsePower"] });
        if (!data.engineMake) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Engine make is required.", path: ["engineMake"] });
        if (!data.engineSerialNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Engine serial number is required.", path: ["engineSerialNumber"] });
        if (!data.grossTonnage) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gross tonnage is required.", path: ["grossTonnage"] });
        if (!data.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Length is required.", path: ["length"] });
        if (!data.breadth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Breadth is required.", path: ["breadth"] });
        if (!data.depth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Depth is required.", path: ["depth"] });
    }

    if (data.registrationType === 'gear') {
        if (!data.gearType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gear type is required.", path: ["gearType"] });
        if (!data.specifications) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specifications are required.", path: ["specifications"] });
    }
});

type RegistrationTypeToggleProps = {
    active: 'vessel' | 'gear';
    onVesselClick: () => void;
    onGearClick: () => void;
};

function RegistrationTypeToggle({ active, onVesselClick, onGearClick }: RegistrationTypeToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex w-full max-w-xs rounded-full border border-input p-1 mx-auto">
      <div
        className={cn(
          'absolute top-1 left-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-in-out',
          active === 'gear' && 'translate-x-[calc(100%-0.1rem)]'
        )}
      />
      <button
        type="button"
        onClick={onVesselClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'vessel' ? 'text-white' : 'text-foreground'
        )}
      >
        {t("Vessel")}
      </button>
      <button
        type="button"
        onClick={onGearClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'gear' ? 'text-white' : 'text-foreground'
        )}
      >
        {t("Fishing Gear")}
      </button>
    </div>
  );
}

function FisherfolkRegisterDetailsPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [registrationType, setRegistrationType] = useState<'vessel' | 'gear'>('vessel');
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const ownerInfo = {
    ownerName: searchParams.get('ownerName') || '',
    email: searchParams.get('email') || '',
    contact: searchParams.get('contact') || '',
    address: searchParams.get('address') || '',
    fishrNo: searchParams.get('fishrNo') || '',
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationType: "vessel",
      vesselId: "VES-0001",
      vesselName: "",
      vesselType: "",
      horsePower: "",
      engineMake: "",
      engineSerialNumber: "",
      grossTonnage: "",
      length: "",
      breadth: "",
      depth: "",
      gearId: "GEAR-0001",
      gearType: "",
      specifications: "",
    },
  });

  useEffect(() => {
    form.setValue('registrationType', registrationType);
    form.reset({
        ...form.getValues(),
        registrationType: registrationType,
        vesselId: registrationType === 'vessel' ? 'VES-0001' : '',
        gearId: registrationType === 'gear' ? 'GEAR-0001' : '',
        vesselName: '',
        vesselType: '',
        horsePower: '',
        engineMake: '',
        engineSerialNumber: '',
        grossTonnage: '',
        length: '',
        breadth: '',
        depth: '',
        gearType: '',
        specifications: '',
    });
  }, [registrationType, form]);

  const handleRegistrationTypeChange = (type: 'vessel' | 'gear') => {
      setRegistrationType(type);
  }
  
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPhotos(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ownerInfo, ...values});
    console.log("Uploaded files:", photos);
    toast({
        title: "Registration Submitted!",
        description: "Your registration details have been submitted for review.",
    });
    setIsSummaryOpen(false);
  }
  
  const formValues = form.watch();

  return (
    <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight">{t("New Registration - Step 2")}</h1>
          <p className="text-muted-foreground">
            {t("Provide the details for your vessel or fishing gear.")}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => setIsSummaryOpen(true))} className="space-y-8">
            
            <RegistrationTypeToggle 
                active={registrationType}
                onVesselClick={() => handleRegistrationTypeChange('vessel')}
                onGearClick={() => handleRegistrationTypeChange('gear')}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>{registrationType === 'vessel' ? t("Vessel Details") : t("Fishing Gear Details")}</CardTitle>
              </CardHeader>
              <CardContent>
                {registrationType === 'vessel' ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="vesselId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Vessel ID")}</FormLabel>
                          <FormControl><Input {...field} readOnly className="bg-muted" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="vesselType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Vessel Type")}</FormLabel>
                          <FormControl><Input placeholder="e.g., Motorized Banca" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="vesselName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Vessel Name")}</FormLabel>
                            <FormControl><Input placeholder="e.g., Queen Tuna" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="horsePower" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Horse Power")}</FormLabel>
                          <FormControl><Input placeholder="e.g., 16 HP" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="engineMake" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Engine Make")}</FormLabel>
                          <FormControl><Input placeholder="e.g., Yamaha" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="engineSerialNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Engine Serial No.")}</FormLabel>
                          <FormControl><Input placeholder="e.g., YMH12345" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <FormField control={form.control} name="grossTonnage" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Gross Tonnage")}</FormLabel>
                          <FormControl><Input placeholder="e.g., 3 GT" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="length" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Length")}</FormLabel>
                          <FormControl><Input placeholder="e.g., 15m" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="breadth" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Breadth")}</FormLabel>
                          <FormControl><Input placeholder="e.g., 3m" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="depth" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Depth")}</FormLabel>
                          <FormControl><Input placeholder="e.g., 1.5m" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="gearId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Gear ID")}</FormLabel>
                          <FormControl><Input {...field} readOnly className="bg-muted"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="gearType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Gear Type")}</FormLabel>
                          <FormControl><Input placeholder="e.g., Gillnet" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="specifications" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Specifications")}</FormLabel>
                        <FormControl><Textarea placeholder="e.g., 100m length, 2-inch mesh size" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("Upload Gear/Vessel Photos")}</CardTitle>
                    <CardDescription>{t("Upload photos of your vessel or gear, make sure to capture its specifications.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                    <Button variant="outline" type="button" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4"/> {t("Upload Files")}
                    </Button>
                    {photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {photos.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={URL.createObjectURL(photo)}
                                        alt={`preview ${index}`}
                                        width={150}
                                        height={150}
                                        className="w-full h-auto rounded-md object-cover aspect-square"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        type="button"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground truncate mt-1">{photo.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" size="lg">
                    <FileCheck2 className="mr-2 h-4 w-4"/> {t("Submit Registration")}
                </Button>
            </div>
          </form>
        </Form>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Registration Summary</DialogTitle>
                <DialogDescription>
                    Please review your registration details before submitting.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
                <h3 className="font-semibold">Owner Information</h3>
                <p><strong>{t("Full Name")}:</strong> {ownerInfo.ownerName}</p>
                <p><strong>{t("Email Address")}:</strong> {ownerInfo.email}</p>
                <p><strong>{t("Contact Number")}:</strong> {ownerInfo.contact}</p>
                <p><strong>{t("Address")}:</strong> {ownerInfo.address}</p>
                <p><strong>{t("FishR No.")}:</strong> {ownerInfo.fishrNo || 'N/A'}</p>

                <h3 className="font-semibold mt-4">{registrationType === 'vessel' ? "Vessel" : "Gear"} Details</h3>
                {registrationType === 'vessel' ? (
                    <>
                        <p><strong>{t("Registration Type")}:</strong> {t("Vessel")}</p>
                        <p><strong>{t("Vessel ID")}:</strong> {formValues.vesselId}</p>
                        <p><strong>{t("Vessel Name")}:</strong> {formValues.vesselName}</p>
                        <p><strong>{t("Vessel Type")}:</strong> {formValues.vesselType}</p>
                        <p><strong>{t("Horse Power")}:</strong> {formValues.horsePower}</p>
                        <p><strong>{t("Engine Make")}:</strong> {formValues.engineMake}</p>
                        <p><strong>{t("Engine Serial No.")}:</strong> {formValues.engineSerialNumber}</p>
                        <p><strong>{t("Gross Tonnage")}:</strong> {formValues.grossTonnage}</p>
                        <p><strong>{t("Length")}:</strong> {formValues.length}</p>
                        <p><strong>{t("Breadth")}:</strong> {formValues.breadth}</p>
                        <p><strong>{t("Depth")}:</strong> {formValues.depth}</p>
                    </>
                ) : (
                    <>
                        <p><strong>{t("Registration Type")}:</strong> {t("Fishing Gear")}</p>
                        <p><strong>{t("Gear ID")}:</strong> {formValues.gearId}</p>
                        <p><strong>{t("Gear Type")}:</strong> {formValues.gearType}</p>
                        <p><strong>{t("Specifications")}:</strong> {formValues.specifications}</p>
                    </>
                )}
                 <div>
                    <strong>{t("Uploaded Photos")}:</strong>
                    {photos.length > 0 ? (
                        <ul className="list-disc pl-5 mt-2">
                        {photos.map((photo, index) => (
                            <li key={index}>{photo.name}</li>
                        ))}
                        </ul>
                    ) : (
                        <p>{t("No photos uploaded.")}</p>
                    )}
                </div>
            </div>
            </ScrollArea>
            <DialogFooter className="sm:justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsSummaryOpen(false)}>
                    Cancel
                </Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default function FisherfolkRegisterDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FisherfolkRegisterDetailsPageContent />
        </Suspense>
    )
}

    

    