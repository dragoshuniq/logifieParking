import { Activity } from "@/utils/driver-db";

export enum ESheets {
  NavigationOptions = "NavigationOptions",
  FuelPriceFilters = "FuelPriceFilters",
  LanguagePicker = "LanguagePicker",
  TimePicker = "TimePicker",
  ActivityForm = "ActivityForm",
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
  date: string;
}
