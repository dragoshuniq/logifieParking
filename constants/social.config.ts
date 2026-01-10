import { Ionicons } from "@expo/vector-icons";
import { AppConstants } from "./app.const";

export type NetworkType = {
  webLink: string;
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
};

export const SocialNetworksRoutes: NetworkType[] = [
  {
    webLink: AppConstants.companyLinkedin,
    icon: "logo-linkedin",
    name: "LinkedIn",
  },
  {
    webLink: AppConstants.companyFacebook,
    icon: "logo-facebook",
    name: "Facebook",
  },
  {
    webLink: AppConstants.companyInstagram,
    icon: "logo-instagram",
    name: "Instagram",
  },
  // {
  //   webLink: AppConstants.companyTiktok,
  //   icon: "logo-tiktok",
  //   name: "TikTok",
  // },
  {
    webLink: `mailto:${AppConstants.companyEmail}`,
    icon: "mail-outline",
    name: "Mail",
  },
  {
    webLink: `tel:${AppConstants.companyPhone}`,
    icon: "call-outline",
    name: "Phone",
  },
] as const;

export const Networks = SocialNetworksRoutes.reduce(
  (acc, network) => {
    acc[network.name.toLowerCase()] = network;
    return acc;
  },
  {} as Record<string, NetworkType>
);
