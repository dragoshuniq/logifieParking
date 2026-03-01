import crashlytics from "@react-native-firebase/crashlytics";

export const initializeCrashlytics = async () => {
  await crashlytics().setCrashlyticsCollectionEnabled(true);
};

export const logError = (error: Error, context?: string) => {
  if (context) {
    crashlytics().log(context);
  }
  crashlytics().recordError(error);
};

export const setUserIdentifier = (userId: string) => {
  crashlytics().setUserId(userId);
};

export const setAttribute = (key: string, value: string) => {
  crashlytics().setAttribute(key, value);
};

export const logMessage = (message: string) => {
  crashlytics().log(message);
};

export default crashlytics;
