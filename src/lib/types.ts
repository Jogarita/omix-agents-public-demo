// --- Data types ---

export interface MixDesign {
  id: string;
  name: string;
  type: string;
  nmas_mm: number;
  binder_grade: string;
  rab_percent: number;
  design_gyrations: number;
  optimum_ac_percent: number;
  design_air_voids: number;
  vma: number;
  vfa: number;
  dust_to_binder: number;
  gmm: number;
  gmb: number;
  status: "approved" | "pending_review" | "rejected";
  project: string;
  producer: string;
  approved_date: string | null;
  gradation: Record<string, number>;
}

export interface LabTest {
  id: string;
  mix_id: string;
  test_type: string;
  standard: string;
  test_date: string;
  technician: string;
  specimen_air_voids: number | null;
  result_value: number;
  result_unit: string;
  pass_threshold: number | null;
  pass_fail: "pass" | "fail";
  cycles_completed: number | null;
  notes: string;
}

export interface LabAsset {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "operational" | "maintenance";
  last_calibration: string;
  calibration_due: string;
  tests_supported: string[];
  daily_capacity: number;
  utilization_percent: number;
}

// --- Agent types ---

export type AgentName = "mix-design" | "lab-ops" | "qaqc";

export interface AgentResponse {
  humanResponse: string;
  structuredData: StructuredData | null;
  nextQuestions: string[];
}

export type StructuredData =
  | { type: "table"; title: string; headers: string[]; rows: string[][] }
  | { type: "key-value"; title: string; entries: { key: string; value: string; status?: "pass" | "fail" | "warning" }[] }
  | { type: "timeline"; title: string; steps: { day: string; task: string; equipment: string; status?: string }[] }
  | { type: "compliance"; title: string; checks: { parameter: string; value: string; spec: string; result: "pass" | "fail" | "warning" }[] }
  | { type: "comparison"; title: string; parameters: string[]; mixes: { name: string; values: string[] }[] };

// --- Message types ---

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  structuredData?: StructuredData | null;
  nextQuestions?: string[];
  timestamp: Date;
}

// --- API types ---

export interface AgentRequest {
  agent: AgentName;
  query: string;
  llmMode?: boolean;
}
