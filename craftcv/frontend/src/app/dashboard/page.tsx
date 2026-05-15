"use client";

import { Plus, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useResume } from "@/hooks/useResume";
import { ResumeListItem } from "@/components/resume/ResumeListItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoadingButton } from "@/components/ui/LoadingButton";

export default function DashboardPage() {
  const { resumes, loading, error, refetch } = useResume();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <LoadingButton onClick={refetch} variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </LoadingButton>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            No resumes yet
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Choose a template to get started
          </p>
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
          >
            <Plus className="w-4 h-4" />
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
