import LanguagePickerSheet from "@/components/drawer/language-picker-sheet";
import ActivityFormSheet from "@/components/driver/activity-form";
import TimePickerSheet from "@/components/driver/time-picker-sheet";
import { FuelPriceFilters } from "@/components/fuel-price/fuel-price-filters";
import { NavigationOptions } from "@/components/parking-map/navigation-options";
import { ESheets } from "@/constants/sheets";
import { registerSheet } from "react-native-actions-sheet";

registerSheet(ESheets.NavigationOptions, NavigationOptions);
registerSheet(ESheets.FuelPriceFilters, FuelPriceFilters);
registerSheet(ESheets.LanguagePicker, LanguagePickerSheet);
registerSheet(ESheets.ActivityForm, ActivityFormSheet);
registerSheet(ESheets.TimePicker, TimePickerSheet);
