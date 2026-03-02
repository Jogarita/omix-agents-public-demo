"use client";

interface LLMToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function LLMToggle({ enabled, onToggle }: LLMToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500">Deterministic</span>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-purple-500" : "bg-slate-300"
        }`}
        aria-label="Toggle LLM mode"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-xs text-slate-500">LLM Mode</span>
    </div>
  );
}
