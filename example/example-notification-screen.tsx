import { showNotificationPermissionDialog } from "@/components/notifications/notification-permission-dialog";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import { useThemedColors } from "@/hooks/use-themed-colors";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Example screen demonstrating notification permission UX usage
 *
 * This demonstrates two common scenarios:
 * 1. Value Moment: After user completes onboarding
 * 2. Feature Gate: When user tries to enable a notification-dependent feature
 */
export default function ExampleNotificationScreen() {
  const { primary, content2 } = useThemedColors(
    "primary",
    "content2"
  );

  const {
    status,
    loading,
    showPermissionDialog,
    dialogMode,
    dialogContext,
    openPermissionDialog,
    closePermissionDialog,
    primaryAction,
    secondaryAction,
  } = useNotificationPermission();

  /**
   * Example: Value Moment Trigger
   * Show permission dialog after user completes onboarding
   */
  const handleOnboardingComplete = () => {
    // This would typically be called after user completes onboarding flow
    openPermissionDialog("value_moment");
  };

  /**
   * Example: Feature Gate Trigger
   * Show permission dialog when user tries to enable a notification feature
   */
  const handleEnableNotificationFeature = () => {
    // This would typically be called when user toggles a notification-related setting
    openPermissionDialog("feature_gate");
  };

  /**
   * Show the dialog when needed
   */
  useEffect(() => {
    if (showPermissionDialog) {
      showNotificationPermissionDialog({
        mode: dialogMode,
        context: dialogContext,
        onPrimary: primaryAction,
        onSecondary: secondaryAction,
        onClose: closePermissionDialog,
      });
    }
  }, [
    showPermissionDialog,
    dialogMode,
    dialogContext,
    primaryAction,
    secondaryAction,
    closePermissionDialog,
  ]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <ThemedText type="title" style={styles.header}>
          Notification Permission Examples
        </ThemedText>

        {/* Current Status */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: content2.DEFAULT },
          ]}
        >
          <ThemedText style={styles.statusLabel}>
            Current Permission Status:
          </ThemedText>
          <ThemedText style={styles.statusValue}>
            {loading ? "Loading..." : status.toUpperCase()}
          </ThemedText>
        </View>

        {/* Example 1: Value Moment */}
        <View style={styles.exampleSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            1. Value Moment Trigger
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Show dialog after user completes onboarding or experiences
            a valuable feature. Respects snooze logic (7 days).
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: primary.DEFAULT },
            ]}
            onPress={handleOnboardingComplete}
          >
            <ThemedText
              style={[
                styles.buttonText,
                { color: primary.foreground },
              ]}
            >
              Simulate Onboarding Complete
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Example 2: Feature Gate */}
        <View style={styles.exampleSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            2. Feature Gate Trigger
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Show dialog when user tries to enable a
            notification-dependent feature. Ignores snooze logic.
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: primary.DEFAULT },
            ]}
            onPress={handleEnableNotificationFeature}
          >
            <ThemedText
              style={[
                styles.buttonText,
                { color: primary.foreground },
              ]}
            >
              Enable Notification Feature
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Implementation Notes */}
        <View style={styles.notesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Implementation Notes
          </ThemedText>
          <ThemedText style={styles.noteText}>
            •{" "}
            <ThemedText style={styles.noteBold}>
              Value Moment:
            </ThemedText>{" "}
            Only shows if status is "undetermined" and not snoozed
          </ThemedText>
          <ThemedText style={styles.noteText}>
            •{" "}
            <ThemedText style={styles.noteBold}>
              Feature Gate:
            </ThemedText>{" "}
            Shows in "request" mode if undetermined, "settings" mode
            if denied
          </ThemedText>
          <ThemedText style={styles.noteText}>
            • <ThemedText style={styles.noteBold}>Snooze:</ThemedText>{" "}
            "Not now" button snoozes dialog for 7 days (value moment
            only)
          </ThemedText>
          <ThemedText style={styles.noteText}>
            •{" "}
            <ThemedText style={styles.noteBold}>
              Analytics:
            </ThemedText>{" "}
            All events are tracked (check console logs)
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exampleSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    opacity: 0.8,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  notesSection: {
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 8,
  },
  noteBold: {
    fontWeight: "600",
  },
});
