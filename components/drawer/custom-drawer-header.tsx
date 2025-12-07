import { InfoSheetProps } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { showInfoSheet } from "../ui/info-sheet";
import { ThemedSafeAreaView } from "../ui/themed-safe-area-view";
import { ThemedText } from "../ui/themed-text";
import { ThemedTouchableOpacity } from "../ui/themed-touchable-opacity";

export const CustomDrawerHeader = ({
  title,
  disclaimer,
}: {
  title: string;
  disclaimer?: InfoSheetProps;
}) => {
  const { t } = useTranslation();
  const { primary } = useThemedColors("primary");
  return (
    <ThemedSafeAreaView style={styles.container}>
      <DrawerToggleButton />
      <ThemedText style={styles.title}>{t(title)}</ThemedText>
      <ThemedTouchableOpacity
        onPress={() => {
          if (disclaimer) {
            showInfoSheet(disclaimer);
          }
        }}
      >
        <MaterialIcons
          name="info"
          size={30}
          color={primary.DEFAULT}
        />
      </ThemedTouchableOpacity>
    </ThemedSafeAreaView>
  );
};

export const DrawerToggleButton = ({
  containerStyle,
}: {
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  const navigation = useNavigation();
  const { primary, secondary } = useThemedColors(
    "primary",
    "secondary"
  );
  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  return (
    <ThemedTouchableOpacity
      onPress={toggleDrawer}
      style={[
        styles.button,
        { shadowColor: secondary.DEFAULT },
        containerStyle,
      ]}
    >
      <Ionicons name="menu" size={30} color={primary.DEFAULT} />
    </ThemedTouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    flex: 1,
  },
});
