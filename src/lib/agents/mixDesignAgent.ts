import { AgentResponse, MixDesign, StructuredData } from "../types";
import { VMA_MIN_BY_NMAS, SPEC_LIMITS } from "../constants";
import { findById, queryData, searchData } from "../query";
import mixes from "@/data/mixes.json";

const data = mixes as MixDesign[];

type Intent = "lookup" | "list" | "compare" | "compliance" | "recommend";

function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  if (q.includes("compare") || q.includes(" vs ")) return "compare";
  if (q.includes("compliance") || q.includes("check") || q.includes("spec")) return "compliance";
  if (q.includes("recommend") || q.includes("suggest")) return "recommend";
  if (q.includes("list") || q.includes("all mix")) return "list";
  return "lookup";
}

function extractMixIds(query: string): string[] {
  const matches = query.match(/MX-\d{4}-\d{3}/gi) || [];
  return matches.map((m) => m.toUpperCase());
}

function mixSummary(m: MixDesign): string {
  return `${m.id} — ${m.name} (${m.binder_grade}, ${m.rab_percent}% RAP, status: ${m.status})`;
}

function mixKeyValue(m: MixDesign): StructuredData {
  return {
    type: "key-value",
    title: `${m.id} — ${m.name}`,
    entries: [
      { key: "Type", value: m.type },
      { key: "NMAS", value: `${m.nmas_mm} mm` },
      { key: "Binder Grade", value: m.binder_grade },
      { key: "RAP Content", value: `${m.rab_percent}%`, status: m.rab_percent > SPEC_LIMITS.rapWarning ? "warning" : "pass" },
      { key: "Design Gyrations", value: `${m.design_gyrations}` },
      { key: "Optimum AC", value: `${m.optimum_ac_percent}%` },
      { key: "Air Voids", value: `${m.design_air_voids}%` },
      { key: "VMA", value: `${m.vma}%` },
      { key: "VFA", value: `${m.vfa}%` },
      { key: "Dust/Binder", value: `${m.dust_to_binder}` },
      { key: "Gmm", value: `${m.gmm}` },
      { key: "Gmb", value: `${m.gmb}` },
      { key: "Status", value: m.status, status: m.status === "approved" ? "pass" : m.status === "rejected" ? "fail" : "warning" },
      { key: "Project", value: m.project },
      { key: "Producer", value: m.producer },
    ],
  };
}

function runCompliance(m: MixDesign): StructuredData {
  const vmaMin = VMA_MIN_BY_NMAS[m.nmas_mm] ?? 14.0;
  const checks: StructuredData & { type: "compliance" } = {
    type: "compliance",
    title: `Superpave Compliance — ${m.id}`,
    checks: [
      {
        parameter: "Air Voids",
        value: `${m.design_air_voids}%`,
        spec: `${SPEC_LIMITS.airVoids.min}–${SPEC_LIMITS.airVoids.max}%`,
        result: m.design_air_voids >= SPEC_LIMITS.airVoids.min && m.design_air_voids <= SPEC_LIMITS.airVoids.max ? "pass" : "fail",
      },
      {
        parameter: `VMA (NMAS ${m.nmas_mm}mm)`,
        value: `${m.vma}%`,
        spec: `≥ ${vmaMin}%`,
        result: m.vma >= vmaMin ? "pass" : "fail",
      },
      {
        parameter: "VFA",
        value: `${m.vfa}%`,
        spec: `${SPEC_LIMITS.vfa.min}–${SPEC_LIMITS.vfa.max}%`,
        result: m.vfa >= SPEC_LIMITS.vfa.min && m.vfa <= SPEC_LIMITS.vfa.max ? "pass" : "fail",
      },
      {
        parameter: "Dust-to-Binder",
        value: `${m.dust_to_binder}`,
        spec: `${SPEC_LIMITS.dustToBinder.min}–${SPEC_LIMITS.dustToBinder.max}`,
        result: m.dust_to_binder >= SPEC_LIMITS.dustToBinder.min && m.dust_to_binder <= SPEC_LIMITS.dustToBinder.max ? "pass" : "fail",
      },
      {
        parameter: "RAP Content",
        value: `${m.rab_percent}%`,
        spec: `≤ ${SPEC_LIMITS.rapWarning}% (advisory)`,
        result: m.rab_percent > SPEC_LIMITS.rapWarning ? "warning" : "pass",
      },
    ],
  };
  return checks;
}

export function mixDesignAgent(query: string): AgentResponse {
  const intent = detectIntent(query);
  const ids = extractMixIds(query);

  switch (intent) {
    case "lookup": {
      if (ids.length > 0) {
        const mix = findById(data, ids[0]);
        if (!mix) {
          return {
            humanResponse: `I couldn't find a mix with ID ${ids[0]}. Available IDs are: ${data.map((m) => m.id).join(", ")}.`,
            structuredData: null,
            nextQuestions: ["List all mixes", "Check Superpave compliance for MX-2024-001"],
          };
        }
        return {
          humanResponse: `Here are the details for ${mix.name} (${mix.id}). This is a ${mix.type} mix using ${mix.binder_grade} binder with ${mix.rab_percent}% RAP content. Current status: ${mix.status}.`,
          structuredData: mixKeyValue(mix),
          nextQuestions: [
            `Check Superpave compliance for ${mix.id}`,
            `Compare ${mix.id} vs MX-2024-004`,
            "List all mixes",
          ],
        };
      }
      // Search by text
      const results = searchData(data, query);
      if (results.length === 1) {
        const mix = results[0];
        return {
          humanResponse: `Found mix ${mix.name} (${mix.id}). ${mix.type} with ${mix.binder_grade} binder, ${mix.rab_percent}% RAP. Status: ${mix.status}.`,
          structuredData: mixKeyValue(mix),
          nextQuestions: [`Check Superpave compliance for ${mix.id}`, `Compare ${mix.id} vs MX-2024-001`],
        };
      }
      if (results.length > 1) {
        return {
          humanResponse: `Found ${results.length} mixes matching your query. Here's a summary.`,
          structuredData: {
            type: "table",
            title: "Search Results",
            headers: ["ID", "Name", "Binder", "RAP%", "Status"],
            rows: results.map((m) => [m.id, m.name, m.binder_grade, `${m.rab_percent}%`, m.status]),
          },
          nextQuestions: results.slice(0, 2).map((m) => `Show me details for ${m.id}`),
        };
      }
      return {
        humanResponse: "I couldn't find any mixes matching your query. Try asking for a specific mix ID or listing all mixes.",
        structuredData: null,
        nextQuestions: ["List all mixes", "Show me the details for mix MX-2024-001"],
      };
    }

    case "list": {
      // Check for status filter
      const q = query.toLowerCase();
      let filtered = data;
      if (q.includes("approved")) filtered = queryData(data, { status: "approved" });
      else if (q.includes("rejected")) filtered = queryData(data, { status: "rejected" });
      else if (q.includes("pending")) filtered = queryData(data, { status: "pending_review" });

      return {
        humanResponse: `There are ${filtered.length} mix designs in the database. ${data.filter((m) => m.status === "approved").length} approved, ${data.filter((m) => m.status === "pending_review").length} pending review, and ${data.filter((m) => m.status === "rejected").length} rejected.`,
        structuredData: {
          type: "table",
          title: "Mix Designs",
          headers: ["ID", "Name", "NMAS", "Binder", "RAP%", "Status", "Project"],
          rows: filtered.map((m) => [m.id, m.name, `${m.nmas_mm}mm`, m.binder_grade, `${m.rab_percent}%`, m.status, m.project]),
        },
        nextQuestions: [
          "Show me the details for mix MX-2024-001",
          "Check Superpave compliance for MX-2024-005",
          "Compare MX-2024-001 vs MX-2024-004",
        ],
      };
    }

    case "compare": {
      if (ids.length < 2) {
        return {
          humanResponse: "Please provide two mix IDs to compare, e.g. 'Compare MX-2024-001 vs MX-2024-004'.",
          structuredData: null,
          nextQuestions: ["Compare MX-2024-001 vs MX-2024-004", "List all mixes"],
        };
      }
      const mix1 = findById(data, ids[0]);
      const mix2 = findById(data, ids[1]);
      if (!mix1 || !mix2) {
        return {
          humanResponse: `Could not find one or both mixes. Available IDs: ${data.map((m) => m.id).join(", ")}.`,
          structuredData: null,
          nextQuestions: ["List all mixes"],
        };
      }
      const params = ["Type", "NMAS", "Binder Grade", "RAP%", "Design Gyrations", "Optimum AC%", "Air Voids%", "VMA%", "VFA%", "Dust/Binder", "Status", "Project"];
      const v1 = [mix1.type, `${mix1.nmas_mm}mm`, mix1.binder_grade, `${mix1.rab_percent}%`, `${mix1.design_gyrations}`, `${mix1.optimum_ac_percent}%`, `${mix1.design_air_voids}%`, `${mix1.vma}%`, `${mix1.vfa}%`, `${mix1.dust_to_binder}`, mix1.status, mix1.project];
      const v2 = [mix2.type, `${mix2.nmas_mm}mm`, mix2.binder_grade, `${mix2.rab_percent}%`, `${mix2.design_gyrations}`, `${mix2.optimum_ac_percent}%`, `${mix2.design_air_voids}%`, `${mix2.vma}%`, `${mix2.vfa}%`, `${mix2.dust_to_binder}`, mix2.status, mix2.project];

      return {
        humanResponse: `Comparing ${mix1.name} (${mix1.id}) with ${mix2.name} (${mix2.id}). Key differences: binder grades are ${mix1.binder_grade} vs ${mix2.binder_grade}, RAP content is ${mix1.rab_percent}% vs ${mix2.rab_percent}%.`,
        structuredData: {
          type: "comparison",
          title: `${mix1.id} vs ${mix2.id}`,
          parameters: params,
          mixes: [
            { name: `${mix1.id} (${mix1.name})`, values: v1 },
            { name: `${mix2.id} (${mix2.name})`, values: v2 },
          ],
        },
        nextQuestions: [
          `Check Superpave compliance for ${mix1.id}`,
          `Check Superpave compliance for ${mix2.id}`,
        ],
      };
    }

    case "compliance": {
      const targetId = ids[0] || "MX-2024-001";
      const mix = findById(data, targetId);
      if (!mix) {
        return {
          humanResponse: `Mix ${targetId} not found. Available IDs: ${data.map((m) => m.id).join(", ")}.`,
          structuredData: null,
          nextQuestions: ["List all mixes"],
        };
      }
      const complianceData = runCompliance(mix) as StructuredData & { type: "compliance" };
      const failures = complianceData.checks.filter((c) => c.result === "fail");
      const warnings = complianceData.checks.filter((c) => c.result === "warning");

      let summary = `Compliance check for ${mix.name} (${mix.id}): `;
      if (failures.length === 0 && warnings.length === 0) {
        summary += "All parameters meet Superpave specifications.";
      } else {
        if (failures.length > 0) summary += `${failures.length} failure(s) — ${failures.map((f) => f.parameter).join(", ")}. `;
        if (warnings.length > 0) summary += `${warnings.length} warning(s) — ${warnings.map((w) => w.parameter).join(", ")}.`;
      }

      return {
        humanResponse: summary,
        structuredData: complianceData,
        nextQuestions: [
          `Show me the details for ${mix.id}`,
          `Show all test failures`,
          "List all mixes",
        ],
      };
    }

    case "recommend": {
      // Simple rule-based recommendation
      const approved = data.filter((m) => m.status === "approved");
      const q = query.toLowerCase();
      let recommended: MixDesign[];

      if (q.includes("surface") || q.includes("wearing")) {
        recommended = approved.filter((m) => m.name.toLowerCase().includes("surface"));
      } else if (q.includes("base")) {
        recommended = approved.filter((m) => m.name.toLowerCase().includes("base"));
      } else if (q.includes("high traffic") || q.includes("heavy")) {
        recommended = approved.filter((m) => m.binder_grade.includes("76"));
      } else {
        recommended = approved;
      }

      return {
        humanResponse: `Based on your criteria, I recommend ${recommended.length} mix design(s): ${recommended.map((m) => mixSummary(m)).join("; ")}. All are currently approved and meet Superpave volumetric requirements.`,
        structuredData: {
          type: "table",
          title: "Recommended Mixes",
          headers: ["ID", "Name", "Binder", "RAP%", "Project"],
          rows: recommended.map((m) => [m.id, m.name, m.binder_grade, `${m.rab_percent}%`, m.project]),
        },
        nextQuestions: recommended.slice(0, 2).map((m) => `Show me the details for ${m.id}`),
      };
    }
  }
}
