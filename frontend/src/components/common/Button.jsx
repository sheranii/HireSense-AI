import React from "react";

const VARIANTS = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-subtle focus-visible:ring-2 focus-visible:ring-slate-900/20 active:translate-y-px",
  brand: "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600 shadow-subtle focus-visible:ring-2 focus-visible:ring-indigo-600/20 active:translate-y-px",
  secondary: "bg-white text-slate-800 hover:bg-slate-50/80 hover:text-slate-900 border border-slate-200 shadow-subtle focus-visible:ring-2 focus-visible:ring-slate-900/10 active:translate-y-px",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent focus-visible:ring-2 focus-visible:ring-slate-900/10",
  danger: "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 shadow-subtle focus-visible:ring-2 focus-visible:ring-rose-500/20 active:translate-y-px",
};

const SIZES = {
  xs: "h-7 px-2 text-xs font-medium gap-1 rounded-md",
  sm: "h-8 px-3 text-xs font-medium gap-1.5 rounded-lg",
  md: "h-9 px-3.5 text-xs font-semibold gap-2 rounded-lg",
  lg: "h-10 px-5 text-sm font-semibold gap-2 rounded-lg",
};

export const Button = ({
  children,
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-sans tracking-tight transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant] || VARIANTS.secondary} ${SIZES[size] || SIZES.md} ${className}`}
    {...props}
  >
    {loading ? (
      <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
    ) : Icon ? (
      <Icon className="h-3.5 w-3.5 shrink-0" />
    ) : null}
    {children}
    {IconRight && !loading ? <IconRight className="h-3.5 w-3.5 shrink-0" /> : null}
  </button>
);
