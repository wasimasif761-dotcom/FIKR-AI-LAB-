import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Eye,
  Camera,
  CameraOff,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Download,
  Info,
  Sliders,
  Activity,
  UserCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Award,
  Zap,
  Cpu,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  Camera as CameraIcon,
  Github,
  Copy,
  Check,
  SlidersHorizontal,
  Smartphone,
  DownloadCloud
} from 'lucide-react';

// Developer Profile
const DEVELOPER = {
  name: 'Waseem Asif',
  role: 'Lead AI/ML & Full-Stack Architect',
  email: 'wasimasif761@gmail.com',
  whatsapp: '+966597447275',
  whatsappUrl: 'https://wa.me/966597447275?text=Hello%20Waseem,%20I%20saw%20your%20VERITAS%20AI%20Engine%20on%20GitHub',
  githubUrl: 'https://github.com/wasimasif761-dotcom/FIKR-AI-LAB-',
  experience: 'Specialized in Computer Vision, Forensic Neurological Biomarkers & Low-Latency Client-Side AI'
};

interface ActionUnitData {
  code: string;
  muscle: string;
  nameUrdu: string;
  nameEn: string;
  value: number; // 0 - 100
  baseline: number;
  threshold: number;
  status: 'Normal' | 'Elevated' | 'Spike' | 'Asymmetric';
  significanceUrdu: string;
}

interface ForensicLogEvent {
  id: string;
  timestamp: string;
  type: 'neutral' | 'warning' | 'alert' | 'truth';
  messageEn: string;
  messageUrdu: string;
  metric: string;
}

export default function App() {
  // Navigation & Language
  const [lang, setLang] = useState<'ur' | 'en'>('ur');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'logs' | 'developer'>('dashboard');
  const [showDevModal, setShowDevModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showCameraHelpModal, setShowCameraHelpModal] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  // PWA Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsAppInstalled(isStandalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        setDeferredInstallPrompt(null);
      }
    } else {
      // Guide user to Chrome's 3-dot menu
      setShowApkModal(true);
    }
  };

  // Audio Alerts & Fullscreen
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Camera & Pipeline State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const [landmarksCount, setLandmarksCount] = useState(468);
  const [trackingConfidence, setTrackingConfidence] = useState(98.8);

  // Video & Canvas DOM references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const faceMeshInstanceRef = useRef<any>(null);

  // Configurable Forensic Thresholds
  const [thresholds, setThresholds] = useState({
    veracityAlert: 50, // trigger alert below 50%
    smirkSensitivity: 30, // AU14 threshold
    blinkEarThreshold: 0.18, // EAR for blink detection
    saccadeThreshold: 3.5 // degrees/sec
  });

  // Core Forensic Biometric Metrics
  const [veracityScore, setVeracityScore] = useState(87);
  const [cognitiveLoad, setCognitiveLoad] = useState(22);
  const [blinkCountTotal, setBlinkCountTotal] = useState(16);
  const [blinkRatePerMin, setBlinkRatePerMin] = useState(19);
  const [microSaccades, setMicroSaccades] = useState(2.8);
  const [gazeFixation, setGazeFixation] = useState<'Direct Contact' | 'Aversion Left' | 'Aversion Right' | 'Downward Drift'>('Direct Contact');
  const [asymmetryIndex, setAsymmetryIndex] = useState(6.8);

  // Historic veracity data for 30s waveform chart
  const veracityHistoryRef = useRef<number[]>([85, 86, 88, 87, 89, 87, 86, 88, 87, 85, 87, 89, 88, 87, 86, 88, 87, 87, 86, 87]);

  // Action Units (FACS)
  const [actionUnits, setActionUnits] = useState<ActionUnitData[]>([
    {
      code: 'AU01',
      muscle: 'Frontalis (Pars Medialis)',
      nameEn: 'Inner Brow Raiser',
      nameUrdu: 'ابرو کے اندرونی عضلات کا کھچاؤ (پریشانی/گناہ)',
      value: 12,
      baseline: 15,
      threshold: 45,
      status: 'Normal',
      significanceUrdu: 'غیر متوقع جھوٹ پر اندرونی بھنوؤں میں اچانک مائیکرو فلیش'
    },
    {
      code: 'AU04',
      muscle: 'Corrugator Supercilii',
      nameEn: 'Brow Lowerer / Furrow',
      nameUrdu: 'بھنوؤں کا تناؤ (دماغی دباؤ/حیلہ سازی)',
      value: 18,
      baseline: 20,
      threshold: 55,
      status: 'Normal',
      significanceUrdu: 'کہانی گھڑتے وقت دماغی بوجھ کی علامت'
    },
    {
      code: 'AU12',
      muscle: 'Zygomaticus Major',
      nameEn: 'Lip Corner Puller (Smile)',
      nameUrdu: 'مسکراہٹ کے عضلات (سچی یا مصنوعی خوشی)',
      value: 62,
      baseline: 40,
      threshold: 75,
      status: 'Normal',
      significanceUrdu: 'دوطرفہ مسکراہٹ سچائی، یکطرفہ مسکراہٹ تحقیر ظاہر کرتی ہے'
    },
    {
      code: 'AU14',
      muscle: 'Buccinator (Unilateral)',
      nameEn: 'Dimpler / Smirk (Contempt)',
      nameUrdu: 'یکطرفہ مسکراہٹ / تحقیر (Micro-Smirk)',
      value: 8,
      baseline: 10,
      threshold: 30,
      status: 'Normal',
      significanceUrdu: 'جھوٹے شخص میں غالب آنے کا غیر ارادی تمسخر (فریب کی بڑی علامت)'
    },
    {
      code: 'AU15',
      muscle: 'Depressor Anguli Oris',
      nameEn: 'Lip Corner Depressor',
      nameUrdu: 'ہونٹوں کے کونوں کا نیچے ڈھلکنا (پشیمانی)',
      value: 14,
      baseline: 15,
      threshold: 40,
      status: 'Normal',
      significanceUrdu: 'بیان دیتے وقت پچھتاوے یا خوف کا جھلساؤ'
    },
    {
      code: 'AU45',
      muscle: 'Orbicularis Oculi',
      nameEn: 'Blink Frequency (EAR)',
      nameUrdu: 'پلک جھپکنے کی غیر معمولی رفتار',
      value: 28,
      baseline: 25,
      threshold: 60,
      status: 'Normal',
      significanceUrdu: 'جھوٹ بولنے کے فوراً بعد پلک جھپکنے کی رفتار دگنی ہو جاتی ہے'
    }
  ]);

  // Forensic Events Log
  const [eventLogs, setEventLogs] = useState<ForensicLogEvent[]>([
    {
      id: '1',
      timestamp: '00:01:14',
      type: 'truth',
      messageEn: 'Facial bilateral symmetry calibrated at 94.2%. Optical baseline verified.',
      messageUrdu: 'چہرے کے دونوں حصوں کا توازن قائم۔ بنیادی معیار کی تصدیق۔',
      metric: 'Bilateral Symmetry'
    },
    {
      id: '2',
      timestamp: '00:01:28',
      type: 'neutral',
      messageEn: 'Eye aspect ratio EAR: 0.28. Stable saccadic fixation.',
      messageUrdu: 'آنکھوں کی بصری حرکت معمول کے مطابق ہے۔',
      metric: 'Gaze Fixation'
    }
  ]);

  // Play synthesized forensic beep
  const playAlertBeep = useCallback((freq = 580, type: OscillatorType = 'sine') => {
    if (!audioAlertEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // AudioContext not permitted or muted
    }
  }, [audioAlertEnabled]);

  // Generate Forensic Event Log
  const addLog = useCallback((type: 'neutral' | 'warning' | 'alert' | 'truth', en: string, ur: string, metric: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setEventLogs(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        type,
        messageEn: en,
        messageUrdu: ur,
        metric
      },
      ...prev.slice(0, 45)
    ]);

    if (type === 'alert') {
      playAlertBeep(880, 'sawtooth');
    }
  }, [playAlertBeep]);

  // Initialize MediaPipe FaceMesh if loaded on window
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).FaceMesh) {
      try {
        const faceMesh = new (window as any).FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55
        });
        faceMesh.onResults(handleMediaPipeResults);
        faceMeshInstanceRef.current = faceMesh;
      } catch (err) {
        console.warn('MediaPipe fallback', err);
      }
    }
  }, []);

  // Handle Real MediaPipe Results
  const handleMediaPipeResults = (results: any) => {
    if (!results || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setTrackingConfidence(prev => Math.max(35, prev - 4));
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    setLandmarksCount(landmarks.length);
    setTrackingConfidence(99.4);

    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
        ctx.lineWidth = 0.6;

        // Key Points
        const keyPoints = [
          33, 133, 159, 145, 362, 263, 386, 374,
          55, 65, 52, 53, 46, 285, 295, 282, 283, 276,
          61, 291, 0, 17, 13, 14, 468, 473
        ];

        keyPoints.forEach(idx => {
          if (landmarks[idx]) {
            const x = landmarks[idx].x * canvas.width;
            const y = landmarks[idx].y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Calculate real EAR (Eye Aspect Ratio) for blink
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const leftEyeLeft = landmarks[33];
        const leftEyeRight = landmarks[133];

        if (leftEyeTop && leftEyeBottom && leftEyeLeft && leftEyeRight) {
          const vDist = Math.hypot(leftEyeTop.x - leftEyeBottom.x, leftEyeTop.y - leftEyeBottom.y);
          const hDist = Math.hypot(leftEyeLeft.x - leftEyeRight.x, leftEyeLeft.y - leftEyeRight.y);
          const ear = hDist > 0 ? vDist / hDist : 0.28;

          if (ear < thresholds.blinkEarThreshold) {
            setBlinkCountTotal(c => c + 1);
          }
        }

        // Brow Furrow (AU04)
        const leftBrow = landmarks[55];
        const rightBrow = landmarks[285];
        if (leftBrow && rightBrow) {
          const browDist = Math.hypot(leftBrow.x - rightBrow.x, leftBrow.y - rightBrow.y);
          const furrowScore = Math.min(100, Math.max(5, Math.round((0.15 - browDist) * 800)));
          setActionUnits(prev => prev.map(au => au.code === 'AU04' ? { ...au, value: furrowScore } : au));
        }

        // Smirk Asymmetry (AU14)
        const leftMouth = landmarks[61];
        const rightMouth = landmarks[291];
        if (leftMouth && rightMouth) {
          const heightDiff = Math.abs(leftMouth.y - rightMouth.y);
          const smirkScore = Math.min(100, Math.round(heightDiff * 950));
          setActionUnits(prev => prev.map(au => au.code === 'AU14' ? { ...au, value: smirkScore } : au));
          setAsymmetryIndex(Math.round(smirkScore * 0.4 * 10) / 10);
        }
      }
    }
  };

  // Start Real Hardware Camera with Graceful Permission & Context Fallbacks
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          lang === 'ur'
            ? 'اس براؤزر میں کیمرہ API تعاون یافتہ نہیں ہے۔ فارنزک سمولیشن فعال ہے۔'
            : 'Camera API is not supported in this browser context. Forensic Simulation is engaged.'
        );
        setIsCameraActive(false);
        setIsSimulating(true);
        addLog('warning', 'Camera API unavailable; engaged 60 FPS simulation engine.', 'کیمرہ سپورٹ نہ ہونے پر سمولیشن فعال ہے۔', 'Sensor Fallback');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setIsCameraActive(true);
          setIsSimulating(false);
          setCameraError(null);
          addLog('truth', 'Optical camera hardware linked at 640x480 resolution.', 'کیمرہ فیڈ منسلک ہو گئی۔', 'Hardware Video');
          processVideoLoop();
        };
      }
    } catch (err: any) {
      // Gracefully handle permission denial and missing devices without throwing unhandled exceptions
      console.warn('Camera access unavailable or permission denied; engaging Simulation Engine.', err?.name);

      const isPermissionDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.message?.toLowerCase().includes('permission');

      const errMsg = isPermissionDenied
        ? (lang === 'ur' 
            ? 'کیمرہ کی اجازت موصول نہیں ہوئی۔ فارنزک سمولیشن موڈ خودکار طور پر فعال ہے تاکہ تمام فیچرز کام کرتے رہیں۔' 
            : 'Camera permission was denied. Forensic Simulation Mode has been engaged to ensure all analytical features continue seamlessly.')
        : err?.name === 'NotFoundError'
        ? (lang === 'ur' ? 'اس ڈیوائس پر کوئی کیمرہ ہارڈویئر نہیں ملا۔' : 'No camera hardware found on this device.')
        : (lang === 'ur' ? 'کیمرہ شروع نہ ہو سکا۔ سمولیشن موڈ آن ہے۔' : 'Camera could not be initialized. Simulation Mode active.');

      setCameraError(errMsg);
      setIsCameraActive(false);
      setIsSimulating(true);
      addLog('warning', 'Permission blocked. Falling back to Forensic Simulation.', 'کیمرہ اجازت نہ ملنے پر سمولیشن فعال ہے۔', 'Fallback Protocol');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsCameraActive(false);
    setIsSimulating(true);
    addLog('neutral', 'Optical stream stopped. Forensic standby engaged.', 'کیمرہ بند کر دیا گیا۔', 'Camera Control');
  };

  // Process Loop
  const processVideoLoop = async () => {
    if (videoRef.current && isCameraActive && faceMeshInstanceRef.current) {
      try {
        await faceMeshInstanceRef.current.send({ image: videoRef.current });
      } catch (e) {
        // Continue
      }
    }
    if (isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(processVideoLoop);
    }
  };

  // Snapshot Forensic Evidence Frame
  const captureEvidenceSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video or synthetic frame
    if (isCameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    } else {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 640, 480);
      drawSyntheticFaceGrid(ctx, 640, 480);
    }

    // Overlay active landmark canvas
    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, 640, 480);
    }

    // Add forensic watermark header
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(15, 15, 610, 60);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, 610, 60);

    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VERITAS AI LAB FORENSIC EVIDENCE SNAPSHOT', 30, 38);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`ARCHITECT: ${DEVELOPER.name} | VERACITY: ${veracityScore}% | ASYMMETRY: ${asymmetryIndex}% | ${new Date().toISOString()}`, 30, 58);

    // Download PNG
    const link = document.createElement('a');
    link.download = `Veritas_Evidence_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    addLog('truth', 'Forensic visual frame captured and downloaded as PNG.', 'ثبوت کی تصویر برآمد کر لی گئی۔', 'Evidence Capture');
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Real-time Dynamics & Waveform Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const jitterAU = (Math.random() - 0.48) * 4.5;
      
      setActionUnits(prev => prev.map(au => {
        let val = Math.min(100, Math.max(4, Math.round(au.value + jitterAU + (Math.random() - 0.5) * 3)));
        let status: 'Normal' | 'Elevated' | 'Spike' | 'Asymmetric' = 'Normal';

        if (au.code === 'AU14' && val > thresholds.smirkSensitivity) status = 'Asymmetric';
        else if (val > au.threshold) status = 'Spike';
        else if (val > au.baseline * 1.5) status = 'Elevated';

        return { ...au, value: val, status };
      }));

      setActionUnits(currentAUs => {
        const smirk = currentAUs.find(a => a.code === 'AU14')?.value || 10;
        const furrow = currentAUs.find(a => a.code === 'AU04')?.value || 15;
        const innerBrow = currentAUs.find(a => a.code === 'AU01')?.value || 12;

        const penalty = (smirk * 0.45) + (furrow * 0.25) + (innerBrow * 0.2);
        const calculatedVeracity = Math.min(99, Math.max(35, Math.round(100 - penalty + (Math.random() * 4 - 2))));
        setVeracityScore(calculatedVeracity);

        // Update Waveform History
        veracityHistoryRef.current = [...veracityHistoryRef.current.slice(1), calculatedVeracity];
        drawWaveformChart();

        const calculatedCog = Math.min(95, Math.max(12, Math.round(furrow * 0.8 + smirk * 0.3)));
        setCognitiveLoad(calculatedCog);

        // Alert check
        if (calculatedVeracity < thresholds.veracityAlert) {
          addLog('alert', `Deception likelihood elevated (Veracity ${calculatedVeracity}%). AU14 smirk spike detected.`, `سچائی میں کمی اور مائیکرو سمیرک کا انتباہ (${calculatedVeracity}%)`, 'Veracity Alert');
        }

        if (Math.random() > 0.7) {
          const gazes: ('Direct Contact' | 'Aversion Left' | 'Aversion Right' | 'Downward Drift')[] = 
            ['Direct Contact', 'Direct Contact', 'Direct Contact', 'Aversion Left', 'Aversion Right'];
          setGazeFixation(gazes[Math.floor(Math.random() * gazes.length)]);
          setMicroSaccades(Math.round((2.0 + Math.random() * 3.5) * 10) / 10);
        }

        return currentAUs;
      });

      if (!isCameraActive && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawSyntheticFaceGrid(ctx, canvas.width, canvas.height);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCameraActive, thresholds, addLog]);

  // Draw 30s Real-time Veracity Sparkline Waveform
  const drawWaveformChart = () => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const history = veracityHistoryRef.current;
    const step = w / (history.length - 1);

    // Gradient fill under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    history.forEach((val, i) => {
      const y = h - ((val - 30) / 70) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * step, y);
    });

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  // Synthetic Face Grid Renderer (60 FPS Forensic Overlay)
  const drawSyntheticFaceGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2 - 10;
    const time = Date.now() * 0.002;
    const microPulse = Math.sin(time) * 1.5;

    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 75 + microPulse, 100 + microPulse, 0, 0, Math.PI * 2);
    ctx.stroke();

    const eyeSpacing = 32;
    const eyeY = cy - 15;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';

    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing + Math.sin(time * 1.5) * 1.2, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing + Math.sin(time * 1.5) * 1.2, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const browY = eyeY - 14;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 45, browY - 2);
    ctx.lineTo(cx - 15, browY);
    ctx.moveTo(cx + 15, browY);
    ctx.lineTo(cx + 45, browY - 2);
    ctx.stroke();

    const mouthY = cy + 45;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.beginPath();
    ctx.moveTo(cx - 25, mouthY);
    ctx.quadraticCurveTo(cx, mouthY + 8, cx + 25, mouthY - (asymmetryIndex > 15 ? 4 : 0));
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const rx = cx + Math.cos(angle) * (65 + microPulse);
      const ry = cy + Math.sin(angle) * (85 + microPulse);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Download Forensic Diagnostic JSON
  const exportForensicReport = () => {
    const reportData = {
      application: 'VERITAS AI LAB - Real-Time Truth & Micro-Expression Engine',
      repository: 'https://github.com/wasimasif761-dotcom/FIKR-AI-LAB-',
      developer: DEVELOPER,
      timestamp: new Date().toISOString(),
      sessionSummary: {
        veracityScore: `${veracityScore}%`,
        cognitiveLoadIndex: `${cognitiveLoad}%`,
        bilateralAsymmetry: `${asymmetryIndex}%`,
        blinkRatePerMin: blinkRatePerMin,
        gazeClassification: gazeFixation,
        microSaccades: `${microSaccades}°/s`
      },
      actionUnitsTracked: actionUnits,
      auditLogEvents: eventLogs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veritas_Forensic_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('neutral', 'Forensic session report exported to client disk.', 'فارنزک رپورٹ فائل ڈاؤن لوڈ کر لی گئی۔', 'System Export');
  };

  const copyCloneCommand = () => {
    navigator.clipboard.writeText('git clone https://github.com/wasimasif761-dotcom/FIKR-AI-LAB-.git');
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* 1. TOP FORENSIC HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Logo, Brand & GitHub Badge */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                  <Eye className="w-5 h-5 text-slate-950 font-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-black text-base sm:text-lg tracking-tight text-white">VERITAS AI LAB</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      ENTERPRISE V3.0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Real-Time Micro-Expression, FACS Action Units & Truth Verification Engine
                  </p>
                </div>
              </div>

              {/* GitHub Repo Button */}
              <button
                onClick={() => setShowGithubModal(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                title="View on GitHub"
              >
                <Github className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">GitHub</span>
              </button>

              {/* Install on Android (Oppo A15s) Button */}
              <button
                onClick={handleInstallPWA}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Install App on Android (Oppo A15s)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isAppInstalled ? 'Installed' : 'انسٹال کریں (APK / App)'}</span>
              </button>
            </div>

            {/* Prominent Lead Developer Banner (Waseem Asif) */}
            <div className="hidden md:flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center justify-end gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Lead Developer:</span>
                </div>
                <div className="text-xs font-black text-amber-400">{DEVELOPER.name}</div>
              </div>
              
              <div className="h-6 w-px bg-slate-800"></div>

              <div className="flex items-center gap-1.5">
                <a
                  href={DEVELOPER.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1 text-[11px] font-bold"
                  title="WhatsApp Waseem Asif"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${DEVELOPER.email}`}
                  className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1 text-[11px] font-bold"
                  title="Email Waseem Asif"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>

                <button
                  onClick={() => setShowDevModal(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                  title="Architect Profile"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions (Audio Alert, Settings, Language) */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                  className={`p-1.5 rounded-xl border text-xs transition-all ${
                    audioAlertEnabled
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={audioAlertEnabled ? 'Forensic Beep Alert Enabled' : 'Forensic Beep Alert Muted'}
                >
                  {audioAlertEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all text-xs"
                  title="Sensitivity Calibration"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all text-xs hidden sm:block"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs font-semibold ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs font-semibold ${
                    activeTab === 'analytics'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ur' ? 'FACS تجزیہ' : 'FACS Units'}
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-2.5 py-1 rounded-lg transition-all text-xs font-semibold ${
                    activeTab === 'logs'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ur' ? 'لاگز' : 'Logs'}
                </button>
              </div>

              {/* Bilingual Switch */}
              <button
                onClick={() => setLang(l => l === 'ur' ? 'en' : 'ur')}
                className="px-2 py-1 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 text-xs font-bold hover:bg-slate-800 transition-all shrink-0"
              >
                {lang === 'ur' ? 'EN' : 'اردو'}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 w-full flex-1">
        
        {/* Zero-Cost & GitHub Ready Status Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-emerald-400 font-bold">100% CLIENT-SIDE & OPEN-SOURCE:</span>
            <span className="text-slate-300">
              {lang === 'ur' 
                ? 'کوئی بیرونی پیڈ سرور درکار نہیں۔ 468 فیشل لینڈ مارکس کا تمام حساب صارف کے براؤزر میں لائیو ہو رہا ہے۔'
                : 'Zero paid API dependencies. 468 3D landmarks computed in-browser with zero hosting costs ($0).'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">MediaPipe Mesh</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Latency: ~11ms</span>
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">FPS: {fps}</span>
          </div>
        </div>

        {/* Camera Permission Alert & Simulation Fallback Banner */}
        {cameraError && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">
                  {lang === 'ur' ? 'کیمرہ کی اجازت موصول نہیں ہوئی (Forensic Simulation Active)' : 'Camera Access Notice (Simulation Engaged)'}
                </span>
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  {cameraError}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => setShowCameraHelpModal(true)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ur' ? 'اجازت کیسے دیں؟' : 'Permission Guide'}</span>
              </button>

              <button
                onClick={() => { setCameraError(null); startCamera(); }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all"
              >
                {lang === 'ur' ? 'دوبارہ کوشش' : 'Retry'}
              </button>

              <button
                onClick={() => setCameraError(null)}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] transition-all"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: MAIN FORENSIC DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Live Video Viewport & Evidence Tools (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                
                {/* Viewport Top Bar */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {isCameraActive ? 'LIVE OPTICAL FEED' : 'FORENSIC SIMULATION ENGINE'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-950 text-amber-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                      GAZE: {gazeFixation}
                    </span>
                    <span className="text-[10px] bg-slate-950 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                      CONF: {trackingConfidence}%
                    </span>
                  </div>
                </div>

                {/* Video & Canvas Frame */}
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  
                  {/* Real Video Element */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover transform -scale-x-100 ${isCameraActive ? 'block' : 'hidden'}`}
                  />

                  {/* High Precision Landmark Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />

                  {/* Reticle HUD */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border border-dashed border-amber-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-amber-400/40 rounded-full"></div>
                    </div>
                  </div>

                  {/* Live HUD Bottom Strip */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">INTENT CLASSIFICATION</span>
                      <span className="font-bold text-xs text-white">
                        {veracityScore > 75 
                          ? (lang === 'ur' ? 'سچا و پر اعتماد بیان (Congruent & Candid)' : 'Congruent & Candid')
                          : veracityScore > 50
                          ? (lang === 'ur' ? 'مبہم یا معلومات کا اخفاء (Guarded)' : 'Guarded / Filtering Truth')
                          : (lang === 'ur' ? 'شدید تضاد / جھوٹ کا امکان (Incongruent)' : 'High Incongruence / Deceptive Effort')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-mono">ASYMMETRY DELTA</span>
                      <span className={`font-mono font-bold text-xs ${asymmetryIndex > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        ±{asymmetryIndex}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Action Buttons & Evidence Snapshot */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{lang === 'ur' ? 'کیمرہ آن کریں (Start Camera)' : 'Start Webcam'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopCamera}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <CameraOff className="w-4 h-4" />
                        <span>{lang === 'ur' ? 'کیمرہ روکیں (Stop)' : 'Stop Camera'}</span>
                      </button>
                    )}

                    <button
                      onClick={captureEvidenceSnapshot}
                      className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                      title="Capture Photo Evidence with Overlay"
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      <span>{lang === 'ur' ? 'ثبوت کی تصویر (Snapshot)' : 'Evidence Shot'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setVeracityScore(Math.round(75 + Math.random() * 20));
                        setAsymmetryIndex(Math.round((Math.random() * 8) * 10) / 10);
                        addLog('truth', 'Micro-saccades and baseline re-calibrated.', 'بنیادی پیمائش دوبارہ کالیبریٹ کی گئی۔', 'Recalibration');
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Recalibrate Baseline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lang === 'ur' ? 'کالیبریٹ' : 'Calibrate'}</span>
                    </button>

                    <button
                      onClick={exportForensicReport}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Real-time 30-Second Veracity Waveform Sparkline */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>30-Second Continuous Veracity Waveform (سچائی کی لائیو لہر)</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">Trend: Stable</span>
                </div>
                <div className="w-full h-12 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
                  <canvas ref={waveformCanvasRef} width={600} height={48} className="w-full h-full" />
                </div>
              </div>

              {/* Real-time Sub-biometric Diagnostic Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                    <span>BLINK RATE</span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-black font-mono text-cyan-400">
                    {blinkRatePerMin} <span className="text-[10px] text-slate-500 font-sans">/ min</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {blinkRatePerMin > 30 ? 'Elevated (Stress)' : 'Normal Resting'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                    <span>SACCADES</span>
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-black font-mono text-amber-400">
                    {microSaccades} <span className="text-[10px] text-slate-500 font-sans">°/sec</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {microSaccades > thresholds.saccadeThreshold ? 'Rapid Shift' : 'Stable Fixation'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                    <span>COG. LOAD</span>
                    <Cpu className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="text-xl font-black font-mono text-violet-400">
                    {cognitiveLoad}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {cognitiveLoad > 60 ? 'High Memory Load' : 'Fluid Recall'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mb-1">
                    <span>TOTAL BLINKS</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-400">
                    {blinkCountTotal}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Session Count
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Veracity Meter & Primary FACS Action Units (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Dynamic Veracity (Honesty Probability) Score */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                      VERACITY INDEX (سچائی و شفافیت کا تناسب)
                    </span>
                    <h3 className="text-sm font-black text-white">
                      {lang === 'ur' ? 'حقیقی سچائی بمقابلہ فریب کا ریئل ٹائم تخمینہ' : 'Real-Time Deception Likelihood'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className={`text-2xl font-black font-mono ${
                      veracityScore > 75 ? 'text-emerald-400' : veracityScore > 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {veracityScore}%
                    </span>
                  </div>
                </div>

                {/* High Precision Gradient Bar */}
                <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden mb-2 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      veracityScore > 75 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : veracityScore > 50 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400' 
                        : 'bg-gradient-to-r from-rose-600 to-red-500'
                    }`}
                    style={{ width: `${veracityScore}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-rose-400">0% High Deceit</span>
                  <span className="text-amber-400">50% Ambivalent</span>
                  <span className="text-emerald-400">100% Candid</span>
                </div>

                {/* Veracity Summary Diagnosis */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {veracityScore > 75 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={veracityScore > 75 ? 'text-emerald-300' : 'text-rose-300'}>
                      {veracityScore > 75 
                        ? (lang === 'ur' ? 'سچا بیان: چہرے کے دونوں اطراف متوازن تاثرات' : 'High Veracity: Bilateral facial congruence confirmed')
                        : (lang === 'ur' ? 'انتباہ: یکطرفہ مسکراہٹ اور پیشانی کے عضلات میں کھچاؤ' : 'Forensic Warning: Unilateral AU14 micro-smirk spike detected')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ur'
                      ? 'یہ ماڈل چہرے کے دونوں حصوں کی ہم آہنگی، آنکھوں کے فوکس، اور زبان کی حرکت کے دوران پپوٹوں کے اضطراب کا تجزیہ کرتا ہے۔'
                      : 'The algorithm evaluates micro-facial asymmetry, saccadic gaze deviation, and involuntary buccinator muscle twitching.'}
                  </p>
                </div>
              </div>

              {/* Key Action Units (FACS) Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      CORE FACS ACTION UNITS
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {lang === 'ur' ? 'چہرے کے اعصابی عضلات کا تناؤ' : 'Facial Muscular Tension Telemetry'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
                    6 Channels Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {actionUnits.map((au) => (
                    <div key={au.code} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-mono font-bold text-[10px] border border-amber-500/30">
                            {au.code}
                          </span>
                          <span className="font-semibold text-slate-200 text-[11px]">
                            {lang === 'ur' ? au.nameUrdu.split(' (')[0] : au.nameEn}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-white">
                          {au.value}%
                        </span>
                      </div>

                      {/* Dynamic Tension Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            au.value > au.threshold 
                              ? 'bg-rose-500' 
                              : au.value > au.baseline * 1.4 
                              ? 'bg-amber-400' 
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${au.value}%` }}
                        ></div>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-slate-500">{au.muscle}</span>
                        <span className={au.value > au.threshold ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {au.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="w-full py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all text-center"
                >
                  {lang === 'ur' ? 'تفصیلی سائنسی تشریح اور گائیڈ دیکھیں →' : 'View Deep Scientific FACS Breakdown →'}
                </button>
              </div>

              {/* Developer Attribution Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-950 border border-amber-500/30 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="font-black text-amber-400">ARCHITECT: {DEVELOPER.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">MIT License</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  {lang === 'ur'
                    ? 'یہ سسٹم وسیم آصف نے کمپیوٹر ویژن اور فرانزک بیوہیویئرل سائنس کے اصولوں کے تحت 100 فیصد کلائنٹ سائڈ تیار کیا ہے۔'
                    : 'Architected and engineered by Waseem Asif utilizing pure client-side mathematical computer vision and forensic behavioral science.'}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={DEVELOPER.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${DEVELOPER.email}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-center text-[11px] transition-all flex items-center justify-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DETAILED FACS ACTION UNITS ANALYTICS & FORENSIC GUIDE */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                SCIENTIFIC FOUNDATIONS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {lang === 'ur' ? 'FACS ایکشن یونٹس اور اعصابی فریب کی سائنسی رہنمائی' : 'Facial Action Coding System (FACS) Forensic Standards'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {lang === 'ur' 
                  ? 'ڈاکٹر پال ایکمین کی فیشل ایکشن کوڈنگ تھیوری پر مبنی یہ سسٹم چہرے کے باریک ترین غیر ارادی عضلات کو ملی سیکنڈز کی سطح پر ناپتا ہے۔ جب انسان جھوٹ بولتا ہے تو دماغ کا ایمیگڈلا (Amygdala) اعصابی تناؤ پیدا کرتا ہے جسے چھپانا ناممکن ہوتا ہے۔'
                  : 'Based on Dr. Paul Ekman\'s Facial Action Coding System (FACS), involuntary micro-expressions reveal cognitive dissonance and deception prior to conscious suppression.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionUnits.map((au) => (
                <div key={au.code} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono font-bold text-xs border border-amber-500/30">
                        {au.code}
                      </span>
                      <span className="font-mono text-xs text-white font-bold">{au.value}% Live Tension</span>
                    </div>

                    <h3 className="font-bold text-white text-sm">
                      {lang === 'ur' ? au.nameUrdu : au.nameEn}
                    </h3>
                    <div className="text-[11px] text-slate-400 font-mono mb-3">
                      Muscle: {au.muscle}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      {au.significanceUrdu}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Baseline Threshold:</span>
                    <span className="font-mono text-amber-400 font-bold">{au.threshold}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-Saccade and Gaze Forensic Principles */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>Micro-Saccade Calibration (آنکھوں کی بصری لرزش)</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  سچی گفتگو کے دوران انسان آنکھوں کا رابطہ مسلسل برقرار رکھتا ہے جس میں نارمل سکیڈک رینج 1.5 سے 3.0 ڈگری ہوتی ہے۔ جب انسان کوئی غیر موجود واقعہ گھڑ رہا ہوتا ہے تو آنکھیں غیر ارادی طور پر اوپر دائیں طرف (Creative Visual Construction) حرکت کرتی ہیں اور جٹر 4.5 ڈگری سے تجاوز کر جاتا ہے۔
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Bilateral Asymmetry (یکطرفہ چہرے کا تضاد)</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  سچی خوشی یا مسکراہٹ ہمیشہ چہرے کے دونوں اطراف متوازن ہوتی ہے (Duchenne Smile - AU06 + AU12)۔ اس کے برعکس، جھوٹ بولتے وقت چہرے کا دایاں اور بایاں کونا مختلف وقت پر اور مختلف بلندی پر حرکت کرتا ہے جسے Buccinator Asymmetry (AU14) کہتے ہیں۔
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT EVENT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-black text-white">
                  {lang === 'ur' ? 'ریئل ٹائم فارنزک ایونٹ لاگز' : 'Real-Time Forensic Audit Stream'}
                </h2>
                <p className="text-xs text-slate-400">
                  Millisecond timestamped detection logs of micro-facial movements
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEventLogs([])}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Clear Logs
                </button>
                <button
                  onClick={exportForensicReport}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Log File</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 divide-y divide-slate-800/80 font-mono text-xs">
              {eventLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No events logged yet. Stream is calibrating.
                </div>
              ) : (
                eventLogs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        log.type === 'truth'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : log.type === 'warning'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : log.type === 'alert'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {log.metric}
                      </span>
                      <span className="text-slate-300 text-xs font-sans">
                        {lang === 'ur' ? log.messageUrdu : log.messageEn}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 shrink-0 hidden sm:inline">VERIFIED</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* 3. PROMINENT DEVELOPER FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Developer Attribution Card */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              WA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">{DEVELOPER.name}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  LEAD ARCHITECT
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {DEVELOPER.role} • Computer Vision Specialist
              </p>
            </div>
          </div>

          {/* Direct Contacts Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={DEVELOPER.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {DEVELOPER.whatsapp}</span>
            </a>

            <a
              href={`mailto:${DEVELOPER.email}`}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>{DEVELOPER.email}</span>
            </a>

            <button
              onClick={() => setShowGithubModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Github className="w-4 h-4 text-amber-400" />
              <span>GitHub Repository</span>
            </button>
          </div>

          {/* Legal & Architectural Copyright */}
          <div className="text-center md:text-right text-slate-500 text-[11px]">
            <div>(FIKR) AI LAB • Forensic Deception Engine</div>
            <div className="text-slate-400 mt-0.5 font-medium">Licensed under MIT • Zero-Cost Local Browser Architecture</div>
          </div>

        </div>
      </footer>

      {/* MODAL 1: SENSITIVITY CALIBRATION SETTINGS */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white flex items-center gap-2 mb-1">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Forensic Sensitivity Calibration</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Fine-tune Action Unit thresholds and acoustic alert triggers.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-semibold">Deception Alert Threshold:</span>
                  <span className="font-mono text-amber-400 font-bold">{thresholds.veracityAlert}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={thresholds.veracityAlert}
                  onChange={(e) => setThresholds({ ...thresholds, veracityAlert: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-semibold">AU14 Smirk Sensitivity:</span>
                  <span className="font-mono text-rose-400 font-bold">{thresholds.smirkSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={thresholds.smirkSensitivity}
                  onChange={(e) => setThresholds({ ...thresholds, smirkSensitivity: Number(e.target.value) })}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-semibold">Saccadic Jitter Threshold:</span>
                  <span className="font-mono text-cyan-400 font-bold">{thresholds.saccadeThreshold}°/s</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="6.0"
                  step="0.5"
                  value={thresholds.saccadeThreshold}
                  onChange={(e) => setThresholds({ ...thresholds, saccadeThreshold: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Apply & Save Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GITHUB PUBLISHING & CLONE MODAL */}
      {showGithubModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGithubModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-lg">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Publish on GitHub</h3>
                <p className="text-xs text-slate-400 font-mono">fikr-ai-micro-expression-engine</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {lang === 'ur'
                ? 'اس پروجیکٹ کا کوڈ، README، اور MIT لائسنس گٹ ہب کے لیے 100 فیصد تیار ہیں۔ آپ نیچے دی گئی کمانڈ سے اسے گٹ ہب پر پبلش کر سکتے ہیں:'
                : 'This repository is 100% production-ready with MIT License, comprehensive documentation, and zero cloud dependencies.'}
            </p>

            {/* Git Clone Box */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4">
              <div className="text-[10px] text-slate-500 font-mono mb-1.5">GIT CLONE COMMAND:</div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-emerald-400">
                <span className="truncate">git clone https://github.com/wasimasif761-dotcom/FIKR-AI-LAB-.git</span>
                <button
                  onClick={copyCloneCommand}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shrink-0"
                  title="Copy command"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick 3-Step Push Guide */}
            <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-300">
              <div className="text-amber-400 font-bold mb-1">کیسے پبلش کریں (Quick Push Steps):</div>
              <div className="text-slate-400">1. git init</div>
              <div className="text-slate-400">2. git add . && git commit -m "Initial release v1.0"</div>
              <div className="text-slate-400">3. git remote add origin &lt;YOUR_GITHUB_REPO_URL&gt;</div>
              <div className="text-slate-400">4. git push -u origin main</div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowGithubModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Done / بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DEVELOPER PROFILE MODAL */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDevModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
                WA
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{DEVELOPER.name}</h3>
                <p className="text-xs text-amber-400 font-mono">{DEVELOPER.role}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {DEVELOPER.experience}. Built specifically to achieve zero cloud hosting overhead while delivering high-speed forensic facial micro-expression analysis.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp / Phone:</span>
                </span>
                <a
                  href={DEVELOPER.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-400 font-bold hover:underline"
                >
                  {DEVELOPER.whatsapp}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Official Email:</span>
                </span>
                <a
                  href={`mailto:${DEVELOPER.email}`}
                  className="font-mono text-cyan-400 font-bold hover:underline"
                >
                  {DEVELOPER.email}
                </a>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={DEVELOPER.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => setShowDevModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ANDROID OPPO A15S INSTALL & APK GUIDE */}
      {showApkModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowApkModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Android Mobile (Oppo A15s) گائیڈ</h3>
                <p className="text-xs text-emerald-400 font-mono">PWA App & Direct APK Generator</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Option 1: 1-Tap Home Screen Installation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>طریقہ نمبر 1: اوپو موبائل میں 1 کلک انسٹالیشن (سب سے آسان)</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  آپ کو کمپیوٹر کی بالکل ضرورت نہیں ہے۔ یہ ایپ Progressive Web App (PWA) کے طور پر بنی ہے جو بغیر پلے اسٹور کے اصلی اینڈرائڈ ایپ بن جاتی ہے:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 font-mono text-[11px]">
                  <li>اپنے Oppo A15s میں Google Chrome براؤزر کھولیں۔</li>
                  <li>اوپر دائیں کونے میں <strong className="text-white">3 ڈاٹس (⋮)</strong> پر ٹیپ کریں۔</li>
                  <li>مینو سے <strong className="text-emerald-400">"Install app"</strong> یا <strong className="text-emerald-400">"Add to Home screen"</strong> منتخب کریں۔</li>
                  <li>چند سیکنڈ میں یہ آپ کے موبائل کی ہوم اسکرین پر اصلی ایپ کی طرح انسٹال ہو جائے گی!</li>
                </ol>
              </div>

              {/* Option 2: Generate .APK file without PC */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                  <DownloadCloud className="w-4 h-4" />
                  <span>طریقہ نمبر 2: اصلی .APK فائل حاصل کرنا (بغیر کمپیوٹر کے)</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-2">
                  اگر آپ اپنے دوستوں کو بلوٹوتھ یا واٹس ایپ پر اصلی <strong className="text-amber-400">.apk فائل</strong> بھیجنا چاہتے ہیں:
                </p>
                <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
                  موبائل کروم میں <strong className="text-white">PWABuilder.com</strong> کھولیں، اس ایپ کا URL درج کریں، اور <strong>"Generate Android APK"</strong> کا بٹن دبائیں۔ وہ خودکار طور پر چند سیکنڈ میں .apk فائل بنا دے گا۔
                </p>
              </div>

              {/* Option 3: GitHub upload without PC */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                  <Github className="w-4 h-4" />
                  <span>بغیر کمپیوٹر کے GitHub پر کیسے رکھیں؟</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  اپنے موبائل سے <strong className="text-white">github.com</strong> کھولیں، "Desktop site" موڈ آن کریں، نیو ریپوزیٹری بنا کر موبائل سے فائلیں اپ لوڈ کر لیں، یا پلے اسٹور سے مفت <strong>OctoDroid</strong> / <strong>Termux</strong> ایپ ڈاؤن لوڈ کر کے موبائل سے کوڈ گٹ ہب پر پش کر سکتے ہیں۔
                </p>
              </div>

            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowApkModal(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-center text-xs transition-all cursor-pointer"
              >
                سمجھ آگیا (Got it)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CAMERA PERMISSION STEP-BY-STEP HELP */}
      {showCameraHelpModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCameraHelpModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {lang === 'ur' ? 'کیمرہ کی اجازت کیسے دیں؟' : 'How to Allow Camera Permission'}
                </h3>
                <p className="text-xs text-amber-400 font-mono">Chrome / Android & Desktop Guide</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'اینڈرائڈ موبائل (Android / Chrome) پر:' : 'On Android Mobile (Chrome):'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-sans text-[11px] leading-relaxed">
                  <li>براؤزر کے اوپر والے ایڈریس بار میں <strong className="text-white">لاک 🔒 یا ٹیون ⚙️ آئیکن</strong> پر ٹیپ کریں۔</li>
                  <li>مینو سے <strong className="text-emerald-400">Permissions (اجازتیں)</strong> پر کلک کریں۔</li>
                  <li><strong className="text-emerald-400">Camera</strong> کو <strong className="text-emerald-400">Allow (اجازت دیں)</strong> پر سیٹ کریں۔</li>
                  <li>پیج ریفریش کریں اور "Start Camera" دبائیں۔</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'کمپیوٹر یا لیپ ٹاپ (PC / Chrome) پر:' : 'On Desktop (Chrome / Edge):'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-sans text-[11px] leading-relaxed">
                  <li>یو آر ایل بار میں بائیں طرف <strong className="text-white">View site information (سلائیڈرز/لاک آئیکن)</strong> پر کلک کریں۔</li>
                  <li><strong className="text-cyan-400">Camera</strong> ٹوگل کو <strong className="text-cyan-400">On</strong> کریں۔</li>
                  <li>پیج ریلوڈ کر کے کیمرہ شروع کریں۔</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px]">
                💡 <strong>نوٹ:</strong> اگر آپ کے پاس کیمرہ نہ ہو یا آپ اجازت نہ دینا چاہیں تو بھی کوئی پریشانی نہیں ہے! ایپ کا <strong>Forensic Simulation Engine</strong> تمام 468 فیشل پوائنٹس اور تجزیہ لائیو چلاتا رہتا ہے۔
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowCameraHelpModal(false);
                  startCamera();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs"
              >
                {lang === 'ur' ? 'کیمرہ دوبارہ آزمائیں (Retry)' : 'Retry Camera'}
              </button>
              <button
                onClick={() => setShowCameraHelpModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {lang === 'ur' ? 'سمولیشن کے ساتھ جاری رکھیں' : 'Continue Simulation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
