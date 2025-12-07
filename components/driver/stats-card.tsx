import { showInfoSheet } from "@/components/ui/info-sheet";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { InfoSheetProps } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type StatsCardProps = {
  title: string;
  value: string;
  maxValue?: string;
  level?: "compliant" | "warning" | "violation";
  subtitle?: string;
  info?: InfoSheetProps;
};

export const StatsCard = ({
  title,
  value,
  maxValue,
  level = "compliant",
  subtitle,
  info,
}: StatsCardProps) => {
  const { content2, success, warning, danger, primary } =
    useThemedColors(
      "content2",
      "success",
      "warning",
      "danger",
      "primary"
    );

  const getColor = () => {
    switch (level) {
      case "compliant":
        return success.DEFAULT;
      case "warning":
        return warning.DEFAULT;
      case "violation":
        return danger.DEFAULT;
    }
  };

  const handleInfoPress = () => {
    if (info) {
      showInfoSheet(info);
    }
  };

  return (
    <ThemedView
      style={[styles.card, { backgroundColor: content2.DEFAULT }]}
    >
      {info && (
        <TouchableOpacity
          onPress={handleInfoPress}
          style={styles.infoButton}
        >
          <MaterialIcons
            name="info"
            size={16}
            color={primary.DEFAULT}
          />
        </TouchableOpacity>
      )}
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.valueContainer}>
        <ThemedText style={[styles.value, { color: getColor() }]}>
          {value}
        </ThemedText>
        {maxValue && (
          <ThemedText style={styles.maxValue}>
            / {maxValue}
          </ThemedText>
        )}
      </View>
      {subtitle && (
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    minWidth: 130,
    alignItems: "center",
    position: "relative",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  infoButton: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
    borderRadius: 100,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  maxValue: {
    fontSize: 14,
    opacity: 0.6,
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
});
