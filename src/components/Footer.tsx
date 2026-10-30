import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Lock, Heart } from 'lucide-react';

interface Props {
  darkMode: boolean;
}

export const Footer: React.FC<Props> = ({ darkMode }) => {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 relative z-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                MediVault Station
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                v3.4 Production
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Smart Inventory. Safer Medicine. Countertop scanning station, mobile companion, and offline-first
              inventory management purpose-built for healthcare pharmacies.
            </p>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <HardDrive className="w-3.5 h-3.5" />
                Offline-First SQLite
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Lock className="w-3.5 h-3.5" />
                DSCSA Compliant
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-3">
              Station System
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#pipeline" className="hover:text-emerald-400 transition-colors">
                  12-Step Architecture
                </a>
              </li>
              <li>
                <a href="#live-demo" className="hover:text-emerald-400 transition-colors">
                  Interactive Intake Bay
                </a>
              </li>
              <li>
                <a href="#storage" className="hover:text-emerald-400 transition-colors">
                  Physical FEFO Shelves
                </a>
              </li>
              <li>
                <a href="#engines" className="hover:text-emerald-400 transition-colors">
                  Smart Expiry Engines
                </a>
              </li>
              <li>
                <a href="#dispensing" className="hover:text-emerald-400 transition-colors">
                  Dispense Safety Check
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-3">
              Standards &amp; Security
            </h4>
            <ul className="space-y-2">
              <li className="text-slate-300">GS1 General Specifications (AI 01, 10, 17)</li>
              <li className="text-slate-300">FDA 21 CFR Part 11 Electronic Records</li>
              <li className="text-slate-300">HIPAA &amp; DSCSA Track-and-Trace</li>
              <li className="text-slate-300">ISO/IEC 16022 2D DataMatrix</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 MediVault Health Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered with zero-tolerance for medication expiration errors.
          </p>
        </div>
      </div>
    </footer>
  );
};
