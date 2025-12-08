import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTouchableOpacity } from "@/components/ui/themed-touchable-opacity";
import { ESheets } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
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
  { label: "sortOptions.alphaAsc", value: SortType.AlphaAsc },
  { label: "sortOptions.alphaDesc", value: SortType.AlphaDesc },
  { label: "sortOptions.petrolAsc", value: SortType.PetrolAsc },
  { label: "sortOptions.petrolDesc", value: SortType.PetrolDesc },
  { label: "sortOptions.dieselAsc", value: SortType.DieselAsc },
  { label: "sortOptions.dieselDesc", value: SortType.DieselDesc },
];

export const FuelPriceFilters = () => {
  const payload = useSheetPayload(ESheets.FuelPriceFilters);
  const { t } = useTranslation();
  const { currentSort, onSortChange } = payload || {};
  const [selectedSort, setSelectedSort] = useState<SortType>(
    currentSort || SortType.None
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { content2: content2Colors, tint: tintColors } =
    useThemedColors("content2", "tint");
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
        { backgroundColor: content2Colors.DEFAULT },
      ]}
      gestureEnabled
      useBottomSafeAreaPadding
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          {t("fuelPrice.sortBy")}
        </ThemedText>

        {SORT_OPTIONS.map((option, index) => (
          <SortOption
            key={option.value}
            label={t(option.label)}
            isSelected={selectedSort === option.value}
            onPress={() => handleSortSelect(option.value)}
            isLast={index === SORT_OPTIONS.length - 1}
          />
        ))}

        <ThemedTouchableOpacity
          style={[
            styles.confirmButton,
            { backgroundColor: tintColors },
          ]}
          onPress={handleConfirm}
        >
          <ThemedText
            style={styles.confirmButtonText}
            lightColor="#fff"
            darkColor="#fff"
          >
            {t("common.apply")}
          </ThemedText>
        </ThemedTouchableOpacity>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
