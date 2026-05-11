"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ResumePreview } from "@/components/resume/ResumePreview";
import type { Resume } from "@/types/resume";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function PreviewPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  async function loadResume() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(sessionData.session?.access_token
            ? { Authorization: `Bearer ${sessionData.session.access_token}` }
            : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to load resume");
      const data = await res.json();
      setResume(data);
    } catch {
      console.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    setDownloading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const res = await fetch(`${BASE_URL}/pdf/generate/${resumeId}`, {
        headers: {
          ...(sessionData.session?.access_token
            ? { Authorization: `Bearer ${sessionData.session.access_token}` }
            : {}),
        },
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.title || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading preview...</div>
      </div>
    );
  }

  if (!resume) {
    return <div className="p-6">Resume not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link
          href={`/studio/${resumeId}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to editor
        </Link>
        <button
          onClick={downloadPdf}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {downloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {downloading ? "Generating..." : "Download PDF"}
        </button>
      </div>
      <div className="p-8">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
