import { AgentName } from "./types";

export const AGENT_META: Record<
  AgentName,
  { label: string; description: string; color: string; icon: string }
> = {
  "mix-design": {
    label: "Mix Design Agent",
    description: "Lookup, compare, and check compliance of Superpave HMA mix designs.",
    color: "purple",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
  },
  "lab-ops": {
    label: "Lab Operations Agent",
    description: "Schedule test plans, check equipment status, and monitor lab capacity.",
    color: "cyan",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  qaqc: {
    label: "QA/QC Agent",
    description: "Validate test results, identify failures, and generate quality summaries.",
    color: "green",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
};

export const EXAMPLE_PROMPTS: Record<AgentName, string[]> = {
  "mix-design": [
    "Show me the details for mix MX-2024-001",
    "Compare MX-2024-001 vs MX-2024-004",
    "Check Superpave compliance for MX-2024-005",
  ],
  "lab-ops": [
    "Create a test plan for mix MX-2024-003",
    "Which equipment has calibration due soon?",
    "Show lab utilization report",
  ],
  qaqc: [
    "Show all test failures",
    "Quality summary for mix MX-2024-004",
    "Validate all test results for project I-35 Overlay",
  ],
};

// Superpave VMA minimums by NMAS
export const VMA_MIN_BY_NMAS: Record<number, number> = {
  9.5: 15.0,
  12.5: 14.0,
  19.0: 13.0,
  25.0: 12.0,
};

export const SPEC_LIMITS = {
  vfa: { min: 65, max: 78 },
  airVoids: { min: 3.0, max: 5.0 },
  dustToBinder: { min: 0.6, max: 1.6 },
  rapWarning: 30,
  hamburg: { max: 12.5 },
  idealCt: { min: 80 },
  tsr: { min: 80 },
  dsr: { min: 1.0 },
};
