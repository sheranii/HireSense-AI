import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ title, onClose, children, maxWidth = "max-w-xl" }) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-panel transition-all`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 font-sans">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
