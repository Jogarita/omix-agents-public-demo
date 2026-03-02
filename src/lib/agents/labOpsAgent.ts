import { AgentResponse, LabAsset, MixDesign, StructuredData } from "../types";
import { findById, queryData } from "../query";
import mixes from "@/data/mixes.json";
import assets from "@/data/assets.json";

const mixData = mixes as MixDesign[];
const assetData = assets as LabAsset[];

type Intent = "schedule" | "equipment" | "calibration" | "utilization";

function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  if (q.includes("schedule") || q.includes("plan") || q.includes("workflow") || q.includes("test plan")) return "schedule";
  if (q.includes("calibration") || q.includes("calibrate") || q.includes("due")) return "calibration";
  if (q.includes("utilization") || q.includes("load") || q.includes("capacity")) return "utilization";
  return "equipment";
}

function extractMixIds(query: string): string[] {
  const matches = query.match(/MX-\d{4}-\d{3}/gi) || [];
  return matches.map((m) => m.toUpperCase());
}

const TEST_BATTERY = [
  { day: "Day 1", task: "Gmm Verification", equipment: "Rice Gravity Apparatus (EQ-010)", eqId: "EQ-010" },
  { day: "Day 1–2", task: "Specimen Compaction (6 pucks)", equipment: "Superpave Gyratory Compactor (EQ-001)", eqId: "EQ-001" },
  { day: "Day 2–3", task: "Hamburg Wheel Track Test", equipment: "Hamburg Wheel Tracker (EQ-002)", eqId: "EQ-002" },
  { day: "Day 3", task: "IDEAL-CT Cracking Test", equipment: "IDEAL-CT Loading Frame (EQ-003)", eqId: "EQ-003" },
  { day: "Day 3–4", task: "TSR Moisture Conditioning & Test", equipment: "TSR Conditioning System (EQ-005)", eqId: "EQ-005" },
];

export function labOpsAgent(query: string): AgentResponse {
  const intent = detectIntent(query);
  const ids = extractMixIds(query);

  switch (intent) {
    case "schedule": {
      const targetId = ids[0] || "MX-2024-001";
      const mix = findById(mixData, targetId);
      if (!mix) {
        return {
          humanResponse: `Mix ${targetId} not found. Available IDs: ${mixData.map((m) => m.id).join(", ")}.`,
          structuredData: null,
          nextQuestions: ["Create a test plan for mix MX-2024-003", "List all mixes"],
        };
      }

      const steps = TEST_BATTERY.map((step) => {
        const eq = findById(assetData, step.eqId);
        const eqStatus = eq?.status === "maintenance" ? "BLOCKED — equipment in maintenance" : "Available";
        return {
          day: step.day,
          task: step.task,
          equipment: step.equipment,
          status: eqStatus,
        };
      });

      const blocked = steps.filter((s) => s.status.startsWith("BLOCKED"));
      let summary = `Test plan generated for ${mix.name} (${mix.id}): standard 4-day battery including Gmm verification, compaction, Hamburg, IDEAL-CT, and TSR.`;
      if (blocked.length > 0) {
        summary += ` Warning: ${blocked.length} step(s) blocked due to equipment maintenance — ${blocked.map((b) => b.task).join(", ")}.`;
      }

      return {
        humanResponse: summary,
        structuredData: {
          type: "timeline",
          title: `Test Plan — ${mix.id} (${mix.name})`,
          steps,
        },
        nextQuestions: [
          "Which equipment has calibration due soon?",
          "Show lab utilization report",
          `Show me the details for ${mix.id}`,
        ],
      };
    }

    case "equipment": {
      const q = query.toLowerCase();
      let filtered = assetData;
      if (q.includes("maintenance") || q.includes("down")) {
        filtered = queryData(assetData, { status: "maintenance" } );
      } else if (q.includes("operational") || q.includes("available")) {
        filtered = queryData(assetData, { status: "operational" } );
      }

      const maintenance = assetData.filter((a) => a.status === "maintenance");

      return {
        humanResponse: `Lab has ${assetData.length} equipment items: ${assetData.filter((a) => a.status === "operational").length} operational, ${maintenance.length} in maintenance. ${maintenance.length > 0 ? `Equipment down: ${maintenance.map((a) => a.name).join(", ")}.` : "All equipment operational."}`,
        structuredData: {
          type: "table",
          title: "Lab Equipment Status",
          headers: ["ID", "Name", "Category", "Location", "Status", "Utilization"],
          rows: filtered.map((a) => [a.id, a.name, a.category, a.location, a.status, `${a.utilization_percent}%`]),
        },
        nextQuestions: [
          "Which equipment has calibration due soon?",
          "Show lab utilization report",
          "Create a test plan for mix MX-2024-003",
        ],
      };
    }

    case "calibration": {
      const today = "2025-02-27";
      const soon = "2025-04-01";

      const overdue = assetData.filter((a) => a.calibration_due < today);
      const upcoming = assetData.filter((a) => a.calibration_due >= today && a.calibration_due <= soon);
      const all = [...overdue, ...upcoming].sort((a, b) => a.calibration_due.localeCompare(b.calibration_due));

      let summary = "";
      if (overdue.length > 0) {
        summary += `${overdue.length} equipment item(s) have OVERDUE calibration: ${overdue.map((a) => `${a.name} (due ${a.calibration_due})`).join(", ")}. `;
      }
      if (upcoming.length > 0) {
        summary += `${upcoming.length} item(s) have calibration due within the next month: ${upcoming.map((a) => `${a.name} (due ${a.calibration_due})`).join(", ")}.`;
      }
      if (overdue.length === 0 && upcoming.length === 0) {
        summary = "No calibrations are overdue or due soon.";
      }

      return {
        humanResponse: summary,
        structuredData: {
          type: "table",
          title: "Calibration Status",
          headers: ["ID", "Equipment", "Last Calibration", "Due Date", "Status"],
          rows: all.map((a) => [
            a.id,
            a.name,
            a.last_calibration,
            a.calibration_due,
            a.calibration_due < today ? "OVERDUE" : "Upcoming",
          ]),
        },
        nextQuestions: [
          "Show all equipment status",
          "Show lab utilization report",
          "Create a test plan for mix MX-2024-003",
        ],
      };
    }

    case "utilization": {
      const avgUtil = Math.round(assetData.reduce((sum, a) => sum + a.utilization_percent, 0) / assetData.length);
      const highUtil = assetData.filter((a) => a.utilization_percent >= 70);
      const lowUtil = assetData.filter((a) => a.utilization_percent < 40);

      return {
        humanResponse: `Lab average utilization is ${avgUtil}%. ${highUtil.length} equipment item(s) running at high utilization (≥70%): ${highUtil.map((a) => `${a.name} at ${a.utilization_percent}%`).join(", ")}. ${lowUtil.length} item(s) at low utilization (<40%).`,
        structuredData: {
          type: "table",
          title: "Lab Utilization Report",
          headers: ["Equipment", "Category", "Daily Capacity", "Utilization", "Status"],
          rows: assetData
            .sort((a, b) => b.utilization_percent - a.utilization_percent)
            .map((a) => [a.name, a.category, `${a.daily_capacity} tests/day`, `${a.utilization_percent}%`, a.status]),
        },
        nextQuestions: [
          "Which equipment has calibration due soon?",
          "Show all equipment status",
          "Create a test plan for mix MX-2024-001",
        ],
      };
    }
  }
}
