"use client";

import { AgentDiagram } from "./AgentDiagram";
import { Footer } from "./Footer";

interface LandingPageProps {
  onEnterDemo: () => void;
}

const agents = [
  {
    name: "Mix Design",
    color: "#7c3aed",
    bg: "bg-purple-50",
    description: "Look up mix designs, compare binder grades, and check RAP content",
  },
  {
    name: "Lab Ops",
    color: "#0891b2",
    bg: "bg-cyan-50",
    description: "Track equipment status, schedule calibrations, and monitor utilization",
  },
  {
    name: "QA/QC",
    color: "#16a34a",
    bg: "bg-green-50",
    description: "Review test results, flag failures, and summarize quality metrics",
  },
];

export function LandingPage({ onEnterDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-3xl w-full space-y-10">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/omix_logo_rect.png"
              alt="OMIX"
              className="h-20 object-contain"
            />
          </div>

          {/* Tagline */}
          <p className="text-center text-lg text-slate-600 font-medium">
            AI-native workflows for pavement and infrastructure decision-making
          </p>

          {/* Project description */}
          <p className="text-center text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            OMIX Agents coordinate domain-specific AI workflows across mix design,
            lab operations, and quality assurance — replacing fragmented spreadsheets
            with structured, agent-driven decision support.
          </p>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={onEnterDemo}
              aria-label="Enter the OMIX Agents demo"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#e8590c] to-[#f97316] text-white font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Enter Demo
            </button>
          </div>

          {/* Orange accent stripe */}
          <div className="h-1 rounded-full bg-gradient-to-r from-[#e8590c] to-[#f97316]" />

          {/* 3 Agent Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className={`${agent.bg} rounded-xl p-5 border border-slate-200`}
                style={{ borderTop: `3px solid ${agent.color}` }}
              >
                <h3
                  className="text-sm font-semibold mb-1"
                  style={{ color: agent.color }}
                >
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>

          {/* Agent diagram */}
          <AgentDiagram />

          {/* Disclaimer */}
          <p className="text-center text-xs text-slate-400">
            Public prototype — synthetic data only
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
