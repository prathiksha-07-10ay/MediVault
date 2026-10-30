/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  InventoryItem,
  UserRole,
  AuditRecord,
  AlertNotification,
  PerformanceMetrics,
  ToastMessage
} from './types';
import {
  INITIAL_INVENTORY,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS,
  SYSTEM_PERFORMANCE_METRICS
} from './data/initialData';
import { sound } from './utils/audio';
import { DarkVeilBackground } from './components/DarkVeilBackground';
import { CustomCursor } from './components/CustomCursor';
import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemImpact } from './components/ProblemImpact';
import { HowItWorksPipeline } from './components/HowItWorksPipeline';
import { LiveDemo } from './components/LiveDemo';
import { PhysicalFEFOStorage } from './components/PhysicalFEFOStorage';
import { SmartEngines } from './components/SmartEngines';
import { DispensingSimulator } from './components/DispensingSimulator';
import { AlertEngine } from './components/AlertEngine';
import { Dashboard } from './components/Dashboard';
import { AuditTrail } from './components/AuditTrail';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Offline-First state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Role Switcher state (Pharmacist, Staff, Manager)
  const [currentRole, setCurrentRole] = useState<UserRole>('Pharmacist');

  // Core application data stores
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(SYSTEM_PERFORMANCE_METRICS);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Map role to operator name
  const getOperatorName = (role: UserRole) => {
    switch (role) {
      case 'Pharmacist':
        return 'Dr. Sarah Chen, RPh';
      case 'Staff':
        return 'Alex Miller, CPhT';
      case 'Manager':
        return 'Elena Rostova, PharmD';
    }
  };

  const getNowTimestamp = () => {
    const d = new Date();
    return d.toISOString().replace('T', ' ').slice(0, 19);
  };

  // Append new record to Audit Trail
  const appendAuditLog = (
    action: string,
    targetMedicine: string,
    batch: string,
    details: string,
    badgeType: AuditRecord['badgeType']
  ) => {
    const newLog: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: getNowTimestamp(),
      userName: getOperatorName(currentRole),
      role: currentRole,
      action,
      targetMedicine,
      batch,
      details,
      badgeType,
      offlineSynced: !isOnline,
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    if (!isOnline) {
      setPendingSyncCount((c) => c + 1);
    }
  };

  // Toggle network simulation (Online / Offline mode)
  const toggleOnline = () => {
    if (isOnline) {
      // Switching to offline
      setIsOnline(false);
      sound.playWarning();
      addToast(
        'Offline Mode Activated',
        'MediVault Station is now operating on local encrypted SQLite. Changes will queue for sync.',
        'warning'
      );
    } else {
      // Switching back to online -> trigger animated sync
      setIsSyncing(true);
      sound.playSuccess();
      addToast('Reconnecting...', 'Synchronizing queued transactions to cloud backup...', 'info');

      setTimeout(() => {
        setIsOnline(true);
        setIsSyncing(false);
        const syncedCount = pendingSyncCount;
        setPendingSyncCount(0);

        appendAuditLog(
          'Cloud Synchronization Completed',
          'System Database',
          `SYNC-${Date.now().toString().slice(-4)}`,
          `Successfully synced ${syncedCount} queued offline transactions to secure cloud cluster.`,
          'sync'
        );

        addToast(
          'Synchronization Complete',
          `All ${syncedCount} offline transactions successfully uploaded. Database synchronized.`,
          'success'
        );
      }, 1400);
    }
  };

  // Handle saving new intake item from Live Demo
  const handleSaveItem = (itemData: Partial<InventoryItem>, auditNote: string) => {
    const newItem: InventoryItem = {
      id: `med-${Date.now()}`,
      medicine: itemData.medicine || 'Prescription Medication',
      genericName: itemData.genericName || itemData.medicine?.split(' ')[0] || 'Generic',
      dosage: itemData.dosage || 'Standard Dosage',
      batch: itemData.batch || 'BATCH-001',
      expiry: itemData.expiry || '2027-12-31',
      quantity: itemData.quantity || 100,
      unit: itemData.unit || 'units',
      shelfLocation: itemData.shelfLocation || 'A1-FRONT',
      supplierReference: itemData.supplierReference || 'SUP-MCK-9921',
      status: itemData.status || 'Active',
      gtin: itemData.gtin || '00300450444558',
      receivedDate: new Date().toISOString().slice(0, 10),
      daysToExpiry: Math.round(
        (new Date(itemData.expiry || '2027-12-31').getTime() - new Date('2026-10-24').getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      internalBatchId: `MV-BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      costPerUnit: 0.45,
      reorderThreshold: 100,
    };

    setInventory((prev) => [newItem, ...prev]);

    appendAuditLog(
      'Intake & Barcode Verification',
      newItem.medicine,
      newItem.batch,
      auditNote,
      'scan'
    );

    addToast(
      'Item Saved to Inventory',
      `${newItem.medicine} (Lot ${newItem.batch}) committed to ${newItem.shelfLocation}.`,
      'success'
    );
  };

  // Handle dispensing deduction
  const handleDeductInventory = (
    medicineName: string,
    batchId: string,
    quantityToDeduct: number,
    note: string
  ) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.batch === batchId) {
          const nextQty = Math.max(0, item.quantity - quantityToDeduct);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );

    appendAuditLog('Prescription Dispense Verified', medicineName, batchId, note, 'dispense');

    addToast(
      'Dispense Verified',
      `Deducted ${quantityToDeduct} units of ${medicineName} (Lot ${batchId}).`,
      'success'
    );
  };

  // Handle quarantine batch
  const handleQuarantineBatch = (batchId: string, medicineName: string, reason: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.batch === batchId) {
          return {
            ...item,
            status: 'Quarantined',
            shelfLocation: 'Q1-ISOLATION',
          };
        }
        return item;
      })
    );

    appendAuditLog(
      'Mandatory Quarantine Order',
      medicineName,
      batchId,
      reason,
      'quarantine'
    );

    addToast('Batch Quarantined', `Lot ${batchId} locked and moved to Isolation Bay Q1.`, 'error');
  };

  // Handle alert resolution
  const handleResolveAlert = (alertId: string, actionTaken: string) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    setAlerts((prev) => prev.filter((a) => a.id !== alertId));

    appendAuditLog(
      'Alert Protocol Executed',
      targetAlert.medicine,
      targetAlert.batch,
      actionTaken,
      'verify'
    );

    addToast('Alert Protocol Resolved', `${targetAlert.title} addressed successfully.`, 'info');
  };

  // Handle recommended actions from dashboard
  const handleExecuteRecommendedAction = (actionTitle: string, details: string) => {
    if (actionTitle === 'Quarantine expired stock') {
      handleQuarantineBatch(
        'ATV-901-LK',
        'Atorvastatin Calcium 20mg',
        'Quarantined expired stock per recommended dashboard action.'
      );
    } else if (actionTitle === 'Use earliest-expiry batch first') {
      appendAuditLog(
        'FEFO Priority Enforced',
        'All Active Inventory',
        'MULTI-BATCH',
        details,
        'override'
      );
      addToast('FEFO Priority Updated', 'Dispensing pick lists prioritized by earliest expiry.', 'success');
    } else if (actionTitle === 'Return to supplier (if eligible)') {
      setInventory((prev) =>
        prev.map((item) =>
          item.daysToExpiry !== undefined && item.daysToExpiry > 0 && item.daysToExpiry <= 30
            ? { ...item, status: 'Returned', shelfLocation: 'RET-STAGING' }
            : item
        )
      );
      appendAuditLog(
        'Supplier Return Manifest Created',
        'Short-Dated Inventory',
        'RETURN-881',
        details,
        'verify'
      );
      addToast('Return Initiated', '2 short-dated lots moved to Return Staging for credit.', 'success');
    } else {
      appendAuditLog(
        'Dashboard Action Executed',
        'Inventory Controller',
        'ACTION-SYS',
        details,
        'verify'
      );
      addToast(actionTitle, details, 'success');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans selection:bg-emerald-500 selection:text-slate-950 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Background Animated DarkVeil and Mesh Gradients */}
      <DarkVeilBackground darkMode={darkMode} />

      {/* Sleek Custom Cursor */}
      <CustomCursor />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} darkMode={darkMode} />

      {/* Navigation Bar with Offline-First status chip and role switcher */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOnline={isOnline}
        toggleOnline={toggleOnline}
        pendingSyncCount={pendingSyncCount}
        isSyncing={isSyncing}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Container */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          darkMode={darkMode}
          onExploreDemo={() => scrollToSection('live-demo')}
          onExploreDispensing={() => scrollToSection('dispensing')}
          onExploreStorage={() => scrollToSection('storage')}
        />

        {/* Problem & Impact Statistics */}
        <ProblemImpact darkMode={darkMode} />

        {/* 1. 12-Step Animated Pipeline (with YES/NO glowing branch & captions) */}
        <HowItWorksPipeline darkMode={darkMode} />

        {/* 2. Live Demo: 4 input modes, image quality, decode timer, decision diamond, OCR fallback, verification */}
        <LiveDemo
          darkMode={darkMode}
          currentRole={currentRole}
          isOnline={isOnline}
          onSaveItem={handleSaveItem}
        />

        {/* 5. Physical FEFO Storage (colour zones, time travel slider, micro-QR card) */}
        <PhysicalFEFOStorage
          darkMode={darkMode}
          onPrintLabel={(info) => {
            appendAuditLog('Micro-QR Repackaging Label Printed', 'Unit Dose Medication', 'LABEL-PRN', info, 'scan');
            addToast('Micro-QR Printed', info, 'info');
          }}
        />

        {/* 6. Smart Engines (Expiry Monitor, FEFO Engine with typed override reason, Stock Monitor) */}
        <SmartEngines
          inventory={inventory}
          currentRole={currentRole}
          onAuditAction={appendAuditLog}
          darkMode={darkMode}
        />

        {/* 7. Dispensing: Scan Before Handout (Interactive simulator with virtual LED ring & buzzer) */}
        <DispensingSimulator
          inventory={inventory}
          currentRole={currentRole}
          onDeductInventory={handleDeductInventory}
          onQuarantineBatch={handleQuarantineBatch}
          onAuditAction={appendAuditLog}
          darkMode={darkMode}
        />

        {/* 8. Alert Engine (Multi-channel LED, buzzer, touchscreen, SMS/WhatsApp toggle, 4 threshold rules) */}
        <AlertEngine
          alerts={alerts}
          currentRole={currentRole}
          onResolveAlert={handleResolveAlert}
          darkMode={darkMode}
        />

        {/* 4 & 9. Dashboard (Exact database model table, 4 tabs, 3 additional cards, 5 recommended actions, system performance metrics) */}
        <Dashboard
          inventory={inventory}
          currentRole={currentRole}
          metrics={metrics}
          onExecuteRecommendedAction={handleExecuteRecommendedAction}
          darkMode={darkMode}
        />

        {/* 10. Audit Trail (Searchable, filterable timeline table, role switcher, CSV export) */}
        <AuditTrail
          auditLogs={auditLogs}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          darkMode={darkMode}
        />

        {/* FAQ Section */}
        <FAQSection darkMode={darkMode} />
      </main>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
