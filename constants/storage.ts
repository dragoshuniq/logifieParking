export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: "@onboarding_complete",
  LANGUAGE: "@language",
  THEME: "@theme",
  STORE_REVIEW_LAST_REQUESTED: "@store_review_last_requested",
  STORE_REVIEW_COUNT: "@store_review_count",
  NOTIFICATION_PERMISSION_UX_STATE: "notif_permission_ux_state_v1",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
