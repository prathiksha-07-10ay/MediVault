import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Scan,
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HandMetal,
  Lock,
  Layers,
  Send,
  Boxes
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  inventory: InventoryItem[];
  currentRole: UserRole;
  onDeductInventory: (medicineName: string, batchId: string, quantityToDeduct: number, note: string) => void;
  onQuarantineBatch: (batchId: string, medicineName: string, reason: string) => void;
  onAuditAction: (action: string, medicine: string, batch: string, details: string, badgeType: any) => void;
  darkMode: boolean;
}

export const DispensingSimulator: React.FC<Props> = ({
  inventory,
  currentRole,
  onDeductInventory,
  onQuarantineBatch,
  onAuditAction,
  darkMode,
}) => {
  // Selected medication for dispensing
  const [selectedMed, setSelectedMed] = useState<string>('Amoxicillin Trihydrate');
  const [dispenseQty, setDispenseQty] = useState<number>(30);

  // Simulation outcome states
  const [activeResult, setActiveResult] = useState<
    'idle' | 'expired_block' | 'older_exists_warn' | 'correct_success'
  >('idle');

  // LED ring & buzzer hardware states
  const [ledState, setLedState] = useState<'idle' | 'green' | 'amber' | 'red'>('idle');
  const [buzzerActive, setBuzzerActive] = useState<boolean>(false);
  const [deviceScreenText, setDeviceScreenText] = useState<string>(
    'READY FOR PRE-HANDOUT BARCODE SCAN'
  );

  // FEFO Override modal for dispensing older batch exists
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [dispenseOverrideReason, setDispenseOverrideReason] = useState('');

  // Find recommended FEFO batch
  const medBatches = inventory
    .filter((i) => i.medicine.toLowerCase().includes(selectedMed.toLowerCase()) && i.status !== 'Expired')
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  const fefoBatch = medBatches[0];

  // 1) EXPIRED BATCH SCANNED (BLOCK)
  const handleSimulateExpiredScan = () => {
    setActiveResult('expired_block');
    setLedState('red');
    setBuzzerActive(true);
    setDeviceScreenText('CRITICAL BLOCK: EXPIRED STOCK DETECTED');
    sound.playBuzzer();

    // Quarantine the batch immediately
    onQuarantineBatch(
      'ATV-901-LK',
      'Atorvastatin Calcium 20mg',
      `Hardware locked dispense! Lot expired on 2026-10-10. Moved to Isolation Bay Q1 by ${currentRole}.`
    );

    setTimeout(() => {
      setBuzzerActive(false);
    }, 1800);
  };

  // 2) OLDER BATCH EXISTS SCANNED (WARNING)
  const handleSimulateOlderExistsScan = () => {
    setActiveResult('older_exists_warn');
    setLedState('amber');
    setBuzzerActive(false);
    setDeviceScreenText('WARNING: OLDER FEFO BATCH WAITING ON FRONT SHELF');
    sound.playWarning();
  };

  // 3) CORRECT FEFO BATCH SCANNED (SUCCESS DEDUCT)
  const handleSimulateCorrectScan = () => {
    if (!fefoBatch) return;

    setActiveResult('correct_success');
    setLedState('green');
    setBuzzerActive(false);
    setDeviceScreenText(`VERIFIED: ${dispenseQty} UNITS DEDUCTED FROM LOT ${fefoBatch.batch}`);
    sound.playSuccess();

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 },
      });
    } catch {
      // Confetti fallback
    }

    onDeductInventory(
      fefoBatch.medicine,
      fefoBatch.batch,
      dispenseQty,
      `Dispensed ${dispenseQty} units of ${fefoBatch.medicine} (Lot: ${fefoBatch.batch}) to patient. Mandatory scan verified by ${currentRole}.`
    );
  };

  const handleConfirmDispenseOverride = () => {
    if (!dispenseOverrideReason.trim() || !medBatches[1]) return;

    sound.playSuccess();
    const newerBatch = medBatches[1];
    onAuditAction(
      'FEFO Dispense Override Authorized',
      newerBatch.medicine,
      newerBatch.batch,
      `Dispensed newer lot ${newerBatch.batch} instead of earliest ${fefoBatch?.batch}. Reason: "${dispenseOverrideReason}". Operator: ${currentRole}`,
      'override'
    );

    onDeductInventory(
      newerBatch.medicine,
      newerBatch.batch,
      dispenseQty,
      `Override Dispense: Deducted ${dispenseQty} from newer lot ${newerBatch.batch}.`
    );

    setShowOverrideModal(false);
    setDispenseOverrideReason('');
    setActiveResult('correct_success');
    setLedState('green');
    setDeviceScreenText(`OVERRIDE ACCEPTED: DEDUCTED ${dispenseQty} UNITS FROM LOT ${newerBatch.batch}`);
  };

  const handleReset = () => {
    setActiveResult('idle');
    setLedState('idle');
    setBuzzerActive(false);
    setDeviceScreenText('READY FOR PRE-HANDOUT BARCODE SCAN');
    sound.playScanClick();
  };

  return (
    <section id="dispensing" className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 mb-4">
            <HandMetal className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-mono font-semibold text-rose-300 uppercase tracking-wider">
              Safety Checkpoint
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Dispensing: Scan Before Handout
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The final line of defense against patient harm. Before any package crosses the prescription counter,
            a mandatory 2D scan verifies that the item is within date and aligns with FEFO picking sequence.
          </p>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: STEP WORKFLOW */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Step 1: Select a medicine */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Select Prescription Medication
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Prescription Intake</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Amoxicillin Trihydrate', label: 'Amoxicillin 500mg' },
                  { name: 'Metformin Hydrochloride', label: 'Metformin 850mg ER' },
                  { name: 'Levothyroxine Sodium', label: 'Levothyroxine 50mcg' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSelectedMed(item.name);
                      handleReset();
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedMed === item.name
                        ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: MediVault Displays FEFO Batch to Pick */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  MediVault Calculated FEFO Batch to Pick
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Optimal Batch
                </span>
              </div>

              {fefoBatch ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <p className="text-[10px] font-mono text-slate-400">Target Batch ID</p>
                    <p className="text-xs font-black font-mono text-white mt-0.5">{fefoBatch.batch}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <p className="text-[10px] font-mono text-slate-400">Expiration Date</p>
                    <p className="text-xs font-bold font-mono text-emerald-400 mt-0.5">
                      {fefoBatch.expiry} ({fefoBatch.daysToExpiry}d)
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <p className="text-[10px] font-mono text-slate-400">Shelf Location</p>
                    <p className="text-xs font-bold font-mono text-cyan-300 mt-0.5">
                      {fefoBatch.shelfLocation}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-400 font-mono">No active lots in stock!</p>
              )}
            </div>

            {/* Step 3: Mandatory Scan Simulation & User Picks Result */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Pick a Scan Result to Test Station Response
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Interactive simulator</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1: Expired Batch */}
                <button
                  onClick={handleSimulateExpiredScan}
                  className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-950/60 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase bg-rose-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      Scenario A
                    </span>
                    <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Scan Expired Batch</h4>
                  <p className="text-[10px] text-rose-300/80 mt-1">
                    Triggers BLOCK, red LED &amp; buzzer, auto-quarantines lot.
                  </p>
                </button>

                {/* 2: Older Batch Exists */}
                <button
                  onClick={handleSimulateOlderExistsScan}
                  className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/60 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      Scenario B
                    </span>
                    <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Scan Newer Batch</h4>
                  <p className="text-[10px] text-amber-300/80 mt-1">
                    Triggers WARNING, suggests FEFO, requires typed reason.
                  </p>
                </button>

                {/* 3: Correct Batch */}
                <button
                  onClick={handleSimulateCorrectScan}
                  className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/60 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      Scenario C
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Scan Correct FEFO</h4>
                  <p className="text-[10px] text-emerald-300/80 mt-1">
                    Deducts quantity, logs audit, activates green LED.
                  </p>
                </button>
              </div>
            </div>

            {/* Scan Result Feedback Banner */}
            {activeResult === 'expired_block' && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-100 animate-in shake">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500 text-slate-950 font-black">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">DISPENSING BLOCKED BY MEDIVAULT</h4>
                    <p className="text-xs text-rose-200 mt-0.5">
                      The scanned carton is 14 days expired! Software locked transaction. Batch ATV-901-LK
                      has been automatically transferred to <strong>Quarantine Isolation Bay Q1</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeResult === 'older_exists_warn' && (
              <div className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500 text-amber-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">WARNING: FEFO VIOLATION</h4>
                      <p className="text-xs text-amber-200 mt-0.5">
                        Older batch <strong>{fefoBatch?.batch}</strong> (Expires {fefoBatch?.expiry}) is waiting
                        in slot <strong>{fefoBatch?.shelfLocation}</strong>. Please swap carton.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOverrideModal(true)}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Override FEFO
                  </button>
                </div>
              </div>
            )}

            {activeResult === 'correct_success' && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">HANDOUT APPROVED &bull; QUANTITY DEDUCTED</h4>
                    <p className="text-xs text-emerald-200 mt-0.5">
                      Batch {fefoBatch?.batch} successfully matched. Deducted {dispenseQty} units from local database.
                      Patient safety verified.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: SMALL VIRTUAL DEVICE WITH REACTIVE LED RING & BUZZER ICON */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Virtual MediVault Station
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                Hardware Reactivity
              </span>
            </div>

            {/* Virtual Station Hardware Enclosure */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 p-6 shadow-inner relative flex flex-col items-center justify-center text-center">
              {/* Diffused backlight top stripe */}
              <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

              {/* Reactive LED Ring */}
              <div className="relative my-4">
                {/* Outermost reactive halo glow */}
                <div
                  className={`w-40 h-40 rounded-full transition-all duration-300 flex items-center justify-center ${
                    ledState === 'red'
                      ? 'bg-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.7)] animate-pulse'
                      : ledState === 'amber'
                      ? 'bg-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.6)]'
                      : ledState === 'green'
                      ? 'bg-emerald-500/20 shadow-[0_0_45px_rgba(16,185,129,0.7)]'
                      : 'bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  }`}
                >
                  {/* Concentric LED ring strip */}
                  <div
                    className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-colors duration-300 ${
                      ledState === 'red'
                        ? 'border-rose-500 animate-led'
                        : ledState === 'amber'
                        ? 'border-amber-400'
                        : ledState === 'green'
                        ? 'border-emerald-400'
                        : 'border-cyan-400/50'
                    }`}
                  >
                    {/* Inner core display with Buzzer Icon */}
                    <div className="w-24 h-24 rounded-full bg-slate-950 border border-slate-700 flex flex-col items-center justify-center p-2 relative">
                      {buzzerActive ? (
                        <div className="flex flex-col items-center animate-bounce">
                          <Volume2 className="w-7 h-7 text-rose-500 animate-ping" />
                          <span className="text-[9px] font-mono text-rose-400 font-black mt-1">
                            BUZZER!
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Scan
                            className={`w-6 h-6 transition-colors ${
                              ledState === 'green'
                                ? 'text-emerald-400'
                                : ledState === 'amber'
                                ? 'text-amber-400'
                                : 'text-cyan-400'
                            }`}
                          />
                          <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase font-bold">
                            {ledState === 'idle' ? 'Armed' : ledState}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware LCD Screen Simulation */}
              <div className="w-full mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono">
                <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1.5 border-b border-slate-800 mb-1.5">
                  <span>STATION 7" TOUCHSCREEN</span>
                  <span className="text-emerald-400">FPS: 60.0</span>
                </div>
                <p className="text-[11px] font-bold text-white tracking-wide">
                  {deviceScreenText}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 mt-1 border-t border-slate-800/60">
                  <span>Active Role: {currentRole}</span>
                  <span className="text-cyan-400 font-bold">Offline SQLite: Ready</span>
                </div>
              </div>

              {/* Reset simulator button */}
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Station Simulator
              </button>
            </div>
          </div>
        </div>

        {/* OVERRIDE REASON MODAL FOR OLDER BATCH WARNING */}
        {showOverrideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-amber-500/50 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-white">Override Dispense Sequence</h4>
                  <p className="text-xs text-slate-400">Clinical Justification Required</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Please enter reason for picking newer batch instead of earliest FEFO batch{' '}
                <strong className="text-white font-mono">{fefoBatch?.batch}</strong>.
              </p>

              <textarea
                rows={3}
                value={dispenseOverrideReason}
                onChange={(e) => setDispenseOverrideReason(e.target.value)}
                placeholder="e.g. Physician specifically requested extended shelf-life batch for patient deployed overseas..."
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 mb-4"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDispenseOverride}
                  disabled={!dispenseOverrideReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Confirm Dispense &amp; Log Reason
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
