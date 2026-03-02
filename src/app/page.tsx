"use client";

import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { ChatLayout } from "@/components/ChatLayout";

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");

  if (view === "landing") {
    return <LandingPage onEnterDemo={() => setView("app")} />;
  }

  return <ChatLayout onBackToLanding={() => setView("landing")} />;
}
