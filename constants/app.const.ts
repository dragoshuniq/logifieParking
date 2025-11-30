import { Languages } from "@/providers/i18n";
const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";

export const TIMEZONE = "Europe/Warsaw";

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
