
'use client';
import { useTranslation } from '@/contexts/language-context';

export function MarketingFooter() {
    const { t } = useTranslation();
    return (
        <footer className="bg-primary/5 text-center text-sm text-foreground/60 py-6">
            {t("© 2025 LiSEAnsyado. All Rights Reserved.")}
        </footer>
    );
}
