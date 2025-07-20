
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { translateText } from '@/ai/flows/translate-text';

type Language = 'English' | 'Bisaya';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('English');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'English') {
      setTranslations({});
    }
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations,
    setTranslations,
    isLoading,
    setIsLoading,
  }), [language, setLanguage, translations, isLoading]);

  return (
    <LanguageContext.Provider value={value as LanguageContextType}>
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

export const useTranslation = (keys: string[]) => {
  const { language, translations, setTranslations, isLoading, setIsLoading } = useContext(LanguageContext) as any;

  React.useEffect(() => {
    const fetchTranslations = async () => {
      if (language === 'Bisaya' && keys.length > 0) {
        const untranslatedKeys = keys.filter(key => !translations[key]);
        if (untranslatedKeys.length > 0) {
          setIsLoading(true);
          try {
            const result = await translateText({ texts: untranslatedKeys, targetLanguage: 'Bisaya' });
            const newTranslations = { ...translations };
            untranslatedKeys.forEach((key, index) => {
              newTranslations[key] = result.translations[index];
            });
            setTranslations(newTranslations);
          } catch (error) {
            console.error('Translation failed:', error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    fetchTranslations();
  }, [language, keys, translations, setTranslations, setIsLoading]);

  const t = (key: string): string => {
    if (isLoading) return '...';
    if (language === 'English') {
      return key;
    }
    return translations[key] || key;
  };

  return { t, isLoading };
};
