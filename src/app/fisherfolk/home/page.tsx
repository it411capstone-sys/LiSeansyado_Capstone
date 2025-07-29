
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, RefreshCw, Eye, Bell, ShieldCheck, Upload, FileText, Info } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const actions = [
  {
    href: "/fisherfolk/register",
    icon: FilePlus2,
    title: "Register Vessel/Gear",
    description: "Submit a new application for your boat or fishing equipment.",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/fisherfolk/my-registrations",
    icon: RefreshCw,
    title: "Renew License",
    description: "Renew your existing licenses before they expire.",
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/fisherfolk/my-registrations",
    icon: Eye,
    title: "View My Registrations",
    description: "Check the status and details of all your registrations.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    href: "/fisherfolk/notifications",
    icon: Bell,
    title: "Notifications",
    description: "See important updates, reminders, and alerts.",
    color: "bg-red-500/10 text-red-600",
  }
];

export default function FisherfolkHomePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [fishRId, setFishRId] = useState("");
    const [boatRId, setBoatRId] = useState("");
    const [barangayCert, setBarangayCert] = useState<File | null>(null);
    const [cedula, setCedula] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const barangayCertRef = useRef<HTMLInputElement>(null);
    const cedulaRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFishRId("");
        setBoatRId("");
        setBarangayCert(null);
        setCedula(null);
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            resetForm();
        }
    }

    const handleSubmit = () => {
        if (!fishRId || !boatRId || !barangayCert || !cedula) {
            toast({
                variant: "destructive",
                title: "Incomplete Submission",
                description: "Please fill in all ID numbers and upload both required documents.",
            });
            return;
        }

        // Simulate submission to database
        console.log("Submitting verification:", { fishRId, boatRId, barangayCertName: barangayCert.name, cedulaName: cedula.name });

        toast({
            title: "Verification Submitted",
            description: "Your documents have been submitted successfully. Please wait for the admin to verify your account.",
        });

        handleOpenChange(false);
    };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Maayong Adlaw, Juan!")}</h1>
        <p className="text-muted-foreground">{t("Welcome to your LiSEAnsyado portal. What would you like to do today?")}</p>
      </div>

      <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
        <CardHeader className="flex flex-row items-center gap-4">
           <ShieldCheck className="h-8 w-8 text-yellow-600" />
           <div>
            <CardTitle>{t("Verify Your Account")}</CardTitle>
            <CardDescription>{t("Please verify your FishR/BoatR status to access all features, including new registrations.")}</CardDescription>
           </div>
        </CardHeader>
        <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">{t("Start Verification")}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle>{t("Account Verification")}</DialogTitle>
                        <DialogDescription>{t("Enter your national registration IDs and upload the required documents.")}</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="fishr-id">{t("FishR ID Number")}</Label>
                            <Input id="fishr-id" placeholder="Enter your FishR ID" value={fishRId} onChange={e => setFishRId(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="boatr-id">{t("BoatR ID Number")}</Label>
                            <Input id="boatr-id" placeholder="Enter your BoatR ID" value={boatRId} onChange={e => setBoatRId(e.target.value)}/>
                        </div>
                        
                         <div className="space-y-2 pt-2">
                            <Label className="font-semibold">{t("Document Upload")}</Label>
                        </div>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Photo Upload Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        To ensure a smooth and fast processing of your registration, please follow these steps when uploading your documents:
                                    </AlertDescription>
                                </Alert>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Step 1: Prepare the Documents</h4>
                                        <p className="text-muted-foreground">Make sure you have all the required documents ready.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Step 2: Take Clear Photos</h4>
                                        <p className="text-muted-foreground">Place the document on a flat surface with good lighting.</p>
                                        <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                                            <li>The entire document is visible (no parts cut off).</li>
                                            <li>There is no glare, blur, or shadow.</li>
                                            <li>Text is readable and not reversed (don’t use mirror mode).</li>
                                        </ul>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold">Step 3: Upload the Photos</h4>
                                        <p className="text-muted-foreground">
                                            Go to the upload section of the verification page.
                                            Click “Upload” or “Browse” and select the corresponding photo.
                                            Wait for the upload to finish before submitting the form.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Step 4: Review Before Submitting</h4>
                                        <p className="text-muted-foreground">Double-check that each document is clear, correct, and successfully uploaded, then click “Submit”.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="space-y-2">
                             <Label>{t("Barangay Certificate")}</Label>
                            <Input type="file" ref={barangayCertRef} className="hidden" onChange={(e) => setBarangayCert(e.target.files?.[0] || null)} accept="image/*" />
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="w-full" onClick={() => barangayCertRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" /> {t("Upload Photo")}
                                </Button>
                            </div>
                            {barangayCert && <p className="text-sm text-muted-foreground">Selected file: {barangayCert.name}</p>}
                        </div>
                        <div className="space-y-2">
                             <Label>{t("Cedula (Community Tax Certificate)")}</Label>
                            <Input type="file" ref={cedulaRef} className="hidden" onChange={(e) => setCedula(e.target.files?.[0] || null)} accept="image/*"/>
                             <Button variant="outline" className="w-full" onClick={() => cedulaRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> {t("Upload Photo")}
                            </Button>
                            {cedula && <p className="text-sm text-muted-foreground">Selected file: {cedula.name}</p>}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" onClick={handleSubmit}>{t("Submit for Verification")}</Button>
                </DialogContent>
            </Dialog>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.href} key={index} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary">{t(action.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(action.description)}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
