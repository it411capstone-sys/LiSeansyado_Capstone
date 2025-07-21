
'use client';
import { useTranslation } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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
            <section className="relative bg-primary/5 py-20 md:py-32">
                 <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                    <svg className="w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="none" fill="hsl(var(--primary) / 0.1)">
                    <path d="M0,256L48,250.7C96,245,192,235,288,202.7C384,171,480,117,576,117.3C672,117,768,171,864,197.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    </svg>
                </div>
                <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">{t("About LiSEAnsyado")}</h1>
                    <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">{t("Digitalizing Fishery Registration for a Sustainable Future")}</p>
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
