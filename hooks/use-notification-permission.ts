import {
  getExpoPushTokenIfGranted,
  getPermissionStatus,
  openAppSettings,
  requestPermission,
  scheduleAllReminders,
} from "@/services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import * as analytics from "../services/notifications/analytics";

const SNOOZE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface NotificationUXState {
  lastPrimerShownAt: number | null;
  lastUserAction: "accepted" | "dismissed" | "denied" | null;
  snoozedUntil: number | null;
}

export type DialogContext = "value_moment" | "feature_gate";
export type DialogMode = "request" | "settings";

export function useNotificationPermission() {
  const [status, setStatus] =
    useState<Notifications.PermissionStatus>(
      Notifications.PermissionStatus.UNDETERMINED
    );
  const [loading, setLoading] = useState(true);
  const [showPermissionDialog, setShowPermissionDialog] =
    useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("request");
  const [dialogContext, setDialogContext] =
    useState<DialogContext>("value_moment");
  const [uxState, setUxState] = useState<NotificationUXState>({
    lastPrimerShownAt: null,
    lastUserAction: null,
    snoozedUntil: null,
  });

  const loadUxState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(
        STORAGE_KEYS.NOTIFICATION_PERMISSION_UX_STATE
      );
      if (stored) {
        setUxState(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notification UX state:", error);
    }
  }, []);

  const saveUxState = useCallback(
    async (newState: NotificationUXState) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.NOTIFICATION_PERMISSION_UX_STATE,
          JSON.stringify(newState)
        );
        setUxState(newState);
      } catch (error) {
        console.error("Error saving notification UX state:", error);
      }
    },
    []
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadUxState();
      const currentStatus = await getPermissionStatus();
      setStatus(currentStatus);
      setLoading(false);
    };
    initialize();
  }, [loadUxState]);

  const shouldShowForValueMoment = useCallback(
    (currentStatus: Notifications.PermissionStatus) => {
      if (currentStatus === Notifications.PermissionStatus.GRANTED) {
        return false;
      }

      const now = Date.now();
      return (
        uxState.snoozedUntil === null || uxState.snoozedUntil < now
      );
    },
    [uxState.snoozedUntil]
  );

  const getDialogMode = useCallback(
    (osStatus: Notifications.PermissionStatus): DialogMode => {
      if (osStatus === Notifications.PermissionStatus.UNDETERMINED) {
        return "request";
      } else if (osStatus === Notifications.PermissionStatus.DENIED) {
        return "settings";
      }
      return "request";
    },
    []
  );

  const openPermissionDialog = useCallback(
    async (context: DialogContext) => {
      const currentStatus = await getPermissionStatus();
      setStatus(currentStatus);

      if (status === Notifications.PermissionStatus.GRANTED) {
        return;
      }

      if (context === "value_moment") {
        if (!shouldShowForValueMoment(currentStatus)) {
          return;
        }
      }

      const mode = getDialogMode(currentStatus);
      setDialogMode(mode);
      setDialogContext(context);
      setShowPermissionDialog(true);
      analytics.notif_dialog_shown(mode, context);

      await saveUxState({
        ...uxState,
        lastPrimerShownAt: Date.now(),
      });
    },
    [
      status,
      uxState,
      shouldShowForValueMoment,
      getDialogMode,
      saveUxState,
    ]
  );

  const closePermissionDialog = useCallback(() => {
    setShowPermissionDialog(false);
  }, []);

  const primaryAction = useCallback(async () => {
    if (dialogMode === "request") {
      analytics.notif_dialog_primary_clicked(
        dialogMode,
        dialogContext
      );

      const result = await requestPermission();
      setStatus(result);
      analytics.notif_permission_result(result);

      if (result === Notifications.PermissionStatus.GRANTED) {
        const token = await getExpoPushTokenIfGranted();
        analytics.notif_token_obtained(token !== null);
        await scheduleAllReminders();

        await saveUxState({
          ...uxState,
          lastUserAction: "accepted",
        });
      } else {
        await saveUxState({
          ...uxState,
          lastUserAction: "denied",
        });
      }
    } else {
      analytics.notif_open_settings_clicked();
      await openAppSettings();
    }

    closePermissionDialog();
  }, [
    dialogMode,
    dialogContext,
    uxState,
    saveUxState,
    closePermissionDialog,
  ]);

  const secondaryAction = useCallback(async () => {
    analytics.notif_dialog_secondary_clicked(
      dialogMode,
      dialogContext
    );

    const now = Date.now();
    await saveUxState({
      ...uxState,
      lastUserAction: "dismissed",
      snoozedUntil: now + SNOOZE_DURATION_MS,
    });

    closePermissionDialog();
  }, [
    dialogMode,
    dialogContext,
    uxState,
    saveUxState,
    closePermissionDialog,
  ]);

  return {
    status,
    loading,
    showPermissionDialog,
    dialogMode,
    dialogContext,
    openPermissionDialog,
    closePermissionDialog,
    primaryAction,
    secondaryAction,
  };
}
