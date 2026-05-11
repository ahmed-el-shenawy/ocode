"use client";

import { Sparkles, Search, PenLine } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const actions = [
  {
    label: "Improve bullet points",
    prompt: "Can you help me improve my bullet points with stronger action verbs?",
    icon: Sparkles,
  },
  {
    label: "Search job trends",
    prompt: "Search the web for latest resume trends and keywords in my industry",
    icon: Search,
  },
  {
    label: "Write summary",
    prompt: "Help me write a professional summary for my resume",
    icon: PenLine,
  },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap text-gray-600"
          >
            <Icon className="w-3 h-3" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
