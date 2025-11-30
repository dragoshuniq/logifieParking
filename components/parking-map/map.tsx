import { getAllParkings, IParking } from "@/api/parking";
import { DEFAULT_COORDINATES } from "@/constants/app.const";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { TWO_WEEKS } from "@/providers/query";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { ThemedView } from "../ui/themed-view";
import { LocationButton } from "./location-button";
import { showNavigationOptions } from "./navigation-options";

export const ParkingMap = () => {
  const theme = useColorScheme() ?? "light";
  const mapRef = useRef<MapView>(null);
  const { data } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
    staleTime: TWO_WEEKS,
    gcTime: TWO_WEEKS,
  });

  const clusterColor = Colors[theme].primary.DEFAULT;
  const clusterTextColor = Colors[theme].primary.foreground;

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
      <MapView
        ref={mapRef}
        showsUserLocation
        style={styles.map}
        initialRegion={{
          latitude: DEFAULT_COORDINATES.latitude,
          longitude: DEFAULT_COORDINATES.longitude,
          latitudeDelta: 8.5,
          longitudeDelta: 8.5,
        }}
        clusterColor={clusterColor}
        clusterTextColor={clusterTextColor}
        minPoints={10}
        animationEnabled
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
});
