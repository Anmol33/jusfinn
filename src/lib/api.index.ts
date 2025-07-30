/**
 * API Services Index
 * Central export point for all API services in JusFinn ERP
 */

// Export individual API services
export { VendorApiService, type Vendor, type VendorCreateRequest, type VendorAddress } from './vendor.api';
export { 
  PurchaseOrderApiService, 
  PurchaseOrderStatus,
  type PurchaseOrder, 
  type PurchaseOrderItem,
  type PurchaseOrderCreateRequest,
  type PurchaseOrderUpdateRequest
} from './purchaseOrder.api';
export { 
  GRNApiService, 
  GRNStatus,
  type GRN, 
  type GRNItem,
  type GRNCreateRequest,
  type GRNUpdateRequest,
  type POAvailableItems
} from './grn.api';

// Legacy compatibility - re-export the old interfaces and enums that might still be used
export { PurchaseOrderStatus as PurchaseOrderStatusEnum } from './purchaseOrder.api';
export { GRNStatus as GRNStatusEnum } from './grn.api';

// Note: Expense and Purchase Bill functionality needs separate API services
// These operations are no longer part of the purchase expense monolith
// TODO: Create ExpenseApiService for expense management operations
// TODO: Create PurchaseBillApiService for purchase bill operations

// Default exports for convenience
export { VendorApiService as default } from './vendor.api';