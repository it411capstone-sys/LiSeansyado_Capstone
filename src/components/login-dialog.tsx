
'use client';
import { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserCog, ArrowLeft, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthToggle } from "./auth-toggle";

type DialogView = 'role-select' | 'fisherfolk-login' | 'admin-login' | 'fisherfolk-signup';

const RoleSelectionView = ({ setView }: { setView: (view: DialogView) => void }) => (
    <>
        <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold font-headline">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">
                Select your role to login to the portal.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Button variant="default" size="lg" className="w-full" onClick={() => setView('fisherfolk-login')}>
                <User className="mr-2 h-5 w-5" /> Login as Fisherfolk
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => setView('admin-login')}>
                <UserCog className="mr-2 h-5 w-5" /> Login as Admin
            </Button>
        </div>
    </>
);

const FisherfolkLoginView = ({ setView }: { setView: (view: DialogView) => void }) => (
    <>
        <DialogHeader>
            <div className="flex justify-center pt-4">
                <AuthToggle active="login" onLoginClick={() => setView('fisherfolk-login')} onSignupClick={() => setView('fisherfolk-signup')} />
            </div>
             <h1 className="text-2xl font-bold font-headline flex items-center justify-center gap-2 pt-4">
                <User /> Fisherfolk Portal
            </h1>
            <DialogDescription className="text-center">
              Enter your credentials to access your account.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email-fisherfolk">Email or Phone</Label>
                <Input id="email-fisherfolk" type="text" placeholder="juan.delacruz@email.com" required defaultValue="juan.delacruz@email.com" />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password-fisherfolk">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                    </Link>
                </div>
                <Input id="password-fisherfolk" type="password" required defaultValue="password" />
            </div>
            <Button asChild type="submit" className="w-full">
                <Link href="/fisherfolk/home">Login</Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setView('role-select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
            </Button>
        </div>
    </>
);

const FisherfolkRegisterView = ({ setView }: { setView: (view: DialogView) => void }) => (
    <>
        <DialogHeader>
            <div className="flex justify-center pt-4">
                <AuthToggle active="signup" onLoginClick={() => setView('fisherfolk-login')} onSignupClick={() => setView('fisherfolk-signup')} />
            </div>
            <h1 className="text-2xl font-bold mt-4 font-headline flex items-center justify-center gap-2">
                <UserPlus /> Create an Account
            </h1>
            <DialogDescription className="text-center">
              Enter your information to create a new account.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <Label htmlFor="email-register">Email</Label>
              <Input id="email-register" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-register">Password</Label>
              <Input id="password-register" type="password" required />
            </div>
            <Button asChild type="submit" className="w-full">
                <Link href="/fisherfolk/home">Create an account</Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setView('role-select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
            </Button>
        </div>
    </>
);


const AdminLoginView = ({ setView }: { setView: (view: DialogView) => void }) => (
    <>
        <DialogHeader>
            <h1 className="text-2xl font-bold font-headline flex items-center justify-center gap-2">
                <UserCog /> Admin Portal
            </h1>
            <DialogDescription className="text-center">
                Enter your credentials to access the admin dashboard.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email-admin">Email</Label>
                <Input id="email-admin" type="email" placeholder="m@example.com" required defaultValue="admin@liseansyado.gov.ph" />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password-admin">Password</Label>
                     <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                </div>
                <Input id="password-admin" type="password" required defaultValue="password" />
            </div>
            <Button asChild type="submit" className="w-full">
                <Link href="/admin/dashboard">Login</Link>
            </Button>
             <Button variant="ghost" className="w-full" onClick={() => setView('role-select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Role Selection
            </Button>
        </div>
    </>
);

export function LoginDialog({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<DialogView>('role-select');

  const renderView = () => {
    switch (view) {
      case 'fisherfolk-login':
        return <FisherfolkLoginView setView={setView} />;
      case 'fisherfolk-signup':
          return <FisherfolkRegisterView setView={setView} />;
      case 'admin-login':
        return <AdminLoginView setView={setView} />;
      default:
        return <RoleSelectionView setView={setView} />;
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setView('role-select')}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            {renderView()}
        </DialogContent>
    </Dialog>
  );
}
