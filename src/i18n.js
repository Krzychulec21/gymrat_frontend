import i18n from 'i18next';
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from "react-i18next";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'pl',
        debug: true,
        ns: ['home'],
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: ['localStorage', "navigator"],
            caches: ["localStorage"],
        }
    });

window.i18next = i18n;

export default i18n;

