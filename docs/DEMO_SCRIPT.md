# Demo Script (5 minutes)

This walkthrough demonstrates all three OMIX agents with realistic pavement engineering scenarios.

## Setup

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Scenario 1: Mix Design Review (1.5 min)

### Step 1 — Lookup a mix
Click the **Mix Design Agent** card in the sidebar, then type:

```
Show me the details for mix MX-2024-001
```

**Expected**: Key-value card showing SP-12.5 Surface mix with PG 64-22 binder, 20% RAP, approved status. All volumetric properties listed.

### Step 2 — Compare two mixes
Click the suggested "Compare" follow-up or type:

```
Compare MX-2024-001 vs MX-2024-004
```

**Expected**: Side-by-side comparison table. Differences highlighted: PG 64-22 vs PG 76-22 binder, 20% vs 15% RAP, different design gyrations.

### Step 3 — Run compliance check
Type:

```
Check Superpave compliance for MX-2024-005
```

**Expected**: Compliance table showing MX-2024-005 (RAP-Heavy) with VMA failure (13.5% < 14.0% min for 12.5mm NMAS) and RAP warning (40% > 30% advisory threshold). This is the rejected mix.

---

## Scenario 2: Lab Operations Planning (1.5 min)

### Step 4 — Generate test plan
Click the **Lab Operations Agent** card, then type:

```
Create a test plan for mix MX-2024-003
```

**Expected**: Timeline showing 4-day test battery (Gmm → Compaction → Hamburg → IDEAL-CT → TSR). TSR step should show as **BLOCKED** because EQ-005 (TSR Conditioning System) is in maintenance.

### Step 5 — Check calibrations
Type:

```
Which equipment has calibration due soon?
```

**Expected**: Table showing overdue items (EQ-004 CoreLok, EQ-005 TSR System, EQ-007 Ignition Oven, EQ-010 Rice Gravity) and upcoming calibrations.

### Step 6 — Lab utilization
Type:

```
Show lab utilization report
```

**Expected**: Table sorted by utilization percentage. Hamburg Wheel Tracker at 85% (highest), BBR at 30% (lowest). Average utilization shown in summary.

---

## Scenario 3: Quality Control (1.5 min)

### Step 7 — View failures
Click the **QA/QC Agent** card, then type:

```
Show all test failures
```

**Expected**: Table with 3 failures, all for MX-2024-005: Hamburg (14.8mm > 12.5mm max), TSR (72% < 80% min), IDEAL-CT (62 < 80 min). Notes explain high RAP as root cause.

### Step 8 — Quality summary
Type:

```
Quality summary for mix MX-2024-004
```

**Expected**: Key-value summary for SP-12.5 PMA showing 3/3 tests passed (100% pass rate). Breakdown by test type: Hamburg, IDEAL-CT, DSR all passing.

### Step 9 — Validate by project
Type:

```
Validate all test results for project I-35 Overlay
```

**Expected**: Compliance validation of all tests for I-35 Overlay project (MX-2024-004 and MX-2024-006). All should pass with green indicators.

---

## Bonus: LLM Toggle

Toggle the **LLM Mode** switch in the header, then send any query. You'll see a placeholder response explaining where LLM integration would plug in: query understanding, intent classification, and response generation, with the deterministic agents serving as the tool/function layer.

---

## Key Talking Points

- **No LLM required** — Everything runs on deterministic logic with synthetic data
- **Realistic domain** — Superpave specs, Hamburg wheel tracking, IDEAL-CT — real pavement engineering concepts
- **Agent pattern** — Each agent is a pure function with typed inputs/outputs, composable and testable
- **LLM-ready** — Architecture is designed for easy LLM integration at the API layer
