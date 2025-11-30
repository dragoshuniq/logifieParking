import { ESheets } from "@/constants/sheets";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  LANGUAGE_NAMES,
  Languages,
  validateLanguage,
} from "@/providers/i18n";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import CountryFlag from "react-native-country-flag";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";

const LANGUAGE_FLAGS: Record<Languages, string> = {
  [Languages.EN]: "GB",
  [Languages.DE]: "DE",
  [Languages.FR]: "FR",
  [Languages.PL]: "PL",
  [Languages.UA]: "UA",
  [Languages.RO]: "RO",
  [Languages.ES]: "ES",
  [Languages.PT]: "PT",
  [Languages.IT]: "IT",
  [Languages.NL]: "NL",
  [Languages.SE]: "SE",
  [Languages.NO]: "NO",
  [Languages.FI]: "FI",
  [Languages.DK]: "DK",
  [Languages.TR]: "TR",
};

type LanguageItem = {
  code: Languages;
  name: string;
  flag: string;
};

const LANGUAGES: LanguageItem[] = Object.values(Languages).map(
  (lang) => ({
    code: lang,
    name: LANGUAGE_NAMES[lang],
    flag: LANGUAGE_FLAGS[lang],
  })
);

export default function LanguagePickerSheet(props: SheetProps) {
  const {
    i18n: { language, changeLanguage },
    t,
  } = useTranslation();

  const colors = useThemeColor({}, "default");
  const backgroundColor = colors[50];
  const primaryColor = useThemeColor({}, "tint");

  const handleLanguageSelect = (language: Languages) => {
    changeLanguage(validateLanguage(language));
    SheetManager.hide(ESheets.LanguagePicker);
  };

  const renderLanguageItem = ({ item }: { item: LanguageItem }) => {
    const isSelected = item.code === language;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          {
            backgroundColor: isSelected
              ? `${primaryColor}15`
              : backgroundColor,
            borderColor: isSelected
              ? primaryColor
              : Colors.light.default[400],
          },
        ]}
        onPress={() => handleLanguageSelect(item.code)}
        activeOpacity={0.7}
      >
        <ThemedView
          style={styles.languageContent}
          lightColor="transparent"
          darkColor="transparent"
        >
          <CountryFlag
            isoCode={item.flag}
            size={32}
            style={{ borderRadius: 100, width: 32, height: 32 }}
          />
          <ThemedText style={styles.languageName}>
            {item.name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={[styles.container, { backgroundColor }]}
      gestureEnabled
      closeOnTouchBackdrop
    >
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">
          {t("common.selectLanguage")}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={LANGUAGES}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  listContent: {
    gap: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 40,
    borderWidth: 1,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  languageName: {
    fontSize: 16,
  },
});
