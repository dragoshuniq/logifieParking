import { NavigationOptions } from "@/components/parkingMap/navigation-options";
import { ESheets } from "@/constants/sheets";
import { registerSheet } from "react-native-actions-sheet";

registerSheet(ESheets.NavigationOptions, NavigationOptions);
