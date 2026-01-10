import { Ionicons } from "@expo/vector-icons";

export type DrawerLinkConfig = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  translationKey: string;
  urlKey:
    | "Home"
    | "Contact"
    | "GetQuote"
    | "TermsAndConditions"
    | "PrivacyPolicy"
    | "Holidays";
  highlighted?: boolean;
};

export const DRAWER_LINKS: DrawerLinkConfig[] = [
  {
    id: "home",
    icon: "home-outline",
    translationKey: "drawer.home",
    urlKey: "Home",
    highlighted: true,
  },
  {
    id: "contact",
    icon: "mail-outline",
    translationKey: "drawer.contact",
    urlKey: "Contact",
  },
  {
    id: "getQuote",
    icon: "calculator-outline",
    translationKey: "drawer.getQuote",
    urlKey: "GetQuote",
  },
  {
    id: "holidays",
    icon: "calendar-outline",
    translationKey: "drawer.holidays",
    urlKey: "Holidays",
  },
  {
    id: "termsAndConditions",
    icon: "document-text-outline",
    translationKey: "drawer.termsConditions",
    urlKey: "TermsAndConditions",
  },
  {
    id: "privacyPolicy",
    icon: "shield-outline",
    translationKey: "drawer.privacyPolicy",
    urlKey: "PrivacyPolicy",
  },
];
