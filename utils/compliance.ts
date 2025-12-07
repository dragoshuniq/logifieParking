import dayjs from "@/utils/dayjs-config";
import { Activity, ActivityType } from "./driver-db";

export interface ComplianceStatus {
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export type DailyStats = {
  date: Date;
  totalHours: number;
  drivingHours: number;
  workHours: number;
  breakHours: number;
  restHours: number;
  availabilityHours: number;
};

export type WeeklyStats = {
  totalWorkHours: number;
  totalDrivingHours: number;
  totalBreakHours: number;
  totalRestHours: number;
  totalAvailabilityHours: number;
  dailyStats: DailyStats[];
};

export interface DailyDrivingCompliance {
  drivingHours: number;
  limit: number;
  extendedDaysThisWeek: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export interface BreakCompliance {
  totalBreakMinutes: number;
  requiredBreakMinutes: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
  breaks: { start: number; end: number; duration: number }[];
}

export interface DailyRestCompliance {
  restHours: number;
  activityWindowHours: number;
  restType: "regular" | "reduced" | "none";
  reducedRestCount: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export interface NightWorkCompliance {
  hasNightWork: boolean;
  nightWorkStart: number;
  nightWorkEnd: number;
  maxWorkingTime: number;
  actualWorkingTime: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
}

export interface WeeklyWorkingTimeCompliance {
  weeklyHours: number;
  weeklyLimit: number;
  fourMonthAverage: number;
  fourMonthLimit: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export interface WeeklyDrivingCompliance {
  weeklyDrivingHours: number;
  twoWeekDrivingHours: number;
  weeklyLimit: number;
  twoWeekLimit: number;
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export interface WeeklyRestCompliance {
  lastRestStart: number | null;
  lastRestEnd: number | null;
  lastRestHours: number;
  hoursSinceLastWeeklyRest: number;
  maxHoursBetweenRests: number;
  restType: "regular" | "reduced" | "none";
  isCompliant: boolean;
  level: "compliant" | "warning" | "violation";
  alerts: string[];
}

export interface WeeklyRestDeficitInfo {
  weekStart: number;
  weekEnd: number;
  deficitHours: number;
  compensatedHours: number;
  mustCompensateBy: number;
}

const NIGHT_WINDOW_START = 0;
const NIGHT_WINDOW_END = 7;

export const calculateDailyStats = (
  activities: Activity[],
  date: Date
): DailyStats => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const dayActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
  );

  const stats: DailyStats = {
    date,
    totalHours: 0,
    drivingHours: 0,
    workHours: 0,
    breakHours: 0,
    restHours: 0,
    availabilityHours: 0,
  };

  dayActivities.forEach((activity) => {
    switch (activity.type) {
      case ActivityType.DRIVING:
        stats.drivingHours += activity.duration;
        stats.totalHours += activity.duration;
        break;
      case ActivityType.OTHER_WORK:
        stats.workHours += activity.duration;
        stats.totalHours += activity.duration;
        break;
      case ActivityType.BREAK:
        stats.breakHours += activity.duration;
        break;
      case ActivityType.REST:
        stats.restHours += activity.duration;
        break;
      case ActivityType.AVAILABILITY:
        stats.availabilityHours += activity.duration;
        stats.totalHours += activity.duration;
        break;
    }
  });

  return stats;
};

export const calculateWeeklyStats = (
  activities: Activity[],
  dates: Date[]
): WeeklyStats => {
  const dailyStats = dates.map((date) =>
    calculateDailyStats(activities, date)
  );

  const stats: WeeklyStats = {
    totalWorkHours: 0,
    totalDrivingHours: 0,
    totalBreakHours: 0,
    totalRestHours: 0,
    totalAvailabilityHours: 0,
    dailyStats,
  };

  dailyStats.forEach((day) => {
    stats.totalWorkHours +=
      day.drivingHours + day.workHours + day.availabilityHours;
    stats.totalDrivingHours += day.drivingHours;
    stats.totalBreakHours += day.breakHours;
    stats.totalRestHours += day.restHours;
    stats.totalAvailabilityHours += day.availabilityHours;
  });

  return stats;
};

export const calculateDailyDrivingCompliance = (
  activities: Activity[],
  date: Date,
  weekActivities: Activity[]
): DailyDrivingCompliance => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const dayActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfDay &&
      a.startDateTime <= endOfDay &&
      a.type === ActivityType.DRIVING
  );

  const drivingHours = dayActivities.reduce(
    (sum, a) => sum + a.duration,
    0
  );

  const startOfWeek = dayjs(date).startOf("isoWeek").valueOf();
  const endOfWeek = dayjs(date).endOf("isoWeek").valueOf();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    dayjs(date).startOf("isoWeek").add(i, "day")
  );

  let extendedDaysThisWeek = 0;
  weekDays.forEach((weekDay) => {
    const dayStart = weekDay.startOf("day").valueOf();
    const dayEnd = weekDay.endOf("day").valueOf();
    const dayDrivingHours = weekActivities
      .filter(
        (a) =>
          a.startDateTime >= dayStart &&
          a.startDateTime <= dayEnd &&
          a.type === ActivityType.DRIVING
      )
      .reduce((sum, a) => sum + a.duration, 0);

    if (dayDrivingHours > 9) {
      extendedDaysThisWeek++;
    }
  });

  const limit = extendedDaysThisWeek >= 2 ? 9 : 10;
  const isCompliant = drivingHours <= limit;
  const alerts: string[] = [];

  let level: "compliant" | "warning" | "violation" = "compliant";

  if (drivingHours > limit) {
    level = "violation";
    alerts.push(
      `Daily driving exceeded ${limit}h limit (${drivingHours.toFixed(
        1
      )}h)`
    );
  } else if (drivingHours > 9 && extendedDaysThisWeek >= 2) {
    level = "warning";
    alerts.push(
      "Already used 2 extended driving days (10h) this week"
    );
  } else if (drivingHours > 8) {
    level = "warning";
    alerts.push("Approaching daily driving limit");
  }

  return {
    drivingHours,
    limit,
    extendedDaysThisWeek,
    isCompliant,
    level,
    alerts,
  };
};

export const calculateBreakCompliance = (
  activities: Activity[],
  date: Date
): BreakCompliance => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const dayActivities = activities
    .filter(
      (a) =>
        a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
    )
    .sort((a, b) => a.startDateTime - b.startDateTime);

  const drivingActivities = dayActivities.filter(
    (a) => a.type === ActivityType.DRIVING
  );
  const breakActivities = dayActivities.filter(
    (a) => a.type === ActivityType.BREAK
  );

  const breaks = breakActivities.map((b) => ({
    start: b.startDateTime,
    end: b.endDateTime,
    duration: b.duration * 60,
  }));

  const totalBreakMinutes = breaks.reduce(
    (sum, b) => sum + b.duration,
    0
  );

  let requiredBreakMinutes = 0;
  let cumulativeDrivingMinutes = 0;
  let isCompliant = true;
  const alerts: string[] = [];

  for (const activity of drivingActivities) {
    cumulativeDrivingMinutes += activity.duration * 60;

    if (cumulativeDrivingMinutes >= 270) {
      requiredBreakMinutes = 45;
      const breaksAfterDriving = breaks.filter(
        (b) => b.start >= activity.endDateTime
      );

      const totalBreakAfter = breaksAfterDriving.reduce(
        (sum, b) => sum + b.duration,
        0
      );

      const hasValidBreak =
        breaksAfterDriving.some((b) => b.duration >= 45) ||
        (breaksAfterDriving.some((b) => b.duration >= 15) &&
          breaksAfterDriving.some((b) => b.duration >= 30));

      if (!hasValidBreak && totalBreakAfter < 45) {
        isCompliant = false;
        alerts.push(
          "Missing mandatory 45min break after 4.5h driving (can be split: 15+30min)"
        );
      }

      cumulativeDrivingMinutes = 0;
    }
  }

  let level: "compliant" | "warning" | "violation" = "compliant";
  if (!isCompliant) {
    level = "violation";
  } else if (
    totalBreakMinutes < requiredBreakMinutes &&
    requiredBreakMinutes > 0
  ) {
    level = "warning";
    alerts.push("Break time below recommended minimum");
  }

  return {
    totalBreakMinutes,
    requiredBreakMinutes,
    isCompliant,
    level,
    alerts,
    breaks,
  };
};

export const calculateDailyRestCompliance = (
  activities: Activity[],
  date: Date,
  historicalActivities: Activity[]
): DailyRestCompliance => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const sortedActivities = [...activities]
    .filter(
      (a) =>
        a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
    )
    .sort((a, b) => a.startDateTime - b.startDateTime);

  const workActivities = sortedActivities.filter(
    (a) =>
      a.type === ActivityType.DRIVING ||
      a.type === ActivityType.OTHER_WORK ||
      a.type === ActivityType.AVAILABILITY
  );

  const restActivities = sortedActivities.filter(
    (a) => a.type === ActivityType.REST
  );

  const restHours = restActivities.reduce(
    (sum, a) => sum + a.duration,
    0
  );

  let activityWindowHours = 0;
  if (workActivities.length > 0) {
    const firstActivity = workActivities[0];
    const lastActivity = workActivities[workActivities.length - 1];
    activityWindowHours =
      (lastActivity.endDateTime - firstActivity.startDateTime) /
      (1000 * 60 * 60);
  }

  const startOfWeek = dayjs(date).startOf("isoWeek").valueOf();
  const weekActivities = historicalActivities.filter(
    (a) =>
      a.startDateTime >= startOfWeek && a.startDateTime <= endOfDay
  );

  const reducedRestCount = countReducedDailyRests(
    weekActivities,
    date
  );

  let restType: "regular" | "reduced" | "none" = "none";
  if (restHours >= 11) {
    restType = "regular";
  } else if (restHours >= 9) {
    restType = "reduced";
  }

  const alerts: string[] = [];
  let isCompliant = true;
  let level: "compliant" | "warning" | "violation" = "compliant";

  if (activityWindowHours > 15) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `Activity window exceeded 15h (${activityWindowHours.toFixed(
        1
      )}h)`
    );
  } else if (activityWindowHours > 13) {
    level = "warning";
    alerts.push(
      `Activity window exceeded 13h (${activityWindowHours.toFixed(
        1
      )}h)`
    );
  }

  if (restHours < 11 && restHours > 0) {
    if (restHours >= 9) {
      if (reducedRestCount >= 3) {
        isCompliant = false;
        level = "violation";
        alerts.push(
          "Max 3 reduced daily rests (9h) allowed between weekly rests"
        );
      } else {
        level = "warning";
        alerts.push(
          `Reduced daily rest (${restHours.toFixed(
            1
          )}h) - max 3 between weekly rests`
        );
      }
    } else {
      isCompliant = false;
      level = "violation";
      alerts.push(
        `Insufficient daily rest (${restHours.toFixed(
          1
        )}h) - minimum 9h required`
      );
    }
  }

  return {
    restHours,
    activityWindowHours,
    restType,
    reducedRestCount,
    isCompliant,
    level,
    alerts,
  };
};

const countReducedDailyRests = (
  activities: Activity[],
  currentDate: Date
): number => {
  const startOfWeek = dayjs(currentDate).startOf("isoWeek");
  let count = 0;

  for (let i = 0; i < 7; i++) {
    const checkDate = startOfWeek.add(i, "day");
    const dayStart = checkDate.startOf("day").valueOf();
    const dayEnd = checkDate.endOf("day").valueOf();

    const dayRests = activities.filter(
      (a) =>
        a.type === ActivityType.REST &&
        a.startDateTime >= dayStart &&
        a.startDateTime <= dayEnd
    );

    const totalRest = dayRests.reduce(
      (sum, a) => sum + a.duration,
      0
    );

    if (totalRest >= 9 && totalRest < 11) {
      count++;
    }
  }

  return count;
};

export const calculateNightWorkCompliance = (
  activities: Activity[],
  date: Date,
  nightWindowStart: number = NIGHT_WINDOW_START,
  nightWindowEnd: number = NIGHT_WINDOW_END
): NightWorkCompliance => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const dayActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
  );

  const workActivities = dayActivities.filter(
    (a) =>
      a.type === ActivityType.DRIVING ||
      a.type === ActivityType.OTHER_WORK ||
      a.type === ActivityType.AVAILABILITY
  );

  let hasNightWork = false;
  let nightWorkStart = 0;
  let nightWorkEnd = 0;

  for (const activity of workActivities) {
    const activityStart = dayjs(activity.startDateTime);
    const activityEnd = dayjs(activity.endDateTime);

    const nightStart = activityStart
      .startOf("day")
      .add(nightWindowStart, "hour");
    const nightEnd = activityStart
      .startOf("day")
      .add(nightWindowEnd, "hour");

    if (
      (activityStart.isBefore(nightEnd) &&
        activityEnd.isAfter(nightStart)) ||
      activityStart.isSame(nightStart) ||
      activityStart.isSame(nightEnd)
    ) {
      hasNightWork = true;
      nightWorkStart = nightStart.valueOf();
      nightWorkEnd = nightEnd.valueOf();
      break;
    }
  }

  const actualWorkingTime = workActivities.reduce(
    (sum, a) => sum + a.duration,
    0
  );
  const maxWorkingTime = hasNightWork ? 10 : 13;
  const isCompliant = actualWorkingTime <= maxWorkingTime;

  let level: "compliant" | "warning" | "violation" = "compliant";
  if (!isCompliant) {
    level = "violation";
  } else if (hasNightWork && actualWorkingTime > 9) {
    level = "warning";
  }

  return {
    hasNightWork,
    nightWorkStart,
    nightWorkEnd,
    maxWorkingTime,
    actualWorkingTime,
    isCompliant,
    level,
  };
};

export const calculateWeeklyWorkingTimeCompliance = (
  activities: Activity[],
  currentDate: Date
): WeeklyWorkingTimeCompliance => {
  const startOfWeek = dayjs(currentDate).startOf("isoWeek").valueOf();
  const endOfWeek = dayjs(currentDate).endOf("isoWeek").valueOf();

  const weekActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfWeek && a.startDateTime <= endOfWeek
  );

  const weeklyHours = weekActivities
    .filter(
      (a) =>
        a.type === ActivityType.DRIVING ||
        a.type === ActivityType.OTHER_WORK ||
        a.type === ActivityType.AVAILABILITY
    )
    .reduce((sum, a) => sum + a.duration, 0);

  const fourMonthsAgo = dayjs(currentDate)
    .subtract(4, "month")
    .valueOf();
  const fourMonthActivities = activities.filter(
    (a) =>
      a.startDateTime >= fourMonthsAgo && a.startDateTime <= endOfWeek
  );

  const totalHours = fourMonthActivities
    .filter(
      (a) =>
        a.type === ActivityType.DRIVING ||
        a.type === ActivityType.OTHER_WORK ||
        a.type === ActivityType.AVAILABILITY
    )
    .reduce((sum, a) => sum + a.duration, 0);

  const weekCount = Math.max(
    1,
    dayjs(endOfWeek).diff(dayjs(fourMonthsAgo), "week")
  );
  const fourMonthAverage = totalHours / weekCount;

  const weeklyLimit = 60;
  const fourMonthLimit = 48;

  const alerts: string[] = [];
  let isCompliant = true;
  let level: "compliant" | "warning" | "violation" = "compliant";

  if (weeklyHours > weeklyLimit) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `Weekly working time exceeded 60h limit (${weeklyHours.toFixed(
        1
      )}h)`
    );
  } else if (weeklyHours > 56) {
    level = "warning";
    alerts.push("Approaching weekly 60h working time limit");
  }

  if (fourMonthAverage > fourMonthLimit) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `4-month average exceeded 48h (${fourMonthAverage.toFixed(
        1
      )}h/week)`
    );
  } else if (fourMonthAverage > 46) {
    level = "warning";
    alerts.push("Approaching 4-month 48h average limit");
  }

  return {
    weeklyHours,
    weeklyLimit,
    fourMonthAverage,
    fourMonthLimit,
    isCompliant,
    level,
    alerts,
  };
};

export const calculateWeeklyDrivingCompliance = (
  activities: Activity[],
  currentDate: Date
): WeeklyDrivingCompliance => {
  const startOfWeek = dayjs(currentDate).startOf("isoWeek").valueOf();
  const endOfWeek = dayjs(currentDate).endOf("isoWeek").valueOf();

  const weekActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfWeek &&
      a.startDateTime <= endOfWeek &&
      a.type === ActivityType.DRIVING
  );

  const weeklyDrivingHours = weekActivities.reduce(
    (sum, a) => sum + a.duration,
    0
  );

  const startOfPrevWeek = dayjs(currentDate)
    .subtract(1, "week")
    .startOf("isoWeek")
    .valueOf();

  const twoWeekActivities = activities.filter(
    (a) =>
      a.startDateTime >= startOfPrevWeek &&
      a.startDateTime <= endOfWeek &&
      a.type === ActivityType.DRIVING
  );

  const twoWeekDrivingHours = twoWeekActivities.reduce(
    (sum, a) => sum + a.duration,
    0
  );

  const weeklyLimit = 56;
  const twoWeekLimit = 90;

  const alerts: string[] = [];
  let isCompliant = true;
  let level: "compliant" | "warning" | "violation" = "compliant";

  if (weeklyDrivingHours > weeklyLimit) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `Weekly driving exceeded 56h limit (${weeklyDrivingHours.toFixed(
        1
      )}h)`
    );
  } else if (weeklyDrivingHours > 52) {
    level = "warning";
    alerts.push("Approaching weekly 56h driving limit");
  }

  if (twoWeekDrivingHours > twoWeekLimit) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `Two-week driving exceeded 90h limit (${twoWeekDrivingHours.toFixed(
        1
      )}h)`
    );
  } else if (twoWeekDrivingHours > 85) {
    level = "warning";
    alerts.push("Approaching two-week 90h driving limit");
  }

  return {
    weeklyDrivingHours,
    twoWeekDrivingHours,
    weeklyLimit,
    twoWeekLimit,
    isCompliant,
    level,
    alerts,
  };
};

export const calculateWeeklyRestCompliance = (
  activities: Activity[],
  currentDate: Date
): WeeklyRestCompliance => {
  const now = dayjs(currentDate).valueOf();

  const sortedActivities = [...activities].sort(
    (a, b) => b.startDateTime - a.startDateTime
  );

  let lastRestStart: number | null = null;
  let lastRestEnd: number | null = null;
  let lastRestHours = 0;
  let restType: "regular" | "reduced" | "none" = "none";

  const restBlocks = findRestBlocks(activities);

  if (restBlocks.length > 0) {
    const lastRest = restBlocks[0];
    lastRestStart = lastRest.start;
    lastRestEnd = lastRest.end;
    lastRestHours = lastRest.duration;

    if (lastRestHours >= 45) {
      restType = "regular";
    } else if (lastRestHours >= 24) {
      restType = "reduced";
    }
  }

  const hoursSinceLastWeeklyRest = lastRestEnd
    ? (now - lastRestEnd) / (1000 * 60 * 60)
    : 999;

  const maxHoursBetweenRests = 144;

  const alerts: string[] = [];
  let isCompliant = true;
  let level: "compliant" | "warning" | "violation" = "compliant";

  if (hoursSinceLastWeeklyRest > maxHoursBetweenRests) {
    isCompliant = false;
    level = "violation";
    alerts.push(
      `${hoursSinceLastWeeklyRest.toFixed(
        0
      )}h since last weekly rest - max 144h allowed`
    );
  } else if (hoursSinceLastWeeklyRest > 120) {
    level = "warning";
    alerts.push(
      `${hoursSinceLastWeeklyRest.toFixed(
        0
      )}h since last weekly rest - approaching 144h limit`
    );
  }

  if (restType === "reduced") {
    alerts.push(
      "Last weekly rest was reduced (24-45h) - must compensate within 3 weeks"
    );
  }

  return {
    lastRestStart,
    lastRestEnd,
    lastRestHours,
    hoursSinceLastWeeklyRest,
    maxHoursBetweenRests,
    restType,
    isCompliant,
    level,
    alerts,
  };
};

const findRestBlocks = (
  activities: Activity[]
): { start: number; end: number; duration: number }[] => {
  const restActivities = activities
    .filter((a) => a.type === ActivityType.REST)
    .sort((a, b) => b.startDateTime - a.startDateTime);

  const blocks: { start: number; end: number; duration: number }[] =
    [];
  let currentBlock: Activity[] = [];

  for (let i = 0; i < restActivities.length; i++) {
    const current = restActivities[i];

    if (currentBlock.length === 0) {
      currentBlock.push(current);
      continue;
    }

    const lastInBlock = currentBlock[currentBlock.length - 1];
    const timeDiff =
      Math.abs(lastInBlock.startDateTime - current.endDateTime) /
      (1000 * 60);

    if (timeDiff <= 60) {
      currentBlock.push(current);
    } else {
      const totalDuration = currentBlock.reduce(
        (sum, a) => sum + a.duration,
        0
      );
      if (totalDuration >= 24) {
        blocks.push({
          start: currentBlock[currentBlock.length - 1].startDateTime,
          end: currentBlock[0].endDateTime,
          duration: totalDuration,
        });
      }
      currentBlock = [current];
    }
  }

  if (currentBlock.length > 0) {
    const totalDuration = currentBlock.reduce(
      (sum, a) => sum + a.duration,
      0
    );
    if (totalDuration >= 24) {
      blocks.push({
        start: currentBlock[currentBlock.length - 1].startDateTime,
        end: currentBlock[0].endDateTime,
        duration: totalDuration,
      });
    }
  }

  return blocks;
};

export const calculateWeeklyRestDeficit = (
  restHours: number
): WeeklyRestDeficitInfo | null => {
  if (restHours >= 45 || restHours < 24) {
    return null;
  }

  const deficitHours = 45 - restHours;
  const mustCompensateBy = dayjs().add(3, "week").valueOf();

  return {
    weekStart: dayjs().startOf("isoWeek").valueOf(),
    weekEnd: dayjs().endOf("isoWeek").valueOf(),
    deficitHours,
    compensatedHours: 0,
    mustCompensateBy,
  };
};

export const validateTwoWeekRestPattern = (
  activities: Activity[],
  currentDate: Date
): {
  isCompliant: boolean;
  pattern: string;
  alerts: string[];
} => {
  const restBlocks = findRestBlocks(activities);
  const twoWeeksAgo = dayjs(currentDate)
    .subtract(2, "week")
    .valueOf();

  const recentRests = restBlocks.filter(
    (r) => r.start >= twoWeeksAgo
  );

  const alerts: string[] = [];
  let isCompliant = true;
  let pattern = "none";

  if (recentRests.length === 0) {
    isCompliant = false;
    alerts.push("No weekly rest in past 2 weeks");
    return { isCompliant, pattern, alerts };
  }

  if (recentRests.length === 1) {
    if (recentRests[0].duration >= 45) {
      pattern = "single-regular";
      isCompliant = true;
    } else {
      isCompliant = false;
      alerts.push("Single weekly rest must be at least 45h");
    }
  } else if (recentRests.length === 2) {
    const [first, second] = recentRests.sort(
      (a, b) => a.start - b.start
    );

    if (first.duration >= 45 && second.duration >= 45) {
      pattern = "two-regular";
      isCompliant = true;
    } else if (
      (first.duration >= 45 && second.duration >= 24) ||
      (first.duration >= 24 && second.duration >= 45)
    ) {
      pattern = "regular-reduced";
      isCompliant = true;
    } else {
      isCompliant = false;
      alerts.push(
        "Two-week pattern requires either 2×45h or 45h+24h weekly rests"
      );
    }
  }

  return { isCompliant, pattern, alerts };
};
