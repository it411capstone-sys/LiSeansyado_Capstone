
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { ArrowLeft, Files, Wallet } from 'lucide-react';
import { useState } from 'react';
import { AdminRoleToggle } from '@/components/admin-role-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AdminRole = 'mao' | 'mto';

export default function AdminLoginPage() {
  const [adminRole, setAdminRole] = useState<AdminRole>('mao');
  const loginLink = adminRole === 'mao' ? "/admin/dashboard" : "/mto/dashboard";

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center" />
             <div className="flex justify-center pt-4">
                <AdminRoleToggle active={adminRole} onMaoClick={() => setAdminRole('mao')} onMtoClick={() => setAdminRole('mto')} />
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
                defaultValue="admin@liseansyado.gov.ph"
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
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button asChild type="submit" className="w-full">
              <Link href={loginLink}>Login</Link>
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
