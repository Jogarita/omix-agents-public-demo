import { NextRequest, NextResponse } from "next/server";
import { AgentName, AgentRequest } from "@/lib/types";
import { runAgent } from "@/lib/agents";

const VALID_AGENTS: AgentName[] = ["mix-design", "lab-ops", "qaqc"];

export async function POST(request: NextRequest) {
  try {
    const body: AgentRequest = await request.json();

    if (!body.agent || !body.query) {
      return NextResponse.json(
        { error: "Missing required fields: agent, query" },
        { status: 400 }
      );
    }

    if (!VALID_AGENTS.includes(body.agent)) {
      return NextResponse.json(
        { error: `Invalid agent: ${body.agent}. Valid agents: ${VALID_AGENTS.join(", ")}` },
        { status: 400 }
      );
    }

    if (body.llmMode) {
      return NextResponse.json({
        humanResponse:
          "LLM mode is enabled but no API key is configured. In production, this is where the query would be routed to an LLM (e.g., Claude or GPT) for natural language understanding, intent classification, and response generation. The deterministic agent logic you see in this demo would serve as the tool/function layer that the LLM orchestrates.",
        structuredData: {
          type: "key-value",
          title: "LLM Integration Point",
          entries: [
            { key: "Status", value: "Placeholder — no API key configured" },
            { key: "Where LLM plugs in", value: "Query understanding + response synthesis" },
            { key: "Current mode", value: "Deterministic keyword matching" },
            { key: "Agent tools", value: "Mix lookup, compliance checks, lab scheduling, QA/QC validation" },
          ],
        },
        nextQuestions: [
          "How would LLM integration work?",
          "Show me the deterministic agent response instead",
        ],
      });
    }

    const response = runAgent(body.agent, body.query);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
