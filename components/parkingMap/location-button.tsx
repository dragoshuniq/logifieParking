import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { ThemedPressable } from "../ui/themed-pressable";
import { ThemedView } from "../ui/themed-view";

type Props = {
  onLocationFound: (location: Location.LocationObject) => void;
};

export const LocationButton = ({ onLocationFound }: Props) => {
  const theme = useColorScheme() ?? "light";
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    try {
      setIsLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      onLocationFound(location);
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconColor = Colors[theme].primary.DEFAULT;

  return (
    <ThemedView style={styles.container}>
      <ThemedPressable
        onPress={handlePress}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed || isLoading ? 0.7 : 1,
          },
        ]}
      >
        <MaterialIcons
          name="my-location"
          size={24}
          color={iconColor}
        />
      </ThemedPressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
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
