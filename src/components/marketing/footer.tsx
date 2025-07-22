
'use client';
import { useTranslation } from '@/contexts/language-context';

const translationKeys = ["© 2024 LiSEAnsyado. All Rights Reserved."];

export function MarketingFooter() {
    const { t } = useTranslation(translationKeys);
    return (
        <footer className="bg-primary/5 text-center text-sm text-foreground/60 py-6">
            {t("© 2024 LiSEAnsyado. All Rights Reserved.").replace("2024", new Date().getFullYear().toString())}
        </footer>
    );
}
