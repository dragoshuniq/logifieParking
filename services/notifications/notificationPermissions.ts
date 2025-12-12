import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Permission status types
 */
export type PermissionStatus = "granted" | "denied" | "undetermined";

/**
 * Get current notification permission status
 */
export async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();

  if (status === "granted") {
    return "granted";
  } else if (status === "denied") {
    return "denied";
  } else {
    return "undetermined";
  }
}

/**
 * Request notification permission from the OS
 * Only call this after user explicitly taps a permission dialog CTA
 */
export async function requestPermission(): Promise<PermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  if (status === "granted") {
    return "granted";
  } else {
    return "denied";
  }
}

/**
 * Get Expo push token if permission is granted
 * Returns null if permission is not granted
 */
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
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

/**
 * Open app settings page where user can enable notifications
 */
export async function openAppSettings(): Promise<void> {
  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:");
  } else if (Platform.OS === "android") {
    await Linking.openSettings();
  }
}

/**
 * Ensure push notifications are ready
 * Returns current status and token (if available)
 */
export async function ensurePushReady(): Promise<{
  status: PermissionStatus;
  token: string | null;
}> {
  const status = await getPermissionStatus();
  const token =
    status === "granted" ? await getExpoPushTokenIfGranted() : null;

  return { status, token };
}
