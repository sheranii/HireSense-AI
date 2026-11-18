import React from "react";

export const StatCard = ({
  label,
  value,
  detail,
  subtext,
  icon: Icon,
  badge,
  trend,
  className = "",
}) => {
  const metaText = detail || subtext;

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4.5 shadow-card transition-all hover:border-slate-300 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            {label}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {badge && (
              <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {metaText && (
        <p className="mt-2 text-xs text-slate-500 truncate flex items-center gap-1 font-sans">
          {metaText}
        </p>
      )}
    </div>
  );
};
