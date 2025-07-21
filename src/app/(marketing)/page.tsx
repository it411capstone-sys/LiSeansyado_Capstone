
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Waves, UserCog, ShieldCheck, FileText, Anchor, LifeBuoy, UserPlus, ClipboardCheck, QrCode, Wallet, Fish } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LoginDialog } from '@/components/login-dialog';
import { useTranslation } from '@/contexts/language-context';

const translationKeys = [
    "Login",
    "Ride the Wave to Registration",
    "Modernizing Cantilan's Fishery. Simplified registration, enhanced compliance, and sustainable seas for our local heroes.",
    "Get Started",
    "Learn More",
    "Why Register Your Vessel & Gear?",
    "Registration is a crucial step for every Filipino fisherfolk. It ensures you operate legally, promotes safety at sea, and opens doors to government support.",
    "Operate Legally",
    "A valid registration is your license to fish, preventing penalties and ensuring your livelihood is protected under Philippine law.",
    "Access Gov't Programs",
    "Registered fisherfolk are prioritized for fuel subsidies, gear assistance, training, and other support programs from BFAR and the LGU.",
    "Enhance Maritime Safety",
    "Registration helps authorities in monitoring fishing activities, aiding in search and rescue operations, and combating illegal fishing.",
    "BoatR & FishR Requirements",
    "Before registering your gear or vessel, you must first be enrolled in the national databases: BoatR for boats and FishR for fisherfolk.",
    "BoatR (Boat Registration)",
    "For the registration of fishing vessels 3 Gross Tonnage (GT) and below.",
    "Proof of ownership (e.g., official receipt, deed of sale).",
    "Clear, colored photos of the vessel (front, back, and side views).",
    "Certificate of registration from your municipality or city.",
    "Valid government-issued ID of the owner.",
    "FishR (Fisherfolk Registration)",
    "For the official listing of all fisherfolk in the country.",
    "Duly accomplished FishR form from your LGU.",
    "Recent 2x2 ID picture.",
    "Proof of residency (e.g., Barangay Certificate).",
    "Must be at least 18 years old and part of a fishing household.",
    "Register Your Account Now",
    "How It Works: Get Your License in 6 Easy Steps",
    "A clear and simple path to getting your vessel or gear licensed.",
    "Step 1: Create Account",
    "Register your fisherfolk profile on the LiSEAnsyado portal to begin.",
    "Step 2: Verify BoatR & FishR",
    "Ensure you are registered in the national BoatR and FishR databases.",
    "Step 3: Register Gear or Vessel",
    "Fill out the online forms with your vessel and gear details and upload photos.",
    "Step 4: Review & Inspection",
    "The LGU reviews your submission and schedules an inspection. After success, proceed to payment.",
    "Step 5: Process Regulatory Payment",
    "Settle the necessary fees for your registration or renewal through the portal.",
    "Step 6: Get License & QR Code",
    "Once approved, your digital license will be in your portal, and you'll receive a physical license and a QR code sticker for your vessel or gear."
];


export default function Home() {
    const { t } = useTranslation(translationKeys);

  const handleLearnMoreClick = () => {
    document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/80 to-primary text-primary-foreground overflow-hidden hero-animation">
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter !leading-tight">
                        {t("Ride the Wave to Registration")}
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90">
                        {t("Modernizing Cantilan's Fishery. Simplified registration, enhanced compliance, and sustainable seas for our local heroes.")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <LoginDialog initialView="fisherfolk-signup">
                            <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transform hover:scale-105 transition-transform">
                                {t("Get Started")}
                            </Button>
                        </LoginDialog>
                        <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={handleLearnMoreClick}>
                            {t("Learn More")}
                        </Button>
                    </div>
                </div>
                <div className="relative h-64 md:h-96">
                     <img 
                        src="https://placehold.co/600x400.png"
                        data-ai-hint="friendly fisherfolk mobile app" 
                        alt="Illustration of digital registration" 
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
             <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
                <Fish className="absolute top-[10%] left-[5%] h-8 w-8 text-primary-foreground animate-float" />
                <Fish className="absolute top-[20%] right-[10%] h-12 w-12 text-primary-foreground animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
                <Fish className="absolute bottom-[15%] left-[20%] h-6 w-6 text-primary-foreground animate-float" style={{ animationDelay: '4s' }} />
                 <Waves className="absolute bottom-[30%] right-[25%] h-10 w-10 text-primary-foreground animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 100" fill="hsl(var(--background))" preserveAspectRatio="none" className="w-full h-auto">
                    <path d="M0,50 C480,150 960,-50 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
            </div>
        </section>

        {/* Why Register Section */}
        <section id="learn-more" className="py-12 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t("Why Register Your Vessel & Gear?")}</h2>
                    <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                        {t("Registration is a crucial step for every Filipino fisherfolk. It ensures you operate legally, promotes safety at sea, and opens doors to government support.")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>{t("Operate Legally")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {t("A valid registration is your license to fish, preventing penalties and ensuring your livelihood is protected under Philippine law.")}
                        </CardContent>
                    </Card>
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                             <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <LifeBuoy className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>{t("Access Gov't Programs")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {t("Registered fisherfolk are prioritized for fuel subsidies, gear assistance, training, and other support programs from BFAR and the LGU.")}
                        </CardContent>
                    </Card>
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                             <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <Anchor className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>{t("Enhance Maritime Safety")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {t("Registration helps authorities in monitoring fishing activities, aiding in search and rescue operations, and combating illegal fishing.")}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Process Map Section */}
        <section className="py-12 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t("How It Works: Get Your License in 6 Easy Steps")}</h2>
                    <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                        {t("A clear and simple path to getting your vessel or gear licensed.")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <UserPlus className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 1: Create Account")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("Register your fisherfolk profile on the LiSEAnsyado portal to begin.")}
                            </CardContent>
                        </Card>
                    </div>
                     {/* Step 2 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 2: Verify BoatR & FishR")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("Ensure you are registered in the national BoatR and FishR databases.")}
                            </CardContent>
                        </Card>
                    </div>
                     {/* Step 3 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <FileText className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 3: Register Gear or Vessel")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("Fill out the online forms with your vessel and gear details and upload photos.")}
                            </CardContent>
                        </Card>
                    </div>
                     {/* Step 4 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <ClipboardCheck className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 4: Review & Inspection")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("The LGU reviews your submission and schedules an inspection. After success, proceed to payment.")}
                            </CardContent>
                        </Card>
                    </div>
                    {/* Step 5 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <Wallet className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 5: Process Regulatory Payment")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("Settle the necessary fees for your registration or renewal through the portal.")}
                            </CardContent>
                        </Card>
                    </div>
                    {/* Step 6 */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-background border-4 border-primary/30 rounded-full">
                            <QrCode className="h-10 w-10 text-primary" />
                        </div>
                        <Card className="mt-[-2.5rem] pt-12 w-full h-full">
                            <CardHeader>
                                <CardTitle>{t("Step 6: Get License & QR Code")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {t("Once approved, your digital license will be in your portal, and you'll receive a physical license and a QR code sticker for your vessel or gear.")}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        {/* Requirements Section */}
        <section className="py-12 md:py-24 bg-muted/40">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">{t("BoatR & FishR Requirements")}</h2>
                    <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                        {t("Before registering your gear or vessel, you must first be enrolled in the national databases: BoatR for boats and FishR for fisherfolk.")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("BoatR (Boat Registration)")}</CardTitle>
                            <CardDescription>{t("For the registration of fishing vessels 3 Gross Tonnage (GT) and below.")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <ul className="list-disc list-inside text-foreground/80 space-y-1">
                                <li>{t("Proof of ownership (e.g., official receipt, deed of sale).")}</li>
                                <li>{t("Clear, colored photos of the vessel (front, back, and side views).")}</li>
                                <li>{t("Certificate of registration from your municipality or city.")}</li>
                                <li>{t("Valid government-issued ID of the owner.")}</li>
                           </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t("FishR (Fisherfolk Registration)")}</CardTitle>
                            <CardDescription>{t("For the official listing of all fisherfolk in the country.")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <ul className="list-disc list-inside text-foreground/80 space-y-1">
                                <li>{t("Duly accomplished FishR form from your LGU.")}</li>
                                <li>{t("Recent 2x2 ID picture.")}</li>
                                <li>{t("Proof of residency (e.g., Barangay Certificate).")}</li>
                                <li>{t("Must be at least 18 years old and part of a fishing household.")}</li>
                           </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center mt-8">
                    <LoginDialog initialView="fisherfolk-signup">
                        <Button size="lg">{t("Register Your Account Now")} <ArrowRight className="ml-2 h-5 w-5" /></Button>
                   </LoginDialog>
                </div>
             </div>
        </section>

      </main>
    </div>
  );
}
