import { showActivityForm } from "@/components/driver/activity-form";
import { ActivityList } from "@/components/driver/activity-list";
import { Charts } from "@/components/driver/charts";
import { ComplianceAlert } from "@/components/driver/compliance-alert";
import { showDatePicker } from "@/components/driver/date-picker-sheet";
import { HorizontalCalendar } from "@/components/driver/horizontal-calendar";
import { StatsCard } from "@/components/driver/stats-card";
import { getComplianceLevel } from "@/components/driver/utils";
import { useThemedColors } from "@/hooks/use-themed-colors";
import {
  calculateDailyStats,
  calculateWeeklyStats,
  checkCompliance,
} from "@/utils/compliance";
import {
  Activity,
  addActivity,
  deleteActivity,
  getActivitiesByDate,
  getActivitiesByDateRange,
  initDatabase,
  updateActivity,
} from "@/utils/driver-db";
import { exportToCSV, exportToXLS } from "@/utils/export";
import { FontAwesome6 } from "@expo/vector-icons";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
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

dayjs.extend(isoWeek);

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
      Alert.alert("Error", "Failed to save activity");
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
          Alert.alert("Error", "Failed to delete activity");
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

  const handleExport = useCallback(async () => {
    Alert.alert("Export Data", "Choose export format", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "CSV",
        onPress: async () => {
          try {
            const allActivities = [...fortnightActivities];
            await exportToCSV(allActivities);
          } catch {
            Alert.alert("Error", "Failed to export CSV");
          }
        },
      },
      {
        text: "XLS",
        onPress: async () => {
          try {
            const allActivities = [...fortnightActivities];
            await exportToXLS(allActivities);
          } catch {
            Alert.alert("Error", "Failed to export XLS");
          }
        },
      },
    ]);
  }, [fortnightActivities]);

  const dailyStats = calculateDailyStats(activities, selectedDate);
  const weeklyStats = calculateWeeklyStats(weekActivities, weekDates);
  const fortnightStats = calculateWeeklyStats(
    fortnightActivities,
    Array.from({ length: 14 }, (_, i) =>
      dayjs(selectedDate)
        .subtract(14 - i, "day")
        .toDate()
    )
  );

  const compliance = checkCompliance(weeklyStats, fortnightStats);

  const weeklyWorkLevel = getComplianceLevel(
    weeklyStats.totalWorkHours,
    48,
    44
  );

  const weeklyDrivingLevel = getComplianceLevel(
    weeklyStats.totalDrivingHours,
    56,
    52
  );

  const fortnightDrivingLevel = getComplianceLevel(
    fortnightStats.totalDrivingHours,
    90,
    85
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <>
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
          onDateSelect={(dateStr) => {
            const date = dayjs(dateStr).toDate();
            setSelectedDate(date);
            updateWeekDates(date);
          }}
        />
      </>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll={false}
      >
        <ComplianceAlert compliance={compliance} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <StatsCard
            title={t("driver.dailyHours")}
            value={dailyStats.totalHours.toFixed(1)}
            maxValue="13"
            level={
              dailyStats.totalHours > 13 ? "violation" : "compliant"
            }
          />
          <StatsCard
            title={t("driver.weeklyHours")}
            value={weeklyStats.totalWorkHours.toFixed(1)}
            maxValue="48"
            level={weeklyWorkLevel}
          />
          <StatsCard
            title={t("driver.drivingHours")}
            value={weeklyStats.totalDrivingHours.toFixed(1)}
            maxValue="56"
            level={weeklyDrivingLevel}
          />
          <StatsCard
            title={t("driver.fortnightHours")}
            value={fortnightStats.totalDrivingHours.toFixed(1)}
            maxValue="90"
            level={fortnightDrivingLevel}
          />
        </ScrollView>

        <Charts weeklyStats={weeklyStats} />

        <ActivityList
          activities={activities}
          onActivityPress={handleActivityPress}
          onAddPress={handleAddPress}
        />
      </ScrollView>
    </View>
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
    paddingVertical: 12,
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
    gap: 8,
  },
});
