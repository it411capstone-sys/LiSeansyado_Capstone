
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Waves, UserCog, ShieldCheck, FileText, Anchor, LifeBuoy, User } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LoginDialog } from '@/components/login-dialog';
import { LanguageToggle } from '@/components/language-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container z-10 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground/70 hover:text-foreground">Home</Link>
            <Link href="#" className="text-foreground/70 hover:text-foreground">About Us</Link>
            <Link href="#" className="text-foreground/70 hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <LoginDialog>
                <Button>Login <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </LoginDialog>
        </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-24 bg-primary/5">
            <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                <svg className="w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="none" fill="hsl(var(--primary) / 0.1)">
                  <path d="M0,256L48,250.7C96,245,192,235,288,202.7C384,171,480,117,576,117.3C672,117,768,171,864,197.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                </svg>
            </div>
            <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter text-primary">
                    Ride the Wave to Registration
                </h1>
                <p className="text-lg md:text-xl text-foreground/80">
                    Modernizing Cantilan's Fishery. Simplified registration, enhanced compliance, and sustainable seas for our local heroes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <LoginDialog>
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Button>
                    </LoginDialog>
                    <Button asChild size="lg" variant="outline">
                    <Link href="#learn-more">Learn More</Link>
                    </Button>
                </div>
                </div>
                <div className="relative h-64 md:h-96">
                    <div 
                        className="absolute inset-0 bg-primary/10 rounded-3xl transform -rotate-6"
                        aria-hidden="true"
                    ></div>
                    <div 
                        className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-6"
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 p-2">
                        <img 
                            src="https://placehold.co/600x400.png" 
                            data-ai-hint="fishing boat philippines"
                            alt="Fishing boat on the shores of Cantilan" 
                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
            </div>
        </section>

        {/* Why Register Section */}
        <section id="learn-more" className="py-12 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Register Your Vessel & Gear?</h2>
                    <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                        Registration is a crucial step for every Filipino fisherfolk. It ensures you operate legally, promotes safety at sea, and opens doors to government support.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Operate Legally</CardTitle>
                        </CardHeader>
                        <CardContent>
                            A valid registration is your license to fish, preventing penalties and ensuring your livelihood is protected under Philippine law.
                        </CardContent>
                    </Card>
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                             <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <LifeBuoy className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Access Gov't Programs</CardTitle>
                        </CardHeader>
                        <CardContent>
                           Registered fisherfolk are prioritized for fuel subsidies, gear assistance, training, and other support programs from BFAR and the LGU.
                        </CardContent>
                    </Card>
                    <Card className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <CardHeader className="items-center">
                             <div className="p-4 bg-primary/10 rounded-full mb-4">
                                <Anchor className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Enhance Maritime Safety</CardTitle>
                        </CardHeader>
                        <CardContent>
                            Registration helps authorities in monitoring fishing activities, aiding in search and rescue operations, and combating illegal fishing.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Requirements Section */}
        <section className="py-12 md:py-24 bg-muted/40">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">BoatR & FishR Requirements</h2>
                    <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                        Before registering your gear or vessel, you must first be enrolled in the national databases: BoatR for boats and FishR for fisherfolk.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>BoatR (Boat Registration)</CardTitle>
                            <CardDescription>For the registration of fishing vessels 3 Gross Tonnage (GT) and below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <ul className="list-disc list-inside text-foreground/80 space-y-1">
                                <li>Proof of ownership (e.g., official receipt, deed of sale).</li>
                                <li>Clear, colored photos of the vessel (front, back, and side views).</li>
                                <li>Certificate of registration from your municipality or city.</li>
                                <li>Valid government-issued ID of the owner.</li>
                           </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>FishR (Fisherfolk Registration)</CardTitle>
                            <CardDescription>For the official listing of all fisherfolk in the country.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <ul className="list-disc list-inside text-foreground/80 space-y-1">
                                <li>Duly accomplished FishR form from your LGU.</li>
                                <li>Recent 2x2 ID picture.</li>
                                <li>Proof of residency (e.g., Barangay Certificate).</li>
                                <li>Must be at least 18 years old and part of a fishing household.</li>
                           </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center mt-8">
                    <LoginDialog>
                        <Button size="lg">Register Your Account Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
                   </LoginDialog>
                </div>
             </div>
        </section>

      </main>
        <footer className="bg-primary/5 text-center text-sm text-foreground/60 overflow-hidden">
            <div className="relative">
                <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="hsl(var(--background))">
                    <path d="M0,50 C480,150 960,-50 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
                <div className="py-6">
                    © {new Date().getFullYear()} LiSEAnsyado. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
