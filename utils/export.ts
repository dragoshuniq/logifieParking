import {} from "@/services/notifications";
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

/**
 * Get the localized label for an activity type
 */
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

/**
 * Generate a unique filename with timestamp and random component
 */
const generateFileName = (extension: string): string => {
  const timestamp = dayjs().format("YYYY-MM-DD_HH-mm-ss");
  const random = Math.random().toString(36).substring(2, 8);
  return `driver_hours_${timestamp}_${random}.${extension}`;
};

/**
 * Clean up a file from the file system (best effort, no error thrown)
 */
const cleanupFile = async (file: File): Promise<void> => {
  try {
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    // Silent cleanup failure - not critical
    console.warn("Failed to cleanup file:", error);
  }
};

/**
 * Prepare activity data for export with compliance calculations
 */
const prepareActivityData = (
  activities: Activity[],
  t: TranslateFunction
): Array<Record<string, string>> => {
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

/**
 * Prepare deficit data for export
 */
const prepareDeficitData = (
  deficits: WeeklyRestDeficit[],
  t: TranslateFunction
): Array<Record<string, string>> => {
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

/**
 * Export driver activities to CSV format using PapaParse
 *
 * @param activities - Array of activities to export
 * @param deficits - Array of weekly rest deficits (optional)
 * @param t - Translation function
 * @throws Error if no activities provided or sharing fails
 */
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
    // Prepare activity data
    const activitiesData = prepareActivityData(activities, t);

    // Generate CSV for activities
    let csvContent = Papa.unparse(activitiesData, {
      quotes: true,
      header: true,
    });

    // Add deficits section if available
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

    // Generate unique filename and create file
    const fileName = generateFileName("csv");
    file = new File(Paths.cache, fileName);

    // Create file (overwrite if exists)
    await file.create({ overwrite: true });

    // Write CSV content to file
    await file.write(csvContent);

    // Verify file was created
    if (!file.exists) {
      throw new Error("File was not created successfully");
    }

    // Check if sharing is available
    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    // Share the file
    await shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: t("driver.export.dialogTitle"),
      UTI: "public.comma-separated-values-text",
    });

    // Request app store review after successful export
    await requestStoreReviewAfterAction();

    // Clean up file after sharing
    await cleanupFile(file);
  } catch (error) {
    // Clean up file on error
    if (file) {
      await cleanupFile(file);
    }

    console.error("Export error:", error);
    throw error;
  }
};

/**
 * Export driver activities to Excel format using XLSX library
 *
 * @param activities - Array of activities to export
 * @param deficits - Array of weekly rest deficits (optional)
 * @param t - Translation function
 * @throws Error if no activities provided or sharing fails
 */
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
    // Create new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare and add activities sheet
    const activitiesData = prepareActivityData(activities, t);
    const activitiesSheet = XLSX.utils.json_to_sheet(activitiesData);
    XLSX.utils.book_append_sheet(
      workbook,
      activitiesSheet,
      "Driver Hours"
    );

    // Add deficits sheet if available
    if (deficits && deficits.length > 0) {
      const deficitsData = prepareDeficitData(deficits, t);
      const deficitsSheet = XLSX.utils.json_to_sheet(deficitsData);
      XLSX.utils.book_append_sheet(
        workbook,
        deficitsSheet,
        "Rest Deficits"
      );
    }

    // Generate Excel file as base64
    const excelBase64 = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    // Generate unique filename and create file
    const fileName = generateFileName("xlsx");
    file = new File(Paths.cache, fileName);

    // Create file (overwrite if exists)
    await file.create({ overwrite: true });

    // Decode base64 to binary (Uint8Array) for Excel file
    const binaryString = atob(excelBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Write binary content to file
    await file.write(bytes);

    // Verify file was created
    if (!file.exists) {
      throw new Error("File was not created successfully");
    }

    // Check if sharing is available
    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    // Share the file
    await shareAsync(file.uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: t("driver.export.dialogTitle"),
      UTI: "org.openxmlformats.spreadsheetml.sheet",
    });

    // Request app store review after successful export
    await requestStoreReviewAfterAction();

    // Clean up file after sharing
    await cleanupFile(file);
  } catch (error) {
    // Clean up file on error
    if (file) {
      await cleanupFile(file);
    }

    console.error("Export error:", error);
    throw error;
  }
};
