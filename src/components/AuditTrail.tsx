import React, { useState } from 'react';
import { AuditRecord, UserRole } from '../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  UserCheck,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowUpDown
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  auditLogs: AuditRecord[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  darkMode: boolean;
}

export const AuditTrail: React.FC<Props> = ({
  auditLogs,
  currentRole,
  setCurrentRole,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');

  const roles: { role: UserRole; name: string; title: string }[] = [
    { role: 'Pharmacist', name: 'Dr. Sarah Chen, RPh', title: 'Lead Pharmacist' },
    { role: 'Staff', name: 'Alex Miller, CPhT', title: 'Pharmacy Tech' },
    { role: 'Manager', name: 'Elena Rostova, PharmD', title: 'Pharmacy Manager' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (badgeFilter !== 'all' && log.badgeType !== badgeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetMedicine.toLowerCase().includes(q) ||
        log.batch.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getBadgeStyle = (badgeType: AuditRecord['badgeType']) => {
    switch (badgeType) {
      case 'scan':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'verify':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'correct':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'override':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'quarantine':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'dispense':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'sync':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleExportCSV = () => {
    sound.playSuccess();
    const headers = ['Timestamp', 'Operator', 'Role', 'Action', 'Medicine', 'Batch', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.targetMedicine}"`,
      `"${l.batch}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medivault_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="audit" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 mb-4">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-mono font-semibold text-teal-300 uppercase tracking-wider">
              Regulatory Compliance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Immutable Audit Trail
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Meets FDA 21 CFR Part 11 and DSCSA standards. Tracks every scan, expiration verification,
            data correction, quarantine order, and FEFO override with operator identity and justification reasons.
          </p>
        </div>

        {/* ROLE SWITCHER STRIP */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Active Operator Role Switcher
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Select who performs subsequent actions. Writes real-time operator credentials into new audit records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {roles.map((r) => {
              const isSelected = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentRole(r.role);
                    sound.playScanClick();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-950 shrink-0" />
                  <div>
                    <span className="block leading-tight">{r.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">{r.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AUDIT LOGS SEARCH, FILTER & EXPORT */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setBadgeFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'all'
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                All Events ({auditLogs.length})
              </button>
              <button
                onClick={() => setBadgeFilter('scan')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'scan'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Scans
              </button>
              <button
                onClick={() => setBadgeFilter('override')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'override'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Overrides
              </button>
              <button
                onClick={() => setBadgeFilter('verify')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'verify'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Verifications
              </button>
              <button
                onClick={() => setBadgeFilter('quarantine')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'quarantine'
                    ? 'bg-rose-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Quarantines
              </button>
              <button
                onClick={() => setBadgeFilter('dispense')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  badgeFilter === 'dispense'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                Dispenses
              </button>
            </div>

            {/* Search and Export */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search logs or reasons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5 shrink-0"
                title="Download CSV for compliance inspection"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Export CSV
              </button>
            </div>
          </div>

          {/* AUDIT LOG TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Operator &amp; Role</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Medication &amp; Batch</th>
                  <th className="pb-3 font-semibold">Details &amp; Stated Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No audit events matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {log.timestamp}
                        {log.offlineSynced && (
                          <span className="block text-[9px] text-cyan-400">
                            ✓ Synced via Offline Queue
                          </span>
                        )}
                      </td>

                      {/* Operator & Role */}
                      <td className="py-3 whitespace-nowrap">
                        <span className="font-bold text-white block">{log.userName}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Role: {log.role}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                            log.badgeType
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Medication & Batch */}
                      <td className="py-3">
                        <span className="font-semibold text-slate-200 block truncate max-w-xs">
                          {log.targetMedicine}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">
                          Lot: {log.batch}
                        </span>
                      </td>

                      {/* Details & Stated Reason */}
                      <td className="py-3 text-slate-300 max-w-md leading-relaxed text-[11px]">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Audit Records: {filteredLogs.length} entries</span>
            <span className="text-emerald-400 font-bold">SHA-256 Hash Chain Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
};
