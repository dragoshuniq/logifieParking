import dayjs from "@/utils/dayjs-config";
import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  calculateBreakCompliance,
  calculateDailyDrivingCompliance,
  calculateDailyRestCompliance,
  calculateNightWorkCompliance,
} from "./compliance";
import {
  Activity,
  ActivityType,
  WeeklyRestDeficit,
} from "./driver-db";
import { requestStoreReviewAfterAction } from "./store-review";

type TranslateFunction = (key: string) => string;

const getActivityTypeLabel = (
  type: ActivityType,
  t: TranslateFunction
): string => {
  switch (type) {
    case ActivityType.DRIVING:
      return t("driver.activityTypes.driving");
    case ActivityType.OTHER_WORK:
      return t("driver.activityTypes.otherWork");
    case ActivityType.BREAK:
      return t("driver.activityTypes.break");
    case ActivityType.REST:
      return t("driver.activityTypes.rest");
    case ActivityType.AVAILABILITY:
      return t("driver.activityTypes.availability");
    default:
      return type;
  }
};

const generateFileName = (extension: string): string => {
  const timestamp = dayjs().format("YYYY-MM-DD_HH-mm-ss");
  const random = Math.random().toString(36).substring(2, 8);
  return `driver_hours_${timestamp}_${random}.${extension}`;
};

const cleanupFile = async (file: File): Promise<void> => {
  try {
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    console.warn("Failed to cleanup file:", error);
  }
};

const prepareActivityData = (
  activities: Activity[],
  t: TranslateFunction
): Record<string, string>[] => {
  return activities.map((activity) => {
    const startDate = dayjs(activity.startDateTime);
    const endDate = dayjs(activity.endDateTime);
    const date = startDate.toDate();

    const dayActivities = activities.filter((a) =>
      dayjs(a.startDateTime).isSame(startDate, "day")
    );

    const drivingCompliance = calculateDailyDrivingCompliance(
      dayActivities,
      date,
      activities
    );
    const breakCompliance = calculateBreakCompliance(
      dayActivities,
      date
    );
    const restCompliance = calculateDailyRestCompliance(
      dayActivities,
      date,
      activities
    );
    const nightWork = calculateNightWorkCompliance(
      dayActivities,
      date
    );

    return {
      [t("driver.export.headers.date")]:
        startDate.format("YYYY-MM-DD"),
      [t("driver.export.headers.startTime")]:
        startDate.format("HH:mm"),
      [t("driver.export.headers.endTime")]: endDate.format("HH:mm"),
      [t("driver.export.headers.duration")]:
        activity.duration.toFixed(2),
      [t("driver.export.headers.activityType")]: getActivityTypeLabel(
        activity.type,
        t
      ),
      [t("driver.export.headers.dailyDriving")]:
        drivingCompliance.isCompliant
          ? t("common.ok")
          : t("common.violation"),
      [t("driver.export.headers.breakCompliance")]:
        breakCompliance.isCompliant
          ? t("common.ok")
          : t("common.violation"),
      [t("driver.export.headers.dailyRest")]:
        restCompliance.isCompliant
          ? t("common.ok")
          : t("common.violation"),
      [t("driver.export.headers.nightWork")]: nightWork.hasNightWork
        ? t("common.yes")
        : t("common.no"),
    };
  });
};

const prepareDeficitData = (
  deficits: WeeklyRestDeficit[],
  t: TranslateFunction
): Record<string, string>[] => {
  return deficits.map((deficit) => ({
    [t("driver.export.headers.weekStart")]: dayjs(
      deficit.weekStart
    ).format("YYYY-MM-DD"),
    [t("driver.export.headers.weekEnd")]: dayjs(
      deficit.weekEnd
    ).format("YYYY-MM-DD"),
    [t("driver.export.headers.deficitHours")]:
      deficit.deficitHours.toFixed(2),
    [t("driver.export.headers.compensatedHours")]:
      deficit.compensatedHours.toFixed(2),
    [t("driver.export.headers.mustCompensateBy")]: dayjs(
      deficit.mustCompensateBy
    ).format("YYYY-MM-DD"),
  }));
};

export const exportToCSV = async (
  activities: Activity[],
  deficits: WeeklyRestDeficit[] | undefined,
  t: TranslateFunction
): Promise<void> => {
  if (!activities || activities.length === 0) {
    throw new Error("No activities to export");
  }

  let file: File | null = null;

  try {
    const activitiesData = prepareActivityData(activities, t);

    let csvContent = Papa.unparse(activitiesData, {
      quotes: true,
      header: true,
    });

    if (deficits && deficits.length > 0) {
      csvContent += "\n\n";
      csvContent +=
        t("driver.export.headers.weeklyRestDeficits") + "\n";

      const deficitsData = prepareDeficitData(deficits, t);
      const deficitsCSV = Papa.unparse(deficitsData, {
        quotes: true,
        header: true,
      });

      csvContent += deficitsCSV;
    }

    const fileName = generateFileName("csv");
    file = new File(Paths.cache, fileName);

    await file.create({ overwrite: true });

    await file.write(csvContent);

    if (!file.exists) {
      throw new Error("File was not created successfully");
    }

    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    await shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: t("driver.export.dialogTitle"),
      UTI: "public.comma-separated-values-text",
    });

    await requestStoreReviewAfterAction();

    await cleanupFile(file);
  } catch (error) {
    if (file) {
      await cleanupFile(file);
    }

    console.error("Export error:", error);
    throw error;
  }
};

export const exportToXLS = async (
  activities: Activity[],
  deficits: WeeklyRestDeficit[] | undefined,
  t: TranslateFunction
): Promise<void> => {
  if (!activities || activities.length === 0) {
    throw new Error("No activities to export");
  }

  let file: File | null = null;

  try {
    const workbook = XLSX.utils.book_new();

    const activitiesData = prepareActivityData(activities, t);
    const activitiesSheet = XLSX.utils.json_to_sheet(activitiesData);
    XLSX.utils.book_append_sheet(
      workbook,
      activitiesSheet,
      "Driver Hours"
    );

    if (deficits && deficits.length > 0) {
      const deficitsData = prepareDeficitData(deficits, t);
      const deficitsSheet = XLSX.utils.json_to_sheet(deficitsData);
      XLSX.utils.book_append_sheet(
        workbook,
        deficitsSheet,
        "Rest Deficits"
      );
    }

    const excelBase64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileName = generateFileName("xlsx");
    file = new File(Paths.cache, fileName);

    await file.create({ overwrite: true });

    const binaryString = atob(excelBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    await file.write(bytes);

    if (!file.exists) {
      throw new Error("File was not created successfully");
    }

    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    await shareAsync(file.uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: t("driver.export.dialogTitle"),
      UTI: "org.openxmlformats.spreadsheetml.sheet",
    });

    await requestStoreReviewAfterAction();

    await cleanupFile(file);
  } catch (error) {
    if (file) {
      await cleanupFile(file);
    }

    console.error("Export error:", error);
    throw error;
  }
};
