import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Search, 
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Send,
  PlayCircle,
  Package,
  CheckCircle2,
  X,
  FileText,
  Edit,
  Trash2,
  MessageSquare,
  Filter,
  Plus,
  Activity,
  Target,
  Settings,
  ChevronDown,
  AlertTriangle,
  Zap,
  Shield,
  Loader2,
  Bell,
  MoreHorizontal,
  Calendar,
  MapPin,
  User,
  Building,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Backend API Integration
import { 
  PurchaseExpenseApiService, 
  type PurchaseOrder as ApiPurchaseOrder, 
  type Vendor as ApiVendor,
  type PurchaseOrderCreateRequest,
  type POLineItem,
  PurchaseOrderStatus
} from '@/lib/purchaseExpenseApi';

// Action Matrix Integration
import { 
  getAvailableActions, 
  getStatusDisplay,
  type StatusAction
} from '@/lib/purchaseOrderActions';

// Enhanced interfaces for production
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGstin?: string;
  poDate: string;
  expectedDeliveryDate: string;
  deliveryAddress: string;
  status: PurchaseOrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  project?: string;
  termsAndConditions: string;
  paymentTerms: string;
  deliveryTerms: string;
  items: PurchaseOrderItem[];
  totalEstimatedAmount: number;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
  notes?: string;
  // Production fields
  riskScore?: number;
  complianceStatus?: 'compliant' | 'warning' | 'violation';
  isUrgent?: boolean;
}

interface PurchaseOrderItem {
  id: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  estimatedRate: number;
  totalEstimatedAmount: number;
}

interface EnhancedPOStats {
  total: number;
  draft: number;
  pendingApproval: number;
  approved: number;
  completed: number;
  totalValue: number;
  averageValue: number;
  budgetUtilization: number;
  monthlyTrend: number;
  onTimeDeliveryRate: number;
  approvalCycleTime: number;
  vendorPerformanceScore: number;
  complianceScore: number;
  highRiskPOs: number;
  overdueApprovals: number;
  budgetExceeding: number;
  weeklyTrend: number[];
  monthlyComparison: {
    current: number;
    previous: number;
    change: number;
  };
}

interface FilterState {
  search: string;
  status: string;
  vendor: string;
  priority: string;
  department: string;
}

interface SortState {
  field: keyof PurchaseOrder;
  direction: 'asc' | 'desc';
}

// Form interfaces for create dialog
interface CreatePOForm {
  po_number: string;
  vendor_id: string;
  po_date: string;
  expected_delivery_date: string;
  delivery_address: string;
  priority?: string;
  terms_and_conditions: string;
  notes: string;
  line_items: POLineItem[];
}

interface LineItemForm {
  item_description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  total_amount: number;
}

// Production-grade error handling
class POError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'POError';
  }
}

const PurchaseOrdersEnhanced = () => {
  const { toast } = useToast();
  
  // Core state
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrder[]>([]);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);
  const [vendors, setVendors] = useState<ApiVendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<EnhancedPOStats>({
    total: 0, draft: 0, pendingApproval: 0, approved: 0, completed: 0,
    totalValue: 0, averageValue: 0, budgetUtilization: 0, monthlyTrend: 0,
    onTimeDeliveryRate: 0, approvalCycleTime: 0, vendorPerformanceScore: 0, complianceScore: 0,
    highRiskPOs: 0, overdueApprovals: 0, budgetExceeding: 0,
    weeklyTrend: [], monthlyComparison: { current: 0, previous: 0, change: 0 }
  });

  // Enhanced filter and sort state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    vendor: 'all',
    priority: 'all',
    department: 'all'
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'lastModified',
    direction: 'desc'
  });

  // Dialog and loading states
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState<{ [key: string]: number }>({});

  // Create form state
  const [createForm, setCreateForm] = useState<CreatePOForm>({
    po_number: '',
    vendor_id: '',
    po_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    delivery_address: '',
    terms_and_conditions: 'Standard terms and conditions apply',
    notes: '',
    line_items: []
  });
  const [createFormErrors, setCreateFormErrors] = useState<{ [key: string]: string }>({});
  const [isCreating, setIsCreating] = useState(false);

  // Real-time updates
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false); // Disable auto-refresh to prevent loops

// Enhanced error handling with retry logic
const handleApiCall = async <T,>(
  apiCall: () => Promise<T>,
  errorMessage: string,
  retryKey?: string,
  maxRetries: number = 2
): Promise<T | null> => {
  try {
    // Check authentication before making API calls
    const authData = localStorage.getItem('auth');
    if (!authData) {
      // Only show auth error once to prevent spam
      if (!retryAttempts['auth_check']) {
        setRetryAttempts(prev => ({ ...prev, auth_check: 1 }));
        toast({
          title: "Authentication Required",
          description: "Please log in to access this feature",
          variant: "destructive",
        });
      }
      return null;
    }

    const result = await apiCall();
    if (retryKey) {
      setRetryAttempts(prev => ({ ...prev, [retryKey]: 0 }));
    }
    return result;
  } catch (error: any) {
    const currentAttempts = retryAttempts[retryKey || ''] || 0;
    
    // Handle 500 server errors - don't retry, just show error once
    if (error?.response?.status === 500) {
      const errorKey = `500_${retryKey}`;
      if (!retryAttempts[errorKey]) {
        setRetryAttempts(prev => ({ ...prev, [errorKey]: 1 }));
        toast({
          title: "Server Error",
          description: "Server is currently unavailable. Please try again later.",
          variant: "destructive",
        });
      }
      return null;
    }

    // Handle 422 validation errors specifically - reduce spam
    if (error?.response?.status === 422) {
      console.error(`422 Validation Error:`, error?.response?.data);
      // Only show error once per retry key to prevent spam
      const errorKey = `422_${retryKey}`;
      if (!retryAttempts[errorKey]) {
        setRetryAttempts(prev => ({ ...prev, [errorKey]: 1 }));
        toast({
          title: "Validation Error",
          description: "Please check your input data and try again.",
          variant: "destructive",
        });
      }
      return null;
    }

    // Handle authentication errors
    if (error?.response?.status === 401) {
      toast({
        title: "Authentication Error",
        description: "Session expired. Please log in again.",
        variant: "destructive",
      });
      localStorage.removeItem('auth');
      window.location.href = '/signin';
      return null;
    }
    
    // Only retry for network errors, not server errors
    const isRetryable = error?.code === 'NETWORK_ERROR' ||
                       error?.message?.includes('timeout') ||
                       error?.message?.includes('Network Error');
    
    if (isRetryable && currentAttempts < maxRetries && retryKey) {
      setRetryAttempts(prev => ({ ...prev, [retryKey]: currentAttempts + 1 }));
      toast({
        title: "Retrying...",
        description: `Network error, attempt ${currentAttempts + 1} of ${maxRetries}`,
        duration: 2000,
      });
      
      const delay = Math.pow(2, currentAttempts) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return handleApiCall(apiCall, errorMessage, retryKey, maxRetries);
    }
    
    console.error(`${errorMessage}:`, error);
    
    // Show error once per key to prevent spam
    const errorKey = `error_${retryKey}`;
    if (!retryAttempts[errorKey]) {
      setRetryAttempts(prev => ({ ...prev, [errorKey]: 1 }));
      toast({
        title: "Error",
        description: error?.response?.data?.detail || error?.message || errorMessage,
        variant: "destructive",
      });
    }
      
    return null;
  }
};

  // Convert backend status to frontend format
  const convertBackendStatus = (backendStatus: string): PurchaseOrderStatus => {
    const status = backendStatus.toLowerCase();
    switch (status) {
      case 'draft': return PurchaseOrderStatus.DRAFT;
      case 'pending_approval': return PurchaseOrderStatus.PENDING_APPROVAL;
      case 'approved': return PurchaseOrderStatus.APPROVED;
      case 'rejected': return PurchaseOrderStatus.REJECTED;
      case 'partially_delivered': return PurchaseOrderStatus.PARTIALLY_DELIVERED;
      case 'delivered': return PurchaseOrderStatus.DELIVERED;
      case 'completed': return PurchaseOrderStatus.COMPLETED;
      case 'cancelled': return PurchaseOrderStatus.CANCELLED;
      default: return PurchaseOrderStatus.DRAFT;
    }
  };

  // Load vendors for dropdowns with better error handling and fallbacks
  const loadVendors = useCallback(async () => {
    try {
      const result = await handleApiCall(
        () => PurchaseExpenseApiService.getVendors(0, 100), // Changed from 1000 to 100
        "Failed to load vendors",
        "loadVendors"
      );
      
      if (result && Array.isArray(result)) {
        setVendors(result);
        console.log(`Successfully loaded ${result.length} vendors`);
      } else {
        // Fallback to empty array if no valid data
        setVendors([]);
        console.warn('No vendor data received, using empty array');
      }
    } catch (error) {
      console.error('Error in loadVendors:', error);
      // Always set to empty array to prevent component errors
      setVendors([]);
    }
  }, []);

  // Enhanced data loading with better error handling
  const loadPurchaseOrders = useCallback(async (force: boolean = false) => {
    if (loading && !force) return;
    
    setLoading(true);
    try {
      const result = await handleApiCall(
        () => PurchaseExpenseApiService.getPurchaseOrders({ skip: 0, limit: 100 }), // Changed from 1000 to 100
        "Failed to load purchase orders",
        "loadPOs"
      );
      
      if (result && Array.isArray(result)) {
        const frontendPOs: PurchaseOrder[] = result.map(po => ({
          id: po.id,
          poNumber: po.po_number,
          vendorId: po.vendor_id,
          vendorName: 'Unknown Vendor',
          vendorGstin: '',
          poDate: new Date(po.po_date).toISOString().split('T')[0],
          expectedDeliveryDate: po.expected_delivery_date ? new Date(po.expected_delivery_date).toISOString().split('T')[0] : '',
          deliveryAddress: po.delivery_address || '',
          status: convertBackendStatus(po.status),
          priority: 'medium',
          department: 'General',
          project: '',
          termsAndConditions: po.terms_and_conditions || '',
          paymentTerms: '30 days',
          deliveryTerms: 'FOB',
          items: (po.line_items || []).map((item: any) => ({
            id: item.id || '',
            itemDescription: item.item_description,
            quantity: item.quantity,
            unit: item.unit,
            estimatedRate: item.unit_price || item.rate || 0,
            totalEstimatedAmount: item.total_amount || item.amount || 0
          })),
          totalEstimatedAmount: po.total_amount,
          createdBy: 'System',
          createdDate: po.created_at,
          lastModified: po.updated_at,
          modifiedBy: 'System',
          notes: po.notes || '',
          isUrgent: false
        }));
        
        setPurchaseOrders(frontendPOs);
        calculateEnhancedStats(frontendPOs);
        setLastUpdated(new Date());
        
        toast({
          title: "Success",
          description: `Loaded ${frontendPOs.length} purchase orders`,
          duration: 3000,
        });
        
        // Add some test purchase orders with different statuses for testing
        if (frontendPOs.length === 0) {
          console.log('📝 Adding test purchase orders for development');
          const testPOs: PurchaseOrder[] = [
            {
              id: 'test-draft-1',
              poNumber: 'PO/2024/TEST/001',
              vendorId: 'vendor-1',
              vendorName: 'Test Vendor A',
              vendorGstin: '',
              poDate: new Date().toISOString().split('T')[0],
              expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              deliveryAddress: 'Test Address',
              status: PurchaseOrderStatus.DRAFT,
              priority: 'medium',
              department: 'General',
              project: '',
              termsAndConditions: 'Standard terms',
              paymentTerms: '30 days',
              deliveryTerms: 'FOB',
              items: [{
                id: 'item-1',
                itemDescription: 'Test Item',
                quantity: 10,
                unit: 'PCS',
                estimatedRate: 100,
                totalEstimatedAmount: 1000
              }],
              totalEstimatedAmount: 1000,
              createdBy: 'Test User',
              createdDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: 'Test User',
              notes: 'Test purchase order in draft status',
              isUrgent: false
            },
            {
              id: 'test-pending-1',
              poNumber: 'PO/2024/TEST/002',
              vendorId: 'vendor-2',
              vendorName: 'Test Vendor B',
              vendorGstin: '',
              poDate: new Date().toISOString().split('T')[0],
              expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              deliveryAddress: 'Test Address',
              status: PurchaseOrderStatus.PENDING_APPROVAL,
              priority: 'high',
              department: 'General',
              project: '',
              termsAndConditions: 'Standard terms',
              paymentTerms: '30 days',
              deliveryTerms: 'FOB',
              items: [{
                id: 'item-2',
                itemDescription: 'Test Item 2',
                quantity: 5,
                unit: 'PCS',
                estimatedRate: 200,
                totalEstimatedAmount: 1000
              }],
              totalEstimatedAmount: 1000,
              createdBy: 'Test User',
              createdDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: 'Test User',
              notes: 'Test purchase order pending approval',
              isUrgent: false
            }
          ];
          
          setPurchaseOrders(testPOs);
          calculateEnhancedStats(testPOs);
        }
      } else {
        // Fallback to empty array if no valid data
        setPurchaseOrders([]);
        calculateEnhancedStats([]);
        console.warn('No purchase order data received or invalid format');
      }
    } catch (error) {
      console.error('Error in loadPurchaseOrders:', error);
      setPurchaseOrders([]);
      calculateEnhancedStats([]);
    } finally {
      setLoading(false);
    }
  }, [loading, toast, retryAttempts]);

  // Enhanced stats calculation
  const calculateEnhancedStats = (pos: PurchaseOrder[]) => {
    const newStats: EnhancedPOStats = {
      total: pos.length,
      draft: pos.filter(po => po.status === PurchaseOrderStatus.DRAFT).length,
      pendingApproval: pos.filter(po => po.status === PurchaseOrderStatus.PENDING_APPROVAL).length,
      approved: pos.filter(po => po.status === PurchaseOrderStatus.APPROVED).length,
      completed: pos.filter(po => [PurchaseOrderStatus.DELIVERED, PurchaseOrderStatus.COMPLETED].includes(po.status)).length,
      totalValue: pos.reduce((sum, po) => sum + po.totalEstimatedAmount, 0),
      averageValue: pos.length > 0 ? pos.reduce((sum, po) => sum + po.totalEstimatedAmount, 0) / pos.length : 0,
      budgetUtilization: 75,
      monthlyTrend: 12,
      onTimeDeliveryRate: 85.5,
      approvalCycleTime: 2.3,
      vendorPerformanceScore: 87.2,
      complianceScore: 92.1,
      overdueApprovals: pos.filter(po => po.status === PurchaseOrderStatus.PENDING_APPROVAL && 
        new Date(po.lastModified) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      budgetExceeding: pos.filter(po => po.totalEstimatedAmount > 100000).length,
      weeklyTrend: [65, 72, 68, 75, 82, 79, 88],
      monthlyComparison: {
        current: pos.filter(po => new Date(po.createdDate).getMonth() === new Date().getMonth()).length,
        previous: Math.floor(pos.length * 0.85),
        change: 15.2
      }
    };
    setStats(newStats);
  };

  // Enhanced filtering
  const applyFilters = useMemo(() => {
    let filtered = [...purchaseOrders];
    
    // Text search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(po =>
        po.poNumber.toLowerCase().includes(searchTerm) ||
        po.vendorName.toLowerCase().includes(searchTerm) ||
        po.department.toLowerCase().includes(searchTerm) ||
        po.notes?.toLowerCase().includes(searchTerm) ||
        po.items.some(item => item.itemDescription.toLowerCase().includes(searchTerm))
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(po => po.status === filters.status);
    }
    
    // Vendor filter
    if (filters.vendor !== 'all') {
      filtered = filtered.filter(po => po.vendorId === filters.vendor);
    }
    
    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(po => po.priority === filters.priority);
    }
    
    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(po => po.department === filters.department);
    }
    
    return filtered;
  }, [purchaseOrders, filters]);

  // Enhanced sorting
  const applySorting = useMemo(() => {
    const sorted = [...applyFilters].sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];
      
      // Handle date fields
      if (sort.field === 'poDate' || sort.field === 'lastModified' || sort.field === 'createdDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      // Handle numeric fields
      if (sort.field === 'totalEstimatedAmount') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [applyFilters, sort]);

  // Update filtered POs
  useEffect(() => {
    setFilteredPOs(applySorting);
  }, [applySorting]);

  // Enhanced status action handling with proper business logic
  const handleStatusAction = async (poId: string, action: StatusAction) => {
    console.log(`🎯 Action triggered: ${action.id} for PO ${poId}`);
    setActionLoading(prev => ({ ...prev, [poId]: true }));
    
    try {
      let result = null;
      let newStatus = null;
      
      switch (action.id) {
        case 'edit':
          // Open edit dialog instead of API call
          const poToEdit = purchaseOrders.find(po => po.id === poId);
          if (poToEdit) {
            setSelectedPO(poToEdit);
            toast({
              title: 'Edit Mode',
              description: 'Edit functionality will be implemented',
              duration: 3000,
            });
          }
          return;
          
        case 'submit_approval':
          try {
            result = await PurchaseExpenseApiService.submitPurchaseOrderForApproval(poId);
            newStatus = PurchaseOrderStatus.PENDING_APPROVAL;
            console.log('✅ Submit for approval successful');
          } catch (error) {
            console.error('❌ Submit for approval failed:', error);
            throw error;
          }
          break;
            
        case 'approve':
          try {
            result = await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'approve');
            newStatus = PurchaseOrderStatus.APPROVED;
            console.log('✅ Approval successful');
          } catch (error) {
            console.error('❌ Approval failed:', error);
            throw error;
          }
          break;
            
        case 'reject':
          try {
            result = await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'reject');
            newStatus = PurchaseOrderStatus.REJECTED;
            console.log('✅ Rejection successful');
          } catch (error) {
            console.error('❌ Rejection failed:', error);
            throw error;
          }
          break;
            
        case 'request_changes':
          try {
            result = await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'reject', 'Changes requested');
            newStatus = PurchaseOrderStatus.DRAFT;
            console.log('✅ Request changes successful');
          } catch (error) {
            console.error('❌ Request changes failed:', error);
            throw error;
          }
          break;
          
        case 'mark_delivered':
        case 'full_delivery':
          try {
            result = await PurchaseExpenseApiService.updatePurchaseOrderStatus(poId, PurchaseOrderStatus.DELIVERED);
            newStatus = PurchaseOrderStatus.DELIVERED;
            console.log('✅ Mark delivered successful');
          } catch (error) {
            console.error('❌ Mark delivered failed:', error);
            throw error;
          }
          break;
          
        case 'mark_completed':
          try {
            result = await PurchaseExpenseApiService.updatePurchaseOrderStatus(poId, PurchaseOrderStatus.COMPLETED);
            newStatus = PurchaseOrderStatus.COMPLETED;
            console.log('✅ Mark completed successful');
          } catch (error) {
            console.error('❌ Mark completed failed:', error);
            throw error;
          }
          break;
          
        case 'cancel':
          try {
            result = await PurchaseExpenseApiService.updatePurchaseOrderStatus(poId, PurchaseOrderStatus.CANCELLED);
            newStatus = PurchaseOrderStatus.CANCELLED;
            console.log('✅ Cancel successful');
          } catch (error) {
            console.error('❌ Cancel failed:', error);
            throw error;
          }
          break;
          
        case 'delete':
          try {
            result = await PurchaseExpenseApiService.deletePurchaseOrder(poId);
            // Remove from local state
            const updatedPOs = purchaseOrders.filter(po => po.id !== poId);
            setPurchaseOrders(updatedPOs);
            calculateEnhancedStats(updatedPOs);
            
            toast({
              title: 'Success',
              description: `Purchase order deleted successfully`,
              duration: 3000,
            });
            console.log('✅ Delete successful');
            return;
          } catch (error) {
            console.error('❌ Delete failed:', error);
            throw error;
          }
          
        case 'view_details':
          // Show details dialog
          const poToView = purchaseOrders.find(po => po.id === poId);
          if (poToView) {
            setSelectedPO(poToView);
            toast({
              title: 'Details',
              description: 'Viewing purchase order details',
              duration: 2000,
            });
          }
          return;
          
        default:
          // Handle any other actions with nextStatus
          if (action.nextStatus) {
            try {
              result = await PurchaseExpenseApiService.updatePurchaseOrderStatus(poId, action.nextStatus);
              newStatus = action.nextStatus;
              console.log(`✅ Status update to ${action.nextStatus} successful`);
            } catch (error) {
              console.error(`❌ Status update to ${action.nextStatus} failed:`, error);
              throw error;
            }
          } else {
            toast({
              title: 'Action Not Implemented',
              description: `${action.label} functionality will be implemented soon`,
              duration: 3000,
            });
            return;
          }
      }
      
      // Update local state if we have a new status
      if (newStatus && result) {
        const updatedPOs = purchaseOrders.map(po => 
          po.id === poId 
            ? { ...po, status: newStatus, lastModified: new Date().toISOString() }
            : po
        );
        setPurchaseOrders(updatedPOs);
        calculateEnhancedStats(updatedPOs);
        
        toast({
          title: 'Success',
          description: `${action.label} completed successfully`,
          duration: 3000,
        });
        
        console.log(`🎉 Action ${action.id} completed, status changed to ${newStatus}`);
      }
      
    } catch (error: any) {
      console.error(`💥 Action ${action.id} failed:`, error);
      toast({
        title: 'Action Failed',
        description: error?.response?.data?.detail || error?.message || `Failed to ${action.label.toLowerCase()}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [poId]: false }));
    }
  };

  // Bulk export functionality
  const handleBulkExport = () => {
    const selectedPOsData = purchaseOrders.filter(po => selectedPOs.includes(po.id));
    const csvContent = generateCSVContent(selectedPOsData);
    downloadCSV(csvContent, `purchase_orders_${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: 'Export Complete',
      description: `Exported ${selectedPOs.length} purchase orders`,
    });
  };

  // CSV generation
  const generateCSVContent = (pos: PurchaseOrder[]): string => {
    const headers = ['PO Number', 'Vendor', 'Status', 'PO Date', 'Expected Delivery', 'Total Amount', 'Department'];
    const rows = pos.map(po => [
      po.poNumber,
      po.vendorName,
      po.status,
      po.poDate,
      po.expectedDeliveryDate,
      po.totalEstimatedAmount.toString(),
      po.department
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load data on mount with authentication check - run only once
  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (!authData) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view purchase orders",
        variant: "destructive",
      });
      return;
    }

    console.log('Loading initial data');
    loadPurchaseOrders();
    loadVendors();
  }, []); // Empty dependency array to run only once on mount

  // Generate PO number
  const generatePONumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-4);
    return `PO/${year}/${month}/${timestamp}`;
  };

  // Validate create form
  const validateCreateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!createForm.po_number.trim()) {
      errors.po_number = 'PO number is required';
    }
    
    if (!createForm.vendor_id) {
      errors.vendor_id = 'Vendor selection is required';
    }
    
    if (!createForm.po_date) {
      errors.po_date = 'PO date is required';
    }
    
    if (!createForm.delivery_address.trim()) {
      errors.delivery_address = 'Delivery address is required';
    }
    
    if (createForm.line_items.length === 0) {
      errors.line_items = 'At least one line item is required';
    }
    
    // Validate line items
    createForm.line_items.forEach((item, index) => {
      if (!item.item_description.trim()) {
        errors[`line_item_${index}_description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        errors[`line_item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unit_price <= 0) {
        errors[`line_item_${index}_price`] = 'Unit price must be greater than 0';
      }
    });
    
    setCreateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create purchase order
  const handleCreatePO = async () => {
    if (!validateCreateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    try {
      // Fix date format for backend - convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SS
      const formattedData = {
        ...createForm,
        po_date: createForm.po_date ? `${createForm.po_date}T00:00:00` : new Date().toISOString(),
        expected_delivery_date: createForm.expected_delivery_date ? `${createForm.expected_delivery_date}T00:00:00` : ''
      };

      const result = await handleApiCall(
        () => PurchaseExpenseApiService.createPurchaseOrder(formattedData),
        "Failed to create purchase order",
        "createPO"
      );
      
      if (result) {
        toast({
          title: "Success",
          description: `Purchase order ${createForm.po_number} created successfully`,
          duration: 3000,
        });
        
        // Reset form and close dialog
        setCreateForm({
          po_number: '',
          vendor_id: '',
          po_date: new Date().toISOString().split('T')[0],
          expected_delivery_date: '',
          delivery_address: '',
          terms_and_conditions: 'Standard terms and conditions apply',
          notes: '',
          line_items: []
        });
        setCreateFormErrors({});
        setShowCreateDialog(false);
        
        // Reload purchase orders
        loadPurchaseOrders(true);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Add line item
  const addLineItem = () => {
    const newItem: POLineItem = {
      item_description: '',
      unit: 'pcs',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      total_amount: 0
    };
    
    setCreateForm(prev => ({
      ...prev,
      line_items: [...prev.line_items, newItem]
    }));
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  // Update line item
  const updateLineItem = (index: number, field: keyof POLineItem, value: any) => {
    setCreateForm(prev => {
      const updatedItems = [...prev.line_items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      
      // Recalculate total amount for this item
      if (field === 'quantity' || field === 'unit_price' || field === 'discount_percentage') {
        const item = updatedItems[index];
        const subtotal = item.quantity * item.unit_price;
        const discount = (subtotal * (item.discount_percentage || 0)) / 100;
        updatedItems[index].total_amount = subtotal - discount;
      }
      
      return {
        ...prev,
        line_items: updatedItems
      };
    });
  };

  // Render action buttons with loading states and enhanced debugging
  const renderStatusActions = (po: PurchaseOrder) => {
    const availableActions = getAvailableActions(po.status, ['approve_purchase_orders', 'cancel_purchase_orders', 'reactivate_purchase_orders']);
    const isLoading = actionLoading[po.id];
    
    console.log(`🔍 Rendering actions for PO ${po.id} (${po.status}):`, availableActions.map(a => a.id));
    
    if (availableActions.length === 0) {
      return (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log(`👁️ View details clicked for PO ${po.id}`);
              setSelectedPO(po);
            }}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        {availableActions.slice(0, 3).map((action) => {
          const IconComponent = getIconComponent(action.icon);
          
          console.log(`🔧 Creating action button: ${action.id} - ${action.label}`);
          
          if (action.requiresConfirmation) {
            return (
              <AlertDialog key={action.id}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    title={action.description}
                    onClick={() => console.log(`⚠️ Confirmation action ${action.id} triggered`)}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{action.label}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to {action.label.toLowerCase()}? {action.description}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        console.log(`✅ Confirmed action ${action.id} for PO ${po.id}`);
                        handleStatusAction(po.id, action);
                      }}
                    >
                      {action.label}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }
          
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🚀 Direct action ${action.id} clicked for PO ${po.id}`);
                handleStatusAction(po.id, action);
              }}
              disabled={isLoading}
              title={action.description}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconComponent className="h-4 w-4" />
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Edit, Send, CheckCircle, XCircle, MessageSquare, PlayCircle, 
      Package, CheckCircle2, X, FileText, Eye, Download, RefreshCw, Trash2
    };
    return icons[iconName] || AlertCircle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Purchase Orders (Enhanced) - JusFinn</title>
        <meta name="description" content="Production-grade purchase order management with advanced features" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Purchase Orders Enhanced
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">
                  Production-grade management with advanced features
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                const newPONumber = generatePONumber();
                setCreateForm(prev => ({ ...prev, po_number: newPONumber }));
                setShowCreateDialog(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create PO
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total POs</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+{stats.monthlyComparison.change}%</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingApproval}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-yellow-600" />
                    <span className="text-xs text-yellow-600">{stats.approvalCycleTime}d avg</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Target className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">{stats.onTimeDeliveryRate}% on-time</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-purple-900">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
                  <div className="flex items-center gap-1 mt-1">
                    <BarChart3 className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600">₹{(stats.averageValue / 1000).toFixed(0)}K avg</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list">All Purchase Orders ({filteredPOs.length})</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals ({stats.pendingApproval})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Enhanced Filters */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by PO number, vendor, items, or department..."
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {Object.values(PurchaseOrderStatus).map(status => (
                            <SelectItem key={status} value={status}>
                              {getStatusDisplay(status).label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Active Filters Display */}
                  {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Active filters:</span>
                      {filters.search && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Search: {filters.search}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                          />
                        </Badge>
                      )}
                      {filters.status !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Status: {getStatusDisplay(filters.status as PurchaseOrderStatus).label}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                          />
                        </Badge>
                      )}
                      {filters.priority !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Priority: {filters.priority}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFilters(prev => ({ ...prev, priority: 'all' }))}
                          />
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Purchase Orders Table */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Purchase Orders ({filteredPOs.length})</CardTitle>
                    <CardDescription>
                      Production-grade purchase order management
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedPOs.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkExport}
                        disabled={bulkActionLoading}
                        className="flex items-center gap-2"
                      >
                        {bulkActionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Export ({selectedPOs.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {loading && filteredPOs.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <div className="text-center">
                        <h3 className="text-lg font-medium">Loading purchase orders...</h3>
                        <p className="text-sm text-muted-foreground">Please wait while we fetch the latest data</p>
                      </div>
                    </div>
                  </div>
                ) : filteredPOs.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium text-muted-foreground mb-2">No purchase orders found</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {filters.search || filters.status !== 'all' 
                        ? 'Try adjusting your search criteria or filters' 
                        : 'Create your first purchase order to get started'
                      }
                    </p>
                    {!filters.search && filters.status === 'all' && purchaseOrders.length === 0 && (
                      <Button onClick={() => {
                        const newPONumber = generatePONumber();
                        setCreateForm(prev => ({ ...prev, po_number: newPONumber }));
                        setShowCreateDialog(true);
                      }} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Purchase Order
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Bulk Selection Header */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedPOs.length === filteredPOs.length && filteredPOs.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPOs(filteredPOs.map(po => po.id));
                            } else {
                              setSelectedPOs([]);
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {selectedPOs.length > 0 
                            ? `${selectedPOs.length} of ${filteredPOs.length} selected` 
                            : `${filteredPOs.length} purchase orders`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSort(prev => ({ 
                            ...prev, 
                            direction: prev.direction === 'asc' ? 'desc' : 'asc' 
                          }))}
                          className="flex items-center gap-1"
                        >
                          Sort by {sort.field}
                          <ChevronDown className={`h-4 w-4 transition-transform ${sort.direction === 'desc' ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Table */}
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-12 font-semibold text-gray-700">
                              <Checkbox />
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">PO Details</TableHead>
                            <TableHead className="font-semibold text-gray-700">Vendor</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status & Priority</TableHead>
                            <TableHead className="font-semibold text-gray-700">Timeline</TableHead>
                            <TableHead className="font-semibold text-gray-700">Financial</TableHead>
                            <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPOs.map((po) => {
                            const statusDisplay = getStatusDisplay(po.status);
                            const isSelected = selectedPOs.includes(po.id);
                            const isOverdue = new Date(po.expectedDeliveryDate) < new Date() && 
                              ![PurchaseOrderStatus.DELIVERED, PurchaseOrderStatus.COMPLETED].includes(po.status);
                            
                            return (
                              <TableRow 
                                key={po.id} 
                                className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                              >
                                <TableCell>
                                  <Checkbox 
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedPOs([...selectedPOs, po.id]);
                                      } else {
                                        setSelectedPOs(selectedPOs.filter(id => id !== po.id));
                                      }
                                    }}
                                  />
                                </TableCell>
                                
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-2">
                                      {po.poNumber}
                                      {po.isUrgent && (
                                        <Badge variant="destructive" className="px-1 py-0 text-xs">
                                          <Zap className="h-3 w-3" />
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{po.department}</div>
                                    {po.project && (
                                      <div className="text-xs text-blue-600">Project: {po.project}</div>
                                    )}
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium">{po.vendorName}</div>
                                    {po.vendorGstin && (
                                      <div className="text-sm text-muted-foreground">GSTIN: {po.vendorGstin}</div>
                                    )}
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="space-y-2">
                                    <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color}`}>
                                      {statusDisplay.label}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full ${
                                        po.priority === 'urgent' ? 'bg-red-500' :
                                        po.priority === 'high' ? 'bg-orange-500' :
                                        po.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}></div>
                                      <span className="text-xs capitalize">{po.priority}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      Created: {new Date(po.poDate).toLocaleDateString()}
                                    </div>
                                    <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                      Expected: {po.expectedDeliveryDate 
                                        ? new Date(po.expectedDeliveryDate).toLocaleDateString()
                                        : 'Not set'
                                      }
                                      {isOverdue && (
                                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium">₹{po.totalEstimatedAmount.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {po.items.length} item{po.items.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  {renderStatusActions(po)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Approvals ({stats.pendingApproval})
                </CardTitle>
                <CardDescription>Purchase orders requiring your attention and approval</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.pendingApproval === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-medium text-muted-foreground mb-2">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                      No purchase orders pending approval at this time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPOs
                      .filter(po => po.status === PurchaseOrderStatus.PENDING_APPROVAL)
                      .map(po => (
                        <Card key={po.id} className="border border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-medium">{po.poNumber}</h4>
                                  <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                                    Pending Approval
                                  </Badge>
                                  {po.priority === 'urgent' && (
                                    <Badge variant="destructive">Urgent</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Vendor: {po.vendorName} | Amount: ₹{po.totalEstimatedAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted: {new Date(po.lastModified).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSelectedPO(po)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                                {renderStatusActions(po)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-8 text-sm">{day}</span>
                        <Progress value={stats.weeklyTrend[index] || 0} className="flex-1" />
                        <span className="w-8 text-sm">{stats.weeklyTrend[index] || 0}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">On-time Delivery Rate</span>
                        <span className="text-sm font-medium">{stats.onTimeDeliveryRate}%</span>
                      </div>
                      <Progress value={stats.onTimeDeliveryRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Vendor Performance</span>
                        <span className="text-sm font-medium">{stats.vendorPerformanceScore}%</span>
                      </div>
                      <Progress value={stats.vendorPerformanceScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Compliance Score</span>
                        <span className="text-sm font-medium">{stats.complianceScore}%</span>
                      </div>
                      <Progress value={stats.complianceScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Budget Utilization</span>
                        <span className="text-sm font-medium">{stats.budgetUtilization}%</span>
                      </div>
                      <Progress value={stats.budgetUtilization} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation & Preferences
                </CardTitle>
                <CardDescription>Configure automation rules and display preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Notification Preferences</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications for approvals</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push notifications for urgent POs</span>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly summary reports</span>
                      <Checkbox />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Purchase Order Dialog - Production Ready Design */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
            {/* Header with Progress - Fixed */}
            <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex-shrink-0">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Create New Purchase Order
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Fill in the details below to create a new purchase order
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>
            
            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-8">
                  
                  {/* Essential Information Card */}
                  <Card className="shadow-sm border-0 bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Essential Information</CardTitle>
                      </div>
                      <CardDescription>Core details for your purchase order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* PO Number with Generation */}
                        <div className="space-y-2">
                          <Label htmlFor="po_number" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Building className="h-4 w-4" />
                            PO Number *
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="po_number"
                              value={createForm.po_number}
                              onChange={(e) => setCreateForm(prev => ({ ...prev, po_number: e.target.value }))}
                              placeholder="PO/2024/01/0001"
                              className={`font-mono ${createFormErrors.po_number ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newPONumber = generatePONumber();
                                setCreateForm(prev => ({ ...prev, po_number: newPONumber }));
                              }}
                              className="px-3"
                              title="Generate new PO number"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          {createFormErrors.po_number && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-3 w-3" />
                              <p className="text-xs">{createFormErrors.po_number}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Vendor Selection with Add New */}
                        <div className="space-y-2">
                          <Label htmlFor="vendor_id" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="h-4 w-4" />
                            Vendor *
                          </Label>
                          <div className="flex gap-2">
                            <Select 
                              id="vendor_id"
                              value={createForm.vendor_id} 
                              onValueChange={(value) => setCreateForm(prev => ({ ...prev, vendor_id: value }))}
                            >
                              <SelectTrigger className={`${createFormErrors.vendor_id ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                                <SelectValue placeholder="Choose vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                {vendors.length === 0 ? (
                                  <SelectItem value="no-vendors" disabled>
                                    No vendors available
                                  </SelectItem>
                                ) : (
                                  vendors.map(vendor => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                          <span className="text-xs font-medium text-blue-600">
                                            {vendor.business_name.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        {vendor.business_name}
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="px-3"
                              title="Add new vendor"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {createFormErrors.vendor_id && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-3 w-3" />
                              <p className="text-xs">{createFormErrors.vendor_id}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Priority Level */}
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Zap className="h-4 w-4" />
                            Priority Level
                          </Label>
                          <Select 
                            id="priority"
                            value={createForm.priority || 'medium'} 
                            onValueChange={(value) => setCreateForm(prev => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Low Priority
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  Medium Priority
                                </div>
                              </SelectItem>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  High Priority
                                </div>
                              </SelectItem>
                              <SelectItem value="urgent">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                  Urgent
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Dates */}
                        <div className="space-y-2">
                          <Label htmlFor="po_date" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Calendar className="h-4 w-4" />
                            PO Date *
                          </Label>
                          <Input
                            id="po_date"
                            type="date"
                            value={createForm.po_date}
                            onChange={(e) => setCreateForm(prev => ({ ...prev, po_date: e.target.value }))}
                            className={`${createFormErrors.po_date ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                          />
                          {createFormErrors.po_date && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-3 w-3" />
                              <p className="text-xs">{createFormErrors.po_date}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expected_delivery_date" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Package className="h-4 w-4" />
                            Expected Delivery Date
                          </Label>
                          <Input
                            id="expected_delivery_date"
                            type="date"
                            value={createForm.expected_delivery_date}
                            onChange={(e) => setCreateForm(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                            className="border-gray-300 focus:border-blue-500"
                            min={createForm.po_date}
                          />
                        </div>
                      </div>
                      
                      {/* Delivery Address */}
                      <div className="space-y-2">
                        <Label htmlFor="delivery_address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin className="h-4 w-4" />
                          Delivery Address *
                        </Label>
                        <Textarea
                          id="delivery_address"
                          value={createForm.delivery_address}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, delivery_address: e.target.value }))}
                          placeholder="Enter complete delivery address including postal code"
                          className={`resize-none ${createFormErrors.delivery_address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                          rows={3}
                        />
                        {createFormErrors.delivery_address && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            <p className="text-xs">{createFormErrors.delivery_address}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              
                  {/* Line Items Card */}
                  <Card className="shadow-sm border-0 bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">Line Items</CardTitle>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addLineItem}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                      <CardDescription>Add items you want to purchase</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {createFormErrors.line_items && (
                        <div className="flex items-center gap-1 text-red-600 bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm">{createFormErrors.line_items}</p>
                        </div>
                      )}
                      
                      {createForm.line_items.length > 0 ? (
                        <div className="space-y-4">
                          {createForm.line_items.map((item, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLineItem(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Item Description */}
                                <div className="md:col-span-2 space-y-2">
                                  <Label htmlFor={`item_description_${index}`} className="text-sm font-medium text-gray-700">
                                    Item Description *
                                  </Label>
                                  <Input
                                    id={`item_description_${index}`}
                                    value={item.item_description}
                                    onChange={(e) => updateLineItem(index, 'item_description', e.target.value)}
                                    placeholder="Enter item description"
                                    className={`${createFormErrors[`line_item_${index}_description`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && item.item_description && item.quantity && item.unit_price) {
                                        e.preventDefault();
                                        addLineItem();
                                      }
                                    }}
                                  />
                                  {createFormErrors[`line_item_${index}_description`] && (
                                    <div className="flex items-center gap-1 text-red-600">
                                      <AlertCircle className="h-3 w-3" />
                                      <p className="text-xs">{createFormErrors[`line_item_${index}_description`]}</p>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Quantity and Unit */}
                                <div className="space-y-2">
                                  <Label htmlFor={`quantity_${index}`} className="text-sm font-medium text-gray-700">
                                    Quantity & Unit *
                                  </Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`quantity_${index}`}
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                                      min="1"
                                      placeholder="Qty"
                                      className={`w-20 ${createFormErrors[`line_item_${index}_quantity`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && item.item_description && item.quantity && item.unit_price) {
                                          e.preventDefault();
                                          addLineItem();
                                        }
                                      }}
                                    />
                                    <Select 
                                      id={`unit_${index}`}
                                      value={item.unit} 
                                      onValueChange={(value) => updateLineItem(index, 'unit', value)}
                                    >
                                      <SelectTrigger className="w-16 border-gray-300 focus:border-blue-500">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pcs">PCS</SelectItem>
                                        <SelectItem value="kg">KG</SelectItem>
                                        <SelectItem value="ltr">LTR</SelectItem>
                                        <SelectItem value="mtr">MTR</SelectItem>
                                        <SelectItem value="box">BOX</SelectItem>
                                        <SelectItem value="set">SET</SelectItem>
                                        <SelectItem value="sqft">SQFT</SelectItem>
                                        <SelectItem value="pack">PACK</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {createFormErrors[`line_item_${index}_quantity`] && (
                                    <div className="flex items-center gap-1 text-red-600">
                                      <AlertCircle className="h-3 w-3" />
                                      <p className="text-xs">{createFormErrors[`line_item_${index}_quantity`]}</p>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Unit Price */}
                                <div className="space-y-2">
                                  <Label htmlFor={`unit_price_${index}`} className="text-sm font-medium text-gray-700">
                                    Unit Price *
                                  </Label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                    <Input
                                      id={`unit_price_${index}`}
                                      type="number"
                                      value={item.unit_price}
                                      onChange={(e) => updateLineItem(index, 'unit_price', Number(e.target.value))}
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      className={`pl-8 ${createFormErrors[`line_item_${index}_price`] ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && item.item_description && item.quantity && item.unit_price) {
                                          e.preventDefault();
                                          addLineItem();
                                        }
                                      }}
                                    />
                                  </div>
                                  {createFormErrors[`line_item_${index}_price`] && (
                                    <div className="flex items-center gap-1 text-red-600">
                                      <AlertCircle className="h-3 w-3" />
                                      <p className="text-xs">{createFormErrors[`line_item_${index}_price`]}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Total Amount */}
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Total Amount:</span>
                                  <span className="text-lg font-semibold text-blue-600">₹{item.total_amount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Overall Total */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="text-sm text-gray-600">
                                  {createForm.line_items.length} item{createForm.line_items.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-700">Grand Total</div>
                                <div className="text-2xl font-bold text-blue-600">
                                  ₹{createForm.line_items.reduce((sum, item) => sum + item.total_amount, 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No items added yet</h3>
                          <p className="text-gray-500 mb-6">Use the "Add Item" button above to get started with your purchase order</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
              
                  {/* Additional Information Card */}
                  <Card className="shadow-sm border-0 bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Additional Information</CardTitle>
                      </div>
                      <CardDescription>Terms, conditions, and additional notes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="terms_and_conditions" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Shield className="h-4 w-4" />
                            Terms and Conditions
                          </Label>
                          <Textarea
                            id="terms_and_conditions"
                            value={createForm.terms_and_conditions}
                            onChange={(e) => setCreateForm(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                            placeholder="Enter terms and conditions for this purchase order"
                            rows={4}
                            className="resize-none border-gray-300 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MessageSquare className="h-4 w-4" />
                            Notes & Remarks
                          </Label>
                          <Textarea
                            id="notes"
                            value={createForm.notes}
                            onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes, special instructions, or remarks"
                            rows={4}
                            className="resize-none border-gray-300 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Fixed Footer with Actions */}
              <div className="border-t bg-white p-6 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {createForm.line_items.length > 0 && (
                        <span>
                          Total: <span className="font-semibold text-blue-600">₹{createForm.line_items.reduce((sum, item) => sum + item.total_amount, 0).toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateDialog(false);
                          setCreateFormErrors({});
                        }}
                        disabled={isCreating}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                      
                      <Button 
                        onClick={handleCreatePO}
                        disabled={isCreating || createForm.line_items.length === 0}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Create Purchase Order
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </DialogContent>
        </Dialog>

        {/* PO Details Dialog */}
        {selectedPO && (
          <Dialog open={!!selectedPO} onOpenChange={() => setSelectedPO(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Purchase Order Details - {selectedPO.poNumber}</DialogTitle>
                <DialogDescription>
                  Complete information for purchase order {selectedPO.poNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Vendor</Label>
                    <p className="text-sm">{selectedPO.vendorName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={`${getStatusDisplay(selectedPO.status).bgColor} ${getStatusDisplay(selectedPO.status).color}`}>
                      {getStatusDisplay(selectedPO.status).label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">PO Date</Label>
                    <p className="text-sm">{new Date(selectedPO.poDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expected Delivery</Label>
                    <p className="text-sm">{selectedPO.expectedDeliveryDate ? new Date(selectedPO.expectedDeliveryDate).toLocaleDateString() : 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="text-lg font-semibold">₹{selectedPO.totalEstimatedAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Badge variant={selectedPO.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {selectedPO.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Items</Label>
                  <div className="mt-2 border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPO.items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemDescription}</TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>₹{item.estimatedRate.toLocaleString()}</TableCell>
                            <TableCell>₹{item.totalEstimatedAmount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedPO(null)}>
                    Close
                  </Button>
                  {renderStatusActions(selectedPO)}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrdersEnhanced;