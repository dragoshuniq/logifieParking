import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { WeeklyStats } from "@/utils/compliance";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

type Props = {
  weeklyStats: WeeklyStats;
};

export const Charts = ({ weeklyStats }: Props) => {
  const { t } = useTranslation();
  const { content2, primary, warning, success, text } =
    useThemedColors(
      "content2",
      "primary",
      "warning",
      "success",
      "text"
    );

  const pieData = [
    {
      value: weeklyStats.totalDrivingHours,
      color: primary.DEFAULT,
      text: `${weeklyStats.totalDrivingHours.toFixed(1)}h`,
    },
    {
      value:
        weeklyStats.totalWorkHours - weeklyStats.totalDrivingHours,
      color: warning.DEFAULT,
      text: `${(
        weeklyStats.totalWorkHours - weeklyStats.totalDrivingHours
      ).toFixed(1)}h`,
    },
    {
      value: weeklyStats.totalBreakHours,
      color: success.DEFAULT,
      text: `${weeklyStats.totalBreakHours.toFixed(1)}h`,
    },
    {
      value: weeklyStats.totalRestHours,
      color: "#6366f1",
      text: `${weeklyStats.totalRestHours.toFixed(1)}h`,
    },
  ].filter((item) => item.value > 0);

  const barData = weeklyStats.dailyStats.map((day) => ({
    value: day.drivingHours + day.workHours,
    label: dayjs(day.date).format("dd"),
    frontColor: primary.DEFAULT,
    topLabelComponent: () => (
      <ThemedText style={{ fontSize: 10, marginBottom: 2 }}>
        {(day.drivingHours + day.workHours).toFixed(1)}
      </ThemedText>
    ),
    spacing: 4,
  }));

  const legendData = [
    { label: t("driver.drivingHours"), color: primary.DEFAULT },
    {
      label: t("driver.work"),
      color: warning.DEFAULT,
    },
    { label: t("driver.break"), color: success.DEFAULT },
    { label: t("driver.rest"), color: "#6366f1" },
  ];

  const totalHours =
    weeklyStats.totalWorkHours +
    weeklyStats.totalBreakHours +
    weeklyStats.totalRestHours;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>
        Weekly Overview
      </ThemedText>

      <View style={styles.chartsContainer}>
        <ThemedView
          style={[
            styles.chartContainer,
            { backgroundColor: content2.DEFAULT },
          ]}
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
                      {totalHours.toFixed(1)}
                    </ThemedText>
                    <ThemedText style={styles.centerLabelText}>
                      hours
                    </ThemedText>
                  </View>
                )}
              />
              <View style={styles.legend}>
                {legendData.map((item, index) => {
                  const dataItem = pieData.find(
                    (d) => d.color === item.color
                  );
                  if (!dataItem || dataItem.value === 0) return null;
                  return (
                    <View key={index} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <ThemedText style={styles.legendText}>
                        {item.label}: {dataItem.text}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <ThemedText style={styles.emptyText}>
                No data
              </ThemedText>
            </View>
          )}
        </ThemedView>

        <ThemedView
          style={[
            styles.chartContainer,
            { backgroundColor: content2.DEFAULT },
          ]}
        >
          <ThemedText style={styles.chartTitle}>
            Daily Work Hours
          </ThemedText>
          {barData.some((d) => d.value > 0) ? (
            <View style={styles.barChartWrapper}>
              <BarChart
                data={barData}
                width={Math.max(280, barData.length * 45)}
                height={220}
                barWidth={32}
                spacing={8}
                roundedTop
                roundedBottom
                hideRules
                xAxisThickness={1}
                yAxisThickness={1}
                xAxisColor={text}
                yAxisColor={text}
                yAxisTextStyle={{
                  color: text,
                  fontSize: 10,
                }}
                xAxisLabelTextStyle={{
                  color: text,
                  fontSize: 10,
                }}
                noOfSections={4}
                maxValue={16}
                yAxisLabelSuffix="h"
              />
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <ThemedText style={styles.emptyText}>
                No data
              </ThemedText>
            </View>
          )}
        </ThemedView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartsContainer: {
    gap: 20,
  },
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
  barChartWrapper: {
    marginLeft: 8,
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
