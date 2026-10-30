import React from 'react';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOnline: boolean;
  toggleOnline: () => void;
  pendingSyncCount: number;
  isSyncing: boolean;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<Props> = ({
  darkMode,
  setDarkMode,
  isOnline,
  toggleOnline,
  pendingSyncCount,
  isSyncing,
  currentRole,
  setCurrentRole,
  soundEnabled,
  setSoundEnabled,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roles: { role: UserRole; label: string; name: string }[] = [
    { role: 'Pharmacist', label: 'Pharmacist (Lead)', name: 'Dr. Sarah Chen, RPh' },
    { role: 'Staff', label: 'Pharmacy Technician', name: 'Alex Miller, CPhT' },
    { role: 'Manager', label: 'Pharmacy Manager', name: 'Elena Rostova, PharmD' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 bg-opacity-80 border-white/10 dark:bg-slate-950/80 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  MediVault
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Station
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">Countertop & Mobile Inventory</p>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          <a href="#pipeline" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            12-Step Pipeline
          </a>
          <a href="#live-demo" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Intake Demo
          </a>
          <a href="#storage" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            FEFO Storage
          </a>
          <a href="#engines" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Smart Engines
          </a>
          <a href="#dispensing" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Dispense Simulator
          </a>
          <a href="#alerts" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Alerts
          </a>
          <a href="#dashboard" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Dashboard
          </a>
          <a href="#audit" className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            Audit Trail
          </a>
        </nav>

        {/* Right side controls: Offline Chip, Role Switcher, Sound & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline-First Status Chip */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 dark:bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-full text-xs">
            <button
              onClick={toggleOnline}
              title="Click to toggle network simulation"
              className="flex items-center gap-1.5 font-medium hover:opacity-80 transition-opacity"
            >
              {isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline text-emerald-400 text-[11px] font-semibold">Online</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline text-amber-400 text-[11px] font-semibold">Offline Mode</span>
                </>
              )}
            </button>

            <span className="text-slate-600">|</span>

            {/* Sync counter badge */}
            {isSyncing ? (
              <span className="flex items-center gap-1 text-[11px] text-cyan-400 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing...
              </span>
            ) : (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  pendingSyncCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                    : 'text-slate-400'
                }`}
                title="Transactions stored locally in offline database"
              >
                {pendingSyncCount > 0 ? `Pending sync: ${pendingSyncCount}` : 'Synced'}
              </span>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 transition-colors text-slate-200"
              title="Switch user role for audit trail"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{roles.find((r) => r.role === currentRole)?.name.split(',')[0]}</span>
              <span className="lg:hidden">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-1.5 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1">
                  Active Operator (Audit Identity)
                </div>
                {roles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setCurrentRole(item.role);
                      setRoleMenuOpen(false);
                      sound.playScanClick();
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col transition-colors ${
                      currentRole === item.role
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              sound.enabled = next;
              if (next) sound.playSuccess();
            }}
            className="p-2 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 transition-colors text-slate-300"
            title={soundEnabled ? 'Mute Station sound effects' : 'Enable Station sound cues'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 transition-colors text-slate-300"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
