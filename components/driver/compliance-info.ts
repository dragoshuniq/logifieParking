import { InfoSheetProps } from "@/constants/sheets";

export const getComplianceInfo = (
  cardType: string
): InfoSheetProps | undefined => {
  const infoMap: Record<string, InfoSheetProps> = {
    dailyDriving: {
      title: "Daily Driving Time",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Regulation (EC) No 561/2006 – Art. 6 (daily driving time).",
        },
        {
          heading: "Rules",
          content:
            "• Standard limit: max 9 hours of driving within one daily work period.\n" +
            "• Extended limit: up to 10 hours on at most 2 days in a week.\n" +
            "• Driving time is counted between two consecutive daily or weekly rest periods.",
        },
        {
          heading: "Example",
          content:
            "If you drive 10h on Monday and 10h on Wednesday, you must stay at or below 9h of driving on all other days in that same week.",
        },
      ],
    },

    dailyWorking: {
      title: "Daily Working Time & Spread",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Directive 2002/15/EC (working time of mobile workers) + Regulation (EC) No 561/2006 (rest periods).",
        },
        {
          heading: "What Counts as Working Time",
          content:
            "• DRIVING (actual driving time).\n" +
            "• OTHER_WORK (loading, unloading, admin, maintenance, etc.).\n" +
            "• Working time does NOT include: breaks, rest periods, or periods of availability.\n" +
            "• Periods of AVAILABILITY are tracked separately but still extend the daily ‘spread’ (time between rest periods).",
        },
        {
          heading: "Daily Limits (Effect of Rest Rules)",
          content:
            "• The EU rules do not set a strict daily working-time cap, but:\n" +
            "  • You must respect weekly limits: max 60h in any single week, with a 48h/week average over up to 4 months.\n" +
            "  • Because of daily rest requirements under Reg. 561/2006:\n" +
            "    – With regular daily rest of 11h, the maximum ‘spread’ between rest periods is 13h.\n" +
            "    – With reduced daily rest of at least 9h (max 3 times between weekly rests), the spread can be up to 15h.\n" +
            "  • If night work is performed, working time in any 24h period must not exceed 10h (see Night Work card).",
        },
      ],
    },

    breakCompliance: {
      title: "Break Compliance",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "• EU Regulation (EC) No 561/2006 – Art. 7 (driving-time breaks).\n" +
            "• EU Directive 2002/15/EC – working-time breaks for mobile workers.",
        },
        {
          heading: "Driving-Time Breaks (Reg. 561/2006)",
          content:
            "• After a maximum of 4.5 hours of driving, you must take at least 45 minutes of break.\n" +
            "• This 45-minute break can be split into:\n" +
            "  – a first break of at least 15 minutes, and\n" +
            "  – a second break of at least 30 minutes,\n" +
            "  provided both are taken so that together they add up to at least 45 minutes within the 4.5h driving window.",
        },
        {
          heading: "Working-Time Breaks (Dir. 2002/15/EC)",
          content:
            "• You must not work more than 6 consecutive hours without a break.\n" +
            "• If total daily working time is >6h and ≤9h: at least 30 minutes of break in total.\n" +
            "• If total daily working time is >9h: at least 45 minutes of break in total.\n" +
            "• These working-time breaks may be split into periods of at least 15 minutes.\n" +
            "• When driving and other work are mixed, both driving-time and working-time break rules must be satisfied (the stricter rule at that moment wins).",
        },
        {
          heading: "Important",
          content:
            "• Breaks interrupt working time and do NOT count as working time.\n" +
            "• Breaks still extend the daily spread (time between first and last duty activity).",
        },
      ],
    },

    dailyRest: {
      title: "Daily Rest & Activity Window",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Regulation (EC) No 561/2006 – Art. 8 (daily rest periods).",
        },
        {
          heading: "Daily Rest Requirements",
          content:
            "• Regular daily rest: at least 11 consecutive hours within 24 hours of the end of the previous daily or weekly rest.\n" +
            "• Split regular rest option: 3h + 9h (first part at least 3h, second part at least 9h).\n" +
            "• Reduced daily rest: at least 9 hours but less than 11 hours.\n" +
            "• You may take at most 3 reduced daily rests between any two weekly rest periods.",
        },
        {
          heading: "Activity Window (Daily Spread)",
          content:
            "• Daily spread = time from first duty activity (DRIVING/OTHER_WORK/AVAILABILITY/BREAK) to the last one before the next daily or weekly rest.\n" +
            "• With regular daily rest (11h): max 13h spread within the 24h window.\n" +
            "• With reduced daily rest (≥9h): max 15h spread, allowed at most 3 times between weekly rests.\n" +
            "• The full daily rest must fit inside the relevant 24h period counted from the start of the working day.",
        },
      ],
    },

    nightWork: {
      title: "Night Work (EU Working Time)",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Directive 2002/15/EC – night work for mobile road transport workers.",
        },
        {
          heading: "Night Time Definition",
          content:
            "• EU law defines ‘night time’ as a period of at least 4 consecutive hours between 00:00 and 07:00.\n" +
            "• Each Member State sets the exact 4h night period in its national law.\n" +
            "• In the app, this appears as a configurable 4-hour window (e.g. 00:00–04:00 or 01:00–05:00).",
        },
        {
          heading: "Night Work Limit",
          content:
            "• If any working time (DRIVING or OTHER_WORK) is performed during the defined night-time window, this counts as night work.\n" +
            "• When night work is performed, total working time must not exceed 10 hours in any 24-hour period.\n" +
            "• This 10h cap applies to working time only (DRIVING + OTHER_WORK), not to breaks, rest or pure availability.\n" +
            "• Individual Member States may add extra pay or protections, but those are not part of this EU-only profile.",
        },
      ],
    },

    weeklyWorking: {
      title: "Weekly Working Time",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Directive 2002/15/EC – working time of mobile road transport workers.",
        },
        {
          heading: "Weekly Limits",
          content:
            "• Average working time: must not exceed 48 hours per week, calculated over a reference period (up to 4 months).\n" +
            "• Single week: working time may reach up to 60 hours, provided that the 48h/week average over the reference period is not exceeded.\n" +
            "• Working time = DRIVING + OTHER_WORK.\n" +
            "• Breaks, rest periods and periods of availability do NOT count as working time.",
        },
        {
          heading: "Calculation Period",
          content:
            "• ‘Week’ in EU rules is usually a fixed 7-day period (Reg. 561/2006 uses Monday 00:00 to Sunday 24:00).\n" +
            "• The app can monitor a rolling 4-month reference period for the 48h average.\n" +
            "• If a single week >60h → immediate working-time violation.\n" +
            "• If the rolling average >48h/week → working-time violation.",
        },
      ],
    },

    weeklyDriving: {
      title: "Weekly & Fortnightly Driving",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Regulation (EC) No 561/2006 – Art. 6 (weekly and two-week driving limits).",
        },
        {
          heading: "Driving Limits",
          content:
            "• Single week: maximum 56 hours of driving.\n" +
            "• Any two consecutive weeks: maximum 90 hours of driving in total.\n" +
            "• ‘Week’ under Reg. 561/2006: Monday 00:00 to Sunday 24:00.",
        },
        {
          heading: "Example",
          content:
            "Week 1: 48h driving → Week 2 can have at most 42h (48 + 42 = 90).\n" +
            "Week 2: 42h driving → Week 3 can have at most 48h (42 + 48 = 90).",
        },
      ],
    },

    weeklyRest: {
      title: "Weekly Rest & 45h Pause",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Regulation (EC) No 561/2006 – Art. 8 (weekly rest periods, including Mobility Package amendments).",
        },
        {
          heading: "Weekly Rest Requirements",
          content:
            "• A new weekly rest must START no later than 144 hours (6 × 24h) from the END of the previous weekly rest.\n" +
            "• Regular weekly rest: at least 45 consecutive hours.\n" +
            "• Reduced weekly rest: at least 24 hours but less than 45 hours.\n" +
            "• In any 2 consecutive weeks, you must have at least 2 weekly rest periods and at least 1 of them must be regular (≥45h).",
        },
        {
          heading: "Compensation Rules (Overview)",
          content:
            "• Every reduced weekly rest creates a deficit: 45h minus the actual rest duration.\n" +
            "• Each deficit must be compensated ‘en bloc’ (in one continuous block) within 3 weeks after the week of the reduction.\n" +
            "• Compensation must be added to another rest period of at least 9h (daily or weekly rest).",
        },
        {
          heading: "Where Rest Can Be Taken",
          content:
            "• Regular weekly rest periods (≥45h) may NOT be taken in the vehicle.\n" +
            "• Daily rests and reduced weekly rests may be taken in the vehicle if it is stationary and fitted with suitable sleeping facilities.",
        },
        {
          heading: "Days Covered by Weekly Rest",
          content:
            "• Days fully covered by a qualifying weekly rest (≥24h) are treated as off-duty.\n" +
            "• For daily-rest checks, those days are considered automatically compliant.",
        },
      ],
    },

    restCompensation: {
      title: "Rest Compensation",
      sections: [
        {
          heading: "Legal Basis",
          content:
            "EU Regulation (EC) No 561/2006 – Art. 8(6) (compensation for reduced weekly rest).",
        },
        {
          heading: "When Compensation Is Required",
          content:
            "• Every reduced weekly rest (24h to <45h) creates a ‘deficit’ compared to 45h.\n" +
            "• Deficit = 45 hours − actual weekly rest duration.\n" +
            "• Example: 30h weekly rest → 15h deficit that must be compensated later.",
        },
        {
          heading: "Compensation Rules",
          content:
            "• Each deficit must be compensated within 3 weeks following the week of the reduction.\n" +
            "• Compensation must be taken as one continuous block (en bloc).\n" +
            "• It must be attached to another rest period of at least 9 hours (daily or weekly rest).\n" +
            "• Compensation cannot be split across multiple rest periods.",
        },
        {
          heading: "Display in the App",
          content:
            "• Shows how many reduced weekly rests still need compensation.\n" +
            "• Shows total hours of outstanding compensation and the latest deadline by which it must be taken.",
        },
      ],
    },
  };

  return infoMap[cardType];
};
