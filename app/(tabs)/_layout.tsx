import { Tabs } from "expo-router";
import React from "react";

import { CustomDrawerHeader } from "@/components/drawer/custom-drawer-header";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
        // headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gas"
        options={{
          title: "Gas",
          header: () => (
            <CustomDrawerHeader title="drawer.fuelPrices" />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="gas-pump" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
