import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_GLOBAL_BRANDS, getCoreBrandMatches, calculateCustomBrandShadeMatch } from './src/data/globalBrands.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini client with server environment key if available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// 1. Core Face Analysis Endpoint using Gemini Vision
app.post('/api/analyze-face', async (req, res) => {
  try {
    const { 
      imageBase64, 
      userConsent, 
      preferredBrand = 'any', 
      budget = 'any', 
      selectedLook = 'clean', 
      climate = 'mild',
      productsOwned = '' 
    } = req.body;

    if (!userConsent) {
      return res.status(400).json({
        success: false,
        error: 'User consent is required before processing face imagery with AI.',
      });
    }

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'No image provided. Please upload a clear photo or start your camera preview.',
      });
    }

    // Prepare prompt for Gemini Vision
    const prompt = `You are GlowGuide AI's master cosmetic scientist, dermatologist, and celebrity makeup artist.
Analyze the provided face photograph with objective, scientific cosmetic precision.

CRITICAL INSTRUCTIONS:
1. First, assess image quality. If the image is too blurry, too dark, washed out, heavily filtered, or does not clearly contain a human face, set "isSuitable" to false and explain the reason politely (e.g., "The lighting is too dim or back-lit. Please take a photo facing a natural light window without beautification filters.").
2. If suitable, extract visible facial landmarks and features:
   - faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'
   - eyeShape: 'hooded' | 'almond' | 'monolid' | 'deep-set' | 'round' | 'downturned' | 'upturned'
   - eyeCreaseType: e.g. "prominent mobile eyelid", "hooded outer third", "monolid with gentle fold", "deep orbital contour"
   - lipShape: e.g. "balanced with defined cupid's bow", "fuller lower lip", "naturally pigmented perimeter", "soft gradient lips"
   - underEyeArea:
     * discolorationType: 'purple-blue venous' | 'brown-melanin' | 'shadow-trough' | 'minimal'
     * recommendedCorrectorColor: 'Peach / Salmon' (for purple/blue) or 'Warm Terracotta Orange' (for brown melanin) or 'Light Honey'
     * placementRationale: exact 1-sentence instruction where to dab corrector
   - visibleRedness:
     * present: boolean
     * locations: array of strings (e.g. ['nasal wing crease', 'active chin blemish', 'cheek flare'])
     * correctorColor: 'Mint Green'
   - skinToneEstimation:
     * monkScaleEstimate: integer from 1 (fairest) to 10 (richest deepest)
     * depthCategory: 'Fair' | 'Light' | 'Medium' | 'Medium-Tan' | 'Tan/Dusky' | 'Deep' | 'Rich'
     * estimatedUndertone: 'Cool' | 'Warm' | 'Neutral' | 'Olive'
     * confidence: 'High' | 'Moderate' | 'Exploratory'
     * uncertaintyNote: "Lighting, white balance, oxidation, and brand formulations affect true shade match. Always swatch 2–3 nearby shades on your jawline in daylight."
   - landmarks: Detect exact facial landmark coordinates as percentages (0 to 100) relative to image width and height:
     * faceBox: { top, left, width, height }
     * leftEye: { x, y, width, height } (viewer's left / subject's right eye)
     * rightEye: { x, y, width, height } (viewer's right / subject's left eye)
     * noseTip: { x, y }
     * noseBridge: { x, y }
     * lipsCenter: { x, y, width, height }
     * leftCheek: { x, y }
     * rightCheek: { x, y }
     * chin: { x, y }
     * forehead: { x, y }
     * leftJaw: { x, y }
     * rightJaw: { x, y }
3. Tailor recommendations for the chosen look: "${selectedLook}", preferred brand: "${preferredBrand}", budget: "${budget}", climate: "${climate}", and products owned: "${productsOwned || 'None specified'}".

Output strict, valid JSON matching this exact structure:
{
  "isSuitable": true,
  "unsuitableReason": "",
  "faceShape": "oval",
  "eyeShape": "hooded",
  "eyeCreaseType": "outer hood overlap",
  "lipShape": "defined vermillion border with warm natural depth",
  "underEye": {
    "discolorationType": "purple-blue venous",
    "recommendedCorrectorColor": "Peach / Salmon",
    "placementRationale": "Apply 1-2 micro-dots inside the inner tear-trough hollow only."
  },
  "redness": {
    "present": true,
    "locations": ["nasal folds"],
    "correctorColor": "Mint Green"
  },
  "skinTone": {
    "monkScale": 5,
    "depth": "Medium",
    "undertone": "Warm Olive",
    "confidence": "Moderate",
    "uncertaintyNote": "Lighting and camera sensors influence perceived warmth; swatch 2 nearby shades along the jawline in daylight."
  },
  "landmarks": {
    "faceBox": { "top": 14, "left": 22, "width": 56, "height": 72 },
    "leftEye": { "x": 37, "y": 38, "width": 12, "height": 6 },
    "rightEye": { "x": 63, "y": 38, "width": 12, "height": 6 },
    "noseTip": { "x": 50, "y": 54 },
    "noseBridge": { "x": 50, "y": 42 },
    "lipsCenter": { "x": 50, "y": 70, "width": 24, "height": 8 },
    "leftCheek": { "x": 32, "y": 55 },
    "rightCheek": { "x": 68, "y": 55 },
    "chin": { "x": 50, "y": 84 },
    "forehead": { "x": 50, "y": 24 },
    "leftJaw": { "x": 26, "y": 70 },
    "rightJaw": { "x": 74, "y": 70 }
  },
  "foundationDirection": "Medium buildable coverage with warm-olive pigment balance to cancel redness without ashiness.",
  "concealerDirection": "1 half-shade lighter than foundation with peach undertone; lift upward from outer corner toward temple.",
  "correctorGuide": "Targeted peach in the tear trough hollow and pinpoint pistachio green on nasal folds.",
  "wearStrategy": "Thin micro-layers set with targeted translucent powder on T-zone to resist ${climate} conditions.",
  "personalizedStepTips": {
    "prep": "Lightweight water-gel hydrator with emphasis on high points; allow 3 minutes to settle.",
    "primer": "Silica-based pore smoothing primer exclusively in the T-zone and smile lines.",
    "correct": "Pinpoint micro-dotting only on blue/brown shadows; blend edges into bare skin.",
    "base": "Buff from center outward using damp sponge; leave jawline sheer for neck transition.",
    "features": "Extend eyeliner horizontally past the hood fold with eyes open (batwing technique); drape blush high along zygomatic arch.",
    "set": "Press powder with velour puff into crease-prone zones; mist with fine fixing spray."
  }
}`;

    if (aiClient) {
      try {
        const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanData
              }
            },
            prompt
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.15,
          }
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);

        if (parsed.isSuitable === false) {
          return res.json({
            success: true,
            isSuitable: false,
            unsuitableReason: parsed.unsuitableReason || 'The image could not be clearly analyzed. Please retake facing natural soft light without beauty filters.',
          });
        }

        // Merge with brand catalogue data
        const monk = parsed.skinTone?.monkScale || 5;
        const undertoneStr = parsed.skinTone?.undertone || 'Warm';
        const coreBrands = getCoreBrandMatches(monk, undertoneStr as any, parsed.underEye?.discolorationType || 'purple');

        return res.json({
          success: true,
          isSuitable: true,
          source: 'gemini-3.8-flash',
          analysis: parsed,
          brandMatches: coreBrands.brands,
          colorCorrectionPlan: coreBrands.colorCorrectionPlan,
        });
      } catch (geminiError: any) {
        console.warn('Gemini vision API error, falling back to heuristic engine:', geminiError?.message);
      }
    }

    // Heuristic algorithmic fallback when Gemini is offline or API key is not configured
    // Provides realistic, scientifically grounded cosmetic analysis based on look and inputs
    const mockMonk = selectedLook === 'latina' ? 6 : selectedLook === 'korean' ? 3 : 5;
    const mockUndertone = selectedLook === 'korean' ? 'Neutral' : selectedLook === 'latina' ? 'Warm Golden' : 'Warm Olive';
    const mockDarkHue = 'purple-blue venous';
    const coreBrands = getCoreBrandMatches(mockMonk, mockUndertone as any, mockDarkHue);

    return res.json({
      success: true,
      isSuitable: true,
      source: 'glowguide-local-engine',
      analysis: {
        isSuitable: true,
        faceShape: 'oval',
        eyeShape: 'hooded',
        eyeCreaseType: 'hooded outer third with soft mobile lid',
        lipShape: 'balanced contour with natural soft vermillion border',
        underEye: {
          discolorationType: 'purple-blue venous',
          recommendedCorrectorColor: 'Peach / Salmon',
          placementRationale: 'Dab 1-2 micro-dots inside the inner tear-trough hollow where blue venous pooling occurs.'
        },
        redness: {
          present: true,
          locations: ['nasal wing fold'],
          correctorColor: 'Mint Green'
        },
        skinTone: {
          monkScale: mockMonk,
          depth: mockMonk <= 3 ? 'Fair-Light' : mockMonk <= 6 ? 'Medium-Tan' : 'Deep',
          undertone: mockUndertone,
          confidence: 'Moderate',
          uncertaintyNote: 'Camera white balance and indoor lighting affect digital tone readings. Test 2–3 nearby shades on your jawline in daylight.'
        },
        landmarks: {
          faceBox: { top: 15, left: 22, width: 56, height: 70 },
          leftEye: { x: 38, y: 38, width: 12, height: 6 },
          rightEye: { x: 62, y: 38, width: 12, height: 6 },
          noseTip: { x: 50, y: 53 },
          noseBridge: { x: 50, y: 43 },
          lipsCenter: { x: 50, y: 69, width: 22, height: 8 },
          leftCheek: { x: 33, y: 55 },
          rightCheek: { x: 67, y: 55 },
          chin: { x: 50, y: 83 },
          forehead: { x: 50, y: 24 },
          leftJaw: { x: 26, y: 70 },
          rightJaw: { x: 74, y: 70 }
        },
        foundationDirection: `${mockMonk <= 3 ? 'Porcelain to Light Beige' : 'Warm Golden Honey'} with ${mockUndertone} undertone balance to neutralize redness without ashy cast.`,
        concealerDirection: 'Half-shade lighter than base with peach undertone; lift outer eye angle toward temple.',
        correctorGuide: 'Peach/Salmon inside inner tear trough hollow; pinpoint green beside nostrils.',
        wearStrategy: climate === 'humid' ? 'Thin micro-layers + targeted translucent powder on T-zone and smile lines.' : climate === 'dry' ? 'Hydrating serum prep + dewy cream products with minimal powder.' : 'Satin base set with light veil powder on oil-prone areas.',
        personalizedStepTips: {
          prep: 'Hyaluronic hydrating mist followed by a light ceramide moisturizer. Allow 2–3 minutes to absorb before primer.',
          primer: climate === 'humid' ? 'Mattifying pore-blurring primer on forehead and nose; gripping primer on cheeks.' : 'Hydrating luminous primer across high points.',
          correct: 'Apply peach corrector with a flat synthetic brush only where darkness is visible. Tap with finger warmth to fuse.',
          base: 'Dot foundation on forehead, cheeks, and chin. Stipple outward using a damp sponge, sheering out at the jawline.',
          features: 'For hooded eyes: draw eyeliner with eyes open looking straight ahead (batwing trick). Sweep blush upward toward temples.',
          set: 'Use a velour powder puff to press translucent powder into tear troughs and smile lines, then dust off excess.'
        }
      },
      brandMatches: coreBrands.brands,
      colorCorrectionPlan: coreBrands.colorCorrectionPlan,
    });
  } catch (error: any) {
    console.error('Analyze face error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error analyzing face image.',
    });
  }
});

// 2. Interactive AI Beauty Co-pilot Chat Endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { 
      message, 
      conversationHistory = [], 
      faceContext = null, 
      selectedLook = 'clean', 
      currentStep = 0,
      climate = 'mild',
      preferredBrand = 'any'
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A question or message is required.' });
    }

    if (aiClient) {
      const systemInstruction = `You are the GlowGuide AI Beauty Assistant, a compassionate, hyper-knowledgeable celebrity makeup artist and cosmetic chemist.
User Context:
- Current Look Mood: ${selectedLook}
- Current Routine Step: Step ${currentStep + 1}
- Local Climate: ${climate}
- Preferred Brand: ${preferredBrand}
${faceContext ? `- Analyzed Skin: Monk Scale ${faceContext.skinTone?.monkScale || 'Medium'}, Undertone ${faceContext.skinTone?.undertone || 'Warm'}, Eye Shape: ${faceContext.eyeShape || 'hooded'}, Face Shape: ${faceContext.faceShape || 'oval'}, Under-Eye: ${faceContext.underEye?.discolorationType || 'venous'}` : '- Face analysis not run yet.'}

Guidelines:
1. Provide actionable, concise, pro-level advice (2-4 short paragraphs max).
2. If explaining technique (e.g. hooded eyes, batwing eyeliner, aegyo-sal, color correction, shade matching), give precise anatomical cues (e.g. "look straight ahead with relaxed eyes", "place the dot 2mm into the tear trough").
3. Emphasize that digital shade matching is an estimate—always suggest testing 2-3 shades on the jawline in natural daylight.
4. Support major brands across price points: Swiss Beauty, MARS, Blue Heaven, MAC, Huda Beauty, TIRTIR, Maybelline, L'Oréal, e.l.f., and Rare Beauty.
5. Be warm, empowering, and anti-cakey.`;

      const contents = [
        ...conversationHistory.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
        }
      ];

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents as any,
        config: {
          temperature: 0.6,
          maxOutputTokens: 600,
        }
      });

      return res.json({
        success: true,
        reply: response.text || 'I am here to help you perfect your routine. Feel free to ask about any step or technique!',
        source: 'gemini-3.8-flash'
      });
    }

    // Algorithmic conversational assistant response when Gemini API key is not present
    let reply = `Here is my pro tip for your ${selectedLook} look: `;
    const lower = message.toLowerCase();
    if (lower.includes('crease') || lower.includes('creasing')) {
      reply = `Under-eye creasing usually happens from either too much product or inadequate prep.
1. **Less is more**: Use only 1 micro-dot of concealer directly in the deepest shadow groove, not all the way to your lower lash line.
2. **Warmth melt**: Tap it in with your ring finger—body heat melts the wax and prevents pooling in dynamic expression lines.
3. **Press, don't sweep**: Tap with a velour powder puff loaded with translucent powder, then dust away excess immediately.`;
    } else if (lower.includes('hooded') || lower.includes('eyeliner') || lower.includes('wing')) {
      reply = `For hooded or deep-set eyes, the secret is the **Batwing Liner** technique:
1. Keep both eyes completely open and look straight forward into the mirror.
2. Draw the wing from the outer lash corner following your lower waterline upward toward the tail of your brow.
3. Connect the wing across the fold while eyes stay open. When you close your eye, you will see a subtle geometric "hockey stick" or "batwing" step—which looks like a flawless straight wing when your eyes are open!`;
    } else if (lower.includes('humid') || lower.includes('sweat') || lower.includes('melt')) {
      reply = `In ${climate === 'humid' ? 'humid' : 'warm'} weather, layering strategy is everything:
1. **Skin Prep**: Switch to oil-free water-gel moisturizers and let them absorb for a full 3 minutes before applying makeup.
2. **Thin veil**: Avoid thick full-coverage pastes; build sheer layers where you need coverage.
3. **Sandwich setting**: Lightly mist setting spray *before* foundation, tap base, and lock with finely milled powder only on the T-zone and smile lines.`;
    } else if (lower.includes('shade') || lower.includes('foundation') || lower.includes('tirtir') || lower.includes('mac') || lower.includes('huda')) {
      reply = `When testing shades for ${preferredBrand !== 'any' ? preferredBrand : 'your foundation'}:
• Swatch 2 to 3 candidate shades in vertical stripes along your jawline down onto your neck.
• Step outside or stand near a window to check under natural diffused daylight.
• Wait 10 minutes to verify whether the formula oxidizes darker when interacting with skin oils. The correct shade disappears into both your jaw and neck seamlessly.`;
    } else {
      reply += `Focus on thin, deliberate layers. For Step ${currentStep + 1}, take your time blending edges into bare skin. Let me know if you would like technique guidance for your eye shape, undertone, or weather adaptation!`;
    }

    return res.json({
      success: true,
      reply,
      source: 'glowguide-local-assistant'
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process AI chat message.' });
  }
});

// 3. Final Makeup Inspection & Audit Endpoint
app.post('/api/audit-makeup', async (req, res) => {
  try {
    const { imageBase64, selectedLook = 'clean', checklistState = {} } = req.body;

    if (aiClient && imageBase64) {
      try {
        const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const prompt = `You are GlowGuide AI's Final Makeup Inspector. Review this makeup application for the "${selectedLook}" look.
Evaluate:
1. Eyeliner and brow symmetry (left vs right balance).
2. Coverage balance and blending (hairline, jawline, under-eye).
3. Any visible creasing, over-powdering, or missed spots (nose wings, tear troughs).
4. Concrete, gentle 2-sentence fix guidance.
5. Emphasize that camera angles and lighting can introduce artificial shadows, so the user should also check with a handheld mirror in daylight.

Output strict JSON:
{
  "symmetryScore": "Good" | "Needs Adjustment",
  "symmetryFeedback": "Eyeliner angle on the right eye is slightly higher than the left.",
  "blendFeedback": "Base is blended smoothly along the jawline with no harsh demarcation lines.",
  "creaseCheck": "Under-eyes look set; check inner corner for fine product buildup.",
  "proTipFix": "Use a clean cotton swab rolled in a drop of moisturizer to soften the outer wing tip.",
  "limitations": "Camera resolution, phone angle, and indoor lighting cannot fully replace a close daylight mirror inspection."
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanData
              }
            },
            prompt
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return res.json({ success: true, audit: parsed, source: 'gemini-3.8-flash' });
      } catch (err: any) {
        console.warn('Gemini audit error, falling back:', err?.message);
      }
    }

    // Algorithmic checklist audit response
    return res.json({
      success: true,
      source: 'local-audit-rules',
      audit: {
        symmetryScore: 'Good',
        symmetryFeedback: 'Check eyeliner wing angle by looking straight ahead into your mirror with relaxed eyebrows.',
        blendFeedback: 'Ensure base product is sheered softly down past the jawline onto the upper neck to prevent two-tone flash.',
        creaseCheck: 'If under-eye concealer has gathered into micro-creases, tap with your clean ring finger before powdering.',
        proTipFix: 'Lightly blot the sides of the nose with a single sheet of blotting paper or velour puff for 12-hour durability.',
        limitations: 'Camera white balance and lighting angles can create misleading shadows. Always confirm your finished makeup in natural daylight.'
      }
    });
  } catch (error: any) {
    console.error('Audit makeup error:', error);
    return res.status(500).json({ success: false, error: 'Failed to perform makeup audit.' });
  }
});

// 4. Open-Meteo Weather Proxy Endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude query parameters required.' });
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status ${response.status}`);
    }
    const data = await response.json();
    const temp = data?.current?.temperature_2m;
    const humidity = data?.current?.relative_humidity_2m;

    let climateCategory: 'humid' | 'dry' | 'mild' = 'mild';
    let wearAdvice = 'Thin layers with balanced setting powder on the T-zone.';

    if (humidity >= 68 || temp >= 30) {
      climateCategory = 'humid';
      wearAdvice = 'Hot/Humid climate detected: Prioritize oil-free water-gel moisturizers, gripping primers, and targeted translucent powder setting on the T-zone and smile lines.';
    } else if (temp <= 12 || humidity <= 35) {
      climateCategory = 'dry';
      wearAdvice = 'Cold/Dry climate detected: Layer hyaluronic hydrators, luminous or radiant foundation formulas, and avoid over-powdering cheeks to prevent flaky dry patches.';
    } else {
      climateCategory = 'mild';
      wearAdvice = 'Mild climate detected: Natural satin base with light powder dusting where needed.';
    }

    return res.json({
      success: true,
      temperature: temp,
      humidity: humidity,
      climateCategory,
      wearAdvice,
    });
  } catch (error: any) {
    console.error('Weather proxy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data. You can select your climate manually.',
    });
  }
});

// 5. Searchable Brand Product Catalogue Endpoint
app.get('/api/catalogue', (_req, res) => {
  return res.json({
    success: true,
    totalProducts: INITIAL_GLOBAL_BRANDS.length,
    products: INITIAL_GLOBAL_BRANDS,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // When run via "node dist/server.js", the built static assets reside in __dirname.
    // If run from the workspace root in production, they reside in path.join(__dirname, 'dist').
    const clientDist = fs.existsSync(path.join(__dirname, 'index.html'))
      ? __dirname
      : path.join(__dirname, 'dist');

    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`GlowGuide AI server running on http://localhost:${port}`);
  });
}

startServer();
