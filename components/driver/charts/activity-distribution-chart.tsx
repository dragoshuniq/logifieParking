import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { useFormatDuration } from "@/hooks/useFormat";
import { DailyStats } from "@/utils/compliance";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type Props = {
  dailyStats: DailyStats;
};

export const ActivityDistributionChart = ({ dailyStats }: Props) => {
  const { t } = useTranslation();
  const { formatDuration } = useFormatDuration();
  const { content2, primary, warning, success } = useThemedColors(
    "content2",
    "primary",
    "warning",
    "success"
  );

  const pieData = [
    {
      value: dailyStats.drivingHours,
      color: primary.DEFAULT,
      label: t("driver.drivingHours"),
    },
    {
      value: dailyStats.workHours,
      color: warning.DEFAULT,
      label: t("driver.work"),
    },
    {
      value: dailyStats.breakHours,
      color: success.DEFAULT,
      label: t("driver.break"),
    },
    {
      value: dailyStats.restHours,
      color: "#6366f1",
      label: t("driver.rest"),
    },
  ].filter((item) => item.value > 0);

  const totalHours =
    dailyStats.drivingHours +
    dailyStats.workHours +
    dailyStats.breakHours +
    dailyStats.restHours;

  return (
    <ThemedView
      style={[styles.chartContainer, { backgroundColor: content2.DEFAULT }]}
    >
      <ThemedText style={styles.chartTitle}>
        Activity Distribution
      </ThemedText>
      {totalHours > 0 ? (
        <View style={styles.pieChartWrapper}>
          <PieChart
            data={pieData}
            donut
            radius={80}
            innerRadius={50}
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <ThemedText style={styles.centerLabelValue}>
                  {formatDuration(totalHours)}
                </ThemedText>
                <ThemedText style={styles.centerLabelText}>
                  total
                </ThemedText>
              </View>
            )}
          />
          <View style={styles.legend}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: item.color },
                  ]}
                />
                <ThemedText style={styles.legendText}>
                  {item.label}: {formatDuration(item.value)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <ThemedText style={styles.emptyText}>No data</ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    minWidth: 320,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  pieChartWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  centerLabelText: {
    fontSize: 10,
    opacity: 0.6,
  },
  emptyChart: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 12,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
  },
});

