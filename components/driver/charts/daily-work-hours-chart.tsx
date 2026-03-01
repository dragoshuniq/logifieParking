import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { useFormatDate, useFormatDuration } from "@/hooks/useFormat";
import { WeeklyStats } from "@/utils/compliance";
import { configureDayjsLocale } from "@/utils/dayjs-config";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Props = {
  weeklyStats: WeeklyStats;
};

export const DailyWorkHoursChart = ({ weeklyStats }: Props) => {
  const { t, i18n } = useTranslation();
  const { formatDuration } = useFormatDuration();
  const { formatDate } = useFormatDate();
  const { content2, primary, text } = useThemedColors(
    "content2",
    "primary",
    "text"
  );

  configureDayjsLocale(i18n.language);

  const barData = weeklyStats.dailyStats.map((day) => ({
    value: day.drivingHours + day.workHours + day.availabilityHours,
    label: formatDate(day.date, {
      weekday: "short",
      day: undefined,
      month: undefined,
      year: undefined,
    }),
    frontColor: primary.DEFAULT,
    topLabelComponent: () => (
      <ThemedText style={{ fontSize: 10, marginBottom: 2 }}>
        {formatDuration(
          day.drivingHours + day.workHours + day.availabilityHours
        )}
      </ThemedText>
    ),
    spacing: 4,
  }));

  return (
    <ThemedView
      style={[styles.chartContainer, { backgroundColor: content2.DEFAULT }]}
    >
      <ThemedText style={styles.chartTitle}>
        {t("driver.dailyWorkHours")}
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
            yAxisLabelSuffix={t("format.hourShort")}
          />
        </View>
      ) : (
        <View style={styles.emptyChart}>
          <ThemedText style={styles.emptyText}>{t("common.noData")}</ThemedText>
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
  barChartWrapper: {
    marginLeft: 8,
  },
  emptyChart: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 12,
  },
});
