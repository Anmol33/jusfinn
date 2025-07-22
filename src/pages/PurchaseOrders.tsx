import React, { useState, useEffect, useCallback } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  Calendar,
  MapPin,
  User,
  Building,
  FileText,
  Edit,
  Trash2,
  MessageSquare,
  Filter,
  Plus,
  Copy,
  Printer,
  Activity,
  Star,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Backend API Integration
import { 
  PurchaseExpenseApiService, 
  type PurchaseOrder as ApiPurchaseOrder, 
  type PurchaseOrderItem as ApiPurchaseOrderItem, 
  type Vendor as ApiVendor,
  type PurchaseOrderCreateRequest,
  type POLineItem,
  PurchaseOrderStatus
} from '@/lib/purchaseExpenseApi';

// Action Matrix Integration
import { 
  getStatusConfig, 
  getAvailableActions, 
  getStatusDisplay,
  type StatusAction
} from '@/lib/purchaseOrderActions';

// Simplified Purchase Order interface with single status
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorGstin?: string;
  poDate: string;
  expectedDeliveryDate: string;
  deliveryAddress: string;
  
  // Single Unified Status System
  status: PurchaseOrderStatus;
  
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  project?: string;
  budgetReference?: string;
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
}

interface PurchaseOrderItem {
  id: string;
  itemDescription: string;
  specifications?: string;
  quantity: number;
  unit: string;
  estimatedRate: number;
  totalEstimatedAmount: number;
  deliveryDate?: string;
  remarks?: string;
}

interface Vendor {
  id: string;
  name: string;
  gstin?: string;
  paymentTerms: number;
  category: string;
  rating: number;
}

interface POStats {
  total: number;
  draft: number;
  pendingApproval: number;
  approved: number;
  completed: number;
  totalValue: number;
  averageValue: number;
  budgetUtilization: number;
  monthlyTrend: number;
}

const PurchaseOrders = () => {
  const { toast } = useToast();
  
  // Function to generate PO number
  const generatePONumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-4);
    return `PO/${year}/${month}/${timestamp}`;
  };

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStatusGuide, setShowStatusGuide] = useState(false);
  const [newPO, setNewPO] = useState<Partial<PurchaseOrderCreateRequest & { 
    priority: string; 
    department: string; 
    project: string; 
    budgetReference: string; 
    paymentTerms: string; 
    deliveryTerms: string; 
  }>>({
    po_number: '',
    vendor_id: '',
    po_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    delivery_address: '',
    terms_and_conditions: 'Standard terms apply',
    notes: '',
    line_items: [],
    priority: 'medium',
    department: '',
    project: '',
    budgetReference: '',
    paymentTerms: '30 days from delivery',
    deliveryTerms: 'FOB Destination'
  });
  
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingPO, setDeletingPO] = useState<PurchaseOrder | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<PurchaseOrder[]>([]);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Simplified single status filter
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<POStats>({
    total: 0,
    draft: 0,
    pendingApproval: 0,
    approved: 0,
    completed: 0,
    totalValue: 0,
    averageValue: 0,
    budgetUtilization: 0,
    monthlyTrend: 0
  });

  // Convert backend status to frontend format
  const convertBackendStatus = (backendStatus: string): PurchaseOrderStatus => {
    const status = backendStatus.toLowerCase();
    // Handle both enum values and string representations
    switch (status) {
      case 'draft': return PurchaseOrderStatus.DRAFT;
      case 'pending_approval': return PurchaseOrderStatus.PENDING_APPROVAL;
      case 'approved': return PurchaseOrderStatus.APPROVED;
      case 'rejected': return PurchaseOrderStatus.REJECTED;
      case 'partially_delivered': return PurchaseOrderStatus.PARTIALLY_DELIVERED;
      case 'delivered': return PurchaseOrderStatus.DELIVERED;
      case 'completed': return PurchaseOrderStatus.COMPLETED;
      case 'cancelled': return PurchaseOrderStatus.CANCELLED;
      // Handle legacy statuses by mapping them to appropriate new statuses
      case 'in_progress': return PurchaseOrderStatus.APPROVED; // Map to approved
      case 'acknowledged': return PurchaseOrderStatus.APPROVED; // Map to approved
      case 'invoiced': return PurchaseOrderStatus.COMPLETED; // Map to completed
      default: return PurchaseOrderStatus.DRAFT;
    }
  };

  // Load purchase orders from backend
  const loadPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📋 Loading purchase orders from backend...');
      
      const backendPOs = await PurchaseExpenseApiService.getPurchaseOrders({
        skip: 0,
        limit: 100
      });
      
      console.log('📋 Loaded purchase orders:', backendPOs.length);
      
      // Convert backend POs to frontend format
      const frontendPOs: PurchaseOrder[] = backendPOs.map(po => ({
        id: po.id,
        poNumber: po.po_number,
        vendorId: po.vendor_id,
        vendorName: 'Unknown Vendor', // Would need vendor lookup
        vendorGstin: '',
        poDate: new Date(po.po_date).toISOString().split('T')[0],
        expectedDeliveryDate: po.expected_delivery_date ? new Date(po.expected_delivery_date).toISOString().split('T')[0] : '',
        deliveryAddress: po.delivery_address || '',
        status: convertBackendStatus(po.status), // Use single status
        priority: 'medium',
        department: 'General',
        project: '',
        budgetReference: '',
        termsAndConditions: po.terms_and_conditions || '',
        paymentTerms: '30 days',
        deliveryTerms: 'FOB',
        items: (po.line_items || []).map(item => ({
          id: item.id,
          itemDescription: item.item_description,
          specifications: '',
          quantity: item.quantity,
          unit: item.unit,
          estimatedRate: item.unit_price,
          totalEstimatedAmount: item.total_amount,
          deliveryDate: '',
          remarks: ''
        })),
        totalEstimatedAmount: po.total_amount,
        createdBy: 'System',
        createdDate: po.created_at,
        lastModified: po.updated_at,
        modifiedBy: 'System',
        notes: po.notes || ''
      }));
      
      setPurchaseOrders(frontendPOs);
      
      // Calculate simplified stats
      const newStats: POStats = {
        total: frontendPOs.length,
        draft: frontendPOs.filter(po => po.status === PurchaseOrderStatus.DRAFT).length,
        pendingApproval: frontendPOs.filter(po => po.status === PurchaseOrderStatus.PENDING_APPROVAL).length,
        approved: frontendPOs.filter(po => po.status === PurchaseOrderStatus.APPROVED).length,
        completed: frontendPOs.filter(po => [PurchaseOrderStatus.DELIVERED, PurchaseOrderStatus.COMPLETED].includes(po.status)).length,
        totalValue: frontendPOs.reduce((sum, po) => sum + po.totalEstimatedAmount, 0),
        averageValue: frontendPOs.length > 0 ? frontendPOs.reduce((sum, po) => sum + po.totalEstimatedAmount, 0) / frontendPOs.length : 0,
        budgetUtilization: 75,
        monthlyTrend: 12
      };
      setStats(newStats);
      
    } catch (error) {
      console.error('❌ Error loading from backend:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders from server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter POs based on search and status
  useEffect(() => {
    let filtered = purchaseOrders;
    
    if (searchTerm) {
      filtered = filtered.filter(po =>
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(po => po.status === statusFilter);
    }
    
    setFilteredPOs(filtered);
  }, [purchaseOrders, searchTerm, statusFilter]);

  // Load data on component mount
  useEffect(() => {
    loadPurchaseOrders();
  }, [loadPurchaseOrders]);

  // Handle edit purchase order
  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO(po);
    // You would typically open an edit dialog here
    toast({
      title: 'Edit Purchase Order',
      description: `Editing ${po.poNumber} - Edit functionality to be implemented`,
    });
  };

  // Handle status change actions with the new action matrix
  const handleStatusAction = async (poId: string, action: StatusAction) => {
    try {
      setLoading(true);
      
      let updatedStatus = action.nextStatus;
      
      switch (action.id) {
        case 'submit_approval':
          const response = await PurchaseExpenseApiService.submitPurchaseOrderForApproval(poId);
          updatedStatus = PurchaseOrderStatus.PENDING_APPROVAL;
          break;
          
        case 'approve':
          await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'approve');
          updatedStatus = PurchaseOrderStatus.APPROVED;
          break;
          
        case 'reject':
          await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'reject');
          updatedStatus = PurchaseOrderStatus.REJECTED;
          break;
          
        case 'request_changes':
          await PurchaseExpenseApiService.approvePurchaseOrder(poId, 'request_changes');
          updatedStatus = PurchaseOrderStatus.DRAFT;
          break;
          
        default:
          if (action.nextStatus) {
            await PurchaseExpenseApiService.updatePurchaseOrderStatus(poId, action.nextStatus);
            updatedStatus = action.nextStatus;
          }
          break;
      }
      
      if (updatedStatus) {
        const updatedPOs = purchaseOrders.map(po => 
          po.id === poId 
            ? { ...po, status: updatedStatus }
            : po
        );
        setPurchaseOrders(updatedPOs);
      }

      toast({
        title: 'Success',
        description: `${action.label} completed successfully`,
      });
    } catch (error) {
      console.error(`${action.label} error:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action.label.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render action dropdown (replacing confusing icons with clear labels)
  const renderStatusActions = (po: PurchaseOrder) => {
    const availableActions = getAvailableActions(po.status, []);
    
    if (availableActions.length === 0) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedPO(po)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Available Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {availableActions.map((action) => {
            const IconComponent = getIconComponent(action.icon);
            
            if (action.requiresConfirmation) {
              return (
                <AlertDialog key={action.id}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <IconComponent className="h-4 w-4 mr-2" />
                      {action.label}
                      <span className="ml-auto text-xs text-muted-foreground">⚠️</span>
                    </DropdownMenuItem>
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
                        onClick={() => handleStatusAction(po.id, action)}
                      >
                        {action.label}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }
            
            return (
              <DropdownMenuItem 
                key={action.id}
                onClick={() => handleStatusAction(po.id, action)}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {action.label}
                {action.description && (
                  <span className="ml-auto text-xs text-muted-foreground">→</span>
                )}
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSelectedPO(po)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
        <title>Purchase Orders - JusFinn</title>
        <meta name="description" content="Manage your purchase orders with simplified status tracking" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Purchase Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your purchase orders with simplified status tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowStatusGuide(true)}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Status Guide
            </Button>
            <Button 
              variant="outline"
              onClick={loadPurchaseOrders}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => {
                setNewPO(prev => ({ ...prev, po_number: generatePONumber() }));
                setShowCreateDialog(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Purchase Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total POs</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    +{stats.monthlyTrend}% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingApproval}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Awaiting approval
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Ready for processing
                  </p>
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
                  <p className="text-2xl font-bold text-purple-900">₹{stats.totalValue.toLocaleString()}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Avg: ₹{stats.averageValue.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">All Purchase Orders</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
          {/* Filters and Search */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by PO number, vendor, or department..."
                        value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.PENDING_APPROVAL}>Pending Approval</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.REJECTED}>Rejected</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.PARTIALLY_DELIVERED}>Partially Delivered</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={PurchaseOrderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders Table */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Purchase Orders ({filteredPOs.length})</CardTitle>
              <CardDescription>
                Manage your purchase orders with simplified status workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && filteredPOs.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Loading purchase orders...
                </div>
              ) : filteredPOs.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No purchase orders found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Create your first purchase order to get started'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button onClick={() => {
                      setNewPO(prev => ({ ...prev, po_number: generatePONumber() }));
                      setShowCreateDialog(true);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Purchase Order
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bulk Actions */}
                  {filteredPOs.length > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedPOs.length === filteredPOs.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPOs(filteredPOs.map(po => po.id));
                            } else {
                              setSelectedPOs([]);
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {selectedPOs.length > 0 && `${selectedPOs.length} selected`}
                        </span>
                      </div>
                      {selectedPOs.length > 0 && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            Bulk Action
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="w-12 font-semibold text-gray-700">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">PO Number</TableHead>
                        <TableHead className="font-semibold text-gray-700">Vendor</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">PO Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Expected Delivery</TableHead>
                        <TableHead className="font-semibold text-gray-700">Total Amount</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPOs.map((po) => {
                        const statusDisplay = getStatusDisplay(po.status);
                        
                        return (
                          <TableRow key={po.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedPOs.includes(po.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPOs([...selectedPOs, po.id]);
                                  } else {
                                    setSelectedPOs(selectedPOs.filter(id => id !== po.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{po.vendorName}</div>
                                {po.vendorGstin && (
                                  <div className="text-sm text-muted-foreground">GSTIN: {po.vendorGstin}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color}`}>
                                {statusDisplay.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(po.poDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {po.expectedDeliveryDate 
                                ? new Date(po.expectedDeliveryDate).toLocaleDateString()
                                : 'Not set'
                              }
                            </TableCell>
                            <TableCell>₹{po.totalEstimatedAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              {renderStatusActions(po)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Purchase orders awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No pending approvals</h3>
                <p className="text-sm text-muted-foreground">
                  All purchase orders are processed or you don't have approval permissions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Purchase Order Analytics</CardTitle>
              <CardDescription>Insights and trends for your purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Analytics Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed analytics and reporting features will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Guide Dialog */}
      <Dialog open={showStatusGuide} onOpenChange={setShowStatusGuide}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Status Guide</DialogTitle>
            <DialogDescription>
              Understanding the simplified status workflow for purchase orders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {Object.values(PurchaseOrderStatus).map((status) => {
                const statusDescriptions = {
                  [PurchaseOrderStatus.DRAFT]: 'Purchase order is being created or edited. Can be modified and submitted for approval.',
                  [PurchaseOrderStatus.PENDING_APPROVAL]: 'Purchase order is awaiting approval from authorized personnel.',
                  [PurchaseOrderStatus.APPROVED]: 'Purchase order has been approved and can be sent to vendor.',
                  [PurchaseOrderStatus.REJECTED]: 'Purchase order was rejected during approval. Can be edited and resubmitted.',
                  [PurchaseOrderStatus.PARTIALLY_DELIVERED]: 'Some items have been delivered, waiting for remaining items.',
                  [PurchaseOrderStatus.DELIVERED]: 'All items have been delivered. Ready to create purchase bill.',
                  [PurchaseOrderStatus.COMPLETED]: 'Order is fully completed and processed.',
                  [PurchaseOrderStatus.CANCELLED]: 'Purchase order has been cancelled.'
                };
                
                const statusDisplay = getStatusDisplay(status);
                
                return (
                  <div key={status} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color}`}>
                      {statusDisplay.label}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{statusDescriptions[status]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default PurchaseOrders;