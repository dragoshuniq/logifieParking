import { ESheets } from "@/constants/sheets";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import {
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  Languages,
  validateLanguage,
} from "@/providers/i18n";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import CountryFlag from "react-native-country-flag";
import { ExternalLink } from "../ui/external-link";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";
import { ThemedView } from "../ui/themed-view";

const HOME_URL = process.env.EXPO_PUBLIC_HOME_URL ?? "";

export function CustomDrawerContent() {
  const colorScheme = useColorScheme() ?? "light";
  const defaultColors = Colors[colorScheme].default;
  const primaryColors = Colors[colorScheme].primary;
  const secondaryColors = Colors[colorScheme].secondary;
  const borderColor = defaultColors[400];
  const { toggleTheme, isDark } = useThemeToggle();
  const {
    i18n: { language },
  } = useTranslation();

  const handleOpenLanguagePicker = () => {
    SheetManager.show(ESheets.LanguagePicker);
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
          <View style={styles.actionContainer}>
            <ThemedTouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: borderColor },
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
                style={{ borderRadius: 100, width: 32, height: 32 }}
              />
              <ThemedText style={styles.languageButtonLabel}>
                {LANGUAGE_NAMES[language as Languages]}
              </ThemedText>
            </ThemedTouchableOpacity>
            <ThemedTouchableOpacity
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                { borderColor: borderColor },
              ]}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={32}
                color={secondaryColors.DEFAULT}
              />
            </ThemedTouchableOpacity>
          </View>
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
          <ThemedText style={styles.link}>Visit Website</ThemedText>
        </ExternalLink>
        <ThemedText style={styles.version}>
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
    alignSelf: "flex-start",
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
  themeContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginTop: 16,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
  },
  themeButton: {
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
