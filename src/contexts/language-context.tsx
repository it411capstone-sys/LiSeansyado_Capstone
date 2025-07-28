
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { translations as bisayaTranslations, TranslationMap } from '@/lib/translations';

type Language = 'English' | 'Bisaya';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = useCallback((key: string): string => {
    if (language === 'English') {
      return key;
    }
    return bisayaTranslations[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// This hook can be used in any component to get the translation function.
// It simplifies the process of translating text within components.
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};
