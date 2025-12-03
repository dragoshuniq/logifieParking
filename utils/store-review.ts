import { AppConstants } from "@/constants/app.const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";

const REVIEW_REQUEST_KEY = "@store_review_last_requested";
const REVIEW_COUNT_KEY = "@store_review_count";
const COOLDOWN_DAYS = 90;
const MIN_ACTIONS_BEFORE_REQUEST = 3;

const LINKING_URLS = {
  ios: `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${AppConstants.store.iosAppId}?action=write-review`,
  android: `market://details?id=${AppConstants.store.androidPackageName}&showAllReviews=true`,
  iosWeb: `https://apps.apple.com/app/apple-store/id${AppConstants.store.iosAppId}?action=write-review`,
  androidWeb: `https://play.google.com/store/apps/details?id=${AppConstants.store.androidPackageName}&showAllReviews=true`,
};

export const requestStoreReviewAfterAction = async () => {
  try {
    const shouldRequest = await shouldRequestReview();

    if (!shouldRequest) {
      return;
    }

    const isAvailable = await StoreReview.isAvailableAsync();

    if (isAvailable) {
      await StoreReview.requestReview();
      await markReviewRequested();
    }
  } catch (error) {
    console.error("Error requesting review:", error);
  }
};

export const openStoreForReview = () => {
  if (Platform.OS === "ios") {
    const iosAppId = AppConstants.store.iosAppId;
    if (iosAppId) {
      Linking.openURL(LINKING_URLS.ios).catch(() => {
        Linking.openURL(LINKING_URLS.iosWeb);
      });
    }
  } else if (Platform.OS === "android") {
    const androidPackageName = AppConstants.store.androidPackageName;
    if (androidPackageName) {
      Linking.openURL(LINKING_URLS.android).catch(() => {
        Linking.openURL(LINKING_URLS.androidWeb);
      });
    }
  }
};

const shouldRequestReview = async (): Promise<boolean> => {
  try {
    const lastRequestedStr = await AsyncStorage.getItem(
      REVIEW_REQUEST_KEY
    );
    const actionCountStr = await AsyncStorage.getItem(
      REVIEW_COUNT_KEY
    );

    const actionCount = actionCountStr
      ? parseInt(actionCountStr, 10)
      : 0;
    await AsyncStorage.setItem(
      REVIEW_COUNT_KEY,
      (actionCount + 1).toString()
    );

    if (actionCount < MIN_ACTIONS_BEFORE_REQUEST) {
      return false;
    }

    if (!lastRequestedStr) {
      return true;
    }

    const lastRequested = new Date(lastRequestedStr);
    const now = new Date();
    const daysSinceLastRequest = Math.floor(
      (now.getTime() - lastRequested.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return daysSinceLastRequest >= COOLDOWN_DAYS;
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return false;
  }
};

const markReviewRequested = async () => {
  try {
    await AsyncStorage.setItem(
      REVIEW_REQUEST_KEY,
      new Date().toISOString()
    );
    await AsyncStorage.setItem(REVIEW_COUNT_KEY, "0");
  } catch (error) {
    console.error("Error marking review requested:", error);
  }
};
