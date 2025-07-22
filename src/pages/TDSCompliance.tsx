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
  Percent,
  BookOpen,
  Scale,
  Landmark,
  GraduationCap,
  Banknote,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TDSSection {
  section: string;
  description: string;
  category: 'salary' | 'professional' | 'contractor' | 'interest' | 'rent' | 'commission' | 'other';
  rate: number;
  thresholdLimit: number;
  exemptionLimit?: number;
  isActive: boolean;
  applicableFrom: string;
  applicableTo?: string;
  panRequired: boolean;
  form16Required: boolean;
  quarterlyReturn: string; // Form name for quarterly return
  annualReturn: string; // Form name for annual return
}

interface TDSDeduction {
  id: string;
  deducteeId: string;
  deducteeName: string;
  deducteePan?: string;
  deducteeAddress: string;
  section: string;
  paymentDate: string;
  paymentAmount: number;
  tdsRate: number;
  tdsAmount: number;
  surcharge: number;
  educationCess: number;
  totalTdsDeducted: number;
  netPayment: number;
  paymentNature: string;
  certificateNumber?: string;
  certificateGenerated: boolean;
  certificateDate?: string;
  challanNumber?: string;
  challanDate?: string;
  challanAmount?: number;
  bankName?: string;
  bsrCode?: string;
  quarterlyReturn: string;
  financialYear: string;
  assessmentYear: string;
  isLate: boolean;
  penaltyApplicable: boolean;
  penaltyAmount?: number;
  interestApplicable: boolean;
  interestAmount?: number;
  remarks?: string;
  complianceStatus: 'compliant' | 'pending' | 'defaulted' | 'rectified';
  auditTrail: AuditEntry[];
  attachments: string[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  modifiedBy: string;
}

interface TDSCertificate {
  id: string;
  certificateNumber: string;
  deductionId: string;
  deducteeName: string;
  deducteePan?: string;
  section: string;
  financialYear: string;
  assessmentYear: string;
  quarter: string;
  issuedDate: string;
  validTill: string;
  status: 'draft' | 'issued' | 'revised' | 'cancelled';
  revisionNumber?: number;
  originalCertificateId?: string;
  certificateType: 'form16' | 'form16a' | 'form16b' | 'form16c';
  digitalSignature: boolean;
  downloadCount: number;
  lastDownloaded?: string;
  certificationDetails: {
    grossAmount: number;
    tdsDeducted: number;
    netAmount: number;
    rate: number;
    surcharge: number;
    educationCess: number;
  };
}

interface TDSChallan {
  id: string;
  challanNumber: string;
  paymentDate: string;
  depositDate: string;
  bankName: string;
  bsrCode: string;
  amount: number;
  financialYear: string;
  quarter: string;
  taxType: '200' | '194' | '206' | '207'; // ITR sections
  paymentMode: 'online' | 'offline';
  transactionReference?: string;
  status: 'paid' | 'pending' | 'failed' | 'cancelled';
  acknowledgmentNumber?: string;
  receiptNumber?: string;
  lateFee?: number;
  interest?: number;
  penalty?: number;
  totalAmount: number;
  deductions: string[]; // Array of deduction IDs covered by this challan
  complianceScore: number;
  notes?: string;
  attachments: string[];
}

interface TDSReturn {
  id: string;
  returnType: '24Q' | '26Q' | '27Q' | '27EQ';
  quarter: string;
  financialYear: string;
  assessmentYear: string;
  filingDate?: string;
  dueDate: string;
  status: 'draft' | 'filed' | 'revised' | 'defective' | 'processed';
  acknowledgmentNumber?: string;
  totalDeductions: number;
  totalTdsAmount: number;
  totalChallanAmount: number;
  deductionsCount: number;
  certificatesIssued: number;
  pendingCertificates: number;
  compliancePercentage: number;
  lateFeeApplicable: boolean;
  lateFeeAmount?: number;
  penaltyAmount?: number;
  interestAmount?: number;
  rectificationRequired: boolean;
  rectificationDetails?: string[];
  digitalSignature: boolean;
  authorizedSignatory: string;
  preparerDetails: {
    name: string;
    designation: string;
    contactNumber: string;
    email: string;
  };
  validationErrors: ValidationError[];
  submissionHistory: SubmissionHistory[];
}

interface ValidationError {
  id: string;
  errorCode: string;
  errorType: 'critical' | 'warning' | 'info';
  message: string;
  field: string;
  suggestedFix: string;
  resolved: boolean;
}

interface SubmissionHistory {
  id: string;
  submissionDate: string;
  submissionType: 'original' | 'revision' | 'correction';
  status: 'success' | 'failed' | 'pending';
  acknowledgmentNumber?: string;
  errorMessage?: string;
  submittedBy: string;
}

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  deviceInfo?: string;
}

interface TDSStats {
  totalDeductions: number;
  totalTdsAmount: number;
  certificatesGenerated: number;
  pendingCertificates: number;
  complianceScore: number;
  quarterlyTarget: number;
  challansGenerated: number;
  returnsSubmitted: number;
  monthlyTrend: number;
}

interface TDSFormData {
  deducteeName: string;
  deducteePan: string;
  deducteeAddress: string;
  section: string;
  paymentDate: Date;
  paymentAmount: string;
  paymentNature: string;
  remarks: string;
}

const TDSCompliance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('deductions');
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showDeductionDetails, setShowDeductionDetails] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<TDSDeduction | null>(null);
  const [selectedDeduction, setSelectedDeduction] = useState<TDSDeduction | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<TDSCertificate | null>(null);
  const [deductions, setDeductions] = useState<TDSDeduction[]>([]);
  const [certificates, setCertificates] = useState<TDSCertificate[]>([]);
  const [challans, setChallans] = useState<TDSChallan[]>([]);
  const [returns, setReturns] = useState<TDSReturn[]>([]);
  const [tdsSections, setTdsSections] = useState<TDSSection[]>([]);
  const [filteredDeductions, setFilteredDeductions] = useState<TDSDeduction[]>([]);
  const [selectedDeductions, setSelectedDeductions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [quarterFilter, setQuarterFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState<TDSStats>({
    totalDeductions: 0,
    totalTdsAmount: 0,
    certificatesGenerated: 0,
    pendingCertificates: 0,
    complianceScore: 0,
    quarterlyTarget: 0,
    challansGenerated: 0,
    returnsSubmitted: 0,
    monthlyTrend: 0
  });

  // Form state
  const [formData, setFormData] = useState<TDSFormData>({
    deducteeName: '',
    deducteePan: '',
    deducteeAddress: '',
    section: '',
    paymentDate: new Date(),
    paymentAmount: '',
    paymentNature: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // TDS Sections as per Indian Income Tax Act
  const tdsCategories = [
    {
      category: 'professional',
      sections: [
        { section: '194J', description: 'Professional/Technical Services', rate: 10, thresholdLimit: 30000 },
        { section: '194C', description: 'Payments to Contractors', rate: 1, thresholdLimit: 30000 },
        { section: '194G', description: 'Commission, Brokerage etc.', rate: 5, thresholdLimit: 15000 },
        { section: '194H', description: 'Commission or Brokerage', rate: 5, thresholdLimit: 15000 }
      ]
    },
    {
      category: 'interest',
      sections: [
        { section: '194A', description: 'Interest other than Securities', rate: 10, thresholdLimit: 5000 },
        { section: '194BB', description: 'Winning from Lottery/Crossword', rate: 30, thresholdLimit: 10000 },
        { section: '194D', description: 'Insurance Commission', rate: 5, thresholdLimit: 15000 }
      ]
    },
    {
      category: 'rent',
      sections: [
        { section: '194I', description: 'Rent', rate: 10, thresholdLimit: 180000 },
        { section: '194IA', description: 'Transfer of immovable property', rate: 1, thresholdLimit: 5000000 }
      ]
    },
    {
      category: 'salary',
      sections: [
        { section: '192', description: 'Salary', rate: 0, thresholdLimit: 250000 }
      ]
    },
    {
      category: 'other',
      sections: [
        { section: '194K', description: 'E-commerce transactions', rate: 0.1, thresholdLimit: 500000 },
        { section: '194O', description: 'E-commerce operators', rate: 0.1, thresholdLimit: 500000 },
        { section: '194S', description: 'Crypto/Virtual Digital Assets', rate: 2, thresholdLimit: 10000 },
        { section: '195', description: 'Non-resident payments', rate: 20, thresholdLimit: 0 }
      ]
    }
  ];

  const quarters = [
    { value: 'Q1', label: 'Q1 (Apr-Jun)', months: ['04', '05', '06'] },
    { value: 'Q2', label: 'Q2 (Jul-Sep)', months: ['07', '08', '09'] },
    { value: 'Q3', label: 'Q3 (Oct-Dec)', months: ['10', '11', '12'] },
    { value: 'Q4', label: 'Q4 (Jan-Mar)', months: ['01', '02', '03'] }
  ];

  const complianceStatuses = [
    { value: 'compliant', label: 'Compliant', color: 'bg-green-100 text-green-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'defaulted', label: 'Defaulted', color: 'bg-red-100 text-red-800' },
    { value: 'rectified', label: 'Rectified', color: 'bg-blue-100 text-blue-800' }
  ];

  // Load data
  const loadTDSData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock TDS deductions data
      const mockDeductions: TDSDeduction[] = [
        {
          id: '1',
          deducteeId: 'DED-001',
          deducteeName: 'Tech Consultancy Services Pvt Ltd',
          deducteePan: 'TECHQ9876G',
          deducteeAddress: '123 Business Park, Mumbai, MH 400001',
          section: '194J',
          paymentDate: '2024-03-15',
          paymentAmount: 100000,
          tdsRate: 10,
          tdsAmount: 10000,
          surcharge: 0,
          educationCess: 300,
          totalTdsDeducted: 10300,
          netPayment: 89700,
          paymentNature: 'Professional Services',
          certificateNumber: 'CERT-2024-001',
          certificateGenerated: true,
          certificateDate: '2024-03-20',
          challanNumber: 'ITNS281-2024-001',
          challanDate: '2024-03-25',
          challanAmount: 10300,
          bankName: 'State Bank of India',
          bsrCode: '0123456',
          quarterlyReturn: '24Q',
          financialYear: '2023-24',
          assessmentYear: '2024-25',
          isLate: false,
          penaltyApplicable: false,
          interestApplicable: false,
          complianceStatus: 'compliant',
          auditTrail: [
            {
              id: '1',
              action: 'TDS Deduction Created',
              performedBy: 'Accounts Team',
              timestamp: '2024-03-15T10:00:00Z',
              details: 'TDS deduction of ₹10,300 created for professional services'
            },
            {
              id: '2',
              action: 'Certificate Generated',
              performedBy: 'System',
              timestamp: '2024-03-20T14:30:00Z',
              details: 'Form 16A certificate generated'
            }
          ],
          attachments: ['/tds/cert-2024-001.pdf'],
          createdBy: 'Accounts Team',
          createdDate: '2024-03-15',
          lastModified: '2024-03-20',
          modifiedBy: 'System'
        },
        {
          id: '2',
          deducteeId: 'DED-002',
          deducteeName: 'ABC Contractors Ltd',
          deducteePan: 'ABCPD5678F',
          deducteeAddress: '456 Industrial Area, Delhi, DL 110001',
          section: '194C',
          paymentDate: '2024-03-10',
          paymentAmount: 250000,
          tdsRate: 1,
          tdsAmount: 2500,
          surcharge: 0,
          educationCess: 75,
          totalTdsDeducted: 2575,
          netPayment: 247425,
          paymentNature: 'Contractor Payments',
          certificateGenerated: false,
          quarterlyReturn: '24Q',
          financialYear: '2023-24',
          assessmentYear: '2024-25',
          isLate: false,
          penaltyApplicable: false,
          interestApplicable: false,
          complianceStatus: 'pending',
          auditTrail: [
            {
              id: '1',
              action: 'TDS Deduction Created',
              performedBy: 'Accounts Team',
              timestamp: '2024-03-10T09:00:00Z',
              details: 'TDS deduction of ₹2,575 created for contractor payment'
            }
          ],
          attachments: [],
          createdBy: 'Accounts Team',
          createdDate: '2024-03-10',
          lastModified: '2024-03-10',
          modifiedBy: 'Accounts Team'
        }
      ];

      // Mock certificates data
      const mockCertificates: TDSCertificate[] = [
        {
          id: '1',
          certificateNumber: 'CERT-2024-001',
          deductionId: '1',
          deducteeName: 'Tech Consultancy Services Pvt Ltd',
          deducteePan: 'TECHQ9876G',
          section: '194J',
          financialYear: '2023-24',
          assessmentYear: '2024-25',
          quarter: 'Q4',
          issuedDate: '2024-03-20',
          validTill: '2025-03-31',
          status: 'issued',
          certificateType: 'form16a',
          digitalSignature: true,
          downloadCount: 2,
          lastDownloaded: '2024-03-22',
          certificationDetails: {
            grossAmount: 100000,
            tdsDeducted: 10300,
            netAmount: 89700,
            rate: 10,
            surcharge: 0,
            educationCess: 300
          }
        }
      ];

      // Mock challans data
      const mockChallans: TDSChallan[] = [
        {
          id: '1',
          challanNumber: 'ITNS281-2024-001',
          paymentDate: '2024-03-25',
          depositDate: '2024-03-25',
          bankName: 'State Bank of India',
          bsrCode: '0123456',
          amount: 10300,
          financialYear: '2023-24',
          quarter: 'Q4',
          taxType: '194',
          paymentMode: 'online',
          transactionReference: 'TXN123456789',
          status: 'paid',
          acknowledgmentNumber: 'ACK123456789',
          receiptNumber: 'REC123456789',
          totalAmount: 10300,
          deductions: ['1'],
          complianceScore: 100,
          notes: 'TDS deposit for Q4 FY 2023-24',
          attachments: ['/challans/itns281-2024-001.pdf']
        }
      ];

      // Mock returns data
      const mockReturns: TDSReturn[] = [
        {
          id: '1',
          returnType: '24Q',
          quarter: 'Q4',
          financialYear: '2023-24',
          assessmentYear: '2024-25',
          dueDate: '2024-05-31',
          status: 'draft',
          totalDeductions: 2,
          totalTdsAmount: 12875,
          totalChallanAmount: 10300,
          deductionsCount: 2,
          certificatesIssued: 1,
          pendingCertificates: 1,
          compliancePercentage: 85,
          lateFeeApplicable: false,
          rectificationRequired: false,
          digitalSignature: false,
          authorizedSignatory: 'Finance Manager',
          preparerDetails: {
            name: 'Accounts Team',
            designation: 'Accountant',
            contactNumber: '+91 9876543210',
            email: 'accounts@company.com'
          },
          validationErrors: [
            {
              id: '1',
              errorCode: 'CERT_PENDING',
              errorType: 'warning',
              message: 'Certificate pending for deduction ID: 2',
              field: 'certificate_status',
              suggestedFix: 'Generate certificate before filing return',
              resolved: false
            }
          ],
          submissionHistory: []
        }
      ];

      setDeductions(mockDeductions);
      setCertificates(mockCertificates);
      setChallans(mockChallans);
      setReturns(mockReturns);
      setFilteredDeductions(mockDeductions);

      // Calculate stats
      const totalTdsAmount = mockDeductions.reduce((sum, ded) => sum + ded.totalTdsDeducted, 0);
      const certificatesGenerated = mockCertificates.filter(cert => cert.status === 'issued').length;
      const pendingCertificates = mockDeductions.filter(ded => !ded.certificateGenerated).length;
      const complianceScore = mockDeductions.filter(ded => ded.complianceStatus === 'compliant').length / mockDeductions.length * 100;

      setStats({
        totalDeductions: mockDeductions.length,
        totalTdsAmount,
        certificatesGenerated,
        pendingCertificates,
        complianceScore,
        quarterlyTarget: 100000,
        challansGenerated: mockChallans.length,
        returnsSubmitted: mockReturns.filter(ret => ret.status === 'filed').length,
        monthlyTrend: 12.8
      });

      toast({
        title: 'Success',
        description: 'TDS data loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load TDS data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter data
  const applyFilters = useCallback(() => {
    let filtered = deductions;

    if (searchTerm) {
      filtered = filtered.filter(deduction =>
        deduction.deducteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deduction.deducteePan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deduction.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deduction.paymentNature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(deduction => deduction.complianceStatus === statusFilter);
    }

    if (sectionFilter !== 'all') {
      filtered = filtered.filter(deduction => deduction.section === sectionFilter);
    }

    if (quarterFilter !== 'all') {
      filtered = filtered.filter(deduction => deduction.quarterlyReturn.endsWith(quarterFilter));
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
      
      filtered = filtered.filter(deduction => new Date(deduction.paymentDate) >= filterDate);
    }

    setFilteredDeductions(filtered);
  }, [deductions, searchTerm, statusFilter, sectionFilter, quarterFilter, dateFilter]);

  // Form handlers
  const resetForm = () => {
    setFormData({
      deducteeName: '',
      deducteePan: '',
      deducteeAddress: '',
      section: '',
      paymentDate: new Date(),
      paymentAmount: '',
      paymentNature: '',
      remarks: ''
    });
    setFormErrors({});
  };

  const handleCreateDeduction = () => {
    resetForm();
    setEditingDeduction(null);
    setShowDeductionForm(true);
  };

  const handleEditDeduction = (deduction: TDSDeduction) => {
    setFormData({
      deducteeName: deduction.deducteeName,
      deducteePan: deduction.deducteePan || '',
      deducteeAddress: deduction.deducteeAddress,
      section: deduction.section,
      paymentDate: new Date(deduction.paymentDate),
      paymentAmount: deduction.paymentAmount.toString(),
      paymentNature: deduction.paymentNature,
      remarks: deduction.remarks || ''
    });
    setEditingDeduction(deduction);
    setFormErrors({});
    setShowDeductionForm(true);
  };

  const handleSubmitDeduction = async (e: React.FormEvent) => {
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
      const selectedSection = tdsCategories
        .flatMap(cat => cat.sections)
        .find(sec => sec.section === formData.section);

      if (!selectedSection) {
        throw new Error('Invalid TDS section selected');
      }

      const paymentAmount = parseFloat(formData.paymentAmount);
      const tdsAmount = (paymentAmount * selectedSection.rate) / 100;
      const educationCess = tdsAmount * 0.03; // 3% education cess
      const totalTdsDeducted = tdsAmount + educationCess;

      const deductionData: TDSDeduction = {
        id: editingDeduction?.id || `${Date.now()}`,
        deducteeId: editingDeduction?.deducteeId || `DED-${Date.now()}`,
        deducteeName: formData.deducteeName,
        deducteePan: formData.deducteePan,
        deducteeAddress: formData.deducteeAddress,
        section: formData.section,
        paymentDate: format(formData.paymentDate, 'yyyy-MM-dd'),
        paymentAmount: paymentAmount,
        tdsRate: selectedSection.rate,
        tdsAmount: tdsAmount,
        surcharge: 0, // Calculate based on income slab
        educationCess: educationCess,
        totalTdsDeducted: totalTdsDeducted,
        netPayment: paymentAmount - totalTdsDeducted,
        paymentNature: formData.paymentNature,
        certificateGenerated: editingDeduction?.certificateGenerated || false,
        quarterlyReturn: '24Q', // Determine based on section and date
        financialYear: '2023-24', // Calculate based on payment date
        assessmentYear: '2024-25',
        isLate: false,
        penaltyApplicable: false,
        interestApplicable: false,
        complianceStatus: 'pending',
        auditTrail: editingDeduction?.auditTrail || [
          {
            id: '1',
            action: 'TDS Deduction Created',
            performedBy: 'current_user',
            timestamp: new Date().toISOString(),
            details: `TDS deduction of ₹${totalTdsDeducted.toFixed(2)} created`
          }
        ],
        attachments: editingDeduction?.attachments || [],
        createdBy: editingDeduction?.createdBy || 'current_user',
        createdDate: editingDeduction?.createdDate || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        modifiedBy: 'current_user',
        remarks: formData.remarks
      };

      if (editingDeduction) {
        setDeductions(prev => prev.map(ded => ded.id === editingDeduction.id ? deductionData : ded));
        toast({
          title: 'Success',
          description: 'TDS deduction updated successfully',
        });
      } else {
        setDeductions(prev => [...prev, deductionData]);
        toast({
          title: 'Success',
          description: 'TDS deduction created successfully',
        });
      }

      setShowDeductionForm(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save TDS deduction',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.deducteeName.trim()) errors.deducteeName = 'Deductee name is required';
    if (!formData.deducteeAddress.trim()) errors.deducteeAddress = 'Deductee address is required';
    if (!formData.section) errors.section = 'TDS section is required';
    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) errors.paymentAmount = 'Valid payment amount is required';
    if (!formData.paymentNature.trim()) errors.paymentNature = 'Payment nature is required';

    // PAN validation
    if (formData.deducteePan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.deducteePan)) {
      errors.deducteePan = 'Invalid PAN format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateCertificate = async (deductionId: string) => {
    try {
      const deduction = deductions.find(d => d.id === deductionId);
      if (!deduction) return;

      // Generate certificate
      const certificateNumber = `CERT-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;
      
      const newCertificate: TDSCertificate = {
        id: `${Date.now()}`,
        certificateNumber,
        deductionId: deduction.id,
        deducteeName: deduction.deducteeName,
        deducteePan: deduction.deducteePan,
        section: deduction.section,
        financialYear: deduction.financialYear,
        assessmentYear: deduction.assessmentYear,
        quarter: 'Q4', // Determine from payment date
        issuedDate: new Date().toISOString().split('T')[0],
        validTill: '2025-03-31',
        status: 'issued',
        certificateType: 'form16a',
        digitalSignature: true,
        downloadCount: 0,
        certificationDetails: {
          grossAmount: deduction.paymentAmount,
          tdsDeducted: deduction.totalTdsDeducted,
          netAmount: deduction.netPayment,
          rate: deduction.tdsRate,
          surcharge: deduction.surcharge,
          educationCess: deduction.educationCess
        }
      };

      setCertificates(prev => [...prev, newCertificate]);
      
      // Update deduction
      setDeductions(prev => prev.map(ded => 
        ded.id === deductionId 
          ? { 
              ...ded, 
              certificateGenerated: true,
              certificateNumber,
              certificateDate: new Date().toISOString().split('T')[0]
            } 
          : ded
      ));
      
      toast({
        title: 'Success',
        description: 'TDS certificate generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate certificate',
        variant: 'destructive',
      });
    }
  };

  const handlePayChallan = async (deductionIds: string[]) => {
    try {
      const relevantDeductions = deductions.filter(d => deductionIds.includes(d.id));
      const totalAmount = relevantDeductions.reduce((sum, d) => sum + d.totalTdsDeducted, 0);
      
      const challanNumber = `ITNS281-${new Date().getFullYear()}-${String(challans.length + 1).padStart(3, '0')}`;
      
      const newChallan: TDSChallan = {
        id: `${Date.now()}`,
        challanNumber,
        paymentDate: new Date().toISOString().split('T')[0],
        depositDate: new Date().toISOString().split('T')[0],
        bankName: 'State Bank of India',
        bsrCode: '0123456',
        amount: totalAmount,
        financialYear: '2023-24',
        quarter: 'Q4',
        taxType: '194',
        paymentMode: 'online',
        status: 'paid',
        totalAmount: totalAmount,
        deductions: deductionIds,
        complianceScore: 100,
        notes: 'TDS challan payment',
        attachments: []
      };

      setChallans(prev => [...prev, newChallan]);
      
      // Update deductions
      setDeductions(prev => prev.map(ded => 
        deductionIds.includes(ded.id) 
          ? { 
              ...ded, 
              challanNumber,
              challanDate: new Date().toISOString().split('T')[0],
              challanAmount: ded.totalTdsDeducted,
              complianceStatus: 'compliant' as const
            } 
          : ded
      ));
      
      toast({
        title: 'Success',
        description: 'TDS challan paid successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pay challan',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDeduction = async (deductionId: string) => {
    try {
      setDeductions(prev => prev.filter(ded => ded.id !== deductionId));
      setSelectedDeductions(prev => prev.filter(id => id !== deductionId));
      
      toast({
        title: 'Success',
        description: 'TDS deduction deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deduction',
        variant: 'destructive',
      });
    }
  };

  const getComplianceStatusColor = (status: string) => {
    const found = complianceStatuses.find(cs => cs.value === status);
    return found?.color || 'bg-gray-100 text-gray-800';
  };

  const getSectionCategory = (section: string) => {
    for (const category of tdsCategories) {
      const found = category.sections.find(s => s.section === section);
      if (found) return category.category;
    }
    return 'other';
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

  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 6) return 'Q1';
    if (month >= 7 && month <= 9) return 'Q2';
    if (month >= 10 && month <= 12) return 'Q3';
    return 'Q4';
  };

  const getCurrentFinancialYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    if (month >= 4) {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  };

  // Effects
  useEffect(() => {
    loadTDSData();
  }, [loadTDSData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>TDS Compliance - JusFinn</title>
        <meta name="description" content="Complete TDS compliance management with automated calculations, certificate generation and return filing" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TDS Compliance
            </h1>
            <p className="text-gray-600 mt-1">
              Complete TDS management with automated calculations, certificates, and compliance tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCertificateGenerator(true)}
              className="flex items-center gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Generate Certificate
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowChallanForm(true)}
              className="flex items-center gap-2"
            >
              <Banknote className="h-4 w-4" />
              Pay Challan
            </Button>
            <Button 
              onClick={handleCreateDeduction}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Deduction
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Deductions</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalDeductions}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {formatCurrency(stats.totalTdsAmount)} TDS
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Certificates</p>
                  <p className="text-2xl font-bold text-green-900">{stats.certificatesGenerated}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.pendingCertificates} pending
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Compliance Score</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.complianceScore.toFixed(1)}%</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Current quarter
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Returns Filed</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.returnsSubmitted}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    This year
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {getCurrentQuarter()}
                </div>
                <div className="text-sm text-blue-600">Current Quarter</div>
                <div className="text-xs text-gray-500 mt-1">
                  FY {getCurrentFinancialYear()}
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(stats.quarterlyTarget - stats.totalTdsAmount)}
                </div>
                <div className="text-sm text-green-600">Remaining Target</div>
                <Button size="sm" className="mt-2" variant="outline">
                  View Details
                </Button>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  May 31, 2024
                </div>
                <div className="text-sm text-orange-600">Next Due Date</div>
                <Button size="sm" className="mt-2" variant="outline">
                  Prepare Return
                </Button>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  ₹{stats.challansGenerated}
                </div>
                <div className="text-sm text-purple-600">Challans Paid</div>
                <Button size="sm" className="mt-2" variant="outline">
                  Payment History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="challans">Challans</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="deductions" className="space-y-6">
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
                    <Label htmlFor="search">Search Deductions</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by name, PAN, section..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status-filter">Compliance Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {complianceStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="section-filter">TDS Section</Label>
                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        {tdsCategories.flatMap(cat => cat.sections).map(section => (
                          <SelectItem key={section.section} value={section.section}>
                            {section.section} - {section.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quarter-filter">Quarter</Label>
                    <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Quarters</SelectItem>
                        {quarters.map(quarter => (
                          <SelectItem key={quarter.value} value={quarter.value}>{quarter.label}</SelectItem>
                        ))}
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
                {selectedDeductions.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedDeductions.length} deduction(s) selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            selectedDeductions.forEach(id => handleGenerateCertificate(id));
                            setSelectedDeductions([]);
                          }}
                          disabled={bulkActionLoading}
                        >
                          <FileCheck className="h-4 w-4 mr-1" />
                          Generate Certificates
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handlePayChallan(selectedDeductions);
                            setSelectedDeductions([]);
                          }}
                          disabled={bulkActionLoading}
                        >
                          <Banknote className="h-4 w-4 mr-1" />
                          Pay Challan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={bulkActionLoading}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deductions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>TDS Deductions ({filteredDeductions.length})</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDeductions(
                        selectedDeductions.length === filteredDeductions.length ? [] : filteredDeductions.map(ded => ded.id)
                      )}
                    >
                      {selectedDeductions.length === filteredDeductions.length ? 'Deselect All' : 'Select All'}
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
                    Loading TDS deductions...
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedDeductions.length === filteredDeductions.length && filteredDeductions.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDeductions(filteredDeductions.map(ded => ded.id));
                                } else {
                                  setSelectedDeductions([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Deductee Details</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Payment Info</TableHead>
                          <TableHead>TDS Details</TableHead>
                          <TableHead>Certificate</TableHead>
                          <TableHead>Compliance</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeductions.map((deduction) => (
                          <TableRow key={deduction.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedDeductions.includes(deduction.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDeductions(prev => [...prev, deduction.id]);
                                  } else {
                                    setSelectedDeductions(prev => prev.filter(id => id !== deduction.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{deduction.deducteeName}</div>
                                {deduction.deducteePan && (
                                  <div className="text-sm text-gray-500">PAN: {deduction.deducteePan}</div>
                                )}
                                <div className="text-xs text-gray-400">
                                  {deduction.deducteeAddress.substring(0, 50)}...
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="outline" className="font-medium">
                                  {deduction.section}
                                </Badge>
                                <div className="text-xs text-gray-500 capitalize">
                                  {getSectionCategory(deduction.section)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Rate: {deduction.tdsRate}%
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formatCurrency(deduction.paymentAmount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(deduction.paymentDate)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {deduction.paymentNature}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-green-600">
                                  {formatCurrency(deduction.totalTdsDeducted)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  TDS: {formatCurrency(deduction.tdsAmount)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Cess: {formatCurrency(deduction.educationCess)}
                                </div>
                                <div className="text-xs text-blue-600">
                                  Net: {formatCurrency(deduction.netPayment)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {deduction.certificateGenerated ? (
                                  <Badge variant="default" className="text-xs">
                                    <FileCheck className="h-3 w-3 mr-1" />
                                    Generated
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {deduction.certificateNumber && (
                                  <div className="text-xs text-gray-500">
                                    {deduction.certificateNumber}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge className={getComplianceStatusColor(deduction.complianceStatus)}>
                                  {deduction.complianceStatus}
                                </Badge>
                                {deduction.challanNumber && (
                                  <div className="text-xs text-green-600">
                                    Challan: {deduction.challanNumber}
                                  </div>
                                )}
                                {deduction.isLate && (
                                  <div className="text-xs text-red-600">
                                    Late Payment
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
                                    setSelectedDeduction(deduction);
                                    setShowDeductionDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditDeduction(deduction)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {!deduction.certificateGenerated && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleGenerateCertificate(deduction.id)}
                                    className="text-green-600"
                                  >
                                    <FileCheck className="h-4 w-4" />
                                  </Button>
                                )}
                                {!deduction.challanNumber && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePayChallan([deduction.id])}
                                    className="text-blue-600"
                                  >
                                    <Banknote className="h-4 w-4" />
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
                                      <AlertDialogTitle>Delete TDS Deduction</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this TDS deduction? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteDeduction(deduction.id)}
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

          <TabsContent value="certificates" className="space-y-6">
            {/* TDS Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  TDS Certificates
                </CardTitle>
                <CardDescription>
                  Manage and download TDS certificates (Form 16A, 16B, 16C)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-lg">{certificate.certificateNumber}</h3>
                            <Badge className={certificate.status === 'issued' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {certificate.status}
                            </Badge>
                            <Badge variant="outline" className="uppercase">
                              {certificate.certificateType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Deductee: {certificate.deducteeName}</p>
                              <p className="text-gray-600">PAN: {certificate.deducteePan || 'Not Available'}</p>
                              <p className="text-gray-600">Section: {certificate.section}</p>
                            </div>
                            <div>
                              <p className="font-medium">Financial Year: {certificate.financialYear}</p>
                              <p className="text-gray-600">Assessment Year: {certificate.assessmentYear}</p>
                              <p className="text-gray-600">Quarter: {certificate.quarter}</p>
                            </div>
                            <div>
                              <p className="font-medium">Issued: {formatDate(certificate.issuedDate)}</p>
                              <p className="text-gray-600">Valid Till: {formatDate(certificate.validTill)}</p>
                              <p className="text-gray-600">Downloads: {certificate.downloadCount}</p>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Gross Amount:</p>
                                <p className="font-medium">{formatCurrency(certificate.certificationDetails.grossAmount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">TDS Deducted:</p>
                                <p className="font-medium text-green-600">{formatCurrency(certificate.certificationDetails.tdsDeducted)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Net Amount:</p>
                                <p className="font-medium">{formatCurrency(certificate.certificationDetails.netAmount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">TDS Rate:</p>
                                <p className="font-medium">{certificate.certificationDetails.rate}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {certificates.length === 0 && (
                    <div className="text-center py-8">
                      <FileCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No certificates generated yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Generate certificates from TDS deductions
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challans" className="space-y-6">
            {/* TDS Challans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  TDS Challans
                </CardTitle>
                <CardDescription>
                  Track TDS payment challans and compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challans.map((challan) => (
                    <div key={challan.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-lg">{challan.challanNumber}</h3>
                            <Badge className={challan.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {challan.status}
                            </Badge>
                            <Badge variant="outline">
                              Tax Type: {challan.taxType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Amount: {formatCurrency(challan.amount)}</p>
                              <p className="text-gray-600">Payment Date: {formatDate(challan.paymentDate)}</p>
                              <p className="text-gray-600">Quarter: {challan.quarter}</p>
                            </div>
                            <div>
                              <p className="font-medium">Bank: {challan.bankName}</p>
                              <p className="text-gray-600">BSR Code: {challan.bsrCode}</p>
                              <p className="text-gray-600">Mode: {challan.paymentMode}</p>
                            </div>
                            <div>
                              <p className="font-medium">Financial Year: {challan.financialYear}</p>
                              {challan.acknowledgmentNumber && (
                                <p className="text-gray-600">ACK: {challan.acknowledgmentNumber}</p>
                              )}
                              {challan.receiptNumber && (
                                <p className="text-gray-600">Receipt: {challan.receiptNumber}</p>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Compliance Score: {challan.complianceScore}%</p>
                              <p className="text-gray-600">Deductions: {challan.deductions.length}</p>
                              {challan.notes && (
                                <p className="text-xs text-gray-500">{challan.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {challans.length === 0 && (
                    <div className="text-center py-8">
                      <Banknote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No challans generated yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Pay TDS challans for tax compliance
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            {/* TDS Returns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quarterly TDS Returns
                </CardTitle>
                <CardDescription>
                  File quarterly TDS returns (24Q, 26Q, 27Q, 27EQ)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returns.map((returnData) => (
                    <div key={returnData.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-lg">{returnData.returnType} - {returnData.quarter}</h3>
                            <Badge className={returnData.status === 'filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {returnData.status.replace('_', ' ')}
                            </Badge>
                            {returnData.lateFeeApplicable && (
                              <Badge variant="destructive" className="text-xs">
                                Late Fee
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">FY: {returnData.financialYear}</p>
                              <p className="text-gray-600">AY: {returnData.assessmentYear}</p>
                              <p className="text-gray-600">Due: {formatDate(returnData.dueDate)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Deductions: {returnData.deductionsCount}</p>
                              <p className="text-gray-600">TDS Amount: {formatCurrency(returnData.totalTdsAmount)}</p>
                              <p className="text-gray-600">Challan Amount: {formatCurrency(returnData.totalChallanAmount)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Certificates Issued: {returnData.certificatesIssued}</p>
                              <p className="text-gray-600">Pending: {returnData.pendingCertificates}</p>
                              <p className="text-gray-600">Compliance: {returnData.compliancePercentage}%</p>
                            </div>
                            <div>
                              <p className="font-medium">Prepared by: {returnData.preparerDetails.name}</p>
                              <p className="text-gray-600">Designation: {returnData.preparerDetails.designation}</p>
                              <p className="text-gray-600">Contact: {returnData.preparerDetails.contactNumber}</p>
                            </div>
                          </div>

                          {returnData.validationErrors.length > 0 && (
                            <div className="mt-4 p-3 bg-red-50 rounded">
                              <p className="font-medium text-red-800 mb-2">Validation Errors:</p>
                              <div className="space-y-1">
                                {returnData.validationErrors.map((error) => (
                                  <div key={error.id} className="text-sm">
                                    <Badge variant="destructive" className="text-xs mr-2">
                                      {error.errorType}
                                    </Badge>
                                    <span className="text-red-700">{error.message}</span>
                                    <p className="text-xs text-gray-500 ml-12">{error.suggestedFix}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {returnData.status === 'draft' && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              File Return
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {returns.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No returns prepared yet</p>
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Prepare Return
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>TDS Trends</CardTitle>
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
                          {formatCurrency(stats.totalTdsAmount / stats.totalDeductions)}
                        </div>
                        <div className="text-sm text-blue-600">Avg TDS</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {stats.complianceScore.toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-600">Compliance</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Section-wise Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tdsCategories.slice(0, 4).map((category, index) => {
                      const categoryDeductions = filteredDeductions.filter(ded => 
                        category.sections.some(sec => sec.section === ded.section)
                      );
                      const categoryAmount = categoryDeductions.reduce((sum, ded) => sum + ded.totalTdsDeducted, 0);
                      const percentage = stats.totalTdsAmount > 0 ? (categoryAmount / stats.totalTdsAmount) * 100 : 0;
                      
                      return (
                        <div key={category.category} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{category.category}</span>
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

            {/* Compliance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredDeductions.filter(d => d.complianceStatus === 'compliant').length}
                    </div>
                    <div className="text-sm text-green-600">Compliant</div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredDeductions.filter(d => d.complianceStatus === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredDeductions.filter(d => d.complianceStatus === 'defaulted').length}
                    </div>
                    <div className="text-sm text-red-600">Defaulted</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredDeductions.filter(d => d.complianceStatus === 'rectified').length}
                    </div>
                    <div className="text-sm text-blue-600">Rectified</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* TDS Deduction Form Dialog */}
        <Dialog open={showDeductionForm} onOpenChange={setShowDeductionForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDeduction ? 'Edit TDS Deduction' : 'Add New TDS Deduction'}
              </DialogTitle>
              <DialogDescription>
                {editingDeduction 
                  ? 'Update TDS deduction information and calculations' 
                  : 'Create a new TDS deduction with automated calculations'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitDeduction} className="space-y-6">
              {/* Deductee Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Deducee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deducteeName">Deducee Name *</Label>
                    <Input
                      id="deducteeName"
                      value={formData.deducteeName}
                      onChange={(e) => setFormData({...formData, deducteeName: e.target.value})}
                      placeholder="Full name of the deductee"
                      required
                    />
                    {formErrors.deducteeName && (
                      <p className="text-sm text-red-600">{formErrors.deducteeName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deducteePan">PAN Number</Label>
                    <Input
                      id="deducteePan"
                      value={formData.deducteePan}
                      onChange={(e) => setFormData({...formData, deducteePan: e.target.value.toUpperCase()})}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                    {formErrors.deducteePan && (
                      <p className="text-sm text-red-600">{formErrors.deducteePan}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="deducteeAddress">Deducee Address *</Label>
                    <Textarea
                      id="deducteeAddress"
                      value={formData.deducteeAddress}
                      onChange={(e) => setFormData({...formData, deducteeAddress: e.target.value})}
                      placeholder="Complete address of the deductee"
                      rows={3}
                      required
                    />
                    {formErrors.deducteeAddress && (
                      <p className="text-sm text-red-600">{formErrors.deducteeAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Payment & TDS Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section">TDS Section *</Label>
                    <Select value={formData.section} onValueChange={(value) => setFormData({...formData, section: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TDS Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {tdsCategories.map((category) => (
                          <div key={category.category}>
                            <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase bg-gray-100">
                              {category.category}
                            </div>
                            {category.sections.map((section) => (
                              <SelectItem key={section.section} value={section.section}>
                                {section.section} - {section.description} ({section.rate}%)
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.section && (
                      <p className="text-sm text-red-600">{formErrors.section}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.paymentDate ? format(formData.paymentDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.paymentDate}
                          onSelect={(date) => setFormData({...formData, paymentDate: date || new Date()})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount (₹) *</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      step="0.01"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                    {formErrors.paymentAmount && (
                      <p className="text-sm text-red-600">{formErrors.paymentAmount}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="paymentNature">Nature of Payment *</Label>
                    <Input
                      id="paymentNature"
                      value={formData.paymentNature}
                      onChange={(e) => setFormData({...formData, paymentNature: e.target.value})}
                      placeholder="e.g., Professional Services, Contractor Payment, etc."
                      required
                    />
                    {formErrors.paymentNature && (
                      <p className="text-sm text-red-600">{formErrors.paymentNature}</p>
                    )}
                  </div>
                </div>

                {/* TDS Calculation Preview */}
                {formData.section && formData.paymentAmount && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">TDS Calculation Preview</h4>
                    {(() => {
                      const selectedSection = tdsCategories
                        .flatMap(cat => cat.sections)
                        .find(sec => sec.section === formData.section);
                      
                      if (!selectedSection) return null;
                      
                      const paymentAmount = parseFloat(formData.paymentAmount) || 0;
                      const tdsAmount = (paymentAmount * selectedSection.rate) / 100;
                      const educationCess = tdsAmount * 0.03;
                      const totalTds = tdsAmount + educationCess;
                      const netPayment = paymentAmount - totalTds;
                      
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">TDS Rate:</p>
                            <p className="font-medium">{selectedSection.rate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">TDS Amount:</p>
                            <p className="font-medium">{formatCurrency(tdsAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Education Cess:</p>
                            <p className="font-medium">{formatCurrency(educationCess)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total TDS:</p>
                            <p className="font-medium text-green-600">{formatCurrency(totalTds)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Gross Payment:</p>
                            <p className="font-medium">{formatCurrency(paymentAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Net Payment:</p>
                            <p className="font-medium text-blue-600">{formatCurrency(netPayment)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Threshold:</p>
                            <p className="font-medium">{formatCurrency(selectedSection.thresholdLimit)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Above Threshold:</p>
                            <p className={`font-medium ${paymentAmount > selectedSection.thresholdLimit ? 'text-green-600' : 'text-red-600'}`}>
                              {paymentAmount > selectedSection.thresholdLimit ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
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
                  onClick={() => setShowDeductionForm(false)}
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
                      {editingDeduction ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingDeduction ? 'Update Deduction' : 'Create Deduction'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* TDS Deduction Details Sheet */}
        <Sheet open={showDeductionDetails} onOpenChange={setShowDeductionDetails}>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                TDS Deduction Details
              </SheetTitle>
              <SheetDescription>
                Complete TDS deduction information and compliance status
              </SheetDescription>
            </SheetHeader>

            {selectedDeduction && (
              <div className="space-y-6 mt-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deduction Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">Deducee Name</Label>
                        <p className="font-medium">{selectedDeduction.deducteeName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">PAN Number</Label>
                        <p className="font-medium">{selectedDeduction.deducteePan || 'Not Available'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">TDS Section</Label>
                        <Badge variant="outline">{selectedDeduction.section}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Payment Date</Label>
                        <p className="font-medium">{formatDate(selectedDeduction.paymentDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-gray-500">Address</Label>
                        <p className="text-sm">{selectedDeduction.deducteeAddress}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm text-gray-500">Payment Nature</Label>
                        <p className="font-medium">{selectedDeduction.paymentNature}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Gross Payment Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedDeduction.paymentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TDS Rate:</span>
                        <span className="font-medium">{selectedDeduction.tdsRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TDS Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedDeduction.tdsAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Education Cess:</span>
                        <span className="font-medium">{formatCurrency(selectedDeduction.educationCess)}</span>
                      </div>
                      {selectedDeduction.surcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Surcharge:</span>
                          <span className="font-medium">{formatCurrency(selectedDeduction.surcharge)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TDS Deducted:</span>
                        <span className="text-green-600">{formatCurrency(selectedDeduction.totalTdsDeducted)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Net Payment:</span>
                        <span className="text-blue-600">{formatCurrency(selectedDeduction.netPayment)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Status</span>
                        <Badge className={getComplianceStatusColor(selectedDeduction.complianceStatus)}>
                          {selectedDeduction.complianceStatus}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Certificate Generated</span>
                        <Badge variant={selectedDeduction.certificateGenerated ? 'default' : 'destructive'}>
                          {selectedDeduction.certificateGenerated ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      
                      {selectedDeduction.certificateNumber && (
                        <div className="flex items-center justify-between">
                          <span>Certificate Number</span>
                          <span className="font-medium">{selectedDeduction.certificateNumber}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span>Challan Paid</span>
                        <Badge variant={selectedDeduction.challanNumber ? 'default' : 'destructive'}>
                          {selectedDeduction.challanNumber ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      
                      {selectedDeduction.challanNumber && (
                        <div className="flex items-center justify-between">
                          <span>Challan Number</span>
                          <span className="font-medium">{selectedDeduction.challanNumber}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-sm text-gray-500">Financial Year</Label>
                          <p className="font-medium">{selectedDeduction.financialYear}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Assessment Year</Label>
                          <p className="font-medium">{selectedDeduction.assessmentYear}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Quarterly Return</Label>
                          <p className="font-medium">{selectedDeduction.quarterlyReturn}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Late Payment</Label>
                          <Badge variant={selectedDeduction.isLate ? 'destructive' : 'default'}>
                            {selectedDeduction.isLate ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Audit Trail */}
                {selectedDeduction.auditTrail.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedDeduction.auditTrail.map((entry) => (
                          <div key={entry.id} className="border-l-2 border-blue-200 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{entry.action}</p>
                                <p className="text-sm text-gray-600">{entry.details}</p>
                                <p className="text-xs text-gray-400">
                                  By {entry.performedBy} on {new Date(entry.timestamp).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
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
                      setShowDeductionDetails(false);
                      handleEditDeduction(selectedDeduction);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Deduction
                  </Button>
                  {!selectedDeduction.certificateGenerated && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleGenerateCertificate(selectedDeduction.id)}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
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

export default TDSCompliance; 