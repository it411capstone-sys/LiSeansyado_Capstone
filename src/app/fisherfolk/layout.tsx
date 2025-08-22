
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { fisherfolkNavItems } from "@/lib/nav-items";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { users } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function FisherfolkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = users.fisherfolk;

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
                        {fisherfolkNavItems.map(item => (
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
                            <UserNav role="fisherfolk" />
                             <div className="flex flex-col">
                                <p className="text-base font-semibold leading-none">{user.name}</p>
                                <p className="text-sm leading-none text-muted-foreground">{user.email}</p>
                            </div>
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
