import React from "react";

export default function UpscaleOptions({ disabled, onUpscale }) {
  return (
    <div className="flex gap-3 items-center">
      <button disabled={disabled} onClick={() => onUpscale(2)} className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50">
        Upscale 2x
      </button>
      <button disabled={disabled} onClick={() => onUpscale(4)} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
        Upscale 4x
      </button>
      <div className="text-sm text-slate-500">Choose factor. Upscaling may take a few seconds.</div>
    </div>
  );
}
