import React, { useState } from 'react';
import { AlertNotification, UserRole } from '../types';
import {
  BellRing,
  Smartphone,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  alerts: AlertNotification[];
  currentRole: UserRole;
  onResolveAlert: (alertId: string, actionTaken: string) => void;
  darkMode: boolean;
}

export const AlertEngine: React.FC<Props> = ({
  alerts,
  currentRole,
  onResolveAlert,
  darkMode,
}) => {
  const [smsWhatsAppEnabled, setSmsWhatsAppEnabled] = useState(true);
  const [phoneRecipient, setPhoneRecipient] = useState('+1 (555) 019-2834');
  const [filterRule, setFilterRule] = useState<string>('all');

  const rules = [
    {
      threshold: '180 days',
      label: 'Yellow-zone review',
      description: 'Reviews run-rates and ensures stock is not buried behind newer arrivals.',
      color: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20',
      dot: 'bg-yellow-400',
    },
    {
      threshold: '90 days',
      label: 'Prioritize usage',
      description: 'Moves cartons to front dispensing bins and suggests early prescription filling.',
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/20',
      dot: 'bg-amber-400',
    },
    {
      threshold: '30 days',
      label: 'Urgent action / return',
      description: 'Initiates supplier return authorization for credit or discounts according to policy.',
      color: 'border-rose-500/40 text-rose-300 bg-rose-950/20',
      dot: 'bg-rose-500',
    },
    {
      threshold: 'Expired',
      label: 'Quarantine + disposal',
      description: 'Immediate mandatory isolation to prevent accidental handover to patients.',
      color: 'border-zinc-700 text-zinc-300 bg-zinc-950',
      dot: 'bg-zinc-400',
    },
  ];

  const filteredAlerts = alerts.filter((a) => {
    if (filterRule === 'all') return true;
    return a.rule === filterRule;
  });

  return (
    <section id="alerts" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 mb-4">
            <BellRing className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-mono font-semibold text-rose-300 uppercase tracking-wider">
              Multi-Channel Alert Dispatch
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            MediVault Alert Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Multi-modal notification delivering critical expiry thresholds via the Station LED ring,
            tactile hardware buzzer, 7-inch touchscreen, and optional SMS/WhatsApp mobile dispatch.
          </p>
        </div>

        {/* DELIVERY HARDWARE & CHANNELS BAR */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Hardware channels display */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Hardware Channels:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LED Ring (360° Visual)
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              Station Buzzer (85dB Cues)
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              7" Station Touchscreen
            </div>
          </div>

          {/* SMS / WhatsApp Mobile Alert Toggle */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-white/10">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">SMS &amp; WhatsApp Alerts</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {smsWhatsAppEnabled ? `Paging ${phoneRecipient}` : 'Muted'}
              </p>
            </div>
            <button
              onClick={() => {
                setSmsWhatsAppEnabled(!smsWhatsAppEnabled);
                sound.playScanClick();
              }}
              className={`ml-2 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                smsWhatsAppEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  smsWhatsAppEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* EXACT 4 THRESHOLD RULES STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
          {rules.map((rule) => {
            const isSelected = filterRule === rule.threshold;
            return (
              <div
                key={rule.threshold}
                onClick={() => {
                  setFilterRule(filterRule === rule.threshold ? 'all' : rule.threshold);
                  sound.playScanClick();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${rule.color} ${
                  isSelected ? 'ring-2 ring-white/60 shadow-lg' : 'hover:opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    Rule: {rule.threshold}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${rule.dot}`} />
                </div>
                <h4 className="text-sm font-extrabold text-white">"{rule.label}"</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {rule.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ACTIVE ALERTS FEED CONTAINER */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Live Alert Feed ({filteredAlerts.length} Active Notice{filteredAlerts.length !== 1 ? 's' : ''})
              </h3>
            </div>

            {filterRule !== 'all' && (
              <button
                onClick={() => setFilterRule('all')}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Clear Filter (Show All)
              </button>
            )}
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No active alerts in this category</p>
              <p className="text-xs text-slate-500 mt-1">All shelf items compliant with safety thresholds.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                        alt.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : alt.severity === 'urgent'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      }`}
                    >
                      <ShieldAlert className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {alt.rule} rule
                        </span>
                        <h4 className="text-sm font-bold text-white">{alt.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">• {alt.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-200">
                        <strong className="text-white">{alt.medicine}</strong> (Lot: {alt.batch})
                        &bull; <span className="text-cyan-300 font-mono">Location: {alt.shelfLocation}</span> ({alt.quantity} units)
                      </p>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Recommended: <span className="text-slate-300 italic">{alt.recommendedAction}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        onResolveAlert(
                          alt.id,
                          `Executed protocol for ${alt.medicine} (${alt.batch}): ${alt.recommendedAction}. Resolved by ${currentRole}.`
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Execute Action
                    </button>

                    <button
                      onClick={() => {
                        sound.playScanClick();
                        onResolveAlert(
                          alt.id,
                          `Alert dismissed without immediate inventory change by ${currentRole}.`
                        );
                      }}
                      className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
