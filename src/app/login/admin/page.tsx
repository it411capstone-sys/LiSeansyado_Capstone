
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { ArrowLeft, Files, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminRoleToggle } from '@/components/admin-role-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { users } from '@/lib/data';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type AdminRole = 'mao' | 'mto';

export default function AdminLoginPage() {
  const [adminRole, setAdminRole] = useState<AdminRole>('mao');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Role-based redirection after successful login
      let role = '';
      if (email === users.admin.email) {
        role = 'mao';
      } else if (email === users.mto.email) {
        role = 'mto';
      }
      
      if (role === "mao") {
        window.location.href = `/admin/dashboard`;
      } else if (role === "mto") {
        window.location.href = `/mto/payments`;
      } else {
        // This case should ideally not be reached if emails are managed properly
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not determine user role for this account.",
        });
      }
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
      });
      console.error("Error during login:", error.message);
    }
  };


  useEffect(() => {
    if (adminRole === 'mao') {
        setEmail(users.admin.email);
    } else {
        setEmail(users.mto.email);
    }
    setPassword('');
  }, [adminRole]);

  const handleRoleChange = (role: AdminRole) => {
    setAdminRole(role);
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
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} type="button" className="w-full">
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
          src="https://placehold.co/1200x900.png"
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
