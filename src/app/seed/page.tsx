
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { registrations, payments, feedbacks, verificationSubmissions, notifications, inspections } from "@/lib/data";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SeedPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSeeded, setIsSeeded] = useState(false);

    const seedDatabase = async () => {
        setIsLoading(true);
        try {
            const batch = writeBatch(db);

            // Seed registrations
            registrations.forEach(item => {
                const docRef = doc(db, "registrations", item.id);
                batch.set(docRef, item);
            });

            // Seed payments
            payments.forEach(item => {
                const docRef = doc(db, "payments", item.transactionId);
                batch.set(docRef, item);
            });

            // Seed feedbacks
            feedbacks.forEach(item => {
                const docRef = doc(db, "feedbacks", item.id);
                batch.set(docRef, item);
            });

            // Seed verificationSubmissions
            verificationSubmissions.forEach(item => {
                const docRef = doc(db, "verificationSubmissions", item.id);
                batch.set(docRef, item);
            });
            
            // Seed notifications
            notifications.forEach(item => {
                const docRef = doc(db, "notifications", item.id);
                batch.set(docRef, item);
            });

            // Note: inspections and licenses are empty in data.ts, so this will just ensure collections exist if needed.
            inspections.forEach(item => {
                const docRef = doc(collection(db, "inspections")); // Auto-generate ID if none exists
                batch.set(docRef, { ...item, scheduledDate: new Date(item.scheduledDate) });
            });
            
            // The licenses collection is not defined in data.ts, but we create a placeholder
            // to ensure the collection is created if the user navigates to the page.
            const licenseRef = doc(db, "licenses", "DUMMY-LICENSE");
            batch.set(licenseRef, { name: "Dummy License", status: "Active" });


            await batch.commit();

            toast({
                title: "Database Seeded!",
                description: "Your Firestore database has been populated with initial data.",
            });
            setIsSeeded(true);
        } catch (error) {
            console.error("Error seeding database: ", error);
            toast({
                variant: "destructive",
                title: "Seeding Failed",
                description: "Could not write initial data to Firestore. Check console for errors.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Database Setup</CardTitle>
                    <CardDescription>
                        Click the button below to populate your Firestore database with the necessary collections and initial sample data. You only need to do this once.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSeeded ? (
                        <div className="text-center space-y-4">
                            <p className="text-green-600 font-semibold">Database has been successfully seeded!</p>
                             <Button asChild>
                                <Link href="/login">Proceed to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={seedDatabase} className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Seeding..." : "Seed Database"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
