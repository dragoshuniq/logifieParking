import dayjs from "dayjs";
import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { Activity } from "./driver-db";

export const exportToCSV = async (
  activities: Activity[]
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
  ];
  const rows = activities.map((activity) => {
    const startDate = dayjs(activity.startDateTime);
    const endDate = dayjs(activity.endDateTime);
    return [
      startDate.format("YYYY-MM-DD"),
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      activity.duration.toFixed(2),
      activity.type,
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const fileName = `driver_hours_${dayjs().format(
    "YYYY-MM-DD_HH-mm"
  )}.csv`;

  const file = new File(Paths.document, fileName);
  file.create();
  file.write(csvContent);

  const isAvailable = await isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device");
  }

  await shareAsync(file.uri, {
    mimeType: "text/csv",
    dialogTitle: "Export Driver Hours",
    UTI: "public.comma-separated-values-text",
  });
};

export const exportToXLS = async (
  activities: Activity[]
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
  ];
  const rows = activities.map((activity) => {
    const startDate = dayjs(activity.startDateTime);
    const endDate = dayjs(activity.endDateTime);
    return [
      startDate.format("YYYY-MM-DD"),
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      activity.duration.toFixed(2),
      activity.type,
    ];
  });

  const worksheet = `
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

  const xlsContent = xmlHeader + xlsHeader + worksheet + xlsFooter;

  const fileName = `driver_hours_${dayjs().format(
    "YYYY-MM-DD_HH-mm"
  )}.xls`;

  const file = new File(Paths.document, fileName);
  file.create();
  file.write(xlsContent);

  const isAvailable = await isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device");
  }

  await shareAsync(file.uri, {
    mimeType: "application/vnd.ms-excel",
    dialogTitle: "Export Driver Hours",
  });
};
