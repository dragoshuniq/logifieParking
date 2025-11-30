import { ExternalLinks } from "@/constants/app.const";
import { DRAWER_LINKS } from "@/constants/drawer.config";
import { ESheets } from "@/constants/sheets";
import { SocialNetworksRoutes } from "@/constants/social.config";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { useThemedColors } from "@/hooks/use-themed-colors";
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
import { SocialLink } from "../ui/social-link";
import { ThemedDivider } from "../ui/themed-divider";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";
import { ThemedView } from "../ui/themed-view";

export function CustomDrawerContent() {
  const {
    default: defaultColors,
    primary: primaryColors,
    secondary: secondaryColors,
  } = useThemedColors("default", "primary", "secondary");
  const borderColor = defaultColors[400];
  const { toggleTheme, isDark } = useThemeToggle();
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const links = ExternalLinks(
    validateLanguage(language) as Languages
  );

  const handleOpenLanguagePicker = () => {
    SheetManager.show(ESheets.LanguagePicker);
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <ThemedView style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/blogo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </ThemedView>
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
                style={styles.languageFlag}
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
                size={30}
                color={secondaryColors.DEFAULT}
              />
            </ThemedTouchableOpacity>
          </View>

          <ThemedView style={styles.linksContainer}>
            {DRAWER_LINKS.map((link) => (
              <ExternalLink
                key={link.id}
                href={links[link.urlKey] as any}
              >
                <ThemedView
                  style={[
                    styles.linkButton,
                    {
                      borderColor: link.highlighted
                        ? primaryColors.DEFAULT
                        : borderColor,
                      backgroundColor: link.highlighted
                        ? primaryColors[50]
                        : "transparent",
                    },
                  ]}
                >
                  <Ionicons
                    name={link.icon}
                    size={20}
                    color={primaryColors.DEFAULT}
                  />
                  <ThemedText
                    style={[
                      styles.linkButtonText,
                      link.highlighted && {
                        color: primaryColors.DEFAULT,
                      },
                    ]}
                  >
                    {t(link.translationKey)}
                  </ThemedText>
                </ThemedView>
              </ExternalLink>
            ))}
          </ThemedView>
        </View>

        <ThemedView style={styles.socialContainer}>
          <ThemedText style={styles.socialTitle}>
            {t("drawer.followUs")}
          </ThemedText>
          <View style={styles.socialButtons}>
            {SocialNetworksRoutes.map((network) => (
              <SocialLink key={network.name} network={network}>
                <ThemedView
                  style={[
                    styles.socialButton,
                    { borderColor: borderColor },
                  ]}
                >
                  <Ionicons
                    name={network.icon}
                    size={22}
                    color={secondaryColors.DEFAULT}
                  />
                </ThemedView>
              </SocialLink>
            ))}
          </View>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <ThemedDivider thickness={2} />

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
  headerContainer: {
    gap: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 60,
  },
  footer: {
    paddingVertical: 16,
    paddingBottom: 8,
    gap: 16,
  },
  version: {
    fontSize: 12,
    textAlign: "center",
  },
  linksContainer: {
    gap: 16,
    width: "100%",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    width: "100%",
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: "600",
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
  socialContainer: {
    gap: 12,
    width: "100%",
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.6,
  },
  socialButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  languageFlag: {
    borderRadius: 100,
    width: 32,
    height: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
