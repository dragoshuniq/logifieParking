import { useThemedColors } from "@/hooks/use-themed-colors";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import dayjs from "dayjs";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface HorizontalCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  weekDates: string[];
}

export const HorizontalCalendar = ({
  selectedDate,
  onDateSelect,
  weekDates,
}: HorizontalCalendarProps) => {
  const { primary, content2, content3 } = useThemedColors("primary", "content2", "content3");

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDates.map((date) => {
          const isSelected = date === selectedDate;
          const isToday = date === dayjs().format("YYYY-MM-DD");
          const day = dayjs(date);

          return (
            <TouchableOpacity
              key={date}
              onPress={() => onDateSelect(date)}
              style={[
                styles.dateItem,
                {
                  backgroundColor: isSelected ? primary.DEFAULT : content2.DEFAULT,
                  borderColor: isToday ? primary.DEFAULT : "transparent",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.dayName,
                  {
                    color: isSelected ? primary.foreground : content2.foreground,
                  },
                ]}
              >
                {day.format("ddd")}
              </ThemedText>
              <ThemedText
                style={[
                  styles.dayNumber,
                  {
                    color: isSelected ? primary.foreground : content2.foreground,
                  },
                ]}
              >
                {day.format("D")}
              </ThemedText>
              <ThemedText
                style={[
                  styles.monthName,
                  {
                    color: isSelected ? primary.foreground : content3.foreground,
                  },
                ]}
              >
                {day.format("MMM")}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dateItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 70,
    borderWidth: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  monthName: {
    fontSize: 10,
    textTransform: "uppercase",
  },
});

