// src/api/upscale.js
import axios from "axios";

const API_KEY = import.meta.env.VITE_ENHANCE_API_KEY;
const BASE_URL = "https://techhk.aoscdn.com";

export async function upscaleImage(file, onProgress = null) {
  if (!file) throw new Error("No file provided");

  // Validate file before uploading
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(`Invalid file: ${validation.error}`);
  }

  try {
    const taskId = await uploadImage(file);
    console.log("Task created:", taskId);

    const result = await fetchEnhancedImage(taskId, onProgress);
    console.log("Upscale completed:", result);

    // Convert returned image URL to Blob so frontend can download/display
    const response = await fetch(result.url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return { blobUrl, width: result.width, height: result.height };
  } catch (error) {
    console.error("Upscale error:", error);
    throw error;
  }
}

/* ------------------------ HELPERS ------------------------ */

const validateImageFile = (file) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format: ${file.type}. Use JPG, PNG, or WebP.`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max 10MB.`,
    };
  }

  return { valid: true };
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image_file", file);

  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/tasks/visual/scale`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-Key": API_KEY,
        },
      }
    );

    console.log("Upload response:", data);

    if (!data?.data?.task_id) {
      throw new Error(
        `Task ID missing. Response: ${JSON.stringify(data)}`
      );
    }

    return data.data.task_id;
  } catch (error) {
    if (error.response) {
      // API returned error response
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      if (status === 401 || status === 403) {
        throw new Error("API authentication failed. Check your API key.");
      } else if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (status === 413) {
        throw new Error("Image file too large.");
      } else {
        throw new Error(`Upload failed (${status}): ${message}`);
      }
    }
    throw error;
  }
};

const fetchEnhancedImage = async (taskId, onProgress) => {
  const maxAttempts = 60; // 2 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
        { headers: { "X-API-Key": API_KEY } }
      );

      const info = data?.data;
      const state = info?.state;

      console.log(`Task status (attempt ${attempts}):`, state);
      console.log("Full API response:", JSON.stringify(info, null, 2));
      
      if (typeof onProgress === "function") {
        onProgress(state, attempts);
      }

      // State meanings (based on API response):
      // state: 0 = queued/pending
      // state: 1 + state_detail: "Complete" = success
      // state: 1 + progress < 100 = processing
      // state: 4 = failed

      // Check for completion
      if (state === 1 && info.state_detail === "Complete") {
        // Image is ready
        const imageUrl = info.image;
        if (!imageUrl) {
          throw new Error("No image URL in completed response");
        }
        return {
          url: imageUrl,
          width: info.image_width,
          height: info.image_height,
        };
      }

      if (state === 4) {
        // Get error message from API if available
        const errorMsg = info.error || info.message || "Unknown error";
        throw new Error(
          `Upscale failed: ${errorMsg}. This could be due to:\n` +
          `- Unsupported image format or content\n` +
          `- Image too large or corrupted\n` +
          `- API processing error\n` +
          `- Rate limit or quota exceeded`
        );
      }

      // Still processing
      await new Promise((res) => setTimeout(res, 2000));
    } catch (error) {
      if (error.message.includes("Upscale failed")) {
        throw error; // Re-throw our formatted error
      }
      if (error.response?.status === 404) {
        throw new Error("Task not found. It may have expired.");
      }
      throw error;
    }
  }

  throw new Error("Upscale timed out after 2 minutes");
};