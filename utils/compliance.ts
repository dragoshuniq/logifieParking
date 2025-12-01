import dayjs from 'dayjs';
import { Activity, ActivityType } from './driver-db';

export interface ComplianceStatus {
  isCompliant: boolean;
  level: 'compliant' | 'warning' | 'violation';
  alerts: string[];
}

export interface DailyStats {
  date: Date;
  totalHours: number;
  drivingHours: number;
  workHours: number;
  breakHours: number;
  restHours: number;
}

export interface WeeklyStats {
  totalWorkHours: number;
  totalDrivingHours: number;
  totalBreakHours: number;
  totalRestHours: number;
  dailyStats: DailyStats[];
}

export const calculateDailyStats = (activities: Activity[], date: Date): DailyStats => {
  const startOfDay = dayjs(date).startOf('day').valueOf();
  const endOfDay = dayjs(date).endOf('day').valueOf();
  
  const dayActivities = activities.filter(
    a => a.startDateTime >= startOfDay && a.startDateTime <= endOfDay
  );
  
  const stats: DailyStats = {
    date,
    totalHours: 0,
    drivingHours: 0,
    workHours: 0,
    breakHours: 0,
    restHours: 0,
  };
  
  dayActivities.forEach(activity => {
    stats.totalHours += activity.duration;
    
    switch (activity.type) {
      case 'driving':
        stats.drivingHours += activity.duration;
        break;
      case 'work':
        stats.workHours += activity.duration;
        break;
      case 'break':
        stats.breakHours += activity.duration;
        break;
      case 'rest':
        stats.restHours += activity.duration;
        break;
    }
  });
  
  return stats;
};

export const calculateWeeklyStats = (activities: Activity[], dates: Date[]): WeeklyStats => {
  const dailyStats = dates.map(date => calculateDailyStats(activities, date));
  
  const stats: WeeklyStats = {
    totalWorkHours: 0,
    totalDrivingHours: 0,
    totalBreakHours: 0,
    totalRestHours: 0,
    dailyStats,
  };
  
  dailyStats.forEach(day => {
    stats.totalWorkHours += day.drivingHours + day.workHours;
    stats.totalDrivingHours += day.drivingHours;
    stats.totalBreakHours += day.breakHours;
    stats.totalRestHours += day.restHours;
  });
  
  return stats;
};

export const checkCompliance = (
  weeklyStats: WeeklyStats,
  fortnightStats: WeeklyStats
): ComplianceStatus => {
  const alerts: string[] = [];
  let level: 'compliant' | 'warning' | 'violation' = 'compliant';
  
  if (weeklyStats.totalDrivingHours > 56) {
    alerts.push('driver.alerts.weeklyDrivingExceeded');
    level = 'violation';
  } else if (weeklyStats.totalDrivingHours > 52) {
    alerts.push('driver.alerts.weeklyDrivingExceeded');
    level = 'warning';
  }
  
  if (weeklyStats.totalWorkHours > 48) {
    alerts.push('driver.alerts.weeklyWorkExceeded');
    if (level !== 'violation') level = 'warning';
  }
  
  if (fortnightStats.totalDrivingHours > 90) {
    alerts.push('driver.alerts.fortnightDrivingExceeded');
    level = 'violation';
  } else if (fortnightStats.totalDrivingHours > 85) {
    alerts.push('driver.alerts.fortnightDrivingExceeded');
    if (level !== 'violation') level = 'warning';
  }
  
  weeklyStats.dailyStats.forEach(day => {
    const dailyWorkHours = day.drivingHours + day.workHours;
    if (dailyWorkHours > 13) {
      alerts.push('driver.alerts.dailyWorkExceeded');
      level = 'violation';
    }
    
    if (dailyWorkHours > 4.5 && day.breakHours < 0.75) {
      alerts.push('driver.alerts.missingBreaks');
      if (level !== 'violation') level = 'warning';
    }
    
    if (dailyWorkHours > 0 && day.restHours < 11) {
      alerts.push('driver.alerts.missingRest');
      if (level !== 'violation') level = 'warning';
    }
  });
  
  return {
    isCompliant: level === 'compliant',
    level,
    alerts: [...new Set(alerts)],
  };
};

export const getComplianceColor = (level: 'compliant' | 'warning' | 'violation'): string => {
  switch (level) {
    case 'compliant':
      return 'success';
    case 'warning':
      return 'warning';
    case 'violation':
      return 'danger';
  }
};

