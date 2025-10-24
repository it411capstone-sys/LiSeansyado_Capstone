
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AuditLogAction } from '@/lib/types';

type AdminRole = 'mao' | 'mto';

const createAuditLog = async (userId: string, userName: string, action: AuditLogAction, targetId: string, role: string) => {
    try {
        await addDoc(collection(db, "auditLogs"), {
            timestamp: new Date(),
            userId: userId,
            userName: userName,
            action: action,
            target: {
                type: 'user',
                id: targetId,
            },
            details: {
                role: role
            }
        });
    } catch (error) {
        console.error("Error writing audit log: ", error);
    }
};

export default function AdminSetupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<AdminRole>('mao');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name || !email || !password) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all fields.',
            });
            setIsLoading(false);
            return;
        }

        try {
            // Step 1: Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 2: Create user document in 'admins' collection in Firestore
            await setDoc(doc(db, "admins", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: role,
            });
            
            await createAuditLog(user.uid, name, 'USER_CREATED', user.uid, role);

            toast({
                title: 'Admin Account Created',
                description: `Successfully registered ${name} as an ${role.toUpperCase()} user.`,
            });
            
            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setRole('mao');

        } catch (error: any) {
            console.error("Error creating admin user:", error);
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <UserPlus className="mx-auto h-8 w-8 text-primary"/>
                    <CardTitle className="text-2xl font-bold font-headline mt-2">Create Admin Account</CardTitle>
                    <CardDescription>
                        This page is for authorized personnel to register new administrators.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Juan Dela Cruz"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="e.g., mao.admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <RadioGroup
                                value={role}
                                onValueChange={(value: string) => setRole(value as AdminRole)}
                                className="flex gap-4"
                                disabled={isLoading}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mao" id="mao" />
                                    <Label htmlFor="mao">MAO (Admin)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mto" id="mto" />
                                    <Label htmlFor="mto">MTO (Treasury)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                             <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                                ) : (
                                    'Register Admin'
                                )}
                            </Button>
                             <Button variant="outline" className="w-full" asChild>
                                <Link href="/login/admin">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Go to Admin Login
                                </Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
