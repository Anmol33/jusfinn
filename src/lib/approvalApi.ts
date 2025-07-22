import { config } from './config';

// Types for Approval API
export interface ApprovalRule {
  id: string;
  rule_name: string;
  description?: string;
  min_amount: number;
  max_amount?: number;
  level_1_required: boolean;
  level_2_required: boolean;
  level_3_required: boolean;
  finance_approval_required: boolean;
  level_1_approvers: string[];
  level_2_approvers: string[];
  level_3_approvers: string[];
  finance_approvers: string[];
  auto_approve_below: number;
  escalation_days: number;
  is_active: boolean;
  priority: number;
  departments: string[];
  created_at: string;
  updated_at: string;
}

export interface ApprovalWorkflow {
  id: string;
  po_id: string;
  current_level?: string;
  approval_status: string;
  level_1_status: string;
  level_1_approver?: string;
  level_1_approved_at?: string;
  level_2_status: string;
  level_2_approver?: string;
  level_2_approved_at?: string;
  level_3_status: string;
  level_3_approver?: string;
  level_3_approved_at?: string;
  finance_status: string;
  finance_approver?: string;
  finance_approved_at?: string;
  submitted_at?: string;
  submitted_by?: string;
  final_approved_at?: string;
  final_approved_by?: string;
  expected_approval_date?: string;
  is_overdue: boolean;
  escalation_count: number;
  applied_rule?: ApprovalRule;
  approval_history: ApprovalHistoryItem[];
}

export interface ApprovalHistoryItem {
  id: string;
  approval_level: string;
  action: string;
  approver_id: string;
  approver_name?: string;
  approver_email?: string;
  action_date: string;
  comments?: string;
  previous_status?: string;
  new_status?: string;
  po_amount_at_time?: number;
}

export interface PendingApproval {
  po_id: string;
  po_number: string;
  vendor_name: string;
  total_amount: number;
  approval_status: string;
  current_level?: string;
  submitted_at?: string;
  is_overdue: boolean;
  days_pending?: number;
  next_approver?: string;
}

export interface ApprovalActionRequest {
  action: 'approve' | 'reject' | 'request_changes';
  comments?: string;
}

export interface ApprovalRuleRequest {
  rule_name: string;
  description?: string;
  min_amount: number;
  max_amount?: number;
  level_1_required: boolean;
  level_2_required: boolean;
  level_3_required: boolean;
  finance_approval_required: boolean;
  level_1_approvers: string[];
  level_2_approvers: string[];
  level_3_approvers: string[];
  finance_approvers: string[];
  auto_approve_below: number;
  escalation_days: number;
  departments: string[];
  priority: number;
}

class ApprovalApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  // Approval Rules Management
  async getApprovalRules(): Promise<ApprovalRule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/approval-rules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching approval rules:', error);
      throw error;
    }
  }

  async createApprovalRule(ruleData: ApprovalRuleRequest): Promise<ApprovalRule> {
    try {
      const response = await fetch(`${this.baseUrl}/approval-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(ruleData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating approval rule:', error);
      throw error;
    }
  }

  async updateApprovalRule(ruleId: string, ruleData: Partial<ApprovalRuleRequest>): Promise<ApprovalRule> {
    try {
      const response = await fetch(`${this.baseUrl}/approval-rules/${ruleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(ruleData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating approval rule:', error);
      throw error;
    }
  }

  async deleteApprovalRule(ruleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/approval-rules/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting approval rule:', error);
      throw error;
    }
  }

  // Purchase Order Approval Workflow
  async submitForApproval(poId: string, submittedBy: string): Promise<ApprovalWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${poId}/submit-approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ submitted_by: submittedBy })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting PO for approval:', error);
      throw error;
    }
  }

  async processApprovalAction(poId: string, approverId: string, actionData: ApprovalActionRequest): Promise<ApprovalWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${poId}/approval-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          approver_id: approverId,
          ...actionData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing approval action:', error);
      throw error;
    }
  }

  async getPendingApprovals(userId: string, approverId?: string, limit?: number, offset?: number): Promise<PendingApproval[]> {
    try {
      const params = new URLSearchParams({
        user_id: userId,
        ...(approverId && { approver_id: approverId }),
        ...(limit && { limit: limit.toString() }),
        ...(offset && { offset: offset.toString() })
      });

      const response = await fetch(`${this.baseUrl}/pending-approvals?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  }

  async getApprovalWorkflowStatus(poId: string, userId: string): Promise<ApprovalWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${poId}/approval-workflow?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching approval workflow status:', error);
      throw error;
    }
  }

  // Approval Analytics
  async getApprovalAnalytics(userId: string, startDate?: string, endDate?: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        user_id: userId,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate })
      });

      const response = await fetch(`${this.baseUrl}/approval-analytics?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching approval analytics:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkApproveOrders(poIds: string[], approverId: string, comments?: string): Promise<{ success: string[], failed: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/bulk-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          po_ids: poIds,
          approver_id: approverId,
          comments
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error bulk approving orders:', error);
      throw error;
    }
  }

  async escalateApproval(poId: string, escalatedBy: string, reason?: string): Promise<ApprovalWorkflow> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${poId}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          escalated_by: escalatedBy,
          reason
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error escalating approval:', error);
      throw error;
    }
  }
}

export const approvalApiService = new ApprovalApiService();
export default approvalApiService;