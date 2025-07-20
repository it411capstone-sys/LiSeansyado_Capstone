
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { AuthToggle } from '@/components/auth-toggle';

export default function RegisterPage() {
    const router = useRouter();
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center" />
             <div className="flex justify-center pt-4">
              <AuthToggle active="signup" onLoginClick={() => router.push('/login/fisherfolk')} onSignupClick={() => {}} />
            </div>
            <h1 className="text-3xl font-bold mt-4 font-headline flex items-center justify-center gap-2">
                <UserPlus /> Create an Account
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create a new account.
            </p>
          </div>
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Juan" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Dela Cruz" required />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href="/fisherfolk/home">Create an account</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
                </Link>
            </Button>
          </form>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1200x900.png"
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
