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

const getActivityTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.DRIVING:
      return "Driving";
    case ActivityType.OTHER_WORK:
      return "Other Work";
    case ActivityType.BREAK:
      return "Break";
    case ActivityType.REST:
      return "Rest";
    case ActivityType.AVAILABILITY:
      return "Availability";
    default:
      return type;
  }
};

export const exportToCSV = async (
  activities: Activity[],
  deficits?: WeeklyRestDeficit[]
): Promise<void> => {
  if (!activities || activities.length === 0) {
    throw new Error("No activities to export");
  }

  const headers = [
    "Date",
    "Start Time",
    "End Time",
    "Duration (hours)",
    "Activity Type",
    "Daily Driving Compliance",
    "Break Compliance",
    "Daily Rest Compliance",
    "Night Work",
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
    csvContent += "Weekly Rest Compensation Deficits\n";
    csvContent +=
      "Week Start,Week End,Deficit Hours,Compensated Hours,Must Compensate By\n";
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
      dialogTitle: "Export Driver Hours",
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
  deficits?: WeeklyRestDeficit[]
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
    "Date",
    "Start Time",
    "End Time",
    "Duration (hours)",
    "Activity Type",
    "Daily Driving Compliance",
    "Break Compliance",
    "Daily Rest Compliance",
    "Night Work",
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
      "Week Start",
      "Week End",
      "Deficit Hours",
      "Compensated Hours",
      "Must Compensate By",
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
      dialogTitle: "Export Driver Hours",
    });

    requestStoreReviewAfterAction();
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
