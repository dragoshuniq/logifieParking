import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTouchableOpacity } from "@/components/ui/themed-touchable-opacity";
import { ThemedView } from "@/components/ui/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

type SortOptionProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  isLast?: boolean;
};

export const SortOption = ({
  label,
  isSelected,
  onPress,
  isLast,
}: SortOptionProps) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <ThemedTouchableOpacity
      style={[
        styles.option,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.default[400],
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedView
        style={[
          styles.checkbox,
          {
            borderColor: isSelected
              ? colors.primary.DEFAULT
              : colors.default[400],
            backgroundColor: isSelected
              ? colors.primary.DEFAULT
              : "transparent",
          },
        ]}
      >
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={18}
            color={colors.primary.foreground}
          />
        )}
      </ThemedView>
      <ThemedText style={styles.optionText}>{label}</ThemedText>
    </ThemedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
