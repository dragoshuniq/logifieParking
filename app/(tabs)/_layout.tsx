import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { CustomDrawerHeader } from "@/components/drawer/custom-drawer-header";
import {
  driverDisclaimer,
  fuelPricesDisclaimer,
} from "@/components/drawer/disclaimers";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getPermissionStatus,
  scheduleTestReminders,
} from "@/services/notifications";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      // FOR TESTING ONLY: Check if permissions are already granted and schedule test reminders
      // This handles the case where the user previously granted permissions
      const status = await getPermissionStatus();
      if (status === "granted") {
        console.log(
          "Permissions already granted, scheduling test reminders..."
        );
        await scheduleTestReminders(1);
      }
    })();
  }, []);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
      }}
    >
      <Tabs.Screen
        name="driver"
        options={{
          title: t("tabs.driver"),
          header: () => (
            <CustomDrawerHeader
              title="drawer.driver"
              disclaimer={driverDisclaimer}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="truck-fast"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.map"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gas"
        options={{
          title: t("tabs.gas"),
          header: () => (
            <CustomDrawerHeader
              title="drawer.fuelPrices"
              disclaimer={fuelPricesDisclaimer}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="gas-pump" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
