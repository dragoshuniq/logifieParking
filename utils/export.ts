import dayjs from "@/utils/dayjs-config";
import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
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

export const exportToCSV = async (
  activities: Activity[],
  deficits: WeeklyRestDeficit[] | undefined,
  t: TranslateFunction
): Promise<void> => {
  if (!activities || activities.length === 0) {
    throw new Error("No activities to export");
  }

  const headers = [
    t("driver.export.headers.date"),
    t("driver.export.headers.startTime"),
    t("driver.export.headers.endTime"),
    t("driver.export.headers.duration"),
    t("driver.export.headers.activityType"),
    t("driver.export.headers.dailyDriving"),
    t("driver.export.headers.breakCompliance"),
    t("driver.export.headers.dailyRest"),
    t("driver.export.headers.nightWork"),
  ];
  const rows = activities.map((activity) => {
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

    return [
      startDate.format("YYYY-MM-DD"),
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      activity.duration.toFixed(2),
      getActivityTypeLabel(activity.type),
      drivingCompliance.isCompliant ? "OK" : "VIOLATION",
      breakCompliance.isCompliant ? "OK" : "VIOLATION",
      restCompliance.isCompliant ? "OK" : "VIOLATION",
      nightWork.hasNightWork ? "YES" : "NO",
    ];
  });

  let csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  if (deficits && deficits.length > 0) {
    csvContent += "\n\n";
    csvContent +=
      t("driver.export.headers.weeklyRestDeficits") + "\n";
    csvContent +=
      [
        t("driver.export.headers.weekStart"),
        t("driver.export.headers.weekEnd"),
        t("driver.export.headers.deficitHours"),
        t("driver.export.headers.compensatedHours"),
        t("driver.export.headers.mustCompensateBy"),
      ].join(",") + "\n";
    deficits.forEach((deficit) => {
      csvContent +=
        [
          dayjs(deficit.weekStart).format("YYYY-MM-DD"),
          dayjs(deficit.weekEnd).format("YYYY-MM-DD"),
          deficit.deficitHours.toFixed(2),
          deficit.compensatedHours.toFixed(2),
          dayjs(deficit.mustCompensateBy).format("YYYY-MM-DD"),
        ].join(",") + "\n";
    });
  }

  const fileName = `driver_hours_${dayjs().format(
    "YYYY-MM-DD_HH-mm"
  )}.csv`;

  try {
    const file = new File(Paths.document, fileName);
    file.create();
    file.write(csvContent);

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

    requestStoreReviewAfterAction();
  } catch (error) {
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

  const xmlHeader =
    '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  const xlsHeader =
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  const xlsFooter = "</Workbook>";

  const headers = [
    t("driver.export.headers.date"),
    t("driver.export.headers.startTime"),
    t("driver.export.headers.endTime"),
    t("driver.export.headers.duration"),
    t("driver.export.headers.activityType"),
    t("driver.export.headers.dailyDriving"),
    t("driver.export.headers.breakCompliance"),
    t("driver.export.headers.dailyRest"),
    t("driver.export.headers.nightWork"),
  ];
  const rows = activities.map((activity) => {
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

    return [
      startDate.format("YYYY-MM-DD"),
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      activity.duration.toFixed(2),
      getActivityTypeLabel(activity.type),
      drivingCompliance.isCompliant ? "OK" : "VIOLATION",
      breakCompliance.isCompliant ? "OK" : "VIOLATION",
      restCompliance.isCompliant ? "OK" : "VIOLATION",
      nightWork.hasNightWork ? "YES" : "NO",
    ];
  });

  let worksheet = `
    <Worksheet ss:Name="Driver Hours">
      <Table>
        <Row>
          ${headers
            .map(
              (h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`
            )
            .join("")}
        </Row>
        ${rows
          .map(
            (row) => `
          <Row>
            ${row
              .map(
                (cell) =>
                  `<Cell><Data ss:Type="String">${cell}</Data></Cell>`
              )
              .join("")}
          </Row>
        `
          )
          .join("")}
      </Table>
    </Worksheet>
  `;

  if (deficits && deficits.length > 0) {
    const deficitHeaders = [
      t("driver.export.headers.weekStart"),
      t("driver.export.headers.weekEnd"),
      t("driver.export.headers.deficitHours"),
      t("driver.export.headers.compensatedHours"),
      t("driver.export.headers.mustCompensateBy"),
    ];
    const deficitRows = deficits.map((deficit) => [
      dayjs(deficit.weekStart).format("YYYY-MM-DD"),
      dayjs(deficit.weekEnd).format("YYYY-MM-DD"),
      deficit.deficitHours.toFixed(2),
      deficit.compensatedHours.toFixed(2),
      dayjs(deficit.mustCompensateBy).format("YYYY-MM-DD"),
    ]);

    worksheet += `
    <Worksheet ss:Name="Rest Deficits">
      <Table>
        <Row>
          ${deficitHeaders
            .map(
              (h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`
            )
            .join("")}
        </Row>
        ${deficitRows
          .map(
            (row) => `
          <Row>
            ${row
              .map(
                (cell) =>
                  `<Cell><Data ss:Type="String">${cell}</Data></Cell>`
              )
              .join("")}
          </Row>
        `
          )
          .join("")}
      </Table>
    </Worksheet>
    `;
  }

  const xlsContent = xmlHeader + xlsHeader + worksheet + xlsFooter;

  const fileName = `driver_hours_${dayjs().format(
    "YYYY-MM-DD_HH-mm"
  )}.xls`;

  try {
    const file = new File(Paths.document, fileName);
    file.create();
    file.write(xlsContent);

    if (!file.exists) {
      throw new Error("File was not created successfully");
    }

    const isAvailable = await isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    await shareAsync(file.uri, {
      mimeType: "application/vnd.ms-excel",
      dialogTitle: t("driver.export.dialogTitle"),
    });

    requestStoreReviewAfterAction();
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
