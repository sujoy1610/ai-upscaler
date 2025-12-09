import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function Landing({ onUpload }) {
  const [fileError, setFileError] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFileError("");

    // validation error
    if (rejectedFiles.length > 0) {
      setFileError("Invalid file or file size too large (Max 10MB)");
      return;
    }

    const file = acceptedFiles[0];
    setPreviewImg(URL.createObjectURL(file));
    onUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop,
  });

  return (
    <div className="w-full min-h-screen bg-[#0F1115] text-white">
      {/* Navbar */}
      <nav className="w-full border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-wide">
          <span className="text-blue-400 font-bold">Image</span>Upscale
        </h1>
        <button className="bg-blue-600 py-1.5 px-4 rounded-xl font-medium hover:bg-blue-700 transition">
          Upload Image
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center mt-12 px-4 text-center">
        <h2 className="text-4xl font-bold leading-tight max-w-3xl">
          Upscale Image Online with <span className="text-blue-400">AI</span>
        </h2>

        <p className="mt-5 max-w-3xl text-lg text-gray-300 leading-relaxed">
          Imgupscaler AI is a powerful and easy-to-use AI image upscaler that lets you upscale image
          quality online in seconds for free — no login required. Whether your photo is blurry,
          pixelated, or low-resolution, the AI can sharpen clarity, restore detail, and enhance
          quality with impressive accuracy. You can upload any JPG, PNG, or HEIC file and upscale
          images up to 16K resolution — far beyond standard 4K upscalers.
        </p>
      </section>

      {/* Upload Zone */}
      <div className="mt-12 flex justify-center px-4">
        <div
          {...getRootProps()}
          className={`w-full max-w-3xl border-2 border-dashed rounded-2xl p-10 cursor-pointer transition
            ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-500/40 bg-white/5 hover:bg-white/10"}`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <Upload size={50} className="text-blue-400" />

            {isDragActive ? (
              <span className="text-blue-300 font-medium">Drop the image here</span>
            ) : (
              <>
                <span className="text-gray-200 font-medium text-lg">
                  Drag & Drop your image here
                </span>
                <span className="text-gray-400 text-sm">or click to browse</span>
                <span className="text-gray-500 text-xs">Supported: JPG, JPEG, PNG, WebP (Max 10MB)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {fileError && (
        <p className="text-center text-red-500 font-medium mt-3">{fileError}</p>
      )}

      {/* Demo Animation */}
      <div className="mt-20 flex justify-center px-4 mb-20">
        <div className="relative max-w-4xl w-full">
          {/* Before Image */}
          <img
            src="/demo-before.png"
            alt="Before"
            className="w-full rounded-xl opacity-100 transition-all duration-[2000ms] animation-pulse"
          />

          {/* After enhancement overlay animation */}
          <img
            src="/demo-after.png"
            alt="After"
            className="absolute top-0 left-0 w-full rounded-xl transition-all duration-[1800ms] mix-blend-screen opacity-0 hover:opacity-100"
          />

          <p className="text-gray-400 text-center mt-4 text-sm">
            Hover to preview AI enhancement
          </p>
        </div>
      </div>
    </div>
  );
}
