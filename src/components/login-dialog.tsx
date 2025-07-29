
'use client';
import { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserCog, ArrowLeft, Loader2, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthToggle } from "./auth-toggle";
import { useTranslation } from "@/contexts/language-context";
import { AdminRoleToggle } from "./admin-role-toggle";

type DialogView = 'role-select' | 'fisherfolk-login' | 'admin-login' | 'fisherfolk-signup';
type AdminRole = 'mao' | 'mto';

const RoleSelectionView = ({ setView }: { setView: (view: DialogView) => void }) => {
    const { t } = useTranslation();
    return (
    <>
        <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold font-headline">{t("Welcome Back")}</DialogTitle>
            <DialogDescription className="text-center">
                {t("Select your role to login to the portal.")}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Button variant="default" size="lg" className="w-full" onClick={() => setView('fisherfolk-login')}>
                <User className="mr-2 h-5 w-5" /> {t("Login as Fisherfolk")}
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => setView('admin-login')}>
                <UserCog className="mr-2 h-5 w-5" /> {t("Login as Admin")}
            </Button>
        </div>
    </>
)};

const FisherfolkLoginView = ({ setView, activeView = 'login' }: { setView: (view: DialogView) => void, activeView?: 'login' | 'signup' }) => {
    const { t } = useTranslation();
    const isLogin = activeView === 'login';

    const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isLogin) {
            e.preventDefault();
            setView('fisherfolk-login');
        }
    };
    
    return (
    <>
        <DialogHeader>
            <div className="flex justify-center pt-4">
                <AuthToggle active={activeView} onLoginClick={() => setView('fisherfolk-login')} onSignupClick={() => setView('fisherfolk-signup')} />
            </div>
             <DialogTitle className="text-2xl font-bold font-headline flex items-center justify-center gap-2 pt-4">
                <User /> {t("Fisherfolk Portal")}
             </DialogTitle>
            <DialogDescription className="text-center">
              {t(isLogin ? 'Enter your credentials to access your account.' : 'Enter your information to create a new account.')}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="first-name">{t("First Name")}</Label>
                        <Input id="first-name" placeholder="Juan" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last-name">{t("Last Name")}</Label>
                        <Input id="last-name" placeholder="Dela Cruz" required />
                    </div>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="email-fisherfolk">{t("Email or Phone")}</Label>
                <Input id="email-fisherfolk" type="text" placeholder="juan.delacruz@email.com" required defaultValue={isLogin ? 'juan.delacruz@email.com' : ''} />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password-fisherfolk">{t("Password")}</Label>
                    {isLogin && (
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                        {t("Forgot your password?")}
                        </Link>
                    )}
                </div>
                <Input id="password-fisherfolk" type="password" required defaultValue={isLogin ? 'password' : ''} />
            </div>
            <Button asChild type="submit" className="w-full">
                <Link href={isLogin ? "/fisherfolk/home" : "#"} onClick={handleButtonClick}>{t(isLogin ? 'Login' : 'Create an Account')}</Link>
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setView('role-select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("Back to Role Selection")}
            </Button>
        </div>
    </>
    );
};

const AdminLoginView = ({ setView }: { setView: (view: DialogView) => void }) => {
    const { t } = useTranslation();
    const [adminRole, setAdminRole] = useState<AdminRole>('mao');

    return (
    <>
        <DialogHeader>
            <div className="flex justify-center pt-4">
                <AdminRoleToggle active={adminRole} onMaoClick={() => setAdminRole('mao')} onMtoClick={() => setAdminRole('mto')} />
            </div>
            <DialogTitle className="text-2xl font-bold font-headline flex items-center justify-center gap-2 pt-4">
                {adminRole === 'mao' ? <Loader2 className="animate-spin" /> : <Wallet />} {adminRole === 'mao' ? "MAO Portal" : "MTO Portal"}
            </DialogTitle>
            <DialogDescription className="text-center">
                {t('Enter your credentials to access the admin dashboard.')}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email-admin">{t("Email")}</Label>
                <Input id="email-admin" type="email" placeholder="m@example.com" required defaultValue={'admin@liseansyado.gov.ph'} />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password-admin">{t("Password")}</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        {t("Forgot your password?")}
                    </Link>
                </div>
                <Input id="password-admin" type="password" required defaultValue={'password'}/>
            </div>
            <Button asChild type="submit" className="w-full">
                <Link href="/admin/dashboard">{t('Login')}</Link>
            </Button>
             <Button variant="ghost" className="w-full" onClick={() => setView('role-select')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t("Back to Role Selection")}
            </Button>
        </div>
    </>
)};

export function LoginDialog({ children, initialView = 'role-select' }: { children: React.ReactNode, initialView?: DialogView }) {
  const [view, setView] = useState<DialogView>(initialView);

  const handleOpenChange = (open: boolean) => {
    if (open) {
        setView(initialView);
    } else {
        setView('role-select');
    }
  }

  const renderView = () => {
    switch (view) {
      case 'fisherfolk-login':
        return <FisherfolkLoginView setView={setView} activeView="login" />;
      case 'fisherfolk-signup':
          return <FisherfolkLoginView setView={setView} activeView="signup" />;
      case 'admin-login':
        return <AdminLoginView setView={setView} />;
      default:
        return <RoleSelectionView setView={setView} />;
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            {renderView()}
        </DialogContent>
    </Dialog>
  );
}
