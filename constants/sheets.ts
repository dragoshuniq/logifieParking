import { Activity } from "@/utils/driver-db";

export enum ESheets {
  NavigationOptions = "NavigationOptions",
  FuelPriceFilters = "FuelPriceFilters",
  LanguagePicker = "LanguagePicker",
  TimePicker = "TimePicker",
  ActivityForm = "ActivityForm",
  DatePicker = "DatePicker",
  ExportConfig = "ExportConfig",
  InfoSheet = "InfoSheet",
  NotificationPermission = "NotificationPermission",
}

export interface TimePickerProps {
  onCancel?: () => void;
  onConfirm: (date: Date) => void;
  value?: Date;
  maximumDate?: Date;
  minimumDate?: Date;
  minuteInterval?: number;
}

export interface ActivityFormPayload {
  onSave: (activity: Activity) => void;
  onDelete?: () => void;
  initialActivity?: Activity;
  selectedDate: Date;
}

export interface DatePickerProps {
  onCancel?: () => void;
  onConfirm: (date: string) => void;
  value?: string;
  minDate?: string;
  maxDate?: string;
}

export type InfoSection = {
  heading: string;
  content: string;
};

export type InfoSheetProps = {
  title: string;
  sections: InfoSection[];
};

export interface NotificationPermissionPayload {
  mode: "request" | "settings";
  context: "value_moment" | "feature_gate";
  onPrimary: () => void;
  onSecondary: () => void;
  onClose: () => void;
}
