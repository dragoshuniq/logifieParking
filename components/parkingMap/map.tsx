import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { ThemedView } from "../ui/themed-view";

export const ParkingMap = () => {
  return (
    <ThemedView style={styles.container}>
      <MapView style={styles.map} />
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
