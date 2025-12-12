import * as Notifications from "expo-notifications";

export async function scheduleTestNotification(
  title: string,
  body: string,
  options: {
    color: string;
    url: string; // Add url to test payload
  }
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      color: options.color,
      sound: true,
      data: { url: options.url }, // Include url in data
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      repeats: false,
    },
  });
}
