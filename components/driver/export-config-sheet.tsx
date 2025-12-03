import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets, ExportConfigProps } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { showDatePicker } from "./date-picker-sheet";

dayjs.extend(isoWeek);

export const showExportConfig = (payload: ExportConfigProps) => {
  SheetManager.show(ESheets.ExportConfig, {
    payload,
  });
};

type ExportType = "csv" | "xls";
type PeriodType = "selectedWeek" | "currentWeek" | "currentMonth" | "custom";

const ExportConfigSheet = () => {
  const payload = useSheetPayload("ExportConfig") as
    | ExportConfigProps
    | undefined;
  const { t } = useTranslation();
  const { content1, content2, primary, text } = useThemedColors(
    "content1",
    "content2",
    "primary",
    "text"
  );

  const { onExport, selectedDate } = payload || ({} as ExportConfigProps);

  const [exportType, setExportType] = useState<ExportType>("csv");
  const [periodType, setPeriodType] = useState<PeriodType>("selectedWeek");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onCloseSheet = () => {
    actionSheetRef?.current?.hide();
  };

  const handleExport = () => {
    let startDate: Date;
    let endDate: Date;

    if (periodType === "selectedWeek") {
      const current = dayjs(selectedDate);
      startDate = current.startOf("isoWeek").toDate();
      endDate = current.endOf("isoWeek").toDate();
    } else if (periodType === "currentWeek") {
      const current = dayjs();
      startDate = current.startOf("isoWeek").toDate();
      endDate = current.endOf("isoWeek").toDate();
    } else if (periodType === "currentMonth") {
      const current = dayjs();
      startDate = current.startOf("month").toDate();
      endDate = current.endOf("month").toDate();
    } else {
      if (!customStartDate || !customEndDate) {
        Alert.alert("Error", "Please select both start and end dates");
        return;
      }
      startDate = dayjs(customStartDate).startOf("day").toDate();
      endDate = dayjs(customEndDate).endOf("day").toDate();

      if (startDate > endDate) {
        Alert.alert("Error", "Start date must be before end date");
        return;
      }
    }

    onCloseSheet();
    onExport?.(exportType, startDate, endDate);
  };

  const handleCustomStartDate = () => {
    showDatePicker({
      value: customStartDate || dayjs().format("YYYY-MM-DD"),
      maxDate: customEndDate || undefined,
      onConfirm: (date: string) => {
        setCustomStartDate(date);
      },
    });
  };

  const handleCustomEndDate = () => {
    showDatePicker({
      value: customEndDate || dayjs().format("YYYY-MM-DD"),
      minDate: customStartDate || undefined,
      onConfirm: (date: string) => {
        setCustomEndDate(date);
      },
    });
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
        style={[styles.content, { backgroundColor: content1.DEFAULT }]}
      >
        <ThemedText style={styles.title}>Export Configuration</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Export Type</ThemedText>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              onPress={() => setExportType("csv")}
              style={[
                styles.typeButton,
                {
                  backgroundColor:
                    exportType === "csv"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  exportType === "csv" && { color: primary.foreground },
                ]}
              >
                CSV
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExportType("xls")}
              style={[
                styles.typeButton,
                {
                  backgroundColor:
                    exportType === "xls"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  exportType === "xls" && { color: primary.foreground },
                ]}
              >
                XLS
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Period</ThemedText>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              onPress={() => setPeriodType("selectedWeek")}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    periodType === "selectedWeek"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  periodType === "selectedWeek" && {
                    color: primary.foreground,
                  },
                ]}
              >
                Selected Week
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPeriodType("currentWeek")}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    periodType === "currentWeek"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  periodType === "currentWeek" && {
                    color: primary.foreground,
                  },
                ]}
              >
                Current Week
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPeriodType("currentMonth")}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    periodType === "currentMonth"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  periodType === "currentMonth" && {
                    color: primary.foreground,
                  },
                ]}
              >
                Current Month
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPeriodType("custom")}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    periodType === "custom"
                      ? primary.DEFAULT
                      : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  periodType === "custom" && { color: primary.foreground },
                ]}
              >
                Custom Period
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {periodType === "custom" && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>
              Custom Period
            </ThemedText>
            <View style={styles.dateInputs}>
              <TouchableOpacity
                onPress={handleCustomStartDate}
                style={[
                  styles.dateInput,
                  { backgroundColor: content2.DEFAULT },
                ]}
              >
                <ThemedText style={styles.dateInputLabel}>
                  Start Date
                </ThemedText>
                <ThemedText style={styles.dateInputValue}>
                  {customStartDate
                    ? dayjs(customStartDate).format("MMM DD, YYYY")
                    : "Select"}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCustomEndDate}
                style={[
                  styles.dateInput,
                  { backgroundColor: content2.DEFAULT },
                ]}
              >
                <ThemedText style={styles.dateInputLabel}>
                  End Date
                </ThemedText>
                <ThemedText style={styles.dateInputValue}>
                  {customEndDate
                    ? dayjs(customEndDate).format("MMM DD, YYYY")
                    : "Select"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={onCloseSheet}
            style={[styles.button, { backgroundColor: content2.DEFAULT }]}
          >
            <ThemedText style={styles.buttonText}>Cancel</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExport}
            style={[styles.button, { backgroundColor: primary.DEFAULT }]}
          >
            <ThemedText
              style={[styles.buttonText, { color: primary.foreground }]}
            >
              Export
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
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  periodButtons: {
    gap: 8,
  },
  periodButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateInputs: {
    gap: 12,
  },
  dateInput: {
    padding: 12,
    borderRadius: 8,
  },
  dateInputLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  dateInputValue: {
    fontSize: 14,
    fontWeight: "600",
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

export default ExportConfigSheet;

