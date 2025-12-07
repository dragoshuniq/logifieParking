import { ESheets } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import {
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  Languages,
  validateLanguage,
} from "@/providers/i18n";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import CountryFlag from "react-native-country-flag";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";

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

  const {
    primary: primaryColors,
    content2: content2Colors,
    default: defaultColors,
  } = useThemedColors("primary", "content2", "default");

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
              ? primaryColors[50]
              : content2Colors.DEFAULT,
            borderColor: isSelected
              ? primaryColors.DEFAULT
              : defaultColors[300],
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
      containerStyle={[
        styles.container,
        { backgroundColor: content2Colors.DEFAULT },
      ]}
      gestureEnabled
      closeOnTouchBackdrop
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">
          {t("language.selectLanguage")}
        </ThemedText>
      </View>
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
