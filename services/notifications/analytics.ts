export function notif_dialog_shown(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_shown", { mode, context });
}

export function notif_dialog_primary_clicked(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_primary_clicked", {
    mode,
    context,
  });
}

export function notif_dialog_secondary_clicked(
  mode: "request" | "settings",
  context: "value_moment" | "feature_gate"
) {
  console.log("[Analytics] notif_dialog_secondary_clicked", {
    mode,
    context,
  });
}

export function notif_permission_result(
  status: "granted" | "denied" | "undetermined"
) {
  console.log("[Analytics] notif_permission_result", { status });
}

export function notif_open_settings_clicked() {
  console.log("[Analytics] notif_open_settings_clicked");
}

export function notif_token_obtained(success: boolean) {
  console.log("[Analytics] notif_token_obtained", { success });
}
