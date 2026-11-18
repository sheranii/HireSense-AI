import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const Notice = ({ tone = "info", children, className = "" }) => {
  const configs = {
    info: {
      wrap: "border-blue-200 bg-blue-50/70 text-blue-900",
      icon: Info,
      iconColor: "text-blue-600",
    },
    success: {
      wrap: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
    },
    error: {
      wrap: "border-rose-200 bg-rose-50/70 text-rose-900",
      icon: AlertCircle,
      iconColor: "text-rose-600",
    },
  };

  const cfg = configs[tone] || configs.info;
  const IconComponent = cfg.icon;

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-sans ${cfg.wrap} ${className}`}
    >
      <IconComponent className={`h-4 w-4 shrink-0 mt-0.5 ${cfg.iconColor}`} />
      <div className="flex-1 leading-normal">{children}</div>
    </div>
  );
};
