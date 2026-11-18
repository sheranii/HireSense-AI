import React from "react";

export const PageHeader = ({ eyebrow, title, description, actions, className = "" }) => (
  <div className={`mb-6 flex flex-col gap-3.5 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between ${className}`}>
    <div className="min-w-0">
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-2xs font-mono font-medium uppercase tracking-wider text-slate-700 mb-1.5">
          {eyebrow}
        </span>
      )}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
        {title}
      </h1>
      {description && (
        <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);
