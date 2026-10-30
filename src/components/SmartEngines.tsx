import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import {
  Cpu,
  Clock,
  Layers,
  TrendingDown,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  FileEdit,
  Send,
  Boxes,
  ShieldAlert,
  ShoppingCart
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  inventory: InventoryItem[];
  currentRole: UserRole;
  onAuditAction: (action: string, medicine: string, batch: string, details: string, badgeType: any) => void;
  darkMode: boolean;
}

export const SmartEngines: React.FC<Props> = ({
  inventory,
  currentRole,
  onAuditAction,
  darkMode,
}) => {
  // Modal state for FEFO override reason
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedBatchForOverride, setSelectedBatchForOverride] = useState<InventoryItem | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [reorderPlaced, setReorderPlaced] = useState(false);

  // Group inventory for Expiry Monitor
  const expiredItems = inventory.filter((i) => (i.daysToExpiry ?? 100) <= 0 || i.status === 'Expired');
  const thirtyDayItems = inventory.filter((i) => (i.daysToExpiry ?? 100) > 0 && (i.daysToExpiry ?? 100) <= 30);
  const sixtyDayItems = inventory.filter((i) => (i.daysToExpiry ?? 100) > 30 && (i.daysToExpiry ?? 100) <= 60);
  const ninetyDayItems = inventory.filter((i) => (i.daysToExpiry ?? 100) > 60 && (i.daysToExpiry ?? 100) <= 90);

  // FEFO sorting for Amoxicillin as example
  const amoxBatches = inventory
    .filter((i) => i.medicine.includes('Amoxicillin') && i.status !== 'Expired')
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  // Stock monitoring
  const lowStockItems = inventory.filter((i) => i.quantity <= i.reorderThreshold);
  const overstockItems = inventory.filter((i) => i.quantity > 500);

  const handleOpenOverride = (item: InventoryItem) => {
    setSelectedBatchForOverride(item);
    setOverrideReason('');
    setOverrideModalOpen(true);
    sound.playWarning();
  };

  const handleConfirmOverride = () => {
    if (!selectedBatchForOverride || !overrideReason.trim()) return;

    sound.playSuccess();
    onAuditAction(
      'FEFO Override Reason Recorded',
      selectedBatchForOverride.medicine,
      selectedBatchForOverride.batch,
      `Operator bypassed earliest batch for newer batch ${selectedBatchForOverride.batch}. Stated Reason: "${overrideReason.trim()}". Approved under role: ${currentRole}`,
      'override'
    );

    setOverrideModalOpen(false);
    setSelectedBatchForOverride(null);
    setOverrideReason('');
  };

  const handleGenerateReorder = () => {
    sound.playSuccess();
    setReorderPlaced(true);
    onAuditAction(
      'Wholesaler EDI Reorder Transmitted',
      'Levothyroxine 50mcg & Atorvastatin 20mg',
      'EDI-PO-8812',
      `Automated replenishment PO sent to McKesson for below-threshold SKUs. Executed by ${currentRole}.`,
      'scan'
    );
    setTimeout(() => setReorderPlaced(false), 3000);
  };

  return (
    <section id="engines" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 mb-4">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-mono font-semibold text-teal-300 uppercase tracking-wider">
              Automated Intelligence
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Three Core Smart Engines
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Continuous background analysis keeps shelf rotation compliant, mitigates expiry write-offs,
            and eliminates supply shortages without manual spreadsheets.
          </p>
        </div>

        {/* THREE EXACT REQUIRED ENGINE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CARD 1: EXPIRY MONITOR */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">1. Expiry Monitor</h3>
                    <p className="text-[11px] text-slate-400 font-mono">90d, 60d, 30d &amp; Expired Tiers</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                  Active Rule
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Automated multi-tier alert engine constantly groups lots into 90, 60, and 30-day escalation bands
                and locks expired medications immediately.
              </p>

              {/* Tiers List */}
              <div className="space-y-2.5 mb-4">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                    <span className="font-bold text-white">Expired Stock (Disposal)</span>
                  </div>
                  <span className="font-mono text-rose-300 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                    {expiredItems.length} lot(s)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    <span className="font-bold text-white">30-Day Alert (Urgent Return)</span>
                  </div>
                  <span className="font-mono text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                    {thirtyDayItems.length} lot(s)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-yellow-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="font-bold text-white">60-Day Alert (Usage Priority)</span>
                  </div>
                  <span className="font-mono text-yellow-300 font-bold bg-yellow-950 px-2 py-0.5 rounded border border-yellow-500/30">
                    {sixtyDayItems.length} lot(s)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">90-Day Review (Front Shelf)</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    {ninetyDayItems.length} lot(s)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Next automated sweep:</span>
              <span className="text-cyan-400 font-semibold">Continuous (Local SQLite)</span>
            </div>
          </div>

          {/* CARD 2: FEFO ENGINE */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ArrowUpDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">2. FEFO Engine</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Earliest Expiry Sort &amp; Override</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Enforced
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Strict First-Expired, First-Out sorting. Always serves earliest batch first. Any attempt to pick
                a later batch triggers a mandatory typed justification saved to the audit trail.
              </p>

              {/* Sample Amoxicillin FEFO Queue */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-4">
                <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  Example: Amoxicillin FEFO Queue
                </p>

                <div className="space-y-2">
                  {amoxBatches.map((batchItem, index) => {
                    const isEarliest = index === 0;
                    return (
                      <div
                        key={batchItem.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isEarliest
                            ? 'bg-emerald-950/40 border-emerald-400/60'
                            : 'bg-slate-900 border-white/5 opacity-80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{batchItem.batch}</span>
                            {isEarliest && (
                              <span className="text-[9px] font-mono uppercase bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                                Recommended Pick
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Exp: {batchItem.expiry} ({batchItem.daysToExpiry}d left) • {batchItem.shelfLocation}
                          </span>
                        </div>

                        {!isEarliest && (
                          <button
                            onClick={() => handleOpenOverride(batchItem)}
                            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition-colors"
                          >
                            Override
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Override Policy:</span>
              <span className="text-amber-400 font-semibold">Typed Reason Required</span>
            </div>
          </div>

          {/* CARD 3: STOCK MONITOR */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">3. Stock Monitor</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Thresholds, Overstock &amp; Reorder</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                  Balanced
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Monitors reorder triggers against average daily prescription run-rates. Flags slow-moving overstock
                and creates 1-click wholesaler purchase manifests.
              </p>

              {/* Status metrics */}
              <div className="space-y-2.5 mb-4">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">Low-Stock Trigger (Reorder)</span>
                    <span className="font-mono text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      {lowStockItems.length} items below threshold
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Levothyroxine 50mcg: 45 units remaining (Min: 60)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">Overstock Detection</span>
                    <span className="font-mono text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded">
                      {overstockItems.length} SKU flagged
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Metformin 850mg: 680 units total (Exceeds 45-day buffer)
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateReorder}
                disabled={reorderPlaced}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                {reorderPlaced ? 'PO #8812 Transmitted via EDI!' : 'Generate Wholesaler Reorder PO'}
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Optimization Goal:</span>
              <span className="text-emerald-400 font-semibold">Zero Stockouts, Zero Waste</span>
            </div>
          </div>
        </div>

        {/* OVERRIDE MODAL REQUIRING TYPED REASON */}
        {overrideModalOpen && selectedBatchForOverride && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-amber-500/50 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-white">FEFO Override Justification Required</h4>
                  <p className="text-xs text-slate-400">Regulatory Audit Requirement</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                You are picking batch <strong className="text-white font-mono">{selectedBatchForOverride.batch}</strong>{' '}
                (Expiry: {selectedBatchForOverride.expiry}) while an earlier batch is available on the shelf.
                A typed justification must be logged in the immutable audit trail.
              </p>

              <div className="mb-4">
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Type Justification Reason:
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Patient specifically requested unopened 100-count bottle for 90-day travel supply..."
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel &amp; Follow FEFO
                </button>

                <button
                  onClick={handleConfirmOverride}
                  disabled={!overrideReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Sign &amp; Commit Override to Audit Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
