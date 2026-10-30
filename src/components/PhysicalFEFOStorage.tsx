import React, { useState } from 'react';
import {
  Boxes,
  Calendar,
  QrCode,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  darkMode: boolean;
  onPrintLabel: (labelInfo: string) => void;
}

interface ShelfSlotItem {
  id: string;
  medicine: string;
  batch: string;
  baseDaysLeft: number;
  quantity: number;
  position: 'FRONT' | 'BACK';
  bay: string;
  internalBatchId: string;
  medicineId: string;
  isQuarantined?: boolean;
}

export const PhysicalFEFOStorage: React.FC<Props> = ({
  darkMode,
  onPrintLabel,
}) => {
  // Time travel slider (0 to 240 days into the future)
  const [timeOffsetDays, setTimeOffsetDays] = useState<number>(0);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [selectedLabelItem, setSelectedLabelItem] = useState({
    medicine: 'Amoxicillin Trihydrate 500mg',
    medicineId: 'MED-AMX-500',
    batch: 'AMX-2024-88',
    expiry: '2026-11-15',
    internalBatchId: 'MV-BATCH-4091',
  });

  const shelfItems: ShelfSlotItem[] = [
    {
      id: 'sh-1',
      medicine: 'Amoxicillin 500mg',
      batch: 'AMX-2024-88',
      baseDaysLeft: 22,
      quantity: 140,
      position: 'FRONT',
      bay: 'Bay A (Antibiotics)',
      internalBatchId: 'MV-BATCH-4091',
      medicineId: 'MED-AMX-500',
    },
    {
      id: 'sh-2',
      medicine: 'Amoxicillin 500mg',
      batch: 'AMX-2025-04',
      baseDaysLeft: 178,
      quantity: 450,
      position: 'BACK',
      bay: 'Bay A (Antibiotics)',
      internalBatchId: 'MV-BATCH-4158',
      medicineId: 'MED-AMX-500',
    },
    {
      id: 'sh-3',
      medicine: 'Metformin 850mg ER',
      batch: 'MET-772-ER',
      baseDaysLeft: 65,
      quantity: 80,
      position: 'FRONT',
      bay: 'Bay B (Metabolic)',
      internalBatchId: 'MV-BATCH-4201',
      medicineId: 'MED-MET-850',
    },
    {
      id: 'sh-4',
      medicine: 'Metformin 850mg ER',
      batch: 'MET-890-ER',
      baseDaysLeft: 290,
      quantity: 600,
      position: 'BACK',
      bay: 'Bay B (Metabolic)',
      internalBatchId: 'MV-BATCH-4412',
      medicineId: 'MED-MET-850',
    },
    {
      id: 'sh-5',
      medicine: 'Levothyroxine 50mcg',
      batch: 'LEV-50-BATCH',
      baseDaysLeft: 27,
      quantity: 45,
      position: 'FRONT',
      bay: 'Bay C (Thyroid)',
      internalBatchId: 'MV-BATCH-4077',
      medicineId: 'MED-LEV-050',
    },
    {
      id: 'sh-6',
      medicine: 'Insulin Glargine 100U',
      batch: 'INS-GL-3341',
      baseDaysLeft: 142,
      quantity: 25,
      position: 'FRONT',
      bay: 'Cold Chain (Fridge)',
      internalBatchId: 'MV-BATCH-4490',
      medicineId: 'MED-INS-100',
    },
    {
      id: 'sh-7',
      medicine: 'Atorvastatin 20mg (Expired)',
      batch: 'ATV-901-LK',
      baseDaysLeft: -14,
      quantity: 35,
      position: 'FRONT',
      bay: 'Quarantine Bay Q1',
      internalBatchId: 'MV-BATCH-3882',
      medicineId: 'MED-ATV-020',
      isQuarantined: true,
    },
  ];

  // Helper to get color zone based on simulated days remaining
  const getZone = (days: number, isQuarantined?: boolean) => {
    if (isQuarantined) {
      return {
        label: 'Black (Quarantine)',
        badgeClass: 'bg-zinc-900 text-zinc-300 border-zinc-700',
        cardClass: 'border-zinc-800 bg-zinc-950/90 text-zinc-300',
        dotColor: 'bg-zinc-500',
      };
    }
    if (days <= 0 || days <= 30) {
      return {
        label: 'Red (≤30 days / Expired)',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        cardClass: 'border-rose-500/40 bg-rose-950/30 text-rose-100',
        dotColor: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
      };
    }
    if (days <= 90) {
      return {
        label: 'Orange (90 to 30 days)',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        cardClass: 'border-amber-500/40 bg-amber-950/30 text-amber-100',
        dotColor: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
      };
    }
    if (days <= 180) {
      return {
        label: 'Yellow (180 to 90 days)',
        badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        cardClass: 'border-yellow-500/30 bg-yellow-950/20 text-yellow-100',
        dotColor: 'bg-yellow-400 shadow-[0_0_8px_#facc15]',
      };
    }
    return {
      label: 'Green (>180 days)',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      cardClass: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    };
  };

  const handleCopyPayload = () => {
    const payload = `[MEDIVAULT_MICRO_QR] ID:${selectedLabelItem.medicineId}|BATCH:${selectedLabelItem.batch}|EXP:${selectedLabelItem.expiry}|INTERNAL:${selectedLabelItem.internalBatchId}`;
    navigator.clipboard?.writeText(payload);
    setCopiedPayload(true);
    sound.playSuccess();
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <section id="storage" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4">
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider">
              Physical Inventory Discipline
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Physical FEFO Storage
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate expiration waste through physical shelf organization. Color-coded zones
            provide instant visual health checks, while the back-load / front-pick rule ensures strict FIFO/FEFO rotation.
          </p>
        </div>

        {/* RULE BANNER: "Load new stock from BACK, pick existing stock from FRONT" */}
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border-2 border-amber-500/40 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold block mb-1">
            Golden Pharmacy Rule
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            "Load new stock from <span className="text-cyan-400 underline decoration-cyan-400/50">BACK</span>, pick existing stock from <span className="text-emerald-400 underline decoration-emerald-400/50">FRONT</span>"
          </p>
          <p className="text-xs text-slate-300 mt-2 max-w-xl mx-auto">
            Ensures earliest-expiring packages are physically adjacent to the dispenser's hand at all times.
          </p>
        </div>

        {/* SHELF COLOUR ZONES LEGEND */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Shelf Colour Zones &amp; Legend
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Dynamic threshold monitoring
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] shrink-0" />
              <div>
                <p className="font-bold text-white">Green Zone</p>
                <p className="text-[10px] text-emerald-300">Over 180 days (Fresh)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-yellow-950/40 border border-yellow-500/30">
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15] shrink-0" />
              <div>
                <p className="font-bold text-white">Yellow Zone</p>
                <p className="text-[10px] text-yellow-300">180 to 90 days</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] shrink-0" />
              <div>
                <p className="font-bold text-white">Orange Zone</p>
                <p className="text-[10px] text-amber-300">90 to 30 days (Prioritize)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
              <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] shrink-0" />
              <div>
                <p className="font-bold text-white">Red Zone</p>
                <p className="text-[10px] text-rose-300">30d or less / Expired</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700">
              <div className="w-3 h-3 rounded-full bg-zinc-500 shrink-0" />
              <div>
                <p className="font-bold text-white">Black Zone</p>
                <p className="text-[10px] text-zinc-400">Quarantine (Locked)</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIME TRAVEL SLIDER */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Time Travel Simulator (Shelf Re-Colouring)
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Slide forward in time to watch inventory dynamically transition between colour zones as expiration dates approach.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-black text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/40">
                +{timeOffsetDays} Days Ahead
              </span>
              <button
                onClick={() => {
                  setTimeOffsetDays(0);
                  sound.playScanClick();
                }}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Reset to Day 0 (Today)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider input */}
          <div className="relative pt-2">
            <input
              type="range"
              min="0"
              max="240"
              step="15"
              value={timeOffsetDays}
              onChange={(e) => {
                setTimeOffsetDays(Number(e.target.value));
                sound.playScanClick();
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Today (+0d)</span>
              <span>+30d</span>
              <span>+60d</span>
              <span>+90d (Orange zone)</span>
              <span>+180d</span>
              <span>+240d</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PHYSICAL SHELVES GRID & MICRO-QR LABEL CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: VISUAL SHELVES */}
          <div className="lg:col-span-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-400" />
                Physical Shelves Bay Map (Front vs Back)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                FEFO Order Verified
              </span>
            </div>

            <div className="space-y-4">
              {['Bay A (Antibiotics)', 'Bay B (Metabolic)', 'Bay C (Thyroid)', 'Cold Chain (Fridge)', 'Quarantine Bay Q1'].map((bayName) => {
                const bayItems = shelfItems.filter((i) => i.bay === bayName);
                if (bayItems.length === 0) return null;

                return (
                  <div key={bayName} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        {bayName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {bayName.includes('Quarantine') ? 'Isolation Rules Apply' : 'Back-Load / Front-Pick'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bayItems.map((item) => {
                        const simulatedDays = item.baseDaysLeft - timeOffsetDays;
                        const zone = getZone(simulatedDays, item.isQuarantined);

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedLabelItem({
                                medicine: item.medicine,
                                medicineId: item.medicineId,
                                batch: item.batch,
                                expiry: `Simulated: ${simulatedDays > 0 ? simulatedDays : 0}d left`,
                                internalBatchId: item.internalBatchId,
                              });
                              sound.playScanClick();
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${zone.cardClass}`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-black/40 border border-white/10">
                                {item.position} SLOT
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${zone.dotColor}`} />
                                <span className="text-[10px] font-mono font-bold">
                                  {item.isQuarantined ? 'LOCKED' : `${simulatedDays}d left`}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-extrabold text-white truncate">{item.medicine}</p>
                            <div className="mt-1 flex items-center justify-between text-[10px] font-mono opacity-80">
                              <span>Lot: {item.batch}</span>
                              <span>Qty: {item.quantity}</span>
                            </div>

                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono">
                              <span className="text-slate-400">Zone: {zone.label.split(' ')[0]}</span>
                              <span className="text-cyan-300 font-bold">Tap to view Micro-QR</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 4 COLS: MICRO-QR LABEL CARD FOR SPLIT/PRIMARY UNITS */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-cyan-400" />
                Micro-QR Unit Label
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                Split &amp; Primary Units
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              When boxes are broken down into blisters or unit-dose vials, MediVault generates a serialized Micro-QR
              label to prevent batch mix-ups on the shelf.
            </p>

            {/* Micro-QR Label Simulation Ticket */}
            <div className="rounded-2xl bg-white text-slate-900 p-4 shadow-xl border-2 border-dashed border-slate-300 relative overflow-hidden font-mono text-xs">
              <div className="flex items-start justify-between gap-3 mb-3 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    MEDIVAULT UNIT DOSE
                  </span>
                  <p className="font-extrabold text-xs text-slate-900 mt-1">
                    {selectedLabelItem.medicine}
                  </p>
                </div>

                {/* Simulated 2D Micro-QR Pattern visual */}
                <div className="w-12 h-12 bg-slate-950 p-1 rounded border border-slate-400 shrink-0 flex flex-col justify-between">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[1px] ${
                          (i * 7) % 3 === 0 || i === 0 || i === 3 || i === 12
                            ? 'bg-white'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Exact 3 required fields: Medicine ID, Batch + Expiry, Internal batch ID */}
              <div className="space-y-1.5 text-[11px] bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] block">Medicine ID:</span>
                  <strong className="text-slate-900 font-bold">{selectedLabelItem.medicineId}</strong>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Batch + Expiry:</span>
                  <strong className="text-slate-900 font-bold">
                    {selectedLabelItem.batch} • {selectedLabelItem.expiry}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Internal Batch ID:</span>
                  <strong className="text-cyan-800 font-bold">{selectedLabelItem.internalBatchId}</strong>
                </div>
              </div>

              <div className="mt-2 text-[9px] text-slate-500 text-center">
                ISO/IEC 18004 Compliant Micro-QR Format
              </div>
            </div>

            {/* Label actions: Print and Copy */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onPrintLabel(`Printed label for ${selectedLabelItem.medicine} (${selectedLabelItem.internalBatchId})`);
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                Print Micro-QR Label (Thermal Simulation)
              </button>

              <button
                onClick={handleCopyPayload}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5 transition-colors flex items-center justify-center gap-2"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied QR Data Payload!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    Copy Data Payload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
