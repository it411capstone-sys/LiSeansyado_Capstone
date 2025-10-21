
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { User, ArrowLeft, Loader2 } from 'lucide-react';
import { AuthToggle } from '@/components/auth-toggle';
import { useState, Suspense } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

function FisherfolkLoginPageContent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingReset, setIsSendingReset] = useState(false);
    const { toast } = useToast();
    const { setUserData } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userDocRef = doc(db, "fisherfolk", user.uid);
        
        // Update last activity timestamp
        await updateDoc(userDocRef, { lastActivity: new Date().toISOString() });

        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const fetchedData = userDoc.data();
            const fullUserData = { 
                ...fetchedData, 
                displayName: `${fetchedData.firstName} ${fetchedData.lastName}`
            };
            setUserData(fullUserData);
        }
        
        router.push('/fisherfolk/home');
      } catch (error: any) {
        console.error("Error during login:", error.message);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password.",
        });
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

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, email);
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
      setIsSendingReset(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center" />
             <div className="flex justify-center pt-4">
              <AuthToggle active="login" onLoginClick={() => {}} onSignupClick={() => router.push('/register')} />
            </div>
            <h1 className="text-3xl font-bold mt-4 font-headline flex items-center justify-center gap-2">
                <User /> Fisherfolk Portal
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="juan.delacruz@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSendingReset}
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
                disabled={isLoading || isSendingReset}
              />
              <Button
                  variant="link"
                  type="button"
                  className="ml-auto -mt-2 h-auto p-0 text-sm"
                  onClick={handleForgotPassword}
                  disabled={isLoading || isSendingReset}
                >
                  {isSendingReset ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Forgot your password?
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isSendingReset}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
                </Link>
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline text-primary">
              Register here
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/2/1200/900"
          data-ai-hint="philippine fisherfolk"
          alt="Image of a Filipino fisherfolk"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default function FisherfolkLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FisherfolkLoginPageContent />
        </Suspense>
    )
}
