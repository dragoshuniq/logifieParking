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

export interface ExportConfigProps {
  onExport: (
    type: "csv" | "xls",
    startDate: Date,
    endDate: Date
  ) => void;
  selectedDate: Date;
}

export type InfoSection = {
  heading: string;
  content: string;
};

export type InfoSheetProps = {
  title: string;
  icon: string;
  sections: InfoSection[];
};
