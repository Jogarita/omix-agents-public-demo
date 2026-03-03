"use client";

export function AgentDiagram() {
  return (
    <svg
      viewBox="0 0 620 300"
      className="w-full max-w-2xl mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Drop shadow for cards */}
        <filter id="shadow" x="-4%" y="-4%" width="108%" height="116%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#94a3b8" floodOpacity="0.18" />
        </filter>

        {/* Arrow marker */}
        <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 3.5 L0 7" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
        </marker>

        {/* Orange gradient for coordinator */}
        <linearGradient id="coordGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8590c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* ── Coordinator ── */}
      <rect x="195" y="12" width="230" height="52" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      {/* Orange top accent bar */}
      <rect x="195" y="12" width="230" height="4" rx="2" fill="url(#coordGrad)" />
      <text x="310" y="46" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b" fontFamily="system-ui, sans-serif">
        OMIX Coordinator
      </text>

      {/* ── Connection lines: Coordinator → Agents ── */}
      <path d="M260 64 Q260 82, 115 96" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />
      <path d="M310 64 L310 96" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />
      <path d="M360 64 Q360 82, 505 96" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />

      {/* ── Agent: Mix Design ── */}
      <rect x="20" y="100" width="190" height="64" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      <text x="115" y="126" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" fontFamily="system-ui, sans-serif">
        Mix Design Agent
      </text>
      <text x="115" y="148" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui, sans-serif">
        Binders &middot; RAP &middot; Gradations
      </text>

      {/* ── Agent: Lab Ops ── */}
      <rect x="215" y="100" width="190" height="64" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      <text x="310" y="126" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" fontFamily="system-ui, sans-serif">
        Lab Ops Agent
      </text>
      <text x="310" y="148" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui, sans-serif">
        Equipment &middot; Calibrations
      </text>

      {/* ── Agent: QA/QC ── */}
      <rect x="410" y="100" width="190" height="64" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      <text x="505" y="126" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" fontFamily="system-ui, sans-serif">
        QA/QC Agent
      </text>
      <text x="505" y="148" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui, sans-serif">
        Tests &middot; Failures &middot; Metrics
      </text>

      {/* ── Connection lines: Agents → Data Layer ── */}
      <path d="M115 164 L115 206" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />
      <path d="M310 164 L310 206" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />
      <path d="M505 164 L505 206" stroke="#cbd5e1" strokeWidth="1.3" markerEnd="url(#arrow)" />

      {/* ── Data Layer ── */}
      <rect x="40" y="210" width="540" height="52" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
      {/* Subtle bottom accent */}
      <rect x="40" y="258" width="540" height="4" rx="2" fill="#e2e8f0" />
      <text x="310" y="238" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b" fontFamily="system-ui, sans-serif">
        Structured Engineering Data
      </text>
      <text x="310" y="254" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui, sans-serif">
        Mix designs &middot; Test results &middot; Equipment logs
      </text>
    </svg>
  );
}
