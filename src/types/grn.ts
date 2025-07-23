export enum GRNStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface GRNItem {
  id: string;
  po_item_id: string;
  item_description: string;
  unit: string;
  ordered_quantity: number;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  unit_price: number;
  total_received_amount: number;
  quality_status: string;
  rejection_reason?: string;
  batch_number?: string;
  expiry_date?: string;
  notes?: string;
}

export interface GRN {
  id: string;
  grn_number: string;
  po_id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  grn_date: string;
  received_date: string;
  delivery_note_number?: string;
  vehicle_number?: string;
  received_by: string;
  status: GRNStatus;
  quality_check_required: boolean;
  quality_approved: boolean;
  total_ordered_amount: number;
  total_received_amount: number;
  total_accepted_amount: number;
  total_rejected_amount: number;
  items: GRNItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GRNCreateRequest {
  po_id: string;
  grn_date: string;
  received_date: string;
  delivery_note_number?: string;
  vehicle_number?: string;
  received_by: string;
  quality_check_required: boolean;
  items: GRNItemRequest[];
  notes?: string;
}

export interface GRNItemRequest {
  po_item_id: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  rejection_reason?: string;
  batch_number?: string;
  expiry_date?: string;
  notes?: string;
}

export interface GRNUpdateRequest {
  grn_date?: string;
  received_date?: string;
  delivery_note_number?: string;
  vehicle_number?: string;
  received_by?: string;
  quality_check_required?: boolean;
  quality_approved?: boolean;
  quality_notes?: string;
  items?: GRNItemRequest[];
  notes?: string;
  status?: GRNStatus;
}

export interface GRNFilters {
  skip?: number;
  limit?: number;
  status?: string;
  po_id?: string;
  search?: string;
}

export interface POItemForGRN {
  id: string;
  item_description: string;
  unit: string;
  ordered_quantity: number;
  received_quantity: number;
  pending_quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface POForGRN {
  po_id: string;
  po_number: string;
  vendor_id: string;
  items: POItemForGRN[];
}

export interface GRNDashboardSummary {
  total_grns: number;
  status_breakdown: Record<string, number>;
  pending_approvals: number;
  recent_grns: number;
  total_value_received: number;
  average_grn_value: number;
}

export interface StatusChangeRequest {
  status: GRNStatus;
  notes?: string;
}

export interface StatusChangeResponse {
  success: boolean;
  message: string;
  new_status: GRNStatus;
}

// Action types for GRN workflow
export interface GRNAction {
  id: string;
  label: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: string;
  description: string;
  requiresConfirmation?: boolean;
  permissions?: string[];
  nextStatus?: GRNStatus;
}

export interface GRNStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  actions: GRNAction[];
  canEdit: boolean;
  canDelete: boolean;
}

// Status display configuration
export const GRN_STATUS_CONFIG: Record<GRNStatus, GRNStatusConfig> = {
  [GRNStatus.DRAFT]: {
    label: 'Draft',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'GRN is being created or edited',
    canEdit: true,
    canDelete: true,
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        variant: 'outline',
        icon: 'Edit',
        description: 'Modify GRN details'
      },
      {
        id: 'submit',
        label: 'Submit for Approval',
        variant: 'default',
        icon: 'Send',
        description: 'Submit GRN for approval workflow',
        nextStatus: GRNStatus.PENDING_APPROVAL
      },
      {
        id: 'delete',
        label: 'Delete',
        variant: 'destructive',
        icon: 'Trash2',
        description: 'Delete this GRN',
        requiresConfirmation: true
      }
    ]
  },
  [GRNStatus.PENDING_APPROVAL]: {
    label: 'Pending Approval',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'GRN is awaiting approval',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'approve',
        label: 'Approve',
        variant: 'default',
        icon: 'Check',
        description: 'Approve this GRN',
        nextStatus: GRNStatus.APPROVED,
        permissions: ['approve_grns']
      },
      {
        id: 'reject',
        label: 'Reject',
        variant: 'destructive',
        icon: 'X',
        description: 'Reject this GRN',
        nextStatus: GRNStatus.REJECTED,
        requiresConfirmation: true,
        permissions: ['approve_grns']
      },
      {
        id: 'request_changes',
        label: 'Request Changes',
        variant: 'outline',
        icon: 'MessageSquare',
        nextStatus: GRNStatus.DRAFT,
        description: 'Send back for modifications',
        permissions: ['approve_grns']
      }
    ]
  },
  [GRNStatus.APPROVED]: {
    label: 'Approved',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'GRN is approved and ready for processing',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'complete',
        label: 'Mark Complete',
        variant: 'default',
        icon: 'CheckCircle',
        description: 'Mark GRN as completed',
        nextStatus: GRNStatus.COMPLETED
      },
      {
        id: 'print',
        label: 'Print',
        variant: 'outline',
        icon: 'Printer',
        description: 'Print GRN document'
      }
    ]
  },
  [GRNStatus.COMPLETED]: {
    label: 'Completed',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'GRN processing is complete',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'print',
        label: 'Print',
        variant: 'outline',
        icon: 'Printer',
        description: 'Print GRN document'
      },
      {
        id: 'view_bills',
        label: 'View Bills',
        variant: 'outline',
        icon: 'FileText',
        description: 'View related purchase bills'
      }
    ]
  },
  [GRNStatus.REJECTED]: {
    label: 'Rejected',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'GRN was rejected during approval',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'revise',
        label: 'Revise & Resubmit',
        variant: 'default',
        icon: 'RefreshCw',
        nextStatus: GRNStatus.DRAFT,
        description: 'Create new version for resubmission'
      },
      {
        id: 'view_comments',
        label: 'View Comments',
        variant: 'outline',
        icon: 'MessageSquare',
        description: 'View rejection comments'
      }
    ]
  },
  [GRNStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'GRN has been cancelled',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'reactivate',
        label: 'Reactivate',
        variant: 'outline',
        icon: 'RotateCcw',
        description: 'Reactivate this GRN',
        nextStatus: GRNStatus.DRAFT,
        permissions: ['reactivate_grns']
      }
    ]
  }
};

// Helper functions
export const getGRNStatusConfig = (status: GRNStatus | string): GRNStatusConfig => {
  const statusKey = typeof status === 'string' ? status as GRNStatus : status;
  return GRN_STATUS_CONFIG[statusKey] || GRN_STATUS_CONFIG[GRNStatus.DRAFT];
};

export const getAvailableActions = (
  status: GRNStatus | string,
  userPermissions: string[] = []
): GRNAction[] => {
  const config = getGRNStatusConfig(status);
  return config.actions.filter(action => {
    if (!action.permissions) return true;
    return action.permissions.some(permission => userPermissions.includes(permission));
  });
};

export const canTransitionTo = (
  currentStatus: GRNStatus | string,
  targetStatus: GRNStatus | string
): boolean => {
  const availableActions = getAvailableActions(currentStatus);
  return availableActions.some(action => action.nextStatus === targetStatus);
};

export const getStatusDisplay = (status: GRNStatus | string) => {
  const config = getGRNStatusConfig(status);
  return {
    label: config.label,
    color: config.color,
    bgColor: config.bgColor,
    description: config.description
  };
};