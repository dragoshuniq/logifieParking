import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import i18n from "../../providers/i18n";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_IDS,
  SCHEDULE_TIMES,
} from "./constants";
import type { NotificationPermissionStatus } from "./types";

export async function getPermissionStatus(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function requestPermission(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status;
}

export async function getExpoPushTokenIfGranted(): Promise<
  string | null
> {
  try {
    const status = await getPermissionStatus();
    if (status !== "granted") {
      return null;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

export async function openAppSettings(): Promise<void> {
  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:");
  } else if (Platform.OS === "android") {
    await Linking.openSettings();
  }
}

export async function ensurePushReady(): Promise<{
  status: NotificationPermissionStatus;
  token: string | null;
}> {
  const status = await getPermissionStatus();
  const token =
    status === "granted" ? await getExpoPushTokenIfGranted() : null;
  return { status, token };
}

async function setupAndroidChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNELS.DAILY_REMINDERS,
      {
        name: "Daily Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#e63946",
        sound: "default",
      }
    );
  }
}

export async function scheduleAllReminders() {
  await setupAndroidChannel();

  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.DRIVER
  );
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.FUEL
  );
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.PARKING
  );

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.DRIVER,
    content: {
      title: i18n.t("notifications.driver.title"),
      body: i18n.t("notifications.driver.body"),
      data: { url: "/(tabs)/driver" },
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: NOTIFICATION_CHANNELS.DAILY_REMINDERS,
      hour: SCHEDULE_TIMES.DRIVER.hour,
      minute: SCHEDULE_TIMES.DRIVER.minute,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.FUEL,
    content: {
      title: i18n.t("notifications.fuel.title"),
      body: i18n.t("notifications.fuel.body"),
      data: { url: "/(tabs)/gas" },
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: NOTIFICATION_CHANNELS.DAILY_REMINDERS,
      hour: SCHEDULE_TIMES.FUEL.hour,
      minute: SCHEDULE_TIMES.FUEL.minute,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.PARKING,
    content: {
      title: i18n.t("notifications.parking.title"),
      body: i18n.t("notifications.parking.body"),
      data: { url: "/(tabs)" },
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: NOTIFICATION_CHANNELS.DAILY_REMINDERS,
      hour: SCHEDULE_TIMES.PARKING.hour,
      minute: SCHEDULE_TIMES.PARKING.minute,
    },
  });
}
