/**
 * Purchase Order API Service for JusFinn ERP
 * Handles all purchase order-related API operations
 */

import api from './api';

// =====================================================
// PURCHASE ORDER INTERFACES & ENUMS
// =====================================================

export enum PurchaseOrderStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval", 
  APPROVED = "approved",
  REJECTED = "rejected",
  ORDERED = "ordered",
  PARTIALLY_RECEIVED = "partially_received",
  RECEIVED = "received",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface PurchaseOrderItem {
  id: string;
  item_description: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  hsn_code?: string;
  gst_rate?: number;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  vendor_name?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderCreateRequest {
  vendor_id: string;
  po_number?: string;
  po_date: string;
  delivery_date?: string;
  items: PurchaseOrderItem[];
  terms_and_conditions?: string;
  notes?: string;
}

export interface PurchaseOrderUpdateRequest {
  vendor_id?: string;
  po_date?: string;
  delivery_date?: string;
  items?: PurchaseOrderItem[];
  terms_and_conditions?: string;
  notes?: string;
}

// =====================================================
// PURCHASE ORDER API SERVICE
// =====================================================

export class PurchaseOrderApiService {
  
  static async getPurchaseOrders(skip: number = 0, limit: number = 100, status?: string): Promise<PurchaseOrder[]> {
    let url = `/purchase-orders?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  }

  static async getPurchaseOrder(poId: string): Promise<PurchaseOrder> {
    const response = await api.get(`/purchase-orders/${poId}`);
    return response.data;
  }

  static async createPurchaseOrder(poData: PurchaseOrderCreateRequest): Promise<PurchaseOrder> {
    const response = await api.post('/purchase-orders', poData);
    return response.data;
  }

  static async updatePurchaseOrder(poId: string, poData: PurchaseOrderUpdateRequest): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-orders/${poId}`, poData);
    return response.data;
  }

  static async deletePurchaseOrder(poId: string): Promise<void> {
    await api.delete(`/purchase-orders/${poId}`);
  }

  static async approvePurchaseOrder(poId: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/approve`);
    return response.data;
  }

  static async rejectPurchaseOrder(poId: string, reason: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/reject`, { reason });
    return response.data;
  }

  static async cancelPurchaseOrder(poId: string, reason?: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/cancel`, { reason });
    return response.data;
  }

  static async duplicatePurchaseOrder(poId: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/duplicate`);
    return response.data;
  }

  static async getPurchaseOrdersByVendor(vendorId: string, skip: number = 0, limit: number = 100): Promise<PurchaseOrder[]> {
    const response = await api.get(`/purchase-orders?vendor_id=${vendorId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async searchPurchaseOrders(query: string, skip: number = 0, limit: number = 50): Promise<PurchaseOrder[]> {
    const response = await api.get(`/purchase-orders/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getPurchaseOrderStats(): Promise<any> {
    const response = await api.get('/purchase-orders/stats');
    return response.data;
  }

  static async submitPurchaseOrderForApproval(poId: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/submit-for-approval`);
    return response.data;
  }

  static async processPurchaseOrderApproval(poId: string, action: 'approve' | 'reject' | 'request_changes', reason?: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${poId}/process-approval`, { action, reason });
    return response.data;
  }

  static async updatePurchaseOrderOperationalStatus(poId: string, status: string): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-orders/${poId}/operational-status`, { status });
    return response.data;
  }

  static async exportPurchaseOrders(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await api.get(`/purchase-orders/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default PurchaseOrderApiService;