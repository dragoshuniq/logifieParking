import { ThemedText } from "@/components/ui/themed-text";
import { useThemedColors } from "@/hooks/use-themed-colors";
import dayjs from "dayjs";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";

type Props = {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  markedDates?: string[];
};

export const HorizontalCalendar = ({
  selectedDate,
  onDateSelect,
  markedDates = [],
}: Props) => {
  const { primary, content2, content3, background } = useThemedColors(
    "primary",
    "content2",
    "content3",
    "background"
  );

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: background,
      calendarBackground: background,
      textSectionTitleColor: content3.foreground,
      dayTextColor: content2.foreground,
      todayTextColor: primary.DEFAULT,
      monthTextColor: content2.foreground,
      textDisabledColor: content3.foreground,
      selectedDayBackgroundColor: primary.DEFAULT,
      selectedDayTextColor: primary.foreground,
      textDayFontSize: 16,
      textMonthFontSize: 12,
      textDayHeaderFontSize: 12,
      textDayFontWeight: "600" as const,
      textDayHeaderFontWeight: "600" as const,
    }),
    [primary, content2, content3, background]
  );

  const markedDatesObject = useMemo(() => {
    const marked: Record<string, any> = {};
    
    markedDates.forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: primary.DEFAULT,
      };
    });
    
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: primary.DEFAULT,
      selectedTextColor: primary.foreground,
    };
    
    return marked;
  }, [selectedDate, markedDates, primary]);

  const currentMonth = dayjs(selectedDate).format("MMMM YYYY");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.monthText}>{currentMonth}</ThemedText>
      <View style={styles.calendarWrapper}>
        <CalendarProvider
          key={background}
          date={selectedDate}
          onDateChanged={onDateSelect}
        >
          <WeekCalendar
            firstDay={1}
            allowShadow
            current={selectedDate}
            markedDates={markedDatesObject}
            onDayPress={(day) => onDateSelect(day.dateString)}
            theme={calendarTheme}
            style={styles.calendar}
          />
        </CalendarProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  calendarWrapper: {
    height: 120,
    width: "100%",
  },
  calendar: {
    paddingHorizontal: 8,
  },
});
