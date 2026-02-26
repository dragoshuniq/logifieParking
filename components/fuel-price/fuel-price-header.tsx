import { Colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";
import { ThemedView } from "../ui/themed-view";
import { SortType } from "./fuel-price-filters";

type UnitType = "per1000L" | "perLiter";

type FuelPriceHeaderProps = {
  data: { date: string } | undefined | null;
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortType: SortType;
  onFilterPress: () => void;
  unit: UnitType;
  onToggleUnit: () => void;
};

export const FuelPriceHeader = memo(function FuelPriceHeader({
  data,
  colors,
  searchQuery,
  onSearchChange,
  sortType,
  onFilterPress,
  unit,
  onToggleUnit,
}: FuelPriceHeaderProps) {
  const { t, i18n } = useTranslation();

  if (!data) return null;
  return (
    <ThemedView style={styles.header}>
      <View style={styles.topRow}>
        <ThemedText style={styles.date}>
          {t("fuelPrice.updated", {
            date: new Date(data.date).toLocaleDateString(
              i18n.language
            ),
          })}
        </ThemedText>

        <ThemedTouchableOpacity
          lightColor={colors.primary.DEFAULT}
          darkColor={colors.primary.DEFAULT}
          onPress={onToggleUnit}
          style={styles.unitButton}
        >
          <ThemedText>
            {unit === "per1000L" ? "/ 1000L" : "/ 1L"}
          </ThemedText>
        </ThemedTouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={colors.icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
              borderColor: colors.default[400],
              backgroundColor: colors.background,
            },
          ]}
          placeholder={t("fuelPrice.searchPlaceholder")}
          placeholderTextColor={colors.tabIconDefault}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <ThemedTouchableOpacity
            style={styles.clearIcon}
            onPress={() => onSearchChange("")}
          >
            <MaterialIcons
              name="close"
              size={18}
              color={colors.icon}
            />
          </ThemedTouchableOpacity>
        )}
        <ThemedTouchableOpacity
          style={[
            styles.filterButton,
            sortType !== SortType.None
              ? { backgroundColor: colors.tint }
              : {
                  borderColor: colors.default[400],
                  borderWidth: 1,
                },
          ]}
          onPress={onFilterPress}
        >
          <MaterialIcons
            name="filter-list"
            size={20}
            color={
              sortType !== SortType.None
                ? colors.primary.foreground
                : colors.icon
            }
          />
        </ThemedTouchableOpacity>
      </View>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  clearIcon: {
    position: "absolute",
    right: 60,
    zIndex: 1,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
