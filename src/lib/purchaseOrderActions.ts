/**
 * Purchase Order Action Matrix
 * Defines what actions are available for each purchase order status
 */

import { PurchaseOrderStatus } from '@/lib/purchaseExpenseApi';

export interface StatusAction {
  id: string;
  label: string;
  icon: string;
  variant: 'default' | 'outline' | 'secondary' | 'destructive';
  description: string;
  requiresConfirmation?: boolean;
  nextStatus?: PurchaseOrderStatus;
  permissions?: string[];
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  canEdit: boolean;
  canDelete: boolean;
  actions: StatusAction[];
}

export const PURCHASE_ORDER_STATUS_CONFIG: Record<PurchaseOrderStatus, StatusConfig> = {
  [PurchaseOrderStatus.DRAFT]: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    description: 'Purchase order is being created or edited',
    canEdit: true,
    canDelete: true,
    actions: [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'Edit',
        variant: 'outline',
        description: 'Modify purchase order details'
      },
      {
        id: 'submit_approval',
        label: 'Submit for Approval',
        icon: 'Send',
        variant: 'default',
        description: 'Submit purchase order for approval workflow',
        nextStatus: PurchaseOrderStatus.PENDING_APPROVAL
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'Trash2',
        variant: 'destructive',
        description: 'Delete this purchase order',
        requiresConfirmation: true
      }
    ]
  },

  [PurchaseOrderStatus.PENDING_APPROVAL]: {
    label: 'Pending Approval',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: 'Purchase order is awaiting approval',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'approve',
        label: 'Approve',
        icon: 'CheckCircle',
        variant: 'default',
        description: 'Approve this purchase order',
        nextStatus: PurchaseOrderStatus.APPROVED,
        permissions: ['approve_purchase_orders']
      },
      {
        id: 'reject',
        label: 'Reject',
        icon: 'XCircle',
        variant: 'destructive',
        description: 'Reject this purchase order',
        nextStatus: PurchaseOrderStatus.REJECTED,
        requiresConfirmation: true,
        permissions: ['approve_purchase_orders']
      },
      {
        id: 'request_changes',
        label: 'Request Changes',
        icon: 'MessageSquare',
        variant: 'outline',
        description: 'Send back for modifications',
        nextStatus: PurchaseOrderStatus.DRAFT,
        permissions: ['approve_purchase_orders']
      }
    ]
  },

  [PurchaseOrderStatus.APPROVED]: {
    label: 'Approved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Purchase order is approved and ready for processing',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'send_to_vendor',
        label: 'Send to Vendor',
        icon: 'Send',
        variant: 'default',
        description: 'Send purchase order to vendor'
      },
      {
        id: 'partial_delivery',
        label: 'Mark Partially Delivered',
        icon: 'Package',
        variant: 'outline',
        description: 'Record partial delivery of items',
        nextStatus: PurchaseOrderStatus.PARTIALLY_DELIVERED
      },
      {
        id: 'full_delivery',
        label: 'Mark Delivered',
        icon: 'CheckCircle2',
        variant: 'default',
        description: 'Mark all items as delivered',
        nextStatus: PurchaseOrderStatus.DELIVERED
      },
      {
        id: 'cancel',
        label: 'Cancel Order',
        icon: 'X',
        variant: 'destructive',
        description: 'Cancel this purchase order',
        nextStatus: PurchaseOrderStatus.CANCELLED,
        requiresConfirmation: true,
        permissions: ['cancel_purchase_orders']
      }
    ]
  },

  [PurchaseOrderStatus.PARTIALLY_DELIVERED]: {
    label: 'Partially Delivered',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Some items have been delivered',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'receive_remaining',
        label: 'Receive Remaining Items',
        icon: 'Package',
        variant: 'outline',
        description: 'Record delivery of remaining items',
        nextStatus: PurchaseOrderStatus.DELIVERED
      },
      {
        id: 'complete_partial',
        label: 'Complete with Partial Delivery',
        icon: 'CheckCircle',
        variant: 'default',
        description: 'Complete order with partial delivery',
        nextStatus: PurchaseOrderStatus.COMPLETED
      }
    ]
  },

  [PurchaseOrderStatus.DELIVERED]: {
    label: 'Delivered',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'All items have been delivered',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'create_bill',
        label: 'Create Purchase Bill',
        icon: 'FileText',
        variant: 'default',
        description: 'Generate purchase bill for this order'
      },
      {
        id: 'mark_completed',
        label: 'Mark Completed',
        icon: 'CheckCircle',
        variant: 'outline',
        description: 'Mark order as completed',
        nextStatus: PurchaseOrderStatus.COMPLETED
      }
    ]
  },

  [PurchaseOrderStatus.COMPLETED]: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Order is fully completed and processed',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'view_details',
        label: 'View Details',
        icon: 'Eye',
        variant: 'outline',
        description: 'View complete order details'
      },
      {
        id: 'download_report',
        label: 'Download Report',
        icon: 'Download',
        variant: 'outline',
        description: 'Download order completion report'
      }
    ]
  },

  [PurchaseOrderStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Purchase order has been cancelled',
    canEdit: false,
    canDelete: false,
    actions: [
      {
        id: 'view_details',
        label: 'View Details',
        icon: 'Eye',
        variant: 'outline',
        description: 'View cancellation details'
      },
      {
        id: 'reactivate',
        label: 'Reactivate',
        icon: 'RefreshCw',
        variant: 'outline',
        description: 'Reactivate this purchase order',
        nextStatus: PurchaseOrderStatus.DRAFT,
        permissions: ['reactivate_purchase_orders']
      }
    ]
  },

  [PurchaseOrderStatus.REJECTED]: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Purchase order was rejected during approval',
    canEdit: true,
    canDelete: true,
    actions: [
      {
        id: 'edit',
        label: 'Edit & Resubmit',
        icon: 'Edit',
        variant: 'default',
        description: 'Modify and resubmit for approval',
        nextStatus: PurchaseOrderStatus.DRAFT
      },
      {
        id: 'view_rejection_reason',
        label: 'View Rejection Reason',
        icon: 'MessageSquare',
        variant: 'outline',
        description: 'View reason for rejection'
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'Trash2',
        variant: 'destructive',
        description: 'Delete this purchase order',
        requiresConfirmation: true
      }
    ]
  }
};

/**
 * Get status configuration for a given status
 */
export const getStatusConfig = (status: PurchaseOrderStatus | string): StatusConfig => {
  const statusKey = typeof status === 'string' ? status as PurchaseOrderStatus : status;
  return PURCHASE_ORDER_STATUS_CONFIG[statusKey] || PURCHASE_ORDER_STATUS_CONFIG[PurchaseOrderStatus.DRAFT];
};

/**
 * Get available actions for a specific status with optional permission filtering
 */
export const getAvailableActions = (
  status: PurchaseOrderStatus | string,
  userPermissions: string[] = []
): StatusAction[] => {
  const config = getStatusConfig(status);
  
  return config.actions.filter(action => {
    if (!action.permissions) return true;
    return action.permissions.some(permission => userPermissions.includes(permission));
  });
};

/**
 * Check if a status transition is valid
 */
export const isValidStatusTransition = (
  currentStatus: PurchaseOrderStatus | string,
  targetStatus: PurchaseOrderStatus | string
): boolean => {
  const config = getStatusConfig(currentStatus);
  const validTransitions = config.actions.map(action => action.nextStatus).filter(Boolean);
  
  return validTransitions.includes(targetStatus as PurchaseOrderStatus);
};

/**
 * Get status display properties for badges and UI
 */
export const getStatusDisplay = (status: PurchaseOrderStatus | string) => {
  const config = getStatusConfig(status);
  return {
    label: config.label,
    color: config.color,
    bgColor: config.bgColor,
    description: config.description
  };
};