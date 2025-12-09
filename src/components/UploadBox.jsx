import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg", ".jpg"],
  "image/webp": [".webp"],
};

export default function UploadBox({ onFileSelected, file }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    if (fileRejections && fileRejections.length > 0) {
      const msg = fileRejections[0]?.errors?.[0]?.message || "File rejected.";
      setError(msg);
      onFileSelected(null);
      return;
    }
    const f = acceptedFiles[0];
    if (!f) {
      onFileSelected(null);
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File too large — maximum 10MB.");
      onFileSelected(null);
      return;
    }
    onFileSelected(f);
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED,
    maxSize: MAX_BYTES,
  });

  return (
    <div>
      <div {...getRootProps()} className={`border-2 border-dashed p-6 rounded-md bg-white cursor-pointer ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200"}`}>
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="text-sm text-slate-700">Drag & drop an image here</div>
          <div className="text-xs text-slate-400">or click to browse — PNG, JPG, JPEG, WebP. Max 10MB.</div>
        </div>
      </div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      {file && <div className="mt-2 text-sm text-slate-700">Selected: {file.name} — {(file.size/1024/1024).toFixed(2)} MB</div>}
    </div>
  );
}
