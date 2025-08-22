
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    PanelRight,
} from "lucide-react"
import { LanguageToggle } from "../language-toggle";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { adminNavItems, mtoNavItems } from "@/lib/nav-items";
import { Separator } from "../ui/separator";
import { users } from "@/lib/data";

function AdminHeaderContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const role = roleParam === 'mto' ? 'mto' : 'admin';
  const navItems = role === 'mto' ? mtoNavItems : adminNavItems;
  const user = users[role];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Logo />
        </div>
        <div className="flex-1 flex justify-center">
            <MainNav role={role} />
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <LanguageToggle />
                <UserNav role={role} />
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
                        <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium mt-8">
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
                     <div className="mt-auto flex flex-col gap-4">
                        <Separator />
                        <div className="flex items-center gap-3">
                            <UserNav role={role} />
                            <div className="flex flex-col">
                                <p className="text-base font-semibold leading-none">{user.name}</p>
                                <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
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
