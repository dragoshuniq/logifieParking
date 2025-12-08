import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets, InfoSheetProps } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { MaterialIcons } from "@expo/vector-icons";
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
  useSheetPayload,
} from "react-native-actions-sheet";

export const showInfoSheet = (payload: InfoSheetProps) => {
  SheetManager.show(ESheets.InfoSheet, {
    payload,
  });
};

const InfoSheet = (props: SheetProps) => {
  const payload = useSheetPayload(ESheets.InfoSheet);
  const { t } = useTranslation();
  const { content1, content2, primary, text } = useThemedColors(
    "content1",
    "content2",
    "primary",
    "text"
  );

  const { title = t("common.information"), sections = [] } =
    payload || {};

  const translatedTitle = title.includes(".") ? t(title) : title;

  const onCloseSheet = () => {
    SheetManager.hide(ESheets.InfoSheet);
  };

  const renderSection = ({
    item,
    index,
  }: {
    item: { heading: string; content: string };
    index: number;
  }) => (
    <ThemedView
      key={`section-${index}`}
      style={[styles.section, { backgroundColor: content2.DEFAULT }]}
    >
      <ThemedText style={styles.sectionHeading}>
        {t(item.heading)}
      </ThemedText>
      <ThemedText style={styles.sectionContent}>
        {t(item.content)}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={[
        styles.container,
        { backgroundColor: content1.DEFAULT },
      ]}
      gestureEnabled
      closeOnTouchBackdrop
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: primary.DEFAULT },
            ]}
          >
            <MaterialIcons
              name="info"
              size={20}
              color={primary.foreground}
            />
          </View>
          <ThemedText style={styles.title}>
            {translatedTitle}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={onCloseSheet}
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={20} color={text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(_, index) => `section-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ThemedView
            style={[
              styles.section,
              { backgroundColor: content2.DEFAULT },
            ]}
          >
            <ThemedText>{t("common.noInformation")}</ThemedText>
          </ThemedView>
        }
      />
    </ActionSheet>
  );
};

export default InfoSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    gap: 16,
    paddingBottom: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
});
