# OMIX Agents — Public Demo

Demonstration of AI agent concepts for **pavement engineering** and **infrastructure workflows**. This is a clean, open-source portfolio project showcasing how domain-specific agents can automate mix design review, lab operations scheduling, and quality control validation.

## Why OMIX?

Pavement engineering labs generate mountains of data — mix designs, test results, equipment logs — but engineers still spend hours manually cross-referencing specs, scheduling tests, and chasing down failures. OMIX Agents demonstrate how purpose-built AI agents can automate these workflows, making lab operations faster, more accurate, and fully auditable.

## What's Included

- **3 Specialized Agents** — Mix Design, Lab Operations, and QA/QC, each with deterministic keyword-matching logic
- **Synthetic Data** — 7 mix designs, 18 lab test records, and 10 equipment assets (no real/proprietary data)
- **Interactive Chat UI** — Next.js app with agent selection, structured data rendering, and follow-up suggestions
- **Fully Offline** — No LLM API calls required; runs entirely on local deterministic logic
- **LLM Toggle** — Visual placeholder showing where LLM integration would plug in

## What's NOT Included

- Real production models or proprietary algorithms
- Actual project data or client information
- Production infrastructure or deployment configs
- LLM API integrations (this demo uses deterministic logic only)

## Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Scenarios

### Mix Design Agent
```
Show me the details for mix MX-2024-001
Compare MX-2024-001 vs MX-2024-004
Check Superpave compliance for MX-2024-005
```

### Lab Operations Agent
```
Create a test plan for mix MX-2024-003
Which equipment has calibration due soon?
Show lab utilization report
```

### QA/QC Agent
```
Show all test failures
Quality summary for mix MX-2024-004
Validate all test results for project I-35 Overlay
```

## Architecture

```
Presentation (React)  →  API Route  →  Agent Layer  →  Synthetic JSON Data
    ChatLayout              POST          3 Agents         mixes.json
    Sidebar              /api/agent     + query.ts         tests.json
    ChatPanel                                              assets.json
    StructuredCard
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture description and [docs/architecture-diagram.svg](docs/architecture-diagram.svg) for the visual diagram.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- No external dependencies beyond React/Next.js

## Roadmap

- LLM integration layer (Claude/GPT) for natural language understanding
- Additional agents: Field QC, Production Monitoring
- Real-time data streaming via WebSockets
- Export reports as PDF

## License

MIT — see [LICENSE](LICENSE).
