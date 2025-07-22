/**
 * Purchase & Expense API Service for JusFinn ERP
 * Integrates frontend with backend Purchase and Expense modules
 */

import api from './api';

// Backend API Request Types (matching backend schema)
export interface VendorAddress {
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state_id: number;
  pincode: string;
  country: string;
}

export interface VendorCreateRequest {
  vendor_code: string;
  business_name: string;
  legal_name?: string | null;
  gstin?: string | null;
  pan?: string | null;
  
  // --- Critical Compliance Fields ---
  is_msme: boolean;
  udyam_registration_number?: string | null;
  
  // Contact Information
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  
  // --- Payment & Terms ---
  credit_limit: number;
  credit_days: number;
  payment_terms: string; // IMMEDIATE, NET_15, NET_30, NET_45, NET_60, NET_90
  
  // --- Critical Banking Fields ---
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
  bank_account_holder_name?: string | null;
  
  // Address
  address: VendorAddress;
  
  // --- Critical Tax & Accounting Fields ---
  tds_applicable: boolean;
  default_tds_section?: string | null;
  default_expense_ledger_id?: string | null;
}

export interface VendorUpdateRequest {
  business_name?: string | null;
  legal_name?: string | null;
  gstin?: string | null;
  pan?: string | null;
  
  // --- Critical Compliance Fields ---
  is_msme?: boolean | null;
  udyam_registration_number?: string | null;
  
  // Contact Information
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  
  // --- Payment & Terms ---
  credit_limit?: number | null;
  credit_days?: number | null;
  payment_terms?: string | null;
  
  // --- Critical Banking Fields ---
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
  bank_account_holder_name?: string | null;
  
  // Address
  address?: VendorAddress | null;
  
  // --- Critical Tax & Accounting Fields ---
  tds_applicable?: boolean | null;
  default_tds_section?: string | null;
  default_expense_ledger_id?: string | null;
  is_active?: boolean | null;
}

// Purchase Order interfaces matching backend schema
export interface POLineItem {
  item_description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  total_amount: number;
}

export interface PurchaseOrderCreateRequest {
  po_number: string;
  vendor_id: string;
  po_date: string;
  expected_delivery_date?: string;
  line_items: POLineItem[];
  delivery_address?: string;
  terms_and_conditions?: string;
  notes?: string;
}

export interface PurchaseOrderUpdateRequest {
  po_number?: string;
  vendor_id?: string;
  po_date?: string;
  expected_delivery_date?: string;
  line_items?: POLineItem[];
  delivery_address?: string;
  terms_and_conditions?: string;
  notes?: string;
  status?: PurchaseOrderStatus | string; // Use single status
}

// Backend Response Types
export interface Vendor {
  id: string;
  vendor_code: string;
  business_name: string;
  legal_name?: string;
  gstin?: string;
  pan?: string;
  
  // --- Critical Compliance Fields ---
  is_msme: boolean;
  udyam_registration_number?: string;
  
  // Contact Information
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // --- Payment & Terms ---
  credit_limit: number;
  credit_days: number;
  payment_terms: string;
  
  // --- Critical Banking Fields ---
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_account_holder_name?: string;
  
  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_id?: number;
  pincode?: string;
  country?: string;
  
  // --- Critical Tax & Accounting Fields ---
  tds_applicable: boolean;
  default_tds_section?: string;
  default_expense_ledger_id?: string;
  
  // Business Metrics
  vendor_rating?: number;
  total_purchases: number;
  outstanding_amount: number;
  last_transaction_date?: string;
  
  // Status and Audit
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Single Status System for Purchase Orders (matching backend)
export enum PurchaseOrderStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  PARTIALLY_DELIVERED = "partially_delivered",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REJECTED = "rejected"
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  po_date: string;
  expected_delivery_date?: string;
  delivery_address?: string;
  terms_and_conditions?: string;
  notes?: string;
  subtotal: number;
  total_amount: number;
  // Single simplified status covering entire lifecycle
  status: PurchaseOrderStatus | string;
  // Backward compatibility fields (deprecated)
  operational_status?: string;
  approval_status?: string;
  line_items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id?: string;
  item_description: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
}

export interface GoodsReceiptNote {
  id: string;
  grn_number: string;
  po_id: string;
  vendor_id: string;
  grn_date: string;
  invoice_number?: string;
  invoice_date?: string;
  vehicle_number?: string;
  notes?: string;
  status: string;
  items: GRNItem[];
  created_at: string;
  updated_at: string;
}

export interface GRNItem {
  id?: string;
  po_item_id: string;
  item_description: string;
  ordered_quantity: number;
  received_quantity: number;
  rejected_quantity: number;
  accepted_quantity: number;
  unit: string;
  rate: number;
  amount: number;
  notes?: string;
}

export interface PurchaseBill {
  id: string;
  bill_number: string;
  vendor_id: string;
  po_id?: string;
  grn_id?: string;
  bill_date: string;
  due_date: string;
  vendor_invoice_number: string;
  vendor_invoice_date: string;
  subtotal: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  cess_amount: number;
  tds_amount: number;
  total_amount: number;
  payment_status: string;
  approval_status: string;
  items: PurchaseBillItem[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseBillItem {
  id?: string;
  item_description: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
}

export interface Expense {
  id: string;
  expense_number: string;
  category_id: number;
  expense_date: string;
  description: string;
  amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  tds_amount: number;
  total_amount: number;
  receipt_number?: string;
  receipt_date?: string;
  payment_mode: string;
  approval_status: string;
  reimbursement_status: string;
  employee_id?: string;
  vendor_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Additional interfaces for proper typing
export interface WorkflowStatus {
  current_stage: string;
  completion_percentage: number;
  pending_actions: string[];
  approval_history: ApprovalHistoryItem[];
}

export interface ApprovalHistoryItem {
  approver: string;
  action: string;
  timestamp: string;
  comments?: string;
}

export interface ThreeWayMatchingResult {
  is_matched: boolean;
  variances: VarianceItem[];
  tolerance_percentage: number;
  recommendations: string[];
}

export interface VarianceItem {
  item_description: string;
  variance_type: 'quantity' | 'price' | 'amount';
  po_value: number;
  grn_value: number;
  bill_value: number;
  variance_amount: number;
  variance_percentage: number;
}

export interface AnalyticsSummary {
  total_amount: number;
  transaction_count: number;
  average_amount: number;
  growth_percentage: number;
}

export interface VendorPerformance {
  vendor_id: string;
  vendor_name: string;
  total_orders: number;
  total_amount: number;
  on_time_delivery_rate: number;
  quality_rating: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transaction_count: number;
}

export interface TrendAnalysis {
  monthly_data: MonthlyData[];
  growth_rate: number;
  seasonal_patterns: string[];
}

export interface MonthlyData {
  month: string;
  amount: number;
  transaction_count: number;
}

export interface WorkflowTask {
  id: string;
  task_type: string;
  priority: 'high' | 'medium' | 'low';
  assigned_to: string;
  due_date: string;
  description: string;
  related_document_id: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface WorkflowAlert {
  id: string;
  alert_type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  action_required: boolean;
}

export interface ExpenseExtractionData {
  vendor_name?: string;
  amount?: number;
  tax_amount?: number;
  date?: string;
  description?: string;
  confidence: number;
}

export interface ExpenseCategorizationResult {
  suggested_category: string;
  confidence: number;
  tax_treatment: string;
  policy_compliance: PolicyComplianceResult;
}

export interface PolicyComplianceResult {
  compliant: boolean;
  violations: string[];
  recommendations: string[];
}

// API Service Class
export class PurchaseExpenseApiService {
  
  // =====================================================
  // VENDOR MANAGEMENT
  // =====================================================
  
  static async createVendor(vendorData: VendorCreateRequest): Promise<Vendor> {
    const response = await api.post('/vendors/', vendorData);
    return response.data;
  }

  static async getVendors(skip: number = 0, limit: number = 100): Promise<Vendor[]> {
    const response = await api.get(`/vendors?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getVendor(vendorId: string): Promise<Vendor> {
    const response = await api.get(`/vendors/${vendorId}`);
    return response.data;
  }

  static async updateVendor(vendorId: string, vendorData: VendorCreateRequest): Promise<Vendor> {
    const response = await api.put(`/vendors/${vendorId}`, vendorData);
    return response.data;
  }

  static async deleteVendor(vendorId: string): Promise<{ message: string }> {
    const response = await api.delete(`/vendors/${vendorId}`);
    return response.data;
  }

  static async searchVendors(query: string): Promise<Vendor[]> {
    const response = await api.get(`/vendors/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // =====================================================
  // PURCHASE ORDERS
  // =====================================================
  
  static async createPurchaseOrder(poData: PurchaseOrderCreateRequest): Promise<PurchaseOrder> {
    const response = await api.post('/purchase-expense/purchase-orders', poData);
    return response.data;
  }

  static async getPurchaseOrders(
    filters?: {
      status?: PurchaseOrderStatus | string;
      vendor_id?: string;
      skip?: number;
      limit?: number;
      search?: string;
    }
  ): Promise<PurchaseOrder[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vendor_id) params.append('vendor_id', filters.vendor_id);
    params.append('skip', (filters?.skip || 0).toString());
    params.append('limit', (filters?.limit || 100).toString());
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/purchase-expense/purchase-orders?${params}`);
    return response.data;
  }

  static async getPurchaseOrder(poId: string): Promise<PurchaseOrder> {
    const response = await api.get(`/purchase-expense/purchase-orders/${poId}`);
    return response.data;
  }

  static async updatePurchaseOrder(poId: string, poData: PurchaseOrderUpdateRequest): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-expense/purchase-orders/${poId}`, poData);
    return response.data;
  }

  static async deletePurchaseOrder(poId: string): Promise<{ message: string }> {
    const response = await api.delete(`/purchase-expense/purchase-orders/${poId}`);
    return response.data;
  }

  static async approvePurchaseOrder(
    poId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<{ message: string; result: any }> {
    const params = new URLSearchParams({ action });
    if (comments) params.append('comments', comments);
    
    const response = await api.post(`/purchase-expense/purchase-orders/${poId}/approve?${params}`);
    return response.data;
  }

  static async updatePurchaseOrderStatus(
    poId: string,
    status: PurchaseOrderStatus | string
  ): Promise<{ message: string }> {
    const response = await api.patch(`/purchase-expense/purchase-orders/${poId}/status`, { status });
    return response.data;
  }

  static async getPurchaseWorkflowStatus(poId: string): Promise<{
    po_id: string;
    workflow_status: any;
    current_stage: string;
    completion_percentage: number;
    pending_actions: string[];
  }> {
    const response = await api.get(`/purchase-expense/purchase-orders/${poId}/workflow-status`);
    return response.data;
  }

  // =====================================================
  // GOODS RECEIPT NOTES (GRN)
  // =====================================================
  
  static async createGRN(grnData: Partial<GoodsReceiptNote>): Promise<GoodsReceiptNote> {
    const response = await api.post('/purchase-expense/grn', grnData);
    return response.data;
  }

  static async getGRNs(
    po_id?: string,
    vendor_id?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<GoodsReceiptNote[]> {
    const params = new URLSearchParams();
    if (po_id) params.append('po_id', po_id);
    if (vendor_id) params.append('vendor_id', vendor_id);
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/purchase-expense/grn?${params}`);
    return response.data;
  }

  static async getGRN(grnId: string): Promise<GoodsReceiptNote> {
    const response = await api.get(`/purchase-expense/grn/${grnId}`);
    return response.data;
  }

  // =====================================================
  // PURCHASE BILLS
  // =====================================================
  
  static async createPurchaseBill(billData: Partial<PurchaseBill>): Promise<PurchaseBill> {
    const response = await api.post('/purchase-expense/purchase-bills', billData);
    return response.data;
  }

  static async getPurchaseBills(
    vendor_id?: string,
    status?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<PurchaseBill[]> {
    const params = new URLSearchParams();
    if (vendor_id) params.append('vendor_id', vendor_id);
    if (status) params.append('status', status);
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/purchase-expense/purchase-bills?${params}`);
    return response.data;
  }

  static async getPurchaseBill(billId: string): Promise<PurchaseBill> {
    const response = await api.get(`/purchase-expense/purchase-bills/${billId}`);
    return response.data;
  }

  static async createPaymentFromBill(
    billId: string,
    paymentMethod: string,
    bankAccountId?: string,
    scheduledDate?: string
  ): Promise<{
    message: string;
    payment_id: string;
    payment_number: string;
    net_amount: number;
    approval_status: string;
  }> {
    const params = new URLSearchParams({ payment_method: paymentMethod });
    if (bankAccountId) params.append('bank_account_id', bankAccountId);
    if (scheduledDate) params.append('scheduled_date', scheduledDate);
    
    const response = await api.post(`/purchase-expense/purchase-bills/${billId}/create-payment?${params}`);
    return response.data;
  }

  static async performThreeWayMatching(
    poId: string,
    grnId: string,
    billId: string,
    tolerancePercentage: number = 5.0
  ): Promise<{
    message: string;
    result: any;
    status: string;
  }> {
    const params = new URLSearchParams({
      grn_id: grnId,
      bill_id: billId,
      tolerance_percentage: tolerancePercentage.toString(),
    });
    
    const response = await api.post(`/purchase-expense/purchase-orders/${poId}/three-way-matching?${params}`);
    return response.data;
  }

  // =====================================================
  // EXPENSE MANAGEMENT
  // =====================================================
  
  static async createExpense(expenseData: Partial<Expense>): Promise<Expense> {
    const response = await api.post('/purchase-expense/expenses', expenseData);
    return response.data;
  }

  static async getExpenses(
    category_id?: number,
    status?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (category_id) params.append('category_id', category_id.toString());
    if (status) params.append('status', status);
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/purchase-expense/expenses?${params}`);
    return response.data;
  }

  static async getExpense(expenseId: string): Promise<Expense> {
    const response = await api.get(`/purchase-expense/expenses/${expenseId}`);
    return response.data;
  }

  static async updateExpense(expenseId: string, expenseData: Partial<Expense>): Promise<Expense> {
    const response = await api.put(`/purchase-expense/expenses/${expenseId}`, expenseData);
    return response.data;
  }

  static async deleteExpense(expenseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/purchase-expense/expenses/${expenseId}`);
    return response.data;
  }

  static async approveExpense(
    expenseId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<{ message: string; result: any }> {
    const params = new URLSearchParams({ action });
    if (comments) params.append('comments', comments);
    
    const response = await api.post(`/purchase-expense/expenses/${expenseId}/approve?${params}`);
    return response.data;
  }

  static async uploadExpenseReceipt(file: File, expenseCategory: string): Promise<{
    message: string;
    extracted_data: any;
    confidence_score: number;
    requires_review: boolean;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/purchase-expense/expenses/upload-receipt?expense_category=${encodeURIComponent(expenseCategory)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  static async autoCategorizeExpense(expenseData: any): Promise<{
    suggested_category: string;
    confidence: number;
    tax_treatment: string;
    policy_compliance: any;
  }> {
    const response = await api.post('/purchase-expense/expenses/auto-categorize', expenseData);
    return response.data;
  }

  static async checkExpensePolicy(expenseId: string): Promise<{
    expense_id: string;
    policy_compliance: boolean;
    violations: string[];
    approval_required: boolean;
    auto_approve_eligible: boolean;
  }> {
    const response = await api.post(`/purchase-expense/expenses/${expenseId}/policy-check`);
    return response.data;
  }

  // =====================================================
  // PAYMENTS & APPROVALS
  // =====================================================
  // =====================================================
  // PURCHASE ORDER APPROVAL WORKFLOW
  // =====================================================
  
  static async submitPurchaseOrderForApproval(poId: string): Promise<{
    message: string;
    po_id: string;
    new_approval_status: string;
    workflow_started: boolean;
  }> {
    const response = await api.post(`/purchase-expense/purchase-orders/${poId}/submit-for-approval`);
    return response.data;
  }

  static async processPurchaseOrderApproval(
    poId: string,
    action: 'approve' | 'reject' | 'request_changes',
    comments?: string
  ): Promise<{
    message: string;
    po_id: string;
    action: string;
    new_approval_status: string;
    new_operational_status: string;
    comments?: string;
    processed_by: string;
    processed_at: string;
  }> {
    const params = new URLSearchParams({ action });
    if (comments) params.append('comments', comments);
    
    const response = await api.post(`/purchase-expense/purchase-orders/${poId}/approve?${params}`);
    return response.data;
  }

  static async updatePurchaseOrderOperationalStatus(
    poId: string,
    status: string
  ): Promise<{
    message: string;
    po_id: string;
    new_status: string;
  }> {
    const response = await api.patch(`/purchase-expense/purchase-orders/${poId}/operational-status`, { status });
    return response.data;
  }

  static async getPurchaseOrderApprovalHistory(poId: string): Promise<{
    po_id: string;
    approval_history: any[];
    total_actions: number;
  }> {
    const response = await api.get(`/purchase-expense/purchase-orders/${poId}/approval-history`);
    return response.data;
  }

  static async getPendingPurchaseOrderApprovals(): Promise<{
    pending_approvals: any[];
    count: number;
    message: string;
  }> {
    const response = await api.get(`/purchase-expense/purchase-orders/pending-approvals`);
    return response.data;
  }

  static async getPurchaseOrderStatusGuide(): Promise<{
    status_system_explanation: {
      operational_status: any;
      approval_status: any;
    };
  }> {
    const response = await api.get(`/purchase-expense/purchase-orders/status-guide`);
    return response.data;
  }

  // =====================================================
  
  static async getPendingApprovals(userRole: string): Promise<{ pending_approvals: any[] }> {
    const response = await api.get(`/purchase-expense/payments/pending-approvals?user_role=${userRole}`);
    return response.data;
  }

  // =====================================================
  // ANALYTICS & REPORTING
  // =====================================================
  
  static async getPurchaseAnalytics(period: string = 'month', vendorId?: string): Promise<{
    period: string;
    summary: any;
    vendor_performance: any[];
    category_breakdown: any[];
    trend_analysis: any;
  }> {
    const params = new URLSearchParams({ period });
    if (vendorId) params.append('vendor_id', vendorId);
    
    const response = await api.get(`/purchase-expense/analytics/purchase-performance?${params}`);
    return response.data;
  }

  static async getExpenseInsights(period: string = 'month', department?: string): Promise<{
    period: string;
    summary: any;
    category_analysis: any[];
    approval_patterns: any;
    cost_optimization: any[];
  }> {
    const params = new URLSearchParams({ period });
    if (department) params.append('department', department);
    
    const response = await api.get(`/purchase-expense/analytics/expense-insights?${params}`);
    return response.data;
  }

  // =====================================================
  // COMPLIANCE & RECONCILIATION
  // =====================================================
  
  static async getGSTReconciliation(month: number, year: number): Promise<{
    period: string;
    gst_summary: any;
    discrepancies: any[];
    vendor_wise_summary: any[];
  }> {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });
    
    const response = await api.get(`/purchase-expense/compliance/gst-reconciliation?${params}`);
    return response.data;
  }

  static async getTDSSummary(quarter: number, year: number): Promise<{
    period: string;
    tds_summary: any;
    section_wise_breakdown: any[];
    vendor_wise_tds: any[];
    challan_details: any[];
  }> {
    const params = new URLSearchParams({
      quarter: quarter.toString(),
      year: year.toString(),
    });
    
    const response = await api.get(`/purchase-expense/compliance/tds-summary?${params}`);
    return response.data;
  }

  // =====================================================
  // WORKFLOW MANAGEMENT
  // =====================================================
  
  static async getWorkflowTasks(): Promise<any[]> {
    const response = await api.get('/purchase-expense/workflows/tasks');
    return response.data;
  }

  static async getWorkflowAlerts(): Promise<{ alerts: any[] }> {
    const response = await api.get('/purchase-expense/workflows/alerts');
    return response.data;
  }

  // =====================================================
  // BANK RECONCILIATION
  // =====================================================
  
  static async matchBankTransactions(
    bankAccountId: string,
    fromDate: string,
    toDate: string
  ): Promise<{
    message: string;
    reconciliation_id: string;
    matched_transactions: number;
    unmatched_transactions: number;
  }> {
    const params = new URLSearchParams({
      bank_account_id: bankAccountId,
      from_date: fromDate,
      to_date: toDate,
    });
    
    const response = await api.post(`/purchase-expense/reconciliation/match-transactions?${params}`);
    return response.data;
  }
}

export default PurchaseExpenseApiService; 