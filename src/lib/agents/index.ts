import { AgentName, AgentResponse } from "../types";
import { mixDesignAgent } from "./mixDesignAgent";
import { labOpsAgent } from "./labOpsAgent";
import { qaqcAgent } from "./qaqcAgent";

const agentRegistry: Record<AgentName, (query: string) => AgentResponse> = {
  "mix-design": mixDesignAgent,
  "lab-ops": labOpsAgent,
  qaqc: qaqcAgent,
};

export function runAgent(agent: AgentName, query: string): AgentResponse {
  const handler = agentRegistry[agent];
  if (!handler) {
    return {
      humanResponse: `Unknown agent: ${agent}. Available agents: mix-design, lab-ops, qaqc.`,
      structuredData: null,
      nextQuestions: [],
    };
  }
  return handler(query);
}
