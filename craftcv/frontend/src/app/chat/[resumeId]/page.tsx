"use client";

import { useParams } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function ChatPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;

  return (
    <div className="h-screen flex">
      <div className="flex-1" />
      <div className="w-96 border-l bg-white">
        <ChatPanel resumeId={resumeId} />
      </div>
    </div>
  );
}
