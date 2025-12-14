export default {
  expo: {
    name: "Logifie Driver Assistant",
    slug: "LogifieDriverAssistant",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "logifieparking",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dragoshuniq.LogifieParking",
      icon: {
        light: "./assets/images/ios-light.png",
        dark: "./assets/images/ios-dark.png",
        tinted: "./assets/images/ios-tinted.png",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        foregroundImage: "./assets/images/adaptive-icon.png",
        monochromeImage: "./assets/images/adaptive-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      package: "com.dragoshuniq.LogifieParking",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.ico",
    },
    plugins: [
      "expo-router",
      "react-native-map-link",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "$(PRODUCT_NAME) needs access to your location to display nearby truck parking locations and help you find the closest available parking spots.",
          locationWhenInUsePermission:
            "$(PRODUCT_NAME) needs access to your location to display nearby truck parking locations and help you find the closest available parking spots.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/blogo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/notification.png",
          color: "#e63946",
        },
      ],
      "expo-localization",
      "expo-sqlite",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
