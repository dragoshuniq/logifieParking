import { AppConstants, getAppStoreUrl } from "@/constants/app.const";
import { Platform, Share } from "react-native";

export const shareApp = async () => {
  const { companyName, slogan, companyWebsite, companyPhone } = AppConstants;
  const appUrl = getAppStoreUrl(Platform.OS as "ios" | "android");

  const message = `${companyName} - ${slogan}

${companyWebsite}
${companyPhone}

Download the app: ${appUrl}`;

  try {
    await Share.share({
      message,
      url: appUrl,
      title: companyName,
    });
  } catch (error) {
    console.error("Error sharing app:", error);
  }
};
