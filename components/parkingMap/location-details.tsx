import { fetchLocationDetails, LocationDetails } from "@/api/parking";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

type LocationDetailsComponentProps = {
  lat: number;
  lng: number;
};

export const LocationDetailsComponent = ({
  lat,
  lng,
}: LocationDetailsComponentProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme as "light" | "dark"];

  const { data: locationDetails, isFetching } =
    useQuery<LocationDetails | null>({
      queryKey: ["locationDetails", lat, lng],
      queryFn: () => fetchLocationDetails(lat, lng),
      staleTime: 0,
      gcTime: 0,
    });

  if (isFetching) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator
          size="small"
          color={themeColors.primary.DEFAULT}
        />
        <ThemedText
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          style={styles.loadingText}
        >
          Loading location...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!locationDetails) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText
          lightColor={Colors.light.text}
          darkColor={Colors.dark.text}
          style={styles.errorText}
        >
          No location details available
        </ThemedText>
      </ThemedView>
    );
  }

  const address = locationDetails.address;
  const city = address?.city || address?.town || address?.village;

  return (
    <ThemedView style={styles.container}>
      {locationDetails.display_name && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Location:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {locationDetails.display_name}
          </ThemedText>
        </ThemedView>
      )}
      {city && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            City:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {city}
          </ThemedText>
        </ThemedView>
      )}
      {address?.suburb && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Suburb:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {address.suburb}
          </ThemedText>
        </ThemedView>
      )}
      {address?.county && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            County:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {address.county}
          </ThemedText>
        </ThemedView>
      )}
      {address?.state && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            State:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {address.state}
          </ThemedText>
        </ThemedView>
      )}
      {address?.country && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Country:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {address.country}
          </ThemedText>
        </ThemedView>
      )}
      {address?.postcode && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Postcode:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {address.postcode}
          </ThemedText>
        </ThemedView>
      )}
      {locationDetails.category && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Category:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {locationDetails.category}
          </ThemedText>
        </ThemedView>
      )}
      {locationDetails.type && (
        <ThemedView style={styles.detailRow}>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            type="defaultSemiBold"
            style={styles.label}
          >
            Type:
          </ThemedText>
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.value}
          >
            {locationDetails.type}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
  },
  errorText: {
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  label: {
    marginRight: 8,
    minWidth: 100,
  },
  value: {
    flex: 1,
  },
});
