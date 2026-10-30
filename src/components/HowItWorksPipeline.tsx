import React, { useState } from 'react';
import {
  Package,
  Layers,
  Camera,
  Barcode,
  HelpCircle,
  CheckCircle,
  FileSearch,
  ShieldCheck,
  UserCheck,
  Database,
  Boxes,
  Cpu,
  HandMetal,
  BellRing,
  LayoutDashboard,
  FileText,
  Zap,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  darkMode: boolean;
}

export const HowItWorksPipeline: React.FC<Props> = ({ darkMode }) => {
  const [activeStep, setActiveStep] = useState<number | 'decision-yes' | 'decision-no'>(3);

  const steps = [
    {
      num: 1,
      title: 'Input Mode Selection',
      caption: 'Choose Scan Bay, smartphone camera, distributor invoice CSV/PDF, or validated manual entry.',
      detail: 'Accommodates bulk carton receipts on the countertop turntable, quick counter scans via paired smartphone, or bulk distributor manifest import.',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
    },
    {
      num: 2,
      title: 'Scan and Capture',
      caption: 'Station captures multi-angle image and performs real-time blur and glare quality checks.',
      detail: 'Diffused 5500K backlighting prevents overexposure. If glare or focal blur is detected above 25%, operator is alerted immediately to adjust.',
      icon: <Camera className="w-5 h-5 text-teal-400" />,
    },
    {
      num: 3,
      title: 'Barcode Decoding',
      caption: 'Decodes GS1 DataMatrix to GTIN, lot/batch, and expiry in under 1 second.',
      detail: 'High-speed image processing parses 2D GS1 Application Identifiers (01 GTIN, 17 Expiration Date, 10 Lot Number) in median 0.38 seconds.',
      icon: <Barcode className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const laterSteps = [
    {
      num: 4,
      title: 'Validation & Confidence Check',
      caption: 'Cross-verifies decoded vs OCR values, date logic, and batch integrity scoring.',
      detail: 'High confidence (>85%) enables instant auto-save; medium confidence prompts review; missing critical data blocks the save button.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: 5,
      title: 'Pharmacist Verification',
      caption: 'Pharmacist or technician reviews flagged fields, confirms quantity and shelf slot.',
      detail: 'Operator can approve barcode-decoded records in 1 click or correct single fields before database commitment.',
      icon: <UserCheck className="w-5 h-5 text-cyan-400" />,
    },
    {
      num: 6,
      title: 'Local Inventory Database',
      caption: 'Saves offline-first to encrypted local SQLite/IndexedDB, queueing sync if offline.',
      detail: 'Guarantees the pharmacy never stops operating during internet outages or cloud server latency. Syncs automatically upon reconnection.',
      icon: <Database className="w-5 h-5 text-teal-400" />,
    },
    {
      num: 7,
      title: 'Physical FEFO Storage',
      caption: 'Directs stock placement: "Load new stock from BACK, pick existing stock from FRONT".',
      detail: 'Color-coded shelf zones (Green >180d, Yellow 180-90d, Orange 90-30d, Red ≤30d, Black Quarantine) with micro-QR labeling.',
      icon: <Boxes className="w-5 h-5 text-amber-400" />,
    },
    {
      num: 8,
      title: 'Expiry + FEFO + Stock Engines',
      caption: 'Continuous background engines calculate burn rate, expiry thresholds, and reorder triggers.',
      detail: 'Smart rules sort picking queues by earliest expiry and require formal justification logs if staff attempts an out-of-order pick.',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: 9,
      title: 'Dispensing (Scan Before Handout)',
      caption: 'Mandatory barcode scan-to-deduct checks batch against expiry before patient handover.',
      detail: 'Hardware LED ring & buzzer alert if the carton is expired (locked) or if an older batch is waiting on the front shelf.',
      icon: <HandMetal className="w-5 h-5 text-cyan-400" />,
    },
    {
      num: 10,
      title: 'Alert Engine',
      caption: 'Multi-modal alerts through Station LED ring, buzzer, touchscreen, and optional SMS/WhatsApp.',
      detail: 'Triggers color-coded escalation tiers: 180-day review, 90-day prioritization, 30-day urgent return, and expired quarantine disposal.',
      icon: <BellRing className="w-5 h-5 text-rose-400" />,
    },
    {
      num: 11,
      title: 'Dashboard & Recommended Actions',
      caption: 'Real-time overview of near-expiry, FEFO pick lists, low-stock warnings, and performance KPIs.',
      detail: 'Actionable 1-click recommendations: prioritize short-dated stock, return to supplier, quarantine expired stock, or reorder.',
      icon: <LayoutDashboard className="w-5 h-5 text-teal-400" />,
    },
    {
      num: 12,
      title: 'Audit Trail',
      caption: 'Immutable timeline recording who scanned, verified, corrected, or overrode FEFO with reasons.',
      detail: 'Complete regulatory-grade log tracking every operator name, role, timestamp, action type, and offline sync verification.',
      icon: <FileText className="w-5 h-5 text-slate-300" />,
    },
  ];

  return (
    <section id="pipeline" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
              12-Step Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            How MediVault Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From the moment stock arrives at receiving to patient dispensing and audit logging, every step is
            engineered for sub-second speed, 0% critical errors, and seamless offline reliability.
          </p>
        </div>

        {/* Pipeline Container with animated background glow */}
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
          {/* Arrival step */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
              <Package className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Inbound Receiving
              </span>
              <h3 className="text-xl font-extrabold text-white">Stock Arrives at Pharmacy</h3>
              <p className="text-xs text-slate-400">Cartons, totes, or split-unit packs delivered by wholesaler</p>
            </div>
          </div>

          {/* Steps 1 to 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {steps.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => {
                    setActiveStep(step.num);
                    sound.playScanClick();
                  }}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative ${
                    isSelected
                      ? 'border-emerald-400/60 bg-emerald-950/30 shadow-[0_0_25px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/50'
                      : 'border-white/5 bg-slate-800/40 hover:bg-slate-800/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                        {step.num}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{step.title}</span>
                    </div>
                    {step.icon}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-2 leading-snug">{step.caption}</p>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-200 bg-emerald-950/40 p-2.5 rounded-lg leading-relaxed animate-in fade-in">
                      {step.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DECISION DIAMOND WITH GREEN & AMBER GLOWING BRANCHES */}
          <div className="my-8 py-6 px-4 sm:px-6 rounded-2xl bg-slate-950/80 border border-slate-700/60 relative overflow-hidden">
            {/* Ambient Decision Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-xs font-mono text-slate-300 mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>DECISION NODE: GS1 INTEGRITY VALIDATOR</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                "Required fields found and valid?"
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Evaluates presence & checksum of GTIN, batch lot number, and expiration date.
              </p>
            </div>

            {/* Glowing Branch Pathways (YES green / NO amber) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* YES PATH (Glows Green, Skips OCR) */}
              <div
                onClick={() => {
                  setActiveStep('decision-yes');
                  sound.playSuccess();
                }}
                className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative ${
                  activeStep === 'decision-yes'
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_35px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/80'
                    : 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/40">
                    <Check className="w-4 h-4 stroke-[3]" />
                    YES • High-Speed Path
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    ELAPSED &lt; 0.4s
                  </span>
                </div>

                <h5 className="text-sm font-bold text-white mt-3">
                  Use Decoded Data & Skip OCR
                </h5>
                <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                  All critical parameters (GTIN, Lot, Exp) parsed directly from GS1 DataMatrix symbology.
                  No OCR inference needed. Maximum throughput with zero latency.
                </p>

                {/* Animated glowing path line indicator */}
                <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Direct bypass to Validation &amp; Confidence</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                </div>
              </div>

              {/* NO PATH (Glows Amber, Targeted OCR Fallback) */}
              <div
                onClick={() => {
                  setActiveStep('decision-no');
                  sound.playWarning();
                }}
                className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative ${
                  activeStep === 'decision-no'
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_35px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/80'
                    : 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/40">
                    <FileSearch className="w-4 h-4" />
                    NO • Fallback Triggered
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    TARGETED OCR
                  </span>
                </div>

                <h5 className="text-sm font-bold text-white mt-3">
                  Targeted OCR Fallback
                </h5>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Barcode is damaged or missing expiry. EasyOCR/Tesseract isolates carton text zones (bounding boxes)
                  and extracts <em>only missing fields</em> to minimize compute and eliminate false positives.
                </p>

                {/* Animated glowing path line indicator */}
                <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-amber-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Extracts missing label fields → Merges at Step 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-amber-300" />
                </div>
              </div>
            </div>

            {/* Merge notice */}
            <div className="mt-5 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Both paths converge at Step 4 (Validation &amp; Confidence Check)
              </span>
            </div>
          </div>

          {/* Steps 4 to 12 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {laterSteps.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => {
                    setActiveStep(step.num);
                    sound.playScanClick();
                  }}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative ${
                    isSelected
                      ? 'border-emerald-400/60 bg-emerald-950/30 shadow-[0_0_25px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/50'
                      : 'border-white/5 bg-slate-800/40 hover:bg-slate-800/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                        {step.num}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{step.title}</span>
                    </div>
                    {step.icon}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-2 leading-snug">{step.caption}</p>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-200 bg-emerald-950/40 p-2.5 rounded-lg leading-relaxed animate-in fade-in">
                      {step.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* EXACT REQUIRED FOOTER STRIP */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-0.5">
                  Performance Metric
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  "Speed focus: barcode decoding under 1 second"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-0.5">
                  Quality Metric
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  "Accuracy focus: critical-field error rate target 0% on test set"
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-0.5">
                  Operational Value
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  "Result: faster, safer, smarter pharmacy operations"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
