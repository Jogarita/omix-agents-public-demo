"use client";

import { AgentName } from "@/lib/types";
import { EXAMPLE_PROMPTS } from "@/lib/constants";
import { AgentCard } from "./AgentCard";
import { ExamplePrompts } from "./ExamplePrompts";

interface SidebarProps {
  selectedAgent: AgentName;
  onSelectAgent: (agent: AgentName) => void;
  onSelectPrompt: (prompt: string) => void;
}

const agents: AgentName[] = ["mix-design", "lab-ops", "qaqc"];

export function Sidebar({ selectedAgent, onSelectAgent, onSelectPrompt }: SidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 glass-sidebar flex flex-col">
      <div className="p-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">Agents</p>
        {agents.map((agent) => (
          <AgentCard
            key={agent}
            agent={agent}
            selected={selectedAgent === agent}
            onClick={() => onSelectAgent(agent)}
          />
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-slate-200/50">
        <ExamplePrompts
          prompts={EXAMPLE_PROMPTS[selectedAgent]}
          onSelect={onSelectPrompt}
        />
      </div>
    </aside>
  );
}
