import { ThemedText } from "@/components/ui/themed-text";
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

  const { onSave, onDelete, initialActivity, selectedDate } =
    payload || {
      onSave: () => {},
      selectedDate: new Date(),
    };

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const [isManualEntry, setIsManualEntry] = useState(
    !initialActivity?.startDateTime
  );
  const [activityType, setActivityType] = useState<ActivityType>(
    initialActivity?.type || "driving"
  );
  const [startTime, setStartTime] = useState(
    initialActivity
      ? dayjs(initialActivity.startDateTime).format("HH:mm")
      : ""
  );
  const [endTime, setEndTime] = useState(
    initialActivity
      ? dayjs(initialActivity.endDateTime).format("HH:mm")
      : ""
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
    const now = dayjs();
    const interval = 5;
    const currentTime = startTime
      ? dayjs(selectedDate)
          .hour(parseInt(startTime.split(":")[0]))
          .minute(parseInt(startTime.split(":")[1]))
          .toDate()
      : dayjs(selectedDate)
          .hour(now.hour())
          .minute(Math.floor(now.minute() / interval) * interval)
          .second(0)
          .millisecond(0)
          .toDate();

    showTimePicker({
      value: currentTime,
      minuteInterval: interval,
      onConfirm: (selectedTime) => {
        const timeStr = dayjs(selectedTime).format("HH:mm");
        setStartTime(timeStr);

        if (!isManualEntry && endTime) {
          const [startHour, startMinute] = timeStr.split(":");
          const [endHour, endMinute] = endTime.split(":");
          const start = dayjs(selectedDate)
            .hour(parseInt(startHour))
            .minute(parseInt(startMinute));
          const end = dayjs(selectedDate)
            .hour(parseInt(endHour))
            .minute(parseInt(endMinute));
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

    const interval = 5;
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");
    const startDate = dayjs(selectedDate)
      .hour(parseInt(startHour))
      .minute(parseInt(startMinute))
      .second(0)
      .millisecond(0)
      .toDate();
    const currentTime = endTime
      ? dayjs(selectedDate)
          .hour(parseInt(endHour))
          .minute(parseInt(endMinute))
          .toDate()
      : dayjs(startDate).add(1, "hour").toDate();

    showTimePicker({
      value: currentTime,
      minimumDate: startDate,
      minuteInterval: interval,
      onConfirm: (selectedTime) => {
        const timeStr = dayjs(selectedTime).format("HH:mm");
        const [endHour, endMinute] = timeStr.split(":");
        const start = dayjs(selectedDate)
          .hour(parseInt(startHour))
          .minute(parseInt(startMinute));
        const end = dayjs(selectedDate)
          .hour(parseInt(endHour))
          .minute(parseInt(endMinute));

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

  const handleSave = () => {
    if (!selectedDate || !onSave) return;

    let startDateTime: dayjs.Dayjs;
    let endDateTime: dayjs.Dayjs;
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
      const [startHour, startMinute] = startTime.split(":");
      startDateTime = dayjs(selectedDate)
        .hour(parseInt(startHour))
        .minute(parseInt(startMinute))
        .second(0)
        .millisecond(0);
      endDateTime = startDateTime.add(durationNum, "hour");
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

      const [startHour, startMinute] = startTime.split(":");
      const [endHour, endMinute] = endTime.split(":");

      startDateTime = dayjs(selectedDate)
        .hour(parseInt(startHour))
        .minute(parseInt(startMinute))
        .second(0)
        .millisecond(0);
      endDateTime = dayjs(selectedDate)
        .hour(parseInt(endHour))
        .minute(parseInt(endMinute))
        .second(0)
        .millisecond(0);
      calculatedDuration = endDateTime.diff(
        startDateTime,
        "hour",
        true
      );
    }

    if (calculatedDuration <= 0) return;

    const activity: Activity = {
      id: initialActivity?.id,
      startDateTime: startDateTime.valueOf(),
      endDateTime: endDateTime.valueOf(),
      duration: calculatedDuration,
      type: activityType,
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
      gestureEnabled
      closeOnPressBack
    >
      <ThemedText style={styles.title}>
        {initialActivity
          ? t("driver.editActivity")
          : t("driver.addActivity")}
      </ThemedText>

      <ScrollView
        style={styles.form}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
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
    </ActionSheet>
  );
};

export default ActivityFormSheet;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    flexGrow: 1,
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
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});
