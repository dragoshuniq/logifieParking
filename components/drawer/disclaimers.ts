import { InfoSheetProps } from "@/constants/sheets";
import i18n from "@/providers/i18n";

export const driverDisclaimer: InfoSheetProps = {
  title: i18n.t("disclaimers.driver.title"),
  sections: [
    {
      heading: i18n.t("disclaimers.driver.purpose.heading"),
      content: i18n.t("disclaimers.driver.purpose.content"),
    },
    {
      heading: i18n.t("disclaimers.driver.noOfficialLogbook.heading"),
      content: i18n.t("disclaimers.driver.noOfficialLogbook.content"),
    },
    {
      heading: i18n.t("disclaimers.driver.noLegalAdvice.heading"),
      content: i18n.t("disclaimers.driver.noLegalAdvice.content"),
    },
    {
      heading: i18n.t("disclaimers.driver.dataStorage.heading"),
      content: i18n.t("disclaimers.driver.dataStorage.content"),
    },
    {
      heading: i18n.t(
        "disclaimers.driver.userResponsibility.heading"
      ),
      content: i18n.t(
        "disclaimers.driver.userResponsibility.content"
      ),
    },
  ],
};

export const parkingDisclaimer: InfoSheetProps = {
  title: i18n.t("disclaimers.parking.title"),
  sections: [
    {
      heading: i18n.t("disclaimers.parking.sourceInfo.heading"),
      content: i18n.t("disclaimers.parking.sourceInfo.content"),
    },
    {
      heading: i18n.t("disclaimers.parking.accuracy.heading"),
      content: i18n.t("disclaimers.parking.accuracy.content"),
    },
    {
      heading: i18n.t("disclaimers.parking.verifyBefore.heading"),
      content: i18n.t("disclaimers.parking.verifyBefore.content"),
    },
    {
      heading: i18n.t("disclaimers.parking.noEndorsement.heading"),
      content: i18n.t("disclaimers.parking.noEndorsement.content"),
    },
    {
      heading: i18n.t(
        "disclaimers.parking.userResponsibility.heading"
      ),
      content: i18n.t(
        "disclaimers.parking.userResponsibility.content"
      ),
    },
  ],
};

export const fuelPricesDisclaimer: InfoSheetProps = {
  title: i18n.t("disclaimers.fuel.title"),
  sections: [
    {
      heading: i18n.t("disclaimers.fuel.sourceData.heading"),
      content: i18n.t("disclaimers.fuel.sourceData.content"),
    },
    {
      heading: i18n.t("disclaimers.fuel.accuracy.heading"),
      content: i18n.t("disclaimers.fuel.accuracy.content"),
    },
    {
      heading: i18n.t("disclaimers.fuel.howToUse.heading"),
      content: i18n.t("disclaimers.fuel.howToUse.content"),
    },
  ],
};
