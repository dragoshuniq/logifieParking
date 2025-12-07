import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { DatePickerProps, ESheets } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { Calendar } from "react-native-calendars";

export const showDatePicker = (payload: DatePickerProps) => {
  SheetManager.show(ESheets.DatePicker, {
    payload,
  });
};

const DatePickerSheet = () => {
  const payload = useSheetPayload("DatePicker") as
    | DatePickerProps
    | undefined;
  const { t } = useTranslation();
  const { content1, content2, primary, content3, background } =
    useThemedColors(
      "content1",
      "content2",
      "primary",
      "content3",
      "background"
    );

  const {
    onCancel = () => {},
    onConfirm,
    value,
    minDate,
    maxDate,
  } = payload || ({} as DatePickerProps);

  const [localDate, setLocalDate] = useState(
    value
      ? dayjs(value).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onCloseSheet = () => {
    actionSheetRef?.current?.hide();
  };

  const handleClose = () => {
    onCloseSheet();
    onCancel();
  };

  const handleConfirm = () => {
    onCloseSheet();
    onConfirm?.(localDate);
  };

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: background,
      calendarBackground: background,
      textSectionTitleColor: content3.foreground,
      dayTextColor: content2.foreground,
      todayTextColor: primary.DEFAULT,
      monthTextColor: content2.foreground,
      textDisabledColor: content3.foreground,
      selectedDayBackgroundColor: primary.DEFAULT,
      selectedDayTextColor: primary.foreground,
      arrowColor: primary.DEFAULT,
      textDayFontSize: 16,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 14,
      textDayFontWeight: "600" as const,
      textMonthFontWeight: "600" as const,
      textDayHeaderFontWeight: "600" as const,
    }),
    [primary, content2, content3, background]
  );

  const markedDates = {
    [localDate]: {
      selected: true,
      selectedColor: primary.DEFAULT,
      selectedTextColor: primary.foreground,
    },
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
        <Calendar
          firstDay={1}
          minDate={minDate}
          maxDate={maxDate}
          initialDate={localDate}
          onDayPress={(date) => setLocalDate(date.dateString)}
          theme={calendarTheme}
          enableSwipeMonths
          markedDates={markedDates}
        />
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

export default DatePickerSheet;
