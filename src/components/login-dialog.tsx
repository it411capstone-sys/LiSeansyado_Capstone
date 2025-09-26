
'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserCog, ArrowLeft, Files, Wallet, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthToggle } from "./auth-toggle";
import { useTranslation } from "@/contexts/language-context";
import { AdminRoleToggle } from "./admin-role-toggle";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { users } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

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
    const router = useRouter();
    const { setUserData } = useAuth();
    const isLogin = activeView === 'login';
    const { toast } = useToast();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isLoginButtonDisabled = !email || !password || isLoading;
    const isSignupButtonDisabled = !firstName || !lastName || !email || !password || !confirmPassword || password !== confirmPassword || isLoading;


    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const userDocRef = doc(db, "fisherfolk", user.uid);
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
            router.push("/fisherfolk/home");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t("Login Failed"),
                description: t("Invalid credentials. Please try again."),
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "fisherfolk", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                lastActivity: new Date().toISOString(),
                isVerified: false,
                displayName: `${firstName} ${lastName}`,
            });

            toast({
                title: t("Registration Successful"),
                description: t("Your account has been created. Please log in."),
            });
            setView('fisherfolk-login');

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t("Registration Failed"),
                description: t("This email might already be in use. Please try another."),
            });
        } finally {
            setIsLoading(false);
        }
    }
    
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
                        <Input id="first-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last-name">{t("Last Name")}</Label>
                        <Input id="last-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} />
                    </div>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="email-fisherfolk">{t("Email")}</Label>
                <Input id="email-fisherfolk" type="text" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
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
                <div className="relative">
                    <Input id="password-fisherfolk" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </div>
            {!isLogin && (
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="confirm-password-fisherfolk">{t("Confirm Password")}</Label>
                    </div>
                    <div className="relative">
                        <Input id="confirm-password-fisherfolk" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                        >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </Button>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-destructive">Passwords do not match.</p>
                    )}
                </div>
            )}
            <Button 
                type="submit" 
                className="w-full" 
                disabled={isLogin ? isLoginButtonDisabled : isSignupButtonDisabled}
                onClick={isLogin ? handleLogin : handleSignup}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t(isLogin ? 'Login' : 'Create an Account')}
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
    const [email, setEmail] = useState('mao.liseansyado@gmail.com');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const isButtonDisabled = !email || !password || isLoading;

    useEffect(() => {
        if (adminRole === 'mao') {
            setEmail(users.admin.email);
        } else {
            setEmail(users.mto.email);
        }
    }, [adminRole]);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);

            let role = '';
             if (email === users.admin.email) {
                role = 'mao';
            } else if (email === users.mto.email) {
                role = 'mto';
            }

            if (role === "mao") {
                router.push(`/admin/dashboard`);
            } else if (role === "mto") {
                router.push(`/mto/payments`);
            }

        } catch(error: any) {
            toast({
                variant: "destructive",
                title: t("Login Failed"),
                description: t("Invalid credentials. Please try again."),
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
    <>
        <DialogHeader>
            <div className="flex justify-center pt-4">
                <AdminRoleToggle active={adminRole} onMaoClick={() => setAdminRole('mao')} onMtoClick={() => setAdminRole('mto')} />
            </div>
            <DialogTitle className="text-2xl font-bold font-headline flex items-center justify-center gap-2 pt-4">
                {adminRole === 'mao' ? <Files /> : <Wallet />} {adminRole === 'mao' ? "MAO Portal" : "MTO Portal"}
            </DialogTitle>
            <DialogDescription className="text-center">
                {t(adminRole === 'mao' ? 'Enter your credentials to access the admin dashboard.' : 'Enter your credentials to access the treasury dashboard')}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email-admin">{t("Email")}</Label>
                <Input id="email-admin" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password-admin">{t("Password")}</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        {t("Forgot your password?")}
                    </Link>
                </div>
                <div className="relative">
                    <Input id="password-admin" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </div>
            <Button 
                type="submit" 
                className="w-full" 
                disabled={isButtonDisabled}
                onClick={handleLogin}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('Login')}
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
