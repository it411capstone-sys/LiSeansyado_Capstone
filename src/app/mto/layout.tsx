
'use client';

import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    PanelRight,
    Settings,
    LogOut,
    Wallet
} from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AuthProvider } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

function MtoLayoutContent({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const { user, userData, loading } = useAuth();
    const settingsPath = `/admin/settings`;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Logo />
        </div>
        <div className="flex-1 flex justify-center">
           <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link
                    href="/mto/payments"
                    className="flex items-center gap-2 text-sm font-bold transition-colors px-3 py-2 text-primary"
                >
                    <Wallet className="h-4 w-4" />
                    {t("Payments")}
                </Link>
           </nav>
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <LanguageToggle />
                {loading ? <Skeleton className="h-10 w-10 rounded-full" /> : <UserNav role="mto" />}
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
                        <SheetTitle className="sr-only">MTO Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        <Link
                            href="/mto/payments"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <Wallet className="h-5 w-5" />
                            {t("Payments")}
                        </Link>
                    </nav>
                     <div className="mt-auto flex flex-col gap-4">
                        <Separator />
                        {loading ? (
                             <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ) : (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={userData?.avatarUrl || ''} alt={userData?.displayName || 'MTO'} />
                                <AvatarFallback>{userData?.displayName?.charAt(0) || 'M'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="text-base font-semibold leading-none">{userData?.displayName}</p>
                                <p className="text-sm leading-none text-muted-foreground">{userData?.email}</p>
                            </div>
                        </div>
                        )}
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
    </header>
      <main className="flex flex-1">
          <div className="flex flex-col flex-1 bg-muted/40">
            {children}
          </div>
        </main>
    </div>
  );
}

export default function MtoLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MtoLayoutContent>{children}</MtoLayoutContent>
        </AuthProvider>
    );
}
