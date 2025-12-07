import { InfoSheetProps } from "@/constants/sheets";

export const driverDisclaimer: InfoSheetProps = {
  title: "Disclaimer",
  sections: [
    {
      heading: "Purpose of This App",
      content:
        "This app is designed as a helper tool for professional drivers. " +
        "Its main purpose is to make it easier to record and review your daily activities " +
        "and to visualise how they relate to EU driving and working-time rules.",
    },
    {
      heading: "No Official Logbook or Tachograph",
      content:
        "The data shown in the app is for information only and does NOT replace:\n" +
        "• the tachograph or tachograph printouts,\n" +
        "• official logbooks or records required by law,\n" +
        "• documentation requested by control authorities.\n" +
        "Always rely on your tachograph and official company records as the primary source of truth.",
    },
    {
      heading: "No Legal or Professional Advice",
      content:
        "The compliance calculations in this app are based on EU regulations, " +
        "but they are a simplification and may not cover every national or company-specific rule.\n\n" +
        "This app does not provide legal, tax, HR, or professional advice. " +
        "You are responsible for checking current legislation, company policies, and instructions from your employer or advisor.",
    },
    {
      heading: "Data Storage & Privacy",
      content:
        "Your activity history is stored only locally on your device in the app cache. " +
        "We do not store your data in an external database or central server.\n\n" +
        "Because data is kept in cache:\n" +
        "• It may be deleted when you clear app data, reinstall the app, or change device.\n" +
        "• We cannot restore lost data or provide you with backups.\n" +
        "If you need long-term records, use the export function and keep copies in a safe place.",
    },
    {
      heading: "User Responsibility",
      content:
        "You are always responsible for:\n" +
        "• how you plan your work and rest,\n" +
        "• how you interpret the information shown in the app,\n" +
        "• staying compliant with all applicable laws and company rules.\n\n" +
        "Treat the app as a support tool, not as a decision-maker. " +
        "In case of doubt, follow your tachograph, company instructions, and official legal guidance.",
    },
  ],
};

export const parkingDisclaimer: InfoSheetProps = {
  title: "Truck Parking - Disclaimer",
  sections: [
    {
      heading: "Source of Information",
      content:
        "Parking locations, facilities and details shown in this app come from public and third-party sources " +
        "(for example open data, public websites, user submissions or external services).\n\n" +
        "We do not operate these truck parks and we do not control the data they publish.",
    },
    {
      heading: "Accuracy & Updates",
      content:
        "We try to display useful and up-to-date information, but we cannot guarantee that it is complete, correct " +
        "or current at all times.\n\n" +
        "Examples of things that may change without notice:\n" +
        "• opening hours and access rules,\n" +
        "• prices, payment methods and reservation requirements,\n" +
        "• available services (showers, security, food, fuel, etc.),\n" +
        "• number of spaces or whether the parking is temporarily closed.",
    },
    {
      heading: "Always Verify Before You Drive",
      content:
        "Before you drive to any parking shown in the app, always verify the key details yourself by:\n" +
        "• checking the location in a navigation or map app,\n" +
        "• using other trusted third-party parking / truck apps,\n" +
        "• visiting the official website of the parking, if available,\n" +
        "• contacting the operator or host directly when contact details are provided.\n\n" +
        "Do not rely only on the information displayed in this app when planning your route, rest or security.",
    },
    {
      heading: "No Endorsement or Guarantee",
      content:
        "Listing a parking place in the app does NOT mean we recommend, inspect or guarantee it.\n\n" +
        "We do not confirm:\n" +
        "• safety or security level of the parking,\n" +
        "• availability of free spaces at any moment,\n" +
        "• compliance of the parking with legal or company requirements.",
    },
    {
      heading: "User Responsibility",
      content:
        "You are always responsible for:\n" +
        "• choosing where to stop and rest,\n" +
        "• checking that the parking is suitable for your vehicle and cargo,\n" +
        "• complying with driving/rest-time rules and all road signs and regulations.\n\n" +
        "Treat the parking map as a support tool only. Always double-check important details before you arrive.",
    },
  ],
};
