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
  }
}
