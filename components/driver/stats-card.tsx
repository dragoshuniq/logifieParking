import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { StyleSheet, View } from "react-native";

interface StatsCardProps {
  title: string;
  value: string;
  maxValue?: string;
  level?: "compliant" | "warning" | "violation";
  subtitle?: string;
}

export const StatsCard = ({
  title,
  value,
  maxValue,
  level = "compliant",
  subtitle,
}: StatsCardProps) => {
  const { content2, success, warning, danger } = useThemedColors(
    "content2",
    "success",
    "warning",
    "danger"
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

  return (
    <ThemedView
      style={[styles.card, { backgroundColor: content2.DEFAULT }]}
    >
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
    minWidth: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
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
