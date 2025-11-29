import { getAllParkings } from "@/api/parking";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ThemedView } from "../ui/themed-view";

export const ParkingMap = () => {
  const { data } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings(),
  });

  console.log(data);

  return (
    <ThemedView style={styles.container}>
      <MapView style={styles.map}>
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
