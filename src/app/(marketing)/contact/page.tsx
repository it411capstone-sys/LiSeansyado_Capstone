
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/language-context";
import { Mail, MapPin, Phone, Fish, Ship, LifeBuoy, Anchor, Waves, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || !email || !subject || !message) {
            toast({
                variant: 'destructive',
                title: 'Incomplete Form',
                description: 'Please fill out all fields.',
            });
            setIsLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "contactMessages"), {
                name,
                email,
                subject,
                message,
                submittedAt: new Date().toISOString(),
                status: 'New'
            });

            toast({
                title: 'Message Sent!',
                description: "Thank you for contacting us. We'll get back to you shortly.",
            });

            // Reset form
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');

        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'There was an error sending your message. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex-grow">
            {/* Hero Section */}
            <section className="relative bg-primary/5 text-primary overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">{t("Get In Touch")}</h1>
                    <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">{t("We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.")}</p>
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

            {/* Contact Form & Details Section */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
                    {/* Contact Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Contact Form")}</CardTitle>
                            <CardDescription>{t("Send us your questions or feedback.")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t("Your Name")}</Label>
                                    <Input id="name" placeholder={t("Your Name")} value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="email">{t("Your Email")}</Label>
                                    <Input id="email" type="email" placeholder={t("Your Email")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="subject">{t("Subject")}</Label>
                                    <Input id="subject" placeholder={t("Subject")} value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">{t("Your Message")}</Label>
                                    <Textarea id="message" placeholder={t("Your Message")} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} disabled={isLoading}/>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t("Send Message")}
                                </Button>
                            </form>
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
