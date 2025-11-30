import { IFuelPrice } from "@/api/fuel";
import { useThemedColors } from "@/hooks/use-themed-colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";

type Props = {
  country: IFuelPrice;
};

export const FuelPriceCard = ({ country }: Props) => {
  const { primary: primaryColors, default: defaultColors } =
    useThemedColors("primary", "default");
  const borderColor = defaultColors[400];

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CountryFlag isoCode={country.countryCode} size={24} />
          <ThemedText style={styles.countryName}>
            {country.country}
          </ThemedText>
        </View>
        <ThemedText style={styles.countryCode}>
          {country.countryCode}
        </ThemedText>
      </View>

      <View style={styles.pricesContainer}>
        <View style={styles.priceSection}>
          <ThemedText style={styles.fuelType}>Petrol</ThemedText>
          <ThemedText
            style={[
              styles.priceEur,
              { color: primaryColors.DEFAULT },
            ]}
          >
            €{country.petrol.toFixed(2)}
          </ThemedText>
          {country.currencyHome && country.petrolHome && (
            <ThemedText style={styles.priceHome}>
              {country.currencyHome} {country.petrolHome.toFixed(2)}
            </ThemedText>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.priceSection}>
          <ThemedText style={styles.fuelType}>Diesel</ThemedText>
          <ThemedText
            style={[
              styles.priceEur,
              { color: primaryColors.DEFAULT },
            ]}
          >
            €{country.diesel.toFixed(2)}
          </ThemedText>
          {country.currencyHome && country.dieselHome && (
            <ThemedText style={styles.priceHome}>
              {country.currencyHome} {country.dieselHome.toFixed(2)}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  countryCode: {
    fontSize: 14,
    opacity: 0.7,
  },
  pricesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  priceSection: {
    flex: 1,
    alignItems: "center",
  },
  fuelType: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  priceEur: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  priceHome: {
    fontSize: 12,
    opacity: 0.6,
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 16,
  },
});
