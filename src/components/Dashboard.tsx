"use client";

import { AgentName } from "@/lib/types";
import mixesData from "@/data/mixes.json";
import testsData from "@/data/tests.json";
import assetsData from "@/data/assets.json";
import { StatusBadge } from "./StatusBadge";

interface Mix {
  id: string;
  name: string;
  binder_grade: string;
  rab_percent: number;
  status: string;
}

interface Test {
  id: string;
  mix_id: string;
  test_type: string;
  test_date: string;
  pass_fail: string;
  result_value: number;
  result_unit: string;
}

interface Asset {
  id: string;
  name: string;
  status: string;
  utilization_percent: number;
  calibration_due: string;
  last_calibration: string;
}

const mixes = mixesData as Mix[];
const tests = testsData as Test[];
const assets = assetsData as Asset[];

function statusToBadge(status: string): "pass" | "fail" | "warning" {
  if (status === "approved" || status === "operational" || status === "pass") return "pass";
  if (status === "rejected" || status === "fail") return "fail";
  return "warning";
}

interface DashboardProps {
  onAskAgent?: (agent: AgentName, query: string) => void;
}

function AskAgentButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span>Ask agent</span>
    </button>
  );
}

export function Dashboard({ onAskAgent }: DashboardProps) {
  const approvedCount = mixes.filter((m) => m.status === "approved").length;
  const pendingCount = mixes.filter((m) => m.status === "pending_review").length;
  const rejectedCount = mixes.filter((m) => m.status === "rejected").length;

  const totalTests = tests.length;
  const passCount = tests.filter((t) => t.pass_fail === "pass").length;
  const passRate = Math.round((passCount / totalTests) * 100);

  const operationalCount = assets.filter((a) => a.status === "operational").length;
  const maintenanceCount = assets.filter((a) => a.status === "maintenance").length;

  const today = new Date("2025-02-15");
  const overdueCalibrations = assets.filter((a) => new Date(a.calibration_due) < today);
  const upcomingSoon = assets.filter((a) => {
    const due = new Date(a.calibration_due);
    const soon = new Date(today);
    soon.setMonth(soon.getMonth() + 2);
    return due >= today && due <= soon;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
        {/* Mix Designs */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Mix Designs</h3>
            <span className="text-xs text-slate-400">
              {mixes.length} mixes — {approvedCount} approved, {pendingCount} pending, {rejectedCount} rejected
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">ID</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Name</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Binder</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">RAP%</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Status</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody>
                {mixes.map((m) => (
                  <tr key={m.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-2 text-slate-700 font-mono">{m.id}</td>
                    <td className="py-2 px-2 text-slate-700">{m.name}</td>
                    <td className="py-2 px-2 text-slate-600">{m.binder_grade}</td>
                    <td className="py-2 px-2 text-slate-600">{m.rab_percent}%</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={statusToBadge(m.status)} label={m.status.replace("_", " ")} />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <AskAgentButton
                        onClick={() => onAskAgent?.("mix-design", `Show me the details for mix ${m.id}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Results */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Test Results</h3>
            <span className="text-xs text-slate-400">
              {totalTests} tests — {passRate}% pass rate
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">ID</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Mix</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Type</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Result</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Status</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody>
                {tests.slice(-8).map((t) => (
                  <tr key={t.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-2 text-slate-700 font-mono">{t.id}</td>
                    <td className="py-2 px-2 text-slate-600">{t.mix_id}</td>
                    <td className="py-2 px-2 text-slate-600">{t.test_type}</td>
                    <td className="py-2 px-2 text-slate-600 font-mono">{t.result_value} {t.result_unit}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={t.pass_fail === "pass" ? "pass" : "fail"} label={t.pass_fail} />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <AskAgentButton
                        onClick={() => onAskAgent?.("qaqc", `Quality summary for mix ${t.mix_id}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Equipment Status</h3>
            <span className="text-xs text-slate-400">
              {operationalCount} operational, {maintenanceCount} in maintenance
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Name</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-2 px-2 text-slate-500 font-medium">Utilization</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-2 text-slate-700">{a.name}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={statusToBadge(a.status)} label={a.status} />
                    </td>
                    <td className="py-2 px-2 text-slate-600">{a.utilization_percent}%</td>
                    <td className="py-2 px-2 text-right">
                      <AskAgentButton
                        onClick={() => onAskAgent?.("lab-ops", `Which equipment has calibration due soon?`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calibration Alerts */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Calibration Alerts</h3>
            <span className="text-xs text-slate-400">
              {overdueCalibrations.length} overdue, {upcomingSoon.length} upcoming
            </span>
          </div>
          <div className="space-y-2">
            {overdueCalibrations.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-xs font-medium text-slate-700">{a.name}</p>
                  <p className="text-xs text-slate-500">Due: {a.calibration_due}</p>
                </div>
                <StatusBadge status="fail" label="Overdue" />
              </div>
            ))}
            {upcomingSoon.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-xs font-medium text-slate-700">{a.name}</p>
                  <p className="text-xs text-slate-500">Due: {a.calibration_due}</p>
                </div>
                <StatusBadge status="warning" label="Upcoming" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
