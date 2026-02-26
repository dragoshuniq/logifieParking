import { getAllParkings, IParking } from "@/api/parking";
import { AppConstants } from "@/constants/app.const";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONE_MINUTE, ONE_WEEK } from "@/providers/query";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { DrawerToggleButton } from "../drawer/custom-drawer-header";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";
import { LocationButton } from "./location-button";
import { MapDisclaimerButton } from "./map-disclaimer";
import { getDarkMapStyle } from "./map-style";
import { showNavigationOptions } from "./navigation-options";

import { ClusterMarker } from "./cluster-marker";

export const ParkingMap = () => {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { top } = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
    staleTime: (query) => {
      const parkingData = query.state.data;
      const hasNoData =
        !parkingData?.parkings?.length ||
        parkingData?.totalParkings === 0;
      return hasNoData ? ONE_MINUTE : ONE_WEEK;
    },
    refetchOnMount: (query) => {
      const parkingData = query.state.data;
      const hasNoData =
        !parkingData?.parkings?.length ||
        parkingData?.totalParkings === 0;
      return hasNoData;
    },
    retry: 3,
    retryDelay: 3000,
    gcTime: ONE_WEEK,
  });

  const clusterColor = Colors[theme].primary.DEFAULT;
  const clusterTextColor = Colors[theme].primary.foreground;

  const mapStyle = useMemo(() => {
    return theme === "dark" ? getDarkMapStyle() : [];
  }, [theme]);

  useEffect(() => {
    if (mapRef.current) {
      (mapRef.current as any)?.setMapStyle?.(mapStyle);
    }
  }, [mapStyle]);

  const handleMarkerSelect = (parking: IParking) => {
    showNavigationOptions({
      destination: {
        latitude: parking.latitude,
        longitude: parking.longitude,
      },
    });
  };

  const handleLocationFound = (location: Location.LocationObject) => {
    const { latitude, longitude } = location.coords;
    (mapRef.current as any)?.animateToRegion?.(
      {
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
      1000
    );
  };

  return (
    <ThemedView style={styles.container}>
      <DrawerToggleButton
        containerStyle={[styles.drawerToggleButton, { top: top }]}
      />
      {isLoading && !data && (
        <ThemedView style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <ThemedText style={styles.overlayText}>
            {t("parking.loading")}
          </ThemedText>
        </ThemedView>
      )}
      {isError && !data && (
        <ThemedView style={styles.overlay}>
          <ThemedText style={styles.overlayText}>
            {t("parking.loadError")}
          </ThemedText>
          <Pressable
            onPress={() => refetch()}
            style={[
              styles.retryButton,
              { backgroundColor: colors.primary.DEFAULT },
            ]}
          >
            <ThemedText
              style={[
                styles.retryButtonText,
                { color: colors.primary.foreground },
              ]}
            >
              {t("parking.retry")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
      <MapView
        toolbarEnabled={false}
        ref={mapRef}
        showsUserLocation
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: AppConstants.coordinates.latitude,
          longitude: AppConstants.coordinates.longitude,
          latitudeDelta: 8.5,
          longitudeDelta: 8.5,
        }}
        clusterColor={clusterColor}
        clusterTextColor={clusterTextColor}
        minPoints={Platform.OS === "android" ? 5 : 10}
        animationEnabled
        {...Platform.select({
          android: {
            renderCluster: (cluster) => {
              const { id, geometry, onPress, properties } = cluster;
              const points = properties.point_count;

              return (
                <ClusterMarker
                  key={`cluster-${id}`}
                  id={id}
                  coordinate={{
                    longitude: geometry.coordinates[0],
                    latitude: geometry.coordinates[1],
                  }}
                  onPress={onPress}
                  points={points}
                />
              );
            },
          },
        })}
      >
        {data?.parkings?.map((parking) => (
          <Marker
            key={parking._id}
            coordinate={{
              latitude: parking.latitude || 0,
              longitude: parking.longitude || 0,
            }}
            onPress={() => handleMarkerSelect(parking)}
          />
        ))}
      </MapView>
      <MapDisclaimerButton />
      <LocationButton onLocationFound={handleLocationFound} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  drawerToggleButton: {
    position: "absolute",
    left: 16,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayText: {
    marginTop: 12,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
