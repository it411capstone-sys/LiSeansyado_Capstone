
'use client';

import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const isEnglish = language === 'English';

  const toggleLanguage = () => {
    setLanguage(isEnglish ? 'Bisaya' : 'English');
  };

  return (
    <div
      onClick={toggleLanguage}
      className="relative flex w-24 cursor-pointer items-center rounded-full border border-input p-1"
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
        Eng
      </span>
      <span
        className={cn(
          'z-10 flex h-7 w-1/2 items-center justify-center rounded-full text-xs font-medium transition-colors uppercase',
          !isEnglish ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        Bis
      </span>
    </div>
  );
}
