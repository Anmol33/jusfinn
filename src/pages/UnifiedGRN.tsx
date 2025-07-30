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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
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
  Save,
  Truck,
  DollarSign,
  Users
} from 'lucide-react';

// Backend API Integration
import { 
  GRNApiService,
  type GRN as ApiGRN,
  type GRNCreateRequest,
  type POAvailableItems,
  GRNStatus
} from '@/lib/grn.api';
import { 
  PurchaseOrderApiService,
  type PurchaseOrder as ApiPurchaseOrder 
} from '@/lib/purchaseOrder.api';
import { 
  VendorApiService,
  type Vendor as ApiVendor 
} from '@/lib/vendor.api';

// Enhanced interfaces aligned with new API
interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  vendorName: string;
  warehouseLocation: string;
  receivedDate: string;
  receivedBy: string;
  status: GRNStatus;
  totalOrderedQuantity: number;
  totalReceivedQuantity: number;
  totalRejectedQuantity: number;
  items: GRNItemDisplay[];
  deliveryNoteNumber?: string;
  vehicleNumber?: string;
  driverName?: string;
  generalNotes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  complianceStatus: number;
  riskScore: number;
}

interface GRNItemDisplay {
  id: string;
  poItemId: string;
  itemDescription: string;
  unit: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
  totalAmount: number;
  rejectionReason?: string;
  notes?: string;
}

interface GRNFormData {
  grnNumber: string;
  purchase_order_id: string;
  received_date: string;
  received_by: string;
  warehouse_location: string;
  delivery_note_number: string;
  vehicle_number: string;
  driver_name: string;
  general_notes: string;
  items: GRNItemForm[];
}

interface GRNItemForm {
  po_item_id: string;
  item_description: string;
  ordered_quantity: number;
  received_quantity: number;
  rejected_quantity: number;
  rejection_reason: string;
  unit_price: number;
  unit: string;
  notes: string;
}

interface FilterState {
  search: string;
  status: string;
  vendor: string;
  po: string;  // Added PO filter
}

interface GRNStats {
  total: number;
  draft: number;
  billed: number;
  approved: number; // Legacy - keeping for compatibility
  rejected: number; // Legacy - keeping for compatibility
  completed: number;
  thisMonthCount: number;
  totalValue: number;
  averageValue: number;
  complianceScore: number;
  riskDistribution: { low: number; medium: number; high: number };
}

// Helper function to map API GRN to frontend interface
const mapApiGRNToFrontend = (apiGRN: ApiGRN, vendors: ApiVendor[] = []): GoodsReceiptNote => {
  const vendor = vendors.find(v => v.business_name === apiGRN.vendor_name);
  
  const acceptedQuantity = apiGRN.total_received_quantity - (apiGRN.total_rejected_quantity || 0);
  const complianceScore = apiGRN.total_rejected_quantity > 0 ? 
    Math.max(0, 100 - (apiGRN.total_rejected_quantity / apiGRN.total_received_quantity) * 100) : 100;
  
  return {
    id: apiGRN.id,
    grnNumber: apiGRN.grn_number,
    poId: apiGRN.po_id,
    poNumber: apiGRN.po_number,
    vendorName: apiGRN.vendor_name,
    warehouseLocation: apiGRN.warehouse_location,
    receivedDate: apiGRN.received_date,
    receivedBy: apiGRN.received_by,
    status: apiGRN.status as GRNStatus,
    totalOrderedQuantity: apiGRN.total_ordered_quantity,
    totalReceivedQuantity: apiGRN.total_received_quantity,
    totalRejectedQuantity: apiGRN.total_rejected_quantity || 0,
    items: (apiGRN.items || []).map(item => ({
      id: (item as any).id || `${apiGRN.id}-${item.po_item_id}`,
      poItemId: item.po_item_id,
      itemDescription: item.item_description,
      unit: (item as any).unit || 'PCS',
      orderedQuantity: (item as any).ordered_quantity || 0,
      receivedQuantity: item.received_quantity || 0,
      rejectedQuantity: item.rejected_quantity || 0,
      unitPrice: item.unit_price,
      totalAmount: (item.received_quantity || 0) * (item.unit_price || 0),
      rejectionReason: item.rejection_reason,
      notes: item.notes
    })),
    deliveryNoteNumber: apiGRN.delivery_note_number,
    vehicleNumber: apiGRN.vehicle_number,
    driverName: apiGRN.driver_name,
    generalNotes: apiGRN.general_notes,
    createdBy: apiGRN.created_by,
    createdAt: apiGRN.created_at,
    updatedAt: apiGRN.updated_at,
    complianceStatus: complianceScore,
    riskScore: Math.round(100 - complianceScore)
  };
};

const UnifiedGRN = () => {
  const { toast } = useToast();
  
  // Main state
  const [grns, setGRNs] = useState<GoodsReceiptNote[]>([]);
  const [filteredGRNs, setFilteredGRNs] = useState<GoodsReceiptNote[]>([]);
  const [vendors, setVendors] = useState<ApiVendor[]>([]);
  const [eligiblePOs, setEligiblePOs] = useState<ApiPurchaseOrder[]>([]);
  const [selectedGRNs, setSelectedGRNs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [submitting, setSubmitting] = useState(false);

  // Stats state
  const [stats, setStats] = useState<GRNStats>({
    total: 0,
    draft: 0,
    billed: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    thisMonthCount: 0,
    totalValue: 0,
    averageValue: 0,
    complianceScore: 95,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  });

  // Filter and UI state
  const [activeTab, setActiveTab] = useState('list');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    vendor: 'all',
    po: 'all'  // Added PO filter
  });

  // Dialog states
  const [showGRNForm, setShowGRNForm] = useState(false);
  const [showGRNDetails, setShowGRNDetails] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceiptNote | null>(null);
  const [editingGRN, setEditingGRN] = useState<GoodsReceiptNote | null>(null);

  // Form state
  const [formData, setFormData] = useState<GRNFormData>({
    grnNumber: '',
    purchase_order_id: '',
    received_date: new Date().toISOString().split('T')[0],
    received_by: '',
    warehouse_location: '',
    delivery_note_number: '',
    vehicle_number: '',
    driver_name: '',
    general_notes: '',
    items: []
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Data loading functions
  const loadGRNs = useCallback(async () => {
    try {
      console.log('🔍 Loading GRNs...');
      const apiGRNs: ApiGRN[] = await GRNApiService.getGRNs();
      console.log('📦 Raw API GRNs:', apiGRNs);
      const mappedGRNs = apiGRNs.map(apiGRN => mapApiGRNToFrontend(apiGRN));
      console.log('🔄 Mapped GRNs:', mappedGRNs);
      setGRNs(mappedGRNs);
      
      // Calculate stats
      setStats({
        total: mappedGRNs.length,
        draft: mappedGRNs.filter(g => g.status === GRNStatus.DRAFT).length,
        billed: mappedGRNs.filter(g => g.status === GRNStatus.BILLED).length,
        approved: 0, // Remove old status
        rejected: 0, // Remove old status
        completed: mappedGRNs.filter(g => g.status === GRNStatus.COMPLETED).length,
        thisMonthCount: mappedGRNs.filter(g => 
          new Date(g.createdAt).getMonth() === new Date().getMonth()
        ).length,
        totalValue: mappedGRNs.reduce((sum, grn) => sum + grn.items.reduce((itemSum, item) => itemSum + item.totalAmount, 0), 0),
        averageValue: mappedGRNs.length > 0 ? 
          mappedGRNs.reduce((sum, grn) => sum + grn.items.reduce((itemSum, item) => itemSum + item.totalAmount, 0), 0) / mappedGRNs.length : 0,
        complianceScore: mappedGRNs.length > 0 ?
          mappedGRNs.reduce((sum, grn) => sum + grn.complianceStatus, 0) / mappedGRNs.length : 95,
        riskDistribution: { low: 0, medium: 0, high: 0 } // Simplified
      });
      console.log('✅ GRNs loaded successfully, count:', mappedGRNs.length);
      
    } catch (error) {
      console.error('❌ Error loading GRNs:', error);
      throw error; // Let parent handle the error
    }
  }, []);

  const loadVendors = useCallback(async () => {
    try {
      const vendorData = await VendorApiService.getVendors(0, 100);
      setVendors(vendorData);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadEligiblePOs = useCallback(async () => {
    try {
      const pos = await PurchaseOrderApiService.getPurchaseOrders(0, 100, 'approved');
      setEligiblePOs(pos);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load PO items when PO is selected
  const loadPOItems = useCallback(async (poId: string) => {
    try {
      setSubmitting(true);
      const poAvailableItems: POAvailableItems = await GRNApiService.getPOAvailableItems(poId);
      
      const formItems: GRNItemForm[] = poAvailableItems.items.map(item => ({
        po_item_id: item.id,
        item_description: item.item_description,
        ordered_quantity: item.ordered_quantity,  // Fix: use ordered_quantity from backend
        received_quantity: item.pending_quantity, // Default to pending quantity
        rejected_quantity: 0, // Initialize as 0, will auto-calculate
        unit_price: item.unit_price,
        unit: item.unit,  // Add missing unit field
        rejection_reason: '',
        notes: ''
      }));

      setFormData(prev => ({ 
        ...prev, 
        items: formItems,
        grnNumber: `GRN-${Date.now()}` // Auto-generate GRN number
      }));

      toast({
        title: "Success",
        description: `Loaded ${formItems.length} items from PO`,
      });
    } catch (error) {
      console.error('Error loading PO items:', error);
      toast({
        title: "Error",
        description: "Failed to load PO items",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }, [toast]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.purchase_order_id) errors.purchase_order_id = 'Purchase Order is required';
    if (!formData.received_date) errors.received_date = 'Receipt date is required';
    if (!formData.received_by) errors.received_by = 'Received by is required';
    if (!formData.warehouse_location) errors.warehouse_location = 'Warehouse location is required';
    if (formData.items.length === 0) errors.items = 'At least one item is required';

    // Validate item quantities
    const itemErrors: string[] = [];
    formData.items.forEach((item, index) => {
      const totalProcessed = item.received_quantity + item.rejected_quantity;
      if (totalProcessed > item.ordered_quantity) {
        itemErrors.push(`Item ${index + 1}: Received + Rejected (${totalProcessed}) cannot exceed Ordered (${item.ordered_quantity})`);
      }
      if (item.received_quantity < 0) {
        itemErrors.push(`Item ${index + 1}: Received quantity cannot be negative`);
      }
      if (item.rejected_quantity < 0) {
        itemErrors.push(`Item ${index + 1}: Rejected quantity cannot be negative`);
      }
    });

    if (itemErrors.length > 0) {
      errors.items = itemErrors.join('; ');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmitGRN = async (status: 'draft' | 'completed') => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const grnRequest: GRNCreateRequest = {
        po_id: formData.purchase_order_id,
        grn_number: formData.grnNumber || undefined,
        received_date: new Date(formData.received_date).toISOString(),
        received_by: formData.received_by,
        warehouse_location: formData.warehouse_location,
        items: formData.items.map(item => ({
          po_item_id: item.po_item_id,
          item_description: item.item_description,
          ordered_quantity: item.ordered_quantity,
          received_quantity: item.received_quantity,
          rejected_quantity: item.rejected_quantity || 0,
          rejection_reason: item.rejection_reason || '',
          unit_price: item.unit_price,
          unit: item.unit,
          notes: item.notes || ''
        })) as any,
        delivery_note_number: formData.delivery_note_number,
        vehicle_number: formData.vehicle_number,
        driver_name: formData.driver_name,
        general_notes: formData.general_notes,
        status: status === 'draft' ? GRNStatus.DRAFT : GRNStatus.COMPLETED
      };

      if (editingGRN) {
        await GRNApiService.updateGRN(editingGRN.id, grnRequest);
        toast({
          title: "Success",
          description: "GRN updated successfully",
        });
      } else {
        await GRNApiService.createGRN(grnRequest);
        toast({
          title: "Success",
          description: `GRN ${status === 'draft' ? 'saved as draft' : 'completed'} successfully`,
        });
      }
      
      // Dispatch event to notify other components (like PO list) to refresh
      if (status === 'completed') {
        window.dispatchEvent(new CustomEvent('grn-completed'));
      } else {
        window.dispatchEvent(new CustomEvent('grn-updated'));
      }

      setShowGRNForm(false);
      resetForm();
      await loadGRNs();
    } catch (error) {
      console.error('Error saving GRN:', error);
      toast({
        title: "Error",
        description: "Failed to save GRN. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      grnNumber: '',
      purchase_order_id: '',
      received_date: new Date().toISOString().split('T')[0],
      received_by: '',
      warehouse_location: '',
      delivery_note_number: '',
      vehicle_number: '',
      driver_name: '',
      general_notes: '',
      items: []
    });
    setFormErrors({});
    setEditingGRN(null);
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    console.log('🔍 Applying filters. GRNs count:', grns.length, 'Filters:', filters);
    let filtered = grns;

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(grn =>
        grn.grnNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        grn.poNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        grn.vendorName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(grn => grn.status === filters.status);
    }

    // Filter by vendor
    if (filters.vendor !== 'all') {
      filtered = filtered.filter(grn => grn.vendorName === filters.vendor);
    }

    // Filter by PO
    if (filters.po && filters.po !== 'all') {
      filtered = filtered.filter(grn => grn.poId === filters.po);
    }

    console.log('🎯 Filtered GRNs count:', filtered.length);
    setFilteredGRNs(filtered);
  }, [grns, filters]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🚀 Starting initial data load...');
        
        // Load all initial data concurrently
        await Promise.all([
          loadGRNs(),
          loadVendors(),
          loadEligiblePOs()
        ]);

        // Handle URL parameters for navigation from PO page
        const urlParams = new URLSearchParams(window.location.search);
        const createForPO = urlParams.get('create_for_po');
        const filterPO = urlParams.get('filter_po');
        
        if (createForPO) {
          console.log(`🔗 Creating GRN for PO: ${createForPO}`);
          // Pre-select the PO and open creation form
          setFormData(prev => ({ ...prev, purchase_order_id: createForPO }));
          setShowGRNForm(true);
          // Load items for this PO
          await loadPOItems(createForPO);
        }
        
        if (filterPO) {
          console.log(`🔍 Filtering GRNs for PO: ${filterPO}`);
          // Apply PO filter
          setFilters(prev => ({ ...prev, po: filterPO }));
        }
        
        console.log('✅ Initial data load completed');
        
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Helper functions for UI
  const getStatusBadge = (status: GRNStatus) => {
    const statusMap = {
      [GRNStatus.DRAFT]: { color: 'bg-yellow-100 text-yellow-700', label: 'Draft' },
      [GRNStatus.COMPLETED]: { color: 'bg-green-100 text-green-700', label: 'Completed' },
      [GRNStatus.BILLED]: { color: 'bg-blue-100 text-blue-700', label: 'Billed' },
      [GRNStatus.CANCELLED]: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-700', label: 'Unknown' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusStyle = (status: GRNStatus) => {
    const statusMap = {
      [GRNStatus.DRAFT]: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
      [GRNStatus.COMPLETED]: { color: 'bg-blue-100 text-blue-700', label: 'Completed' },
      [GRNStatus.BILLED]: { color: 'bg-green-100 text-green-700', label: 'Billed' },
      [GRNStatus.CANCELLED]: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    return statusMap[status] || { color: 'bg-gray-100 text-gray-700', label: 'Unknown' };
  };

  // Edit GRN handler - populate form with existing data
  const handleEditGRN = async (grn: GoodsReceiptNote) => {
    try {
      setEditingGRN(grn);
      
      // Populate form with existing GRN data
      setFormData({
        grnNumber: grn.grnNumber,
        purchase_order_id: grn.poId,
        received_date: new Date(grn.receivedDate).toISOString().split('T')[0],
        received_by: grn.receivedBy,
        warehouse_location: grn.warehouseLocation,
        delivery_note_number: grn.deliveryNoteNumber || '',
        vehicle_number: grn.vehicleNumber || '',
        driver_name: grn.driverName || '',
        general_notes: grn.generalNotes || '',
        items: grn.items.map(item => ({
          po_item_id: item.poItemId,
          item_description: item.itemDescription,
          ordered_quantity: item.orderedQuantity,
          received_quantity: item.receivedQuantity,
          rejected_quantity: item.rejectedQuantity,
          rejection_reason: item.rejectionReason || '',
          unit_price: item.unitPrice,
          unit: item.unit || 'pcs',
          notes: ''
        }))
      });
      
      setShowGRNForm(true);
      
      toast({
        title: "Edit Mode",
        description: "Form populated with existing GRN data",
      });
    } catch (error) {
      console.error('Error setting up edit:', error);
      toast({
        title: "Error",
        description: "Failed to load GRN for editing",
        variant: "destructive",
      });
    }
  };

  // Cancel GRN handler
  const handleCancelGRN = async (grnId: string) => {
    try {
      setSubmitting(true);
      await GRNApiService.cancelGRN(grnId);
      
      toast({
        title: "Success",
        description: "GRN cancelled successfully",
      });
      
      setShowGRNDetails(false);
      await loadGRNs();
    } catch (error) {
      console.error('Error cancelling GRN:', error);
      toast({
        title: "Error",
        description: "Failed to cancel GRN",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Goods Receipt Notes - JusFinn</title>
        <meta name="description" content="Comprehensive GRN management with workflow automation and three-way matching" />
      </Helmet>

              <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Goods Receipt Notes</h1>
              <p className="text-muted-foreground">
                Manage and track your goods receipt process
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("analytics")}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowGRNForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create GRN
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total GRNs</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                        <p className="text-xs text-blue-600 mt-1">This month: {stats.thisMonthCount}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Completed</p>
                        <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                        <p className="text-xs text-green-600 mt-1">Fully processed</p>
                      </div>
                      <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold text-purple-900">₹{(stats.totalValue / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-purple-600 mt-1">Avg: ₹{(stats.averageValue / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Draft GRNs</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Can be edited</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">GRN List</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* GRN List Tab */}
                <TabsContent value="list" className="space-y-6">
                  {/* Filters */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search GRNs..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                        
                        <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="billed">Billed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={filters.vendor} onValueChange={(value) => setFilters(prev => ({ ...prev, vendor: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by Vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Vendors</SelectItem>
                            {vendors.map((vendor) => (
                              <SelectItem key={vendor.id} value={vendor.business_name}>
                                {vendor.business_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select value={filters.po} onValueChange={(value) => setFilters(prev => ({ ...prev, po: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by PO" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All POs</SelectItem>
                            {eligiblePOs.map((po) => (
                              <SelectItem key={po.id} value={po.po_number}>
                                {po.po_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {activeTab === 'list' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>GRN List</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={selectedGRNs.length === filteredGRNs.length && filteredGRNs.length > 0}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedGRNs(filteredGRNs.map(grn => grn.id));
                                    } else {
                                      setSelectedGRNs([]);
                                    }
                                  }}
                                />
                              </TableHead>
                              <TableHead>GRN Number</TableHead>
                              <TableHead>PO Number</TableHead>
                              <TableHead>Vendor</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total Value</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                  <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                                    <span>Loading GRNs...</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : filteredGRNs.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={9} className="text-center py-8">
                                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No GRNs found</p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {filters.search || filters.status !== 'all' || filters.vendor !== 'all' || filters.po !== 'all'
                                      ? 'Try adjusting your filters' 
                                      : 'Create your first GRN to get started'}
                                  </p>
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredGRNs.map((grn) => (
                                <TableRow key={grn.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedGRNs.includes(grn.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedGRNs([...selectedGRNs, grn.id]);
                                        } else {
                                          setSelectedGRNs(selectedGRNs.filter(id => id !== grn.id));
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                                  <TableCell>{grn.poNumber}</TableCell>
                                  <TableCell>{grn.vendorName}</TableCell>
                                  <TableCell>{new Date(grn.receivedDate).toLocaleDateString()}</TableCell>
                                  <TableCell>{getStatusBadge(grn.status)}</TableCell>
                                  <TableCell>{grn.items.length}</TableCell>
                                  <TableCell>
                                    ₹{grn.items.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setSelectedGRN(grn);
                                          setShowGRNDetails(true);
                                        }}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      {grn.status === GRNStatus.DRAFT && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditGRN(grn)}
                                          >
                                            <Edit className="w-4 h-4" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCancelGRN(grn.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Compliance Metrics
                        </CardTitle>
                        <CardDescription>
                          GRN quality and compliance tracking
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Compliance</span>
                            <span className="font-medium">{stats.complianceScore.toFixed(1)}%</span>
                          </div>
                          <Progress value={stats.complianceScore} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>This Month GRNs</span>
                            <span className="font-medium">{stats.thisMonthCount}</span>
                          </div>
                          <Progress value={(stats.thisMonthCount / Math.max(stats.total, 1)) * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Risk Distribution
                        </CardTitle>
                        <CardDescription>
                          Current GRN risk assessment breakdown
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-400"></div>
                              <span className="text-sm">Low Risk</span>
                            </div>
                            <span className="font-medium">{stats.riskDistribution.low}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                              <span className="text-sm">Medium Risk</span>
                            </div>
                            <span className="font-medium">{stats.riskDistribution.medium}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <span className="text-sm">High Risk</span>
                            </div>
                            <span className="font-medium">{stats.riskDistribution.high}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent GRN Activity
                      </CardTitle>
                      <CardDescription>
                        Latest GRNs and their current status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-gray-600">Loading recent activity...</p>
                        </div>
                      ) : grns.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No GRNs found</p>
                          <p className="text-sm text-gray-500 mt-2">Create your first GRN to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {grns.slice(0, 5).map((grn) => (
                            <div key={grn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <div>
                                  <p className="font-medium">{grn.grnNumber}</p>
                                  <p className="text-sm text-gray-600">{grn.vendorName} • PO: {grn.poNumber}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(grn.status)}
                                <span className="text-sm text-gray-500">
                                  Qty: {grn.totalReceivedQuantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Create/Edit GRN Dialog */}
              <Dialog open={showGRNForm} onOpenChange={setShowGRNForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingGRN ? 'Edit GRN' : 'Create New GRN'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingGRN ? 'Update GRN details' : 'Create a new Goods Receipt Note from an approved Purchase Order'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grnNumber">GRN Number</Label>
                        <Input
                          id="grnNumber"
                          value={formData.grnNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, grnNumber: e.target.value }))}
                          placeholder="Auto-generated"
                          disabled={!!editingGRN}
                        />
                        {formErrors.grnNumber && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.grnNumber}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="purchaseOrderId">Purchase Order *</Label>
                        <Select 
                          value={formData.purchase_order_id} 
                          onValueChange={(value) => {
                            setFormData(prev => ({ ...prev, purchase_order_id: value, items: [] }));
                            if (value) {
                              loadPOItems(value);
                            }
                          }}
                          disabled={submitting || !!editingGRN}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={submitting ? "Loading items..." : "Select Purchase Order"} />
                          </SelectTrigger>
                          <SelectContent>
                            {eligiblePOs.length === 0 ? (
                              <SelectItem value="no-pos" disabled>
                                No eligible POs available
                              </SelectItem>
                            ) : (
                              eligiblePOs.map((po) => (
                                <SelectItem key={po.id} value={po.id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{po.po_number}</span>
                                    <span className="text-xs text-gray-500">
                                      Vendor: {vendors.find(v => v.id === po.vendor_id)?.business_name || 'Unknown'}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {formErrors.purchase_order_id && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.purchase_order_id}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="receiptDate">Date of Receipt *</Label>
                        <Input
                          id="receiptDate"
                          type="date"
                          value={formData.received_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, received_date: e.target.value }))}
                        />
                        {formErrors.received_date && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.received_date}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="receivedBy">Received By *</Label>
                        <Input
                          id="receivedBy"
                          value={formData.received_by}
                          onChange={(e) => setFormData(prev => ({ ...prev, received_by: e.target.value }))}
                          placeholder="Person who physically received the goods"
                        />
                        {formErrors.received_by && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.received_by}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="warehouseLocation">Warehouse/Storage Location *</Label>
                        <Input
                          id="warehouseLocation"
                          value={formData.warehouse_location}
                          onChange={(e) => setFormData(prev => ({ ...prev, warehouse_location: e.target.value }))}
                          placeholder="Specific godown or storage location"
                        />
                        {formErrors.warehouse_location && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.warehouse_location}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="deliveryNoteNumber">Delivery Note Number</Label>
                        <Input
                          id="deliveryNoteNumber"
                          value={formData.delivery_note_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, delivery_note_number: e.target.value }))}
                          placeholder="Vendor's delivery document number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                        <Input
                          id="vehicleNumber"
                          value={formData.vehicle_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                          placeholder="Enter vehicle number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input
                          id="driverName"
                          value={formData.driver_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
                          placeholder="Driver's name"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="generalNotes">General Notes / Remarks</Label>
                      <Textarea
                        id="generalNotes"
                        value={formData.general_notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, general_notes: e.target.value }))}
                        placeholder="Record any issues found during inspection..."
                        rows={3}
                      />
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Items to Receive</h3>
                      {formData.items.length > 0 ? (
                        <Card>
                          <CardContent className="p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item Description</TableHead>
                                  <TableHead>Unit</TableHead>
                                  <TableHead>Ordered Qty</TableHead>
                                  <TableHead>Received Qty</TableHead>
                                  <TableHead>Rejected Qty</TableHead>
                                  <TableHead>Unit Price</TableHead>
                                  <TableHead>Rejection Reason</TableHead>
                                  <TableHead>Total Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {formData.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.item_description}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.ordered_quantity}</TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.received_quantity}
                                        onChange={(e) => {
                                          const newItems = [...formData.items];
                                          const receivedQty = parseFloat(e.target.value) || 0;
                                          const orderedQty = newItems[index].ordered_quantity;
                                          
                                          // Auto-calculate rejected quantity
                                          const rejectedQty = Math.max(0, orderedQty - receivedQty);
                                          
                                          newItems[index].received_quantity = receivedQty;
                                          newItems[index].rejected_quantity = rejectedQty;
                                          
                                          setFormData(prev => ({ ...prev, items: newItems }));
                                        }}
                                        className="w-full"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.rejected_quantity}
                                        onChange={(e) => {
                                          const newItems = [...formData.items];
                                          const rejectedQty = parseFloat(e.target.value) || 0;
                                          const orderedQty = newItems[index].ordered_quantity;
                                          const maxRejected = orderedQty - newItems[index].received_quantity;
                                          
                                          // Validate rejected quantity doesn't exceed available
                                          if (rejectedQty <= maxRejected) {
                                            newItems[index].rejected_quantity = rejectedQty;
                                            setFormData(prev => ({ ...prev, items: newItems }));
                                          }
                                        }}
                                        className="w-full"
                                        disabled // Make it read-only since it's auto-calculated
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.unit_price}
                                        onChange={(e) => {
                                          const newItems = [...formData.items];
                                          newItems[index].unit_price = parseFloat(e.target.value) || 0;
                                          setFormData(prev => ({ ...prev, items: newItems }));
                                        }}
                                        placeholder="Unit price"
                                        className="w-full"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        type="text"
                                        value={item.rejection_reason}
                                        onChange={(e) => {
                                          const newItems = [...formData.items];
                                          newItems[index].rejection_reason = e.target.value;
                                          setFormData(prev => ({ ...prev, items: newItems }));
                                        }}
                                        placeholder="Reason for rejection (if any)"
                                        className="w-full"
                                      />
                                    </TableCell>
                                    <TableCell>₹{((item.received_quantity - item.rejected_quantity) * item.unit_price)?.toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ) : (
                        <p className="text-gray-500">No items loaded from the selected PO.</p>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="space-x-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        setShowGRNForm(false);
                        resetForm();
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => handleSubmitGRN('draft')}
                      disabled={submitting || !formData.purchase_order_id || formData.items.length === 0}
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
                    >
                      {submitting ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    
                    <Button 
                      type="button"
                      onClick={() => handleSubmitGRN('completed')}
                      disabled={submitting || !formData.purchase_order_id || formData.items.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? 'Completing...' : 'Complete GRN'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* GRN Details Dialog */}
              <Dialog open={showGRNDetails} onOpenChange={setShowGRNDetails}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>GRN Details - {selectedGRN?.grnNumber}</DialogTitle>
                    <DialogDescription>
                      Complete details and information for this GRN
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedGRN && (
                    <div className="space-y-6">
                      {/* Header Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Basic Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>GRN Number:</strong> {selectedGRN.grnNumber}</p>
                            <p><strong>PO Number:</strong> {selectedGRN.poNumber}</p>
                            <p><strong>Vendor:</strong> {selectedGRN.vendorName}</p>
                            <p><strong>Received Date:</strong> {new Date(selectedGRN.receivedDate).toLocaleDateString()}</p>
                            <p><strong>Received By:</strong> {selectedGRN.receivedBy}</p>
                            <p><strong>Warehouse:</strong> {selectedGRN.warehouseLocation}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Status & Compliance</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Status:</strong> {getStatusBadge(selectedGRN.status)}</p>
                            <p><strong>Compliance:</strong> <Badge className={selectedGRN.complianceStatus >= 95 ? 'bg-green-100 text-green-700' : selectedGRN.complianceStatus >= 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>{selectedGRN.complianceStatus >= 95 ? 'Compliant' : selectedGRN.complianceStatus >= 80 ? 'Warning' : 'Violation'}</Badge></p>
                            <p><strong>Risk Score:</strong> <span className={selectedGRN.riskScore < 20 ? 'text-green-600' : selectedGRN.riskScore < 50 ? 'text-yellow-600' : 'text-red-600'}>{selectedGRN.riskScore}%</span></p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Quantity Summary */}
                      <div>
                        <h4 className="font-semibold mb-2">Quantity Summary</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-sm text-gray-600">Total Ordered</p>
                              <p className="text-lg font-semibold">{selectedGRN.totalOrderedQuantity}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-sm text-gray-600">Total Received</p>
                              <p className="text-lg font-semibold text-green-600">{selectedGRN.totalReceivedQuantity}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-sm text-gray-600">Total Rejected</p>
                              <p className="text-lg font-semibold text-red-600">{selectedGRN.totalRejectedQuantity}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <Separator />

                      {/* Items */}
                      <div>
                        <h4 className="font-semibold mb-2">Line Items</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item Description</TableHead>
                              <TableHead>Ordered Qty</TableHead>
                              <TableHead>Received Qty</TableHead>
                              <TableHead>Rejected Qty</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Rejection Reason</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedGRN.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.itemDescription}</TableCell>
                                <TableCell>{item.orderedQuantity}</TableCell>
                                <TableCell>{item.receivedQuantity}</TableCell>
                                <TableCell>{item.rejectedQuantity}</TableCell>
                                <TableCell>₹{item.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                  {item.rejectionReason && (
                                    <span className="text-sm text-gray-600 italic">
                                      {item.rejectionReason}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {selectedGRN.generalNotes && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold mb-2">Notes</h4>
                            <p className="text-sm text-gray-600">{selectedGRN.generalNotes}</p>
                          </div>
                        </>
                      )}

                      {selectedGRN.status === GRNStatus.DRAFT && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={async () => {
                              try {
                                await GRNApiService.completeDraftGRN(selectedGRN.id);
                                toast({
                                  title: "Success",
                                  description: "GRN completed successfully",
                                });
                                setShowGRNDetails(false);
                                await loadGRNs();
                                // Notify other components to refresh
                                window.dispatchEvent(new CustomEvent('grn-completed'));
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to complete GRN",
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete GRN
                          </Button>
                          
                          {selectedGRN.status === GRNStatus.DRAFT && (
                            <Button 
                              onClick={() => {
                                handleEditGRN(selectedGRN);
                                setShowGRNDetails(false);
                              }}
                              variant="outline"
                            >
                              Edit GRN
                            </Button>
                          )}

                          <Button 
                            onClick={() => handleCancelGRN(selectedGRN.id)}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Cancel GRN
                          </Button>

                          <Button onClick={() => setShowGRNDetails(false)} variant="outline">
                            Close
                          </Button>
                        </div>
                      )}

                      {selectedGRN.status !== GRNStatus.DRAFT && (
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => setShowGRNDetails(false)} variant="outline">
                            Close
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
        </div>
      </div>
    );
  };
  
  export default UnifiedGRN;