import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import i18n from "../../providers/i18n";
import { NOTIFICATION_CHANNELS, NOTIFICATION_IDS } from "./constants";

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

export async function scheduleTestReminders(
  minutesFromNow: number = 1
) {
  await setupAndroidChannel();

  const now = new Date();
  const testTime = new Date(
    now.getTime() + minutesFromNow * 60 * 1000
  );
  const hour = testTime.getHours();
  const minute = testTime.getMinutes();

  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.DRIVER
  );
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.FUEL
  );
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.PARKING
  );

  console.log(
    `Scheduling test notifications for ${hour}:${minute} (in ${minutesFromNow} minute(s))`
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
      hour: hour,
      minute: minute,
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
      hour: hour,
      minute: minute + 1,
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
      hour: hour,
      minute: minute + 2,
    },
  });

  console.log("Test notifications scheduled:");
  console.log(`  - Driver: ${hour}:${minute}`);
  console.log(`  - Fuel: ${hour}:${minute + 1}`);
  console.log(`  - Parking: ${hour}:${minute + 2}`);
}
