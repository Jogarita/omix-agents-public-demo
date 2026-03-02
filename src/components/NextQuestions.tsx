"use client";

interface NextQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function NextQuestions({ questions, onSelect }: NextQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-white/70 transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
