'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '@/translations';

interface LanguageContextType {
  lang: Locale;
  changeLanguage: (newLang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Locale>('es'); // Default to 'es' (Spanish/LATAM)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read initial language on client mount
    const savedLang = localStorage.getItem('mokdaLanguage');
    const cleanLang = savedLang?.toLowerCase() as Locale;
    if (cleanLang && ['es', 'ko', 'en'].includes(cleanLang)) {
      setLang(cleanLang);
    }
    setMounted(true);
  }, []);

  const changeLanguage = (newLang: Locale) => {
    setLang(newLang);
    localStorage.setItem('mokdaLanguage', newLang.toUpperCase());
    // Dispatch custom event to notify other components/tabs
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const savedLang = localStorage.getItem('mokdaLanguage');
      const cleanLang = savedLang?.toLowerCase() as Locale;
      if (cleanLang && ['es', 'ko', 'en'].includes(cleanLang)) {
        setLang(cleanLang);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Avoid hydration mismatch by waiting for client-side mounting
  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
