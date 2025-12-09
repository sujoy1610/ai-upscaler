import React from "react";

export default function Loader({ text = "Processing image…" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border-4 border-t-indigo-600 border-slate-200 animate-spin" />
      <div className="text-sm text-slate-600">{text}</div>
    </div>
  );
}
