
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fisherfolkNavItems } from "@/lib/nav-items";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";

export default function FisherfolkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden sm:block">
              <MainNav role="fisherfolk" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="hidden sm:block">
              <UserNav role="fisherfolk" />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelRight className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-xs flex flex-col">
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        <Logo />
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
                    <div className="mt-auto">
                        <UserNav role="fisherfolk" />
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
