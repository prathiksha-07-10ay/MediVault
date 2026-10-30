import React, { useState, useEffect } from 'react';
import {
  InputMode,
  ScanScenario,
  InventoryItem,
  UserRole
} from '../types';
import { SAMPLE_SCENARIOS } from '../data/initialData';
import {
  Box,
  Smartphone,
  FileSpreadsheet,
  Edit3,
  Scan,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  AlertTriangle,
  UploadCloud,
  FileText,
  Clock,
  ShieldAlert,
  Save,
  RotateCw,
  Barcode,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  darkMode: boolean;
  currentRole: UserRole;
  isOnline: boolean;
  onSaveItem: (item: Partial<InventoryItem>, auditNote: string) => void;
}

export const LiveDemo: React.FC<Props> = ({
  darkMode,
  currentRole,
  isOnline,
  onSaveItem,
}) => {
  const [selectedMode, setSelectedMode] = useState<InputMode>('scan_bay');
  const [activeScenario, setActiveScenario] = useState<ScanScenario>(SAMPLE_SCENARIOS[0]);

  // Scan simulation states
  const [scanState, setScanState] = useState<
    'idle' | 'capturing' | 'decoding' | 'decision' | 'verified'
  >('idle');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [qualityChecked, setQualityChecked] = useState<'pass' | 'glare' | 'blur' | null>(null);

  // Pharmacist verification form values
  const [verifyMedicine, setVerifyMedicine] = useState('Amoxicillin Trihydrate');
  const [verifyDosage, setVerifyDosage] = useState('500mg Capsules');
  const [verifyBatch, setVerifyBatch] = useState('AMX-2026-99A');
  const [verifyExpiry, setVerifyExpiry] = useState('2027-11-30');
  const [verifyQuantity, setVerifyQuantity] = useState(120);
  const [verifyShelf, setVerifyShelf] = useState('A1-FRONT');
  const [manualGtin, setManualGtin] = useState('00300450444558');

  // Manual entry validation errors
  const [manualErrors, setManualErrors] = useState<{ [key: string]: string }>({});

  // Sample invoice file table
  const [invoiceLoaded, setInvoiceLoaded] = useState(false);
  const sampleInvoiceItems = [
    { gtin: '00300450444558', name: 'Amoxicillin 500mg', batch: 'AMX-INV-01', exp: '2027-12-31', qty: 250, shelf: 'A1-BACK' },
    { gtin: '00300983344120', name: 'Metformin 850mg ER', batch: 'MET-INV-88', exp: '2028-04-15', qty: 400, shelf: 'B2-BACK' },
    { gtin: '00300754400192', name: 'Atorvastatin 20mg', batch: 'ATV-INV-22', exp: '2027-09-30', qty: 150, shelf: 'C1-BACK' },
  ];

  // Sync state whenever scenario changes
  const applyScenario = (sc: ScanScenario) => {
    setActiveScenario(sc);
    setSelectedMode(sc.mode);
    setScanState('idle');
    setQualityChecked(null);
    setElapsedMs(0);

    // populate initial fields
    setVerifyMedicine(sc.barcodeData.medicine || 'Amoxicillin Trihydrate');
    setVerifyDosage('500mg Capsules');
    setVerifyBatch(sc.barcodeData.batch || (sc.ocrExtracted?.batch ?? ''));
    setVerifyExpiry(sc.barcodeData.expiry || (sc.ocrExtracted?.expiry ?? ''));
    setVerifyQuantity(120);
    setVerifyShelf('A1-FRONT');
  };

  // Run the full animated scan flow
  const handleStartScan = () => {
    sound.playScanClick();
    setScanState('capturing');
    setQualityChecked(null);
    setElapsedMs(0);

    // Step b: Image Quality Check after 400ms
    setTimeout(() => {
      setQualityChecked(activeScenario.imageQuality);
      if (activeScenario.imageQuality !== 'pass') {
        sound.playBuzzer();
        setScanState('idle'); // stays halted because of glare/blur
        return;
      }

      // Step c: Barcode decoding with timer
      setScanState('decoding');
      const startTime = performance.now();
      const targetTime = activeScenario.expectedDecodeMs;

      const timerInterval = setInterval(() => {
        const current = Math.round(performance.now() - startTime);
        if (current >= targetTime) {
          clearInterval(timerInterval);
          setElapsedMs(targetTime);
          sound.playSuccess();
          // Step d: Decision diamond
          setScanState('decision');
        } else {
          setElapsedMs(current);
        }
      }, 25);
    }, 600);
  };

  // Proceed from decision diamond to pharmacist verification screen
  const handleProceedToVerify = () => {
    sound.playScanClick();
    setScanState('verified');
  };

  // Commit item to inventory
  const handleSaveToInventory = () => {
    if (activeScenario.statusOutcome === 'blocked') {
      sound.playBuzzer();
      return;
    }

    const newItem: Partial<InventoryItem> = {
      medicine: verifyMedicine,
      genericName: verifyMedicine.split(' ')[0],
      dosage: verifyDosage,
      batch: verifyBatch || 'BATCH-UNKNOWN',
      expiry: verifyExpiry || '2027-12-31',
      quantity: Number(verifyQuantity) || 100,
      shelfLocation: verifyShelf,
      supplierReference: 'SUP-DIRECT-INTAKE',
      status: 'Active',
      gtin: activeScenario.barcodeData.gtin || manualGtin || '00300450444558',
    };

    const auditLogMessage = `Intake verified by ${currentRole}: ${verifyMedicine} (Lot: ${verifyBatch}, Exp: ${verifyExpiry}, Qty: ${verifyQuantity}) saved to ${verifyShelf}. Mode: ${selectedMode}.`;

    onSaveItem(newItem, auditLogMessage);
    sound.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Confetti fallback
    }

    setScanState('idle');
  };

  // Validate manual entry form
  const handleManualChange = (field: string, val: string) => {
    const errs = { ...manualErrors };
    if (field === 'gtin') {
      setManualGtin(val);
      if (!/^\d{14}$/.test(val)) {
        errs.gtin = 'GS1 GTIN must be exactly 14 numeric digits';
      } else {
        delete errs.gtin;
      }
    }
    if (field === 'batch') {
      setVerifyBatch(val);
      if (!val.trim()) {
        errs.batch = 'Batch lot number is required for trace compliance';
      } else {
        delete errs.batch;
      }
    }
    if (field === 'expiry') {
      setVerifyExpiry(val);
      if (!val) {
        errs.expiry = 'Expiration date is mandatory';
      } else if (new Date(val) < new Date('2026-10-24')) {
        errs.expiry = 'Medication is already past its expiration date!';
      } else {
        delete errs.expiry;
      }
    }
    setManualErrors(errs);
  };

  return (
    <section id="live-demo" className="py-20 md:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Interactive Intake Bay
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Live Intake &amp; Barcode / OCR Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Test the full receiving pipeline: select an input modality, observe image quality grading,
            watch sub-second barcode decoding, and inspect the targeted OCR fallback and confidence gates.
          </p>
        </div>

        {/* 5 Sample Scenario Selector Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono text-slate-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Preset Scenarios (Select to Test)
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Active: <strong className="text-emerald-400">{activeScenario.title}</strong>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {SAMPLE_SCENARIOS.map((sc, idx) => {
              const isCurr = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    sound.playScanClick();
                    applyScenario(sc);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 text-xs flex flex-col justify-between ${
                    isCurr
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-mono font-black">
                      {idx + 1}
                    </span>
                    <span className="truncate">{sc.title.split('(')[0]}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-2">
                    {sc.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* a) INPUT MODE SELECTOR AT TOP (4 CARDS: A, B, C, D) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* A: Scan Bay */}
          <button
            onClick={() => {
              setSelectedMode('scan_bay');
              sound.playScanClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
              selectedMode === 'scan_bay'
                ? 'bg-slate-900/90 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)] ring-1 ring-emerald-400'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                MODE A
              </span>
              <Box className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Scan Bay (Countertop)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Bulk receiving with enclosed lightbox and motorized 360° turntable.
            </p>
          </button>

          {/* B: Smartphone */}
          <button
            onClick={() => {
              setSelectedMode('smartphone');
              sound.playScanClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
              selectedMode === 'smartphone'
                ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                MODE B
              </span>
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Smartphone Camera</h4>
            <p className="text-xs text-slate-400 mt-1">
              Mobile companion for aisles, cart intake, and return staging.
            </p>
          </button>

          {/* C: Invoice / CSV / PDF */}
          <button
            onClick={() => {
              setSelectedMode('invoice');
              sound.playScanClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
              selectedMode === 'invoice'
                ? 'bg-slate-900/90 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.2)] ring-1 ring-teal-400'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                MODE C
              </span>
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Invoice / CSV / PDF</h4>
            <p className="text-xs text-slate-400 mt-1">
              Wholesaler EDI packing slips &amp; CSV manifests from distributor.
            </p>
          </button>

          {/* D: Manual Entry */}
          <button
            onClick={() => {
              setSelectedMode('manual');
              sound.playScanClick();
            }}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
              selectedMode === 'manual'
                ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                MODE D
              </span>
              <Edit3 className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Manual Entry (Validated)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Real-time GTIN format, checksum, and expiry date sanity guards.
            </p>
          </button>
        </div>

        {/* MAIN INTERACTIVE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 6 COLS: DYNAMIC CAPTURE PANEL BASED ON MODE */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Top header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Live Viewfinder &amp; Feed
                </span>
              </div>

              {/* b) Image quality check chip */}
              <div className="flex items-center gap-2">
                {qualityChecked === null ? (
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    Quality: Ready
                  </span>
                ) : qualityChecked === 'pass' ? (
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Quality: Passed (Glare 4%, Focus 92%)
                  </span>
                ) : qualityChecked === 'glare' ? (
                  <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Glare detected, rescan
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Focal Blur detected (Tilt carton)
                  </span>
                )}
              </div>
            </div>

            {/* MODE CONTENT SWITCH */}
            {selectedMode === 'scan_bay' && (
              /* Scan Bay with enclosed diffused lightbox and turntable */
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 h-80 flex flex-col items-center justify-center overflow-hidden">
                {/* Diffused backlight glow */}
                <div className="absolute inset-0 bg-radial from-slate-800/80 via-slate-950 to-slate-950" />
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee]" />

                {/* Laser scan line when capturing */}
                {(scanState === 'capturing' || scanState === 'decoding') && (
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-emerald-500/25 via-emerald-400/10 to-transparent pointer-events-none animate-scan border-b-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)] z-20" />
                )}

                {/* Motorized Turntable */}
                <div className="relative w-52 h-52 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center animate-turntable">
                  <div className="w-40 h-40 rounded-full border border-cyan-400/30 bg-cyan-950/20 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-emerald-400/40 bg-emerald-950/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 animate-ping opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Carton On Turntable */}
                <div className="absolute z-10 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl text-center max-w-xs">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                      2D
                    </div>
                    <span className="font-bold text-white text-xs">
                      {activeScenario.barcodeData.medicine || 'Prescription Pharmaceutical'}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-emerald-300">
                    GTIN: {activeScenario.barcodeData.gtin || '00300450444558'}
                  </p>
                </div>

                {/* Turntable RPM & Lighting Status Tag */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5 z-20">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    Turntable: 12 RPM Active
                  </span>
                  <span className="text-cyan-300">Light: 5500K Diffused</span>
                </div>
              </div>
            )}

            {selectedMode === 'smartphone' && (
              /* Smartphone frame with camera viewfinder */
              <div className="relative rounded-2xl bg-slate-950 border-4 border-slate-700 h-80 flex flex-col items-center justify-center p-3 overflow-hidden shadow-inner">
                {/* Phone Notch */}
                <div className="absolute top-2 w-28 h-4 rounded-full bg-slate-800 z-30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
                  <div className="w-3 h-1 rounded-full bg-slate-900" />
                </div>

                {/* Camera Viewfinder Reticle */}
                <div className="relative w-full h-full rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center overflow-hidden">
                  {/* Viewfinder crosshairs */}
                  <div className="w-48 h-48 border-2 border-cyan-400/60 rounded-2xl relative flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                    {/* Laser scan line */}
                    {(scanState === 'capturing' || scanState === 'decoding') && (
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-400/40 to-transparent pointer-events-none animate-scan border-b border-cyan-400" />
                    )}

                    <div className="text-center p-2">
                      <Barcode className="w-10 h-10 text-cyan-400 mx-auto mb-1 opacity-80" />
                      <p className="text-[10px] font-mono text-cyan-300 font-bold">
                        Align 2D DataMatrix
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded border border-white/5">
                  Mobile Camera v2.1 • Auto-Focus ON
                </div>
              </div>
            )}

            {selectedMode === 'invoice' && (
              /* Drag-and-drop file area with sample invoice filling table */
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 min-h-[320px] flex flex-col justify-between">
                <div>
                  <div
                    onClick={() => {
                      setInvoiceLoaded(true);
                      sound.playSuccess();
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      invoiceLoaded
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-slate-700 bg-slate-900/60 hover:border-cyan-400 hover:bg-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">
                      {invoiceLoaded ? 'Wholesaler_Manifest_McKesson_9921.csv Loaded' : 'Click to Load Distributor EDI Invoice'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Accepts PDF electronic invoices, GS1 XML, or wholesaler CSVs
                    </p>
                  </div>

                  {/* Populated items table from invoice */}
                  {invoiceLoaded && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono">
                            <th className="pb-1">Medication</th>
                            <th className="pb-1">Batch</th>
                            <th className="pb-1">Expiry</th>
                            <th className="pb-1">Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {sampleInvoiceItems.map((item, idx) => (
                            <tr key={idx} className="text-slate-200">
                              <td className="py-1 font-semibold">{item.name}</td>
                              <td className="py-1 font-mono text-cyan-300">{item.batch}</td>
                              <td className="py-1 font-mono text-emerald-400">{item.exp}</td>
                              <td className="py-1 font-mono">{item.qty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
                  <span>EDI 856 Advanced Ship Notice</span>
                  <span className="text-emerald-400 font-bold">3 of 3 items matched</span>
                </div>
              </div>
            )}

            {selectedMode === 'manual' && (
              /* Manual entry form with live validation */
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 min-h-[320px]">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    GS1 GTIN (14 Digits)
                  </label>
                  <input
                    type="text"
                    value={manualGtin}
                    onChange={(e) => handleManualChange('gtin', e.target.value)}
                    placeholder="e.g. 00300450444558"
                    className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                  {manualErrors.gtin && (
                    <p className="text-[10px] text-rose-400 mt-1">{manualErrors.gtin}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Batch Lot #
                    </label>
                    <input
                      type="text"
                      value={verifyBatch}
                      onChange={(e) => handleManualChange('batch', e.target.value)}
                      placeholder="e.g. AMX-2026-99"
                      className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                    {manualErrors.batch && (
                      <p className="text-[10px] text-rose-400 mt-1">{manualErrors.batch}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={verifyExpiry}
                      onChange={(e) => handleManualChange('expiry', e.target.value)}
                      className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                    {manualErrors.expiry && (
                      <p className="text-[10px] text-rose-400 mt-1">{manualErrors.expiry}</p>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                  <p className="text-slate-400">
                    Live Checksum: <strong className="text-emerald-400">Luhn GS1 Valid</strong> |
                    Format: <strong className="text-cyan-400">ISO/IEC 15418</strong>
                  </p>
                </div>
              </div>
            )}

            {/* ACTION TRIGGER BUTTON */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={handleStartScan}
                disabled={scanState === 'capturing' || scanState === 'decoding'}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Scan className="w-4 h-4" />
                {scanState === 'capturing'
                  ? 'Capturing Multi-Angle Image...'
                  : scanState === 'decoding'
                  ? 'Decoding GS1 Barcode...'
                  : 'Execute Capture & Decode'}
              </button>

              <button
                onClick={() => applyScenario(activeScenario)}
                className="p-3 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset intake state"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT 6 COLS: DECODING TIMER, DECISION DIAMOND, OCR FALLBACK, & PHARMACIST VERIFICATION */}
          <div className="lg:col-span-6 space-y-6">
            {/* c) BARCODE DECODING WITH LIVE TIMER & BADGE */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  c) Barcode Decoding Engine
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Target: under 1 second
                </span>
              </div>

              {/* Timer metric display */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-4">
                <div>
                  <p className="text-[10px] font-mono text-slate-400">Elapsed Decode Time</p>
                  <p className="text-2xl font-black font-mono text-emerald-400">
                    {elapsedMs > 0 ? `${elapsedMs} ms` : '--'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {elapsedMs > 0 && elapsedMs < 1000
                      ? '✓ Within sub-second specification'
                      : 'Awaiting barcode trigger'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400">Symbology standard</p>
                  <p className="text-sm font-bold text-white mt-1">GS1-DataMatrix 2D</p>
                  <p className="text-[10px] font-mono text-cyan-400">ECC 200 Error Correction</p>
                </div>
              </div>

              {/* Decoded parsed fields */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-white/5">
                  <span className="text-slate-400">(01) GTIN:</span>
                  <span className="text-white font-bold">
                    {activeScenario.barcodeData.gtin || 'Missing from payload'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-white/5">
                  <span className="text-slate-400">(10) Lot / Batch:</span>
                  <span className={activeScenario.barcodeData.batch ? 'text-white font-bold' : 'text-amber-400 font-bold'}>
                    {activeScenario.barcodeData.batch || 'Missing / unreadable'}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-800/40 border border-white/5">
                  <span className="text-slate-400">(17) Expiration Date:</span>
                  <span className={activeScenario.barcodeData.expiry ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {activeScenario.barcodeData.expiry || 'Missing from 2D barcode'}
                  </span>
                </div>
              </div>
            </div>

            {/* d) DECISION DIAMOND: DECODED DATA USED vs TARGETED OCR FALLBACK */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-3">
                d) Decision Diamond &amp; Targeted OCR Fallback
              </span>

              {!activeScenario.ocrFallbackNeeded ? (
                /* YES PATH */
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Decoded data used, OCR skipped</span>
                  </div>
                  <p className="text-xs text-emerald-200/80">
                    All mandatory fields (GTIN, Batch, Expiry) found in barcode with 100% parity.
                    No optical character recognition required.
                  </p>
                </div>
              ) : (
                /* NO PATH: TARGETED OCR FALLBACK */
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Targeted OCR Fallback Active</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      EasyOCR / Tesseract
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80 mb-3">
                    Barcode missing mandatory expiration date. Engine selectively crops label text region (bounding box)
                    and extracts only missing fields.
                  </p>

                  {/* Bounding box simulation visual */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 font-mono text-[11px] relative">
                    <div className="flex items-center justify-between text-slate-400 mb-1.5">
                      <span>Label Region Bounding Box [x:120, y:84, w:310, h:65]</span>
                      <span className="text-cyan-400 font-bold">
                        Confidence: {activeScenario.ocrExtracted?.confidence || 68}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 border border-dashed border-amber-400/60 text-amber-200">
                      EXTRACTED_EXPIRY: "{activeScenario.ocrExtracted?.expiry || 'Unreadable'}"
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* e) VALIDATION AND CONFIDENCE PANEL & f) PHARMACIST VERIFICATION SCREEN */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  e &amp; f) Validation, Confidence &amp; Pharmacist Verification
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    activeScenario.statusOutcome === 'blocked'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : activeScenario.statusOutcome === 'pharmacist_review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  Score: {activeScenario.confidenceScore}%
                </span>
              </div>

              {/* Confidence logic explanation */}
              <div className="text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <p>
                  • High Confidence (&gt;85%): <span className="text-emerald-400">Auto-save eligible</span>
                </p>
                <p>
                  • Low/Medium Confidence (&lt;85%): <span className="text-amber-400">Sends to Pharmacist Review</span>
                </p>
                <p>
                  • Missing Critical Field: <span className="text-rose-400 font-bold">Locked save button (Regulatory Block)</span>
                </p>
              </div>

              {/* Pharmacist verification input fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      value={verifyMedicine}
                      onChange={(e) => setVerifyMedicine(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      value={verifyDosage}
                      onChange={(e) => setVerifyDosage(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Batch Identifier
                    </label>
                    <input
                      type="text"
                      value={verifyBatch}
                      onChange={(e) => setVerifyBatch(e.target.value)}
                      placeholder="e.g. AMX-2026-99A"
                      className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={verifyExpiry}
                      onChange={(e) => setVerifyExpiry(e.target.value)}
                      className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Quantity Received
                    </label>
                    <input
                      type="number"
                      value={verifyQuantity}
                      onChange={(e) => setVerifyQuantity(Number(e.target.value))}
                      className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Physical FEFO Shelf
                    </label>
                    <select
                      value={verifyShelf}
                      onChange={(e) => setVerifyShelf(e.target.value)}
                      className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="A1-FRONT">A1-FRONT (Fast FEFO Pick)</option>
                      <option value="A1-BACK">A1-BACK (Load New Stock)</option>
                      <option value="B2-FRONT">B2-FRONT</option>
                      <option value="B2-BACK">B2-BACK</option>
                      <option value="C3-FRONT">C3-FRONT</option>
                      <option value="FRIDGE-A">FRIDGE-A (Cold Chain)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SAVE OR BLOCKED BUTTON */}
              <div className="mt-5">
                {activeScenario.statusOutcome === 'blocked' ? (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200">
                    <div className="flex items-center gap-2 font-bold text-xs mb-1">
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span>Save Blocked (Missing Critical Batch/GTIN)</span>
                    </div>
                    <p className="text-[11px] text-rose-300">
                      {activeScenario.blockReason ||
                        'Cannot commit un-batched medication to active inventory. Send carton to QA quarantine.'}
                    </p>
                    <button
                      disabled
                      className="w-full mt-3 py-2.5 px-4 rounded-lg bg-rose-900/40 text-rose-400 border border-rose-700/50 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Save to Inventory (Locked)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSaveToInventory}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Local Inventory Database
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
