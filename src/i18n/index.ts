import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import english from './english';
import polish from './polish';
import spanish from './spanish';
import russian from './russian';

const resources = {
  en: english,
  es: spanish,
  pl: polish,
  ru: russian,
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;