import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Logo = ({ to = "/", light = false, className = "", collapsed = false }) => (
  <Link to={to} className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
    <div
      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm shadow-subtle transition-transform group-hover:scale-[1.03] ${
        light
          ? "bg-white text-slate-900"
          : "bg-slate-900 text-white"
      }`}
    >
      <span className="font-mono text-sm tracking-tighter">H</span>
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
    </div>

    {!collapsed && (
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`font-sans font-bold text-base tracking-tight truncate ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          HireSense
        </span>
        <span className="rounded bg-indigo-50 border border-indigo-200/80 px-1 py-0.2 text-[10px] font-mono font-semibold text-indigo-700">
          AI
        </span>
      </div>
    )}
  </Link>
);
