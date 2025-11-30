import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import CountryFlag from "react-native-country-flag";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export enum Languages {
  EN = "en",
  DE = "de",
  FR = "fr",
  PL = "pl",
  UA = "ua",
  RO = "ro",
  ES = "es",
  PT = "pt",
  IT = "it",
  NL = "nl",
  SE = "se",
  NO = "no",
  FI = "fi",
  DK = "dk",
  TR = "tr",
}

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

const LANGUAGE_NAMES: Record<Languages, string> = {
  [Languages.EN]: "English",
  [Languages.DE]: "German",
  [Languages.FR]: "French",
  [Languages.PL]: "Polish",
  [Languages.UA]: "Ukrainian",
  [Languages.RO]: "Romanian",
  [Languages.ES]: "Spanish",
  [Languages.PT]: "Portuguese",
  [Languages.IT]: "Italian",
  [Languages.NL]: "Dutch",
  [Languages.SE]: "Swedish",
  [Languages.NO]: "Norwegian",
  [Languages.FI]: "Finnish",
  [Languages.DK]: "Danish",
  [Languages.TR]: "Turkish",
};

interface LanguageItem {
  code: Languages;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageItem[] = Object.values(Languages).map((lang) => ({
  code: lang,
  name: LANGUAGE_NAMES[lang],
  flag: LANGUAGE_FLAGS[lang],
}));

export default function LanguagePickerSheet(props: SheetProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Languages>(
    Languages.EN
  );
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "icon");

  const handleSelectLanguage = (language: Languages) => {
    setSelectedLanguage(language);
    SheetManager.hide(props.sheetId);
  };

  const renderLanguageItem = ({ item }: { item: LanguageItem }) => {
    const isSelected = item.code === selectedLanguage;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          {
            backgroundColor: isSelected
              ? `${primaryColor}15`
              : backgroundColor,
            borderColor: isSelected ? primaryColor : borderColor,
          },
        ]}
        onPress={() => handleSelectLanguage(item.code)}
        activeOpacity={0.7}
      >
        <ThemedView
          style={styles.languageContent}
          lightColor="transparent"
          darkColor="transparent"
        >
          <CountryFlag isoCode={item.flag} size={32} />
          <ThemedText style={styles.languageName}>{item.name}</ThemedText>
        </ThemedView>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={isSelected ? primaryColor : textColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={[
        styles.container,
        { backgroundColor },
      ]}
      gestureEnabled
      closeOnTouchBackdrop
    >
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Select Language</ThemedText>
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
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
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

