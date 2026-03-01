import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationData = {
  url?: string;
};

function redirectFromNotification(notification: Notifications.Notification) {
  const data = notification.request.content.data as NotificationData;
  const url = data?.url;

  if (url && typeof url === "string") {
    router.push(url as any);
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response?.notification) {
        redirectFromNotification(response.notification);
        await Notifications.clearLastNotificationResponseAsync();
      }
    };

    checkInitialNotification();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirectFromNotification(response.notification);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
}
