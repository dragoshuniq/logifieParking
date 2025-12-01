import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { Activity } from "@/utils/driver-db";
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
  const { t, i18n } = useTranslation();
  const { content2, primary, success, warning, text } =
    useThemedColors(
      "content2",
      "primary",
      "success",
      "warning",
      "text"
    );

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return new Intl.DateTimeFormat(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "driving":
        return "truck";
      case "work":
        return "briefcase";
      case "break":
        return "coffee";
      case "rest":
        return "bed";
      default:
        return "circle";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "driving":
        return primary.DEFAULT;
      case "work":
        return warning.DEFAULT;
      case "break":
        return success.DEFAULT;
      case "rest":
        return "#6366f1";
      default:
        return text;
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
                    {formatTime(dayjs(item.startDateTime).format("HH:mm"))} -{" "}
                    {formatTime(dayjs(item.endDateTime).format("HH:mm"))}
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
