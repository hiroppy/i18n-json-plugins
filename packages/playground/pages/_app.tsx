import { AppProps } from "next/app";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "i18next";
import commonEn from "../public/static/locales/en/common.json";
import commonJa from "../public/static/locales/ja/common.json";

const resources = {
  ja: {
    common: commonJa,
  },
  en: {
    common: commonEn,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: "ja",
  fallbackLng: "ja",
  ns: ["common"],
  defaultNS: "common",
  resources,
  react: {
    useSuspense: false, // react-dom doesn't support suspense
  },
  interpolation: {
    escapeValue: false,
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
};

export default MyApp;
