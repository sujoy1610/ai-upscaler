import React, { useState } from "react";
import { Upload, Download, Image, Zap, CheckCircle } from "lucide-react";
import { upscaleImage } from "../api/upscale";
export default function Home() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [originalDims, setOriginalDims] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultDims, setResultDims] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFileSelected(f) {
    setError(null);
    setResultUrl(null);
    setResultDims(null);
    if (!f) {
      setFile(null);
      setOriginalUrl(null);
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);
    const img = new window.Image();
    img.onload = () => setOriginalDims({ w: img.width, h: img.height });
    img.onerror = () => setOriginalDims(null);
    img.src = url;
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }

 async function handleUpscale(factor) {
  if (!file) return setError("Please choose an image first.");
  setError(null);
  setProcessing(true);
  setResultUrl(null);
  setResultDims(null);

  try {
    // Call your REAL API with the file
    const { blobUrl, width, height } = await upscaleImage(file, (progress) => {
      console.log('Upscale progress:', progress);
    });
    
    setResultUrl(blobUrl);
    setResultDims({ w: width, h: height });
  } catch (err) {
    console.error(err);
    setError(err?.message || "Upscale failed. Try again.");
  } finally {
    setProcessing(false);
  }
}

  function handleDownload() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `upscaled-${file?.name || "image"}.png`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI-Powered Enhancement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Image <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Upscaler</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Transform your images with AI-powered upscaling. Crystal clear results in seconds.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div 
              className={`relative bg-slate-800/50 backdrop-blur-xl border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : file 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-slate-700 hover:border-slate-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelected(e.target.files?.[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              
              <div className="text-center">
                {file ? (
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                ) : (
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {file ? file.name : 'Drop your image here'}
                </h3>
                
                <p className="text-slate-400 mb-4">
                  {file 
                    ? `${(file.size / 1024).toFixed(1)} KB • ${originalDims?.w} × ${originalDims?.h}px`
                    : 'or click to browse • PNG, JPG, WebP'
                  }
                </p>
                
                {!file && (
                  <label 
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-purple-500/25"
                  >
                    <Image className="w-5 h-5" />
                    Choose Image
                  </label>
                )}
              </div>
            </div>

            {file && (
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Enhancement Options</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[2, 4, 6, 8].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => handleUpscale(factor)}
                      disabled={processing}
                      className="relative group px-4 py-6 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-purple-500 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-2xl font-bold text-white mb-1">{factor}×</div>
                      <div className="text-xs text-slate-400">
                        {originalDims ? `${originalDims.w * factor} × ${originalDims.h * factor}` : 'Upscale'}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-xl transition-all duration-300"></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {processing && (
              <div className="bg-purple-500/10 border border-purple-500/50 rounded-xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="text-white font-medium">Enhancing your image...</p>
                    <p className="text-slate-400 text-sm">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}

            {resultUrl && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-medium mb-1">Enhancement Complete!</p>
                    <p className="text-slate-400 text-sm">
                      {resultDims?.w} × {resultDims?.h} pixels
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Preview</h3>
            
            {!originalUrl ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Image className="w-20 h-20 text-slate-600 mb-4" />
                <p className="text-slate-400">Upload an image to see the preview</p>
              </div>
            ) : (
              <div className="space-y-4">
                {!resultUrl ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-400">Original</span>
                      <span className="text-sm text-slate-500">
                        {originalDims?.w} × {originalDims?.h}
                      </span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                      <img 
                        src={originalUrl} 
                        alt="original" 
                        className="w-full h-auto max-h-[500px] object-contain rounded-lg" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-400">Original</span>
                        <span className="text-sm text-slate-500">
                          {originalDims?.w} × {originalDims?.h}
                        </span>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                        <img 
                          src={originalUrl} 
                          alt="original" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-green-400">Enhanced</span>
                        <span className="text-sm text-slate-500">
                          {resultDims?.w} × {resultDims?.h}
                        </span>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-green-500/50">
                        <img 
                          src={resultUrl} 
                          alt="upscaled" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Powered by AI • Fast • Secure • High Quality
          </p>
        </footer>
      </div>
    </div>
  );
}