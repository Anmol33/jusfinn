import api from './api';
import type { 
  GRN, 
  GRNCreateRequest, 
  GRNUpdateRequest, 
  GRNFilters, 
  POForGRN, 
  GRNDashboardSummary,
  StatusChangeRequest,
  StatusChangeResponse
} from '@/types/grn';

export class GRNApiService {
  /**
   * Create GRN from Purchase Order
   */
  static async createGRNFromPO(poId: string, data: GRNCreateRequest): Promise<GRN> {
    const response = await api.post(`/grns/from-po/${poId}`, data);
    return response.data;
  }

  /**
   * Get all GRNs with filtering
   */
  static async getGRNs(filters: GRNFilters = {}): Promise<GRN[]> {
    const params = new URLSearchParams();
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.po_id) params.append('po_id', filters.po_id);
    
    const response = await api.get(`/grns?${params.toString()}`);
    return response.data;
  }

  /**
   * Get specific GRN by ID
   */
  static async getGRN(grnId: string): Promise<GRN> {
    const response = await api.get(`/grns/${grnId}`);
    return response.data;
  }

  /**
   * Update existing GRN
   */
  static async updateGRN(grnId: string, data: GRNUpdateRequest): Promise<GRN> {
    const response = await api.put(`/grns/${grnId}`, data);
    return response.data;
  }

  /**
   * Approve GRN
   */
  static async approveGRN(grnId: string, comments?: string): Promise<StatusChangeResponse> {
    const params = new URLSearchParams();
    if (comments) params.append('comments', comments);
    
    const response = await api.post(`/grns/${grnId}/approve?${params.toString()}`);
    return response.data;
  }

  /**
   * Reject GRN
   */
  static async rejectGRN(grnId: string, reason: string): Promise<StatusChangeResponse> {
    const params = new URLSearchParams();
    params.append('reason', reason);
    
    const response = await api.post(`/grns/${grnId}/reject?${params.toString()}`);
    return response.data;
  }

  /**
   * Change GRN status
   */
  static async changeGRNStatus(grnId: string, statusData: StatusChangeRequest): Promise<StatusChangeResponse> {
    const response = await api.patch(`/grns/${grnId}/status`, statusData);
    return response.data;
  }

  /**
   * Get PO items available for GRN creation
   */
  static async getPOItemsForGRN(poId: string): Promise<POForGRN> {
    const response = await api.get(`/grns/po/${poId}/available-items`);
    return response.data;
  }

  /**
   * Get GRN dashboard summary
   */
  static async getGRNDashboardSummary(): Promise<GRNDashboardSummary> {
    const response = await api.get('/grns/dashboard/summary');
    return response.data;
  }

  /**
   * Delete GRN (if in draft status)
   */
  static async deleteGRN(grnId: string): Promise<{ message: string }> {
    const response = await api.delete(`/grns/${grnId}`);
    return response.data;
  }

  /**
   * Get GRNs for specific Purchase Order
   */
  static async getGRNsForPO(poId: string): Promise<GRN[]> {
    return this.getGRNs({ po_id: poId });
  }

  /**
   * Get pending GRN approvals
   */
  static async getPendingGRNApprovals(): Promise<GRN[]> {
    return this.getGRNs({ status: 'pending_approval' });
  }

  /**
   * Submit GRN for approval
   */
  static async submitGRNForApproval(grnId: string): Promise<StatusChangeResponse> {
    return this.changeGRNStatus(grnId, {
      status: 'pending_approval' as any,
      notes: 'Submitted for approval'
    });
  }

  /**
   * Mark GRN as completed
   */
  static async completeGRN(grnId: string, notes?: string): Promise<StatusChangeResponse> {
    return this.changeGRNStatus(grnId, {
      status: 'completed' as any,
      notes: notes || 'Marked as completed'
    });
  }

  /**
   * Cancel GRN
   */
  static async cancelGRN(grnId: string, reason: string): Promise<StatusChangeResponse> {
    return this.changeGRNStatus(grnId, {
      status: 'cancelled' as any,
      notes: `Cancelled: ${reason}`
    });
  }

  /**
   * Reactivate cancelled GRN
   */
  static async reactivateGRN(grnId: string): Promise<StatusChangeResponse> {
    return this.changeGRNStatus(grnId, {
      status: 'draft' as any,
      notes: 'Reactivated from cancelled status'
    });
  }

  /**
   * Get GRN analytics data
   */
  static async getGRNAnalytics(dateRange?: { from: string; to: string }): Promise<{
    totalGRNs: number;
    totalValue: number;
    averageProcessingTime: number;
    statusDistribution: Record<string, number>;
    monthlyTrends: Array<{ month: string; count: number; value: number }>;
    vendorPerformance: Array<{ vendorName: string; grnCount: number; averageValue: number }>;
  }> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('from', dateRange.from);
      params.append('to', dateRange.to);
    }
    
    const response = await api.get(`/grns/analytics?${params.toString()}`);
    return response.data;
  }

  /**
   * Export GRNs to CSV/Excel
   */
  static async exportGRNs(filters: GRNFilters & { format: 'csv' | 'excel' }): Promise<Blob> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/grns/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Print GRN document
   */
  static async printGRN(grnId: string, format: 'pdf' | 'html' = 'pdf'): Promise<Blob> {
    const response = await api.get(`/grns/${grnId}/print?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Get GRN workflow history
   */
  static async getGRNWorkflowHistory(grnId: string): Promise<Array<{
    id: string;
    previous_status: string;
    new_status: string;
    changed_by: string;
    changed_at: string;
    notes?: string;
  }>> {
    const response = await api.get(`/grns/${grnId}/workflow-history`);
    return response.data;
  }

  /**
   * Bulk approve GRNs
   */
  static async bulkApproveGRNs(grnIds: string[], comments?: string): Promise<{
    successful: string[];
    failed: Array<{ id: string; error: string }>;
  }> {
    const response = await api.post('/grns/bulk-approve', {
      grn_ids: grnIds,
      comments
    });
    return response.data;
  }

  /**
   * Bulk update GRN status
   */
  static async bulkUpdateGRNStatus(grnIds: string[], status: string, notes?: string): Promise<{
    successful: string[];
    failed: Array<{ id: string; error: string }>;
  }> {
    const response = await api.post('/grns/bulk-update-status', {
      grn_ids: grnIds,
      status,
      notes
    });
    return response.data;
  }

  /**
   * Search GRNs by various criteria
   */
  static async searchGRNs(query: {
    search?: string;
    vendor_id?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
    status?: string[];
  }): Promise<GRN[]> {
    const response = await api.post('/grns/search', query);
    return response.data;
  }

  /**
   * Get GRN templates for quick creation
   */
  static async getGRNTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    template_data: Partial<GRNCreateRequest>;
  }>> {
    const response = await api.get('/grns/templates');
    return response.data;
  }

  /**
   * Create GRN from template
   */
  static async createGRNFromTemplate(templateId: string, poId: string, overrides?: Partial<GRNCreateRequest>): Promise<GRN> {
    const response = await api.post(`/grns/from-template/${templateId}`, {
      po_id: poId,
      ...overrides
    });
    return response.data;
  }
}