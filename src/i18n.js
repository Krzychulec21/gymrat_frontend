import i18n from 'i18next';
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from "react-i18next";
import ICU from 'i18next-icu';

i18n
    .use(ICU)
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'pl',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: ['localStorage', "navigator"],
            caches: ["localStorage"],
        },
        react: {
            useSuspense: false,
        },
    });

// window.i18next = i18n;

export default i18n;

