
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LoginDialog } from '@/components/login-dialog';
import { LanguageToggle } from '@/components/language-toggle';
import { useTranslation } from '@/contexts/language-context';

const translationKeys = [ "Login", "Home", "About Us", "Contact" ];

export function MarketingHeader() {
    const { t } = useTranslation(translationKeys);

  return (
    <header className="container z-10 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground/70 hover:text-foreground">{t("Home")}</Link>
            <Link href="/about" className="text-foreground/70 hover:text-foreground">{t("About Us")}</Link>
            <Link href="/contact" className="text-foreground/70 hover:text-foreground">{t("Contact")}</Link>
        </nav>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <LoginDialog>
                <Button>{t("Login")} <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </LoginDialog>
        </div>
    </header>
  );
}
