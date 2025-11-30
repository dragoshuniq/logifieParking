import { ESheets } from "@/constants/sheets";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Application from "expo-application";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLink } from "../ui/external-link";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";

const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";
const ANDROID_APP_URL = process.env.EXPO_PUBLIC_ANDROID_APP_URL ?? "";
const IOS_APP_URL = process.env.EXPO_PUBLIC_IOS_APP_URL ?? "";

export function CustomDrawerContent() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColor({}, "default");
  const borderColor = colors[400];
  const iconColor = useThemeColor({}, "icon");
  const {
    i18n: { language },
  } = useTranslation();

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
    <ThemedView
      style={[styles.container, { paddingTop: insets.top }]}
    >
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
        </ThemedView>
      </ScrollView>

      <ThemedView
        style={[
          styles.footer,
          {
            borderTopColor: borderColor,
            paddingBottom: insets.bottom + 16,
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logo: {
    width: 150,
    height: 60,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  languageButtonContent: {
    flex: 1,
  },
  languageButtonLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  languageButtonValue: {
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
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
});
