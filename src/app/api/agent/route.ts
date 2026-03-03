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
          "LLM mode is enabled but not available in this demo. This prototype uses deterministic logic to demonstrate agent workflows. A future version will support natural language understanding via LLM integration.",
        structuredData: {
          type: "key-value",
          title: "LLM Mode",
          entries: [
            { key: "Status", value: "Not available in this demo" },
            { key: "Current mode", value: "Deterministic keyword matching" },
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
