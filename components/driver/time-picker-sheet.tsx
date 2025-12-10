import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets, TimePickerProps } from "@/constants/sheets";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import DatePicker from "react-native-date-picker";

export const showTimePicker = (payload: TimePickerProps) => {
  SheetManager.show(ESheets.TimePicker, {
    payload,
  });
};

const TimePickerSheet = () => {
  const payload = useSheetPayload("TimePicker");
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const { content1, content2, primary } = useThemedColors(
    "content1",
    "content2",
    "primary",
    "text"
  );

  const {
    onCancel = () => {},
    onConfirm,
    value = new Date(),
    maximumDate,
    minimumDate,
    minuteInterval = 5,
  } = payload || {};

  const [localTime, setLocalTime] = useState<Date>(value);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    setLocalTime(value);
  }, [value]);

  const onCloseSheet = () => {
    actionSheetRef?.current?.hide();
  };

  const handleClose = () => {
    onCloseSheet();
    onCancel();
  };

  const handleConfirm = () => {
    onCloseSheet();
    onConfirm?.(localTime);
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      useBottomSafeAreaPadding
      containerStyle={[
        styles.container,
        { backgroundColor: content1.DEFAULT },
      ]}
    >
      <ThemedView
        style={[
          styles.content,
          { backgroundColor: content1.DEFAULT },
        ]}
      >
        <ThemedText style={styles.title}>
          {t("driver.selectTime")}
        </ThemedText>

        <View style={styles.pickerWrapper}>
          <DatePicker
            date={localTime}
            mode="time"
            theme={colorScheme === "dark" ? "dark" : "light"}
            onDateChange={setLocalTime}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            minuteInterval={minuteInterval}
            locale={i18n.language}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleClose}
            style={[
              styles.button,
              { backgroundColor: content2.DEFAULT },
            ]}
          >
            <ThemedText style={styles.buttonText}>
              {t("common.cancel")}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            style={[
              styles.button,
              { backgroundColor: primary.DEFAULT },
            ]}
          >
            <ThemedText
              style={[
                styles.buttonText,
                { color: primary.foreground },
              ]}
            >
              {t("common.confirm")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerWrapper: {
    alignItems: "center",
    paddingVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TimePickerSheet;
