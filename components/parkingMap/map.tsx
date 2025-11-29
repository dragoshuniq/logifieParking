import { getAllParkings } from "@/api/parking";
import { DEFAULT_COORDINATES } from "@/constants/app.const";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { ThemedView } from "../ui/themed-view";

export const ParkingMap = () => {
  const theme = useColorScheme() ?? "light";
  const { data } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
  });

  const clusterColor = Colors[theme].primary.DEFAULT;
  const clusterTextColor = Colors[theme].primary.foreground;

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: DEFAULT_COORDINATES.latitude,
          longitude: DEFAULT_COORDINATES.longitude,
          latitudeDelta: 8.5,
          longitudeDelta: 8.5,
        }}
        clusterColor={clusterColor}
        clusterTextColor={clusterTextColor}
        radius={50}
        minZoom={10}
        maxZoom={20}
        extent={512}
        nodeSize={64}
        animationEnabled
      >
        {data?.parkings?.map((parking) => (
          <Marker
            key={parking._id}
            coordinate={{
              latitude: parking.latitude || 0,
              longitude: parking.longitude || 0,
            }}
            title={parking.country}
            description={parking.countryCode}
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
