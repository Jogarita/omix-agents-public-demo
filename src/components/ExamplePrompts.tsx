"use client";

interface ExamplePromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function ExamplePrompts({ prompts, onSelect }: ExamplePromptsProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Try asking</p>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="w-full text-left text-xs text-slate-500 hover:text-slate-800 bg-white/40 hover:bg-white/70 px-3 py-2 rounded-md transition-colors leading-relaxed border border-slate-200/50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
