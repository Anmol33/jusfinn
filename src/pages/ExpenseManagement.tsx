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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  Calendar as CalendarIcon,
  User,
  Building2,
  Car,
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
  Brain,
  Plane,
  Hotel,
  Coffee,
  Fuel,
  Utensils,
  ShoppingBag,
  Briefcase,
  Smartphone,
  Wifi,
  Route,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ExpenseApiService } from '@/lib/expense.api';

interface ExpenseItem {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'digital' | 'reimbursement';
  vendor: string;
  location: string;
  purpose: string;
  isPersonal: boolean;
  receiptRequired: boolean;
  receiptAttached: boolean;
  receiptUrl?: string;
  mileage?: MileageDetail;
  perDiem?: PerDiemDetail;
  gstAmount?: number;
  gstNumber?: string;
  tdsApplicable: boolean;
  tdsAmount?: number;
  projectId?: string;
  clientId?: string;
  departmentId?: string;
  tags: string[];
  notes?: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  ocrProcessed: boolean;
  ocrConfidence?: number;
  policyCompliant: boolean;
  policyViolations?: PolicyViolation[];
  approvalRequired: boolean;
}

interface MileageDetail {
  fromLocation: string;
  toLocation: string;
  distance: number;
  vehicleType: 'car' | 'bike' | 'public_transport';
  ratePerKm: number;
  purpose: string;
  routeData?: {
    waypoints: string[];
    totalDistance: number;
    estimatedTime: number;
  };
}

interface PerDiemDetail {
  type: 'breakfast' | 'lunch' | 'dinner' | 'accommodation' | 'other';
  city: string;
  rateApplied: number;
  standardRate: number;
  daysCount: number;
  totalAmount: number;
}

interface PolicyViolation {
  id: string;
  type: 'amount_exceeded' | 'category_restricted' | 'receipt_missing' | 'approval_required' | 'documentation_incomplete';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: string;
}

interface ExpenseReport {
  id: string;
  reportNumber: string;
  title: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reportDate: string;
  fromDate: string;
  toDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid' | 'partially_paid';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  items: ExpenseItem[];
  totalAmount: number;
  totalMileage: number;
  totalPerDiem: number;
  totalReimbursable: number;
  totalNonReimbursable: number;
  totalGst: number;
  totalTds: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  advanceAdjusted?: number;
  notes?: string;
  attachments: string[];
  workflowSteps: WorkflowStep[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
  exchangeRates?: Record<string, number>;
  policyChecks: PolicyCheck[];
  auditTrail: AuditEntry[];
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

interface PolicyCheck {
  id: string;
  checkType: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  checkDate: string;
}

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

interface ExpenseStats {
  total: number;
  pendingApproval: number;
  approved: number;
  paid: number;
  totalAmount: number;
  averageAmount: number;
  monthlySpend: number;
  mileageTotal: number;
  ocrAccuracy: number;
  monthlyTrend: number;
}

interface ExpenseFormData {
  date: Date;
  category: string;
  subcategory: string;
  description: string;
  amount: string;
  currency: string;
  paymentMethod: 'cash' | 'card' | 'digital' | 'reimbursement';
  vendor: string;
  location: string;
  purpose: string;
  isPersonal: boolean;
  receiptRequired: boolean;
  projectId: string;
  clientId: string;
  notes: string;
  tags: string[];
}

const ExpenseManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [showReceiptCapture, setShowReceiptCapture] = useState(false);
  const [showMileageTracker, setShowMileageTracker] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ExpenseReport[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState<ExpenseStats>({
    total: 0,
    pendingApproval: 0,
    approved: 0,
    paid: 0,
    totalAmount: 0,
    averageAmount: 0,
    monthlySpend: 0,
    mileageTotal: 0,
    ocrAccuracy: 0,
    monthlyTrend: 0
  });

  // Form state
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date(),
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    currency: 'INR',
    paymentMethod: 'card',
    vendor: '',
    location: '',
    purpose: '',
    isPersonal: false,
    receiptRequired: true,
    projectId: '',
    clientId: '',
    notes: '',
    tags: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Constants
  const expenseCategories = [
    { value: 'travel', label: 'Travel', subcategories: ['Flight', 'Train', 'Bus', 'Taxi', 'Car Rental', 'Accommodation', 'Visa', 'Insurance'] },
    { value: 'meals', label: 'Meals & Entertainment', subcategories: ['Breakfast', 'Lunch', 'Dinner', 'Client Entertainment', 'Team Lunch', 'Conference Meals'] },
    { value: 'office', label: 'Office Expenses', subcategories: ['Stationery', 'Software', 'Equipment', 'Furniture', 'Supplies', 'Utilities'] },
    { value: 'communication', label: 'Communication', subcategories: ['Mobile', 'Internet', 'Postage', 'Courier', 'Phone Bills'] },
    { value: 'training', label: 'Training & Development', subcategories: ['Courses', 'Certification', 'Books', 'Conferences', 'Seminars'] },
    { value: 'marketing', label: 'Marketing', subcategories: ['Advertising', 'Promotional', 'Events', 'Website', 'SEO'] },
    { value: 'professional', label: 'Professional Services', subcategories: ['Legal', 'Accounting', 'Consulting', 'Audit', 'Tax'] },
    { value: 'maintenance', label: 'Maintenance', subcategories: ['Equipment', 'Vehicle', 'Office', 'IT', 'Facility'] },
    { value: 'fuel', label: 'Fuel & Mileage', subcategories: ['Petrol', 'Diesel', 'Parking', 'Tolls', 'Mileage'] },
    { value: 'other', label: 'Other', subcategories: ['Miscellaneous', 'Sundry', 'Emergency', 'Petty Cash'] }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'digital', label: 'Digital Payment', icon: '📱' },
    { value: 'reimbursement', label: 'Reimbursement', icon: '🔄' }
  ];

  const mileageRates = {
    car: 18, // Rs per km
    bike: 5,
    public_transport: 2
  };

  const perDiemRates = {
    metro: { breakfast: 150, lunch: 250, dinner: 300, accommodation: 2000 },
    tier1: { breakfast: 125, lunch: 200, dinner: 250, accommodation: 1500 },
    tier2: { breakfast: 100, lunch: 150, dinner: 200, accommodation: 1000 },
    tier3: { breakfast: 75, lunch: 125, dinner: 150, accommodation: 750 }
  };

  // Load data
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      // Mock expenses data
      const mockExpenses: ExpenseItem[] = [
        {
          id: '1',
          date: '2024-03-01',
          category: 'travel',
          subcategory: 'Flight',
          description: 'Flight to Mumbai for client meeting',
          amount: 8500,
          currency: 'INR',
          paymentMethod: 'card',
          vendor: 'IndiGo Airlines',
          location: 'Mumbai',
          purpose: 'Client Meeting - Project ABC',
          isPersonal: false,
          receiptRequired: true,
          receiptAttached: true,
          receiptUrl: '/receipts/flight-001.pdf',
          gstAmount: 1530,
          gstNumber: '07AAACI2687Q1ZB',
          tdsApplicable: false,
          projectId: 'PRJ-001',
          clientId: 'CLI-001',
          departmentId: 'SALES',
          tags: ['business-travel', 'client-meeting'],
          notes: 'Return flight for project kickoff meeting',
          gpsLocation: {
            latitude: 19.0760,
            longitude: 72.8777,
            address: 'Mumbai International Airport'
          },
          ocrProcessed: true,
          ocrConfidence: 96.5,
          policyCompliant: true,
          policyViolations: [],
          approvalRequired: true
        },
        {
          id: '2',
          date: '2024-03-02',
          category: 'meals',
          subcategory: 'Client Entertainment',
          description: 'Lunch with client team',
          amount: 2400,
          currency: 'INR',
          paymentMethod: 'card',
          vendor: 'The Oberoi Restaurant',
          location: 'Mumbai',
          purpose: 'Client Relationship',
          isPersonal: false,
          receiptRequired: true,
          receiptAttached: true,
          receiptUrl: '/receipts/lunch-001.jpg',
          gstAmount: 432,
          tdsApplicable: false,
          projectId: 'PRJ-001',
          clientId: 'CLI-001',
          departmentId: 'SALES',
          tags: ['client-entertainment', 'meals'],
          ocrProcessed: true,
          ocrConfidence: 89.2,
          policyCompliant: false,
          policyViolations: [
            {
              id: '1',
              type: 'amount_exceeded',
              message: 'Meal amount exceeds policy limit of ₹2000',
              severity: 'medium',
              suggestedAction: 'Get manager approval for amount above policy'
            }
          ],
          approvalRequired: true
        },
        {
          id: '3',
          date: '2024-03-03',
          category: 'fuel',
          subcategory: 'Mileage',
          description: 'Travel to client office and back',
          amount: 540,
          currency: 'INR',
          paymentMethod: 'reimbursement',
          vendor: 'Self',
          location: 'Pune to Mumbai',
          purpose: 'Client Visit',
          isPersonal: false,
          receiptRequired: false,
          receiptAttached: false,
          mileage: {
            fromLocation: 'Pune Office',
            toLocation: 'Mumbai Client Office',
            distance: 30,
            vehicleType: 'car',
            ratePerKm: 18,
            purpose: 'Client meeting and project discussion',
            routeData: {
              waypoints: ['Pune', 'Highway', 'Mumbai'],
              totalDistance: 30,
              estimatedTime: 120
            }
          },
          tdsApplicable: false,
          projectId: 'PRJ-001',
          departmentId: 'SALES',
          tags: ['mileage', 'client-visit'],
          ocrProcessed: false,
          policyCompliant: true,
          approvalRequired: false
        }
      ];

      // Mock reports data
      const mockReports: ExpenseReport[] = [
        {
          id: '1',
          reportNumber: 'EXP-2024-001',
          title: 'Mumbai Business Trip - March 2024',
          employeeId: 'EMP-001',
          employeeName: 'Rahul Sharma',
          department: 'Sales',
          reportDate: '2024-03-05',
          fromDate: '2024-03-01',
          toDate: '2024-03-03',
          status: 'submitted',
          approvalStatus: 'pending',
          items: mockExpenses,
          totalAmount: 11440,
          totalMileage: 30,
          totalPerDiem: 0,
          totalReimbursable: 11440,
          totalNonReimbursable: 0,
          totalGst: 1962,
          totalTds: 0,
          paidAmount: 0,
          balanceAmount: 11440,
          notes: 'Business trip expenses for Project ABC kickoff',
          attachments: ['/reports/exp-2024-001.pdf'],
          workflowSteps: [
            {
              id: '1',
              stepName: 'Manager Approval',
              assignedTo: 'Sales Manager',
              status: 'pending',
              order: 1,
              isRequired: true
            },
            {
              id: '2',
              stepName: 'Finance Review',
              assignedTo: 'Finance Team',
              status: 'pending',
              order: 2,
              isRequired: true
            }
          ],
          createdBy: 'EMP-001',
          createdDate: '2024-03-05',
          lastModified: '2024-03-05',
          modifiedBy: 'EMP-001',
          exchangeRates: { 'USD': 83.15, 'EUR': 90.25 },
          policyChecks: [
            {
              id: '1',
              checkType: 'Amount Validation',
              status: 'warning',
              message: 'One meal expense exceeds policy limit',
              checkDate: '2024-03-05'
            },
            {
              id: '2',
              checkType: 'Receipt Validation',
              status: 'passed',
              message: 'All required receipts attached',
              checkDate: '2024-03-05'
            }
          ],
          auditTrail: [
            {
              id: '1',
              action: 'Report Created',
              performedBy: 'Rahul Sharma',
              timestamp: '2024-03-05T10:00:00Z',
              details: 'Expense report created with 3 items'
            },
            {
              id: '2',
              action: 'Report Submitted',
              performedBy: 'Rahul Sharma',
              timestamp: '2024-03-05T14:30:00Z',
              details: 'Report submitted for approval'
            }
          ]
        }
      ];

      setExpenses(mockExpenses);
      setReports(mockReports);
      setFilteredExpenses(mockExpenses);
      setFilteredReports(mockReports);

      // Calculate stats
      const totalAmount = mockReports.reduce((sum, report) => sum + report.totalAmount, 0);
      const pendingApproval = mockReports.filter(report => report.approvalStatus === 'pending').length;
      const approved = mockReports.filter(report => report.approvalStatus === 'approved').length;
      const paid = mockReports.filter(report => report.status === 'paid').length;
      const totalMileage = mockReports.reduce((sum, report) => sum + report.totalMileage, 0);
      const avgOcrAccuracy = mockExpenses.filter(exp => exp.ocrProcessed).reduce((sum, exp) => sum + (exp.ocrConfidence || 0), 0) / mockExpenses.filter(exp => exp.ocrProcessed).length;

      setStats({
        total: mockReports.length,
        pendingApproval,
        approved,
        paid,
        totalAmount,
        averageAmount: totalAmount / mockReports.length,
        monthlySpend: totalAmount,
        mileageTotal: totalMileage,
        ocrAccuracy: avgOcrAccuracy || 0,
        monthlyTrend: 15.8
      });

      toast({
        title: 'Success',
        description: 'Expenses loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load expenses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter data
  const applyFilters = useCallback(() => {
    let filteredExp = expenses;
    let filteredRep = reports;

    if (searchTerm) {
      filteredExp = filteredExp.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      filteredRep = filteredRep.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filteredRep = filteredRep.filter(report => report.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filteredExp = filteredExp.filter(expense => expense.category === categoryFilter);
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
      
      filteredExp = filteredExp.filter(expense => new Date(expense.date) >= filterDate);
      filteredRep = filteredRep.filter(report => new Date(report.reportDate) >= filterDate);
    }

    setFilteredExpenses(filteredExp);
    setFilteredReports(filteredRep);
  }, [expenses, reports, searchTerm, statusFilter, categoryFilter, dateFilter]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      date: new Date(),
      category: '',
      subcategory: '',
      description: '',
      amount: '',
      currency: 'INR',
      paymentMethod: 'card',
      vendor: '',
      location: '',
      purpose: '',
      isPersonal: false,
      receiptRequired: true,
      projectId: '',
      clientId: '',
      notes: '',
      tags: []
    });
    setFormErrors({});
  };

  const handleCreateExpense = () => {
    resetForm();
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    setFormData({
      date: new Date(expense.date),
      category: expense.category,
      subcategory: expense.subcategory,
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      paymentMethod: expense.paymentMethod,
      vendor: expense.vendor,
      location: expense.location,
      purpose: expense.purpose,
      isPersonal: expense.isPersonal,
      receiptRequired: expense.receiptRequired,
      projectId: expense.projectId || '',
      clientId: expense.clientId || '',
      notes: expense.notes || '',
      tags: expense.tags
    });
    setEditingExpense(expense);
    setFormErrors({});
    setShowExpenseForm(true);
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
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
      // Calculate tax amounts (simplified calculation - 18% GST split as 9% CGST + 9% SGST for intrastate)
      const amount = parseFloat(formData.amount);
      const cgstAmount = amount * 0.09; // 9% CGST
      const sgstAmount = amount * 0.09; // 9% SGST
      const totalAmount = amount + cgstAmount + sgstAmount;

      // Prepare expense data for backend API
      const expenseApiData = {
        expense_date: format(formData.date, 'yyyy-MM-dd'),
        description: formData.description,
        amount: amount,
        category_id: getCategoryId(formData.category),
        payment_mode: formData.paymentMethod,
        vendor_id: formData.vendor ? getVendorId(formData.vendor) : undefined,
        cgst_amount: cgstAmount,
        sgst_amount: sgstAmount,
        igst_amount: 0, // For intrastate transactions
        tds_amount: 0, // Calculate if applicable
        total_amount: totalAmount,
        receipt_number: `RCP-${Date.now()}`, // Generate receipt number
        notes: `${formData.purpose} | ${formData.notes}`.trim(),
        approval_status: 'pending',
        reimbursement_status: formData.isPersonal ? 'pending' : 'not_applicable'
      };

      let savedExpense;
      if (editingExpense) {
        // Update existing expense via backend API
        savedExpense = await ExpenseApiService.updateExpense(editingExpense.id, expenseApiData);
        toast({
          title: 'Success',
          description: 'Expense updated successfully',
        });
      } else {
        // Create new expense via backend API
        savedExpense = await ExpenseApiService.createExpense(expenseApiData);
        toast({
          title: 'Success',
          description: 'Expense created successfully',
        });
      }

      // Reload expenses from backend to ensure UI is in sync
      await loadExpenses();

      setShowExpenseForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: 'Error',
        description: `Failed to save expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to map category to ID
  const getCategoryId = (category: string): number => {
    const categoryMap: Record<string, number> = {
      'office_supplies': 1,
      'travel': 2,
      'meals': 3,
      'fuel': 4,
      'utilities': 5,
      'rent': 6,
      'professional_fees': 7,
      'marketing': 8,
      'other': 9
    };
    return categoryMap[category] || 9;
  };

  // Helper function to get vendor ID
  const getVendorId = (vendorName: string): string => {
    // This would typically come from a vendors list or search
    // For now, return a placeholder - this should be enhanced
    return '1';
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = 'Valid amount is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.vendor.trim()) errors.vendor = 'Vendor is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApproveExpense = async (expenseId: string) => {
    try {
      // Approve expense via backend API
      await ExpenseApiService.approveExpense(expenseId, 'approve');
      
      // Reload expenses from backend to ensure UI is in sync
      await loadExpenses();
      
      toast({
        title: 'Success',
        description: 'Expense approved successfully',
      });
    } catch (error) {
      console.error('Error approving expense:', error);
      toast({
        title: 'Error',
        description: `Failed to approve expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleRejectExpense = async (expenseId: string) => {
    try {
      // Reject expense via backend API
      await ExpenseApiService.approveExpense(expenseId, 'reject', 'Rejected by user');
      
      // Reload expenses from backend to ensure UI is in sync
      await loadExpenses();
      
      toast({
        title: 'Success',
        description: 'Expense rejected successfully',
      });
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast({
        title: 'Error',
        description: `Failed to reject expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      // Delete expense via backend API
      await ExpenseApiService.deleteExpense(expenseId);
      
      // Reload expenses from backend to ensure UI is in sync
      await loadExpenses();
      
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'Error',
        description: `Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleReceiptCapture = async (file: File) => {
    try {
      // Mock OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOCRData = {
        vendor: 'Auto-detected Vendor',
        amount: Math.floor(Math.random() * 5000) + 100,
        date: new Date().toISOString().split('T')[0],
        category: 'meals',
        confidence: 94.2
      };

      setFormData(prev => ({
        ...prev,
        vendor: mockOCRData.vendor,
        amount: mockOCRData.amount.toString(),
        date: new Date(mockOCRData.date),
        category: mockOCRData.category
      }));

      toast({
        title: 'Receipt Processed',
        description: `Data extracted with ${mockOCRData.confidence}% confidence`,
      });
      
      setShowReceiptCapture(false);
      setShowExpenseForm(true);
    } catch (error) {
      toast({
        title: 'Processing Failed',
        description: 'Failed to extract data from receipt',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partially_paid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="h-4 w-4" />;
      case 'meals': return <Utensils className="h-4 w-4" />;
      case 'office': return <Briefcase className="h-4 w-4" />;
      case 'communication': return <Smartphone className="h-4 w-4" />;
      case 'fuel': return <Fuel className="h-4 w-4" />;
      case 'training': return <Award className="h-4 w-4" />;
      case 'marketing': return <Target className="h-4 w-4" />;
      case 'professional': return <FileCheck className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Effects
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Expense Management - JusFinn</title>
        <meta name="description" content="Comprehensive expense management with receipt capture, mileage tracking and automated workflows" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Expense Management
            </h1>
            <p className="text-gray-600 mt-1">
              Smart expense tracking with receipt capture, mileage tracking, and policy compliance
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowReceiptCapture(true)}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Scan Receipt
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowMileageTracker(true)}
              className="flex items-center gap-2"
            >
              <Route className="h-4 w-4" />
              Track Mileage
            </Button>
            <Button 
              onClick={handleCreateExpense}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {formatCurrency(stats.totalAmount)} value
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
                    Awaiting review
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
                  <p className="text-green-600 text-sm font-medium">Mileage Tracked</p>
                  <p className="text-2xl font-bold text-green-900">{stats.mileageTotal} km</p>
                  <p className="text-xs text-green-600 mt-1">
                    This month
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="list">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="mileage">Mileage</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search Expenses</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by description, vendor, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {expenseCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
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
              </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Expenses ({filteredExpenses.length})</span>
                  <div className="flex gap-2">
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
                    Loading expenses...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Receipt</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExpenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>
                              <div className="text-sm">
                                {formatDate(expense.date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{expense.description}</div>
                                <div className="text-sm text-gray-500">{expense.purpose}</div>
                                {expense.location && (
                                  <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {expense.location}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(expense.category)}
                                <div>
                                  <div className="font-medium capitalize">{expense.category}</div>
                                  <div className="text-sm text-gray-500">{expense.subcategory}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formatCurrency(expense.amount, expense.currency)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {paymentMethods.find(pm => pm.value === expense.paymentMethod)?.label}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{expense.vendor}</div>
                              {expense.gstNumber && (
                                <div className="text-xs text-gray-500">GST: {expense.gstNumber}</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {expense.receiptAttached ? (
                                  <Badge variant="default" className="text-xs">
                                    <FileCheck className="h-3 w-3 mr-1" />
                                    Attached
                                  </Badge>
                                ) : expense.receiptRequired ? (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    Not Required
                                  </Badge>
                                )}
                                {expense.ocrProcessed && (
                                  <div className="text-xs text-green-600">
                                    OCR: {expense.ocrConfidence?.toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {expense.policyCompliant ? (
                                  <Badge variant="default" className="text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Compliant
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Policy Issue
                                  </Badge>
                                )}
                                {expense.approvalRequired && (
                                  <div className="text-xs text-orange-600">
                                    Approval Required
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedExpense(expense);
                                    setShowExpenseDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditExpense(expense)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {expense.approvalRequired && !expense.policyCompliant && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApproveExpense(expense.id)}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
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
                                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this expense? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteExpense(expense.id)}
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

          <TabsContent value="reports" className="space-y-6">
            {/* Expense Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Expense Reports ({filteredReports.length})</span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowReportForm(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Report
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <Badge className={getStatusBadgeColor(report.status)}>
                              {report.status.replace('_', ' ')}
                            </Badge>
                            {report.policyChecks.some(check => check.status === 'warning') && (
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Policy Warning
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Employee: {report.employeeName}</p>
                              <p className="text-gray-600">Department: {report.department}</p>
                              <p className="text-gray-600">Report: {report.reportNumber}</p>
                            </div>
                            <div>
                              <p className="font-medium">Period</p>
                              <p className="text-gray-600">{formatDate(report.fromDate)} to {formatDate(report.toDate)}</p>
                              <p className="text-gray-600">Items: {report.items.length}</p>
                            </div>
                            <div>
                              <p className="font-medium">Amount: {formatCurrency(report.totalAmount)}</p>
                              <p className="text-gray-600">Reimbursable: {formatCurrency(report.totalReimbursable)}</p>
                              <p className="text-gray-600">Balance: {formatCurrency(report.balanceAmount)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Mileage: {report.totalMileage} km</p>
                              <p className="text-gray-600">GST: {formatCurrency(report.totalGst)}</p>
                              <p className="text-gray-600">Created: {formatDate(report.createdDate)}</p>
                            </div>
                          </div>

                          {/* Workflow Progress */}
                          <div className="mt-4">
                            <p className="font-medium mb-2">Approval Progress:</p>
                            <div className="flex items-center gap-2">
                              {report.workflowSteps.map((step, index) => (
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
                                  {index < report.workflowSteps.length - 1 && (
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
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mileage" className="space-y-6">
            {/* Mileage Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Mileage Tracking
                </CardTitle>
                <CardDescription>
                  Track your vehicle usage and calculate mileage reimbursements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.mileageTotal} km
                    </div>
                    <div className="text-sm text-blue-600">Total Distance</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(stats.mileageTotal * mileageRates.car)} reimbursement
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{mileageRates.car}/km
                    </div>
                    <div className="text-sm text-green-600">Car Rate</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ₹{mileageRates.bike}/km bike • ₹{mileageRates.public_transport}/km public
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {filteredExpenses.filter(exp => exp.mileage).length}
                    </div>
                    <div className="text-sm text-purple-600">Mileage Claims</div>
                    <div className="text-xs text-gray-500 mt-1">
                      This month
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Mileage Claims</h3>
                  <div className="space-y-3">
                    {filteredExpenses.filter(exp => exp.mileage).map((expense) => (
                      <div key={expense.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Car className="h-5 w-5 text-blue-600" />
                              <h4 className="font-medium">{expense.description}</h4>
                              <Badge variant="outline">{expense.mileage?.vehicleType}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Route:</p>
                                <p className="font-medium">{expense.mileage?.fromLocation} → {expense.mileage?.toLocation}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Distance:</p>
                                <p className="font-medium">{expense.mileage?.distance} km</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Reimbursement:</p>
                                <p className="font-medium">{formatCurrency(expense.amount)}</p>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2">{expense.mileage?.purpose}</p>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            {formatDate(expense.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {/* Policy Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Expense Policies
                </CardTitle>
                <CardDescription>
                  Configure and monitor expense policy compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Policy Limits</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Meal Limit (per day)</p>
                            <p className="text-sm text-gray-600">Individual meals and team entertainment</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹2,000</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Travel Approval Threshold</p>
                            <p className="text-sm text-gray-600">Requires manager approval</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹5,000</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">Receipt Required</p>
                            <p className="text-sm text-gray-600">Mandatory for amounts above</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹500</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Policy Compliant</span>
                          </div>
                          <p className="text-sm text-green-700">
                            {filteredExpenses.filter(exp => exp.policyCompliant).length} of {filteredExpenses.length} expenses
                          </p>
                        </div>
                        
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Policy Violations</span>
                          </div>
                          <p className="text-sm text-orange-700">
                            {filteredExpenses.filter(exp => !exp.policyCompliant).length} expenses need review
                          </p>
                        </div>
                        
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Pending Approval</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            {filteredExpenses.filter(exp => exp.approvalRequired).length} expenses awaiting approval
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Policy Violations</h3>
                    <div className="space-y-3">
                      {filteredExpenses
                        .filter(exp => !exp.policyCompliant && exp.policyViolations)
                        .slice(0, 3)
                        .map((expense) => (
                          <div key={expense.id} className="border rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-sm text-gray-600">{expense.vendor} • {formatCurrency(expense.amount)}</p>
                                {expense.policyViolations?.map((violation) => (
                                  <div key={violation.id} className="mt-2">
                                    <Badge variant="destructive" className="text-xs">
                                      {violation.type.replace('_', ' ')}
                                    </Badge>
                                    <p className="text-sm text-red-600 mt-1">{violation.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{violation.suggestedAction}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(expense.date)}
                              </div>
                            </div>
                          </div>
                        ))}
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
                  <CardTitle>Expense Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Growth</span>
                      <span className="font-medium text-green-600">+{stats.monthlyTrend}%</span>
                    </div>
                    <Progress value={stats.monthlyTrend} className="h-3" />
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(stats.averageAmount)}
                        </div>
                        <div className="text-sm text-blue-600">Avg Expense</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {stats.ocrAccuracy.toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-600">OCR Accuracy</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseCategories.slice(0, 5).map((category, index) => {
                      const categoryExpenses = filteredExpenses.filter(exp => exp.category === category.value);
                      const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                      const percentage = stats.totalAmount > 0 ? (categoryTotal / stats.totalAmount) * 100 : 0;
                      
                      return (
                        <div key={category.value} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category.value)}
                            <span className="text-sm">{category.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Receipt Capture Dialog */}
        <Dialog open={showReceiptCapture} onOpenChange={setShowReceiptCapture}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Receipt Capture
              </DialogTitle>
              <DialogDescription>
                Capture or upload a receipt to automatically extract expense data
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Take a photo or upload receipt image
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Supported formats: JPG, PNG, PDF • Max size: 10MB
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReceiptCapture(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleReceiptCapture(new File([], 'mock.jpg'))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                Process Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Expense Form Dialog */}
        <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </DialogTitle>
              <DialogDescription>
                {editingExpense 
                  ? 'Update expense information and details' 
                  : 'Create a new expense entry with all required details'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitExpense} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Expense Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({...formData, date: date || new Date()})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value, subcategory: ''})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-sm text-red-600">{formErrors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select 
                      value={formData.subcategory} 
                      onValueChange={(value) => setFormData({...formData, subcategory: value})}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && expenseCategories
                          .find(cat => cat.value === formData.category)
                          ?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the expense"
                      required
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-600">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="flex gap-2">
                      <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="0.00"
                        className="flex-1"
                        required
                      />
                    </div>
                    {formErrors.amount && (
                      <p className="text-sm text-red-600">{formErrors.amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData({...formData, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.icon} {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor *</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      placeholder="Vendor/Merchant name"
                      required
                    />
                    {formErrors.vendor && (
                      <p className="text-sm text-red-600">{formErrors.vendor}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="City or address"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="purpose">Business Purpose</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      placeholder="Business justification for this expense"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPersonal"
                      checked={formData.isPersonal}
                      onCheckedChange={(checked) => setFormData({...formData, isPersonal: !!checked})}
                    />
                    <Label htmlFor="isPersonal" className="text-sm">Personal expense (non-reimbursable)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="receiptRequired"
                      checked={formData.receiptRequired}
                      onCheckedChange={(checked) => setFormData({...formData, receiptRequired: !!checked})}
                    />
                    <Label htmlFor="receiptRequired" className="text-sm">Receipt required</Label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project</Label>
                    <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRJ-001">Project ABC</SelectItem>
                        <SelectItem value="PRJ-002">Project XYZ</SelectItem>
                        <SelectItem value="PRJ-003">Internal Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData({...formData, clientId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLI-001">Client A Corp</SelectItem>
                        <SelectItem value="CLI-002">Client B Ltd</SelectItem>
                        <SelectItem value="CLI-003">Client C Inc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes or comments..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowExpenseForm(false)}
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
                      {editingExpense ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingExpense ? 'Update Expense' : 'Create Expense'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Expense Details Sheet */}
        <Sheet open={showExpenseDetails} onOpenChange={setShowExpenseDetails}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Expense Details
              </SheetTitle>
              <SheetDescription>
                Complete expense information and compliance status
              </SheetDescription>
            </SheetHeader>

            {selectedExpense && (
              <div className="space-y-6 mt-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Date</Label>
                        <p className="font-medium">{formatDate(selectedExpense.date)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Amount</Label>
                        <p className="font-medium">{formatCurrency(selectedExpense.amount, selectedExpense.currency)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Category</Label>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(selectedExpense.category)}
                          <p className="font-medium capitalize">{selectedExpense.category}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Subcategory</Label>
                        <p className="font-medium">{selectedExpense.subcategory}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-gray-500">Description</Label>
                        <p className="font-medium">{selectedExpense.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Vendor</Label>
                        <p className="font-medium">{selectedExpense.vendor}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Payment Method</Label>
                        <p className="font-medium">{paymentMethods.find(pm => pm.value === selectedExpense.paymentMethod)?.label}</p>
                      </div>
                    </div>

                    {selectedExpense.location && (
                      <div>
                        <Label className="text-sm text-gray-500">Location</Label>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedExpense.location}
                        </p>
                      </div>
                    )}

                    {selectedExpense.purpose && (
                      <div>
                        <Label className="text-sm text-gray-500">Business Purpose</Label>
                        <p className="font-medium">{selectedExpense.purpose}</p>
                      </div>
                    )}

                    {selectedExpense.notes && (
                      <div>
                        <Label className="text-sm text-gray-500">Notes</Label>
                        <p className="text-sm">{selectedExpense.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Compliance & Policy */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Policy Compliance</span>
                        <Badge variant={selectedExpense.policyCompliant ? 'default' : 'destructive'}>
                          {selectedExpense.policyCompliant ? 'Compliant' : 'Violation'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Receipt Status</span>
                        <Badge variant={selectedExpense.receiptAttached ? 'default' : selectedExpense.receiptRequired ? 'destructive' : 'secondary'}>
                          {selectedExpense.receiptAttached ? 'Attached' : selectedExpense.receiptRequired ? 'Required' : 'Not Required'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Approval Required</span>
                        <Badge variant={selectedExpense.approvalRequired ? 'secondary' : 'default'}>
                          {selectedExpense.approvalRequired ? 'Yes' : 'No'}
                        </Badge>
                      </div>

                      {selectedExpense.ocrProcessed && (
                        <div className="flex items-center justify-between">
                          <span>OCR Processed</span>
                          <div className="text-sm">
                            <Badge variant="default">
                              <Brain className="h-3 w-3 mr-1" />
                              {selectedExpense.ocrConfidence?.toFixed(1)}% confidence
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedExpense.policyViolations && selectedExpense.policyViolations.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm text-gray-500">Policy Violations</Label>
                        <div className="space-y-2 mt-2">
                          {selectedExpense.policyViolations.map((violation) => (
                            <div key={violation.id} className="border rounded p-3 bg-red-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-red-800 capitalize">{violation.type.replace('_', ' ')}</p>
                                  <p className="text-sm text-red-600">{violation.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{violation.suggestedAction}</p>
                                </div>
                                <Badge variant="destructive" className="text-xs">
                                  {violation.severity}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mileage Details */}
                {selectedExpense.mileage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mileage Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">From</Label>
                            <p className="font-medium">{selectedExpense.mileage.fromLocation}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">To</Label>
                            <p className="font-medium">{selectedExpense.mileage.toLocation}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Distance</Label>
                            <p className="font-medium">{selectedExpense.mileage.distance} km</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Vehicle Type</Label>
                            <p className="font-medium capitalize">{selectedExpense.mileage.vehicleType.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Rate</Label>
                            <p className="font-medium">₹{selectedExpense.mileage.ratePerKm}/km</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Total Reimbursement</Label>
                            <p className="font-medium">{formatCurrency(selectedExpense.amount)}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Purpose</Label>
                          <p className="text-sm">{selectedExpense.mileage.purpose}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowExpenseDetails(false);
                      handleEditExpense(selectedExpense);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Expense
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  {selectedExpense.approvalRequired && !selectedExpense.policyCompliant && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleApproveExpense(selectedExpense.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Mileage Tracker Dialog */}
        <Dialog open={showMileageTracker} onOpenChange={setShowMileageTracker}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Mileage Tracker
              </DialogTitle>
              <DialogDescription>
                Track your vehicle usage and calculate mileage reimbursement
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromLocation">From Location *</Label>
                  <Input
                    id="fromLocation"
                    placeholder="Starting location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toLocation">To Location *</Label>
                  <Input
                    id="toLocation"
                    placeholder="Destination"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Select defaultValue="car">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (₹{mileageRates.car}/km)</SelectItem>
                      <SelectItem value="bike">Bike (₹{mileageRates.bike}/km)</SelectItem>
                      <SelectItem value="public_transport">Public Transport (₹{mileageRates.public_transport}/km)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km) *</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileagePurpose">Business Purpose *</Label>
                <Textarea
                  id="mileagePurpose"
                  placeholder="Describe the business purpose of this travel..."
                  rows={3}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Reimbursement Calculation</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Distance:</p>
                    <p className="font-medium">- km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rate:</p>
                    <p className="font-medium">₹-/km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total:</p>
                    <p className="font-medium text-blue-600">₹-</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMileageTracker(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Mileage Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExpenseManagement; 