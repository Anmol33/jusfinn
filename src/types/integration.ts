// Integration Types for Cross-Module Data Flow
// Provides unified interfaces for Purchase & Expense workflow integration

export interface WorkflowReference {
  id: string;
  type: 'vendor' | 'purchase_order' | 'grn' | 'bill' | 'payment' | 'expense' | 'tds' | 'itc' | 'landed_cost';
  number: string;
  status: string;
  date: string;
  amount: number;
  parentReferences?: WorkflowReference[];
  childReferences?: WorkflowReference[];
}

export interface VendorIntegration {
  id: string;
  vendorCode: string;
  companyName: string;
  gstin?: string;
  panNumber: string;
  paymentTerms: number;
  tdsSection: string;
  msmeStatus: 'registered' | 'not_registered' | 'pending';
  udyamRegistration?: string;
  category: 'regular' | 'preferred' | 'strategic' | 'blacklisted';
  isActive: boolean;
  // Integration counters
  totalPurchaseOrders: number;
  totalGRNs: number;
  totalBills: number;
  totalPayments: number;
  outstandingAmount: number;
  lastTransactionDate?: string;
}

export interface PurchaseOrderIntegration {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  poDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'completed' | 'cancelled';
  totalAmount: number;
  // Integration status
  grnGenerated: boolean;
  grnIds: string[];
  billGenerated: boolean;
  billIds: string[];
  paymentMade: boolean;
  paymentIds: string[];
  itcClaimed: boolean;
  itcIds: string[];
}

export interface GRNIntegration {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  grnDate: string;
  status: 'draft' | 'received' | 'quality_pending' | 'quality_approved' | 'completed';
  totalValue: number;
  // Integration status
  billMatched: boolean;
  billIds: string[];
  threeWayMatchStatus: 'pending' | 'matched' | 'discrepancy';
  landedCostAllocated: boolean;
  landedCostIds: string[];
}

export interface BillIntegration {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  poId?: string;
  poNumber?: string;
  grnId?: string;
  grnNumber?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'partially_paid';
  totalAmount: number;
  outstandingAmount: number;
  // Integration status
  paymentMade: boolean;
  paymentIds: string[];
  tdsDeducted: boolean;
  tdsIds: string[];
  itcClaimed: boolean;
  itcIds: string[];
  isAging: boolean;
  agingBucket: '0-30' | '31-45' | '46-60' | '61-90' | '90+';
}

export interface PaymentIntegration {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendorName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  // Integration references
  billIds: string[];
  tdsDeducted: number;
  tdsIds: string[];
  balanceAmount: number;
}

export interface ITCIntegration {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGstin: string;
  billId?: string;
  billNumber?: string;
  invoiceDate: string;
  totalGst: number;
  itcEligibleAmount: number;
  itcClaimedAmount: number;
  status: 'eligible' | 'claimed' | 'reversed' | 'blocked';
}

export interface TDSIntegration {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorPan: string;
  billId?: string;
  billNumber?: string;
  paymentId?: string;
  paymentNumber?: string;
  deductionDate: string;
  grossAmount: number;
  tdsAmount: number;
  tdsSection: string;
  status: 'deducted' | 'deposited' | 'filed';
}

export interface LandedCostIntegration {
  id: string;
  lcNumber: string;
  poId?: string;
  poNumber?: string;
  grnId?: string;
  grnNumber?: string;
  vendorName: string;
  shipmentValue: number;
  totalLandedCost: number;
  landedCostPercentage: number;
  status: 'draft' | 'calculated' | 'allocated' | 'completed';
}

export interface CrossModuleAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  module: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  relatedRecords: WorkflowReference[];
  createdDate: string;
  resolvedDate?: string;
  resolvedBy?: string;
}

export interface DashboardMetrics {
  totalVendors: number;
  activeVendors: number;
  totalPOs: number;
  pendingPOs: number;
  totalGRNs: number;
  pendingGRNs: number;
  totalBills: number;
  pendingBills: number;
  totalPayments: number;
  outstandingPayables: number;
  totalTDS: number;
  totalITC: number;
  msmeCompliance: {
    compliant: number;
    atRisk: number;
    violated: number;
  };
  monthlyTrends: {
    month: string;
    pos: number;
    grns: number;
    bills: number;
    payments: number;
  }[];
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  triggerModule: string;
  triggerCondition: string;
  actions: AutomationAction[];
  isActive: boolean;
  createdDate: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface AutomationAction {
  id: string;
  type: 'notification' | 'status_update' | 'record_creation' | 'approval_request';
  targetModule: string;
  configuration: Record<string, unknown>;
  order: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'system' | 'whatsapp';
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface IntegrationEvent {
  id: string;
  eventType: 'create' | 'update' | 'delete' | 'status_change';
  sourceModule: string;
  sourceRecordId: string;
  sourceRecordType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  processedBy: string[];
  processingErrors: string[];
}

// API Response types for integration
export interface IntegrationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  relatedRecords?: WorkflowReference[];
}

// Search and filter types for cross-module queries
export interface CrossModuleSearch {
  vendorId?: string;
  poNumber?: string;
  grnNumber?: string;
  billNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  amountFrom?: number;
  amountTo?: number;
  modules: string[];
}

export interface AggregatedData {
  vendorId: string;
  vendorName: string;
  purchaseOrders: PurchaseOrderIntegration[];
  grns: GRNIntegration[];
  bills: BillIntegration[];
  payments: PaymentIntegration[];
  itcRecords: ITCIntegration[];
  tdsRecords: TDSIntegration[];
  landedCosts: LandedCostIntegration[];
  totalSpend: number;
  totalOutstanding: number;
  totalTDS: number;
  totalITC: number;
} 