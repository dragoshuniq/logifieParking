import { useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text } from "react-native";

export default function TabTwoScreen() {
  const queryClient = useQueryClient();

  return (
    <Pressable>
      <Pressable
        style={{
          marginTop: 100,
          backgroundColor: "red",
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => queryClient.clear()}
      >
        <Text>Clear cache</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
