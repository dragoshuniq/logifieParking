import dayjs from "dayjs";
import "dayjs/locale/bg";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/hu";
import "dayjs/locale/it";
import "dayjs/locale/pl";
import "dayjs/locale/ro";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const configureDayjsLocale = (locale: string) => {
  dayjs.locale(locale);
};

export default dayjs;
