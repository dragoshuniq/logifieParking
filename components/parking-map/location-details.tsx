import { fetchLocationDetails, LocationDetails } from "@/api/parking";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet } from "react-native";
import CountryFlag from "react-native-country-flag";

type LocationDetailsComponentProps = {
  lat: number;
  lng: number;
};

export const LocationDetailsComponent = ({
  lat,
  lng,
}: LocationDetailsComponentProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme as "light" | "dark"];

  const { data: locationDetails, isFetching } =
    useQuery<LocationDetails | null>({
      queryKey: ["locationDetails", lat, lng],
      queryFn: () => fetchLocationDetails(lat, lng),
    });

  if (isFetching) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator
          size="small"
          color={themeColors.primary.DEFAULT}
        />
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
          {t("parking.noLocationDetails")}
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
            {t("parking.location")}:
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
            {t("parking.city")}:
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
            {t("parking.suburb")}:
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
            {t("parking.county")}:
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
            {t("parking.state")}:
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
            {t("parking.country")}:
          </ThemedText>
          <ThemedView style={styles.countryValue}>
            {address.country_code && (
              <CountryFlag
                isoCode={address.country_code.toUpperCase()}
                size={20}
                style={styles.flag}
              />
            )}
            <ThemedText
              lightColor={Colors.light.text}
              darkColor={Colors.dark.text}
              style={styles.value}
            >
              {address.country}
            </ThemedText>
          </ThemedView>
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
            {t("parking.postcode")}:
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
            {t("parking.category")}:
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
            {t("parking.type")}:
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
  countryValue: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    marginRight: 8,
  },
});
