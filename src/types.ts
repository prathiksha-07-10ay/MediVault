/**
 * Core type definitions for MediVault Station & Inventory Management
 */

export type ItemStatus = 'Active' | 'Near expiry' | 'Expired' | 'Quarantined' | 'Returned';

export interface InventoryItem {
  id: string;
  medicine: string;
  genericName: string;
  dosage: string;
  batch: string;
  expiry: string; // ISO string YYYY-MM-DD
  quantity: number;
  unit: string;
  shelfLocation: string; // e.g. "A3-FRONT", "B2-MID", "C1-BACK"
  supplierReference: string; // e.g. "SUP-MCK-9921"
  status: ItemStatus;
  gtin: string;
  receivedDate: string;
  daysToExpiry?: number;
  internalBatchId?: string;
  costPerUnit: number;
  reorderThreshold: number;
}

export type InputMode = 'scan_bay' | 'smartphone' | 'invoice' | 'manual';

export interface ScanScenario {
  id: string;
  title: string;
  subtitle: string;
  mode: InputMode;
  imageQuality: 'pass' | 'glare' | 'blur';
  qualityNotes: string;
  barcodeData: {
    gtin?: string;
    medicine?: string;
    batch?: string;
    expiry?: string;
  };
  ocrFallbackNeeded: boolean;
  ocrExtracted?: {
    medicine?: string;
    batch?: string;
    expiry?: string;
    confidence: number;
  };
  confidenceScore: number;
  statusOutcome: 'auto_save' | 'pharmacist_review' | 'blocked' | 'rescan_required';
  blockReason?: string;
  expectedDecodeMs: number;
}

export type UserRole = 'Pharmacist' | 'Staff' | 'Manager';

export interface AuditRecord {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole;
  action: string;
  targetMedicine: string;
  batch: string;
  details: string;
  badgeType: 'scan' | 'verify' | 'correct' | 'override' | 'quarantine' | 'dispense' | 'sync';
  offlineSynced?: boolean;
}

export interface ShelfItem {
  id: string;
  medicine: string;
  batch: string;
  expiry: string;
  zone: 'green' | 'yellow' | 'orange' | 'red' | 'black';
  shelfPosition: string; // "A-01", "A-02", etc.
  quantity: number;
  status: ItemStatus;
  internalBatchId: string;
  isFront: boolean;
}

export interface AlertNotification {
  id: string;
  severity: 'info' | 'warning' | 'urgent' | 'critical';
  rule: '180 days' | '90 days' | '30 days' | 'Expired';
  title: string;
  medicine: string;
  batch: string;
  daysLeft: number;
  shelfLocation: string;
  quantity: number;
  timestamp: string;
  recommendedAction: string;
  status: 'active' | 'resolved';
}

export interface PerformanceMetrics {
  medianDecodeTimeSec: number;
  p95DecodeTimeSec: number;
  criticalFieldErrorRate: number;
  humanInterventionRate: number;
  fieldAccuracy: {
    medicine: number;
    batch: number;
    expiry: number;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}
