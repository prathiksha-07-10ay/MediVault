import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  darkMode: boolean;
}

export const FAQSection: React.FC<Props> = ({ darkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does MediVault Station function when the pharmacy internet connection drops?',
      a: 'MediVault Station runs an encrypted local SQLite/IndexedDB engine directly on device firmware. All barcode decodes, pharmacist reviews, inventory deductions, and audit logs are committed locally in real-time. Once the network is restored, an asynchronous reconciliation daemon pushes accumulated changes to the cloud backup without blocking physical dispensing.',
    },
    {
      q: 'What is the purpose of Targeted OCR instead of full-image OCR?',
      a: 'Full-image OCR across complex pharmaceutical cartons is slow (1.5–3.0 seconds) and prone to hallucinations from logos, warnings, and background marketing text. MediVault’s dual-layer engine decodes the 2D GS1 DataMatrix first in <0.4s. Only if an attribute (like expiration date) is missing from the barcode does Targeted OCR crop the exact regulatory label bounding box, resulting in 99%+ accuracy and zero critical false positives.',
    },
    {
      q: 'How does the Physical FEFO rule "Load from BACK, pick from FRONT" work?',
      a: 'When new inventory arrives with later expiration dates, the station instructs staff to place cartons at the BACK of the shelf bay. When dispensing, technicians are guided to pull exclusively from the FRONT. The system’s color-coded shelf zones (Green >180d, Yellow 180-90d, Orange 90-30d, Red ≤30d) provide visual confirmation, and scanning a newer batch triggers an alert before handoff.',
    },
    {
      q: 'Does MediVault comply with FDA 21 CFR Part 11 and DSCSA requirements?',
      a: 'Yes. MediVault captures immutable chronological audit logs with operator identity, role permissions, timestamping, action types, and mandatory typed clinical justifications for any FEFO override or quarantine disposition. Data export manifests are fully compatible with GS1 EPCIS standards.',
    },
    {
      q: 'Can the station handle split packs, broken blisters, or compounded vials?',
      a: 'Yes. When bulk bottles or multipacks are divided, the station instantly generates a serialized Micro-QR label containing the master Medicine ID, Batch lot, Expiry date, and an Internal Batch UID for thermal printing onto the primary unit.',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative z-10 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Pharmacy Technology FAQ
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about MediVault Station hardware, offline architecture, and regulatory workflows.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => {
                    setOpenIndex(isOpen ? null : index);
                    sound.playScanClick();
                  }}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
