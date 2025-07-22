import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Building2,
  Truck,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  RefreshCw,
  Copy,
  Printer,
  MessageSquare,
  Settings,
  Scan,
  Star,
  Shield,
  Zap,
  Target,
  History,
  Award,
  Camera,
  QrCode,
  Archive,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Backend API Integration
import { PurchaseExpenseApiService } from '@/lib/purchaseExpenseApi';

interface GRNItem {
  id: string;
  poItemId: string;
  itemDescription: string;
  hsnCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  rate: number;
  batchNumber?: string;
  serialNumbers?: string[];
  expiryDate?: string;
  qualityStatus: 'pending' | 'passed' | 'failed' | 'partial';
  qualityRemarks?: string;
  inspectionDate?: string;
  inspectorName?: string;
  damagePhotos?: string[];
  storageLocation?: string;
  receivingNotes?: string;
}

interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  poId: string;
  vendorId: string;
  vendorName: string;
  vendorGstin?: string;
  grnDate: string;
  deliveryChallanNumber: string;
  deliveryChallanDate: string;
  vehicleNumber?: string;
  transporterName?: string;
  transporterContact?: string;
  driverName?: string;
  driverContact?: string;
  receivedBy: string;
  deliveryAddress: string;
  status: 'draft' | 'received' | 'quality_pending' | 'quality_approved' | 'quality_rejected' | 'completed' | 'discrepancy';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: GRNItem[];
  totalOrdered: number;
  totalReceived: number;
  totalAccepted: number;
  totalRejected: number;
  overallQualityStatus: 'pending' | 'passed' | 'failed' | 'partial';
  qualityScore: number;
  remarks: string;
  discrepancies: Discrepancy[];
  photos: string[];
  documents: string[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
  isInvoiceMatched: boolean;
  matchedInvoiceNumber?: string;
  matchedInvoiceDate?: string;
  threeWayMatchStatus: 'pending' | 'matched' | 'discrepancy';
  gateEntryTime?: string;
  unloadingStartTime?: string;
  unloadingEndTime?: string;
  inspectionStartTime?: string;
  inspectionEndTime?: string;
  storageCompletedTime?: string;
}

interface Discrepancy {
  id: string;
  type: 'quantity' | 'quality' | 'specification' | 'damage' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken: string;
  resolvedBy?: string;
  resolvedDate?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  photos?: string[];
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  items: GRNItem[];
}

interface GRNStats {
  total: number;
  qualityPending: number;
  completed: number;
  discrepancies: number;
  averageQualityScore: number;
  onTimeDelivery: number;
  totalValue: number;
  monthlyTrend: number;
}

interface GRNFormData {
  grnNumber: string;
  poId: string;
  grnDate: string;
  deliveryChallanNumber: string;
  deliveryChallanDate: string;
  vehicleNumber: string;
  transporterName: string;
  transporterContact: string;
  driverName: string;
  driverContact: string;
  receivedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  remarks: string;
  items: GRNItem[];
}

const GoodsReceiptNote = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [showGRNForm, setShowGRNForm] = useState(false);
  const [showGRNDetails, setShowGRNDetails] = useState(false);
  const [showQualityInspection, setShowQualityInspection] = useState(false);
  const [editingGRN, setEditingGRN] = useState<GoodsReceiptNote | null>(null);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceiptNote | null>(null);
  const [grns, setGrns] = useState<GoodsReceiptNote[]>([]);
  const [filteredGRNs, setFilteredGRNs] = useState<GoodsReceiptNote[]>([]);
  const [selectedGRNs, setSelectedGRNs] = useState<string[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState<GRNStats>({
    total: 0,
    qualityPending: 0,
    completed: 0,
    discrepancies: 0,
    averageQualityScore: 0,
    onTimeDelivery: 0,
    totalValue: 0,
    monthlyTrend: 0
  });

  // Form state
  const [formData, setFormData] = useState<GRNFormData>({
    grnNumber: '',
    poId: '',
    grnDate: new Date().toISOString().split('T')[0],
    deliveryChallanNumber: '',
    deliveryChallanDate: '',
    vehicleNumber: '',
    transporterName: '',
    transporterContact: '',
    driverName: '',
    driverContact: '',
    receivedBy: '',
    priority: 'medium',
    remarks: '',
    items: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Constants
  const qualityStatuses = [
    { value: 'pending', label: 'Pending Inspection', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'passed', label: 'Quality Passed', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Quality Failed', color: 'bg-red-100 text-red-800' },
    { value: 'partial', label: 'Partial Acceptance', color: 'bg-orange-100 text-orange-800' }
  ];

  const discrepancyTypes = [
    'quantity', 'quality', 'specification', 'damage', 'other'
  ];

  // Load data
  const loadGRNs = useCallback(async () => {
    setLoading(true);
    try {
      // Mock purchase orders
      const mockPOs: PurchaseOrder[] = [
        { id: '1', poNumber: 'PO/2024/001', vendorName: 'ABC Suppliers Pvt Ltd', items: [] },
        { id: '2', poNumber: 'PO/2024/002', vendorName: 'XYZ Consultants', items: [] },
        { id: '3', poNumber: 'PO/2024/003', vendorName: 'Tech Solutions Inc', items: [] }
      ];
      setPurchaseOrders(mockPOs);

      // Mock GRNs
      const mockGRNs: GoodsReceiptNote[] = [
        {
          id: '1',
          grnNumber: 'GRN/2024/001',
          poNumber: 'PO/2024/001',
          poId: '1',
          vendorId: '1',
          vendorName: 'ABC Suppliers Pvt Ltd',
          vendorGstin: '06ABCPD1234E1Z5',
          grnDate: '2024-02-28',
          deliveryChallanNumber: 'DC-001',
          deliveryChallanDate: '2024-02-27',
          vehicleNumber: 'HR26-2024',
          transporterName: 'Express Logistics',
          transporterContact: '+91 9876543210',
          driverName: 'Ramesh Kumar',
          driverContact: '+91 9123456789',
          receivedBy: 'Warehouse Team',
          deliveryAddress: 'Main Office, Sector 18, Gurugram',
          status: 'completed',
          priority: 'medium',
          items: [
            {
              id: '1',
              poItemId: '1',
              itemDescription: 'Office Stationery Bundle',
              hsnCode: '4817',
              orderedQuantity: 10,
              receivedQuantity: 10,
              acceptedQuantity: 9,
              rejectedQuantity: 1,
              unit: 'Set',
              rate: 500,
              batchNumber: 'BATCH001',
              qualityStatus: 'partial',
              qualityRemarks: '1 set damaged during transit',
              inspectionDate: '2024-02-28',
              inspectorName: 'Quality Team',
              storageLocation: 'A-01-01'
            }
          ],
          totalOrdered: 10,
          totalReceived: 10,
          totalAccepted: 9,
          totalRejected: 1,
          overallQualityStatus: 'partial',
          qualityScore: 90,
          remarks: 'Partial acceptance due to damage',
          discrepancies: [
            {
              id: '1',
              type: 'damage',
              description: '1 stationery set found damaged',
              severity: 'medium',
              actionTaken: 'Rejected damaged item, accepted rest',
              status: 'resolved',
              resolvedBy: 'Quality Team',
              resolvedDate: '2024-02-28'
            }
          ],
          photos: ['/grn-photos/grn001-1.jpg'],
          documents: ['/grn-docs/grn001.pdf'],
          createdBy: 'User 1',
          createdDate: '2024-02-28',
          lastModified: '2024-02-28',
          modifiedBy: 'User 1',
          isInvoiceMatched: false,
          threeWayMatchStatus: 'pending',
          gateEntryTime: '2024-02-28T09:00:00',
          unloadingStartTime: '2024-02-28T09:30:00',
          unloadingEndTime: '2024-02-28T10:00:00',
          inspectionStartTime: '2024-02-28T10:15:00',
          inspectionEndTime: '2024-02-28T11:30:00',
          storageCompletedTime: '2024-02-28T12:00:00'
        },
        {
          id: '2',
          grnNumber: 'GRN/2024/002',
          poNumber: 'PO/2024/002',
          poId: '2',
          vendorId: '2',
          vendorName: 'Tech Solutions Inc',
          vendorGstin: '29TECHQ9876G1H9',
          grnDate: '2024-03-01',
          deliveryChallanNumber: 'DC-002',
          deliveryChallanDate: '2024-02-29',
          vehicleNumber: 'DL12-3456',
          transporterName: 'Fast Cargo',
          receivedBy: 'IT Team',
          deliveryAddress: 'IT Department, Main Office',
          status: 'quality_pending',
          priority: 'high',
          items: [
            {
              id: '1',
              poItemId: '1',
              itemDescription: 'Network Equipment Bundle',
              hsnCode: '8517',
              orderedQuantity: 5,
              receivedQuantity: 5,
              acceptedQuantity: 0,
              rejectedQuantity: 0,
              unit: 'Set',
              rate: 25000,
              qualityStatus: 'pending',
              inspectionDate: '2024-03-01'
            }
          ],
          totalOrdered: 5,
          totalReceived: 5,
          totalAccepted: 0,
          totalRejected: 0,
          overallQualityStatus: 'pending',
          qualityScore: 0,
          remarks: 'Pending quality inspection',
          discrepancies: [],
          photos: [],
          documents: [],
          createdBy: 'IT Manager',
          createdDate: '2024-03-01',
          lastModified: '2024-03-01',
          modifiedBy: 'IT Manager',
          isInvoiceMatched: false,
          threeWayMatchStatus: 'pending',
          gateEntryTime: '2024-03-01T14:00:00'
        }
      ];

      setGrns(mockGRNs);
      setFilteredGRNs(mockGRNs);

      // Calculate stats
      const totalValue = mockGRNs.reduce((sum, grn) => sum + (grn.totalAccepted * grn.items[0]?.rate || 0), 0);
      const qualityPending = mockGRNs.filter(grn => grn.overallQualityStatus === 'pending').length;
      const completed = mockGRNs.filter(grn => grn.status === 'completed').length;
      const discrepancies = mockGRNs.reduce((sum, grn) => sum + grn.discrepancies.length, 0);
      const avgQualityScore = mockGRNs.reduce((sum, grn) => sum + grn.qualityScore, 0) / mockGRNs.length;

      setStats({
        total: mockGRNs.length,
        qualityPending,
        completed,
        discrepancies,
        averageQualityScore: avgQualityScore,
        onTimeDelivery: 85,
        totalValue,
        monthlyTrend: 12.5
      });

      toast({
        title: 'Success',
        description: 'GRNs loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load GRNs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter GRNs
  const applyFilters = useCallback(() => {
    let filtered = grns;

    if (searchTerm) {
      filtered = filtered.filter(grn =>
        grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grn.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grn.deliveryChallanNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(grn => grn.status === statusFilter);
    }

    if (qualityFilter !== 'all') {
      filtered = filtered.filter(grn => grn.overallQualityStatus === qualityFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(grn => grn.priority === priorityFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setDate(today.getDate());
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(grn => new Date(grn.grnDate) >= filterDate);
    }

    setFilteredGRNs(filtered);
  }, [grns, searchTerm, statusFilter, qualityFilter, priorityFilter, dateFilter]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      grnNumber: '',
      poId: '',
      grnDate: new Date().toISOString().split('T')[0],
      deliveryChallanNumber: '',
      deliveryChallanDate: '',
      vehicleNumber: '',
      transporterName: '',
      transporterContact: '',
      driverName: '',
      driverContact: '',
      receivedBy: '',
      priority: 'medium',
      remarks: '',
      items: []
    });
    setFormErrors({});
  };

  const handleCreateGRN = () => {
    resetForm();
    setEditingGRN(null);
    // Generate GRN number
    const nextNumber = String(grns.length + 1).padStart(3, '0');
    const currentYear = new Date().getFullYear();
    setFormData(prev => ({ 
      ...prev, 
      grnNumber: `GRN/${currentYear}/${nextNumber}` 
    }));
    setShowGRNForm(true);
  };

  const handleEditGRN = (grn: GoodsReceiptNote) => {
    setFormData({
      grnNumber: grn.grnNumber,
      poId: grn.poId,
      grnDate: grn.grnDate,
      deliveryChallanNumber: grn.deliveryChallanNumber,
      deliveryChallanDate: grn.deliveryChallanDate,
      vehicleNumber: grn.vehicleNumber || '',
      transporterName: grn.transporterName || '',
      transporterContact: grn.transporterContact || '',
      driverName: grn.driverName || '',
      driverContact: grn.driverContact || '',
      receivedBy: grn.receivedBy,
      priority: grn.priority,
      remarks: grn.remarks,
      items: grn.items
    });
    setEditingGRN(grn);
    setFormErrors({});
    setShowGRNForm(true);
  };

  const handleSubmitGRN = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const selectedPO = purchaseOrders.find(po => po.id === formData.poId);
      
      // Prepare GRN data for backend API
      const grnApiData = {
        grn_number: formData.grnNumber,
        po_id: formData.poId,
        vendor_id: selectedPO?.vendorId || '1',
        grn_date: formData.grnDate,
        invoice_number: formData.deliveryChallanNumber,
        invoice_date: formData.deliveryChallanDate,
        vehicle_number: formData.vehicleNumber,
        notes: formData.remarks,
        status: 'received',
        items: formData.items.map(item => ({
          po_item_id: item.id,
          item_description: item.itemDescription,
          ordered_quantity: item.orderedQuantity,
          received_quantity: item.receivedQuantity,
          rejected_quantity: item.rejectedQuantity,
          accepted_quantity: item.acceptedQuantity,
          unit: item.unit,
          rate: item.rate,
          amount: item.acceptedQuantity * item.rate,
          notes: item.remarks || ''
        }))
      };

      let savedGRN;
      if (editingGRN) {
        // Note: Update GRN API method might need to be added to backend
        // For now, we'll show an error message
        toast({
          title: 'Info',
          description: 'GRN editing via API not yet implemented in backend',
          variant: 'default',
        });
        return;
      } else {
        // Create new GRN via backend API
        savedGRN = await PurchaseExpenseApiService.createGRN(grnApiData);
        toast({
          title: 'Success',
          description: 'Goods Receipt Note created successfully',
        });
      }

      // Reload GRNs from backend to ensure UI is in sync
      await loadGRNs();

      setShowGRNForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving GRN:', error);
      toast({
        title: 'Error',
        description: `Failed to save GRN: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.poId) errors.poId = 'Purchase order is required';
    if (!formData.deliveryChallanNumber.trim()) errors.deliveryChallanNumber = 'Delivery challan number is required';
    if (!formData.deliveryChallanDate) errors.deliveryChallanDate = 'Delivery challan date is required';
    if (!formData.receivedBy.trim()) errors.receivedBy = 'Received by is required';
    if (formData.items.length === 0) errors.items = 'At least one item is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleQualityApproval = async (grnId: string, status: 'passed' | 'failed') => {
    try {
      setGrns(prev => prev.map(grn => 
        grn.id === grnId 
          ? { 
              ...grn, 
              overallQualityStatus: status,
              status: status === 'passed' ? 'completed' : 'quality_rejected',
              qualityScore: status === 'passed' ? 95 : 0
            } 
          : grn
      ));
      
      toast({
        title: 'Success',
        description: `Quality ${status} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quality status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGRN = async (grnId: string) => {
    try {
      setGrns(prev => prev.filter(grn => grn.id !== grnId));
      setSelectedGRNs(prev => prev.filter(id => id !== grnId));
      
      toast({
        title: 'Success',
        description: 'GRN deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete GRN',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedGRNs.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select GRNs to perform bulk action',
        variant: 'destructive',
      });
      return;
    }

    setBulkActionLoading(true);
    try {
      switch (action) {
        case 'approve_quality':
          setGrns(prev => prev.map(grn => 
            selectedGRNs.includes(grn.id) 
              ? { ...grn, overallQualityStatus: 'passed' as const, status: 'completed' as const } 
              : grn
          ));
          break;
        case 'reject_quality':
          setGrns(prev => prev.map(grn => 
            selectedGRNs.includes(grn.id) 
              ? { ...grn, overallQualityStatus: 'failed' as const, status: 'quality_rejected' as const } 
              : grn
          ));
          break;
        case 'delete':
          setGrns(prev => prev.filter(grn => !selectedGRNs.includes(grn.id)));
          break;
        case 'export':
          console.log('Exporting GRNs:', selectedGRNs);
          break;
      }

      setSelectedGRNs([]);
      toast({
        title: 'Success',
        description: `Bulk ${action.replace('_', ' ')} completed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to perform bulk ${action}`,
        variant: 'destructive',
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'quality_pending': return 'bg-yellow-100 text-yellow-800';
      case 'quality_approved': return 'bg-green-100 text-green-800';
      case 'quality_rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'discrepancy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityBadgeColor = (status: string) => {
    const found = qualityStatuses.find(qs => qs.value === status);
    return found?.color || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-IN');
  };

  // Effects
  useEffect(() => {
    loadGRNs();
  }, [loadGRNs]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Goods Receipt Note - JusFinn</title>
        <meta name="description" content="Comprehensive goods receipt management with quality control and tracking" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Goods Receipt Note
            </h1>
            <p className="text-gray-600 mt-1">
              Complete goods receipt management with quality control and three-way matching
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('quality')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Quality Control
            </Button>
            <Button 
              onClick={handleCreateGRN}
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
                  <p className="text-xs text-blue-600 mt-1">
                    {formatCurrency(stats.totalValue)} value
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Quality Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.qualityPending}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Awaiting inspection
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
                  <p className="text-green-600 text-sm font-medium">Quality Score</p>
                  <p className="text-2xl font-bold text-green-900">{stats.averageQualityScore.toFixed(1)}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    Average rating
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.onTimeDelivery}%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    This month
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list">GRN List</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="matching">Three-Way Match</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search GRNs</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by GRN, PO, vendor, challan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="quality_pending">Quality Pending</SelectItem>
                        <SelectItem value="quality_approved">Quality Approved</SelectItem>
                        <SelectItem value="quality_rejected">Quality Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="discrepancy">Discrepancy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quality-filter">Quality Status</Label>
                    <Select value={qualityFilter} onValueChange={setQualityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Quality</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority-filter">Priority</Label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-filter">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedGRNs.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedGRNs.length} GRN(s) selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('approve_quality')}
                          disabled={bulkActionLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Quality
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('reject_quality')}
                          disabled={bulkActionLoading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject Quality
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('export')}
                          disabled={bulkActionLoading}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={bulkActionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Selected GRNs</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {selectedGRNs.length} selected GRN(s)? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleBulkAction('delete')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GRN Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Goods Receipt Notes ({filteredGRNs.length})</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGRNs(
                        selectedGRNs.length === filteredGRNs.length ? [] : filteredGRNs.map(grn => grn.id)
                      )}
                    >
                      {selectedGRNs.length === filteredGRNs.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Scan className="h-4 w-4 mr-1" />
                      Barcode Scan
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-1" />
                      Photo Capture
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    Loading GRNs...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                          <TableHead>GRN Details</TableHead>
                          <TableHead>PO Reference</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Quantities</TableHead>
                          <TableHead>Quality</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredGRNs.map((grn) => (
                          <TableRow key={grn.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedGRNs.includes(grn.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedGRNs(prev => [...prev, grn.id]);
                                  } else {
                                    setSelectedGRNs(prev => prev.filter(id => id !== grn.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{grn.grnNumber}</div>
                                <div className="text-sm text-gray-500">{formatDate(grn.grnDate)}</div>
                                <div className="text-sm text-gray-500">
                                  DC: {grn.deliveryChallanNumber}
                                </div>
                                {grn.vehicleNumber && (
                                  <div className="text-sm text-gray-500">
                                    Vehicle: {grn.vehicleNumber}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{grn.poNumber}</div>
                                <div className="text-sm text-gray-500">
                                  Received by: {grn.receivedBy}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{grn.vendorName}</div>
                                {grn.transporterName && (
                                  <div className="text-sm text-gray-500">
                                    Transporter: {grn.transporterName}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <span className="font-medium">Ordered:</span> {grn.totalOrdered}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Received:</span> {grn.totalReceived}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium text-green-600">Accepted:</span> {grn.totalAccepted}
                                </div>
                                {grn.totalRejected > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium text-red-600">Rejected:</span> {grn.totalRejected}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge className={getQualityBadgeColor(grn.overallQualityStatus)}>
                                  {grn.overallQualityStatus}
                                </Badge>
                                {grn.qualityScore > 0 && (
                                  <div className="text-sm text-gray-500">
                                    Score: {grn.qualityScore}%
                                  </div>
                                )}
                                {grn.discrepancies.length > 0 && (
                                  <div className="text-sm text-orange-600">
                                    {grn.discrepancies.length} discrepancy(ies)
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityBadgeColor(grn.priority)}>
                                {grn.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(grn.status)}>
                                {grn.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedGRN(grn);
                                    setShowGRNDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditGRN(grn)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {grn.overallQualityStatus === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQualityApproval(grn.id, 'passed')}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQualityApproval(grn.id, 'failed')}
                                      className="text-red-600"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete GRN</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {grn.grnNumber}? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteGRN(grn.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            {/* Quality Control Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Quality Control Dashboard
                </CardTitle>
                <CardDescription>
                  Monitor and manage quality inspection processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredGRNs.filter(grn => grn.overallQualityStatus === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-600">Pending Inspection</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Pending
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredGRNs.filter(grn => grn.overallQualityStatus === 'passed').length}
                    </div>
                    <div className="text-sm text-green-600">Quality Passed</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Passed
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredGRNs.filter(grn => grn.overallQualityStatus === 'failed').length}
                    </div>
                    <div className="text-sm text-red-600">Quality Failed</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Failed
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Quality Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quality Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Quality Score</span>
                        <span className="font-medium">{stats.averageQualityScore.toFixed(1)}%</span>
                      </div>
                      <Progress value={stats.averageQualityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-Time Delivery</span>
                        <span className="font-medium">{stats.onTimeDelivery}%</span>
                      </div>
                      <Progress value={stats.onTimeDelivery} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            {/* Three-Way Matching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Three-Way Matching
                </CardTitle>
                <CardDescription>
                  Match Purchase Orders, GRNs, and Invoices for accurate processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGRNs.map((grn) => (
                    <div key={grn.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold">{grn.grnNumber}</h3>
                            <Badge 
                              variant={grn.threeWayMatchStatus === 'matched' ? 'default' : 
                                      grn.threeWayMatchStatus === 'discrepancy' ? 'destructive' : 'secondary'}
                            >
                              {grn.threeWayMatchStatus}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-blue-50 rounded">
                              <div className="font-medium text-blue-900">Purchase Order</div>
                              <div className="text-blue-700">{grn.poNumber}</div>
                              <div className="text-xs text-blue-600">Ordered: {grn.totalOrdered}</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded">
                              <div className="font-medium text-green-900">Goods Receipt</div>
                              <div className="text-green-700">{grn.grnNumber}</div>
                              <div className="text-xs text-green-600">Received: {grn.totalReceived}</div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded">
                              <div className="font-medium text-orange-900">Invoice</div>
                              <div className="text-orange-700">
                                {grn.matchedInvoiceNumber || 'Pending'}
                              </div>
                              <div className="text-xs text-orange-600">
                                {grn.matchedInvoiceDate ? formatDate(grn.matchedInvoiceDate) : 'Not matched'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {grn.threeWayMatchStatus === 'pending' && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Match Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Quality Pass Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Rejection Rate</span>
                      <span className="font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-3" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Discrepancy Rate</span>
                      <span className="font-medium">3%</span>
                    </div>
                    <Progress value={3} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receiving Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          2.5 hrs
                        </div>
                        <div className="text-sm text-blue-600">Avg Processing Time</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {stats.onTimeDelivery}%
                        </div>
                        <div className="text-sm text-green-600">On-Time Delivery</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* GRN Form Dialog */}
        <Dialog open={showGRNForm} onOpenChange={setShowGRNForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingGRN ? 'Edit Goods Receipt Note' : 'Create New GRN'}
              </DialogTitle>
              <DialogDescription>
                {editingGRN 
                  ? 'Update goods receipt information and quantities' 
                  : 'Create a new goods receipt note with delivery details'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitGRN} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grnNumber">GRN Number *</Label>
                    <Input
                      id="grnNumber"
                      value={formData.grnNumber}
                      onChange={(e) => setFormData({...formData, grnNumber: e.target.value})}
                      placeholder="GRN/2024/001"
                      disabled={!!editingGRN}
                      required
                    />
                    {formErrors.grnNumber && (
                      <p className="text-sm text-red-600">{formErrors.grnNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poId">Purchase Order *</Label>
                    <Select value={formData.poId} onValueChange={(value) => setFormData({...formData, poId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PO" />
                      </SelectTrigger>
                      <SelectContent>
                        {purchaseOrders.map((po) => (
                          <SelectItem key={po.id} value={po.id}>
                            {po.poNumber} - {po.vendorName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.poId && (
                      <p className="text-sm text-red-600">{formErrors.poId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grnDate">GRN Date *</Label>
                    <Input
                      id="grnDate"
                      type="date"
                      value={formData.grnDate}
                      onChange={(e) => setFormData({...formData, grnDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryChallanNumber">Delivery Challan Number *</Label>
                    <Input
                      id="deliveryChallanNumber"
                      value={formData.deliveryChallanNumber}
                      onChange={(e) => setFormData({...formData, deliveryChallanNumber: e.target.value})}
                      placeholder="DC-001"
                      required
                    />
                    {formErrors.deliveryChallanNumber && (
                      <p className="text-sm text-red-600">{formErrors.deliveryChallanNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryChallanDate">Challan Date *</Label>
                    <Input
                      id="deliveryChallanDate"
                      type="date"
                      value={formData.deliveryChallanDate}
                      onChange={(e) => setFormData({...formData, deliveryChallanDate: e.target.value})}
                      required
                    />
                    {formErrors.deliveryChallanDate && (
                      <p className="text-sm text-red-600">{formErrors.deliveryChallanDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Transportation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Transportation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                      placeholder="HR26-2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transporterName">Transporter Name</Label>
                    <Input
                      id="transporterName"
                      value={formData.transporterName}
                      onChange={(e) => setFormData({...formData, transporterName: e.target.value})}
                      placeholder="Express Logistics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transporterContact">Transporter Contact</Label>
                    <Input
                      id="transporterContact"
                      value={formData.transporterContact}
                      onChange={(e) => setFormData({...formData, transporterContact: e.target.value})}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                      id="driverName"
                      value={formData.driverName}
                      onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                      placeholder="Ramesh Kumar"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverContact">Driver Contact</Label>
                    <Input
                      id="driverContact"
                      value={formData.driverContact}
                      onChange={(e) => setFormData({...formData, driverContact: e.target.value})}
                      placeholder="+91 9123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receivedBy">Received By *</Label>
                    <Input
                      id="receivedBy"
                      value={formData.receivedBy}
                      onChange={(e) => setFormData({...formData, receivedBy: e.target.value})}
                      placeholder="Warehouse Team"
                      required
                    />
                    {formErrors.receivedBy && (
                      <p className="text-sm text-red-600">{formErrors.receivedBy}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    placeholder="Additional notes about the goods receipt..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowGRNForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {editingGRN ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingGRN ? 'Update GRN' : 'Create GRN'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* GRN Details Sheet */}
        <Sheet open={showGRNDetails} onOpenChange={setShowGRNDetails}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedGRN?.grnNumber}
              </SheetTitle>
              <SheetDescription>
                Complete goods receipt details and quality information
              </SheetDescription>
            </SheetHeader>

            {selectedGRN && (
              <div className="space-y-6 mt-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Receipt Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">GRN Number</Label>
                        <p className="font-medium">{selectedGRN.grnNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">PO Number</Label>
                        <p className="font-medium">{selectedGRN.poNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Vendor</Label>
                        <p className="font-medium">{selectedGRN.vendorName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Status</Label>
                        <Badge className={getStatusBadgeColor(selectedGRN.status)}>
                          {selectedGRN.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">GRN Date</Label>
                        <p className="font-medium">{formatDate(selectedGRN.grnDate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Delivery Challan</Label>
                        <p className="font-medium">{selectedGRN.deliveryChallanNumber}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      {selectedGRN.vehicleNumber && (
                        <div>
                          <Label className="text-sm text-gray-500">Vehicle Number</Label>
                          <p className="font-medium">{selectedGRN.vehicleNumber}</p>
                        </div>
                      )}
                      {selectedGRN.transporterName && (
                        <div>
                          <Label className="text-sm text-gray-500">Transporter</Label>
                          <p className="font-medium">{selectedGRN.transporterName}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm text-gray-500">Received By</Label>
                        <p className="font-medium">{selectedGRN.receivedBy}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Priority</Label>
                        <Badge className={getPriorityBadgeColor(selectedGRN.priority)}>
                          {selectedGRN.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Items Received</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedGRN.items.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">{item.itemDescription}</p>
                              <p className="text-sm text-gray-500">HSN: {item.hsnCode}</p>
                              {item.batchNumber && (
                                <p className="text-sm text-gray-500">Batch: {item.batchNumber}</p>
                              )}
                              {item.storageLocation && (
                                <p className="text-sm text-gray-500">Location: {item.storageLocation}</p>
                              )}
                            </div>
                            <div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Ordered:</span>
                                  <span className="font-medium ml-1">{item.orderedQuantity}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Received:</span>
                                  <span className="font-medium ml-1">{item.receivedQuantity}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Accepted:</span>
                                  <span className="font-medium ml-1 text-green-600">{item.acceptedQuantity}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Rejected:</span>
                                  <span className="font-medium ml-1 text-red-600">{item.rejectedQuantity}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Badge className={getQualityBadgeColor(item.qualityStatus)}>
                                  {item.qualityStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {item.qualityRemarks && (
                            <div className="mt-3 pt-3 border-t">
                              <Label className="text-sm text-gray-500">Quality Remarks</Label>
                              <p className="text-sm">{item.qualityRemarks}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold">{selectedGRN.totalOrdered}</div>
                        <div className="text-sm text-gray-600">Total Ordered</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{selectedGRN.totalReceived}</div>
                        <div className="text-sm text-blue-600">Total Received</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{selectedGRN.totalAccepted}</div>
                        <div className="text-sm text-green-600">Total Accepted</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{selectedGRN.totalRejected}</div>
                        <div className="text-sm text-red-600">Total Rejected</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quality Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-500">Overall Quality Status</Label>
                          <Badge className={getQualityBadgeColor(selectedGRN.overallQualityStatus)}>
                            {selectedGRN.overallQualityStatus}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Quality Score</Label>
                          <p className="font-medium">{selectedGRN.qualityScore}%</p>
                        </div>
                      </div>

                      {selectedGRN.discrepancies.length > 0 && (
                        <div>
                          <Label className="text-sm text-gray-500">Discrepancies</Label>
                          <div className="space-y-2 mt-2">
                            {selectedGRN.discrepancies.map((discrepancy) => (
                              <div key={discrepancy.id} className="border rounded p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium capitalize">{discrepancy.type} - {discrepancy.severity}</p>
                                    <p className="text-sm text-gray-600">{discrepancy.description}</p>
                                    <p className="text-sm text-gray-500">Action: {discrepancy.actionTaken}</p>
                                  </div>
                                  <Badge variant={discrepancy.status === 'resolved' ? 'default' : 'secondary'}>
                                    {discrepancy.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                {selectedGRN.gateEntryTime && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Process Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedGRN.gateEntryTime && (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Gate Entry</p>
                              <p className="text-sm text-gray-500">{formatDateTime(selectedGRN.gateEntryTime)}</p>
                            </div>
                          </div>
                        )}
                        {selectedGRN.unloadingStartTime && (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Unloading Started</p>
                              <p className="text-sm text-gray-500">{formatDateTime(selectedGRN.unloadingStartTime)}</p>
                            </div>
                          </div>
                        )}
                        {selectedGRN.inspectionStartTime && (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Inspection Started</p>
                              <p className="text-sm text-gray-500">{formatDateTime(selectedGRN.inspectionStartTime)}</p>
                            </div>
                          </div>
                        )}
                        {selectedGRN.storageCompletedTime && (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Storage Completed</p>
                              <p className="text-sm text-gray-500">{formatDateTime(selectedGRN.storageCompletedTime)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowGRNDetails(false);
                      handleEditGRN(selectedGRN);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit GRN
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print GRN
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default GoodsReceiptNote; 