
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, RefreshCw, Eye, Bell, ShieldCheck, Upload, FileText, Info, ShieldAlert, ShieldX } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { verificationSubmissions, users } from "@/lib/data";
import { VerificationSubmission } from "@/lib/types";

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

const VerificationCard = ({ triggerButton }: { triggerButton: React.ReactNode }) => {
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

        const fisherfolkUser = users.fisherfolk;

        // Check if a submission already exists and update it, otherwise create a new one
        const existingSubmissionIndex = verificationSubmissions.findIndex(sub => sub.fisherfolkName === fisherfolkUser.name);

        const newSubmissionData = {
            fisherfolkId: existingSubmissionIndex > -1 ? verificationSubmissions[existingSubmissionIndex].fisherfolkId : `FF-${String(verificationSubmissions.length + 1).padStart(3, '0')}`,
            fisherfolkName: fisherfolkUser.name,
            fisherfolkAvatar: fisherfolkUser.avatar,
            dateSubmitted: new Date().toISOString().split('T')[0],
            fishRId: fishRId,
            boatRId: boatRId,
            barangayCertUrl: URL.createObjectURL(barangayCert),
            cedulaUrl: URL.createObjectURL(cedula),
            fishRStatus: 'Pending' as const,
            boatRStatus: 'Pending' as const,
            barangayCertStatus: 'Pending' as const,
            cedulaStatus: 'Pending' as const,
        };

        if (existingSubmissionIndex > -1) {
            verificationSubmissions[existingSubmissionIndex] = {
                ...verificationSubmissions[existingSubmissionIndex],
                ...newSubmissionData
            };
        } else {
             verificationSubmissions.unshift({
                id: `VERIFY-${String(verificationSubmissions.length + 1).padStart(3, '0')}`,
                ...newSubmissionData
             });
        }


        toast({
            title: "Verification Submitted",
            description: "Your documents have been submitted successfully. Please wait for the admin to verify your account.",
        });

        handleOpenChange(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {triggerButton}
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
    );
};

export default function FisherfolkHomePage() {
    const { t } = useTranslation();
    const currentUser = users.fisherfolk;

    const userVerification = useMemo(() => 
        verificationSubmissions.find(sub => sub.fisherfolkName === currentUser.name), 
    [currentUser.name]);

    const isVerified = useMemo(() => 
        userVerification && 
        userVerification.fishRStatus === 'Approved' &&
        userVerification.boatRStatus === 'Approved' &&
        userVerification.barangayCertStatus === 'Approved' &&
        userVerification.cedulaStatus === 'Approved',
    [userVerification]);
    
    const isRejected = useMemo(() =>
        userVerification && 
        [userVerification.fishRStatus, userVerification.boatRStatus, userVerification.barangayCertStatus, userVerification.cedulaStatus].some(s => s === 'Rejected'),
    [userVerification]);

    const isPending = useMemo(() =>
        userVerification && !isVerified && !isRejected,
    [userVerification, isVerified, isRejected]);


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Maayong Adlaw, Juan!")}</h1>
        <p className="text-muted-foreground">{t("Welcome to your LiSEAnsyado portal. What would you like to do today?")}</p>
      </div>

        {isVerified ? (
            <Card className="mb-8 border-green-500/50 bg-green-500/5">
                <CardHeader className="flex flex-row items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
                <div>
                    <CardTitle>{t("You are Verified")}</CardTitle>
                    <CardDescription>{t("Your account is fully verified. You can now access all features.")}</CardDescription>
                </div>
                </CardHeader>
            </Card>
        ) : isPending ? (
             <Card className="mb-8 border-blue-500/50 bg-blue-500/5">
                <CardHeader className="flex flex-row items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
                <div>
                    <CardTitle>{t("Verification Pending")}</CardTitle>
                    <CardDescription>{t("Your submission is currently under review by the administrator.")}</CardDescription>
                </div>
                </CardHeader>
            </Card>
        ) : isRejected ? (
            <Card className="mb-8 border-destructive/50 bg-destructive/5">
                <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldX className="h-8 w-8 text-destructive" />
                    <div>
                        <CardTitle>{t("Verification Rejected")}</CardTitle>
                        <CardDescription>{t("Your submission was rejected. Please review the requirements and re-apply.")}</CardDescription>
                    </div>
                </CardHeader>
                 <CardContent>
                    <VerificationCard 
                        triggerButton={<Button variant="destructive">{t("Re-apply for Verification")}</Button>}
                    />
                </CardContent>
            </Card>
        ) : (
            <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
                <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldAlert className="h-8 w-8 text-yellow-600" />
                    <div>
                        <CardTitle>{t("Verify Your Account")}</CardTitle>
                        <CardDescription>{t("Please verify your FishR/BoatR status to access all features, including new registrations.")}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <VerificationCard 
                        triggerButton={<Button className="bg-yellow-500 hover:bg-yellow-600 text-white">{t("Start Verification")}</Button>}
                    />
                </CardContent>
            </Card>
        )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isDisabled = !isVerified && action.href === "/fisherfolk/register";
          const linkContent = (
            <Card className={`h-full transition-shadow duration-300 ${isDisabled ? 'bg-muted/50 cursor-not-allowed' : 'group-hover:shadow-lg group-hover:border-primary/50'}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <h3 className={`text-lg font-semibold ${!isDisabled && 'group-hover:text-primary'}`}>{t(action.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(action.description)}</p>
                </CardContent>
              </Card>
          );
          
          return isDisabled ? (
              <div key={index} className="group relative">
                {linkContent}
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <p className="text-xs font-semibold text-white bg-black/60 p-2 rounded-md">{t("Verify account to register")}</p>
                </div>
              </div>
          ) : (
            <Link href={action.href} key={index} className="group">
              {linkContent}
            </Link>
          )
        })}
      </div>
    </div>
  );
}
