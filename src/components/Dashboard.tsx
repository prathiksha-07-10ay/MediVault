import React, { useState } from 'react';
import { InventoryItem, ItemStatus, PerformanceMetrics, UserRole } from '../types';
import {
  LayoutDashboard,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  Sparkles,
  Zap,
  Boxes,
  Clock,
  ShieldCheck,
  Check,
  FileCheck,
  CornerDownRight,
  Gauge
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  inventory: InventoryItem[];
  currentRole: UserRole;
  metrics: PerformanceMetrics;
  onExecuteRecommendedAction: (actionTitle: string, details: string) => void;
  darkMode: boolean;
}

export const Dashboard: React.FC<Props> = ({
  inventory,
  currentRole,
  metrics,
  onExecuteRecommendedAction,
  darkMode,
}) => {
  // Tabs: Stock summary, Near-expiry list, FEFO pick list, Expired/damaged stock
  const [activeTab, setActiveTab] = useState<
    'stock_summary' | 'near_expiry' | 'fefo_pick' | 'expired_damaged'
  >('stock_summary');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter items based on active tab and query
  const getTabFilteredItems = () => {
    let list = [...inventory];

    if (activeTab === 'near_expiry') {
      list = list.filter((i) => i.status === 'Near expiry' || ((i.daysToExpiry ?? 100) > 0 && (i.daysToExpiry ?? 100) <= 60));
    } else if (activeTab === 'fefo_pick') {
      list = list
        .filter((i) => i.status !== 'Expired' && i.status !== 'Quarantined' && i.status !== 'Returned')
        .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
    } else if (activeTab === 'expired_damaged') {
      list = list.filter((i) => i.status === 'Expired' || i.status === 'Quarantined' || i.status === 'Returned');
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((i) => i.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.medicine.toLowerCase().includes(q) ||
          i.batch.toLowerCase().includes(q) ||
          i.shelfLocation.toLowerCase().includes(q) ||
          i.supplierReference.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const displayedItems = getTabFilteredItems();

  // Additional 3 Cards metrics
  const lowStockItems = inventory.filter((i) => i.quantity <= i.reorderThreshold);
  const pendingVerificationTasks = [
    { title: 'Lot AMX-2026-X1', desc: 'OCR Expiry confidence 68% needs sign-off', time: '12m ago' },
    { title: 'Wholesaler EDI Batch', desc: 'McKesson electronic slip 9921', time: '34m ago' },
  ];
  const returnEligibleItems = inventory.filter(
    (i) => (i.daysToExpiry ?? 100) > 0 && (i.daysToExpiry ?? 100) <= 30
  );

  // Exact 5 Recommended Actions
  const handleActionClick = (actionName: string) => {
    sound.playSuccess();
    switch (actionName) {
      case 'Use earliest-expiry batch first':
        onExecuteRecommendedAction(
          'Use earliest-expiry batch first',
          `Re-sorted dispensing queues and illuminated front shelf positions for fastest expiring lots.`
        );
        break;
      case 'Discount or prioritize short-dated stock (if allowed)':
        onExecuteRecommendedAction(
          'Discount or prioritize short-dated stock (if allowed)',
          `Flagged 3 short-dated SKUs in POS system for promotional dispenses according to state pharmacy guidelines.`
        );
        break;
      case 'Return to supplier (if eligible)':
        onExecuteRecommendedAction(
          'Return to supplier (if eligible)',
          `Generated McKesson return manifest for credit on 2 lots under 30-day threshold.`
        );
        break;
      case 'Reorder only low-stock medicines':
        onExecuteRecommendedAction(
          'Reorder only low-stock medicines',
          `Automated replenishment trigger dispatched for Levothyroxine 50mcg (current: 45, par: 60).`
        );
        break;
      case 'Quarantine expired stock':
        onExecuteRecommendedAction(
          'Quarantine expired stock',
          `Transferred expired lot ATV-901-LK to Isolation Bay Q1 and locked database dispensing rights.`
        );
        break;
    }
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Near expiry':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Expired':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Quarantined':
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
      case 'Returned':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <section id="dashboard" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Pharmacy Inventory Hub &amp; KPIs
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Real-time status of all medicine batches, shelf locations, supplier manifests, and system accuracy benchmarks.
          </p>
        </div>

        {/* TOP ROW: 3 ADDITIONAL CARDS + NEW SYSTEM PERFORMANCE CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card A: Low-stock warnings */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Reorder Alert
                </span>
                <TrendingDown className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Low-Stock Warnings</h3>
              <p className="text-2xl font-black font-mono text-cyan-300 mt-2">
                {lowStockItems.length} SKU{lowStockItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5">
              Levothyroxine 50mcg &bull; Below threshold (45 / 60)
            </p>
          </div>

          {/* Card B: Pending verification tasks */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Pharmacist Sign-Off
                </span>
                <FileCheck className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Pending Verification Tasks</h3>
              <p className="text-2xl font-black font-mono text-amber-300 mt-2">
                {pendingVerificationTasks.length} Pending
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5 truncate">
              {pendingVerificationTasks[0].desc}
            </p>
          </div>

          {/* Card C: Return-eligible stock */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Credit Recovery
                </span>
                <RotateCcw className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Return-Eligible Stock</h3>
              <p className="text-2xl font-black font-mono text-emerald-300 mt-2">
                {returnEligibleItems.length} Lot{returnEligibleItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5">
              Qualifies for 85–100% wholesaler credit policy
            </p>
          </div>

          {/* NEW METRICS CARD: SYSTEM PERFORMANCE */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/40 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  System Performance
                </span>
                <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">
                  PASS
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">Hardware &amp; AI Benchmarks</h3>

              <div className="mt-2 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Barcode Decode:</span>
                  <span className="text-emerald-400 font-bold">
                    {metrics.medianDecodeTimeSec}s med / {metrics.p95DecodeTimeSec}s p95
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Error Rate:</span>
                  <span className="text-emerald-400 font-bold">
                    {metrics.criticalFieldErrorRate.toFixed(2)}% (Target: 0%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Human Intervention:</span>
                  <span className="text-cyan-300 font-bold">{metrics.humanInterventionRate}%</span>
                </div>
              </div>
            </div>

            {/* Field-level accuracy breakdown: medicine, batch, expiry shown separately */}
            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-slate-300">
              <span className="text-slate-400 block mb-1">Field-Level Accuracy:</span>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="bg-slate-950/80 p-1 rounded border border-white/5">
                  <p className="text-slate-400 text-[8px]">MEDICINE</p>
                  <p className="font-bold text-emerald-400">{metrics.fieldAccuracy.medicine}%</p>
                </div>
                <div className="bg-slate-950/80 p-1 rounded border border-white/5">
                  <p className="text-slate-400 text-[8px]">BATCH</p>
                  <p className="font-bold text-emerald-400">{metrics.fieldAccuracy.batch}%</p>
                </div>
                <div className="bg-slate-950/80 p-1 rounded border border-white/5">
                  <p className="text-slate-400 text-[8px]">EXPIRY</p>
                  <p className="font-bold text-emerald-400">{metrics.fieldAccuracy.expiry}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDED ACTIONS PANEL (EXACTLY THE 5 REQUESTED ACTIONS) */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/50 border border-emerald-500/30 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended Actions Engine
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                One-click operations that instantly sync table queues, notify dispensers, and log audit entries.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded">
              Operator: {currentRole}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {[
              {
                title: 'Use earliest-expiry batch first',
                desc: 'Sort queues by FEFO priority',
                badge: 'FEFO',
              },
              {
                title: 'Discount or prioritize short-dated stock (if allowed)',
                desc: 'Apply promo flag in POS',
                badge: 'Discount',
              },
              {
                title: 'Return to supplier (if eligible)',
                desc: 'Draft McKesson credit PO',
                badge: 'Return',
              },
              {
                title: 'Reorder only low-stock medicines',
                desc: 'Levothyroxine PO draft',
                badge: 'Reorder',
              },
              {
                title: 'Quarantine expired stock',
                desc: 'Lock ATV-901-LK to Bay Q1',
                badge: 'Quarantine',
              },
            ].map((action) => (
              <button
                key={action.title}
                onClick={() => handleActionClick(action.title)}
                className="p-3 rounded-xl border border-white/10 bg-slate-900/90 hover:bg-emerald-950/60 hover:border-emerald-400 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {action.badge}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5 group-hover:text-emerald-300 transition-colors">
                    {action.title}
                  </h4>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{action.desc}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-emerald-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TABS & SEARCH BAR FOR INVENTORY DATABASE */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl">
          {/* Key views as tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('stock_summary');
                  sound.playScanClick();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'stock_summary'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Stock Summary ({inventory.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('near_expiry');
                  sound.playScanClick();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'near_expiry'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Near-Expiry List
              </button>

              <button
                onClick={() => {
                  setActiveTab('fefo_pick');
                  sound.playScanClick();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'fefo_pick'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                FEFO Pick List
              </button>

              <button
                onClick={() => {
                  setActiveTab('expired_damaged');
                  sound.playScanClick();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'expired_damaged'
                    ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Expired / Damaged Stock
              </button>
            </div>

            {/* Search and Status Dropdown */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicine, batch, shelf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Near expiry">Near expiry</option>
                <option value="Expired">Expired</option>
                <option value="Quarantined">Quarantined</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>

          {/* EXACT DATABASE MODEL TABLE */}
          {/* Medicine → Batch → Expiry → Quantity → Shelf location, Supplier reference, and Status with exactly: Active, Near expiry, Expired, Quarantined, Returned */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Medicine &amp; Dosage</th>
                  <th className="pb-3 font-semibold">Batch / Lot</th>
                  <th className="pb-3 font-semibold">Expiry Date</th>
                  <th className="pb-3 font-semibold">Quantity</th>
                  <th className="pb-3 font-semibold">Shelf Location</th>
                  <th className="pb-3 font-semibold">Supplier Reference</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No records matched current filters.
                    </td>
                  </tr>
                ) : (
                  displayedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Medicine */}
                      <td className="py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{item.medicine}</span>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            ({item.dosage})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          GTIN: {item.gtin}
                        </span>
                      </td>

                      {/* Batch */}
                      <td className="py-3 font-mono font-bold text-cyan-300">
                        {item.batch}
                      </td>

                      {/* Expiry */}
                      <td className="py-3 font-mono">
                        <span className={
                          item.status === 'Expired'
                            ? 'text-rose-400 font-bold'
                            : item.status === 'Near expiry'
                            ? 'text-amber-400 font-bold'
                            : 'text-emerald-400'
                        }>
                          {item.expiry}
                        </span>
                        {item.daysToExpiry !== undefined && (
                          <span className="text-[10px] text-slate-400 block">
                            {item.daysToExpiry <= 0
                              ? `Expired (${Math.abs(item.daysToExpiry)}d ago)`
                              : `${item.daysToExpiry}d remaining`}
                          </span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-3 font-mono text-white font-bold">
                        {item.quantity}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                      </td>

                      {/* Shelf location */}
                      <td className="py-3 font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] border border-white/5">
                          {item.shelfLocation}
                        </span>
                      </td>

                      {/* Supplier reference */}
                      <td className="py-3 font-mono text-slate-400 text-[11px]">
                        {item.supplierReference}
                      </td>

                      {/* Status (Active, Near expiry, Expired, Quarantined, Returned) */}
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Displaying {displayedItems.length} of {inventory.length} records</span>
            <span className="text-emerald-400">Database Engine: SQLite v3.45 (Local Offline-First)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
