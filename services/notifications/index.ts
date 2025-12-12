import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_IDS,
  SCHEDULE_TIMES,
} from "./constants";

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNELS.DAILY_REMINDERS,
      {
        name: "Daily Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      }
    );
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return true;
}

export async function scheduleDailyNotifications(
  messages: {
    driver: string;
    fuel: string;
    parking: string;
  },
  options: {
    color: string;
    urls: {
      driver: string;
      fuel: string;
      parking: string;
    };
  }
) {
  // Cancel established notifications by specific IDs to allow updating content/time
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
      title: "Logifie Parking",
      body: messages.driver,
      color: options.color,
      sound: true,
      data: { type: "driver", url: options.urls.driver },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: SCHEDULE_TIMES.DRIVER.hour,
      minute: SCHEDULE_TIMES.DRIVER.minute,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.FUEL,
    content: {
      title: "Logifie Parking",
      body: messages.fuel,
      color: options.color,
      sound: true,
      data: { type: "fuel", url: options.urls.fuel },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: SCHEDULE_TIMES.FUEL.hour,
      minute: SCHEDULE_TIMES.FUEL.minute,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.PARKING,
    content: {
      title: "Logifie Parking",
      body: messages.parking,
      color: options.color,
      sound: true,
      data: { type: "parking", url: options.urls.parking },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: SCHEDULE_TIMES.PARKING.hour,
      minute: SCHEDULE_TIMES.PARKING.minute,
      repeats: true,
    },
  });
}
