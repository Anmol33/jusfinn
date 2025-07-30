/**
 * GRN (Goods Receipt Note) API Service for JusFinn ERP
 * Handles all GRN-related API operations
 */

import api from './api';

// =====================================================
// GRN INTERFACES & ENUMS
// =====================================================

export enum GRNStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed', 
  BILLED = 'billed',
  CANCELLED = 'cancelled'
}

export interface GRNItem {
  po_item_id: string;
  item_description: string;
  quantity: number;
  received_quantity: number;
  rejected_quantity: number;
  rejection_reason?: string;
  unit_price: number;
  notes?: string;
}

export interface GRN {
  id: string;
  grn_number: string;
  po_id: string;
  po_number: string;
  vendor_name: string;
  received_date: string;
  received_by: string;
  warehouse_location: string;
  status: string;
  total_ordered_quantity: number;
  total_received_quantity: number;
  total_rejected_quantity: number;
  items?: GRNItem[];
  delivery_note_number?: string;
  vehicle_number?: string;
  driver_name?: string;
  general_notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface GRNCreateRequest {
  po_id: string;
  grn_number?: string;
  received_date: string;
  received_by: string;
  warehouse_location: string;
  items: GRNItem[];
  delivery_note_number?: string;
  vehicle_number?: string;
  driver_name?: string;
  general_notes?: string;
  status?: GRNStatus; // Add status field for draft/complete choice
}

export interface GRNUpdateRequest {
  received_date?: string;
  received_by?: string;
  warehouse_location?: string;
  items?: GRNItem[];
  delivery_note_number?: string;
  vehicle_number?: string;
  driver_name?: string;
  general_notes?: string;
}

export interface POAvailableItems {
  po_id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  items: Array<{
    id: string;
    item_description: string;
    unit: string;
    ordered_quantity: number;
    received_quantity: number;
    pending_quantity: number;
    unit_price: number;
    total_amount: number;
  }>;
}

// =====================================================
// GRN API SERVICE
// =====================================================

export class GRNApiService {
  
  static async getGRNs(skip: number = 0, limit: number = 100, status?: string, poId?: string): Promise<GRN[]> {
    let url = `/grns?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    if (poId) {
      url += `&po_id=${poId}`;
    }
    const response = await api.get(url);
    return response.data;
  }

  static async getGRN(grnId: string): Promise<GRN> {
    const response = await api.get(`/grns/${grnId}`);
    return response.data;
  }

  static async createGRN(grnData: GRNCreateRequest): Promise<GRN> {
    const response = await api.post('/grns', grnData);
    return response.data;
  }

  // Complete a draft GRN
  static async completeDraftGRN(grnId: string): Promise<GRN> {
    const response = await api.put(`/grns/${grnId}/complete`);
    return response.data;
  }

  // Update GRN (only drafts)
  static async updateGRN(grnId: string, grnData: GRNCreateRequest): Promise<GRN> {
    const response = await api.put(`/grns/${grnId}`, grnData);
    return response.data;
  }

  static async deleteGRN(grnId: string): Promise<void> {
    await api.delete(`/grns/${grnId}`);
  }

  static async approveGRN(grnId: string): Promise<GRN> {
    const response = await api.post(`/grns/${grnId}/approve`);
    return response.data;
  }

  static async rejectGRN(grnId: string, reason: string): Promise<GRN> {
    const response = await api.post(`/grns/${grnId}/reject`, { reason });
    return response.data;
  }

  // Cancel GRN (only drafts)
  static async cancelGRN(grnId: string): Promise<GRN> {
    const response = await api.put(`/grns/${grnId}/cancel`);
    return response.data;
  }

  // GRN from Purchase Order operations
  static async getPOAvailableItems(poId: string): Promise<POAvailableItems> {
    const response = await api.get(`/grns/po/${poId}/available-items`);
    return response.data;
  }

  static async createGRNFromPO(poId: string, grnData: GRNCreateRequest): Promise<GRN> {
    const response = await api.post(`/grns/from-po/${poId}`, grnData);
    return response.data;
  }

  static async getGRNsByPO(poId: string, skip: number = 0, limit: number = 100): Promise<GRN[]> {
    const response = await api.get(`/grns?po_id=${poId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getGRNsByVendor(vendorId: string, skip: number = 0, limit: number = 100): Promise<GRN[]> {
    const response = await api.get(`/grns?vendor_id=${vendorId}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async searchGRNs(query: string, skip: number = 0, limit: number = 50): Promise<GRN[]> {
    const response = await api.get(`/grns/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getGRNStats(): Promise<Record<string, number>> {
    const response = await api.get('/grns/stats');
    return response.data;
  }

  static async exportGRNs(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await api.get(`/grns/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  static async duplicateGRN(grnId: string): Promise<GRN> {
    const response = await api.post(`/grns/${grnId}/duplicate`);
    return response.data;
  }

  static async getGRNHistory(grnId: string): Promise<Record<string, unknown>[]> {
    const response = await api.get(`/grns/${grnId}/history`);
    return response.data;
  }

  static async printGRN(grnId: string): Promise<Blob> {
    const response = await api.get(`/grns/${grnId}/print`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export default GRNApiService;