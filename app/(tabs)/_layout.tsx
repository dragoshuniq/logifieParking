import * as Notifications from "expo-notifications";
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
import { scheduleTestNotification } from "@/services/notifications/test";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

import {
  registerForPushNotificationsAsync,
  scheduleDailyNotifications,
} from "../../services/notifications";

import { useNotificationObserver } from "../../hooks/use-notification-observer";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  useNotificationObserver();

  useEffect(() => {
    (async () => {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        await scheduleDailyNotifications(
          {
            driver: t(
              "notifications.driver",
              "Don't forget to use the Driver Assistant!"
            ),
            fuel: t(
              "notifications.fuel",
              "Check today's fuel prices!"
            ),
            parking: t(
              "notifications.parking",
              "Evening parking reminder."
            ),
          },
          {
            color: Colors.light.primary.DEFAULT,
            urls: {
              driver: "/(tabs)/driver",
              fuel: "/(tabs)/gas",
              parking: "/",
            },
          }
        );
      }
    })();
  }, [t]);

  useEffect(() => {
    (async () => {
      // Ensure permissions are checking before testing
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Notification permission status:", status);
      if (status === "granted") {
        await scheduleTestNotification("Test", "Tap to open Driver", {
          color: "#e63946",
          url: "/(tabs)/driver",
        });
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
