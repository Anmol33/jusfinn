/**
 * Bank API Service for JusFinn ERP
 * Handles all Bank-related API calls including accounts, payments, transactions, and reconciliation
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types
export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  currency: string;
  current_balance: number;
  overdraft_limit: number;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  payment_number: string;
  payment_type: string;
  payment_date: string;
  payment_method: string;
  gross_amount: number;
  tds_amount: number;
  net_amount: number;
  payment_status: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  transaction_date: string;
  description: string;
  reference_number: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  transaction_type: string;
  reconciliation_status: string;
  created_at: string;
}

export interface DashboardSummary {
  total_bank_balance: number;
  pending_approvals: {
    count: number;
    amount: number;
  };
  current_month_payments: {
    count: number;
    amount: number;
  };
  unreconciled_transactions: number;
}

export interface CreateBankAccountRequest {
  account_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  currency?: string;
  opening_balance?: number;
  overdraft_limit?: number;
  is_primary?: boolean;
}

export interface CreatePaymentRequest {
  payment_type: string;
  reference_id: string;
  reference_type: string;
  vendor_id?: string;
  employee_id?: string;
  payment_date: string;
  payment_method: string;
  bank_account_id?: string;
  gross_amount: number;
  tds_amount?: number;
  other_deductions?: number;
  cheque_number?: string;
  cheque_date?: string;
  utr_number?: string;
  transaction_reference?: string;
  notes?: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export class BankApiService {
  // =====================================================
  // DASHBOARD METHODS
  // =====================================================
  
  static async getDashboardSummary(): Promise<DashboardSummary> {
    return makeAuthenticatedRequest('/api/bank/dashboard/summary');
  }

  // =====================================================
  // BANK ACCOUNT METHODS
  // =====================================================
  
  static async createBankAccount(accountData: CreateBankAccountRequest): Promise<BankAccount> {
    return makeAuthenticatedRequest('/api/bank/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  static async getBankAccounts(activeOnly: boolean = true): Promise<BankAccount[]> {
    const params = new URLSearchParams({ active_only: activeOnly.toString() });
    return makeAuthenticatedRequest(`/api/bank/accounts?${params}`);
  }

  static async getBankAccount(accountId: string): Promise<BankAccount> {
    return makeAuthenticatedRequest(`/api/bank/accounts/${accountId}`);
  }

  static async updateAccountStatus(accountId: string, isActive: boolean): Promise<{ message: string }> {
    return makeAuthenticatedRequest(`/api/bank/accounts/${accountId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // =====================================================
  // PAYMENT METHODS
  // =====================================================
  
  static async createPayment(paymentData: CreatePaymentRequest, createdBy: string): Promise<Payment> {
    const params = new URLSearchParams({ created_by: createdBy });
    return makeAuthenticatedRequest(`/api/bank/payments?${params}`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  static async getPayments(status?: string, paymentType?: string): Promise<Payment[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (paymentType) params.append('payment_type', paymentType);
    
    return makeAuthenticatedRequest(`/api/bank/payments?${params}`);
  }

  static async getPayment(paymentId: string): Promise<Payment> {
    return makeAuthenticatedRequest(`/api/bank/payments/${paymentId}`);
  }

  static async approvePayment(
    paymentId: string, 
    action: 'approve' | 'reject', 
    approverEmail: string,
    comments?: string
  ): Promise<{ message: string }> {
    const params = new URLSearchParams({ approver_email: approverEmail });
    return makeAuthenticatedRequest(`/api/bank/payments/${paymentId}/approve?${params}`, {
      method: 'POST',
      body: JSON.stringify({ action, comments }),
    });
  }

  static async processPayment(paymentId: string): Promise<{ message: string }> {
    return makeAuthenticatedRequest(`/api/bank/payments/${paymentId}/process`, {
      method: 'POST',
    });
  }

  static async getPaymentApprovals(paymentId: string): Promise<any[]> {
    return makeAuthenticatedRequest(`/api/bank/payments/${paymentId}/approvals`);
  }

  static async getPendingApprovals(userRole: string): Promise<{ pending_approvals: any[] }> {
    const params = new URLSearchParams({ user_role: userRole });
    return makeAuthenticatedRequest(`/api/purchase-expense/payments/pending-approvals?${params}`);
  }

  // =====================================================
  // TRANSACTION METHODS
  // =====================================================
  
  static async importTransactions(bankAccountId: string, transactions: any[]): Promise<{ message: string; imported_count: number }> {
    return makeAuthenticatedRequest('/api/bank/transactions/import', {
      method: 'POST',
      body: JSON.stringify({ 
        bank_account_id: bankAccountId, 
        transactions 
      }),
    });
  }

  static async getTransactions(
    bankAccountId: string,
    fromDate?: string,
    toDate?: string,
    reconciliationStatus?: string
  ): Promise<BankTransaction[]> {
    const params = new URLSearchParams({ bank_account_id: bankAccountId });
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (reconciliationStatus) params.append('reconciliation_status', reconciliationStatus);
    
    return makeAuthenticatedRequest(`/api/bank/transactions?${params}`);
  }

  // =====================================================
  // RECONCILIATION METHODS
  // =====================================================
  
  static async startReconciliation(
    bankAccountId: string,
    reconciliationDate: string,
    statementBalance: number,
    reconciledBy: string
  ): Promise<{
    message: string;
    reconciliation_id: string;
    reconciled_transactions: number;
    unreconciled_transactions: number;
    difference_amount: number;
  }> {
    const params = new URLSearchParams({
      bank_account_id: bankAccountId,
      reconciliation_date: reconciliationDate,
      statement_balance: statementBalance.toString(),
      reconciled_by: reconciledBy,
    });
    
    return makeAuthenticatedRequest(`/api/bank/reconciliation/start?${params}`, {
      method: 'POST',
    });
  }

  static async getReconciliationHistory(accountId: string, limit: number = 10): Promise<any[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    return makeAuthenticatedRequest(`/api/bank/reconciliation/${accountId}/history?${params}`);
  }

  static async matchTransactions(
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/reconciliation/match-transactions?${params}`, {
      method: 'POST',
    });
  }

  // =====================================================
  // APPROVAL MATRIX METHODS
  // =====================================================
  
  static async createApprovalRule(ruleData: any): Promise<{ message: string; rule_id: string }> {
    return makeAuthenticatedRequest('/api/bank/approval-matrix', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  static async getApprovalRules(moduleType?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (moduleType) params.append('module_type', moduleType);
    
    return makeAuthenticatedRequest(`/api/bank/approval-matrix?${params}`);
  }

  // =====================================================
  // PURCHASE & EXPENSE INTEGRATION METHODS
  // =====================================================
  
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
    const params = new URLSearchParams({
      payment_method: paymentMethod,
    });
    if (bankAccountId) params.append('bank_account_id', bankAccountId);
    if (scheduledDate) params.append('scheduled_date', scheduledDate);
    
    return makeAuthenticatedRequest(`/api/purchase-expense/purchase-bills/${billId}/create-payment?${params}`, {
      method: 'POST',
    });
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/purchase-orders/${poId}/three-way-matching?${params}`, {
      method: 'POST',
    });
  }

  static async approvePurchaseOrder(
    poId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<{ message: string; result: any }> {
    const params = new URLSearchParams({ action });
    if (comments) params.append('comments', comments);
    
    return makeAuthenticatedRequest(`/api/purchase-expense/purchase-orders/${poId}/approve?${params}`, {
      method: 'POST',
    });
  }

  static async getPurchaseWorkflowStatus(poId: string): Promise<{
    po_id: string;
    workflow_status: any;
    current_stage: string;
    completion_percentage: number;
    pending_actions: string[];
  }> {
    return makeAuthenticatedRequest(`/api/purchase-expense/purchase-orders/${poId}/workflow-status`);
  }

  // =====================================================
  // ANALYTICS METHODS
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/analytics/purchase-performance?${params}`);
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/analytics/expense-insights?${params}`);
  }

  // =====================================================
  // COMPLIANCE METHODS
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/compliance/gst-reconciliation?${params}`);
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
    
    return makeAuthenticatedRequest(`/api/purchase-expense/compliance/tds-summary?${params}`);
  }

  // =====================================================
  // EXPENSE AUTOMATION METHODS
  // =====================================================
  
  static async uploadExpenseReceipt(file: File, expenseCategory: string): Promise<{
    message: string;
    extracted_data: any;
    confidence_score: number;
    requires_review: boolean;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new URLSearchParams({ expense_category: expenseCategory });
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/purchase-expense/expenses/upload-receipt?${params}`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async autoCategorizeExpense(expenseData: any): Promise<{
    suggested_category: string;
    confidence: number;
    tax_treatment: string;
    policy_compliance: any;
  }> {
    return makeAuthenticatedRequest('/api/purchase-expense/expenses/auto-categorize', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  static async checkExpensePolicy(expenseId: string): Promise<{
    expense_id: string;
    policy_compliance: boolean;
    violations: string[];
    approval_required: boolean;
    auto_approve_eligible: boolean;
  }> {
    return makeAuthenticatedRequest(`/api/purchase-expense/expenses/${expenseId}/policy-check`, {
      method: 'POST',
    });
  }
}

export default BankApiService; 