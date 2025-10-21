
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { ArrowLeft, Files, Wallet, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminRoleToggle } from '@/components/admin-role-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Admin } from '@/lib/types';
import { useRouter } from 'next/navigation';

type AdminRole = 'mao' | 'mto';

export default function AdminLoginPage() {
  const [adminRole, setAdminRole] = useState<AdminRole>('mao');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as Admin;
        if (adminData.role === "mao") {
          router.push(`/admin/dashboard`);
        } else if (adminData.role === "mto") {
          router.push(`/mto/payments`);
        } else {
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: "Could not determine user role for this account.",
            });
        }
      } else {
         toast({
          variant: "destructive",
          title: "Login Failed",
          description: "No admin record found for this user.",
        });
      }
      
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
      });
      console.error("Error during login:", error.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login/admin`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for a link to reset your password.",
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: error.code === 'auth/too-many-requests' 
            ? "Too many requests. Please try again later."
            : "Could not send password reset email. Please check if the email is correct.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleRoleChange = (role: AdminRole) => {
    setAdminRole(role);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center" />
             <div className="flex justify-center pt-4">
                <AdminRoleToggle active={adminRole} onMaoClick={() => handleRoleChange('mao')} onMtoClick={() => handleRoleChange('mto')} />
            </div>
            <h1 className="text-3xl font-bold mt-4 font-headline flex items-center justify-center gap-2">
              {adminRole === 'mao' ? <Files /> : <Wallet />} {adminRole === 'mao' ? 'MAO Portal' : 'MTO Portal'}
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access the {adminRole === 'mao' ? 'MAO' : 'MTO'} dashboard.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
               <Button
                  variant="link"
                  className="ml-auto -mt-2 h-auto p-0 text-sm"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot your password?
                </Button>
            </div>
            <Button onClick={handleLogin} type="button" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
          </div>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/1/1200/900"
          data-ai-hint="philippine coastline"
          alt="Image of Cantilan coastline"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
