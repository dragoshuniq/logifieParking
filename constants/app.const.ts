import { Languages } from "@/providers/i18n";
const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";
export const TIMEZONE = "Europe/Warsaw";

export const AppConstants = {
  companyName: "Logifie",
  slogan: "Inspired by People. Powered by AI. Delivered by Logifie",
  companyLegalName: "XXXX sp. z o.o.",
  companyAddress: "XXX Katowice, str. XXX",
  companyPhone: "+48 780 110 110",
  companyEmail: "contact@logifie.com",
  companyWebsite: "https://logifie.com",
  companyFacebook: "https://www.facebook.com/logifie",
  companyInstagram: "https://www.instagram.com/logifie",
  companyLinkedin: "https://www.linkedin.com/company/logifie",
  companyTiktok: "https://www.tiktok.com/logifie",
  coordinates: {
    latitude: 50.2743132,
    longitude: 19.0040024,
  },
  invoiceData: {
    companyLegalName: "XXXX sp. z o.o.",
    companyAddress: "XXX Katowice",
    companyVat: "XXX",
    companyVatEu: "PLXXX",
    companyRegon: "XXX",
    companyKrs: "XXX",
  },
} as const;

export const DEFAULT_COORDINATES = {
  latitude: 50.2743132,
  longitude: 19.0040024,
};

export const ExternalLinks = (language: Languages) => {
  return {
    Home: HOME_URL,
    Contact: `${HOME_URL}/${language}${AppRoutes.Contact}`,
    GetQuote: `${HOME_URL}/${language}${AppRoutes.GetQuote}`,
  };
};

// TODO: verify latest routes
export const AppRoutes = {
  Home: "/",
  AboutUs: "/about",
  CustomerZone: "/customer",
  CarrierZone: "/carrier",
  Blog: "/blog",
  Parking: "/parking",
  Faq: "/faq",
  Contact: "/contact",
  PrivacyPolicy: "/privacy-policy",
  TermsAndConditions: "/terms-and-conditions",
  GetQuote: "/get-quote",
  Fuel: "/fuel",
  Careers: "/careers",
  Sitemap: "/sitemap",
  Robots: "/robots",
};
