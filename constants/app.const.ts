export const TIMEZONE = "Europe/Warsaw";

export const DEFAULT_COORDINATES = {
  latitude: 50.2743132,
  longitude: 19.0040024,
};

export const ExternalLinks = {
  home: process.env.EXPO_PUBLIC_HOME_URL ?? "",
  androidApp: process.env.EXPO_PUBLIC_ANDROID_APP_URL ?? "",
  iosApp: process.env.EXPO_PUBLIC_IOS_APP_URL ?? "",
};
