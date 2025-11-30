import { ESheets } from "@/constants/sheets";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  Languages,
  validateLanguage,
} from "@/providers/i18n";
import * as Application from "expo-application";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import CountryFlag from "react-native-country-flag";
import { ExternalLink } from "../ui/external-link";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";
import { ThemedView } from "../ui/themed-view";

const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";
const ANDROID_APP_URL = process.env.EXPO_PUBLIC_ANDROID_APP_URL ?? "";
const IOS_APP_URL = process.env.EXPO_PUBLIC_IOS_APP_URL ?? "";

export function CustomDrawerContent() {
  const colors = useThemeColor({}, "default");
  const borderColor = colors[400];
  const iconColor = useThemeColor({}, "icon");
  const {
    i18n: { language },
  } = useTranslation();

  console.log(language);

  const handleOpenLanguagePicker = () => {
    SheetManager.show(ESheets.LanguagePicker);
  };

  const handleShare = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return;
    }

    let shareUrl = "";
    if (Platform.OS === "android" && ANDROID_APP_URL) {
      shareUrl = ANDROID_APP_URL;
    } else if (Platform.OS === "ios" && IOS_APP_URL) {
      shareUrl = IOS_APP_URL;
    }

    if (shareUrl) {
      await Sharing.shareAsync(shareUrl);
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/blogo.png")}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedTouchableOpacity
            style={[
              styles.languageButton,
              { borderColor: Colors.light.default[400] },
            ]}
            onPress={handleOpenLanguagePicker}
          >
            <CountryFlag
              isoCode={
                LANGUAGE_FLAGS[
                  validateLanguage(language) as Languages
                ]
              }
              size={32}
              style={{ borderRadius: 100, width: 40, height: 40 }}
            />
            <ThemedText style={styles.languageButtonLabel}>
              {LANGUAGE_NAMES[language as Languages]}
            </ThemedText>
          </ThemedTouchableOpacity>
        </ThemedView>
      </ScrollView>

      <ThemedView
        style={[
          styles.footer,
          {
            borderTopColor: borderColor,
          },
        ]}
      >
        <ExternalLink href={HOME_URL as any}>
          <ThemedText style={[styles.link, { color: iconColor }]}>
            Visit Website
          </ThemedText>
        </ExternalLink>
        <ThemedText style={[styles.version, { color: iconColor }]}>
          Version {Application.nativeApplicationVersion}
        </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 60,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  link: {
    fontSize: 14,
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
  },
  languageButton: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 40,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  languageButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
