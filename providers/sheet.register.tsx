import { NavigationOptions } from "@/components/parking-map/navigation-options";
import { ESheets } from "@/constants/sheets";
import { registerSheet } from "react-native-actions-sheet";

registerSheet(ESheets.NavigationOptions, NavigationOptions);
