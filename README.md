# GlowGuide AI ✳ — Makeup, Made Personal

> **"Your face. Your style. Your routine."**  
> An AI-powered face studio and personalized cosmetic co-pilot. Upload a photo or open your live camera to automatically extract facial landmarks, apparent skin tone, undertone, eye architecture, and under-eye discoloration without tedious questionnaires.

---

## ✨ Features

1. **Automatic Face & Undertone Analysis**
   - Uses server-side **Google Gemini Vision (`gemini-3.8-flash`)** to detect:
     - Facial shape (Oval, Round, Square, Heart, Diamond)
     - Eye architecture (Hooded, Almond, Monolid, Deep-set)
     - Under-eye hue (Purple-blue venous vs. Melanin brown)
     - Apparent skin tone depth (Monk Skin Tone Scale 1–10) and undertone (Cool, Warm, Neutral, Olive)
     - Visible redness in nasal folds or blemishes
   - Zero manual skin-type quizzes—pure computer vision and cosmetic science.

2. **Camera & Studio with Instant Privacy Wipe**
   - Switch seamlessly between high-resolution photo upload and live webcam preview.
   - **Privacy First**: Photos are processed securely on the server for landmark analysis and never stored to disk or database.
   - **One-Click Wipe**: The "Delete Photo" button immediately revokes object URLs and clears RAM.

3. **Step-Wise Pictorial Result & AR Face Overlay**
   - High-fidelity visual diagrams for all 6 routine steps:
     1. **Skin Prep**: Hydration cushions and barrier priming
     2. **Primer**: Blurring pore mesh vs. gripping zones
     3. **Colour Correct**: Exact placement of peach/salmon for dark circles and pistachio green for redness
     4. **Foundation & Concealer**: Sheer base veil + outer eye lifting vectors
     5. **Eyes, Brows & Cheeks**: Batwing eyeliner for hooded eyes, cheek draping, and lip contouring
     6. **Set & Final Check**: Velour puff press zones and symmetry axis
   - **Interactive AR Overlay Toggle**: Switch from illustrated diagrams to an interactive AR overlay directly on top of your face photo or live camera feed!

4. **6 Curated Aesthetic Moods**
   - **Clean Girl**: Fresh, dewy, minimal glow
   - **Natural Everyday**: Balanced satin with soft definition
   - **Korean Natural**: Blurred glass skin, aegyo-sal contour, gradient lips
   - **Soft Glam**: Sculpted cheekbones, blended transition, polished finish
   - **Latina-Inspired Glam**: Sharp cat-eye wings, warm bronzer drape, contoured ombré lips
   - **Creative / Editorial**: Graphic liner, high-contrast placement, statement finish

5. **Verified Brand Product Catalogue**
   - Exact shade recommendations and daylight testing guidance across top worldwide brands:
     - **Swiss Beauty** (Liquid Concealer HD, Daily Wear Foundation, Pro Corrector Wheel)
     - **MARS Cosmetics** (City Paradise Foundation, Seal The Deal Concealer, Cover Ranger Palette)
     - **MAC Cosmetics** (Studio Fix Fluid SPF 15, Studio Fix 24HR Concealer)
     - **Huda Beauty** (#FauxFilter Luminous Matte Foundation & Concealer)
     - **TIRTIR** (Viral Mask Fit Red Cushion 72HR)
     - **Hilary Rhoda** (Skin Glaze Foundation, Camouflage HD Duo)
     - **e.l.f. Cosmetics** (16HR Camo Concealer, Halo Glow Liquid Filter)
     - **Maybelline**, **L'Oréal Paris**, **Rare Beauty**, **Charlotte Tilbury**

6. **Interactive AI Beauty Co-pilot (`AIAssistantDrawer`)**
   - Slide-over conversational assistant with Gemini intelligence.
   - Live context awareness of your detected skin tone, eye shape, chosen aesthetic, and current step.
   - Instant troubleshooting for under-eye creasing, hooded liner hacks, humidity adaptation, and budget dupes.

7. **Weather & Climate Adaptation**
   - Integrated with **Open-Meteo** API for real-time temperature and humidity lookup.
   - Automatically adapts your primer, base, and powder routine for hot/humid, cold/dry, or mild weather.

8. **Before & After Finish Checklist**
   - 8-point MUA inspection checklist.
   - Automated AI Makeup Audit to inspect eyeliner symmetry, jawline blending, and under-eye creasing before heading out.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ or 20+
- (Optional) Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/glowguide-ai.git
cd glowguide-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```
*(Note: If `GEMINI_API_KEY` is omitted, GlowGuide AI automatically runs using its built-in cosmetic rule calibration engine, so the app is always 100% functional).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Deployment

### Production Build
```bash
npm run build
```
This runs:
1. `vite build` to bundle frontend assets into `dist/`
2. `esbuild server.ts` to bundle the backend Express server into `dist/server.js`

### Start Production Server
```bash
npm start
```

### Docker Container Deployment
GlowGuide AI includes a multi-stage production `Dockerfile` optimized for Google Cloud Run, Railway, AWS ECS, or any container host:
```bash
# Build image
docker build -t glowguide-ai .

# Run container
docker run -p 3000:8080 -e GEMINI_API_KEY="your_api_key" glowguide-ai
```

---

## 🔒 Privacy & Limitation Disclosures

- **No Persistent Storage**: Face images are never written to disk, databases, or training sets.
- **Client Disclosures**: Digital shade matching is an estimate. Camera white balance, indoor lighting, and oxidation affect shade perception. GlowGuide AI encourages users to test 2–3 nearby shades on the jawline in natural daylight.

---

## 📄 License
MIT License. Built with Google Gemini 3.8 Flash & Vite React.
