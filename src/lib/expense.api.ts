/**
 * Expense API Service for JusFinn ERP
 * Handles all expense-related API operations
 */

import api from './api';

// =====================================================
// EXPENSE INTERFACES
// =====================================================

export interface Expense {
  id: string;
  expense_number: string;
  vendor_id: string;
  category: string;
  amount: number;
  gst_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  description?: string;
}

export interface ExpenseCreateRequest {
  vendor_id: string;
  category?: string;
  category_id?: number;
  amount: number;
  gst_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  total_amount: number;
  description?: string;
  expense_date?: string;
  payment_mode?: string;
  invoice_number?: string;
  invoice_date?: string;
  expense_category?: string;
  sub_category?: string;
  project_id?: string;
  department?: string;
  attachment_url?: string;
  notes?: string;
  reimbursement_status?: string;
  approval_status?: string;
  tags?: string[];
}

// =====================================================
// EXPENSE API SERVICE
// =====================================================

export class ExpenseApiService {
  
  static async getExpenses(skip: number = 0, limit: number = 100): Promise<Expense[]> {
    const response = await api.get(`/expenses?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getExpense(expenseId: string): Promise<Expense> {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data;
  }

  static async createExpense(expenseData: ExpenseCreateRequest): Promise<Expense> {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  }

  static async updateExpense(expenseId: string, expenseData: ExpenseCreateRequest): Promise<Expense> {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
  }

  static async deleteExpense(expenseId: string): Promise<void> {
    await api.delete(`/expenses/${expenseId}`);
  }

  static async approveExpense(expenseId: string, action: string = 'approve', reason?: string): Promise<Expense> {
    const response = await api.post(`/expenses/${expenseId}/approve`, { action, reason });
    return response.data;
  }

  static async searchExpenses(query: string, skip: number = 0, limit: number = 50): Promise<Expense[]> {
    const response = await api.get(`/expenses/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getExpensesByVendor(vendorId: string, skip: number = 0, limit: number = 100): Promise<Expense[]> {
    const response = await api.get(`/expenses?vendor_id=${vendorId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getExpenseStats(): Promise<Record<string, number>> {
    const response = await api.get('/expenses/stats');
    return response.data;
  }

  static async exportExpenses(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await api.get(`/expenses/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default ExpenseApiService; 