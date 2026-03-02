"use client";

import { LLMToggle } from "./LLMToggle";

interface HeaderProps {
  llmMode: boolean;
  onToggleLLM: () => void;
  onBackToLanding?: () => void;
}

export function Header({ llmMode, onToggleLLM, onBackToLanding }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 glass-nav">
      <button
        onClick={onBackToLanding}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <img
          src="/omix_logo_rect.png"
          alt="OMIX"
          className="h-8 object-contain"
        />
        <div className="text-left">
          <h1 className="text-lg font-semibold text-slate-800">OMIX Agents</h1>
          <p className="text-xs text-slate-500">Pavement Engineering Intelligence</p>
        </div>
      </button>
      <LLMToggle enabled={llmMode} onToggle={onToggleLLM} />
    </header>
  );
}
