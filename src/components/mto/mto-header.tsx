
'use client';
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    Home,
    PanelLeft,
    BarChart2,
    Wallet,
    Settings,
} from "lucide-react"
import { LanguageToggle } from "../language-toggle";
import { MainNav } from "../main-nav";

const mtoNavItems = [
    { href: '/mto/payments', label: 'Payments', icon: Wallet },
];

export function MtoHeader() {
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
                        {mtoNavItems.map(item => (
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
                </SheetContent>
            </Sheet>
            <div className="hidden sm:block ml-4">
                <Logo />
            </div>
        </div>
        <div className="flex-1 flex justify-center">
            <div className="hidden sm:block">
                <MainNav role="mto" />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <UserNav role="mto" />
        </div>
    </header>
  );
}
