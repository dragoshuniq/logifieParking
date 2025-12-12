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
      seconds: 5,
    },
  });
}
