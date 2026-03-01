import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets, NotificationPermissionPayload } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
  useSheetPayload,
} from "react-native-actions-sheet";

/**
 * Copy pack for different dialog modes
 */
const COPY = {
  request: {
    title: "Stay in the loop",
    body: "Turn on notifications to get:",
    bullets: [
      "Reminders about important actions",
      "Status updates when something changes",
      "Time-sensitive alerts you don't want to miss",
    ],
    note: "You can change this anytime in Settings.",
    primaryButton: "Enable notifications",
    secondaryButton: "Not now",
  },
  settings: {
    title: "Notifications are off",
    body: "To receive reminders and alerts, allow notifications for this app in your phone settings.",
    bullets: [
      "Reminders about important actions",
      "Status updates when something changes",
    ],
    note: "We won't send spam. You control what you receive.",
    primaryButton: "Open Settings",
    secondaryButton: "Not now",
  },
};

/**
 * Helper function to show notification permission dialog
 */
export const showNotificationPermissionDialog = (
  payload: NotificationPermissionPayload
) => {
  SheetManager.show(ESheets.NotificationPermission, { payload });
};

/**
 * Notification Permission Dialog Component
 */
const NotificationPermissionDialog = (props: SheetProps) => {
  const payload = useSheetPayload(ESheets.NotificationPermission);

  const { content1, content2, primary, text } = useThemedColors(
    "content1",
    "content2",
    "primary",
    "text"
  );

  if (!payload || typeof payload !== "object" || !("mode" in payload)) {
    return null;
  }

  const typedPayload = payload as NotificationPermissionPayload;
  const { mode, onPrimary, onSecondary, onClose } = typedPayload;
  const copy = COPY[mode];

  const handlePrimary = () => {
    onPrimary();
  };

  const handleSecondary = () => {
    onSecondary();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={[styles.container, { backgroundColor: content1.DEFAULT }]}
      gestureEnabled
      closeOnTouchBackdrop
      onClose={handleClose}
    >
      {/* Header with bell icon and close button */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[styles.iconContainer, { backgroundColor: primary.DEFAULT }]}
          >
            <MaterialIcons
              name="notifications"
              size={24}
              color={primary.foreground}
            />
          </View>
          <ThemedText style={styles.title}>{copy.title}</ThemedText>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <MaterialIcons name="close" size={20} color={text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Body text */}
        <ThemedText style={styles.bodyText}>{copy.body}</ThemedText>

        {/* Bullet list */}
        <ThemedView
          style={[
            styles.bulletContainer,
            { backgroundColor: content2.DEFAULT },
          ]}
        >
          {copy.bullets.map((bullet, index) => (
            <View key={index} style={styles.bulletRow}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={primary.DEFAULT}
                style={styles.bulletIcon}
              />
              <ThemedText style={styles.bulletText}>{bullet}</ThemedText>
            </View>
          ))}
        </ThemedView>

        {/* Note */}
        <ThemedText style={styles.noteText}>{copy.note}</ThemedText>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Primary button (filled) */}
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: primary.DEFAULT }]}
          onPress={handlePrimary}
          accessibilityRole="button"
          accessibilityLabel={copy.primaryButton}
        >
          <ThemedText
            style={[styles.primaryButtonText, { color: primary.foreground }]}
          >
            {copy.primaryButton}
          </ThemedText>
        </TouchableOpacity>

        {/* Secondary button (text only) */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSecondary}
          accessibilityRole="button"
          accessibilityLabel={copy.secondaryButton}
        >
          <ThemedText style={styles.secondaryButtonText}>
            {copy.secondaryButton}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
};

export default NotificationPermissionDialog;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    maxHeight: 400,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.7,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.7,
  },
});
