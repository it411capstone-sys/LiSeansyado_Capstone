
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, PanelLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LoginDialog } from '@/components/login-dialog';
import { LanguageToggle } from '@/components/language-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MarketingHeader() {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="md:hidden">
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
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                                    pathname === item.href && "text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="hidden md:block">
                <Logo />
            </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-foreground/70 hover:text-primary hover:font-bold",
                  isActive && "text-primary font-bold"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <LoginDialog>
                <Button variant="default" className="rounded-full">
                    <User className="h-6 w-6 text-primary-foreground transition-colors" />
                    <span className="sr-only">Login</span>
                </Button>
            </LoginDialog>
        </div>
    </header>
  );
}
