import { getFuelData, getStaleTimeForFuelData } from "@/api/fuel";
import { ONE_WEEK } from "@/providers/query";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";
import { FuelPriceCard } from "./fuel-price-card";

export const FuelPrice = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["fuel-prices"],
    queryFn: () => getFuelData(),
    staleTime: (query) => {
      const lastDate = query.state.data?.date;
      return getStaleTimeForFuelData(lastDate);
    },
    gcTime: ONE_WEEK,
  });

  const renderHeader = () => {
    if (!data) return null;
    return (
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Fuel Prices</ThemedText>
        <ThemedText style={styles.date}>
          Updated: {new Date(data.date).toLocaleDateString()}
        </ThemedText>
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

  return (
    <ThemedSafeAreaView style={styles.container}>
      <FlatList
        data={data?.countries || []}
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
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});
