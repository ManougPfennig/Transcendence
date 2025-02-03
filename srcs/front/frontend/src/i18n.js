import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ['English', 'Français', 'Español'],
    lng: 'English',
    fallbackLng: 'English',
    backend: {
    //  loadPath: '../public/locales/{{lng}}/translation.json',
		loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;