# 🚀 AI Image Upscaler — Super Resolution Tool

AI-powered image enhancement tool that increases resolution using **2× / 4× upscaling** while preserving sharpness and details.  
Users can upload any low-resolution image and download a high-quality enhanced output.

🔗 **Live Demo:** _<your deployed link here>_  
📂 **GitHub Repository:** _(this repo)_

---

## 📌 Features
- ⬆️ 2× & 4× AI Upscaling
- ⚡ Real-time task polling & status progress
- 💾 Download enhanced image
- 🔁 Smooth user experience during processing
- 🎨 Modern responsive UI

---

## 🧠 Approach
The goal was to build a seamless enhancement workflow:

1. User uploads an image
2. A task is created via `/visual/scale` API
3. Task ID is received and **polled at intervals**
4. When `state = 4`, upscaling is complete
5. Enhanced image URL is rendered & offered for download

Focus areas:
- Robust error handling
- Non-blocking UI during processing
- Progress feedback to the user

---

## 🛠 Tech Stack & Why

| Tech | Role | Reason |
|------|------|--------|
| React (Vite) | Frontend | Fast bundling, DX & performance |
| Axios | API Calls | Clean request management |
| Tailwind CSS | Styling | Fast responsive UI |
| TechHK API | AI Upscaling | Accurate & high-quality results |
| Netlify / Vercel | Deployment | Quick, reliable hosting |

---

## 🚀 Local Setup

```bash
git clone <repo-url>
cd <project-folder>
npm install

Create a .env file in the project root:
VITE_UPSCALE_API_KEY=your_api_key_here
VITE_BASE_URL=https://techhk.aoscdn.com/

Start the project
npm run dev

API Workflow Summary
Upload image → Receive Task ID
           ↓
Poll task status every 2–3s
           ↓
If state = 4 → Enhancement complete
           ↓
Show result + allow download

🔮 Future Improvements

With more time, I would add:

Drag-and-drop upload

Batch image enhancement

Multiple enhancement models (denoise, colorize, face restore)

Image enhancement history & user accounts

Native mobile app

Developer

Sujoy Sarkar
Frontend Developer — React / JavaScript
📩 Email: sarkarsujoy715@gmail.com

