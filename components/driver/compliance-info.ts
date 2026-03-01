import { InfoSheetProps } from "@/constants/sheets";

export const getComplianceInfo = (
  cardType: string
): InfoSheetProps | undefined => {
  const infoMap: Record<string, InfoSheetProps> = {
    dailyDriving: {
      title: "complianceInfo.dailyDriving.title",
      sections: [
        {
          heading: "complianceInfo.dailyDriving.legalBasis.heading",
          content: "complianceInfo.dailyDriving.legalBasis.content",
        },
        {
          heading: "complianceInfo.dailyDriving.rules.heading",
          content: "complianceInfo.dailyDriving.rules.content",
        },
        {
          heading: "complianceInfo.dailyDriving.example.heading",
          content: "complianceInfo.dailyDriving.example.content",
        },
      ],
    },
    dailyWorking: {
      title: "complianceInfo.dailyWorking.title",
      sections: [
        {
          heading: "complianceInfo.dailyWorking.legalBasis.heading",
          content: "complianceInfo.dailyWorking.legalBasis.content",
        },
        {
          heading: "complianceInfo.dailyWorking.whatCounts.heading",
          content: "complianceInfo.dailyWorking.whatCounts.content",
        },
        {
          heading: "complianceInfo.dailyWorking.dailyLimits.heading",
          content: "complianceInfo.dailyWorking.dailyLimits.content",
        },
      ],
    },
    breakCompliance: {
      title: "complianceInfo.breakCompliance.title",
      sections: [
        {
          heading: "complianceInfo.breakCompliance.legalBasis.heading",
          content: "complianceInfo.breakCompliance.legalBasis.content",
        },
        {
          heading: "complianceInfo.breakCompliance.drivingBreaks.heading",
          content: "complianceInfo.breakCompliance.drivingBreaks.content",
        },
        {
          heading: "complianceInfo.breakCompliance.workingBreaks.heading",
          content: "complianceInfo.breakCompliance.workingBreaks.content",
        },
        {
          heading: "complianceInfo.breakCompliance.important.heading",
          content: "complianceInfo.breakCompliance.important.content",
        },
      ],
    },
    dailyRest: {
      title: "complianceInfo.dailyRest.title",
      sections: [
        {
          heading: "complianceInfo.dailyRest.legalBasis.heading",
          content: "complianceInfo.dailyRest.legalBasis.content",
        },
        {
          heading: "complianceInfo.dailyRest.requirements.heading",
          content: "complianceInfo.dailyRest.requirements.content",
        },
        {
          heading: "complianceInfo.dailyRest.activityWindow.heading",
          content: "complianceInfo.dailyRest.activityWindow.content",
        },
      ],
    },
    nightWork: {
      title: "complianceInfo.nightWork.title",
      sections: [
        {
          heading: "complianceInfo.nightWork.legalBasis.heading",
          content: "complianceInfo.nightWork.legalBasis.content",
        },
        {
          heading: "complianceInfo.nightWork.definition.heading",
          content: "complianceInfo.nightWork.definition.content",
        },
        {
          heading: "complianceInfo.nightWork.limit.heading",
          content: "complianceInfo.nightWork.limit.content",
        },
      ],
    },
    weeklyWorking: {
      title: "complianceInfo.weeklyWorking.title",
      sections: [
        {
          heading: "complianceInfo.weeklyWorking.legalBasis.heading",
          content: "complianceInfo.weeklyWorking.legalBasis.content",
        },
        {
          heading: "complianceInfo.weeklyWorking.limits.heading",
          content: "complianceInfo.weeklyWorking.limits.content",
        },
        {
          heading: "complianceInfo.weeklyWorking.calculation.heading",
          content: "complianceInfo.weeklyWorking.calculation.content",
        },
      ],
    },
    weeklyDriving: {
      title: "complianceInfo.weeklyDriving.title",
      sections: [
        {
          heading: "complianceInfo.weeklyDriving.legalBasis.heading",
          content: "complianceInfo.weeklyDriving.legalBasis.content",
        },
        {
          heading: "complianceInfo.weeklyDriving.limits.heading",
          content: "complianceInfo.weeklyDriving.limits.content",
        },
        {
          heading: "complianceInfo.weeklyDriving.example.heading",
          content: "complianceInfo.weeklyDriving.example.content",
        },
      ],
    },
    weeklyRest: {
      title: "complianceInfo.weeklyRest.title",
      sections: [
        {
          heading: "complianceInfo.weeklyRest.legalBasis.heading",
          content: "complianceInfo.weeklyRest.legalBasis.content",
        },
        {
          heading: "complianceInfo.weeklyRest.requirements.heading",
          content: "complianceInfo.weeklyRest.requirements.content",
        },
        {
          heading: "complianceInfo.weeklyRest.compensation.heading",
          content: "complianceInfo.weeklyRest.compensation.content",
        },
        {
          heading: "complianceInfo.weeklyRest.whereRest.heading",
          content: "complianceInfo.weeklyRest.whereRest.content",
        },
        {
          heading: "complianceInfo.weeklyRest.daysCovered.heading",
          content: "complianceInfo.weeklyRest.daysCovered.content",
        },
      ],
    },
    restCompensation: {
      title: "complianceInfo.restCompensation.title",
      sections: [
        {
          heading: "complianceInfo.restCompensation.legalBasis.heading",
          content: "complianceInfo.restCompensation.legalBasis.content",
        },
        {
          heading: "complianceInfo.restCompensation.whenRequired.heading",
          content: "complianceInfo.restCompensation.whenRequired.content",
        },
        {
          heading: "complianceInfo.restCompensation.rules.heading",
          content: "complianceInfo.restCompensation.rules.content",
        },
        {
          heading: "complianceInfo.restCompensation.display.heading",
          content: "complianceInfo.restCompensation.display.content",
        },
      ],
    },
  };
  return infoMap[cardType];
};
