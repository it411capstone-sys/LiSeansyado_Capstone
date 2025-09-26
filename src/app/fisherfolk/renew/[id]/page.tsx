
'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef, Suspense } from "react";
import { collection, onSnapshot, doc, setDoc, updateDoc, getDoc, getDocs, query } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { compressImage } from "@/lib/image-compression";

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
import { FileCheck2, Upload, X, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import type { Registration } from "@/lib/types";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
  ownerName: z.string(),
  email: z.string(),
  contact: z.string(),
  address: z.string(),
  fishrNo: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.registrationType === 'vessel') {
        if (!data.vesselName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel name is required.", path: ["vesselName"] });
        if (!data.vesselType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel type is required.", path: ["vesselType"] });
    }

    if (data.registrationType === 'gear') {
        if (!data.gearType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gear type is required.", path: ["gearType"] });
        if (!data.specifications) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specifications are required.", path: ["specifications"] });
    }
});


function FisherfolkRenewPageContent() {
  const { t } = useTranslation();
  const { user, userData } = useAuth();
  const [registrationToRenew, setRegistrationToRenew] = useState<Registration | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const registrationId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (registrationId) {
      const docRef = doc(db, "registrations", registrationId);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Registration;
          setRegistrationToRenew(data);
          
          const isVessel = data.type === 'Vessel';
          
          let vesselDetails = {
            vesselName: '', vesselType: '', horsePower: '', engineMake: '',
            engineSerialNumber: '', grossTonnage: '', length: '', breadth: '', depth: ''
          };
          if (isVessel && data.vesselDetails) {
              const details = data.vesselDetails.split(', ').reduce((acc, detail) => {
                  const [key, value] = detail.split(': ');
                  if (key && value) {
                      const camelCaseKey = key.toLowerCase().replace(/ \w/g, c => c.toUpperCase().slice(1)).replace(/[^a-zA-Z0-9]/g, '');
                      (acc as any)[camelCaseKey] = value;
                  }
                  return acc;
              }, {});
              vesselDetails = { ...vesselDetails, ...details };
          }
          
          let gearDetails = { gearType: '', specifications: ''};
          if(!isVessel && data.fishingGearDetails) {
              const details = data.fishingGearDetails.split(', Specs: ');
              gearDetails.gearType = details[0].replace('Type: ', '');
              gearDetails.specifications = details[1] || '';
          }
          
          form.reset({
            registrationType: isVessel ? "vessel" : "gear",
            ownerName: data.ownerName,
            email: data.email,
            contact: data.contact,
            address: data.address,
            fishrNo: data.fishermanProfile.replace('FishR No: ', ''),
            vesselId: isVessel ? data.id : '',
            vesselName: vesselDetails.vesselName,
            vesselType: vesselDetails.vesselType,
            horsePower: vesselDetails.horsePower,
            engineMake: vesselDetails.engineMake,
            engineSerialNumber: vesselDetails.engineSerialNumber,
            grossTonnage: vesselDetails.grossTonnage,
            length: vesselDetails.length,
            breadth: vesselDetails.breadth,
            depth: vesselDetails.depth,
            gearId: !isVessel ? data.id : '',
            gearType: gearDetails.gearType,
            specifications: gearDetails.specifications,
          });

          // Prefill existing photos for preview
          if (data.photos) {
              setPhotos(data.photos.map(url => new File([], url))); // Dummy file for name
          }

        } else {
          toast({ variant: 'destructive', title: 'Registration not found' });
          router.push('/fisherfolk/my-registrations');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [registrationId, form, router, toast]);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPhotos(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData || !user || !registrationToRenew) {
        toast({ variant: "destructive", title: "Error", description: "Could not process renewal." });
        return;
    }
    
    setIsSubmitting(true);
    
    const photoUrls: string[] = [];

    try {
        const renewalQuery = query(collection(db, "licenseRenewals"));
        const renewalSnapshot = await getDocs(renewalQuery);
        const renewalCount = renewalSnapshot.size;
        const newRenewalId = `REN-${registrationToRenew.id}-${renewalCount + 1}`;

        for (const photo of photos) {
            if (photo.size > 0) { // New file
                const compressedPhoto = await compressImage(photo);
                const photoRef = ref(storage, `registrations/${newRenewalId}/${compressedPhoto.name}`);
                await uploadBytes(photoRef, compressedPhoto);
                const url = await getDownloadURL(photoRef);
                photoUrls.push(url);
            } else { // Existing file URL
                photoUrls.push(photo.name);
            }
        }
        
        const isVessel = values.registrationType === 'vessel';

        const newRenewal: Registration = {
            id: newRenewalId,
            ownerId: user.uid,
            ownerName: values.ownerName,
            email: values.email,
            contact: values.contact,
            address: values.address,
            vesselName: values.vesselName || 'N/A',
            gearType: isVessel ? 'N/A' : values.gearType!,
            type: isVessel ? 'Vessel' : 'Gear',
            registrationDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
            status: 'Pending',
            vesselDetails: isVessel ? `Name: ${values.vesselName}, Type: ${values.vesselType}, HP: ${values.horsePower}, Make: ${values.engineMake}, S/N: ${values.engineSerialNumber}, GT: ${values.grossTonnage}, L: ${values.length}, B: ${values.breadth}, D: ${values.depth}` : 'N/A',
            fishingGearDetails: !isVessel ? `Type: ${values.gearType}, Specs: ${values.specifications}` : 'N/A',
            fishermanProfile: `FishR No: ${values.fishrNo}`,
            history: [{ action: 'Submitted for Renewal', date: new Date().toISOString().split('T')[0], actor: values.ownerName }],
            boatrVerified: registrationToRenew.boatrVerified,
            fishrVerified: registrationToRenew.fishrVerified,
            photos: photoUrls,
            renewalFor: registrationToRenew.id,
        };
        
        await setDoc(doc(db, "licenseRenewals", newRenewalId), newRenewal);
        
        toast({
            title: "Renewal Submitted!",
            description: "Your renewal request has been submitted for review.",
        });

        setIsSummaryOpen(false);
        router.push('/fisherfolk/my-registrations');

    } catch (error) {
        console.error("Renewal submission error: ", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error submitting your renewal. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const formValues = form.watch();
  const registrationType = form.watch("registrationType");

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8 space-y-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-8 w-3/4" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/4"/></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full"/>
                    <Skeleton className="h-10 w-full"/>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/4"/></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full"/>
                    <Skeleton className="h-10 w-full"/>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Renew License")}</h1>
          <p className="text-muted-foreground">
            {t("Review and update your details to renew your registration.")}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => setIsSummaryOpen(true))} className="space-y-8">
            
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
                    <CardTitle>{t("Update Gear/Vessel Photos")}</CardTitle>
                    <CardDescription>{t("Upload new photos if there are any changes to your vessel or gear.")}</CardDescription>
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
                        <Upload className="mr-2 h-4 w-4"/> {t("Upload New Files")}
                    </Button>
                    {photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {photos.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={photo.size > 0 ? URL.createObjectURL(photo) : photo.name}
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
                                    <p className="text-xs text-muted-foreground truncate mt-1">{photo.name.startsWith('https://') ? 'Existing photo' : photo.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
                 <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4"/> {t("Back")}
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="mr-2 h-4 w-4"/>
                    )}
                    {t("Submit Renewal")}
                </Button>
            </div>
          </form>
        </Form>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Renewal Summary</DialogTitle>
                <DialogDescription>
                    Please review your renewal details before submitting.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-1">
                <h3 className="font-semibold">Owner Information</h3>
                <p><strong>{t("Full Name")}:</strong> {formValues.ownerName}</p>
                <p><strong>{t("Email Address")}:</strong> {formValues.email}</p>
                <p><strong>{t("Contact Number")}:</strong> {formValues.contact}</p>
                <p><strong>{t("Address")}:</strong> {formValues.address}</p>
                <p><strong>{t("FishR No.")}:</strong> {formValues.fishrNo || 'N/A'}</p>

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
                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default function FisherfolkRenewPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FisherfolkRenewPageContent />
        </Suspense>
    );
}
