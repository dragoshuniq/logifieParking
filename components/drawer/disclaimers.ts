import { InfoSheetProps } from "@/constants/sheets";

export const driverDisclaimer: InfoSheetProps = {
  title: "Disclaimer",
  icon: "information-circle-outline",
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
