import { getFuelData, getStaleTimeForFuelData } from "@/api/fuel";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONE_WEEK } from "@/providers/query";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";
import { FuelPriceCard } from "./fuel-price-card";
import { showFuelPriceFilters, SortType } from "./fuel-price-filters";
import { FuelPriceHeader } from "./fuel-price-header";

export type UnitType = "per1000L" | "perLiter";

export const FuelPrice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>(SortType.None);
  const [unit, setUnit] = useState<UnitType>("per1000L");
  const { t } = useTranslation();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const toggleUnit = useCallback(() => {
    setUnit((prev) =>
      prev === "per1000L" ? "perLiter" : "per1000L"
    );
  }, []);

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["fuel-prices"],
    queryFn: () => getFuelData(),
    staleTime: (query) => {
      const lastDate = query.state.data?.date;
      return getStaleTimeForFuelData(lastDate);
    },
    gcTime: ONE_WEEK,
    retry: 5,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  console.log({ data, isFetching });

  const handleFilterPress = useCallback(() => {
    showFuelPriceFilters({
      currentSort: sortType,
      onSortChange: (sort) => setSortType(sort),
    });
  }, [sortType]);

  const ListHeader = useMemo(
    () => (
      <FuelPriceHeader
        data={data}
        colors={colors}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortType={sortType}
        onFilterPress={handleFilterPress}
        unit={unit}
        onToggleUnit={toggleUnit}
      />
    ),
    [
      data,
      colors,
      searchQuery,
      sortType,
      handleFilterPress,
      unit,
      toggleUnit,
    ]
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <ThemedText>{t("fuelPrice.noData")}</ThemedText>
      </View>
    );
  };

  const countries = useMemo(() => {
    if (!data?.countries) return [];

    let filtered = [...data.countries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (country) =>
          country.country.toLowerCase().includes(query) ||
          country.countryCode.toLowerCase().includes(query)
      );
    }

    let sorted = [...filtered];

    if (sortType === SortType.AlphaAsc) {
      sorted.sort((a, b) => a.country.localeCompare(b.country));
    } else if (sortType === SortType.AlphaDesc) {
      sorted.sort((a, b) => b.country.localeCompare(a.country));
    } else if (sortType === SortType.PetrolAsc) {
      sorted.sort((a, b) => a.petrol - b.petrol);
    } else if (sortType === SortType.PetrolDesc) {
      sorted.sort((a, b) => b.petrol - a.petrol);
    } else if (sortType === SortType.DieselAsc) {
      sorted.sort((a, b) => a.diesel - b.diesel);
    } else if (sortType === SortType.DieselDesc) {
      sorted.sort((a, b) => b.diesel - a.diesel);
    }

    return sorted;
  }, [data, searchQuery, sortType]);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.countryCode}
        renderItem={({ item }) => (
          <FuelPriceCard country={item} unit={unit} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refetch()}
          />
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});
