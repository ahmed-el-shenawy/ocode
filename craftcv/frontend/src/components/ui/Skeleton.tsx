import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle" | "rect";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 rounded",
        variant === "text" && "h-4 w-full",
        variant === "card" && "h-32 w-full rounded-lg",
        variant === "circle" && "h-10 w-10 rounded-full",
        variant === "rect" && "h-64 w-full rounded-lg",
        className
      )}
    />
  );
}
