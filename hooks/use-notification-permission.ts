import * as analytics from "@/services/notifications/analytics";
import {
  getExpoPushTokenIfGranted,
  getPermissionStatus,
  openAppSettings,
  PermissionStatus,
  requestPermission,
} from "@/services/notifications/notificationPermissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

/**
 * Storage key for notification permission UX state
 */
const STORAGE_KEY = "notif_permission_ux_state_v1";

/**
 * Snooze duration in milliseconds (7 days)
 */
const SNOOZE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Local UX state stored in AsyncStorage
 */
interface NotificationUXState {
  lastPrimerShownAt: number | null;
  lastUserAction: "accepted" | "dismissed" | "denied" | null;
  snoozedUntil: number | null;
}

/**
 * Dialog context types
 */
export type DialogContext = "value_moment" | "feature_gate";

/**
 * Dialog mode types
 */
export type DialogMode = "request" | "settings";

/**
 * Custom hook for managing notification permission flow
 */
export function useNotificationPermission() {
  const [status, setStatus] =
    useState<PermissionStatus>("undetermined");
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

  /**
   * Load UX state from AsyncStorage
   */
  const loadUxState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUxState(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notification UX state:", error);
    }
  }, []);

  /**
   * Save UX state to AsyncStorage
   */
  const saveUxState = useCallback(
    async (newState: NotificationUXState) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(newState)
        );
        setUxState(newState);
      } catch (error) {
        console.error("Error saving notification UX state:", error);
      }
    },
    []
  );

  /**
   * Load permission status and UX state on mount
   */
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

  /**
   * Determine if dialog should be shown for value_moment trigger
   */
  const shouldShowForValueMoment = useCallback(
    (osStatus: PermissionStatus) => {
      if (osStatus !== "undetermined") {
        return false;
      }
      const now = Date.now();
      return (
        uxState.snoozedUntil === null || uxState.snoozedUntil < now
      );
    },
    [uxState.snoozedUntil]
  );

  /**
   * Determine dialog mode based on OS permission status
   */
  const getDialogMode = useCallback(
    (osStatus: PermissionStatus): DialogMode => {
      if (osStatus === "undetermined") {
        return "request";
      } else if (osStatus === "denied") {
        return "settings";
      }
      return "request";
    },
    []
  );

  /**
   * Open permission dialog with specified context
   */
  const openPermissionDialog = useCallback(
    async (context: DialogContext) => {
      const currentStatus = await getPermissionStatus();
      setStatus(currentStatus);

      // Don't show dialog if permission is already granted
      if (currentStatus === "granted") {
        return;
      }

      // For value_moment, check snooze logic
      if (context === "value_moment") {
        if (!shouldShowForValueMoment(currentStatus)) {
          return;
        }
      }

      // For feature_gate, always show if not granted (ignore snooze)
      const mode = getDialogMode(currentStatus);
      setDialogMode(mode);
      setDialogContext(context);
      setShowPermissionDialog(true);

      // Track dialog shown
      analytics.notif_dialog_shown(mode, context);

      // Update last primer shown timestamp
      await saveUxState({
        ...uxState,
        lastPrimerShownAt: Date.now(),
      });
    },
    [uxState, shouldShowForValueMoment, getDialogMode, saveUxState]
  );

  /**
   * Close permission dialog
   */
  const closePermissionDialog = useCallback(() => {
    setShowPermissionDialog(false);
  }, []);

  /**
   * Primary action handler
   */
  const primaryAction = useCallback(async () => {
    if (dialogMode === "request") {
      // Track primary click
      analytics.notif_dialog_primary_clicked(
        dialogMode,
        dialogContext
      );

      // Request permission
      const result = await requestPermission();
      setStatus(result);

      // Track permission result
      analytics.notif_permission_result(result);

      if (result === "granted") {
        // Get push token
        const token = await getExpoPushTokenIfGranted();
        analytics.notif_token_obtained(token !== null);

        // Save action as accepted
        await saveUxState({
          ...uxState,
          lastUserAction: "accepted",
        });
      } else {
        // Save action as denied
        await saveUxState({
          ...uxState,
          lastUserAction: "denied",
        });
      }
    } else {
      // Settings mode
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

  /**
   * Secondary action handler (Not now)
   */
  const secondaryAction = useCallback(async () => {
    // Track secondary click
    analytics.notif_dialog_secondary_clicked(
      dialogMode,
      dialogContext
    );

    // Set snooze
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
