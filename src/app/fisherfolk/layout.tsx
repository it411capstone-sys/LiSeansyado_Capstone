
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { PanelRight, Settings, LogOut } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { fisherfolkNavItems } from "@/lib/nav-items";
import Link from "next/link";
import { users, verificationSubmissions } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import { UserNav } from "@/components/user-nav";
import { AuthProvider, AuthContext } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";

function FisherfolkLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, userData } = useAuth();
  const { t } = useTranslation();
  const settingsPath = '/fisherfolk/settings';

  const userVerification = useMemo(() => 
      verificationSubmissions.find(sub => sub.fisherfolkName === userData?.displayName), 
  [userData]);

  const isVerified = useMemo(() => 
      userVerification && 
      userVerification.fishRStatus === 'Approved' &&
      userVerification.boatRStatus === 'Approved' &&
      userVerification.barangayCertStatus === 'Approved' &&
      userVerification.cedulaStatus === 'Approved',
  [userVerification]);
  
  const mobileNavItems = isVerified 
      ? fisherfolkNavItems 
      : fisherfolkNavItems.filter(item => item.href !== '/fisherfolk/register');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo />
          </div>
          <div className="flex-1 flex justify-center">
            <MainNav role="fisherfolk" />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <LanguageToggle />
                <UserNav role="fisherfolk" />
            </div>
            <div className="flex sm:hidden items-center gap-2">
                <LanguageToggle />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelRight className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-xs flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="sr-only">Fisherfolk Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        {mobileNavItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-4">
                        <Separator/>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={userData?.displayName || ''} />
                                <AvatarFallback>{userData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                             <div className="flex flex-col">
                                <p className="text-base font-semibold leading-none">{userData?.displayName || 'User'}</p>
                                <p className="text-sm leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <div className="grid gap-2 text-sm">
                            <Link href={settingsPath} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                <Settings className="h-4 w-4" />
                                <span>{t("Settings")}</span>
                            </Link>
                             <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                <LogOut className="h-4 w-4" />
                                <span>{t("Log out")}</span>
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}


export default function FisherfolkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <FisherfolkLayoutContent>{children}</FisherfolkLayoutContent>
    </AuthProvider>
  )
}
