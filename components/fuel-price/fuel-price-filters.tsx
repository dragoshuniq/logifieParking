import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTouchableOpacity } from "@/components/ui/themed-touchable-opacity";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets } from "@/constants/sheets";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { SortOption } from "./sort-option";

export enum SortType {
  None = "none",
  PetrolAsc = "petrol-asc",
  PetrolDesc = "petrol-desc",
  DieselAsc = "diesel-asc",
  DieselDesc = "diesel-desc",
  AlphaAsc = "alpha-asc",
  AlphaDesc = "alpha-desc",
}

type FuelPriceFiltersPayload = {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
};

export const showFuelPriceFilters = (
  payload: FuelPriceFiltersPayload
) => {
  SheetManager.show(ESheets.FuelPriceFilters, {
    payload,
  });
};

const SORT_OPTIONS = [
  { label: "A-Z", value: SortType.AlphaAsc },
  { label: "Z-A", value: SortType.AlphaDesc },
  { label: "Petrol: Low to High", value: SortType.PetrolAsc },
  { label: "Petrol: High to Low", value: SortType.PetrolDesc },
  { label: "Diesel: Low to High", value: SortType.DieselAsc },
  { label: "Diesel: High to Low", value: SortType.DieselDesc },
];

export const FuelPriceFilters = () => {
  const payload = useSheetPayload(ESheets.FuelPriceFilters);
  const { currentSort, onSortChange } = payload || {};
  const [selectedSort, setSelectedSort] = useState<SortType>(
    currentSort || SortType.None
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const handleSortSelect = (sort: SortType) => {
    setSelectedSort(selectedSort === sort ? SortType.None : sort);
  };

  const handleConfirm = () => {
    onSortChange?.(selectedSort);
    SheetManager.hide(ESheets.FuelPriceFilters);
  };

  return (
    <ActionSheet
      id={ESheets.FuelPriceFilters}
      ref={actionSheetRef}
      containerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      gestureEnabled
      useBottomSafeAreaPadding
      indicatorStyle={[
        styles.indicator,
        { backgroundColor: colors.default[400] },
      ]}
    >
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Sort by</ThemedText>

        {SORT_OPTIONS.map((option, index) => (
          <SortOption
            key={option.value}
            label={option.label}
            isSelected={selectedSort === option.value}
            onPress={() => handleSortSelect(option.value)}
            isLast={index === SORT_OPTIONS.length - 1}
          />
        ))}

        <ThemedTouchableOpacity
          style={[
            styles.confirmButton,
            { backgroundColor: colors.tint },
          ]}
          onPress={handleConfirm}
        >
          <ThemedText
            style={styles.confirmButtonText}
            lightColor="#fff"
            darkColor="#fff"
          >
            Apply
          </ThemedText>
        </ThemedTouchableOpacity>
      </ThemedView>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  indicator: {
    width: 40,
    height: 4,
  },
  confirmButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
