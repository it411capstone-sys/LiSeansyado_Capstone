
'use client';
import { useTranslation } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Fish, Ship, LifeBuoy, Anchor, Waves, Award, CheckCircle, BarChart, FileText } from "lucide-react";

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className="flex-grow">
            {/* Hero Section */}
            <section className="relative bg-primary/5 text-primary overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">{t("About LiSEAnsyado")}</h1>
                    <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">{t("Digitalizing Fishery Registration for a Sustainable Future")}</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
                    <Fish className="absolute top-[10%] left-[5%] h-8 w-8 text-primary animate-float" style={{ animationDelay: '1s' }} />
                    <Fish className="absolute top-[15%] right-[10%] h-6 w-6 text-primary animate-float" style={{ animationDelay: '3s' }}/>
                    <Ship className="absolute top-[20%] left-[20%] h-12 w-12 text-primary animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
                    <LifeBuoy className="absolute top-[60%] right-[5%] h-10 w-10 text-primary animate-float" style={{ animationDelay: '5s' }}/>
                    <Anchor className="absolute bottom-[15%] left-[10%] h-6 w-6 text-primary animate-float" style={{ animationDelay: '4s' }} />
                    <Waves className="absolute bottom-[30%] left-[30%] h-10 w-10 text-primary animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }} />
                    <Ship className="absolute bottom-[10%] right-[15%] h-8 w-8 text-primary animate-float" style={{ animationDelay: '6s', animationDuration: '5s' }}/>
                    <Fish className="absolute bottom-[5%] left-[45%] h-7 w-7 text-primary animate-float" style={{ animationDelay: '7s' }} />
                    <Anchor className="absolute top-[70%] left-[15%] h-8 w-8 text-primary animate-float" style={{ animationDelay: '8s' }} />
                    <Fish className="absolute top-[80%] right-[30%] h-6 w-6 text-primary animate-float" style={{ animationDelay: '9s' }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="hsl(var(--background))" preserveAspectRatio="none" className="w-full h-auto">
                        <path d="M0,50 C480,150 960,-50 1440,50 L1440,100 L0,100 Z"></path>
                    </svg>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Image src="https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.firebasestorage.app/o/liseansyadologo.png?alt=media&token=22f8d308-c362-4bad-8ebe-52499f093e6c" data-ai-hint="philippine coastline" alt="Cantilan Coastline" width={600} height={400} className="rounded-lg shadow-md" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-headline">{t("Our Mission: LiSEAnsyado")}</h2>
                        <p className="text-foreground/80 leading-relaxed">{t("LiSEAnsyado is the official digital platform dedicated to streamlining and managing the Fishery Registration, Licensing, and Inspection processes for the Municipality of Cantilan, Surigao del Sur. Our mission is to promote responsible resource management, ensure public safety, and enhance the socio-economic well-being of our local fisherfolk and maritime community.")}</p>
                        <p className="text-foreground/80 leading-relaxed">{t("We provide a transparent, efficient, and reliable system to support the local government's efforts in sustainably managing the municipal waters.")}</p>
                    </div>
                </div>
            </section>
            
            {/* What We Do Section */}
            <section className="py-12 md:py-24 bg-muted/40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">{t("What We Do")}</h2>
                        <p className="text-lg text-foreground/70 max-w-3xl mx-auto">{t("The LiSEAnsyado system digitizes critical administrative processes that were traditionally handled manually, providing the following core services:")}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="space-y-3">
                            <div className="p-4 bg-primary/10 rounded-full inline-block">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("Fishery Registration")}</h3>
                            <p className="text-muted-foreground">{t("We manage the systematic registration of all boats, gears, and fisherfolk within Cantilan's jurisdiction.")}</p>
                        </div>
                         <div className="space-y-3">
                            <div className="p-4 bg-primary/10 rounded-full inline-block">
                                <CheckCircle className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("Inspections and Verification")}</h3>
                            <p className="text-muted-foreground">{t("We facilitate the scheduling and documentation of necessary inspections to ensure compliance with local ordinances and national safety standards.")}</p>
                        </div>
                         <div className="space-y-3">
                            <div className="p-4 bg-primary/10 rounded-full inline-block">
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("Licensing and Compliance")}</h3>
                            <p className="text-muted-foreground">{t("We process and issue official licenses, ensuring that all fishing activities are legal, monitored, and regulated.")}</p>
                        </div>
                         <div className="space-y-3">
                            <div className="p-4 bg-primary/10 rounded-full inline-block">
                                <BarChart className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{t("Data-Driven Governance")}</h3>
                            <p className="text-muted-foreground">{t("By centralizing data on registrations, inspections, and licenses, we provide local authorities with the real-time analytics needed for effective decision-making, resource allocation, and conservation efforts.")}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Our Commitment Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold font-headline">{t("Our Commitment")}</h2>
                    <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">{t("We are committed to serving the community of Cantilan by making regulatory processes accessible and efficient, supporting the sustained vitality of our marine resources and the livelihood of every fisherfolk.")}</p>
                </div>
            </section>

        </div>
    );
}
