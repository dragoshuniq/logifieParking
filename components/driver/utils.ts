export type ComplianceLevel = "compliant" | "warning" | "violation";

export const getComplianceLevel = (
  value: number,
  violationThreshold: number,
  warningThreshold: number
): ComplianceLevel => {
  if (value > violationThreshold) {
    return "violation";
  }
  if (value > warningThreshold) {
    return "warning";
  }
  return "compliant";
};
