/**
 * Vendor API Service for JusFinn ERP
 * Handles all vendor-related API operations
 */

import api from './api';

// =====================================================
// VENDOR INTERFACES
// =====================================================

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
  vendor_type: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  credit_limit: number;
  credit_days: number;
  payment_terms: string;
  address: VendorAddress;
  tds_rate: number;
  tds_applicable: boolean;
  notes?: string | null;
}

export interface Vendor {
  id: string;
  vendor_code: string;
  business_name: string;
  legal_name?: string;
  gstin?: string;
  pan?: string;
  vendor_type: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  credit_limit: number;
  credit_days: number;
  payment_terms: string;
  address: VendorAddress;
  tds_rate: number;
  tds_applicable: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// =====================================================
// VENDOR API SERVICE
// =====================================================

export class VendorApiService {
  
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

  static async deleteVendor(vendorId: string): Promise<void> {
    await api.delete(`/vendors/${vendorId}`);
  }

  static async searchVendors(query: string, skip: number = 0, limit: number = 50): Promise<Vendor[]> {
    const response = await api.get(`/vendors/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
    return response.data;
  }

  static async getVendorsByType(vendorType: string, skip: number = 0, limit: number = 100): Promise<Vendor[]> {
    const response = await api.get(`/vendors?vendor_type=${vendorType}&skip=${skip}&limit=${limit}`);
    return response.data;
  }
}

export default VendorApiService;