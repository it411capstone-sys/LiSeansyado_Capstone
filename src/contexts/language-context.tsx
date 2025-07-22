
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { translateText } from '@/ai/flows/translate-text';

type Language = 'English' | 'Bisaya';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  isLoading: boolean;
  registerTranslationKeys: (keys: string[]) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('English');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registeredKeys, setRegisteredKeys] = useState<Set<string>>(new Set());

  const registerTranslationKeys = useCallback((keys: string[]) => {
    setRegisteredKeys((prevKeys) => {
        const newKeys = new Set(prevKeys);
        let updated = false;
        keys.forEach(key => {
            if (!newKeys.has(key)) {
                newKeys.add(key);
                updated = true;
            }
        });
        return updated ? newKeys : prevKeys;
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'English') {
      // No translations needed for English, reset if necessary
      // If you want to keep cached translations, you can comment this out.
      // setTranslations({}); 
    } else if (lang === 'Bisaya') {
      const keysToTranslate = Array.from(registeredKeys).filter(key => !translations[key]);
      if (keysToTranslate.length > 0) {
        setIsLoading(true);
        try {
          const result = await translateText({ texts: keysToTranslate, targetLanguage: 'Bisaya' });
          const newTranslations = { ...translations };
          keysToTranslate.forEach((key, index) => {
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
  }, [registeredKeys, translations]);

  useEffect(() => {
    // When keys are registered, if we are already in Bisaya, fetch translations for new keys.
    if (language === 'Bisaya') {
        const keysToTranslate = Array.from(registeredKeys).filter(key => !translations[key]);
        if (keysToTranslate.length > 0) {
            setIsLoading(true);
            translateText({ texts: keysToTranslate, targetLanguage: 'Bisaya' })
                .then(result => {
                    setTranslations(prev => {
                        const newTranslations = { ...prev };
                        keysToTranslate.forEach((key, index) => {
                            newTranslations[key] = result.translations[index];
                        });
                        return newTranslations;
                    });
                })
                .catch(error => console.error('Translation failed:', error))
                .finally(() => setIsLoading(false));
        }
    }
  }, [registeredKeys, language, translations]);


  const value = useMemo(() => ({
    language,
    setLanguage,
    translations,
    isLoading,
    registerTranslationKeys,
  }), [language, setLanguage, translations, isLoading, registerTranslationKeys]);

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

export const useTranslation = (keys: string[]) => {
  const { language, translations, isLoading, registerTranslationKeys } = useLanguage();
  
  const memoizedKeys = useMemo(() => keys, [keys.join(',')]);

  useEffect(() => {
    if (memoizedKeys.length > 0) {
      registerTranslationKeys(memoizedKeys);
    }
  }, [memoizedKeys, registerTranslationKeys]);

  const t = (key: string): string => {
    if (isLoading) return '...';
    if (language === 'English') {
      return key;
    }
    return translations[key] || key;
  };

  return { t, isLoading };
};
