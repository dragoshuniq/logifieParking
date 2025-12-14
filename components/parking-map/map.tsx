import { getAllParkings, IParking } from "@/api/parking";
import { AppConstants } from "@/constants/app.const";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { ONE_MINUTE, TWO_WEEKS } from "@/providers/query";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerToggleButton } from "../drawer/custom-drawer-header";
import { ThemedView } from "../ui/themed-view";
import { LocationButton } from "./location-button";
import { MapDisclaimerButton } from "./map-disclaimer";
import { getDarkMapStyle } from "./map-style";
import { showNavigationOptions } from "./navigation-options";

import { ClusterMarker } from "./cluster-marker"; // [NEW] Import ClusterMarker

export const ParkingMap = () => {
  const theme = useColorScheme() ?? "light";
  const { top } = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { primary } = useThemedColors("primary");

  const { data } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
    staleTime: (query) => {
      const parkingData = query.state.data;
      const hasNoData =
        !parkingData?.parkings?.length ||
        parkingData?.totalParkings === 0;
      return hasNoData ? ONE_MINUTE : TWO_WEEKS;
    },
    refetchOnMount: (query) => {
      const parkingData = query.state.data;
      const hasNoData =
        !parkingData?.parkings?.length ||
        parkingData?.totalParkings === 0;
      return hasNoData;
    },
    retry: 5,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
    gcTime: TWO_WEEKS,
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
});
