# (FIKR) AI LAB — Real-Time Micro-Expression & Deception Detection Engine
### ریئل ٹائم مائکرو-ایکسپریشن اور اعصابی فریب کی تشخیصی لیبارٹری

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Runtime](https://img.shields.io/badge/Runtime-100%25%20Client--Side-amber.svg)](#core-architecture)
[![Cost](https://img.shields.io/badge/Cloud%20Cost-%240%20(Zero%20APIs)-cyan.svg)](#cost-and-infrastructure)
[![FaceMesh](https://img.shields.io/badge/MediaPipe-468%20Landmarks-rose.svg)](https://developers.google.com/mediapipe)
[![Framework](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20TailwindCSS-violet.svg)](#tech-stack)

---

## 👨‍💻 Lead Developer & System Architect
* **Lead Architect:** **Waseem Asif**
* **Official Email:** [wasimasif761@gmail.com](mailto:wasimasif761@gmail.com)
* **Direct WhatsApp:** [+966597447275](https://wa.me/966597447275?text=Hello%20Waseem,%20I%20saw%20your%20FIKR%20AI%20Micro-Expression%20Engine%20on%20GitHub)
* **Domain:** Computer Vision, Behavioral Forensic AI, Low-Latency Web Biometrics

---

## 🎯 Overview (پروجیکٹ کا تعارف)
**(FIKR) AI LAB** is a high-precision, production-grade forensic tool engineered to detect involuntary human micro-expressions, facial action units (FACS), micro-saccadic eye jitters, and asymmetric smirk micro-flinches in real time directly inside the browser.

Unlike commercial polygraph systems or server-side video surveillance solutions, **FIKR runs 100% on the user's local hardware** using client-side mathematical computer vision algorithms. No video frames, audio, or biometric telemetry leave the device.

---

## 🔬 Core Forensic Capabilities
1. **468-Landmark High-Precision Face Mesh:** Real-time geometric tracking of brows, eyelids, irises, lips, and facial contours at 30-60 FPS.
2. **FACS (Facial Action Coding System) Action Units:**
   * **AU01 (Inner Brow Raiser):** Detects distress, anxiety, or guilt flash.
   * **AU04 (Brow Lowerer / Corrugator):** Measures cognitive strain and narrative construction effort.
   * **AU12 (Lip Corner Puller):** Duchenne bilateral true smile marker.
   * **AU14 (Unilateral Buccinator / Micro-Smirk):** Primary forensic indicator of micro-contempt and deceit.
   * **AU15 (Lip Corner Depressor):** Transient regret or remorse detection.
   * **AU45 (Blink Rate & EAR):** Real-time Eye Aspect Ratio computation with blinks/minute calculation.
3. **Micro-Saccade Calibration & Gaze Jitter:** Involuntary eye movements and pupil fixation stability analysis (0.5° baseline to 4.5° creative construction drift).
4. **Dynamic Veracity Index:** Multi-variate mathematical scoring (0% to 100%) combining bilateral asymmetry, micro-smirk spikes, and brow tension.
5. **Session Forensic Audit Trail & Export:** Millisecond-timestamped audit logging with instant JSON/PDF forensic report export.
6. **Snapshot Evidence Capturing:** Single-click camera frame snapshot with forensic overlay and timestamp watermarking.
7. **Audio Alert Synthesizer:** Real-time synthesized acoustic beep warning when deception likelihood spikes past alert thresholds.

---

## 🏗️ Technical Architecture ($0 Cost & Zero Cloud Backend)
```
                                 [ User Webcam ]
                                        │
                                        ▼
                      [ HTML5 Video Stream (60 FPS) ]
                                        │
                                        ▼
                 [ Google MediaPipe Face Mesh Engine (Client-Side) ]
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
       [ 468 3D Landmark Vectors ]              [ Canvas 2D Overlay ]
                    │
                    ▼
       [ FACS Action Unit Geometry Matrix ]
         ├── AU01: Inner Brow Elevation Delta
         ├── AU04: Corrugator Euclidean Furrow
         ├── AU12: Zygomatic Angle & Elevation
         ├── AU14: Bilateral Buccinator Asymmetry
         └── AU45: Eye Aspect Ratio (EAR < 0.16)
                    │
                    ▼
       [ Veracity & Cognitive Load Calculator ]
                    │
                    ▼
       [ Real-time Forensic Dashboard UI ]
```

---

## 🚀 Quick Start (چند لمحوں میں چلائیں)

### Prerequisites
* [Node.js](https://nodejs.org/) v18.0.0 or higher
* Modern web browser (Chrome, Edge, Safari, Firefox, or Brave) with webcam support

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/fikr-ai-micro-expression-engine.git

# 2. Navigate to project directory
cd fikr-ai-micro-expression-engine

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Repository Structure
```
├── index.html              # HTML entry point with MediaPipe CDN scripts & SEO meta
├── package.json            # Scripts, dependencies, and author metadata
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration with Tailwind CSS plugin
├── LICENSE                 # MIT License (Waseem Asif)
├── README.md               # Scientific & operational documentation
└── src/
    ├── main.tsx            # React root mount
    ├── index.css           # Global Tailwind CSS imports & styles
    └── App.tsx             # Complete forensic engine, biometrics, & dashboard UI
```

---

## 🔒 Privacy & Security Guarantee
* **Zero Telemetry:** No camera frames or facial data are sent to any remote server.
* **Offline Capable:** Once loaded in the browser, the app can function completely offline without internet connectivity.
* **Ethical Compliance:** Designed for academic research, legal deposition training, and behavioral psychology studies.

---

## 📜 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with precision by **Waseem Asif** ([wasimasif761@gmail.com](mailto:wasimasif761@gmail.com)).
