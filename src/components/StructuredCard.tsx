"use client";

import { StructuredData } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface StructuredCardProps {
  data: StructuredData;
}

export function StructuredCard({ data }: StructuredCardProps) {
  return (
    <div className="mt-3 rounded-lg glass-card overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-200/50 bg-white/40">
        <h3 className="text-sm font-medium text-slate-700">{data.title}</h3>
      </div>
      <div className="p-4">{renderContent(data)}</div>
    </div>
  );
}

function renderContent(data: StructuredData) {
  switch (data.type) {
    case "table":
      return <TableView headers={data.headers} rows={data.rows} />;
    case "key-value":
      return <KeyValueView entries={data.entries} />;
    case "timeline":
      return <TimelineView steps={data.steps} />;
    case "compliance":
      return <ComplianceView checks={data.checks} />;
    case "comparison":
      return <ComparisonView parameters={data.parameters} mixes={data.mixes} />;
  }
}

function TableView({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 px-2 text-slate-500 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-2 text-slate-700">
                  {cell.toUpperCase() === "FAIL" ? (
                    <StatusBadge status="fail" label={cell} />
                  ) : cell.toUpperCase() === "PASS" ? (
                    <StatusBadge status="pass" label={cell} />
                  ) : cell === "maintenance" ? (
                    <StatusBadge status="warning" label={cell} />
                  ) : cell === "operational" ? (
                    <StatusBadge status="pass" label={cell} />
                  ) : cell === "OVERDUE" ? (
                    <StatusBadge status="fail" label={cell} />
                  ) : cell === "rejected" ? (
                    <StatusBadge status="fail" label={cell} />
                  ) : cell === "approved" ? (
                    <StatusBadge status="pass" label={cell} />
                  ) : cell === "pending_review" ? (
                    <StatusBadge status="warning" label={cell} />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KeyValueView({
  entries,
}: {
  entries: { key: string; value: string; status?: "pass" | "fail" | "warning" }[];
}) {
  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div key={e.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
          <span className="text-xs text-slate-500">{e.key}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700">{e.value}</span>
            {e.status && <StatusBadge status={e.status} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineView({
  steps,
}: {
  steps: { day: string; task: string; equipment: string; status?: string }[];
}) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 ${
                step.status?.startsWith("BLOCKED")
                  ? "border-red-400 bg-red-100"
                  : "border-cyan-500 bg-cyan-100"
              }`}
            />
            {i < steps.length - 1 && <div className="w-px h-full bg-slate-200 mt-1" />}
          </div>
          <div className="pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700">{step.day}</span>
              {step.status?.startsWith("BLOCKED") && (
                <StatusBadge status="fail" label="Blocked" />
              )}
            </div>
            <p className="text-xs text-slate-700 mt-0.5">{step.task}</p>
            <p className="text-xs text-slate-400">{step.equipment}</p>
            {step.status?.startsWith("BLOCKED") && (
              <p className="text-xs text-red-500 mt-0.5">{step.status}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplianceView({
  checks,
}: {
  checks: { parameter: string; value: string; spec: string; result: "pass" | "fail" | "warning" }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-2 text-slate-500 font-medium">Parameter</th>
            <th className="text-left py-2 px-2 text-slate-500 font-medium">Value</th>
            <th className="text-left py-2 px-2 text-slate-500 font-medium">Specification</th>
            <th className="text-left py-2 px-2 text-slate-500 font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="py-2 px-2 text-slate-700">{c.parameter}</td>
              <td className="py-2 px-2 text-slate-800 font-mono">{c.value}</td>
              <td className="py-2 px-2 text-slate-500">{c.spec}</td>
              <td className="py-2 px-2">
                <StatusBadge status={c.result} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonView({
  parameters,
  mixes,
}: {
  parameters: string[];
  mixes: { name: string; values: string[] }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-2 text-slate-500 font-medium">Parameter</th>
            {mixes.map((m) => (
              <th key={m.name} className="text-left py-2 px-2 text-slate-500 font-medium">
                {m.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, i) => {
            const values = mixes.map((m) => m.values[i]);
            const different = new Set(values).size > 1;
            return (
              <tr
                key={param}
                className={`border-b border-slate-100 last:border-0 ${different ? "bg-amber-50/60" : ""}`}
              >
                <td className="py-2 px-2 text-slate-500">{param}</td>
                {mixes.map((m) => (
                  <td key={m.name} className="py-2 px-2 text-slate-800 font-mono">
                    {m.values[i]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
