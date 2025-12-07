import { InfoSheetProps } from "@/constants/sheets";
import i18n from "@/providers/i18n";

export const getComplianceInfo = (
  cardType: string
): InfoSheetProps | undefined => {
  const infoMap: Record<string, InfoSheetProps> = {
    dailyDriving: {
      title: i18n.t("complianceInfo.dailyDriving.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.dailyDriving.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyDriving.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyDriving.rules.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyDriving.rules.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyDriving.example.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyDriving.example.content"
          ),
        },
      ],
    },

    dailyWorking: {
      title: i18n.t("complianceInfo.dailyWorking.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.dailyWorking.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyWorking.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyWorking.whatCounts.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyWorking.whatCounts.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyWorking.dailyLimits.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyWorking.dailyLimits.content"
          ),
        },
      ],
    },

    breakCompliance: {
      title: i18n.t("complianceInfo.breakCompliance.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.breakCompliance.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.breakCompliance.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.breakCompliance.drivingBreaks.heading"
          ),
          content: i18n.t(
            "complianceInfo.breakCompliance.drivingBreaks.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.breakCompliance.workingBreaks.heading"
          ),
          content: i18n.t(
            "complianceInfo.breakCompliance.workingBreaks.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.breakCompliance.important.heading"
          ),
          content: i18n.t(
            "complianceInfo.breakCompliance.important.content"
          ),
        },
      ],
    },

    dailyRest: {
      title: i18n.t("complianceInfo.dailyRest.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.dailyRest.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyRest.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyRest.requirements.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyRest.requirements.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.dailyRest.activityWindow.heading"
          ),
          content: i18n.t(
            "complianceInfo.dailyRest.activityWindow.content"
          ),
        },
      ],
    },

    nightWork: {
      title: i18n.t("complianceInfo.nightWork.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.nightWork.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.nightWork.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.nightWork.definition.heading"
          ),
          content: i18n.t(
            "complianceInfo.nightWork.definition.content"
          ),
        },
        {
          heading: i18n.t("complianceInfo.nightWork.limit.heading"),
          content: i18n.t("complianceInfo.nightWork.limit.content"),
        },
      ],
    },

    weeklyWorking: {
      title: i18n.t("complianceInfo.weeklyWorking.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.weeklyWorking.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyWorking.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyWorking.limits.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyWorking.limits.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyWorking.calculation.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyWorking.calculation.content"
          ),
        },
      ],
    },

    weeklyDriving: {
      title: i18n.t("complianceInfo.weeklyDriving.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.weeklyDriving.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyDriving.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyDriving.limits.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyDriving.limits.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyDriving.example.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyDriving.example.content"
          ),
        },
      ],
    },

    weeklyRest: {
      title: i18n.t("complianceInfo.weeklyRest.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.weeklyRest.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyRest.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyRest.requirements.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyRest.requirements.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyRest.compensation.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyRest.compensation.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyRest.whereRest.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyRest.whereRest.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.weeklyRest.daysCovered.heading"
          ),
          content: i18n.t(
            "complianceInfo.weeklyRest.daysCovered.content"
          ),
        },
      ],
    },

    restCompensation: {
      title: i18n.t("complianceInfo.restCompensation.title"),
      sections: [
        {
          heading: i18n.t(
            "complianceInfo.restCompensation.legalBasis.heading"
          ),
          content: i18n.t(
            "complianceInfo.restCompensation.legalBasis.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.restCompensation.whenRequired.heading"
          ),
          content: i18n.t(
            "complianceInfo.restCompensation.whenRequired.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.restCompensation.rules.heading"
          ),
          content: i18n.t(
            "complianceInfo.restCompensation.rules.content"
          ),
        },
        {
          heading: i18n.t(
            "complianceInfo.restCompensation.display.heading"
          ),
          content: i18n.t(
            "complianceInfo.restCompensation.display.content"
          ),
        },
      ],
    },
  };

  return infoMap[cardType];
};
