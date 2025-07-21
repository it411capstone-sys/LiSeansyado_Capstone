
'use client';
import { useTranslation } from '@/contexts/language-context';

const translationKeys = ["© 2024 LiSEAnsyado. All Rights Reserved."];

export function MarketingFooter() {
    const { t } = useTranslation(translationKeys);
    return (
        <footer className="bg-primary/5 text-center text-sm text-foreground/60 overflow-hidden">
            <div className="relative">
                <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="hsl(var(--background))">
                    <path d="M0,50 C480,150 960,-50 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
                <div className="py-6">
                    {t("© 2024 LiSEAnsyado. All Rights Reserved.").replace("2024", new Date().getFullYear().toString())}
                </div>
            </div>
        </footer>
    );
}
