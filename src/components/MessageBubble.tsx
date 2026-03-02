"use client";

import { ChatMessage } from "@/lib/types";
import { StructuredCard } from "./StructuredCard";
import { NextQuestions } from "./NextQuestions";

interface MessageBubbleProps {
  message: ChatMessage;
  onSelectQuestion: (question: string) => void;
}

export function MessageBubble({ message, onSelectQuestion }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? "order-1" : ""}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-purple-100/80 border border-purple-200/60 text-slate-800"
              : "glass-card text-slate-700"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Structured data card */}
        {!isUser && message.structuredData && (
          <StructuredCard data={message.structuredData} />
        )}

        {/* Next questions */}
        {!isUser && message.nextQuestions && message.nextQuestions.length > 0 && (
          <NextQuestions questions={message.nextQuestions} onSelect={onSelectQuestion} />
        )}
      </div>
    </div>
  );
}
