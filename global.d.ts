import { Activity } from "@/utils/driver-db";
import "react-native-actions-sheet";
import { LatLng } from "react-native-maps";

declare module "react-native-actions-sheet" {
  export interface Sheets {
    NavigationOptions: {
      payload: {
        destination: LatLng;
      };
      returnValue?: undefined;
    };
    FuelPriceFilters: {
      payload: {
        currentSort: SortType;
        onSortChange: (sort: SortType) => void;
      };
      returnValue?: undefined;
    };
    LanguagePicker: {
      payload?: undefined;
      returnValue?: undefined;
    };
    TimePicker: {
      payload: {
        onCancel?: () => void;
        onConfirm: (date: Date) => void;
        value?: Date;
        maximumDate?: Date;
        minimumDate?: Date;
        minuteInterval?: MinuteInterval;
      };
      returnValue?: undefined;
    };
    ActivityForm: {
      payload: {
        onSave: (activity: Activity) => void;
        onDelete?: () => void;
        initialActivity?: Activity;
        selectedDate: Date;
      };
      returnValue?: undefined;
    };
    DatePicker: {
      payload: {
        onCancel?: () => void;
        onConfirm: (date: string) => void;
        value?: string;
        minDate?: string;
        maxDate?: string;
      };
      returnValue?: undefined;
    };
    ExportConfig: {
      payload: {
        selectedDate: Date;
      };
      returnValue?: undefined;
    };
    InfoSheet: {
      payload: {
        title: string;
        sections: {
          heading: string;
          content: string;
        }[];
      };
      returnValue?: undefined;
    };
    NotificationPermission: {
      payload: {
        mode: "request" | "settings";
        context: "value_moment" | "feature_gate";
        onPrimary: () => void;
        onSecondary: () => void;
        onClose: () => void;
      };
      returnValue?: undefined;
    };
  }
}
