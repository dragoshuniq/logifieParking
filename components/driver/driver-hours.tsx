import { showActivityForm } from "@/components/driver/activity-form";
import { ActivityList } from "@/components/driver/activity-list";
import {
  ActivityDistributionChart,
  DailyWorkHoursChart,
} from "@/components/driver/charts";
import { getComplianceInfo } from "@/components/driver/compliance-info";
import { showDatePicker } from "@/components/driver/date-picker-sheet";
import { showExportConfig } from "@/components/driver/export-config-sheet";
import { HorizontalCalendar } from "@/components/driver/horizontal-calendar";
import { StatsCard } from "@/components/driver/stats-card";
import { useThemedColors } from "@/hooks/use-themed-colors";
import {
  calculateBreakCompliance,
  calculateDailyDrivingCompliance,
  calculateDailyRestCompliance,
  calculateDailyStats,
  calculateNightWorkCompliance,
  calculateWeeklyDrivingCompliance,
  calculateWeeklyRestCompliance,
  calculateWeeklyStats,
  calculateWeeklyWorkingTimeCompliance,
} from "@/utils/compliance";
import dayjs from "@/utils/dayjs-config";
import {
  Activity,
  addActivity,
  deleteActivity,
  getActivitiesByDate,
  getActivitiesByDateRange,
  getWeeklyRestDeficits,
  initDatabase,
  updateActivity,
  WeeklyRestDeficit,
} from "@/utils/driver-db";
import { exportToCSV, exportToXLS } from "@/utils/export";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/themed-text";
import { ThemedView } from "../ui/themed-view";

export const DriverHours = () => {
  const { t } = useTranslation();
  const { primary, background } = useThemedColors(
    "primary",
    "content2",
    "background"
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weekActivities, setWeekActivities] = useState<Activity[]>(
    []
  );
  const [fortnightActivities, setFortnightActivities] = useState<
    Activity[]
  >([]);
  const [fourMonthActivities, setFourMonthActivities] = useState<
    Activity[]
  >([]);
  const [restDeficits, setRestDeficits] = useState<
    WeeklyRestDeficit[]
  >([]);

  const updateWeekDates = useCallback((date: Date) => {
    const current = dayjs(date);
    const startOfWeek = current.startOf("isoWeek");
    const dates = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, "day").toDate()
    );
    setWeekDates(dates);
  }, []);

  const loadActivities = useCallback(async () => {
    const dayActivities = await getActivitiesByDate(selectedDate);
    setActivities(dayActivities);

    const current = dayjs(selectedDate);
    const startOfWeek = current.startOf("isoWeek").toDate();
    const endOfWeek = current.endOf("isoWeek").toDate();
    const weekActs = await getActivitiesByDateRange(
      startOfWeek,
      endOfWeek
    );
    setWeekActivities(weekActs);

    const startOfFortnight = current
      .subtract(14, "day")
      .startOf("isoWeek")
      .toDate();
    const endOfFortnight = current.endOf("isoWeek").toDate();
    const fortnightActs = await getActivitiesByDateRange(
      startOfFortnight,
      endOfFortnight
    );
    setFortnightActivities(fortnightActs);

    const fourMonthsAgo = current.subtract(4, "month").toDate();
    const fourMonthActs = await getActivitiesByDateRange(
      fourMonthsAgo,
      endOfWeek
    );
    setFourMonthActivities(fourMonthActs);

    const deficits = await getWeeklyRestDeficits();
    setRestDeficits(deficits);
  }, [selectedDate]);

  useEffect(() => {
    initDatabase();
    updateWeekDates(selectedDate);
  }, [selectedDate, updateWeekDates]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleSaveActivity = async (activity: Activity) => {
    try {
      if (activity.id) {
        await updateActivity(activity);
      } else {
        await addActivity(activity);
      }
      loadActivities();
    } catch {
      Alert.alert(t("common.error"), t("driver.errors.saveFailed"));
    }
  };

  const handleActivityPress = (activity: Activity) => {
    showActivityForm({
      initialActivity: activity,
      selectedDate,
      onSave: handleSaveActivity,
      onDelete: async () => {
        if (!activity.id) return;
        try {
          await deleteActivity(activity.id);
          loadActivities();
        } catch {
          Alert.alert(
            t("common.error"),
            t("driver.errors.deleteFailed")
          );
        }
      },
    });
  };

  const handleAddPress = () => {
    showActivityForm({
      selectedDate,
      onSave: handleSaveActivity,
    });
  };

  const handleDatePicker = () => {
    showDatePicker({
      value: dayjs(selectedDate).format("YYYY-MM-DD"),
      onConfirm: (dateStr: string) => {
        const date = dayjs(dateStr).toDate();
        setSelectedDate(date);
        updateWeekDates(date);
      },
    });
  };

  const handleExport = () => {
    showExportConfig({
      selectedDate,
      onExport: async (
        type: "csv" | "xls",
        startDate: Date,
        endDate: Date
      ) => {
        try {
          const activities = await getActivitiesByDateRange(
            startDate,
            endDate
          );
          const deficits = await getWeeklyRestDeficits();
          if (type === "csv") {
            await exportToCSV(activities, deficits, t);
          } else {
            await exportToXLS(activities, deficits, t);
          }
        } catch {
          Alert.alert(
            t("common.error"),
            t("driver.errors.exportFailed", {
              type: type.toUpperCase(),
            })
          );
        }
      },
    });
  };

  const dailyStats = calculateDailyStats(activities, selectedDate);
  const weeklyStats = calculateWeeklyStats(weekActivities, weekDates);

  const dailyDriving = calculateDailyDrivingCompliance(
    activities,
    selectedDate,
    weekActivities
  );

  const breakCompliance = calculateBreakCompliance(
    activities,
    selectedDate
  );

  const dailyRest = calculateDailyRestCompliance(
    activities,
    selectedDate,
    weekActivities
  );

  const nightWork = calculateNightWorkCompliance(
    activities,
    selectedDate
  );

  const dailyWorkingHours =
    dailyStats.drivingHours + dailyStats.workHours;
  const maxDailyWorking = nightWork.hasNightWork
    ? 10
    : dailyRest.restType === "reduced"
    ? 15
    : 13;
  const dailyWorkingLevel =
    dailyWorkingHours > maxDailyWorking
      ? "violation"
      : dailyWorkingHours > maxDailyWorking - 2
      ? "warning"
      : "compliant";

  const weeklyWorking = calculateWeeklyWorkingTimeCompliance(
    fourMonthActivities,
    selectedDate
  );

  const weeklyDriving = calculateWeeklyDrivingCompliance(
    fortnightActivities,
    selectedDate
  );

  const weeklyRest = calculateWeeklyRestCompliance(
    fourMonthActivities,
    selectedDate
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: background }]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {t("driver.title")}
        </ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleDatePicker}
            style={[
              styles.headerButton,
              { backgroundColor: primary.DEFAULT },
            ]}
          >
            <FontAwesome6
              name="calendar-days"
              size={16}
              color={primary.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExport}
            style={[
              styles.headerButton,
              { backgroundColor: primary.DEFAULT },
            ]}
          >
            <FontAwesome6
              name="file-export"
              size={16}
              color={primary.foreground}
            />
          </TouchableOpacity>
        </View>
      </View>
      <HorizontalCalendar
        selectedDate={dayjs(selectedDate).format("YYYY-MM-DD")}
        markedDates={weekActivities
          .map((activity) =>
            dayjs(activity.startDateTime).format("YYYY-MM-DD")
          )
          .filter(
            (date, index, self) => self.indexOf(date) === index
          )}
        onDateSelect={(dateStr) => {
          const date = dayjs(dateStr).toDate();
          setSelectedDate(date);
          updateWeekDates(date);
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <StatsCard
            title={t("driver.stats.dailyDriving")}
            value={dailyDriving.drivingHours.toFixed(1)}
            maxValue={"9"}
            level={dailyDriving.level}
            subtitle={
              dailyDriving.extendedDaysThisWeek > 0
                ? t("driver.stats.extendedDaysUsed", {
                    count: dailyDriving.extendedDaysThisWeek,
                  })
                : t("driver.stats.dailyDrivingLimit")
            }
            info={getComplianceInfo("dailyDriving")}
          />
          <StatsCard
            title={t("driver.stats.dailyWorking")}
            value={dailyWorkingHours.toFixed(1)}
            maxValue={maxDailyWorking.toString()}
            level={
              dailyWorkingLevel as
                | "compliant"
                | "warning"
                | "violation"
            }
            subtitle={
              dailyRest.restType === "reduced"
                ? t("driver.stats.reducedRestLimit")
                : t("driver.stats.regularRestLimit")
            }
            info={getComplianceInfo("dailyWorking")}
          />
          <StatsCard
            title={t("driver.stats.breakCompliance")}
            value={`${Math.floor(
              breakCompliance.totalBreakMinutes
            )}m`}
            maxValue={
              breakCompliance.requiredBreakMinutes > 0
                ? `${breakCompliance.requiredBreakMinutes}m`
                : undefined
            }
            level={breakCompliance.level}
            subtitle={
              breakCompliance.breaks.length > 0
                ? t("driver.stats.breaksCount", {
                    count: breakCompliance.breaks.length,
                  })
                : t("driver.stats.noBreaks")
            }
            info={getComplianceInfo("breakCompliance")}
          />
          <StatsCard
            title={t("driver.stats.dailyRest")}
            value={dailyRest.restHours.toFixed(1)}
            maxValue="11"
            level={dailyRest.level}
            subtitle={
              dailyRest.activityWindowHours > 0
                ? t("driver.stats.activityWindow", {
                    hours: dailyRest.activityWindowHours.toFixed(1),
                  })
                : undefined
            }
            info={getComplianceInfo("dailyRest")}
          />
          {nightWork.hasNightWork && (
            <StatsCard
              title={t("driver.stats.nightWork")}
              value={nightWork.actualWorkingTime.toFixed(1)}
              maxValue={nightWork.maxWorkingTime.toString()}
              level={nightWork.level}
              subtitle={t("driver.stats.nightWorkWindow")}
              info={getComplianceInfo("nightWork")}
            />
          )}
          <StatsCard
            title={t("driver.stats.weeklyWorking")}
            value={weeklyWorking.weeklyHours.toFixed(1)}
            maxValue="60"
            level={weeklyWorking.level}
            subtitle={t("driver.stats.fourMonthAvg", {
              hours: weeklyWorking.fourMonthAverage.toFixed(1),
            })}
            info={getComplianceInfo("weeklyWorking")}
          />
          <StatsCard
            title={t("driver.stats.drivingHours")}
            value={weeklyDriving.weeklyDrivingHours.toFixed(1)}
            maxValue="56"
            level={weeklyDriving.level}
            subtitle={t("driver.stats.twoWeekTotal", {
              hours: weeklyDriving.twoWeekDrivingHours.toFixed(1),
            })}
            info={getComplianceInfo("weeklyDriving")}
          />
          <StatsCard
            title={t("driver.stats.weeklyRest")}
            value={
              weeklyRest.lastRestHours > 0
                ? `${weeklyRest.lastRestHours.toFixed(0)}h`
                : t("driver.none")
            }
            maxValue="45"
            level={weeklyRest.level}
            subtitle={
              weeklyRest.lastRestEnd
                ? t("driver.stats.hoursAgo", {
                    hours:
                      weeklyRest.hoursSinceLastWeeklyRest.toFixed(0),
                  })
                : t("driver.stats.noWeeklyRest")
            }
            info={getComplianceInfo("weeklyRest")}
          />
          {restDeficits.length > 0 && (
            <StatsCard
              title={t("driver.stats.restCompensation")}
              value={`${restDeficits.length}`}
              level="warning"
              subtitle={t("driver.stats.hoursOwed", {
                hours: restDeficits
                  .reduce(
                    (sum, d) =>
                      sum + (d.deficitHours - d.compensatedHours),
                    0
                  )
                  .toFixed(1),
              })}
              info={getComplianceInfo("restCompensation")}
            />
          )}
        </ScrollView>

        <ThemedView style={{ padding: 16 }}>
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            {t("driver.weeklyOverview")}
          </ThemedText>
          <View style={{ gap: 20 }}>
            <ActivityDistributionChart dailyStats={dailyStats} />
            <DailyWorkHoursChart weeklyStats={weeklyStats} />
          </View>
        </ThemedView>

        <ActivityList
          activities={activities}
          onActivityPress={handleActivityPress}
          onAddPress={handleAddPress}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
});
