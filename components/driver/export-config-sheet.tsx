import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { useFormatDate } from "@/hooks/useFormat";
import { useDatabase } from "@/providers/driver-database";
import dayjs, { configureDayjsLocale } from "@/utils/dayjs-config";
import {
  getActivitiesByDateRange,
  getWeeklyRestDeficits,
} from "@/utils/driver-db";
import { exportToCSV, exportToXLS } from "@/utils/export";
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

export interface ExportConfigPayload {
  selectedDate: Date;
}

export const showExportConfig = (payload: ExportConfigPayload) => {
  SheetManager.show(ESheets.ExportConfig, {
    payload,
  });
};

type ExportType = "csv" | "xls";
type PeriodType =
  | "selectedWeek"
  | "currentWeek"
  | "currentMonth"
  | "custom";

const ExportConfigSheet = () => {
  const payload = useSheetPayload("ExportConfig") as
    | ExportConfigPayload
    | undefined;
  const { t, i18n } = useTranslation();
  const { formatDate } = useFormatDate();
  const { content1, content2, primary } = useThemedColors(
    "content1",
    "content2",
    "primary"
  );
  const db = useDatabase();

  configureDayjsLocale(i18n.language);

  const { selectedDate } = payload || ({} as ExportConfigPayload);

  const [exportType, setExportType] = useState<ExportType>("csv");
  const [periodType, setPeriodType] =
    useState<PeriodType>("selectedWeek");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const onCloseSheet = () => {
    actionSheetRef?.current?.hide();
  };

  const handleExport = async () => {
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
        Alert.alert(
          t("common.error"),
          t("driver.export.selectBothDates")
        );
        return;
      }
      startDate = dayjs(customStartDate).startOf("day").toDate();
      endDate = dayjs(customEndDate).endOf("day").toDate();

      if (startDate > endDate) {
        Alert.alert(
          t("common.error"),
          t("driver.export.startBeforeEnd")
        );
        return;
      }
    }

    onCloseSheet();

    try {
      const activities = await getActivitiesByDateRange(
        db,
        startDate,
        endDate
      );
      const deficits = await getWeeklyRestDeficits(db);

      if (exportType === "csv") {
        await exportToCSV(activities, deficits, t);
      } else {
        await exportToXLS(activities, deficits, t);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        t("common.error"),
        t("driver.errors.exportFailed", {
          type: exportType.toUpperCase(),
        })
      );
    }
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
        style={[
          styles.content,
          { backgroundColor: content1.DEFAULT },
        ]}
      >
        <ThemedText style={styles.title}>
          {t("driver.export.title")}
        </ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>
            {t("driver.export.exportType")}
          </ThemedText>
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
                  exportType === "csv" && {
                    color: primary.foreground,
                  },
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
                  exportType === "xls" && {
                    color: primary.foreground,
                  },
                ]}
              >
                XLS
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>
            {t("driver.export.period")}
          </ThemedText>
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
                {t("driver.export.selectedWeek")}
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
                {t("driver.export.currentWeek")}
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
                {t("driver.export.currentMonth")}
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
                  periodType === "custom" && {
                    color: primary.foreground,
                  },
                ]}
              >
                {t("driver.export.customPeriod")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {periodType === "custom" && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>
              {t("driver.export.customRange")}
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
                  {t("driver.export.startDate")}
                </ThemedText>
                <ThemedText style={styles.dateInputValue}>
                  {customStartDate
                    ? formatDate(customStartDate, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : t("common.select")}
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
                  {t("driver.export.endDate")}
                </ThemedText>
                <ThemedText style={styles.dateInputValue}>
                  {customEndDate
                    ? formatDate(customEndDate, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : t("common.select")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={onCloseSheet}
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
            onPress={handleExport}
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
              {t("driver.export.export")}
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
