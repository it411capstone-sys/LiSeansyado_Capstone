
'use client';
import { useTranslation } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Fish, Ship, LifeBuoy, Anchor, Waves } from "lucide-react";

const translationKeys = [
    "About LiSEAnsyado",
    "Digitalizing Fishery Registration for a Sustainable Future",
    "Our Mission",
    "To empower the fisherfolk of Cantilan by providing a streamlined, accessible, and transparent digital platform for vessel and gear registration. We aim to enhance compliance, improve maritime safety, and ensure that our local fishing community can easily access government support and services.",
    "Our Vision",
    "A thriving and sustainable marine ecosystem in Cantilan, supported by a fully-digitalized and data-driven fishery management system that benefits every fisherfolk, the local government, and the environment.",
    "The LiSEAnsyado Project",
    "LiSEAnsyado is a pioneering initiative by the Local Government Unit of Cantilan to modernize its fishery registration and compliance system. The name itself, a blend of 'License' and 'Ansyado' (a local term for 'ready' or 'prepared'), reflects our goal: to get every fisherfolk licensed and ready for a more organized and sustainable fishing industry. This portal is the heart of the project, designed to be user-friendly for fisherfolk and a powerful tool for administrators.",
    "Meet the Team",
    "The dedicated individuals behind the LiSEAnsyado project.",
    "Jane Doe",
    "Project Manager",
    "John Smith",
    "Lead Developer",
    "Maria Cruz",
    "UI/UX Designer",
    "Pedro Reyes",
    "Community Coordinator",
    "Get In Touch",
    "Have questions or want to get involved? Contact us.",
    "Contact Us",
];

export default function AboutPage() {
    const { t } = useTranslation(translationKeys);

    const teamMembers = [
        { name: "Jane Doe", role: "Project Manager", avatar: "https://i.pravatar.cc/150?u=jane" },
        { name: "John Smith", role: "Lead Developer", avatar: "https://i.pravatar.cc/150?u=john" },
        { name: "Maria Cruz", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?u=maria" },
        { name: "Pedro Reyes", role: "Community Coordinator", avatar: "https://i.pravatar.cc/150?u=pedro" },
    ];

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

            {/* Mission and Vision Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-headline">{t("Our Mission")}</h2>
                        <p className="text-foreground/80 leading-relaxed">{t("To empower the fisherfolk of Cantilan by providing a streamlined, accessible, and transparent digital platform for vessel and gear registration. We aim to enhance compliance, improve maritime safety, and ensure that our local fishing community can easily access government support and services.")}</p>
                    </div>
                     <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-headline">{t("Our Vision")}</h2>
                        <p className="text-foreground/80 leading-relaxed">{t("A thriving and sustainable marine ecosystem in Cantilan, supported by a fully-digitalized and data-driven fishery management system that benefits every fisherfolk, the local government, and the environment.")}</p>
                    </div>
                </div>
            </section>
            
            {/* The Project Section */}
            <section className="py-12 md:py-24 bg-muted/40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                     <div>
                        <Image src="https://placehold.co/600x400.png" data-ai-hint="philippine government office" alt="LGU Cantilan office" width={600} height={400} className="rounded-lg shadow-md" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold font-headline">{t("The LiSEAnsyado Project")}</h2>
                        <p className="text-foreground/80 leading-relaxed">{t("LiSEAnsyado is a pioneering initiative by the Local Government Unit of Cantilan to modernize its fishery registration and compliance system. The name itself, a blend of 'License' and 'Ansyado' (a local term for 'ready' or 'prepared'), reflects our goal: to get every fisherfolk licensed and ready for a more organized and sustainable fishing industry. This portal is the heart of the project, designed to be user-friendly for fisherfolk and a powerful tool for administrators.")}</p>
                    </div>
                </div>
            </section>
            
            {/* Team Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">{t("Meet the Team")}</h2>
                        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">{t("The dedicated individuals behind the LiSEAnsyado project.")}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map(member => (
                            <Card key={member.name} className="text-center">
                                <CardContent className="pt-6">
                                    <Avatar className="w-24 h-24 mx-auto mb-4">
                                        <AvatarImage src={member.avatar} alt={t(member.name)} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold">{t(member.name)}</h3>
                                    <p className="text-primary">{t(member.role)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
