/**
 * Analytics tracking for notification permission events
 *
 * These are stub implementations that log to console.
 * Replace with your actual analytics SDK (e.g., Firebase Analytics, Segment, etc.)
 */

export function notif_dialog_shown(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_shown", { mode, context });
  // TODO: Replace with actual analytics call
  // Example: analytics.track('notif_dialog_shown', { mode, context });
}

export function notif_dialog_primary_clicked(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_primary_clicked", {
    mode,
    context,
  });
  // TODO: Replace with actual analytics call
}

export function notif_dialog_secondary_clicked(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_secondary_clicked", {
    mode,
    context,
  });
  // TODO: Replace with actual analytics call
}

export function notif_permission_result(
  status: "granted" | "denied" | "undetermined"
) {
  console.log("[Analytics] notif_permission_result", { status });
  // TODO: Replace with actual analytics call
}

export function notif_open_settings_clicked() {
  console.log("[Analytics] notif_open_settings_clicked");
  // TODO: Replace with actual analytics call
}

export function notif_token_obtained(success: boolean) {
  console.log("[Analytics] notif_token_obtained", { success });
  // TODO: Replace with actual analytics call
}
