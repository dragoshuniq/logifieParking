import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

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
  const { default: defaultColors, primary: primaryColors } = useThemedColors(
    "default",
    "primary"
  );

  return (
    <TouchableOpacity
      style={[
        styles.option,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: defaultColors[400],
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
              ? primaryColors.DEFAULT
              : defaultColors[400],
            backgroundColor: isSelected ? primaryColors.DEFAULT : "transparent",
          },
        ]}
      >
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={18}
            color={primaryColors.foreground}
          />
        )}
      </ThemedView>
      <ThemedText style={styles.optionText}>{label}</ThemedText>
    </TouchableOpacity>
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
