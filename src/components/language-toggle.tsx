
'use client';

import { useLanguage } from '@/contexts/language-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  const isEnglish = language === 'English';

  const toggleLanguage = () => {
    setLanguage(isEnglish ? 'Bisaya' : 'English');
  };

  return (
    <div
      onClick={toggleLanguage}
      className={cn(
          "relative flex cursor-pointer items-center rounded-full border border-input p-1",
          isMobile ? "w-24" : "w-36"
      )}
    >
      <div
        className={cn(
          'absolute h-7 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-300 ease-in-out',
          !isEnglish && 'translate-x-[calc(100%)]'
        )}
      />
      <span
        className={cn(
          'z-10 flex h-7 w-1/2 items-center justify-center rounded-full text-xs font-medium transition-colors uppercase',
          isEnglish ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {isMobile ? "Eng" : "English"}
      </span>
      <span
        className={cn(
          'z-10 flex h-7 w-1/2 items-center justify-center rounded-full text-xs font-medium transition-colors uppercase',
          !isEnglish ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {isMobile ? "Bis" : "Bisaya"}
      </span>
    </div>
  );
}
