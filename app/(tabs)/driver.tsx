import {
  ActivityList,
  Charts,
  ComplianceAlert,
  HorizontalCalendar,
  showActivityForm,
  StatsCard,
} from "@/components/driver";
import { ThemedSafeAreaView } from "@/components/ui/themed-safe-area-view";
import { ThemedText } from "@/components/ui/themed-text";
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

dayjs.extend(isoWeek);

export default function DriverScreen() {
  const { t } = useTranslation();
  const { primary, background } = useThemedColors(
    "primary",
    "content2",
    "background"
  );

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weekActivities, setWeekActivities] = useState<Activity[]>(
    []
  );
  const [fortnightActivities, setFortnightActivities] = useState<
    Activity[]
  >([]);

  const updateWeekDates = useCallback((date: string) => {
    const current = dayjs(date);
    const startOfWeek = current.startOf("isoWeek");
    const dates = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, "day").format("YYYY-MM-DD")
    );
    setWeekDates(dates);
  }, []);

  const loadActivities = useCallback(async () => {
    const dayActivities = await getActivitiesByDate(selectedDate);
    setActivities(dayActivities);

    const current = dayjs(selectedDate);
    const startOfWeek = current
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = current.endOf("isoWeek").format("YYYY-MM-DD");
    const weekActs = await getActivitiesByDateRange(
      startOfWeek,
      endOfWeek
    );
    setWeekActivities(weekActs);

    const startOfFortnight = current
      .subtract(14, "day")
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfFortnight = current
      .endOf("isoWeek")
      .format("YYYY-MM-DD");
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
      date: selectedDate,
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
      date: selectedDate,
      onSave: handleSaveActivity,
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
          } catch (error) {
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
        .format("YYYY-MM-DD")
    )
  );

  const compliance = checkCompliance(weeklyStats, fortnightStats);

  const weeklyWorkLevel =
    weeklyStats.totalWorkHours > 48
      ? "violation"
      : weeklyStats.totalWorkHours > 44
      ? "warning"
      : "compliant";

  const weeklyDrivingLevel =
    weeklyStats.totalDrivingHours > 56
      ? "violation"
      : weeklyStats.totalDrivingHours > 52
      ? "warning"
      : "compliant";

  const fortnightDrivingLevel =
    fortnightStats.totalDrivingHours > 90
      ? "violation"
      : fortnightStats.totalDrivingHours > 85
      ? "warning"
      : "compliant";

  return (
    <ThemedSafeAreaView
      style={{ flex: 1, backgroundColor: background.DEFAULT }}
    >
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {t("driver.title")}
        </ThemedText>
        <TouchableOpacity
          onPress={handleExport}
          style={[
            styles.exportButton,
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

      <ScrollView style={styles.container}>
        <HorizontalCalendar
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            updateWeekDates(date);
          }}
          weekDates={weekDates}
        />

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
    </ThemedSafeAreaView>
  );
}

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
  exportButton: {
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
