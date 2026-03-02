import { AgentResponse, LabTest, MixDesign, StructuredData } from "../types";
import { findById, queryData, groupBy, searchData } from "../query";
import { SPEC_LIMITS } from "../constants";
import mixes from "@/data/mixes.json";
import tests from "@/data/tests.json";

const mixData = mixes as MixDesign[];
const testData = tests as LabTest[];

type Intent = "validate" | "failures" | "summary" | "trend";

function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  if (q.includes("validate") || q.includes("check result")) return "validate";
  if (q.includes("failure") || q.includes("failed") || q.includes("fail")) return "failures";
  if (q.includes("trend") || q.includes("history")) return "trend";
  return "summary";
}

function extractMixIds(query: string): string[] {
  const matches = query.match(/MX-\d{4}-\d{3}/gi) || [];
  return matches.map((m) => m.toUpperCase());
}

function validateTest(t: LabTest): { result: "pass" | "fail"; spec: string } {
  switch (t.test_type) {
    case "Hamburg Wheel Track":
      return {
        result: t.result_value <= SPEC_LIMITS.hamburg.max ? "pass" : "fail",
        spec: `≤ ${SPEC_LIMITS.hamburg.max} mm`,
      };
    case "IDEAL-CT":
      return {
        result: t.result_value >= SPEC_LIMITS.idealCt.min ? "pass" : "fail",
        spec: `≥ ${SPEC_LIMITS.idealCt.min} CTindex`,
      };
    case "TSR":
      return {
        result: t.result_value >= SPEC_LIMITS.tsr.min ? "pass" : "fail",
        spec: `≥ ${SPEC_LIMITS.tsr.min}%`,
      };
    case "DSR":
      return {
        result: t.result_value >= SPEC_LIMITS.dsr.min ? "pass" : "fail",
        spec: `≥ ${SPEC_LIMITS.dsr.min} kPa`,
      };
    default:
      return { result: t.pass_fail, spec: "N/A" };
  }
}

export function qaqcAgent(query: string): AgentResponse {
  const intent = detectIntent(query);
  const ids = extractMixIds(query);

  switch (intent) {
    case "validate": {
      // Validate for a specific project or mix
      let relevantTests = testData;
      const q = query.toLowerCase();

      if (ids.length > 0) {
        relevantTests = queryData(testData, { mix_id: ids[0] } );
      } else {
        // Search by project name
        const projectMatches = mixData.filter((m) =>
          q.includes(m.project.toLowerCase())
        );
        if (projectMatches.length > 0) {
          const projectMixIds = projectMatches.map((m) => m.id);
          relevantTests = testData.filter((t) => projectMixIds.includes(t.mix_id));
        }
      }

      if (relevantTests.length === 0) {
        return {
          humanResponse: "No test results found for the specified criteria. Try specifying a mix ID or project name.",
          structuredData: null,
          nextQuestions: ["Show all test failures", "Quality summary for mix MX-2024-004"],
        };
      }

      const validated = relevantTests.map((t) => {
        const v = validateTest(t);
        return { ...t, validatedResult: v.result, spec: v.spec };
      });

      const failures = validated.filter((v) => v.validatedResult === "fail");

      return {
        humanResponse: `Validated ${validated.length} test results. ${validated.length - failures.length} passed, ${failures.length} failed. ${failures.length > 0 ? `Failures: ${failures.map((f) => `${f.test_type} for ${f.mix_id}`).join(", ")}.` : "All results within specification."}`,
        structuredData: {
          type: "compliance",
          title: "Test Result Validation",
          checks: validated.map((v) => ({
            parameter: `${v.test_type} (${v.mix_id})`,
            value: `${v.result_value} ${v.result_unit}`,
            spec: v.spec,
            result: v.validatedResult,
          })),
        },
        nextQuestions: [
          "Show all test failures",
          ids[0] ? `Show me the details for ${ids[0]}` : "Quality summary for mix MX-2024-005",
          "Show lab utilization report",
        ],
      };
    }

    case "failures": {
      const failures = testData.filter((t) => t.pass_fail === "fail");

      if (failures.length === 0) {
        return {
          humanResponse: "No test failures found in the database. All recorded tests have passed.",
          structuredData: null,
          nextQuestions: ["Quality summary for mix MX-2024-004", "Validate all test results for project I-35 Overlay"],
        };
      }

      const byMix = groupBy(failures, "mix_id");

      return {
        humanResponse: `Found ${failures.length} test failure(s) across ${Object.keys(byMix).length} mix(es). Most affected: ${Object.entries(byMix).map(([id, tests]) => `${id} (${tests.length} failures)`).join(", ")}. Primary issues: ${failures.map((f) => f.test_type).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.`,
        structuredData: {
          type: "table",
          title: "Test Failures",
          headers: ["Test ID", "Mix ID", "Test Type", "Result", "Threshold", "Date", "Notes"],
          rows: failures.map((f) => [
            f.id,
            f.mix_id,
            f.test_type,
            `${f.result_value} ${f.result_unit}`,
            f.pass_threshold ? `${f.pass_threshold} ${f.result_unit}` : "N/A",
            f.test_date,
            f.notes,
          ]),
        },
        nextQuestions: [
          `Quality summary for mix ${Object.keys(byMix)[0]}`,
          `Check Superpave compliance for ${Object.keys(byMix)[0]}`,
          "Validate all test results for project I-35 Overlay",
        ],
      };
    }

    case "summary": {
      let relevantTests = testData;
      let scopeLabel = "all mixes";

      if (ids.length > 0) {
        relevantTests = queryData(testData, { mix_id: ids[0] } );
        const mix = findById(mixData, ids[0]);
        scopeLabel = mix ? `${mix.name} (${mix.id})` : ids[0];
      } else {
        // Search by project
        const q = query.toLowerCase();
        const projectMatches = mixData.filter((m) => q.includes(m.project.toLowerCase()));
        if (projectMatches.length > 0) {
          const projectMixIds = projectMatches.map((m) => m.id);
          relevantTests = testData.filter((t) => projectMixIds.includes(t.mix_id));
          scopeLabel = `project "${projectMatches[0].project}"`;
        }
      }

      const passed = relevantTests.filter((t) => t.pass_fail === "pass").length;
      const failed = relevantTests.filter((t) => t.pass_fail === "fail").length;
      const total = relevantTests.length;
      const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

      const byType = groupBy(relevantTests, "test_type");

      return {
        humanResponse: `Quality summary for ${scopeLabel}: ${total} tests recorded, ${passed} passed, ${failed} failed (${passRate}% pass rate). ${failed > 0 ? "Attention needed on failing test types." : "All results within specification."}`,
        structuredData: {
          type: "key-value",
          title: `Quality Summary — ${scopeLabel}`,
          entries: [
            { key: "Total Tests", value: `${total}` },
            { key: "Passed", value: `${passed}`, status: "pass" },
            { key: "Failed", value: `${failed}`, status: failed > 0 ? "fail" : "pass" },
            { key: "Pass Rate", value: `${passRate}%`, status: passRate >= 90 ? "pass" : passRate >= 70 ? "warning" : "fail" },
            ...Object.entries(byType).map(([type, tests]) => ({
              key: type,
              value: `${tests.filter((t) => t.pass_fail === "pass").length}/${tests.length} passed`,
              status: (tests.some((t) => t.pass_fail === "fail") ? "fail" : "pass") as "pass" | "fail" | "warning",
            })),
          ],
        },
        nextQuestions: [
          failed > 0 ? "Show all test failures" : "Validate all test results for project I-35 Overlay",
          ids[0] ? `Check Superpave compliance for ${ids[0]}` : "Quality summary for mix MX-2024-005",
          "Show lab utilization report",
        ],
      };
    }

    case "trend": {
      const targetId = ids[0];
      if (!targetId) {
        // Search by text
        const q = query.toLowerCase();
        const matchedMixes = searchData(mixData, q);
        if (matchedMixes.length > 0) {
          const mix = matchedMixes[0];
          const mixTests = queryData(testData, { mix_id: mix.id } );
          return buildTrendResponse(mix, mixTests);
        }
        return {
          humanResponse: "Please specify a mix ID to see test history, e.g., 'Show test history for MX-2024-001'.",
          structuredData: null,
          nextQuestions: ["Show test history for MX-2024-001", "Show all test failures"],
        };
      }

      const mix = findById(mixData, targetId);
      const mixTests = queryData(testData, { mix_id: targetId } );

      if (mixTests.length === 0) {
        return {
          humanResponse: `No test results found for mix ${targetId}.`,
          structuredData: null,
          nextQuestions: ["Show all test failures", "Quality summary for mix MX-2024-004"],
        };
      }

      return buildTrendResponse(mix, mixTests);
    }
  }
}

function buildTrendResponse(mix: MixDesign | undefined, mixTests: LabTest[]): AgentResponse {
  const sorted = [...mixTests].sort((a, b) => a.test_date.localeCompare(b.test_date));
  const label = mix ? `${mix.name} (${mix.id})` : "Unknown Mix";

  return {
    humanResponse: `Test history for ${label}: ${sorted.length} tests from ${sorted[0].test_date} to ${sorted[sorted.length - 1].test_date}. ${sorted.filter((t) => t.pass_fail === "fail").length} failure(s) recorded.`,
    structuredData: {
      type: "table",
      title: `Test History — ${label}`,
      headers: ["Date", "Test Type", "Standard", "Result", "Threshold", "Pass/Fail", "Technician"],
      rows: sorted.map((t) => [
        t.test_date,
        t.test_type,
        t.standard,
        `${t.result_value} ${t.result_unit}`,
        t.pass_threshold ? `${t.pass_threshold} ${t.result_unit}` : "—",
        t.pass_fail.toUpperCase(),
        t.technician,
      ]),
    },
    nextQuestions: [
      mix ? `Quality summary for mix ${mix.id}` : "Show all test failures",
      mix ? `Check Superpave compliance for ${mix.id}` : "Quality summary for mix MX-2024-005",
      "Show all test failures",
    ],
  };
}
