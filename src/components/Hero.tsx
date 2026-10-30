import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ScanLine,
  Boxes,
  Database,
  Cpu,
  Layers,
  Smartphone,
  HardDriveDownload,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  darkMode: boolean;
  onExploreDemo: () => void;
  onExploreDispensing: () => void;
  onExploreStorage: () => void;
}

export const Hero: React.FC<Props> = ({
  darkMode,
  onExploreDemo,
  onExploreDispensing,
  onExploreStorage,
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Hardware Station Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-6">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300 tracking-wide uppercase">
              MediVault Station • Countertop & Mobile Architecture
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="block text-slate-100">Smart Inventory.</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Safer Medicine.
            </span>
          </h1>

          {/* Subtitle with countertop + smartphone + file inputs framing */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed font-normal">
            Next-generation pharmaceutical inventory intelligence. Powered by an offline-first
            countertop <strong className="text-white font-semibold">MediVault Station</strong> with
            diffused-light scan bay, multi-angle turntable, smartphone capture, and distributor EDI integration.
          </p>

          {/* Three small pills under the hero: "Faster Processing", "Higher Accuracy", "Safer Healthcare" */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-9">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Faster Processing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Higher Accuracy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm backdrop-blur-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              Safer Healthcare
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <button
              onClick={() => {
                sound.playScanClick();
                onExploreDemo();
              }}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <ScanLine className="w-4 h-4 text-slate-950" />
              Launch Live Intake Demo
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playScanClick();
                onExploreDispensing();
              }}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Dispensing Simulator
            </button>

            <button
              onClick={() => {
                sound.playScanClick();
                onExploreStorage();
              }}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Boxes className="w-4 h-4 text-cyan-400" />
              FEFO Shelves
            </button>
          </div>
        </div>

        {/* Glass Capsule Hero Visual: Countertop MediVault Station Rendering */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glowing backdrop halo */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-teal-500/20 rounded-3xl blur-2xl transform -translate-y-4" />

          {/* Glass Capsule container */}
          <div className="relative rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Top Device Status bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-semibold text-emerald-400 text-[11px]">STATION OS v3.4 • READY</span>
                </div>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 hidden sm:inline flex items-center gap-1 font-mono">
                  <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
                  SQLite Offline-First Mode
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px]">Mobile Paired</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Turntable 360° Armed
                </div>
              </div>
            </div>

            {/* Device Anatomy Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
              {/* Left: Interactive Station Mockup */}
              <div className="lg:col-span-7 relative">
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950 border border-slate-700/60 p-5 shadow-inner overflow-hidden">
                  {/* Diffused scan bay overhead lights */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

                  {/* Station chassis top banner */}
                  <div className="flex justify-between items-center mb-4 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-300 font-bold tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                      MEDIVAULT STATION • COUNTERTOP BAY
                    </span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">
                      DIFFUSED BACKLIGHT: 5500K
                    </span>
                  </div>

                  {/* Center turntable visual representation */}
                  <div className="relative h-56 sm:h-64 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center overflow-hidden">
                    {/* Laser scanning beam */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/20 via-emerald-400/10 to-transparent pointer-events-none animate-scan border-b-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />

                    {/* Turntable circle */}
                    <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center animate-turntable">
                      <div className="w-36 h-36 rounded-full border border-cyan-400/20 bg-cyan-950/20 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-emerald-400/30 bg-emerald-950/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 animate-ping opacity-25" />
                        </div>
                      </div>
                    </div>

                    {/* Package on turntable */}
                    <div className="absolute z-10 p-3.5 rounded-lg bg-gradient-to-tr from-slate-900 to-slate-800 border border-emerald-500/40 shadow-2xl text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-mono font-bold">
                          GS1
                        </div>
                        <div className="text-[11px] font-bold text-white tracking-wide">
                          Amoxicillin 500mg
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        DATAMATRIX: 00300450444558
                      </div>
                    </div>

                    {/* LED Ring indicator at bottom */}
                    <div className="absolute bottom-3 inset-x-6 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LED Ring: Normal (Green)
                      </span>
                      <span className="text-cyan-300 font-bold">Scan Time: 0.34s</span>
                    </div>
                  </div>

                  {/* Bottom hardware details */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Decode Speed</p>
                      <p className="text-xs font-bold text-emerald-400 font-mono">0.38s median</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Critical Error</p>
                      <p className="text-xs font-bold text-emerald-400 font-mono">0.00% target</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                      <p className="text-[10px] text-slate-400">Offline Storage</p>
                      <p className="text-xs font-bold text-cyan-400 font-mono">Encrypted SQLite</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Operational Highlights */}
              <div className="lg:col-span-5 flex flex-col gap-3.5">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ScanLine className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Turntable Scan Bay</h4>
                      <p className="text-xs text-slate-400">
                        Enclosed diffused lightbox captures 2D barcodes across all angles without glare.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Targeted OCR Fallback</h4>
                      <p className="text-xs text-slate-400">
                        When barcode is missing expiry, selective OCR reads only required bounding boxes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">FEFO Physical Shelving</h4>
                      <p className="text-xs text-slate-400">
                        Enforces back-load / front-pick discipline with color-coded shelf zones.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-teal-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">100% Offline-First Architecture</h4>
                      <p className="text-xs text-slate-400">
                        Never stalls if broadband drops. All intakes, dispensings, and audits queue locally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
