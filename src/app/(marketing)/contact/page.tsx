
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/language-context";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const translationKeys = [
    "Get In Touch",
    "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
    "Contact Form",
    "Send us your questions or feedback.",
    "Your Name",
    "Your Email",
    "Subject",
    "Your Message",
    "Send Message",
    "Our Office",
    "Municipal Hall, Cantilan, Surigao del Sur",
    "Email Us",
    "liseansyado@cantilan.gov.ph",
    "Call Us",
    "(086) 123-4567"
];

export default function ContactPage() {
    const { t } = useTranslation(translationKeys);

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
                    <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">{t("Get In Touch")}</h1>
                    <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">{t("We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.")}</p>
                </div>
            </section>

            {/* Contact Form & Details Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
                    {/* Contact Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Contact Form")}</CardTitle>
                            <CardDescription>{t("Send us your questions or feedback.")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("Your Name")}</Label>
                                <Input id="name" placeholder={t("Your Name")} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">{t("Your Email")}</Label>
                                <Input id="email" type="email" placeholder={t("Your Email")} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="subject">{t("Subject")}</Label>
                                <Input id="subject" placeholder={t("Subject")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">{t("Your Message")}</Label>
                                <Textarea id="message" placeholder={t("Your Message")} rows={5} />
                            </div>
                            <Button type="submit" className="w-full">{t("Send Message")}</Button>
                        </CardContent>
                    </Card>

                    {/* Contact Details */}
                    <div className="space-y-8">
                         <div>
                            <Image src="https://placehold.co/600x400.png" data-ai-hint="philippine municipal hall" alt="Municipal Hall" width={600} height={400} className="rounded-lg shadow-md" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t("Our Office")}</h3>
                                    <p className="text-muted-foreground">{t("Municipal Hall, Cantilan, Surigao del Sur")}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t("Email Us")}</h3>
                                    <p className="text-muted-foreground">{t("liseansyado@cantilan.gov.ph")}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{t("Call Us")}</h3>
                                    <p className="text-muted-foreground">{t("(086) 123-4567")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
