import { useThemedColors } from "@/hooks/use-themed-colors";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ComplianceStatus } from "@/utils/compliance";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

interface ComplianceAlertProps {
  compliance: ComplianceStatus;
}

export const ComplianceAlert = ({ compliance }: ComplianceAlertProps) => {
  const { t } = useTranslation();
  const { success, warning, danger, content2 } = useThemedColors(
    "success",
    "warning",
    "danger",
    "content2"
  );

  const getColor = () => {
    switch (compliance.level) {
      case "compliant":
        return success;
      case "warning":
        return warning;
      case "violation":
        return danger;
    }
  };

  const getIcon = () => {
    switch (compliance.level) {
      case "compliant":
        return "circle-check";
      case "warning":
        return "triangle-exclamation";
      case "violation":
        return "circle-xmark";
    }
  };

  const color = getColor();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: color.DEFAULT }]}>
        <FontAwesome6 name={getIcon()} size={20} color={color.foreground} />
        <ThemedText style={[styles.statusText, { color: color.foreground }]}>
          {t(`driver.${compliance.level}`)}
        </ThemedText>
      </View>

      {compliance.alerts.length > 0 && (
        <View style={[styles.alertsContainer, { backgroundColor: content2.DEFAULT }]}>
          {compliance.alerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <FontAwesome6 name="circle" size={6} color={color.DEFAULT} />
              <ThemedText style={styles.alertText}>{t(alert)}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  alertsContainer: {
    padding: 16,
    gap: 8,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 4,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
  },
});

