import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Location from "expo-location";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface LocationButtonProps {
  onLocationFound: (location: Location.LocationObject) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocationFound,
}) => {
  const theme = useColorScheme() ?? "light";
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    try {
      setIsLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
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

  const backgroundColor = Colors[theme].background;
  const iconColor = Colors[theme].primary.DEFAULT;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor,
            opacity: pressed || isLoading ? 0.7 : 1,
          },
        ]}
      >
        <MaterialIcons
          name="my-location"
          size={24}
          color={iconColor}
        />
      </Pressable>
    </View>
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

