"use client";

import { AgentName } from "@/lib/types";
import { AGENT_META } from "@/lib/constants";

interface AgentCardProps {
  agent: AgentName;
  selected: boolean;
  onClick: () => void;
}

const colorMap: Record<string, { border: string; bg: string; text: string; ring: string; leftBorder: string }> = {
  purple: {
    border: "border-purple-300/50",
    bg: "bg-purple-50/60",
    text: "text-purple-700",
    ring: "ring-purple-400/40",
    leftBorder: "border-l-purple-500",
  },
  cyan: {
    border: "border-cyan-300/50",
    bg: "bg-cyan-50/60",
    text: "text-cyan-700",
    ring: "ring-cyan-400/40",
    leftBorder: "border-l-cyan-600",
  },
  green: {
    border: "border-green-300/50",
    bg: "bg-green-50/60",
    text: "text-green-700",
    ring: "ring-green-400/40",
    leftBorder: "border-l-green-500",
  },
};

export function AgentCard({ agent, selected, onClick }: AgentCardProps) {
  const meta = AGENT_META[agent];
  const colors = colorMap[meta.color] || colorMap.purple;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all border-l-4 ${
        selected
          ? `${colors.border} ${colors.bg} ring-1 ${colors.ring} ${colors.leftBorder}`
          : `border-slate-200/50 ${colors.leftBorder} hover:bg-white/60 glass-card`
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <svg
          className={`w-4 h-4 ${selected ? colors.text : "text-slate-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
        </svg>
        <span className={`text-sm font-medium ${selected ? colors.text : "text-slate-700"}`}>
          {meta.label}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{meta.description}</p>
    </button>
  );
}
