import { useTranslation } from "react-i18next";
import { ThemedText } from "../ui/themed-text";

type FormattedHoursProps = {
  hours: number;
  style?: any;
};

export const FormattedHours = ({
  hours,
  style,
}: FormattedHoursProps) => {
  const { t } = useTranslation();

  return (
    <ThemedText style={style}>
      {hours.toFixed(1)}
      {t("format.hourShort")}
    </ThemedText>
  );
};
