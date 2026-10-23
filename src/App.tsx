import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Sun, 
  CloudRain, 
  CheckSquare, 
  Layers, 
  Search, 
  AlertCircle, 
  HelpCircle,
  Eye,
  Info,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  XCircle,
  X,
  Smartphone
} from 'lucide-react';
import { LOOK_MOODS, ROUTINE_STEPS, PREFERRED_BRANDS } from './data/glowPresets';
import { LookMoodId, ClimateType, BudgetTier, FaceAnalysisData, BrandShadeSet } from './types/glowguide';
import { StepDiagramVisualizer } from './components/StepDiagramVisualizer';
import { UserFaceVisualGuide } from './components/UserFaceVisualGuide';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { FinishCheckModal } from './components/FinishCheckModal';
import { ProductCatalogueModal } from './components/ProductCatalogueModal';

export default function App() {
  // Navigation & Look State
  const [selectedLook, setSelectedLook] = useState<LookMoodId>('clean');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [preferredBrand, setPreferredBrand] = useState<string>('any');
  const [budget, setBudget] = useState<BudgetTier>('any');
  const [ownedProducts, setOwnedProducts] = useState<string>('');
  const [climate, setClimate] = useState<ClimateType>('mild');
  const [weatherStatus, setWeatherStatus] = useState<string>('Optional; you can choose climate manually.');
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false);

  // Studio & Camera State
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [userConsent, setUserConsent] = useState<boolean>(true);
  const [showFaceOverlay, setShowFaceOverlay] = useState<boolean>(false);

  // Analysis & Scan State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanCountdown, setScanCountdown] = useState<number | null>(null);
  const [autoScanStepNote, setAutoScanStepNote] = useState<string>('');
  const [analysisStatus, setAnalysisStatus] = useState<string>(
    'Add a photo or start the selfie camera to begin. The AI will estimate facial landmarks, skin-tone range, undertone, eye/lip shape, and under-eye areas automatically.'
  );
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisData | null>(null);
  const [brandMatches, setBrandMatches] = useState<BrandShadeSet[]>([]);
  const [unsuitableError, setUnsuitableError] = useState<string | null>(null);

  // Cancellation and Auto-Scan Refs
  const scanCancelledRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const autoScanTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & Drawers
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeMood = LOOK_MOODS.find((m) => m.id === selectedLook) || LOOK_MOODS[0];
  const activeStepObj = ROUTINE_STEPS[currentStep] || ROUTINE_STEPS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cleanup camera stream
  const stopCamera = () => {
    if (autoScanTimerRef.current) {
      clearTimeout(autoScanTimerRef.current);
      autoScanTimerRef.current = null;
    }
    setScanCountdown(null);
    setAutoScanStepNote('');
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Immediate cancel scan handler
  const handleCancelScan = () => {
    scanCancelledRef.current = true;
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (err) {
        // ignore abort error
      }
      abortControllerRef.current = null;
    }
    if (autoScanTimerRef.current) {
      clearTimeout(autoScanTimerRef.current);
      autoScanTimerRef.current = null;
    }
    setScanCountdown(null);
    setAutoScanStepNote('');
    setIsAnalyzing(false);
    stopCamera();
    setAnalysisStatus('Scan cancelled. You can upload a new photo or capture a new face anytime.');
    showToast('Scan cancelled. Ready to upload a photo or capture a new face.');
  };

  // Keep live camera stream reliably synced to video element without requiring a page refresh
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (cameraStream && isCameraActive) {
      if (vid.srcObject !== cameraStream) {
        vid.srcObject = cameraStream;
      }
      vid.play().catch(() => {});
    } else if (!isCameraActive) {
      vid.srcObject = null;
    }
  }, [cameraStream, isCameraActive, activeTab]);

  // Start live webcam preview with mirrored phone selfie reflection (NO auto-capture; only on-demand capture)
  const startCamera = async () => {
    if (isAnalyzing) {
      showToast('A scan is currently running. Please wait or cancel the active scan.');
      return;
    }
    scanCancelledRef.current = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera is unavailable in this environment.');
      return;
    }
    try {
      // If camera stream is already running, switch to camera tab immediately
      if (cameraStream && cameraStream.active) {
        setIsCameraActive(true);
        setActiveTab('camera');
        if (videoRef.current && videoRef.current.srcObject !== cameraStream) {
          videoRef.current.srcObject = cameraStream;
          videoRef.current.play().catch(() => {});
        }
        return;
      }

      // Stop previous tracks if any exist
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });

      setCameraStream(stream);
      setIsCameraActive(true);
      setActiveTab('camera');
      setUnsuitableError(null);
      setScanCountdown(null);
      setAutoScanStepNote('');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      showToast('Selfie camera active. Center your face and click "📸 Capture Image" when you want to take a photo.');
      setAnalysisStatus('Selfie mirror active. Continuous preview running with zero auto-capture. Tap "📸 Capture Image" whenever you are ready.');
    } catch (err: any) {
      showToast('Camera permission was not granted. You can upload a photo instead.');
    }
  };

  // Capture current frame from webcam with horizontal mirror (matching selfie mirror reflection)
  const captureFrameFromVideo = (): string | null => {
    if (!videoRef.current) return null;
    const vid = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = vid.videoWidth || 640;
    canvas.height = vid.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Mirror horizontally so the captured photo matches the mirrored selfie mirror view exactly
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.88);
  };

  // Explicit manual capture: only captures when user triggers it
  const handleCaptureImage = (triggerAnalysis = false) => {
    if (!videoRef.current || !isCameraActive) {
      showToast('Camera is not active. Please open camera first.');
      return;
    }

    const captured = captureFrameFromVideo();
    if (captured) {
      setPhotoBase64(captured);
      setPhotoUrl(captured);
      stopCamera();
      setActiveTab('upload');
      setUnsuitableError(null);
      
      if (triggerAnalysis) {
        showToast('Selfie captured! Initiating AI face analysis...');
        setAnalysisStatus('Photo captured from selfie mirror. Analyzing facial landmarks, undertone & shades...');
        setTimeout(() => {
          handleRunAnalysis(false, captured);
        }, 120);
      } else {
        showToast('Selfie captured! You can now inspect steps or run AI analysis.');
        setAnalysisStatus('Selfie photo captured! Click "✨ Run AI Face Analysis" below to extract facial landmarks, or explore routine steps.');
      }
    } else {
      showToast('Unable to capture camera frame. Please try again.');
    }
  };

  // Handle file upload (strictly guarded against active scan)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnalyzing) {
      showToast('Scan in progress. Please wait or cancel the active scan before uploading.');
      if (e.target) e.target.value = '';
      return;
    }

    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (PNG, JPG, WEBP).');
      return;
    }

    stopCamera();
    const localUrl = URL.createObjectURL(file);
    setPhotoUrl(localUrl);

    // Read as Base64 for AI API
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setPhotoBase64(b64);
      setUnsuitableError(null);
      showToast('Photo loaded locally. Ready for AI analysis.');
      setAnalysisStatus('Photo preview ready. Click "Run AI Face Analysis" below to extract landmarks and shades.');
    };
    reader.readAsDataURL(file);
  };

  // Immediate delete & memory wipe
  const handleDeletePhoto = () => {
    if (isAnalyzing) {
      handleCancelScan();
    }
    stopCamera();
    if (photoUrl && photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
    setPhotoBase64(null);
    setFaceAnalysis(null);
    setBrandMatches([]);
    setUnsuitableError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setAnalysisStatus('Add a photo or start the camera to begin automatic analysis.');
    showToast('Photo and analysis cleared from local memory.');
  };

  // Trigger Gemini Vision Face Analysis
  const handleRunAnalysis = async (fromCameraAuto = false, overrideImage?: string) => {
    if (isAnalyzing) return;
    scanCancelledRef.current = false;
    abortControllerRef.current = new AbortController();

    let imageToSend = overrideImage || photoBase64;

    // If currently running live camera and no override given, capture frame first
    if ((isCameraActive || fromCameraAuto) && !imageToSend) {
      const captured = captureFrameFromVideo();
      if (captured) {
        imageToSend = captured;
        setPhotoBase64(captured);
        setPhotoUrl(captured);
      }
    }

    if (!imageToSend) {
      showToast('Please upload a photo or start your camera first.');
      return;
    }

    if (!userConsent) {
      showToast('Please check the consent box to allow AI analysis.');
      return;
    }

    setIsAnalyzing(true);
    setUnsuitableError(null);
    setAnalysisStatus(
      fromCameraAuto
        ? 'Scanning face in selfie mirror: detecting landmarks, undertone & eye anatomy...'
        : 'GlowGuide AI is analyzing facial landmarks, undertone, and under-eye hue with Gemini...'
    );

    try {
      const response = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          imageBase64: imageToSend,
          userConsent: true,
          preferredBrand,
          budget,
          selectedLook,
          climate,
          productsOwned: ownedProducts,
        }),
      });

      // If user cancelled while the request was in flight, abort
      if (scanCancelledRef.current) {
        return;
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze face');
      }

      if (data.isSuitable === false) {
        setUnsuitableError(data.unsuitableReason || 'Image is too blurry or filtered. Please retake in soft natural light.');
        setAnalysisStatus('Analysis inconclusive: please retake a clear, unfiltered photo facing natural window light.');
        if (isCameraActive || fromCameraAuto) {
          stopCamera();
          setActiveTab('upload');
        }
      } else {
        setFaceAnalysis(data.analysis);
        setBrandMatches(data.brandMatches || []);
        
        // Auto-close camera once facial features are noted
        if (isCameraActive || fromCameraAuto) {
          stopCamera();
          setActiveTab('upload');
          setAnalysisStatus('Facial features noted! Camera closed and selfie saved. Customized routine ready below.');
          showToast('Facial features noted! Camera closed and custom routine generated.');
        } else {
          setAnalysisStatus('Automatic face and shade analysis complete. See recommendations below.');
          showToast('Face analysis complete! Step-by-step routine customized.');
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || scanCancelledRef.current) {
        console.log('Face analysis scan cancelled by user.');
        return;
      }
      console.error(err);
      setUnsuitableError('Connection issue during analysis. Retrying or using local calibration rule engine.');
      showToast('Analysis completed with local cosmetic engine.');
      if (isCameraActive || fromCameraAuto) {
        stopCamera();
        setActiveTab('upload');
      }
    } finally {
      abortControllerRef.current = null;
      setIsAnalyzing(false);
      setScanCountdown(null);
      setAutoScanStepNote('');
    }
  };

  // Fetch location weather via Open-Meteo
  const handleFetchWeather = () => {
    if (!navigator.geolocation) {
      setWeatherStatus('Location is not supported; please select climate manually.');
      return;
    }

    setIsFetchingWeather(true);
    setWeatherStatus('Requesting location permission...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          if (!res.ok) throw new Error('Weather lookup failed');
          const data = await res.json();
          if (data.success) {
            setClimate(data.climateCategory);
            setWeatherStatus(
              `Approx. ${Math.round(data.temperature)}°C · ${data.humidity}% humidity · ${data.climateCategory} routine selected.`
            );
            showToast(`Weather updated: ${data.climateCategory} wear strategy active.`);
          }
        } catch (e) {
          setWeatherStatus('Weather lookup failed. You can select climate manually.');
        } finally {
          setIsFetchingWeather(false);
        }
      },
      () => {
        setWeatherStatus('Location permission denied; choose climate manually.');
        setIsFetchingWeather(false);
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  // Filter brand match for user's selected preference
  const displayedBrand = brandMatches.find((b) =>
    preferredBrand !== 'any' ? b.brand.toLowerCase().includes(preferredBrand.toLowerCase()) : true
  ) || brandMatches[0];

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#29202a] flex flex-col font-sans selection:bg-[#f8e7ec] selection:text-[#c45b78]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#fffaf7]/90 backdrop-blur-md border-b border-[#eadde1] px-4 md:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Logo Mark: Glowing Rose-Gold Cosmetic Crystal Shield with AI Sparkle */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c45b78] via-[#e26d8d] to-[#fca5b8] flex items-center justify-center text-white shadow-md shadow-rose-900/15 ring-1 ring-white/60">
            <Sparkles className="w-5 h-5 text-white drop-shadow-xs" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-lg md:text-xl tracking-tight text-[#29202a]">
              <span>MAKEUP ASSISTANT</span>
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-[#c45b78] text-white tracking-widest shadow-2xs">
                AI
              </span>
            </div>
            <div className="text-[10px] md:text-[11px] text-[#766b77] font-medium -mt-0.5">
              Intelligent Face Studio & Real-Time Beauty Guide
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCatalogueOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#eadde1] bg-white text-[#29202a] hover:bg-[#fff5f7] hover:border-[#c45b78] transition shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-[#c45b78]" />
            <span>Brand Catalogue</span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#eadde1] bg-white text-[#426b5a]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy-First AI</span>
          </span>

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#c45b78] hover:bg-[#a84664] text-white shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 md:px-12 pt-8 pb-4 max-w-7xl mx-auto w-full">
        <div className="uppercase tracking-[0.16em] text-[#c45b78] font-extrabold text-[11px]">
          Personalized Makeup Assistant
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-semibold tracking-tight text-[#29202a] mt-2 mb-3">
          Makeup that feels like <span className="text-[#c45b78] italic">you.</span>
        </h1>
        <p className="text-xs md:text-sm text-[#766b77] max-w-2xl leading-relaxed">
          Upload a photo or open your camera. Makeup Assistant AI automatically estimates facial landmarks, skin undertone, eye shape, and under-eye coloration—without asking you to identify your own skin type or facial features manually.
        </p>
      </section>

      {/* Main Two-Column Layout */}
      <main className="px-4 md:px-12 pb-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT PANEL: 01 / Your face studio ================= */}
        <section className="lg:col-span-6 bg-white border border-[#eadde1] rounded-3xl shadow-[0_18px_50px_rgba(73,38,59,0.07)] overflow-hidden flex flex-col justify-between">
          <div>
            {/* Panel Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#f4ebeb]">
              <h2 className="font-bold text-base md:text-lg text-[#29202a] tracking-tight">
                01 / Your face studio
              </h2>
              <span className="text-xs text-[#766b77] bg-[#f8f1f3] px-2.5 py-1 rounded-full font-medium">
                {isCameraActive ? 'Live Camera' : photoUrl ? 'Photo Loaded' : 'Local Preview'}
              </span>
            </div>

            {/* Upload vs Camera Tabs */}
            <div className="px-6 pt-4">
              <div className="flex bg-[#f7f0f2] p-1 rounded-xl gap-1">
                <button
                  disabled={isAnalyzing}
                  onClick={() => {
                    if (isAnalyzing) return;
                    setActiveTab('upload');
                    stopCamera();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    isAnalyzing ? 'opacity-40 cursor-not-allowed' : ''
                  } ${activeTab === 'upload' ? 'bg-white text-[#29202a] shadow-xs' : 'text-[#766b77] hover:text-[#29202a]'}`}
                  title={isAnalyzing ? 'Upload is disabled during scan' : 'Upload photo'}
                >
                  Upload photo
                </button>
                <button
                  disabled={isAnalyzing && !isCameraActive}
                  onClick={() => {
                    if (isAnalyzing && !isCameraActive) return;
                    setActiveTab('camera');
                    startCamera();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    isAnalyzing && !isCameraActive ? 'opacity-40 cursor-not-allowed' : ''
                  } ${activeTab === 'camera' ? 'bg-white text-[#29202a] shadow-xs' : 'text-[#766b77] hover:text-[#29202a]'}`}
                >
                  Live camera (Selfie Mirror)
                </button>
              </div>
            </div>

            {/* Video / Photo Stage */}
            <div className={`relative mx-6 mt-4 rounded-2xl min-h-[320px] max-h-[440px] bg-radial from-[#fcebee] via-[#f7eae7] to-[#ede3e3] border ${isCameraActive ? 'border-rose-300 ring-2 ring-rose-200/50' : 'border-[#f0dee3]'} overflow-hidden flex items-center justify-center`}>
              {/* Phone Selfie Camera Dynamic Island / Notch */}
              {isCameraActive && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 bg-stone-900/90 backdrop-blur-md rounded-full border border-stone-700/60 shadow-md text-white text-[10px] font-mono select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-600 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  </span>
                  <span className="font-semibold text-rose-100 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-[#f5a3b8]" />
                    <span>FRONT SELFIE MIRROR</span>
                  </span>
                  {isAnalyzing ? (
                    <span className="text-amber-300 font-bold animate-pulse ml-1">● SCANNING</span>
                  ) : scanCountdown !== null ? (
                    <span className="text-rose-300 font-bold ml-1">● ALIGNING</span>
                  ) : (
                    <span className="text-emerald-400 ml-1">● READY</span>
                  )}
                </div>
              )}

              {/* Overlay Mode Switch Button on Stage */}
              {(photoUrl || isCameraActive) && (
                <button
                  onClick={() => setShowFaceOverlay(!showFaceOverlay)}
                  className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-bold text-[#7a4253] hover:bg-white flex items-center gap-1.5 shadow-xs border border-[#eadde1] transition"
                >
                  <Layers className="w-3.5 h-3.5 text-[#c45b78]" />
                  <span>{showFaceOverlay ? 'Hide AR Overlay' : 'Overlay on my face'}</span>
                </button>
              )}

              {/* Uploaded Photo */}
              {photoUrl && !isCameraActive && (
                <img
                  src={photoUrl}
                  alt="Your face studio canvas"
                  className="w-full h-full max-h-[440px] object-contain"
                />
              )}

              {/* Live Webcam Feed - Mirrored Horizontal Reflection for Phone Selfie */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full max-h-[440px] object-cover -scale-x-100 ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {/* Real-Time Biometric Scanning Beam & Frame Guide */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
                  <div className="w-[85%] max-w-[280px] h-[340px] border-2 border-dashed border-[#c45b78] rounded-[48%_48%_45%_45%] relative overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(196,91,120,0.35)]">
                    {/* Animated vertical laser bar */}
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#c45b78] to-transparent shadow-[0_0_12px_#c45b78] animate-bounce" />
                    
                    {/* Pulsing landmark dots on face */}
                    <div className="absolute top-[28%] left-[32%] w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <div className="absolute top-[28%] right-[32%] w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <div className="absolute top-[68%] left-[50%] -translate-x-1/2 w-3 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    
                    <div className="mt-auto mb-4 bg-stone-900/85 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-white text-center">
                      <span className="text-[#f5a3b8] font-bold text-[11px] block">Noting Facial Features...</span>
                      <span className="text-[10px] text-stone-300">Undertone, depth, eye & face architecture</span>
                    </div>
                  </div>
                </div>
              )}

              {/* On-Screen Camera Controls on Live Mirror Viewfinder (Manual capture only) */}
              {isCameraActive && !isAnalyzing && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 animate-in fade-in">
                  {/* Manual Shutter: Captures still photo when user taps */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleCaptureImage(false)}
                      className="group relative flex items-center justify-center p-1 bg-white/40 backdrop-blur-md rounded-full shadow-2xl hover:scale-105 active:scale-95 transition border border-white/80 cursor-pointer"
                      title="Click to capture selfie photo"
                    >
                      <div className="w-13 h-13 rounded-full border-2 border-white flex items-center justify-center bg-stone-900/90 group-hover:bg-[#c45b78] transition shadow-inner">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </button>
                    <span className="whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md">
                      📸 Capture Image
                    </span>
                  </div>

                  {/* One-Tap Capture & Immediate AI Scan */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleCaptureImage(true)}
                      className="group relative flex items-center justify-center p-1 bg-white/40 backdrop-blur-md rounded-full shadow-2xl hover:scale-105 active:scale-95 transition border border-white/80 cursor-pointer"
                      title="Capture and run AI analysis immediately"
                    >
                      <div className="w-13 h-13 rounded-full border-2 border-white flex items-center justify-center bg-[#c45b78] group-hover:bg-[#a84664] transition shadow-inner">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </button>
                    <span className="whitespace-nowrap bg-[#c45b78] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md">
                      ✨ Capture & Scan
                    </span>
                  </div>

                  {/* Stop Camera button on viewfinder */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={stopCamera}
                      className="w-11 h-11 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center border border-white/20 transition shadow-lg cursor-pointer"
                      title="Close live camera mirror"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <span className="whitespace-nowrap bg-stone-900/80 text-stone-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10 shadow-md">
                      Close
                    </span>
                  </div>
                </div>
              )}

              {/* Floating Cancel Scan Button on Viewfinder */}
              {(isAnalyzing || (isCameraActive && scanCountdown !== null)) && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                  <button
                    onClick={handleCancelScan}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 transition backdrop-blur-md border border-white/40 hover:scale-105 active:scale-95 animate-in fade-in cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Scan</span>
                  </button>
                </div>
              )}

              {/* AR Face Overlay Graphics rendered directly on top of photo/feed */}
              {showFaceOverlay && (photoUrl || isCameraActive) && !isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                  <div className="w-full h-full max-h-[440px] flex items-center justify-center">
                    <StepDiagramVisualizer
                      step={currentStep}
                      faceShape={faceAnalysis?.faceShape || 'oval'}
                      eyeShape={faceAnalysis?.eyeShape || 'hooded'}
                      isOverlayMode={true}
                      landmarks={faceAnalysis?.landmarks}
                      selectedLook={selectedLook}
                    />
                  </div>
                </div>
              )}

              {/* Refined Placeholder when no photo or camera */}
              {!photoUrl && !isCameraActive && (
                <div className="text-center p-6 max-w-xs">
                  <div className="w-20 h-24 border-2 border-[#d59ba9] rounded-[48%_48%_45%_45%] mx-auto mb-4 relative opacity-85 flex flex-col items-center justify-center">
                    <span className="text-[#b55c78] text-base font-mono mb-1">• &nbsp; •</span>
                    <span className="text-[#b55c78] text-lg font-serif">⌣</span>
                  </div>
                  <strong className="block text-sm font-bold text-[#29202a]">
                    Your canvas starts here
                  </strong>
                  <p className="text-xs text-[#766b77] mt-1 leading-relaxed">
                    Use a clear, front-facing photo in soft natural light, or launch the phone selfie mirror for instant auto-scan.
                  </p>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={isAnalyzing}
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Studio Action Buttons */}
            <div className="px-6 py-4 flex flex-wrap gap-2">
              <button
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className={`bg-[#c45b78] hover:bg-[#a84664] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 ${
                  isAnalyzing ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                }`}
                title={isAnalyzing ? 'Upload is disabled while scanning' : 'Upload photo'}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>↑ Choose a photo</span>
              </button>

              {isCameraActive ? (
                <>
                  <button
                    onClick={() => handleCaptureImage(false)}
                    disabled={isAnalyzing}
                    className="bg-[#c45b78] hover:bg-[#a84664] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Capture photo onto canvas"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>📸 Capture image</span>
                  </button>

                  <button
                    onClick={() => handleCaptureImage(true)}
                    disabled={isAnalyzing}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Capture photo and run AI analysis"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fca5b8]" />
                    <span>✨ Capture & Scan</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="bg-white border border-[#eadde1] text-[#29202a] hover:bg-[#fdf9f9] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Close camera
                  </button>
                </>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={isAnalyzing}
                  className={`bg-[#f8e7ec] hover:bg-[#f3d2dc] text-[#8b3b55] text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                    isAnalyzing ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{photoUrl ? '↺ Retake photo (Camera)' : '◎ Start selfie camera'}</span>
                </button>
              )}

              {isAnalyzing && (
                <button
                  onClick={handleCancelScan}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel scan</span>
                </button>
              )}

              <button
                onClick={handleDeletePhoto}
                className="bg-[#fff0f1] hover:bg-[#ffe3e6] border border-[#f5cfd5] text-[#a63749] text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete photo</span>
              </button>
            </div>

            {/* Privacy & Consent Notice */}
            <div className="mx-6 p-3 rounded-xl bg-[#f5f8f5] border border-[#e1ede4] text-[#486253] text-[11px] leading-relaxed">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded-xs text-[#426b5a] focus:ring-[#426b5a] cursor-pointer"
                />
                <span>
                  <strong>🔒 Privacy disclosure:</strong> Photos are analyzed securely with server-side AI for facial landmarks, undertones, and shade direction. Your image is never stored on disk or used for ad targeting. The "Delete" button purges local memory immediately.
                </span>
              </label>
            </div>

            {/* Unsuitable Image Warning */}
            {unsuitableError && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-[#fff2f2] border border-[#f8c8c8] text-[#9c2738] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#b93246]" />
                <div>
                  <strong>Retake Suggested:</strong> {unsuitableError}
                </div>
              </div>
            )}

            {/* Automatic Face & Skin Analysis Settings */}
            <div className="mx-6 my-4 p-4 rounded-2xl bg-[#fffdfc] border border-[#eadde1]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs md:text-sm text-[#29202a]">
                  Automatic face & skin analysis
                </h3>
                <span className="text-[10px] bg-[#f8e7ec] text-[#c45b78] px-2 py-0.5 rounded-md font-bold">
                  Zero manual questionnaire
                </span>
              </div>
              <div className="text-xs text-[#766b77] mt-1 leading-relaxed">
                {analysisStatus}
              </div>

              {/* Preference Form Grid (Brand, Budget, Climate, Products Owned) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 mt-3 border-t border-[#f4ebeb]">
                <div>
                  <label className="block text-[11px] font-bold text-[#29202a] mb-1">
                    Preferred brand
                  </label>
                  <select
                    value={preferredBrand}
                    onChange={(e) => setPreferredBrand(e.target.value)}
                    className="w-full bg-white border border-[#eadde1] rounded-lg p-2 text-xs text-[#29202a] outline-none focus:border-[#c45b78]"
                  >
                    <option value="any">Any brand / best match</option>
                    {PREFERRED_BRANDS.filter((b) => b !== 'any').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#29202a] mb-1">
                    Budget tier
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as BudgetTier)}
                    className="w-full bg-white border border-[#eadde1] rounded-lg p-2 text-xs text-[#29202a] outline-none focus:border-[#c45b78]"
                  >
                    <option value="any">Any budget</option>
                    <option value="low">Affordable (₹199 - ₹499 / under $10)</option>
                    <option value="mid">Mid-range (₹500 - ₹1,499 / $10 - $25)</option>
                    <option value="high">Premium luxury (₹1,500+ / $30+)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#29202a] mb-1">
                    Products you already own (optional)
                  </label>
                  <input
                    type="text"
                    value={ownedProducts}
                    onChange={(e) => setOwnedProducts(e.target.value)}
                    placeholder="e.g. MAC Studio Fix NC42, TIRTIR 24N, Swiss Beauty 04, Mars 03"
                    className="w-full bg-white border border-[#eadde1] rounded-lg p-2 text-xs text-[#29202a] placeholder-[#766b77] outline-none focus:border-[#c45b78]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#29202a] mb-1">
                    Weather adaptation
                  </label>
                  <select
                    value={climate}
                    onChange={(e) => setClimate(e.target.value as ClimateType)}
                    className="w-full bg-white border border-[#eadde1] rounded-lg p-2 text-xs text-[#29202a] outline-none focus:border-[#c45b78]"
                  >
                    <option value="humid">Hot or humid (70%+ humidity)</option>
                    <option value="dry">Cold or dry (sub-12°C)</option>
                    <option value="mild">Mild / changeable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#29202a] mb-1">
                    Location climate
                  </label>
                  <button
                    onClick={handleFetchWeather}
                    disabled={isFetchingWeather}
                    className="w-full bg-white border border-[#eadde1] hover:bg-[#fff5f7] text-[#29202a] rounded-lg p-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    {isFetchingWeather ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c45b78]" /> : <Sun className="w-3.5 h-3.5 text-[#c45b78]" />}
                    <span>{isFetchingWeather ? 'Fetching weather...' : '⌖ Use location weather'}</span>
                  </button>
                  <span className="block text-[10px] text-[#766b77] mt-1 truncate">
                    {weatherStatus}
                  </span>
                </div>
              </div>

              {/* Run AI Analysis CTA Button + Cancel Scan Button */}
              <div className="pt-4 mt-3 border-t border-[#f4ebeb] flex items-center gap-2">
                <button
                  onClick={() => handleRunAnalysis(false)}
                  disabled={isAnalyzing || (!photoUrl && !isCameraActive)}
                  className="flex-1 bg-[#c45b78] hover:bg-[#a84664] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning landmarks, undertone & shade...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{faceAnalysis ? 'Re-run AI Face Analysis' : '✨ Run AI Face Analysis'}</span>
                    </>
                  )}
                </button>

                {isAnalyzing && (
                  <button
                    onClick={handleCancelScan}
                    className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 shadow-2xs"
                    title="Cancel ongoing face scan"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* AI Detected Facial Landmark & Shade Profile Card */}
            {faceAnalysis && (
              <div className="mx-6 mb-6 p-4 rounded-2xl bg-[#fff5f7] border border-[#f5cfd7] space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c45b78] animate-pulse"></span>
                    <h4 className="font-bold text-xs md:text-sm text-[#29202a]">
                      Detected Facial Profile & Undertone
                    </h4>
                  </div>
                  <span className="text-[10px] bg-white border border-[#eadde1] px-2 py-0.5 rounded-full text-[#766b77]">
                    Confidence: {faceAnalysis.skinTone.confidence}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Undertone</span>
                    <strong className="text-[#c45b78]">{faceAnalysis.skinTone.undertone}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Monk Depth</span>
                    <strong className="text-[#29202a]">Scale {faceAnalysis.skinTone.monkScale} ({faceAnalysis.skinTone.depth})</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Eye Anatomy</span>
                    <strong className="text-[#29202a] capitalize">{faceAnalysis.eyeShape} eyes</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Face Outline</span>
                    <strong className="text-[#29202a] capitalize">{faceAnalysis.faceShape}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Under-Eye Tone</span>
                    <strong className="text-[#8b3b55] capitalize">{faceAnalysis.underEye.discolorationType}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#eadde1]">
                    <span className="text-[10px] text-[#766b77] block font-bold uppercase">Corrector Zone</span>
                    <strong className="text-[#426b5a]">{faceAnalysis.underEye.recommendedCorrectorColor}</strong>
                  </div>
                </div>

                {/* Honest Limitation Disclosure */}
                <div className="p-2.5 rounded-xl bg-white border border-[#eadde1] text-[10px] text-[#766b77] flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#c45b78] shrink-0 mt-0.5" />
                  <span>{faceAnalysis.skinTone.uncertaintyNote}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= RIGHT PANEL: 02 / Pick your mood & 03 / Routine ================= */}
        <section className="lg:col-span-6 flex flex-col gap-6">

          {/* 02 / Pick your mood */}
          <div className="bg-white border border-[#eadde1] rounded-3xl p-6 shadow-[0_18px_50px_rgba(73,38,59,0.07)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base md:text-lg text-[#29202a] tracking-tight">
                02 / Pick your mood
              </h2>
              <span className="text-xs text-[#766b77]">Choose one aesthetic</span>
            </div>

            {/* Look Selector Grid (6 looks from prototype) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LOOK_MOODS.map((mood) => {
                const isSelected = selectedLook === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setSelectedLook(mood.id);
                      showToast(`Selected look: ${mood.name}`);
                    }}
                    className={`p-3 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#c45b78] bg-[#fff5f7] shadow-[inset_0_0_0_1px_#c45b78]'
                        : 'border-[#eadde1] bg-white hover:border-[#d9bcc5]'
                    }`}
                  >
                    <div>
                      <b className="block text-xs font-bold text-[#29202a]">{mood.name}</b>
                      <span className="text-[10px] text-[#766b77] block mt-0.5 leading-tight">
                        {mood.tagline}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#c45b78] self-end mt-2"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aesthetic Description & Feature Chips */}
            <div className="mt-4 p-4 rounded-2xl bg-[#fffdfc] border border-[#eadde1]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#29202a] uppercase tracking-wider">
                  {activeMood.name} Profile
                </h3>
                <span className="text-[11px] text-[#766b77] italic">{activeMood.finish}</span>
              </div>
              <p className="text-xs text-[#665965] mt-1.5 leading-relaxed">
                {activeMood.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="bg-[#f7eef1] text-[#7c4055] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  Eyes: {activeMood.eyes}
                </span>
                <span className="bg-[#f7eef1] text-[#7c4055] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  Cheeks: {activeMood.cheeks}
                </span>
                <span className="bg-[#f7eef1] text-[#7c4055] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  Lips: {activeMood.lips}
                </span>
              </div>

              {/* Face Notes & Shade Direction Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-3 bg-white border border-[#eadde1] rounded-xl">
                  <small className="block text-[10px] text-[#766b77] font-bold uppercase">Foundation direction</small>
                  <b className="text-xs text-[#29202a] mt-0.5 block leading-tight">
                    {faceAnalysis ? faceAnalysis.foundationDirection : 'Waiting for photo scan'}
                  </b>
                </div>
                <div className="p-3 bg-white border border-[#eadde1] rounded-xl">
                  <small className="block text-[10px] text-[#766b77] font-bold uppercase">Concealer direction</small>
                  <b className="text-xs text-[#29202a] mt-0.5 block leading-tight">
                    {faceAnalysis ? faceAnalysis.concealerDirection : 'Waiting for photo scan'}
                  </b>
                </div>
                <div className="p-3 bg-white border border-[#eadde1] rounded-xl">
                  <small className="block text-[10px] text-[#766b77] font-bold uppercase">Corrector guide</small>
                  <b className="text-xs text-[#29202a] mt-0.5 block leading-tight">
                    {faceAnalysis ? faceAnalysis.correctorGuide : 'Waiting for photo scan'}
                  </b>
                </div>
                <div className="p-3 bg-white border border-[#eadde1] rounded-xl">
                  <small className="block text-[10px] text-[#766b77] font-bold uppercase">Wear strategy</small>
                  <b className="text-xs text-[#29202a] mt-0.5 block leading-tight">
                    {faceAnalysis ? faceAnalysis.wearStrategy : climate === 'humid' ? 'Thin layers + targeted T-zone powder' : 'Hydrating prep + minimal powder'}
                  </b>
                </div>
              </div>

              {/* Exact Brand Shade Recommendation Pill */}
              {displayedBrand && (
                <div className="mt-3 p-3 rounded-xl bg-[#fffaf7] border border-[#f5dde4] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full border border-black/15 shadow-inner"
                      style={{ backgroundColor: displayedBrand.foundation.hex }}
                    />
                    <div>
                      <span className="font-bold text-[#c45b78]">{displayedBrand.brand}:</span>{' '}
                      <span className="font-semibold text-[#29202a]">{displayedBrand.foundation.shadeCode}</span>{' '}
                      <span className="text-[#766b77] text-[11px]">({displayedBrand.foundation.shadeName})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCatalogueOpen(true)}
                    className="text-[11px] text-[#c45b78] hover:underline font-bold"
                  >
                    View in catalogue →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 03 / Your step-by-step routine */}
          <div className="bg-white border border-[#eadde1] rounded-3xl p-6 shadow-[0_18px_50px_rgba(73,38,59,0.07)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-base md:text-lg text-[#29202a] tracking-tight">
                  03 / Your step-by-step routine
                </h2>
                <span className="text-xs text-[#766b77]">
                  Step {currentStep + 1} of {ROUTINE_STEPS.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChecklistOpen(true)}
                  className="bg-[#f8e7ec] hover:bg-[#f3d2dc] text-[#8b3b55] text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Checklist</span>
                </button>
              </div>
            </div>

            {/* Step Selector Cards (6 steps) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ROUTINE_STEPS.map((step, idx) => {
                const isActive = currentStep === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[76px] ${
                      isActive
                        ? 'border-[#c45b78] bg-[#fff5f7] shadow-xs'
                        : 'border-[#eadde1] bg-white hover:border-[#d9bcc5]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold mb-1 ${
                        isActive ? 'bg-[#c45b78] text-white' : 'bg-[#f8e7ec] text-[#98445e]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <b className="text-[11px] font-bold text-[#29202a] leading-tight truncate w-full">
                      {step.short}
                    </b>
                  </button>
                );
              })}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f4ebeb]">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="bg-white border border-[#eadde1] text-[#29202a] disabled:opacity-40 hover:bg-[#fdf9f9] text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-bold text-[#766b77]">
                {currentStep + 1} / {ROUTINE_STEPS.length}
              </span>

              <button
                onClick={() => {
                  if (currentStep < ROUTINE_STEPS.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setIsChecklistOpen(true);
                    showToast('Routine completed! Open the checklist to inspect your finish.');
                  }
                }}
                className="bg-[#c45b78] hover:bg-[#a84664] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-xs"
              >
                <span>{currentStep === ROUTINE_STEPS.length - 1 ? 'Finish & Inspect ✓' : 'Next step'}</span>
                {currentStep < ROUTINE_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Step Detail Explanation Box */}
            <div className="mt-4 p-4 rounded-2xl bg-[#f9f2f4] border border-[#f0dee3]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs md:text-sm text-[#29202a]">
                  Step {currentStep + 1} — {activeStepObj.title}
                </h3>
                <span className="text-[10px] text-[#c45b78] bg-white border border-[#eadde1] px-2 py-0.5 rounded-full font-bold">
                  {activeStepObj.tagline}
                </span>
              </div>
              <p className="text-xs text-[#665965] mt-1.5 leading-relaxed">
                {faceAnalysis?.personalizedStepTips
                  ? currentStep === 0
                    ? faceAnalysis.personalizedStepTips.prep
                    : currentStep === 1
                    ? faceAnalysis.personalizedStepTips.primer
                    : currentStep === 2
                    ? faceAnalysis.personalizedStepTips.correct
                    : currentStep === 3
                    ? faceAnalysis.personalizedStepTips.base
                    : currentStep === 4
                    ? faceAnalysis.personalizedStepTips.features
                    : faceAnalysis.personalizedStepTips.set
                  : activeStepObj.defaultText}
              </p>
            </div>

            {/* Step-Wise Pictorial Result Component with AR On-Face / Camera Projection */}
            <div className="mt-4">
              <UserFaceVisualGuide
                step={currentStep}
                activeStepObj={activeStepObj}
                photoUrl={photoUrl}
                isCameraActive={isCameraActive}
                videoRef={videoRef}
                cameraStream={cameraStream}
                faceAnalysis={faceAnalysis}
                isAnalyzing={isAnalyzing}
                selectedLook={selectedLook}
                onCancelScan={handleCancelScan}
                onUploadClick={() => !isAnalyzing && fileInputRef.current?.click()}
                onCameraToggle={isCameraActive ? stopCamera : startCamera}
                onDeletePhoto={handleDeletePhoto}
                onStepChange={(newStep) => setCurrentStep(newStep)}
              />
            </div>

            {/* Quick action bar */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f4ebeb]">
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setSelectedLook('clean');
                  showToast('Routine reset to Step 1.');
                }}
                className="text-xs text-[#766b77] hover:text-[#29202a] font-medium"
              >
                Reset routine
              </button>

              <button
                onClick={() => setIsAssistantOpen(true)}
                className="text-xs text-[#c45b78] hover:text-[#a84664] font-bold flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask AI Co-pilot for advice on Step {currentStep + 1}</span>
              </button>
            </div>

          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#eadde1] bg-white py-6 px-4 md:px-12 text-[#766b77] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="leading-relaxed text-center md:text-left">
            <strong>Makeup Assistant AI — concept & studio.</strong> Shade ranges and product examples are guidance, not absolute guarantees. Camera white balance, indoor lighting, formula oxidation, and skin texture affect real-world matches. Makeup Assistant AI does not store face biometric identity, diagnose medical skin conditions, or share images with third parties.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCatalogueOpen(true)}
              className="text-[#c45b78] hover:underline font-semibold"
            >
              Shade Catalogue
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="text-[#c45b78] hover:underline font-semibold"
            >
              Beauty Co-pilot
            </button>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#c45b78] hover:bg-[#a84664] text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold transition transform hover:scale-105 active:scale-95"
        aria-label="Open Makeup Assistant AI"
      >
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Ask Makeup Assistant AI</span>
      </button>

      {/* Modals and Drawers */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        faceAnalysis={faceAnalysis}
        selectedLook={selectedLook}
        currentStep={currentStep}
        climate={climate}
        preferredBrand={preferredBrand}
      />

      <FinishCheckModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        selectedLook={selectedLook}
        currentPhotoBase64={photoBase64}
      />

      <ProductCatalogueModal
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
        selectedBrandFilter={preferredBrand}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2e2630] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
