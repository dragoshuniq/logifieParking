import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Activity } from './driver-db';

export const exportToCSV = async (activities: Activity[]): Promise<void> => {
  const headers = ['Date', 'Start Time', 'End Time', 'Duration (hours)', 'Activity Type'];
  const rows = activities.map(activity => {
    const startDate = new Date(activity.startDateTime);
    const endDate = new Date(activity.endDateTime);
    return [
      startDate.toLocaleDateString(),
      startDate.toLocaleTimeString(),
      endDate.toLocaleTimeString(),
      activity.duration.toFixed(2),
      activity.type,
    ];
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  const fileUri = `${FileSystem.documentDirectory}driver_hours_${Date.now()}.csv`;
  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Driver Hours',
      UTI: 'public.comma-separated-values-text',
    });
  }
};

export const exportToXLS = async (activities: Activity[]): Promise<void> => {
  const xmlHeader = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
  const xlsHeader = '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  const xlsFooter = '</Workbook>';
  
  const headers = ['Date', 'Start Time', 'End Time', 'Duration (hours)', 'Activity Type'];
  const rows = activities.map(activity => {
    const startDate = new Date(activity.startDateTime);
    const endDate = new Date(activity.endDateTime);
    return [
      startDate.toLocaleDateString(),
      startDate.toLocaleTimeString(),
      endDate.toLocaleTimeString(),
      activity.duration.toFixed(2),
      activity.type,
    ];
  });
  
  const worksheet = `
    <Worksheet ss:Name="Driver Hours">
      <Table>
        <Row>
          ${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
        </Row>
        ${rows.map(row => `
          <Row>
            ${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}
          </Row>
        `).join('')}
      </Table>
    </Worksheet>
  `;
  
  const xlsContent = xmlHeader + xlsHeader + worksheet + xlsFooter;
  
  const fileUri = `${FileSystem.documentDirectory}driver_hours_${Date.now()}.xls`;
  await FileSystem.writeAsStringAsync(fileUri, xlsContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.ms-excel',
      dialogTitle: 'Export Driver Hours',
    });
  }
};

