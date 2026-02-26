import LanguagePickerSheet from "@/components/drawer/language-picker-sheet";
import ActivityFormSheet from "@/components/driver/activity-form";
import DatePickerSheet from "@/components/driver/date-picker-sheet";
import ExportConfigSheet from "@/components/driver/export-config-sheet";
import TimePickerSheet from "@/components/driver/time-picker-sheet";
import { FuelPriceFilters } from "@/components/fuel-price/fuel-price-filters";
import NotificationPermissionDialog from "@/components/notifications/notification-permission-dialog";
import { NavigationOptions } from "@/components/parking-map/navigation-options";
import InfoSheet from "@/components/ui/info-sheet";
import { ESheets } from "@/constants/sheets";
import { initializeCalendarLocales } from "@/utils/calendar-config";
import { registerSheet } from "react-native-actions-sheet";

initializeCalendarLocales();

registerSheet(ESheets.NavigationOptions, NavigationOptions);
registerSheet(ESheets.FuelPriceFilters, FuelPriceFilters);
registerSheet(ESheets.LanguagePicker, LanguagePickerSheet);
registerSheet(ESheets.ActivityForm, ActivityFormSheet);
registerSheet(ESheets.TimePicker, TimePickerSheet);
registerSheet(ESheets.DatePicker, DatePickerSheet);
registerSheet(ESheets.ExportConfig, ExportConfigSheet);
registerSheet(ESheets.InfoSheet, InfoSheet);
registerSheet(
  ESheets.NotificationPermission,
  NotificationPermissionDialog
);
