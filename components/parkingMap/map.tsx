import { getAllParkings, IParking } from "@/api/parking";
import { DEFAULT_COORDINATES } from "@/constants/app.const";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { ThemedView } from "../ui/themed-view";
import { showNavigationOptions } from "./navigation-options";

export const ParkingMap = () => {
  const theme = useColorScheme() ?? "light";
  const { data } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
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

  return (
    <ThemedView style={styles.container}>
      <MapView
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
