import { useThemedColors } from "@/hooks/use-themed-colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet } from "react-native";
import { parkingDisclaimer } from "../drawer/disclaimers";
import { showInfoSheet } from "../ui/info-sheet";
import { ThemedPressable } from "../ui/themed-pressable";

export const MapDisclaimerButton = () => {
  const { warning } = useThemedColors("warning");

  const handlePress = () => {
    showInfoSheet(parkingDisclaimer);
  };

  return (
    <ThemedPressable onPress={handlePress} style={styles.button}>
      <MaterialIcons name="info" size={24} color={warning.DEFAULT} />
    </ThemedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1000,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
