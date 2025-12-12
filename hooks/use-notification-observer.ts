import * as Notifications from "expo-notifications";
import { ExternalPathString, router } from "expo-router";
import { useEffect } from "react";

export function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") {
        router.push(url as ExternalPathString);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          redirect(response.notification);
        }
      );

    return () => {
      subscription.remove();
    };
  }, []);
}
