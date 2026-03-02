"use client";

export function AgentDiagram() {
  return (
    <svg viewBox="0 0 600 260" className="w-full max-w-2xl mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coordinator box */}
      <rect x="210" y="10" width="180" height="48" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="300" y="39" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b">OMIX Coordinator</text>

      {/* Lines from coordinator to agents */}
      <line x1="255" y1="58" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="300" y1="58" x2="300" y2="100" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="345" y1="58" x2="500" y2="100" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* Mix Design Agent */}
      <rect x="20" y="100" width="160" height="48" rx="10" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" />
      <text x="100" y="129" textAnchor="middle" fontSize="12" fontWeight="600" fill="#7c3aed">Mix Design Agent</text>

      {/* Lab Ops Agent */}
      <rect x="220" y="100" width="160" height="48" rx="10" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.5" />
      <text x="300" y="129" textAnchor="middle" fontSize="12" fontWeight="600" fill="#0891b2">Lab Ops Agent</text>

      {/* QA/QC Agent */}
      <rect x="420" y="100" width="160" height="48" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
      <text x="500" y="129" textAnchor="middle" fontSize="12" fontWeight="600" fill="#16a34a">QA/QC Agent</text>

      {/* Lines from agents to data layer */}
      <line x1="100" y1="148" x2="100" y2="195" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="300" y1="148" x2="300" y2="195" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="500" y1="148" x2="500" y2="195" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* Data layer */}
      <rect x="50" y="195" width="500" height="44" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
      <text x="300" y="222" textAnchor="middle" fontSize="12" fontWeight="500" fill="#64748b">Structured Engineering Data (mixes, tests, equipment)</text>
    </svg>
  );
}
