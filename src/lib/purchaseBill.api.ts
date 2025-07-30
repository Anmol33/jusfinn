/**
 * Purchase Bill API Service for JusFinn ERP
 * Handles all purchase bill-related API operations
 */

import api from './api';

// =====================================================
// PURCHASE BILL INTERFACES
// =====================================================

export enum PurchaseBillStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted", 
  PAID = "paid",
  CANCELLED = "cancelled"
}

export interface PurchaseBillItem {
  po_item_id: string;
  item_description: string;
  quantity: number;
  unit_price: number;
  hsn_code: string;  // Mandatory for GST compliance
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  taxable_amount: number;  // quantity * unit_price
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_price: number;  // Final amount including taxes
  notes?: string;
}

export interface PurchaseBill {
  id: string;
  bill_number: string;
  po_id?: string;
  po_number?: string;
  vendor_id: string;
  vendor_name?: string;
  bill_date: string;
  due_date: string;
  taxable_amount: number;
  total_cgst: number;
  total_sgst: number;
  total_igst: number;
  total_amount: number;
  grand_total: number;
  status: PurchaseBillStatus;
  items: PurchaseBillItem[];
  notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface PurchaseBillCreateRequest {
  po_id: string;
  bill_number: string;
  bill_date: string;  // ISO date string
  due_date: string;   // ISO date string
  items: PurchaseBillItem[];
  notes?: string;
  attachments?: string[];
  status?: PurchaseBillStatus;
}

export interface PurchaseBillUpdateRequest {
  bill_number?: string;
  bill_date?: string;
  due_date?: string;
  items?: PurchaseBillItem[];
  notes?: string;
  attachments?: string[];
  status?: PurchaseBillStatus;
}

// =====================================================
// PURCHASE BILL API SERVICE
// =====================================================

export class PurchaseBillApiService {
  
  static async getPurchaseBills(skip: number = 0, limit: number = 100): Promise<PurchaseBill[]> {
    const response = await api.get(`/purchase-bills?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getPurchaseBill(billId: string): Promise<PurchaseBill> {
    const response = await api.get(`/purchase-bills/${billId}`);
    return response.data;
  }

  static async createPurchaseBill(billData: PurchaseBillCreateRequest): Promise<PurchaseBill> {
    const response = await api.post('/purchase-bills', billData);
    return response.data;
  }

  static async updatePurchaseBill(billId: string, billData: PurchaseBillCreateRequest): Promise<PurchaseBill> {
    const response = await api.put(`/purchase-bills/${billId}`, billData);
    return response.data;
  }

  static async deletePurchaseBill(billId: string): Promise<void> {
    await api.delete(`/purchase-bills/${billId}`);
  }

  static async approvePurchaseBill(billId: string): Promise<PurchaseBill> {
    const response = await api.post(`/purchase-bills/${billId}/approve`);
    return response.data;
  }

  static async rejectPurchaseBill(billId: string, reason: string): Promise<PurchaseBill> {
    const response = await api.post(`/purchase-bills/${billId}/reject`, { reason });
    return response.data;
  }

  static async searchPurchaseBills(query: string, skip: number = 0, limit: number = 50): Promise<PurchaseBill[]> {
    const response = await api.get(`/purchase-bills/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getPurchaseBillsByVendor(vendorId: string, skip: number = 0, limit: number = 100): Promise<PurchaseBill[]> {
    const response = await api.get(`/purchase-bills?vendor_id=${vendorId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getPurchaseBillStats(): Promise<Record<string, number>> {
    const response = await api.get('/purchase-bills/stats');
    return response.data;
  }

  static async exportPurchaseBills(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await api.get(`/purchase-bills/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default PurchaseBillApiService; 