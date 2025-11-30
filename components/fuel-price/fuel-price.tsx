import { getFuelData, getStaleTimeForFuelData } from "@/api/fuel";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONE_WEEK } from "@/providers/query";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";
import { ThemedView } from "../ui/themed-view";
import { FuelPriceCard } from "./fuel-price-card";
import { showFuelPriceFilters, SortType } from "./fuel-price-filters";

export const FuelPrice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>(SortType.None);
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["fuel-prices"],
    queryFn: () => getFuelData(),
    staleTime: (query) => {
      const lastDate = query.state.data?.date;
      return getStaleTimeForFuelData(lastDate);
    },
    gcTime: ONE_WEEK,
  });

  const handleFilterPress = () => {
    showFuelPriceFilters({
      currentSort: sortType,
      onSortChange: (sort) => setSortType(sort),
    });
  };

  const renderHeader = () => {
    if (!data) return null;
    return (
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Fuel Prices</ThemedText>
        <ThemedText style={styles.date}>
          Updated: {new Date(data.date).toLocaleDateString()}
        </ThemedText>

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
            placeholder="Search countries..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
            onPress={handleFilterPress}
          >
            <MaterialIcons
              name="filter-list"
              size={20}
              color={
                sortType !== SortType.None ? "#fff" : colors.icon
              }
            />
          </ThemedTouchableOpacity>
        </View>
      </ThemedView>
    );
  };

  const renderEmpty = () => {
    if (isFetching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <ThemedText>No fuel data available</ThemedText>
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
    <ThemedSafeAreaView style={styles.container}>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.countryCode}
        renderItem={({ item }) => <FuelPriceCard country={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => refetch()}
          />
        }
      />
    </ThemedSafeAreaView>
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
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
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 12,
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
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});
