# API Refactoring Documentation

## Overview

The `purchaseExpenseApi.ts` file has been refactored into separate, focused API service files to improve code organization, maintainability, and developer experience.

## New Structure

### 1. Vendor API (`vendor.api.ts`)
Handles all vendor-related operations:
- Create, read, update, delete vendors
- Search vendors
- Filter vendors by type

**Key Methods:**
- `VendorApiService.createVendor()`
- `VendorApiService.getVendors()`
- `VendorApiService.getVendor()`
- `VendorApiService.updateVendor()`
- `VendorApiService.deleteVendor()`
- `VendorApiService.searchVendors()`

### 2. Purchase Order API (`purchaseOrder.api.ts`)
Handles all purchase order operations:
- CRUD operations for purchase orders
- Approval workflow management
- Status transitions

**Key Methods:**
- `PurchaseOrderApiService.getPurchaseOrders()`
- `PurchaseOrderApiService.createPurchaseOrder()`
- `PurchaseOrderApiService.approvePurchaseOrder()`
- `PurchaseOrderApiService.rejectPurchaseOrder()`
- `PurchaseOrderApiService.submitPurchaseOrderForApproval()`
- `PurchaseOrderApiService.processPurchaseOrderApproval()`

### 3. GRN API (`grn.api.ts`)
Handles all Goods Receipt Note operations:
- Create GRNs from purchase orders
- GRN approval workflow
- Item receipt tracking

**Key Methods:**
- `GRNApiService.getGRNs()`
- `GRNApiService.createGRN()`
- `GRNApiService.getPOAvailableItems()`
- `GRNApiService.createGRNFromPO()`
- `GRNApiService.approveGRN()`

### 4. API Index (`api.index.ts`)
Central export point that provides:
- All individual API services
- Backward compatibility through unified `PurchaseExpenseApiService`
- Type exports for easy importing

## Migration Guide

### For New Code
Use the specific API services directly:

```typescript
// Old way
import { PurchaseExpenseApiService } from '@/lib/purchaseExpenseApi';

// New way - specific services
import { VendorApiService } from '@/lib/vendor.api';
import { PurchaseOrderApiService } from '@/lib/purchaseOrder.api';
import { GRNApiService } from '@/lib/grn.api';

// Or use the index file
import { VendorApiService, PurchaseOrderApiService, GRNApiService } from '@/lib/api.index';
```

### For Existing Code
The unified service is still available for backward compatibility:

```typescript
// This still works
import { PurchaseExpenseApiService } from '@/lib/api.index';

// But you should gradually migrate to specific services
```

### Updated Import Examples

**Before:**
```typescript
import { PurchaseExpenseApiService, PurchaseOrderStatus } from '@/lib/purchaseExpenseApi';
```

**After:**
```typescript
import { PurchaseOrderApiService, PurchaseOrderStatus } from '@/lib/purchaseOrder.api';
// or
import { PurchaseOrderApiService, PurchaseOrderStatus } from '@/lib/api.index';
```

## Benefits

1. **Better Organization**: Each module has its own focused API service
2. **Improved Maintainability**: Easier to find and modify specific functionality
3. **Reduced Bundle Size**: Import only what you need
4. **Better TypeScript Support**: More specific type definitions
5. **Easier Testing**: Test individual services in isolation
6. **Backward Compatibility**: Existing code continues to work

## File Structure

```
src/lib/
├── vendor.api.ts           # Vendor operations
├── purchaseOrder.api.ts    # Purchase order operations
├── grn.api.ts             # GRN operations
├── api.index.ts           # Central exports & backward compatibility
└── purchaseExpenseApi.ts  # Original file (can be deprecated)
```

## Next Steps

1. **Gradual Migration**: Update imports in existing components to use specific services
2. **Create Additional Services**: Extract expense and purchase bill functionality into separate services
3. **Add Unit Tests**: Create focused tests for each API service
4. **Update Documentation**: Keep this guide updated as the API evolves

## Breaking Changes

- Expense and Purchase Bill methods now throw errors directing to use separate services
- Some method signatures may have been enhanced with better typing

## Support

For questions or issues with the API refactoring, please refer to this documentation or contact the development team.