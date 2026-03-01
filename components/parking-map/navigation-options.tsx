import { showNotificationPermissionDialog } from "@/components/notifications/notification-permission-dialog";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ESheets } from "@/constants/sheets";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotificationPermission } from "@/hooks/use-notification-permission";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { getApps, GetAppsResponse } from "react-native-map-link";
import { LatLng } from "react-native-maps";
import { LocationDetailsComponent } from "./location-details";

type NavigationOptionsProps = {
  destination: LatLng;
};

export const showNavigationOptions = (payload: NavigationOptionsProps) => {
  SheetManager.show(ESheets.NavigationOptions, {
    payload,
  });
};

export const NavigationOptions = () => {
  const payload = useSheetPayload(ESheets.NavigationOptions);
  const { destination } = payload || {};
  const [navigationOptions, setNavigationOptions] = useState<GetAppsResponse[]>(
    []
  );
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const colorScheme = useColorScheme() ?? "light";

  useEffect(() => {
    if (destination)
      (async () => {
        const result = await getApps({
          ...destination,
          googleForceLatLon: true,
          alwaysIncludeGoogle: true,
        });
        setNavigationOptions(result);
      })();
  }, [destination]);

  const { t } = useTranslation();

  const {
    showPermissionDialog,
    dialogMode,
    dialogContext,
    openPermissionDialog,
    closePermissionDialog,
    primaryAction,
    secondaryAction,
  } = useNotificationPermission();

  const renderAvailableMap = useCallback(
    ({ item }: { item: GetAppsResponse }) => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            item.open();
            // Show notification permission after opening map
            openPermissionDialog("value_moment");
          }}
        >
          <ThemedText
            lightColor={Colors.light.text}
            darkColor={Colors.dark.text}
            style={styles.mapButtonText}
          >
            {item.name}
          </ThemedText>
        </TouchableOpacity>
      );
    },
    [t, openPermissionDialog]
  );

  // Show notification permission dialog when needed
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

  const themeColors = Colors[colorScheme as "light" | "dark"];

  return (
    <ActionSheet
      id={ESheets.NavigationOptions}
      ref={actionSheetRef}
      containerStyle={[
        styles.navigateContainer,
        { backgroundColor: themeColors.background },
      ]}
      gestureEnabled
      useBottomSafeAreaPadding
      indicatorStyle={[
        styles.indicator,
        { backgroundColor: themeColors.default[700] },
      ]}
    >
      {destination && (
        <ThemedView style={styles.locationDetailsContainer}>
          <LocationDetailsComponent
            lat={destination.latitude}
            lng={destination.longitude}
          />
          <ThemedView
            lightColor={Colors.light.default[500]}
            darkColor={Colors.dark.default[500]}
            style={styles.mapSeparator}
          />
        </ThemedView>
      )}
      <FlatList
        data={navigationOptions}
        renderItem={renderAvailableMap}
        ItemSeparatorComponent={() => (
          <ThemedView
            lightColor={Colors.light.default[500]}
            darkColor={Colors.dark.default[500]}
            style={styles.mapSeparator}
          />
        )}
      />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  navigateContainer: {
    overflow: "hidden",
    paddingBottom: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  locationDetailsContainer: {
    paddingTop: 8,
  },
  mapButtonText: {
    textAlign: "center",
    lineHeight: 50,
    fontWeight: "500",
  },
  mapSeparator: {
    height: 1,
  },
  indicator: {},
});
