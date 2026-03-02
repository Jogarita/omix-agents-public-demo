"use client";

import { useState, useCallback } from "react";
import { AgentName, AgentResponse, ChatMessage } from "@/lib/types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { Dashboard } from "./Dashboard";
import { Footer } from "./Footer";

type Tab = "dashboard" | "chat";

interface ChatLayoutProps {
  onBackToLanding: () => void;
}

export function ChatLayout({ onBackToLanding }: ChatLayoutProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentName>("mix-design");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [llmMode, setLlmMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const sendMessage = useCallback(
    async (query: string, agentOverride?: AgentName) => {
      const agent = agentOverride ?? selectedAgent;
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent, query, llmMode }),
        });

        const data: AgentResponse = await res.json();

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.humanResponse,
          structuredData: data.structuredData,
          nextQuestions: data.nextQuestions,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAgent, llmMode]
  );

  const handleSelectAgent = (agent: AgentName) => {
    setSelectedAgent(agent);
    setMessages([]);
  };

  const handleAskAgent = useCallback(
    (agent: AgentName, query: string) => {
      setSelectedAgent(agent);
      setMessages([]);
      setActiveTab("chat");
      // Small delay to let React re-render with the new agent before sending
      setTimeout(() => {
        sendMessage(query, agent);
      }, 50);
    },
    [sendMessage]
  );

  return (
    <div className="h-screen flex flex-col">
      <Header
        llmMode={llmMode}
        onToggleLLM={() => setLlmMode(!llmMode)}
        onBackToLanding={onBackToLanding}
      />

      {/* Tab bar */}
      <div className="glass-nav px-6 flex items-center gap-1 py-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "dashboard"
              ? "bg-white/70 text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "chat"
              ? "bg-white/70 text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
          }`}
        >
          Agent Chat
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <Dashboard onAskAgent={handleAskAgent} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            selectedAgent={selectedAgent}
            onSelectAgent={handleSelectAgent}
            onSelectPrompt={sendMessage}
          />
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            selectedAgent={selectedAgent}
            onSend={sendMessage}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
