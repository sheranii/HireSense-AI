import React from "react";

const VARIANTS = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  navy: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  blue: "bg-blue-50 text-blue-700 border-blue-200/80",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  amber: "bg-amber-50 text-amber-700 border-amber-200/80",
  rose: "bg-rose-50 text-rose-700 border-rose-200/80",
  purple: "bg-purple-50 text-purple-700 border-purple-200/80",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
};

const DOT_COLORS = {
  default: "bg-slate-400",
  navy: "bg-indigo-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  green: "bg-emerald-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
};

export function stageVariant(stage) {
  if (!stage) return "default";
  const s = stage.toUpperCase();
  if (s === "OFFER" || s === "SELECTED") return "green";
  if (s === "REJECTED" || s === "WITHDRAWN") return "rose";
  if (s === "INTERVIEW") return "blue";
  if (s === "TECHNICAL") return "amber";
  if (s === "SCREENING" || s === "SHORTLISTED") return "purple";
  return "default";
}

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}) => {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 font-mono",
    sm: "text-xs px-2.5 py-0.5",
    md: "text-xs px-3 py-1 font-medium",
  };

  const selectedVariant = VARIANTS[variant] || VARIANTS.default;
  const dotColor = DOT_COLORS[variant] || DOT_COLORS.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size] || sizeClasses.sm} ${selectedVariant} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};
