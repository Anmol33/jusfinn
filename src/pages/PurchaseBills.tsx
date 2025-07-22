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
  Receipt, 
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
  Mail,
  CreditCard,
  DollarSign,
  Calculator,
  FileCheck,
  Split,
  Paperclip,
  ImageIcon,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Backend API Integration
import { PurchaseExpenseApiService } from '@/lib/purchaseExpenseApi';

interface BillItem {
  id: string;
  poItemId?: string;
  grnItemId?: string;
  itemDescription: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate?: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount?: number;
  totalTaxAmount: number;
  totalAmount: number;
  tdsApplicable: boolean;
  tdsSection?: string;
  tdsRate?: number;
  tdsAmount?: number;
}

interface PurchaseBill {
  id: string;
  billNumber: string;
  billDate: string;
  vendorId: string;
  vendorName: string;
  vendorGstin?: string;
  vendorPan?: string;
  poNumber?: string;
  poId?: string;
  grnNumber?: string;
  grnId?: string;
  billType: 'goods' | 'services' | 'expense' | 'advance' | 'debit_note' | 'credit_note';
  category: string;
  subcategory?: string;
  paymentTerms: string;
  dueDate: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'partially_paid' | 'rejected' | 'on_hold';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  items: BillItem[];
  subtotal: number;
  totalDiscount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalCess: number;
  totalTax: number;
  totalTds: number;
  billAmount: number;
  roundingAdjustment: number;
  finalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  bankAccount?: string;
  chequeNumber?: string;
  utrNumber?: string;
  notes?: string;
  attachments: string[];
  ocrProcessed: boolean;
  ocrConfidence?: number;
  ocrData?: Record<string, unknown>;
  isMatched: boolean;
  matchingScore?: number;
  discrepancies: Discrepancy[];
  workflowSteps: WorkflowStep[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
  accountingEntries: AccountingEntry[];
  tdsEntries: TDSEntry[];
  complianceChecks: ComplianceCheck[];
}

interface Discrepancy {
  id: string;
  type: 'amount' | 'quantity' | 'rate' | 'tax' | 'description' | 'other';
  field: string;
  expectedValue: string;
  actualValue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'ignored';
  resolvedBy?: string;
  resolvedDate?: string;
  comments?: string;
}

interface WorkflowStep {
  id: string;
  stepName: string;
  assignedTo: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comments?: string;
  processedDate?: string;
  processedBy?: string;
  order: number;
  isRequired: boolean;
}

interface AccountingEntry {
  id: string;
  account: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
}

interface TDSEntry {
  id: string;
  section: string;
  rate: number;
  taxableAmount: number;
  tdsAmount: number;
  panAvailable: boolean;
  certificateGenerated: boolean;
  paymentDate?: string;
  challanNumber?: string;
}

interface ComplianceCheck {
  id: string;
  checkType: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  checkDate: string;
}

interface BillStats {
  total: number;
  pendingApproval: number;
  approved: number;
  paid: number;
  totalValue: number;
  averageValue: number;
  totalTds: number;
  ocrAccuracy: number;
  monthlyTrend: number;
}

interface BillFormData {
  billNumber: string;
  billDate: string;
  vendorId: string;
  poId: string;
  grnId: string;
  billType: 'goods' | 'services' | 'expense' | 'advance' | 'debit_note' | 'credit_note';
  category: string;
  subcategory: string;
  paymentTerms: string;
  dueDate: string;
  notes: string;
  items: BillItem[];
}

const PurchaseBills = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [showBillForm, setShowBillForm] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showOCRDialog, setShowOCRDialog] = useState(false);
  const [editingBill, setEditingBill] = useState<PurchaseBill | null>(null);
  const [selectedBill, setSelectedBill] = useState<PurchaseBill | null>(null);
  const [bills, setBills] = useState<PurchaseBill[]>([]);
  const [filteredBills, setFilteredBills] = useState<PurchaseBill[]>([]);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [ocrLoading, setOCRLoading] = useState(false);
  const [stats, setStats] = useState<BillStats>({
    total: 0,
    pendingApproval: 0,
    approved: 0,
    paid: 0,
    totalValue: 0,
    averageValue: 0,
    totalTds: 0,
    ocrAccuracy: 0,
    monthlyTrend: 0
  });

  // Form state
  const [formData, setFormData] = useState<BillFormData>({
    billNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    vendorId: '',
    poId: '',
    grnId: '',
    billType: 'goods',
    category: '',
    subcategory: '',
    paymentTerms: '',
    dueDate: '',
    notes: '',
    items: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Constants
  const billTypes = [
    { value: 'goods', label: 'Goods Bill' },
    { value: 'services', label: 'Services Bill' },
    { value: 'expense', label: 'Expense Bill' },
    { value: 'advance', label: 'Advance Payment' },
    { value: 'debit_note', label: 'Debit Note' },
    { value: 'credit_note', label: 'Credit Note' }
  ];

  const billCategories = [
    'Office Expenses', 'Travel & Transport', 'IT & Software', 'Marketing',
    'Professional Services', 'Utilities', 'Maintenance', 'Raw Materials',
    'Equipment', 'Rent', 'Insurance', 'Others'
  ];

  const tdsRates = [
    { section: '194A', rate: 10, description: 'Interest other than securities' },
    { section: '194C', rate: 1, description: 'Payments to contractors' },
    { section: '194G', rate: 5, description: 'Commission, brokerage etc.' },
    { section: '194H', rate: 5, description: 'Commission or brokerage' },
    { section: '194I', rate: 10, description: 'Rent' },
    { section: '194J', rate: 10, description: 'Professional/technical services' },
    { section: '194K', rate: 0.1, description: 'E-commerce transactions' },
    { section: '194O', rate: 0.1, description: 'E-commerce operators' },
    { section: '194S', rate: 2, description: 'Crypto/virtual digital assets' }
  ];

  // Load data
  const loadBills = useCallback(async () => {
    setLoading(true);
    try {
      // Mock bills data
      const mockBills: PurchaseBill[] = [
        {
          id: '1',
          billNumber: 'INV-2024-001',
          billDate: '2024-03-01',
          vendorId: '1',
          vendorName: 'ABC Suppliers Pvt Ltd',
          vendorGstin: '06ABCPD1234E1Z5',
          vendorPan: 'ABCPD1234E',
          poNumber: 'PO/2024/001',
          poId: '1',
          grnNumber: 'GRN/2024/001',
          grnId: '1',
          billType: 'goods',
          category: 'Office Expenses',
          subcategory: 'Stationery',
          paymentTerms: '30 days',
          dueDate: '2024-03-31',
          status: 'approved',
          approvalStatus: 'approved',
          approvedBy: 'Finance Manager',
          approvedDate: '2024-03-02',
          items: [
            {
              id: '1',
              poItemId: '1',
              grnItemId: '1',
              itemDescription: 'Office Stationery Bundle',
              hsnCode: '4817',
              quantity: 9,
              unit: 'Set',
              rate: 500,
              discountPercent: 10,
              discountAmount: 450,
              taxableAmount: 4050,
              cgstRate: 9,
              sgstRate: 9,
              igstRate: 0,
              cgstAmount: 364.5,
              sgstAmount: 364.5,
              igstAmount: 0,
              totalTaxAmount: 729,
              totalAmount: 4779,
              tdsApplicable: false,
              tdsSection: '',
              tdsRate: 0,
              tdsAmount: 0
            }
          ],
          subtotal: 4500,
          totalDiscount: 450,
          totalCgst: 364.5,
          totalSgst: 364.5,
          totalIgst: 0,
          totalCess: 0,
          totalTax: 729,
          totalTds: 0,
          billAmount: 4779,
          roundingAdjustment: -4,
          finalAmount: 4775,
          paidAmount: 4775,
          balanceAmount: 0,
          paymentMethod: 'Bank Transfer',
          paymentReference: 'TXN123456789',
          paymentDate: '2024-03-15',
          bankAccount: 'SBI-001',
          utrNumber: 'UTR123456789',
          notes: 'Payment completed on time',
          attachments: ['/bills/inv-2024-001.pdf'],
          ocrProcessed: true,
          ocrConfidence: 94.5,
          isMatched: true,
          matchingScore: 98.2,
          discrepancies: [],
          workflowSteps: [
            {
              id: '1',
              stepName: 'Department Approval',
              assignedTo: 'Department Head',
              status: 'approved',
              processedDate: '2024-03-01',
              processedBy: 'Dept Head',
              order: 1,
              isRequired: true
            },
            {
              id: '2',
              stepName: 'Finance Approval',
              assignedTo: 'Finance Manager',
              status: 'approved',
              processedDate: '2024-03-02',
              processedBy: 'Finance Manager',
              order: 2,
              isRequired: true
            }
          ],
          createdBy: 'Accounts Team',
          createdDate: '2024-03-01',
          lastModified: '2024-03-15',
          modifiedBy: 'Accounts Team',
          accountingEntries: [
            {
              id: '1',
              account: 'Office Expenses',
              debitAmount: 4775,
              creditAmount: 0,
              description: 'Office stationery purchase'
            },
            {
              id: '2',
              account: 'Accounts Payable',
              debitAmount: 0,
              creditAmount: 4775,
              description: 'Vendor payment liability'
            }
          ],
          tdsEntries: [],
          complianceChecks: [
            {
              id: '1',
              checkType: 'GST Validation',
              status: 'passed',
              message: 'GSTIN verified successfully',
              checkDate: '2024-03-01'
            },
            {
              id: '2',
              checkType: 'PAN Validation',
              status: 'passed',
              message: 'PAN verified successfully',
              checkDate: '2024-03-01'
            }
          ]
        },
        {
          id: '2',
          billNumber: 'SRV-2024-001',
          billDate: '2024-03-05',
          vendorId: '2',
          vendorName: 'Tech Consultancy Services',
          vendorGstin: '29TECHQ9876G1H9',
          vendorPan: 'TECHQ9876G',
          billType: 'services',
          category: 'Professional Services',
          subcategory: 'IT Consultancy',
          paymentTerms: '15 days',
          dueDate: '2024-03-20',
          status: 'pending_approval',
          approvalStatus: 'pending',
          items: [
            {
              id: '1',
              itemDescription: 'Software Development Services',
              hsnCode: '998314',
              quantity: 1,
              unit: 'Month',
              rate: 50000,
              discountPercent: 0,
              discountAmount: 0,
              taxableAmount: 50000,
              cgstRate: 9,
              sgstRate: 9,
              igstRate: 0,
              cgstAmount: 4500,
              sgstAmount: 4500,
              igstAmount: 0,
              totalTaxAmount: 9000,
              totalAmount: 59000,
              tdsApplicable: true,
              tdsSection: '194J',
              tdsRate: 10,
              tdsAmount: 5000
            }
          ],
          subtotal: 50000,
          totalDiscount: 0,
          totalCgst: 4500,
          totalSgst: 4500,
          totalIgst: 0,
          totalCess: 0,
          totalTax: 9000,
          totalTds: 5000,
          billAmount: 59000,
          roundingAdjustment: 0,
          finalAmount: 54000,
          paidAmount: 0,
          balanceAmount: 54000,
          notes: 'Monthly consultancy charges',
          attachments: ['/bills/srv-2024-001.pdf'],
          ocrProcessed: true,
          ocrConfidence: 91.2,
          isMatched: false,
          matchingScore: 0,
          discrepancies: [
            {
              id: '1',
              type: 'amount',
              field: 'rate',
              expectedValue: '45000',
              actualValue: '50000',
              severity: 'medium',
              status: 'open',
              comments: 'Rate higher than agreed'
            }
          ],
          workflowSteps: [
            {
              id: '1',
              stepName: 'Technical Review',
              assignedTo: 'CTO',
              status: 'pending',
              order: 1,
              isRequired: true
            },
            {
              id: '2',
              stepName: 'Finance Approval',
              assignedTo: 'Finance Manager',
              status: 'pending',
              order: 2,
              isRequired: true
            }
          ],
          createdBy: 'Accounts Team',
          createdDate: '2024-03-05',
          lastModified: '2024-03-05',
          modifiedBy: 'Accounts Team',
          accountingEntries: [],
          tdsEntries: [
            {
              id: '1',
              section: '194J',
              rate: 10,
              taxableAmount: 50000,
              tdsAmount: 5000,
              panAvailable: true,
              certificateGenerated: false
            }
          ],
          complianceChecks: [
            {
              id: '1',
              checkType: 'TDS Calculation',
              status: 'passed',
              message: 'TDS calculated correctly',
              checkDate: '2024-03-05'
            }
          ]
        }
      ];

      setBills(mockBills);
      setFilteredBills(mockBills);

      // Calculate stats
      const totalValue = mockBills.reduce((sum, bill) => sum + bill.finalAmount, 0);
      const pendingApproval = mockBills.filter(bill => bill.approvalStatus === 'pending').length;
      const approved = mockBills.filter(bill => bill.approvalStatus === 'approved').length;
      const paid = mockBills.filter(bill => bill.status === 'paid').length;
      const totalTds = mockBills.reduce((sum, bill) => sum + bill.totalTds, 0);
      const avgOcrAccuracy = mockBills.reduce((sum, bill) => sum + (bill.ocrConfidence || 0), 0) / mockBills.length;

      setStats({
        total: mockBills.length,
        pendingApproval,
        approved,
        paid,
        totalValue,
        averageValue: totalValue / mockBills.length,
        totalTds,
        ocrAccuracy: avgOcrAccuracy,
        monthlyTrend: 18.5
      });

      toast({
        title: 'Success',
        description: 'Purchase bills loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load purchase bills',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter bills
  const applyFilters = useCallback(() => {
    let filtered = bills;

    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.poNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    if (approvalFilter !== 'all') {
      filtered = filtered.filter(bill => bill.approvalStatus === approvalFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(bill => bill.billType === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bill => bill.category === categoryFilter);
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
      
      filtered = filtered.filter(bill => new Date(bill.billDate) >= filterDate);
    }

    setFilteredBills(filtered);
  }, [bills, searchTerm, statusFilter, approvalFilter, typeFilter, categoryFilter, dateFilter]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      billNumber: '',
      billDate: new Date().toISOString().split('T')[0],
      vendorId: '',
      poId: '',
      grnId: '',
      billType: 'goods',
      category: '',
      subcategory: '',
      paymentTerms: '',
      dueDate: '',
      notes: '',
      items: []
    });
    setFormErrors({});
  };

  const handleCreateBill = () => {
    resetForm();
    setEditingBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (bill: PurchaseBill) => {
    setFormData({
      billNumber: bill.billNumber,
      billDate: bill.billDate,
      vendorId: bill.vendorId,
      poId: bill.poId || '',
      grnId: bill.grnId || '',
      billType: bill.billType,
      category: bill.category,
      subcategory: bill.subcategory || '',
      paymentTerms: bill.paymentTerms,
      dueDate: bill.dueDate,
      notes: bill.notes || '',
      items: bill.items
    });
    setEditingBill(bill);
    setFormErrors({});
    setShowBillForm(true);
  };

  const handleOCRProcessing = async (file: File) => {
    setOCRLoading(true);
    try {
      // Mock OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockOCRData = {
        billNumber: 'INV-2024-' + Math.floor(Math.random() * 1000),
        billDate: new Date().toISOString().split('T')[0],
        vendorName: 'Auto-detected Vendor',
        amount: Math.floor(Math.random() * 100000),
        confidence: 92.5
      };

      setFormData(prev => ({
        ...prev,
        billNumber: mockOCRData.billNumber,
        billDate: mockOCRData.billDate
      }));

      toast({
        title: 'OCR Processing Complete',
        description: `Bill data extracted with ${mockOCRData.confidence}% confidence`,
      });
      
      setShowOCRDialog(false);
      setShowBillForm(true);
    } catch (error) {
      toast({
        title: 'OCR Processing Failed',
        description: 'Failed to extract data from the bill image',
        variant: 'destructive',
      });
    } finally {
      setOCRLoading(false);
    }
  };

  const handleSubmitBill = async (e: React.FormEvent) => {
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
      // Prepare bill data for backend API
      const billApiData = {
        bill_number: formData.billNumber,
        vendor_id: formData.vendorId,
        bill_date: formData.billDate,
        due_date: formData.dueDate,
        vendor_invoice_number: formData.billNumber, // Use bill number as vendor invoice for now
        vendor_invoice_date: formData.billDate,
        po_id: formData.poId || undefined,
        grn_id: formData.grnId || undefined,
        items: formData.items.map(item => ({
          item_description: item.itemDescription,
          hsn_code: item.hsnCode,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
          amount: item.quantity * item.rate,
          cgst_rate: item.cgstRate,
          sgst_rate: item.sgstRate,
          igst_rate: item.igstRate,
          cgst_amount: item.cgstAmount,
          sgst_amount: item.sgstAmount,
          igst_amount: item.igstAmount
        })),
        subtotal: formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0),
        cgst_amount: formData.items.reduce((sum, item) => sum + item.cgstAmount, 0),
        sgst_amount: formData.items.reduce((sum, item) => sum + item.sgstAmount, 0),
        igst_amount: formData.items.reduce((sum, item) => sum + item.igstAmount, 0),
        cess_amount: formData.items.reduce((sum, item) => sum + (item.cessAmount || 0), 0),
        tds_amount: formData.items.reduce((sum, item) => sum + (item.tdsAmount || 0), 0),
        total_amount: formData.items.reduce((sum, item) => sum + item.totalAmount, 0),
        payment_status: 'pending',
        approval_status: 'pending'
      };

      let savedBill;
      if (editingBill) {
        // Note: Update Bill API method might need to be added to backend
        toast({
          title: 'Info',
          description: 'Bill editing via API not yet implemented in backend',
          variant: 'default',
        });
        return;
      } else {
        // Create new bill via backend API
        savedBill = await PurchaseExpenseApiService.createPurchaseBill(billApiData);
        toast({
          title: 'Success',
          description: 'Purchase bill created successfully',
        });
      }

      // Reload bills from backend to ensure UI is in sync
      await loadBills();

      setShowBillForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving bill:', error);
      toast({
        title: 'Error',
        description: `Failed to save bill: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.billNumber.trim()) errors.billNumber = 'Bill number is required';
    if (!formData.vendorId) errors.vendorId = 'Vendor is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (formData.items.length === 0) errors.items = 'At least one item is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApproveBill = async (billId: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              approvalStatus: 'approved',
              status: 'approved',
              approvedBy: 'current_user',
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : bill
      ));
      
      toast({
        title: 'Success',
        description: 'Bill approved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve bill',
        variant: 'destructive',
      });
    }
  };

  const handleRejectBill = async (billId: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              approvalStatus: 'rejected',
              status: 'rejected'
            } 
          : bill
      ));
      
      toast({
        title: 'Success',
        description: 'Bill rejected',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject bill',
        variant: 'destructive',
      });
    }
  };

  const handlePayBill = async (billId: string) => {
    try {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              status: 'paid',
              paidAmount: bill.finalAmount,
              balanceAmount: 0,
              paymentDate: new Date().toISOString().split('T')[0]
            } 
          : bill
      ));
      
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBill = async (billId: string) => {
    try {
      setBills(prev => prev.filter(bill => bill.id !== billId));
      setSelectedBills(prev => prev.filter(id => id !== billId));
      
      toast({
        title: 'Success',
        description: 'Bill deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete bill',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBills.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select bills to perform bulk action',
        variant: 'destructive',
      });
      return;
    }

    setBulkActionLoading(true);
    try {
      switch (action) {
        case 'approve':
          setBills(prev => prev.map(bill => 
            selectedBills.includes(bill.id) 
              ? { ...bill, approvalStatus: 'approved' as const, status: 'approved' as const } 
              : bill
          ));
          break;
        case 'reject':
          setBills(prev => prev.map(bill => 
            selectedBills.includes(bill.id) 
              ? { ...bill, approvalStatus: 'rejected' as const, status: 'rejected' as const } 
              : bill
          ));
          break;
        case 'pay':
          setBills(prev => prev.map(bill => 
            selectedBills.includes(bill.id) 
              ? { ...bill, status: 'paid' as const, paidAmount: bill.finalAmount, balanceAmount: 0 } 
              : bill
          ));
          break;
        case 'delete':
          setBills(prev => prev.filter(bill => !selectedBills.includes(bill.id)));
          break;
        case 'export':
          console.log('Exporting Bills:', selectedBills);
          break;
      }

      setSelectedBills([]);
      toast({
        title: 'Success',
        description: `Bulk ${action} completed successfully`,
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
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'partially_paid': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'goods': return 'bg-blue-100 text-blue-800';
      case 'services': return 'bg-green-100 text-green-800';
      case 'expense': return 'bg-orange-100 text-orange-800';
      case 'advance': return 'bg-purple-100 text-purple-800';
      case 'debit_note': return 'bg-red-100 text-red-800';
      case 'credit_note': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const calculateTDS = (amount: number, section: string) => {
    const tdsRate = tdsRates.find(rate => rate.section === section);
    return tdsRate ? (amount * tdsRate.rate) / 100 : 0;
  };

  // Effects
  useEffect(() => {
    loadBills();
  }, [loadBills]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Purchase Bills - JusFinn</title>
        <meta name="description" content="Comprehensive purchase bill management with OCR, TDS compliance and automated matching" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Purchase Bills
            </h1>
            <p className="text-gray-600 mt-1">
              Smart bill processing with OCR, automated matching, and TDS compliance
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowOCRDialog(true)}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              OCR Scan
            </Button>
            <Button 
              onClick={handleCreateBill}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Bill
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Bills</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {formatCurrency(stats.totalValue)} value
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600" />
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
                    Needs review
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
                  <p className="text-green-600 text-sm font-medium">TDS Deducted</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalTds)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    This month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">OCR Accuracy</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.ocrAccuracy.toFixed(1)}%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    AI processing
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list">Bills List</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
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
                    <Label htmlFor="search">Search Bills</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by bill number, vendor, category..."
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
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partially_paid">Partially Paid</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type-filter">Bill Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {billTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {billCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
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
                {selectedBills.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedBills.length} bill(s) selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('approve')}
                          disabled={bulkActionLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('pay')}
                          disabled={bulkActionLoading}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay
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
                              <AlertDialogTitle>Delete Selected Bills</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {selectedBills.length} selected bill(s)? 
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

            {/* Bills Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Purchase Bills ({filteredBills.length})</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBills(
                        selectedBills.length === filteredBills.length ? [] : filteredBills.map(bill => bill.id)
                      )}
                    >
                      {selectedBills.length === filteredBills.length ? 'Deselect All' : 'Select All'}
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
                    Loading bills...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedBills.length === filteredBills.length && filteredBills.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBills(filteredBills.map(bill => bill.id));
                                } else {
                                  setSelectedBills([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Bill Details</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Type & Category</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>TDS</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBills.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedBills.includes(bill.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedBills(prev => [...prev, bill.id]);
                                  } else {
                                    setSelectedBills(prev => prev.filter(id => id !== bill.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{bill.billNumber}</div>
                                <div className="text-sm text-gray-500">{formatDate(bill.billDate)}</div>
                                {bill.poNumber && (
                                  <div className="text-sm text-gray-500">
                                    PO: {bill.poNumber}
                                  </div>
                                )}
                                {bill.ocrProcessed && (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Brain className="h-3 w-3" />
                                    OCR: {bill.ocrConfidence?.toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{bill.vendorName}</div>
                                {bill.vendorGstin && (
                                  <div className="text-sm text-gray-500">{bill.vendorGstin}</div>
                                )}
                                {bill.isMatched && (
                                  <div className="text-xs text-green-600">
                                    ✓ Matched ({bill.matchingScore?.toFixed(1)}%)
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge className={getBillTypeBadgeColor(bill.billType)}>
                                  {bill.billType.replace('_', ' ')}
                                </Badge>
                                <div className="text-sm text-gray-500">{bill.category}</div>
                                {bill.subcategory && (
                                  <div className="text-xs text-gray-400">{bill.subcategory}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formatCurrency(bill.finalAmount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Tax: {formatCurrency(bill.totalTax)}
                                </div>
                                {bill.balanceAmount > 0 && (
                                  <div className="text-sm text-orange-600">
                                    Due: {formatCurrency(bill.balanceAmount)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {bill.totalTds > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-green-600">
                                    {formatCurrency(bill.totalTds)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {bill.tdsEntries[0]?.section}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(bill.status)}>
                                {bill.status.replace('_', ' ')}
                              </Badge>
                              {bill.discrepancies.length > 0 && (
                                <div className="text-xs text-orange-600 mt-1">
                                  {bill.discrepancies.length} issue(s)
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDate(bill.dueDate)}
                              </div>
                              {new Date(bill.dueDate) < new Date() && bill.balanceAmount > 0 && (
                                <div className="text-xs text-red-600 mt-1">
                                  Overdue
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setShowBillDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditBill(bill)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {bill.approvalStatus === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApproveBill(bill.id)}
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRejectBill(bill.id)}
                                      className="text-red-600"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {bill.status === 'approved' && bill.balanceAmount > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePayBill(bill.id)}
                                    className="text-blue-600"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
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
                                      <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {bill.billNumber}? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteBill(bill.id)}
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

          <TabsContent value="approvals" className="space-y-6">
            {/* Approval Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>
                  Review and approve pending purchase bills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBills.filter(bill => bill.approvalStatus === 'pending').map((bill) => (
                    <div key={bill.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-lg">{bill.billNumber}</h3>
                            <Badge className={getBillTypeBadgeColor(bill.billType)}>
                              {bill.billType.replace('_', ' ')}
                            </Badge>
                            {bill.totalTds > 0 && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                TDS: {formatCurrency(bill.totalTds)}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Vendor: {bill.vendorName}</p>
                              <p className="text-gray-600">Category: {bill.category}</p>
                              <p className="text-gray-600">Due: {formatDate(bill.dueDate)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Amount: {formatCurrency(bill.finalAmount)}</p>
                              <p className="text-gray-600">Tax: {formatCurrency(bill.totalTax)}</p>
                              <p className="text-gray-600">Items: {bill.items.length}</p>
                            </div>
                            <div>
                              <p className="font-medium">Created: {formatDate(bill.createdDate)}</p>
                              {bill.ocrProcessed && (
                                <p className="text-gray-600">OCR: {bill.ocrConfidence?.toFixed(1)}%</p>
                              )}
                              {bill.isMatched && (
                                <p className="text-green-600">✓ Auto-matched</p>
                              )}
                            </div>
                          </div>

                          {/* Workflow Steps */}
                          <div className="mt-4">
                            <p className="font-medium mb-2">Approval Workflow:</p>
                            <div className="flex items-center">
                              {bill.workflowSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    step.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    step.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {step.status === 'approved' ? '✓' : 
                                     step.status === 'rejected' ? '✗' : 
                                     step.status === 'pending' ? '⏳' : index + 1}
                                  </div>
                                  <div className="ml-2 mr-4">
                                    <p className="text-xs font-medium">{step.stepName}</p>
                                    <p className="text-xs text-gray-500">{step.assignedTo}</p>
                                  </div>
                                  {index < bill.workflowSteps.length - 1 && (
                                    <div className="w-8 h-0.5 bg-gray-300 mr-4"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleApproveBill(bill.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectBill(bill.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBill(bill);
                              setShowBillDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredBills.filter(bill => bill.approvalStatus === 'pending').length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No pending approvals</p>
                      <p className="text-sm text-gray-400 mt-2">All bills have been processed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payment Processing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Management
                </CardTitle>
                <CardDescription>
                  Process payments and track payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredBills.filter(bill => bill.status === 'approved' && bill.balanceAmount > 0).length}
                    </div>
                    <div className="text-sm text-blue-600">Ready for Payment</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      Process Payments
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredBills.filter(bill => bill.status === 'paid').length}
                    </div>
                    <div className="text-sm text-green-600">Paid Bills</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Paid
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {filteredBills.filter(bill => new Date(bill.dueDate) < new Date() && bill.balanceAmount > 0).length}
                    </div>
                    <div className="text-sm text-orange-600">Overdue</div>
                    <Button size="sm" className="mt-2" variant="outline">
                      View Overdue
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Outstanding</span>
                        <span className="font-medium">
                          {formatCurrency(filteredBills.reduce((sum, bill) => sum + bill.balanceAmount, 0))}
                        </span>
                      </div>
                      <Progress 
                        value={75} 
                        className="h-2" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>TDS to be Deposited</span>
                        <span className="font-medium">{formatCurrency(stats.totalTds)}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bill Processing Trends
                  </CardTitle>
                  <CardDescription>
                    Track bill processing efficiency and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Analytics
                  </CardTitle>
                  <CardDescription>
                    Monitor spending patterns and tax implications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Financial analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* OCR Dialog */}
        <Dialog open={showOCRDialog} onOpenChange={setShowOCRDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                OCR Bill Processing
              </DialogTitle>
              <DialogDescription>
                Upload a bill image to extract data automatically using AI
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your bill image here or click to browse
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                Supported formats: JPG, PNG, PDF • Max size: 10MB
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOCRDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleOCRProcessing(new File([], 'mock.jpg'))}
                disabled={ocrLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {ocrLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Process with AI
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bill Form Dialog */}
        <Dialog open={showBillForm} onOpenChange={setShowBillForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBill ? 'Edit Purchase Bill' : 'Create New Bill'}
              </DialogTitle>
              <DialogDescription>
                {editingBill 
                  ? 'Update bill information and line items' 
                  : 'Create a new purchase bill with vendor and item details'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitBill} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Bill Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billNumber">Bill Number *</Label>
                    <Input
                      id="billNumber"
                      value={formData.billNumber}
                      onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                      placeholder="INV-2024-001"
                      required
                    />
                    {formErrors.billNumber && (
                      <p className="text-sm text-red-600">{formErrors.billNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billDate">Bill Date *</Label>
                    <Input
                      id="billDate"
                      type="date"
                      value={formData.billDate}
                      onChange={(e) => setFormData({...formData, billDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorId">Vendor *</Label>
                    <Select value={formData.vendorId} onValueChange={(value) => setFormData({...formData, vendorId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ABC Suppliers Pvt Ltd</SelectItem>
                        <SelectItem value="2">Tech Consultancy Services</SelectItem>
                        <SelectItem value="3">XYZ Corp</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.vendorId && (
                      <p className="text-sm text-red-600">{formErrors.vendorId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billType">Bill Type</Label>
                    <Select value={formData.billType} onValueChange={(value: 'goods' | 'services' | 'expense' | 'advance' | 'debit_note' | 'credit_note') => setFormData({...formData, billType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {billTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {billCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-sm text-red-600">{formErrors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      required
                    />
                    {formErrors.dueDate && (
                      <p className="text-sm text-red-600">{formErrors.dueDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Input
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                      placeholder="30 days"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      placeholder="Specific subcategory"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes about the bill..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowBillForm(false)}
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
                      {editingBill ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingBill ? 'Update Bill' : 'Create Bill'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bill Details Sheet */}
        <Sheet open={showBillDetails} onOpenChange={setShowBillDetails}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                {selectedBill?.billNumber}
              </SheetTitle>
              <SheetDescription>
                Complete bill details and compliance information
              </SheetDescription>
            </SheetHeader>

            {selectedBill && (
              <div className="space-y-6 mt-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bill Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Bill Number</Label>
                        <p className="font-medium">{selectedBill.billNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Vendor</Label>
                        <p className="font-medium">{selectedBill.vendorName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Bill Date</Label>
                        <p className="font-medium">{formatDate(selectedBill.billDate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Due Date</Label>
                        <p className="font-medium">{formatDate(selectedBill.dueDate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Type</Label>
                        <Badge className={getBillTypeBadgeColor(selectedBill.billType)}>
                          {selectedBill.billType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Status</Label>
                        <Badge className={getStatusBadgeColor(selectedBill.status)}>
                          {selectedBill.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Category</Label>
                        <p className="font-medium">{selectedBill.category}</p>
                      </div>
                      {selectedBill.subcategory && (
                        <div>
                          <Label className="text-sm text-gray-500">Subcategory</Label>
                          <p className="font-medium">{selectedBill.subcategory}</p>
                        </div>
                      )}
                      {selectedBill.poNumber && (
                        <div>
                          <Label className="text-sm text-gray-500">PO Number</Label>
                          <p className="font-medium">{selectedBill.poNumber}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm text-gray-500">Payment Terms</Label>
                        <p className="font-medium">{selectedBill.paymentTerms}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Amount Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Amount Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(selectedBill.subtotal)}</span>
                      </div>
                      {selectedBill.totalDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(selectedBill.totalDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax (CGST + SGST + IGST):</span>
                        <span className="font-medium">{formatCurrency(selectedBill.totalTax)}</span>
                      </div>
                      {selectedBill.totalTds > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>TDS Deducted:</span>
                          <span>-{formatCurrency(selectedBill.totalTds)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Final Amount:</span>
                        <span>{formatCurrency(selectedBill.finalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Paid:</span>
                        <span>{formatCurrency(selectedBill.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-orange-600">
                        <span>Balance:</span>
                        <span>{formatCurrency(selectedBill.balanceAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TDS Information */}
                {selectedBill.tdsEntries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">TDS Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedBill.tdsEntries.map((tds) => (
                          <div key={tds.id} className="border rounded p-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Section:</span>
                                <span className="font-medium ml-2">{tds.section}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Rate:</span>
                                <span className="font-medium ml-2">{tds.rate}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Taxable Amount:</span>
                                <span className="font-medium ml-2">{formatCurrency(tds.taxableAmount)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">TDS Amount:</span>
                                <span className="font-medium ml-2">{formatCurrency(tds.tdsAmount)}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Badge variant={tds.panAvailable ? 'default' : 'destructive'}>
                                {tds.panAvailable ? 'PAN Available' : 'PAN Not Available'}
                              </Badge>
                              <Badge variant={tds.certificateGenerated ? 'default' : 'secondary'}>
                                {tds.certificateGenerated ? 'Certificate Generated' : 'Certificate Pending'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Compliance Checks */}
                {selectedBill.complianceChecks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Checks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedBill.complianceChecks.map((check) => (
                          <div key={check.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">{check.checkType}</p>
                              <p className="text-sm text-gray-500">{check.message}</p>
                            </div>
                            <Badge variant={check.status === 'passed' ? 'default' : 
                                            check.status === 'failed' ? 'destructive' : 'secondary'}>
                              {check.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowBillDetails(false);
                      handleEditBill(selectedBill);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Bill
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedBill.status === 'approved' && selectedBill.balanceAmount > 0 && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handlePayBill(selectedBill.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default PurchaseBills; 