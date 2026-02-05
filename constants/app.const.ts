import { Languages } from "@/providers/i18n";
const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";
export const TIMEZONE = "Europe/Warsaw";

export const AppConstants = {
  companyName: "Logifie",
  slogan: "Inspired by People. Powered by AI. Delivered by Logifie",
  companyLegalName: "Logifie sp. z o.o.",
  companyAddress: "JESIONOWA 9A , 40-159 KATOWICE",
  companyPhone: "+48 xxxxxxxx",
  companyEmail: "contact@logifie.com",
  companyWebsite: "https://logifie.com",
  companyFacebook:
    "https://www.facebook.com/profile.php?id=61586181896001",
  companyInstagram: "https://www.instagram.com/logifie_logistics",
  companyLinkedin: "https://www.linkedin.com/company/logifie",
  companyTiktok: "https://www.tiktok.com/logifie",
  coordinates: {
    latitude: 50.2758545,
    longitude: 19.0244098,
  },
  invoiceData: {
    companyLegalName: "Logifie sp. z o.o.",
    companyAddress: "JESIONOWA 9A/311 , 40-159 KATOWICE",
    companyVat: "9542902637",
    companyVatEu: "PL9542902637",
    companyRegon: "54389402000000",
    companyKrs: "0001221730",
  },
  store: {
    iosAppId: "",
    androidPackageName: "",
  },
} as const;

export const getAppStoreUrl = (
  platform: "ios" | "android" | "web"
) => {
  const { iosAppId, androidPackageName } = AppConstants.store;

  if (platform === "ios" && iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  }

  if (platform === "android" && androidPackageName) {
    return `https://play.google.com/store/apps/details?id=${androidPackageName}`;
  }

  return AppConstants.companyWebsite;
};

export const ExternalLinks = (language: Languages) => {
  return {
    Home: HOME_URL,
    Contact: `${HOME_URL}/${language}${AppRoutes.Contact}`,
    GetQuote: `${HOME_URL}/${language}${AppRoutes.GetQuote}`,
    TermsAndConditions: `${HOME_URL}/${language}${AppRoutes.TermsAndConditions}`,
    PrivacyPolicy: `${HOME_URL}/${language}${AppRoutes.PrivacyPolicy}`,
    Holidays: `${HOME_URL}/${language}${AppRoutes.Holidays}`,
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
  CookiesPolicy: "/cookies-policy",
  TermsAndConditions: "/terms-and-conditions",
  GetQuote: "/get-quote",
  Fuel: "/fuel",
  Careers: "/careers",
  Holidays: "/holidays",
  Sitemap: "/sitemap.xml",
  Robots: "/robots",
};
