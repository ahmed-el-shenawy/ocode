"use client";

import { FileText, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-900">CraftCV</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-500">{user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
