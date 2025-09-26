
'use client';

import { useLanguage } from '@/context/language-context';
import en from '@/lib/locales/en.json';
import hi from '@/lib/locales/hi.json';
import pa from '@/lib/locales/pa.json';
import bn from '@/lib/locales/bn.json';
import te from '@/lib/locales/te.json';
import ta from '@/lib/locales/ta.json';
import ml from '@/lib/locales/ml.json';

const translations = {
  en,
  hi,
  pa,
  bn,
  te,
  ta,
  ml,
};

type Translations = typeof en;
type TranslationKey = keyof Translations | (string & {});


function getNestedValue(obj: any, key: string): string | undefined {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function useTranslation() {
  const { language } = useLanguage();
  const dictionary = translations[language] || en;

  const t = (key: TranslationKey): string => {
    return getNestedValue(dictionary, key) || key;
  };

  return { t, language };
}
