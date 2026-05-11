"use client";

import { Plus, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { ResumeListItem } from "@/components/resume/ResumeListItem";

export default function DashboardPage() {
  const { resumes, loading, error, refetch } = useResume();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <Link
          href="/dashboard/templates"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            No resumes yet
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Choose a template to get started
          </p>
          <Link
            href="/dashboard/templates"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeListItem
              key={resume.id}
              resume={resume}
              onClick={(id) => {
                window.location.href = `/studio/${id}`;
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
