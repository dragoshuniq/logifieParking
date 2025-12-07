import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { useFormatTime } from "@/hooks/useFormat";
import { Activity, ActivityType } from "@/utils/driver-db";
import { FontAwesome6 } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ActivityListProps {
  activities: Activity[];
  onActivityPress: (activity: Activity) => void;
  onAddPress: () => void;
}

export const ActivityList = ({
  activities,
  onActivityPress,
  onAddPress,
}: ActivityListProps) => {
  const { t } = useTranslation();
  const { formatTime } = useFormatTime();
  const { content2, primary, success, warning, text } =
    useThemedColors(
      "content2",
      "primary",
      "success",
      "warning",
      "text"
    );

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DRIVING:
        return "circle-dot";
      case ActivityType.OTHER_WORK:
        return "hammer";
      case ActivityType.AVAILABILITY:
        return "bed";
      case ActivityType.BREAK:
        return "bed";
      case ActivityType.REST:
        return "bed";
      default:
        return "circle";
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DRIVING:
        return primary.DEFAULT;
      case ActivityType.OTHER_WORK:
        return warning.DEFAULT;
      case ActivityType.AVAILABILITY:
        return "#f59e0b";
      case ActivityType.BREAK:
        return success.DEFAULT;
      case ActivityType.REST:
        return "#6366f1";
      default:
        return text;
    }
  };

  const getActivityLabel = (type: ActivityType) => {
    switch (type) {
      case ActivityType.DRIVING:
        return t("driver.driving");
      case ActivityType.OTHER_WORK:
        return t("driver.work");
      case ActivityType.AVAILABILITY:
        return t("driver.availability");
      case ActivityType.BREAK:
        return t("driver.break");
      case ActivityType.REST:
        return t("driver.rest");
      default:
        return type;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {t("driver.title")}
        </ThemedText>
        <TouchableOpacity
          onPress={onAddPress}
          style={[
            styles.addButton,
            { backgroundColor: primary.DEFAULT },
          ]}
        >
          <FontAwesome6
            name="plus"
            size={16}
            color={primary.foreground}
          />
          <ThemedText
            style={[
              styles.addButtonText,
              { color: primary.foreground },
            ]}
          >
            {t("driver.addActivity")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.listContent}>
        {activities.length > 0 ? (
          activities.map((item) => (
            <TouchableOpacity
              key={item.id?.toString() || Math.random().toString()}
              onPress={() => onActivityPress(item)}
            >
              <ThemedView
                style={[
                  styles.activityItem,
                  { backgroundColor: content2.DEFAULT },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getActivityColor(item.type) },
                  ]}
                >
                  <FontAwesome6
                    name={getActivityIcon(item.type)}
                    size={16}
                    color="#fff"
                  />
                </View>
                <View style={styles.activityDetails}>
                  <ThemedText style={styles.activityType}>
                    {formatTime(
                      dayjs(item.startDateTime).format("HH:mm")
                    )}{" "}
                    -{" "}
                    {formatTime(
                      dayjs(item.endDateTime).format("HH:mm")
                    )}
                  </ThemedText>
                  <ThemedText style={styles.activityTime}>
                    {t(`driver.${item.type}`)} •{" "}
                    {item.duration.toFixed(1)}h
                  </ThemedText>
                </View>
              </ThemedView>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedView
            style={[
              styles.emptyContainer,
              { backgroundColor: content2.DEFAULT },
            ]}
          >
            <FontAwesome6
              name="calendar-xmark"
              size={48}
              color={text}
              opacity={0.3}
            />
            <ThemedText style={styles.emptyText}>
              No activities for this day
            </ThemedText>
          </ThemedView>
        )}
      </View>
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
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    gap: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  activityDuration: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
