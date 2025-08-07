
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    Bell,
    CalendarCheck,
    FileText,
    Home,
    MessageSquare,
    PanelLeft,
    BarChart2,
    Wallet,
} from "lucide-react"
import { LanguageToggle } from "../language-toggle";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/inspections', label: 'Inspections', icon: CalendarCheck },
    { href: '/admin/payments', label: 'Payments', icon: Wallet },
    { href: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
];

const mtoNavItems = [
    { href: '/admin/payments', label: 'Payments', icon: Wallet },
];

function AdminHeaderContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const role = roleParam === 'mto' ? 'mto' : 'admin';
  const navItems = role === 'mto' ? mtoNavItems : adminNavItems;


  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo />
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={`${item.href}?role=${role}`}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="hidden sm:block ml-4">
                <Logo />
            </div>
        </div>
        <div className="flex-1 flex justify-center">
            <div className="hidden sm:block">
                <MainNav role={role} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <UserNav role={role} />
        </div>
    </header>
  );
}

export function AdminHeader() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminHeaderContent />
        </Suspense>
    )
}

    