import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { ActivityFormPayload, ESheets } from "@/constants/sheets";
import { useThemedColors } from "@/hooks/use-themed-colors";
import { Activity, ActivityType } from "@/utils/driver-db";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  useSheetPayload,
} from "react-native-actions-sheet";
import { showTimePicker } from "./time-picker-sheet";

export const showActivityForm = (payload: ActivityFormPayload) => {
  SheetManager.show(ESheets.ActivityForm, {
    payload,
  });
};

const ActivityFormSheet = () => {
  const payload = useSheetPayload(ESheets.ActivityForm);
  const { t } = useTranslation();
  const { content1, content2, primary, success, danger, text } =
    useThemedColors(
      "content1",
      "content2",
      "primary",
      "success",
      "danger",
      "text"
    );

  const { onSave, onDelete, initialActivity, date } = payload || {
    onSave: () => {},
    date: "",
  };

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [isManualEntry, setIsManualEntry] = useState(
    !initialActivity?.startTime
  );
  const [activityType, setActivityType] = useState<ActivityType>(
    initialActivity?.type || "driving"
  );
  const [startTime, setStartTime] = useState(
    initialActivity?.startTime || ""
  );
  const [endTime, setEndTime] = useState(
    initialActivity?.endTime || ""
  );
  const [duration, setDuration] = useState(
    initialActivity?.duration.toString() || ""
  );

  const activityTypes: { type: ActivityType; label: string }[] = [
    { type: "driving", label: t("driver.driving") },
    { type: "work", label: t("driver.work") },
    { type: "break", label: t("driver.break") },
    { type: "rest", label: t("driver.rest") },
  ];

  const onCloseSheet = () => {
    actionSheetRef?.current?.hide();
  };

  const handleStartTimePicker = () => {
    const currentTime = startTime
      ? dayjs(`${date} ${startTime}`).toDate()
      : new Date();

    showTimePicker({
      value: currentTime,
      minuteInterval: 15,
      onConfirm: (selectedDate) => {
        const timeStr = dayjs(selectedDate).format("HH:mm");
        setStartTime(timeStr);

        if (!isManualEntry && endTime) {
          const start = dayjs(`${date} ${timeStr}`);
          const end = dayjs(`${date} ${endTime}`);
          if (end.isBefore(start) || end.isSame(start)) {
            setEndTime("");
            Alert.alert(
              t("driver.validation", "Validation"),
              t(
                "driver.endTimeEarlier",
                "End time must be after start time. Please select end time again."
              )
            );
          }
        }
      },
    });
  };

  const handleEndTimePicker = () => {
    if (!startTime) {
      Alert.alert(
        t("driver.validation", "Validation"),
        t("driver.selectStartFirst", "Please select start time first")
      );
      return;
    }

    const startDate = dayjs(`${date} ${startTime}`).toDate();
    const currentTime = endTime
      ? dayjs(`${date} ${endTime}`).toDate()
      : new Date(startDate.getTime() + 60 * 60 * 1000);

    showTimePicker({
      value: currentTime,
      minimumDate: startDate,
      minuteInterval: 15,
      onConfirm: (selectedDate) => {
        const timeStr = dayjs(selectedDate).format("HH:mm");
        const start = dayjs(`${date} ${startTime}`);
        const end = dayjs(`${date} ${timeStr}`);

        if (end.isBefore(start) || end.isSame(start)) {
          Alert.alert(
            t("driver.validation", "Validation"),
            t(
              "driver.endTimeEarlier",
              "End time must be after start time"
            )
          );
          return;
        }

        setEndTime(timeStr);
      },
    });
  };

  const calculateDuration = (): number => {
    if (isManualEntry) {
      return parseFloat(duration) || 0;
    }
    if (startTime && endTime) {
      const start = dayjs(`${date} ${startTime}`);
      const end = dayjs(`${date} ${endTime}`);
      const diff = end.diff(start, "minute");
      return Math.max(0, diff / 60);
    }
    return 0;
  };

  const handleSave = () => {
    if (!date || !onSave) return;

    let finalStartTime = startTime;
    let finalEndTime = endTime;
    let calculatedDuration = 0;

    if (isManualEntry) {
      if (!startTime) {
        Alert.alert(
          t("driver.validation", "Validation"),
          t("driver.startTimeRequired", "Start time is required")
        );
        return;
      }
      const durationNum = parseFloat(duration);
      if (!durationNum || durationNum <= 0) {
        Alert.alert(
          t("driver.validation", "Validation"),
          t(
            "driver.durationRequired",
            "Duration must be greater than 0"
          )
        );
        return;
      }

      calculatedDuration = durationNum;
      const startDateTime = dayjs(`${date} ${startTime}`);
      const endDateTime = startDateTime.add(durationNum, "hour");
      finalEndTime = endDateTime.format("HH:mm");
    } else {
      if (!startTime || !endTime) {
        Alert.alert(
          t("driver.validation", "Validation"),
          t(
            "driver.timesRequired",
            "Both start and end times are required"
          )
        );
        return;
      }

      const start = dayjs(`${date} ${startTime}`);
      const end = dayjs(`${date} ${endTime}`);
      const diff = end.diff(start, "minute");
      calculatedDuration = Math.max(0, diff / 60);
    }

    if (calculatedDuration <= 0) return;

    const activity: Activity = {
      id: initialActivity?.id,
      date,
      type: activityType,
      duration: calculatedDuration,
      startTime: finalStartTime,
      endTime: finalEndTime,
    };

    onSave(activity);
    onCloseSheet();
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      useBottomSafeAreaPadding
      containerStyle={[
        styles.container,
        { backgroundColor: content1.DEFAULT },
      ]}
    >
      <ThemedView
        style={[
          styles.content,
          { backgroundColor: content1.DEFAULT },
        ]}
      >
        <ThemedText style={styles.title}>
          {initialActivity
            ? t("driver.editActivity")
            : t("driver.addActivity")}
        </ThemedText>

        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.label}>
            {t("driver.activityType")}
          </ThemedText>
          <View style={styles.typeContainer}>
            {activityTypes.map((item) => (
              <TouchableOpacity
                key={item.type}
                onPress={() => setActivityType(item.type)}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      activityType === item.type
                        ? primary.DEFAULT
                        : content2.DEFAULT,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color:
                      activityType === item.type
                        ? primary.foreground
                        : content2.foreground,
                  }}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.entryModeContainer}>
            <TouchableOpacity
              onPress={() => setIsManualEntry(false)}
              style={[
                styles.entryModeButton,
                {
                  backgroundColor: !isManualEntry
                    ? primary.DEFAULT
                    : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: !isManualEntry
                    ? primary.foreground
                    : content2.foreground,
                }}
              >
                {t("driver.timeEntry")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsManualEntry(true)}
              style={[
                styles.entryModeButton,
                {
                  backgroundColor: isManualEntry
                    ? primary.DEFAULT
                    : content2.DEFAULT,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: isManualEntry
                    ? primary.foreground
                    : content2.foreground,
                }}
              >
                {t("driver.manualEntry")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.label}>
            {t("driver.startTime")}
          </ThemedText>
          <TouchableOpacity
            onPress={handleStartTimePicker}
            style={[
              styles.input,
              { backgroundColor: content2.DEFAULT },
            ]}
          >
            <ThemedText
              style={{
                color: startTime ? text : "#999",
              }}
            >
              {startTime || "HH:MM"}
            </ThemedText>
          </TouchableOpacity>

          {isManualEntry ? (
            <View>
              <ThemedText style={styles.label}>
                {t("driver.duration")}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: text, backgroundColor: content2.DEFAULT },
                ]}
                value={duration}
                onChangeText={setDuration}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#999"
              />
            </View>
          ) : (
            <View>
              <ThemedText style={styles.label}>
                {t("driver.endTime")}
              </ThemedText>
              <TouchableOpacity
                onPress={handleEndTimePicker}
                style={[
                  styles.input,
                  { backgroundColor: content2.DEFAULT },
                ]}
              >
                <ThemedText
                  style={{
                    color: endTime ? text : "#999",
                  }}
                >
                  {endTime || "HH:MM"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onCloseSheet}
            style={[
              styles.button,
              { backgroundColor: content2.DEFAULT },
            ]}
          >
            <ThemedText style={{ color: content2.foreground }}>
              {t("driver.cancel")}
            </ThemedText>
          </TouchableOpacity>

          {initialActivity && onDelete && (
            <TouchableOpacity
              onPress={() => {
                onDelete();
                onCloseSheet();
              }}
              style={[
                styles.button,
                { backgroundColor: danger.DEFAULT },
              ]}
            >
              <ThemedText style={{ color: danger.foreground }}>
                {t("driver.delete")}
              </ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.button,
              { backgroundColor: success.DEFAULT },
            ]}
          >
            <ThemedText style={{ color: success.foreground }}>
              {t("driver.save")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ActionSheet>
  );
};

export default ActivityFormSheet;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  content: {
    padding: 20,
    maxHeight: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    justifyContent: "center",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  entryModeContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  entryModeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});
