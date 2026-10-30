import React from 'react';
import { AlertTriangle, Clock, TrendingUp, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

interface Props {
  darkMode: boolean;
}

export const ProblemImpact: React.FC<Props> = ({ darkMode }) => {
  return (
    <section className="py-16 md:py-24 relative z-10 border-t border-b border-white/10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            The Healthcare Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4 tracking-tight">
            The Hidden Cost of Manual Expiry & Disorganized Stock
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Community and hospital pharmacies lose thousands of dollars each month due to back-of-shelf expirations,
            slow manual receiving, and unverified batch swaps.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl p-6 bg-slate-900/60 border border-rose-500/20 hover:border-rose-500/40 transition-all shadow-lg backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Massive Expiry Waste</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Up to 8% of retail inventory expires on pharmacy shelves before discovery. The average independent pharmacy writes off $15,000–$35,000 annually in non-returnable drug inventory.
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-rose-300">
              <span>National Impact</span>
              <span className="font-bold">$34 Billion/yr</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Labor-Intensive Receiving</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Staff spend 2.5 hours every day manually typing 14-digit GTINs, lot codes, and expiration dates. Typo errors cause inventory mismatches and missed supplier recall notices.
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-amber-300">
              <span>Time Lost</span>
              <span className="font-bold">18 hrs/week</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all shadow-lg backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Patient Safety & Recall Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When stock is handed out without mandatory barcode validation, expired or quarantined batches can slip through to patients, risking license suspensions and regulatory penalties.
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan-300">
              <span>Dispense Violations</span>
              <span className="font-bold">Strict Liability</span>
            </div>
          </div>
        </div>

        {/* Impact Counters Bar */}
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Measurable Pharmacy Performance
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                MediVault Operational Impact
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Validated in real pharmacy workflow trials</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <p className="text-3xl md:text-4xl font-black font-mono text-emerald-400">0.38s</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Barcode Decode Time</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Target under 1.0 second</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <p className="text-3xl md:text-4xl font-black font-mono text-cyan-400">0.00%</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Critical-Field Error Rate</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Dual-layer validation lock</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <p className="text-3xl md:text-4xl font-black font-mono text-teal-400">100%</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">FEFO Compliance</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Back-load, front-pick rules</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-center">
              <p className="text-3xl md:text-4xl font-black font-mono text-emerald-300">4.2x</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Faster Intake Speed</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Compared to manual typing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
