import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  Plus, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Send,
  Calendar,
  IndianRupee,
  Building2,
  User,
  Search,
  Filter,
  Shield,
  CreditCard,
  FileText,
  Bell,
  Target,
  BarChart3,
  Zap,
  Calculator,
  DollarSign,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  PieChart,
  Activity,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PayableRecord {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_type: 'msme' | 'non_msme';
  vendor_gstin?: string;
  udyam_number?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  original_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  days_outstanding: number;
  aging_bucket: '0-30' | '31-45' | '46-60' | '61-90' | '90+';
  msme_compliance_status: 'compliant' | 'at_risk' | 'overdue' | 'violated';
  msme_days_remaining?: number;
  payment_terms: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue';
  last_payment_date?: string;
  remarks?: string;
  created_by: string;
  created_date: string;
  last_modified: string;
}

interface MSMEAlert {
  id: string;
  vendor_name: string;
  vendor_id: string;
  udyam_number: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  outstanding_amount: number;
  days_to_violation: number;
  alert_type: 'warning' | 'critical' | 'violated';
  alert_message: string;
  created_date: string;
}

interface PaymentSummary {
  vendor_id: string;
  vendor_name: string;
  vendor_type: 'msme' | 'non_msme';
  total_outstanding: number;
  total_invoices: number;
  overdue_amount: number;
  overdue_invoices: number;
  msme_violations: number;
  oldest_invoice_days: number;
  payment_score: number;
}

interface CashFlowForecast {
  period: string;
  planned_payments: number;
  critical_payments: number;
  msme_payments: number;
  total_due: number;
  available_balance: number;
  deficit: number;
}

interface PaymentReminder {
  id: string;
  vendor_id: string;
  vendor_name: string;
  invoice_numbers: string[];
  total_amount: number;
  reminder_type: 'email' | 'sms' | 'call' | 'letter';
  reminder_level: 'gentle' | 'firm' | 'final';
  sent_date: string;
  response_received: boolean;
  next_reminder_date?: string;
  created_by: string;
}

interface PaymentFormData {
  vendor_id: string;
  invoice_id: string;
  payment_amount: string;
  payment_date: string;
  payment_method: string;
  reference_number: string;
  bank_account: string;
  remarks: string;
}

const PayablesAging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("aging");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<PayableRecord | null>(null);
  const [payables, setPayables] = useState<PayableRecord[]>([]);
  const [msmeAlerts, setMsmeAlerts] = useState<MSMEAlert[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary[]>([]);
  const [cashFlowForecast, setCashFlowForecast] = useState<CashFlowForecast[]>([]);
  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("all");
  const [agingFilter, setAgingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    vendor_id: '',
    invoice_id: '',
    payment_amount: '',
    payment_date: '',
    payment_method: '',
    reference_number: '',
    bank_account: '',
    remarks: ''
  });
  const [stats, setStats] = useState({
    total_outstanding: 0,
    msme_outstanding: 0,
    overdue_amount: 0,
    msme_violations: 0,
    vendors_at_risk: 0,
    payment_score: 0,
    weekly_due: 0,
    monthly_due: 0,
    critical_payments: 0
  });

  // Aging buckets for analysis
  const agingBuckets = [
    { key: '0-30', label: '0-30 Days', color: 'bg-green-100 text-green-800' },
    { key: '31-45', label: '31-45 Days', color: 'bg-yellow-100 text-yellow-800' },
    { key: '46-60', label: '46-60 Days', color: 'bg-orange-100 text-orange-800' },
    { key: '61-90', label: '61-90 Days', color: 'bg-red-100 text-red-800' },
    { key: '90+', label: '90+ Days', color: 'bg-red-200 text-red-900' }
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online_payment', label: 'Online Payment' },
    { value: 'cash', label: 'Cash' },
    { value: 'demand_draft', label: 'Demand Draft' }
  ];

  // Mock data generation
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Mock Payable Records with realistic Indian vendor data
    const mockPayables: PayableRecord[] = [
      {
        id: "PAY001",
        vendor_id: "V001",
        vendor_name: "Tata Consultancy Services",
        vendor_type: "non_msme",
        vendor_gstin: "27AAACT2727Q1ZZ",
        invoice_number: "TCS/INV/2024/001",
        invoice_date: "2024-09-15",
        due_date: "2024-10-15",
        original_amount: 2500000,
        paid_amount: 0,
        outstanding_amount: 2500000,
        days_outstanding: 45,
        aging_bucket: "31-45",
        msme_compliance_status: "compliant",
        payment_terms: "Net 30",
        priority: "high",
        status: "overdue",
        created_by: "Rajesh Kumar",
        created_date: "2024-09-15",
        last_modified: "2024-11-01"
      },
      {
        id: "PAY002",
        vendor_id: "V002",
        vendor_name: "SmartTech Solutions Pvt Ltd",
        vendor_type: "msme",
        vendor_gstin: "29AABCS1234D1Z5",
        udyam_number: "UDYAM-KA-03-0012345",
        invoice_number: "STS/2024/0345",
        invoice_date: "2024-10-20",
        due_date: "2024-11-04",
        original_amount: 350000,
        paid_amount: 0,
        outstanding_amount: 350000,
        days_outstanding: 12,
        aging_bucket: "0-30",
        msme_compliance_status: "at_risk",
        msme_days_remaining: 3,
        payment_terms: "MSME 15 Days",
        priority: "high",
        status: "pending",
        created_by: "Priya Sharma",
        created_date: "2024-10-20",
        last_modified: "2024-11-01"
      },
      {
        id: "PAY003",
        vendor_id: "V003",
        vendor_name: "Reliance Industries Limited",
        vendor_type: "non_msme",
        vendor_gstin: "24AABCR5055K1Z8",
        invoice_number: "RIL/2024/78901",
        invoice_date: "2024-08-25",
        due_date: "2024-09-24",
        original_amount: 4200000,
        paid_amount: 2100000,
        outstanding_amount: 2100000,
        days_outstanding: 68,
        aging_bucket: "61-90",
        msme_compliance_status: "compliant",
        payment_terms: "Net 30",
        priority: "medium",
        status: "partially_paid",
        last_payment_date: "2024-09-30",
        created_by: "Amit Singh",
        created_date: "2024-08-25",
        last_modified: "2024-10-28"
      },
      {
        id: "PAY004",
        vendor_id: "V004",
        vendor_name: "Digital Innovations MSME",
        vendor_type: "msme",
        vendor_gstin: "36AABCD4567E1F2",
        udyam_number: "UDYAM-TG-05-0067890",
        invoice_number: "DI/2024/1001",
        invoice_date: "2024-09-10",
        due_date: "2024-09-25",
        original_amount: 180000,
        paid_amount: 0,
        outstanding_amount: 180000,
        days_outstanding: 52,
        aging_bucket: "46-60",
        msme_compliance_status: "violated",
        msme_days_remaining: -37,
        payment_terms: "MSME 15 Days",
        priority: "high",
        status: "overdue",
        remarks: "MSME compliance violation - immediate payment required",
        created_by: "Neha Gupta",
        created_date: "2024-09-10",
        last_modified: "2024-11-01"
      },
      {
        id: "PAY005",
        vendor_id: "V005",
        vendor_name: "Infosys Limited",
        vendor_type: "non_msme",
        vendor_gstin: "29AABCI1681G1Z0",
        invoice_number: "INFY/2024/4567",
        invoice_date: "2024-10-25",
        due_date: "2024-11-24",
        original_amount: 1750000,
        paid_amount: 0,
        outstanding_amount: 1750000,
        days_outstanding: 7,
        aging_bucket: "0-30",
        msme_compliance_status: "compliant",
        payment_terms: "Net 30",
        priority: "medium",
        status: "pending",
        created_by: "Suresh Reddy",
        created_date: "2024-10-25",
        last_modified: "2024-11-01"
      },
      {
        id: "PAY006",
        vendor_id: "V006",
        vendor_name: "Green Energy MSME Co",
        vendor_type: "msme",
        vendor_gstin: "19AABCG8901H2I3",
        udyam_number: "UDYAM-WB-07-0098765",
        invoice_number: "GEC/2024/2345",
        invoice_date: "2024-07-15",
        due_date: "2024-07-30",
        original_amount: 450000,
        paid_amount: 0,
        outstanding_amount: 450000,
        days_outstanding: 124,
        aging_bucket: "90+",
        msme_compliance_status: "violated",
        msme_days_remaining: -109,
        payment_terms: "MSME 15 Days",
        priority: "high",
        status: "overdue",
        remarks: "Critical MSME violation - legal action possible",
        created_by: "Kavya Patel",
        created_date: "2024-07-15",
        last_modified: "2024-11-01"
      }
    ];

    // Mock MSME Alerts
    const mockMSMEAlerts: MSMEAlert[] = [
      {
        id: "ALERT001",
        vendor_name: "SmartTech Solutions Pvt Ltd",
        vendor_id: "V002",
        udyam_number: "UDYAM-KA-03-0012345",
        invoice_number: "STS/2024/0345",
        invoice_date: "2024-10-20",
        due_date: "2024-11-04",
        outstanding_amount: 350000,
        days_to_violation: 3,
        alert_type: "warning",
        alert_message: "MSME payment due in 3 days. Compliance violation risk.",
        created_date: "2024-11-01"
      },
      {
        id: "ALERT002",
        vendor_name: "Digital Innovations MSME",
        vendor_id: "V004",
        udyam_number: "UDYAM-TG-05-0067890",
        invoice_number: "DI/2024/1001",
        invoice_date: "2024-09-10",
        due_date: "2024-09-25",
        outstanding_amount: 180000,
        days_to_violation: -37,
        alert_type: "violated",
        alert_message: "CRITICAL: MSME payment overdue by 37 days. Immediate action required.",
        created_date: "2024-09-26"
      },
      {
        id: "ALERT003",
        vendor_name: "Green Energy MSME Co",
        vendor_id: "V006",
        udyam_number: "UDYAM-WB-07-0098765",
        invoice_number: "GEC/2024/2345",
        invoice_date: "2024-07-15",
        due_date: "2024-07-30",
        outstanding_amount: 450000,
        days_to_violation: -109,
        alert_type: "violated",
        alert_message: "SEVERE: MSME payment overdue by 109 days. Legal action possible.",
        created_date: "2024-07-31"
      }
    ];

    // Mock Payment Summary
    const mockPaymentSummary: PaymentSummary[] = [
      {
        vendor_id: "V001",
        vendor_name: "Tata Consultancy Services",
        vendor_type: "non_msme",
        total_outstanding: 2500000,
        total_invoices: 1,
        overdue_amount: 2500000,
        overdue_invoices: 1,
        msme_violations: 0,
        oldest_invoice_days: 45,
        payment_score: 75
      },
      {
        vendor_id: "V002",
        vendor_name: "SmartTech Solutions Pvt Ltd",
        vendor_type: "msme",
        total_outstanding: 350000,
        total_invoices: 1,
        overdue_amount: 0,
        overdue_invoices: 0,
        msme_violations: 0,
        oldest_invoice_days: 12,
        payment_score: 85
      },
      {
        vendor_id: "V004",
        vendor_name: "Digital Innovations MSME",
        vendor_type: "msme",
        total_outstanding: 180000,
        total_invoices: 1,
        overdue_amount: 180000,
        overdue_invoices: 1,
        msme_violations: 1,
        oldest_invoice_days: 52,
        payment_score: 25
      },
      {
        vendor_id: "V006",
        vendor_name: "Green Energy MSME Co",
        vendor_type: "msme",
        total_outstanding: 450000,
        total_invoices: 1,
        overdue_amount: 450000,
        overdue_invoices: 1,
        msme_violations: 1,
        oldest_invoice_days: 124,
        payment_score: 15
      }
    ];

    // Mock Cash Flow Forecast
    const mockCashFlowForecast: CashFlowForecast[] = [
      {
        period: "This Week",
        planned_payments: 350000,
        critical_payments: 350000,
        msme_payments: 350000,
        total_due: 350000,
        available_balance: 5000000,
        deficit: 0
      },
      {
        period: "Next Week",
        planned_payments: 2500000,
        critical_payments: 2500000,
        msme_payments: 0,
        total_due: 2500000,
        available_balance: 5000000,
        deficit: 0
      },
      {
        period: "This Month",
        planned_payments: 8380000,
        critical_payments: 3430000,
        msme_payments: 980000,
        total_due: 8380000,
        available_balance: 5000000,
        deficit: 3380000
      },
      {
        period: "Next Month",
        planned_payments: 1750000,
        critical_payments: 0,
        msme_payments: 0,
        total_due: 1750000,
        available_balance: 5000000,
        deficit: 0
      }
    ];

    // Mock Payment Reminders
    const mockPaymentReminders: PaymentReminder[] = [
      {
        id: "REM001",
        vendor_id: "V001",
        vendor_name: "Tata Consultancy Services",
        invoice_numbers: ["TCS/INV/2024/001"],
        total_amount: 2500000,
        reminder_type: "email",
        reminder_level: "firm",
        sent_date: "2024-10-30",
        response_received: false,
        next_reminder_date: "2024-11-05",
        created_by: "Rajesh Kumar"
      },
      {
        id: "REM002",
        vendor_id: "V004",
        vendor_name: "Digital Innovations MSME",
        invoice_numbers: ["DI/2024/1001"],
        total_amount: 180000,
        reminder_type: "call",
        reminder_level: "final",
        sent_date: "2024-10-25",
        response_received: true,
        created_by: "Neha Gupta"
      }
    ];

    setPayables(mockPayables);
    setMsmeAlerts(mockMSMEAlerts);
    setPaymentSummary(mockPaymentSummary);
    setCashFlowForecast(mockCashFlowForecast);
    setPaymentReminders(mockPaymentReminders);

    // Calculate stats
    const totalOutstanding = mockPayables.reduce((sum, p) => sum + p.outstanding_amount, 0);
    const msmeOutstanding = mockPayables
      .filter(p => p.vendor_type === 'msme')
      .reduce((sum, p) => sum + p.outstanding_amount, 0);
    const overdueAmount = mockPayables
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.outstanding_amount, 0);
    const msmeViolations = mockPayables
      .filter(p => p.msme_compliance_status === 'violated').length;
    const vendorsAtRisk = mockPayables
      .filter(p => p.msme_compliance_status === 'at_risk').length;
    const weeklyDue = mockPayables
      .filter(p => p.days_outstanding >= 0 && p.days_outstanding <= 7)
      .reduce((sum, p) => sum + p.outstanding_amount, 0);
    const monthlyDue = mockPayables
      .filter(p => p.days_outstanding >= 0 && p.days_outstanding <= 30)
      .reduce((sum, p) => sum + p.outstanding_amount, 0);
    const criticalPayments = mockPayables
      .filter(p => p.priority === 'high' || p.msme_compliance_status === 'violated')
      .length;

    setStats({
      total_outstanding: totalOutstanding,
      msme_outstanding: msmeOutstanding,
      overdue_amount: overdueAmount,
      msme_violations: msmeViolations,
      vendors_at_risk: vendorsAtRisk,
      payment_score: 78,
      weekly_due: weeklyDue,
      monthly_due: monthlyDue,
      critical_payments: criticalPayments
    });
  };

  const filteredPayables = payables.filter(payable => {
    const matchesSearch = searchTerm === "" || 
      payable.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payable.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payable.vendor_gstin && payable.vendor_gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesVendorType = vendorTypeFilter === "all" || payable.vendor_type === vendorTypeFilter;
    const matchesAging = agingFilter === "all" || payable.aging_bucket === agingFilter;
    const matchesStatus = statusFilter === "all" || payable.status === statusFilter;
    
    return matchesSearch && matchesVendorType && matchesAging && matchesStatus;
  });

  const handleMakePayment = (payableId: string, amount: number) => {
    const payable = payables.find(p => p.id === payableId);
    if (payable) {
      setSelectedPayable(payable);
      setPaymentFormData({
        vendor_id: payable.vendor_id,
        invoice_id: payableId,
        payment_amount: amount.toString(),
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        reference_number: '',
        bank_account: '',
        remarks: ''
      });
      setShowPaymentForm(true);
    }
  };

  const handleSavePayment = () => {
    if (!paymentFormData.payment_amount || !paymentFormData.payment_method || !selectedPayable) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(paymentFormData.payment_amount);
    
    setPayables(prev => prev.map(payable => {
      if (payable.id === selectedPayable.id) {
        const newPaidAmount = payable.paid_amount + paymentAmount;
        const newOutstanding = payable.original_amount - newPaidAmount;
        const newStatus = newOutstanding <= 0 ? 'paid' : newOutstanding < payable.outstanding_amount ? 'partially_paid' : payable.status;
        
        return {
          ...payable,
          paid_amount: newPaidAmount,
          outstanding_amount: newOutstanding,
          status: newStatus,
          last_payment_date: paymentFormData.payment_date,
          last_modified: new Date().toISOString().split('T')[0]
        };
      }
      return payable;
    }));

    toast({
      title: "Payment Recorded",
      description: `Payment of ${formatCurrency(paymentAmount)} recorded successfully`,
    });

    setShowPaymentForm(false);
    setSelectedPayable(null);
  };

  const handleSendReminder = (payableId: string) => {
    const payable = payables.find(p => p.id === payableId);
    if (payable) {
      // Add reminder to the list
      const newReminder: PaymentReminder = {
        id: `REM${String(paymentReminders.length + 1).padStart(3, '0')}`,
        vendor_id: payable.vendor_id,
        vendor_name: payable.vendor_name,
        invoice_numbers: [payable.invoice_number],
        total_amount: payable.outstanding_amount,
        reminder_type: 'email',
        reminder_level: 'gentle',
        sent_date: new Date().toISOString().split('T')[0],
        response_received: false,
        next_reminder_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_by: "Current User"
      };

      setPaymentReminders(prev => [...prev, newReminder]);

      toast({
        title: "Reminder Sent",
        description: `Payment reminder sent to ${payable.vendor_name}`,
      });
    }
  };

  const handleBulkReminder = () => {
    if (selectedRecords.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select records to send reminders",
        variant: "destructive",
      });
      return;
    }

    // Group by vendor for bulk reminders
    const remindersByVendor = selectedRecords.reduce((acc, payableId) => {
      const payable = payables.find(p => p.id === payableId);
      if (payable) {
        if (!acc[payable.vendor_id]) {
          acc[payable.vendor_id] = {
            vendor_name: payable.vendor_name,
            invoices: [],
            total_amount: 0
          };
        }
        acc[payable.vendor_id].invoices.push(payable.invoice_number);
        acc[payable.vendor_id].total_amount += payable.outstanding_amount;
      }
      return acc;
    }, {} as Record<string, { vendor_name: string; invoices: string[]; total_amount: number }>);

    // Create reminders for each vendor
    Object.entries(remindersByVendor).forEach(([vendorId, data]) => {
      const newReminder: PaymentReminder = {
        id: `REM${String(paymentReminders.length + 1).padStart(3, '0')}`,
        vendor_id: vendorId,
        vendor_name: data.vendor_name,
        invoice_numbers: data.invoices,
        total_amount: data.total_amount,
        reminder_type: 'email',
        reminder_level: 'gentle',
        sent_date: new Date().toISOString().split('T')[0],
        response_received: false,
        next_reminder_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_by: "Current User"
      };

      setPaymentReminders(prev => [...prev, newReminder]);
    });

    toast({
      title: "Bulk Reminders Sent",
      description: `Reminders sent to ${Object.keys(remindersByVendor).length} vendors`,
    });

    setSelectedRecords([]);
  };

  const getComplianceStatusBadge = (status: string, vendorType: string) => {
    if (vendorType !== 'msme') {
      return <Badge className="bg-gray-100 text-gray-600">N/A</Badge>;
    }

    const statusConfig = {
      compliant: { color: "bg-green-100 text-green-800", text: "Compliant" },
      at_risk: { color: "bg-yellow-100 text-yellow-800", text: "At Risk" },
      overdue: { color: "bg-orange-100 text-orange-800", text: "Overdue" },
      violated: { color: "bg-red-100 text-red-800", text: "Violated" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.compliant;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getAgingBadge = (bucket: string) => {
    const agingConfig = agingBuckets.find(b => b.key === bucket);
    return (
      <Badge className={agingConfig?.color || 'bg-gray-100 text-gray-800'}>
        {agingConfig?.label || bucket}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Payables Aging - JusFinn</title>
        <meta name="description" content="Monitor vendor payments with MSME compliance and automated reminders" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Payables Aging
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor vendor payments with MSME compliance and automated reminders
            </p>
          </div>
          <div className="flex gap-3">
            {selectedRecords.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBulkReminder}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Reminders ({selectedRecords.length})
              </Button>
            )}
            <Button 
              onClick={() => setShowPaymentForm(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Outstanding</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.total_outstanding)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">MSME Outstanding</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(stats.msme_outstanding)}</p>
                </div>
                <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(stats.overdue_amount)}</p>
                </div>
                <div className="h-12 w-12 bg-red-200 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Critical Payments</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.critical_payments}</p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* MSME Alerts Banner */}
      {msmeAlerts.filter(alert => alert.alert_type === 'critical' || alert.alert_type === 'violated').length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">MSME Compliance Alerts</h3>
                <div className="space-y-1">
                  {msmeAlerts
                    .filter(alert => alert.alert_type === 'critical' || alert.alert_type === 'violated')
                    .slice(0, 2)
                    .map(alert => (
                      <p key={alert.id} className="text-sm text-red-700">
                        <strong>{alert.vendor_name}</strong>: {alert.alert_message}
                      </p>
                    ))
                  }
                </div>
              </div>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
          <TabsTrigger value="msme">MSME Compliance</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="aging" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Payables Aging Analysis
                  </CardTitle>
                  <CardDescription>
                    Track payment aging with vendor-wise outstanding analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by vendor, invoice, or GSTIN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={vendorTypeFilter} onValueChange={setVendorTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Vendor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="msme">MSME</SelectItem>
                    <SelectItem value="non_msme">Non-MSME</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={agingFilter} onValueChange={setAgingFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Aging" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    {agingBuckets.map(bucket => (
                      <SelectItem key={bucket.key} value={bucket.key}>{bucket.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Aging Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {agingBuckets.map(bucket => {
                  const bucketTotal = filteredPayables
                    .filter(p => p.aging_bucket === bucket.key)
                    .reduce((sum, p) => sum + p.outstanding_amount, 0);
                  
                  return (
                    <Card key={bucket.key} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-3">
                        <p className="text-sm font-medium text-gray-600">{bucket.label}</p>
                        <p className="text-lg font-bold">{formatCurrency(bucketTotal)}</p>
                        <p className="text-xs text-gray-500">
                          {filteredPayables.filter(p => p.aging_bucket === bucket.key).length} invoices
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Payables Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRecords.length === filteredPayables.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecords(filteredPayables.map(p => p.id));
                            } else {
                              setSelectedRecords([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Vendor Details</TableHead>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>Amount Details</TableHead>
                      <TableHead>Aging & Status</TableHead>
                      <TableHead>MSME Compliance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayables.map((payable) => (
                      <TableRow key={payable.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecords.includes(payable.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRecords(prev => [...prev, payable.id]);
                              } else {
                                setSelectedRecords(prev => prev.filter(id => id !== payable.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payable.vendor_name}</p>
                            <p className="text-sm text-gray-500">{payable.vendor_gstin}</p>
                            {payable.udyam_number && (
                              <p className="text-sm text-blue-600">{payable.udyam_number}</p>
                            )}
                            <Badge className={payable.vendor_type === 'msme' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                              {payable.vendor_type.toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payable.invoice_number}</p>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(payable.invoice_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Due: {new Date(payable.due_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">{payable.payment_terms}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Outstanding: {formatCurrency(payable.outstanding_amount)}</p>
                            <p className="text-sm text-gray-500">
                              Original: {formatCurrency(payable.original_amount)}
                            </p>
                            {payable.paid_amount > 0 && (
                              <p className="text-sm text-green-600">
                                Paid: {formatCurrency(payable.paid_amount)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getAgingBadge(payable.aging_bucket)}
                            <p className="text-sm text-gray-600">{payable.days_outstanding} days</p>
                            <Badge className={
                              payable.status === 'paid' ? 'bg-green-100 text-green-800' :
                              payable.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              payable.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {payable.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getComplianceStatusBadge(payable.msme_compliance_status, payable.vendor_type)}
                            {payable.msme_days_remaining !== undefined && (
                              <p className="text-sm text-gray-500">
                                {payable.msme_days_remaining > 0 
                                  ? `${payable.msme_days_remaining} days to comply`
                                  : `${Math.abs(payable.msme_days_remaining)} days overdue`
                                }
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleMakePayment(payable.id, payable.outstanding_amount)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Pay Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(payable.id)}
                            >
                              Remind
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="msme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                MSME Compliance Dashboard
              </CardTitle>
              <CardDescription>
                Monitor MSME payment compliance and violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* MSME Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Compliant MSMEs</p>
                        <p className="text-2xl font-bold text-green-600">
                          {payables.filter(p => p.vendor_type === 'msme' && p.msme_compliance_status === 'compliant').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">At Risk</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.vendors_at_risk}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Violations</p>
                        <p className="text-2xl font-bold text-red-600">{stats.msme_violations}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Outstanding Amount</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(stats.msme_outstanding)}
                        </p>
                      </div>
                      <IndianRupee className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MSME Alerts */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Active MSME Alerts</h3>
                <div className="space-y-3">
                  {msmeAlerts.map((alert) => (
                    <Card key={alert.id} className={`border-l-4 ${
                      alert.alert_type === 'violated' ? 'border-l-red-500 bg-red-50' :
                      alert.alert_type === 'critical' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-yellow-500 bg-yellow-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{alert.vendor_name}</h4>
                              <Badge className={
                                alert.alert_type === 'violated' ? 'bg-red-100 text-red-800' :
                                alert.alert_type === 'critical' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {alert.alert_type.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{alert.alert_message}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Invoice</p>
                                <p className="font-medium">{alert.invoice_number}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="font-medium">{formatCurrency(alert.outstanding_amount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Days to/Past Due</p>
                                <p className="font-medium">{alert.days_to_violation} days</p>
                              </div>
                              <div>
                                <p className="text-gray-500">UDYAM</p>
                                <p className="font-medium">{alert.udyam_number}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Pay Now
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cash Flow Forecasting
              </CardTitle>
              <CardDescription>
                Plan payments and manage cash flow with priority-based forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Cash Flow Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600">Available Balance</p>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(5000000)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">This Week Due</p>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.weekly_due)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-orange-600">Critical Payments</p>
                        <p className="text-2xl font-bold text-orange-700">{stats.critical_payments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cash Flow Forecast Table */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Payment Forecast</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Planned Payments</TableHead>
                        <TableHead>Critical Payments</TableHead>
                        <TableHead>MSME Payments</TableHead>
                        <TableHead>Available Balance</TableHead>
                        <TableHead>Surplus/Deficit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashFlowForecast.map((forecast, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <p className="font-medium">{forecast.period}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{formatCurrency(forecast.planned_payments)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-orange-600">{formatCurrency(forecast.critical_payments)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-blue-600">{formatCurrency(forecast.msme_payments)}</p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{formatCurrency(forecast.available_balance)}</p>
                          </TableCell>
                          <TableCell>
                            <p className={`font-medium ${forecast.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {forecast.deficit > 0 ? `-${formatCurrency(forecast.deficit)}` : formatCurrency(forecast.available_balance - forecast.planned_payments)}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Payment Priority Analysis */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Priority Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-700">High Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {payables
                        .filter(p => p.priority === 'high' || p.msme_compliance_status === 'violated')
                        .slice(0, 3)
                        .map(payable => (
                          <div key={payable.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{payable.vendor_name}</p>
                              <p className="text-xs text-gray-600">{payable.invoice_number}</p>
                            </div>
                            <p className="font-medium text-red-600">{formatCurrency(payable.outstanding_amount)}</p>
                          </div>
                        ))
                      }
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-yellow-700">Medium Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {payables
                        .filter(p => p.priority === 'medium')
                        .slice(0, 3)
                        .map(payable => (
                          <div key={payable.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{payable.vendor_name}</p>
                              <p className="text-xs text-gray-600">{payable.invoice_number}</p>
                            </div>
                            <p className="font-medium text-yellow-600">{formatCurrency(payable.outstanding_amount)}</p>
                          </div>
                        ))
                      }
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-700">Low Priority</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {payables
                        .filter(p => p.priority === 'low')
                        .slice(0, 3)
                        .map(payable => (
                          <div key={payable.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{payable.vendor_name}</p>
                              <p className="text-xs text-gray-600">{payable.invoice_number}</p>
                            </div>
                            <p className="font-medium text-green-600">{formatCurrency(payable.outstanding_amount)}</p>
                          </div>
                        ))
                      }
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Payment Reminders
                  </CardTitle>
                  <CardDescription>
                    Automated reminder system with escalation workflows
                  </CardDescription>
                </div>
                <Button onClick={() => setShowReminderForm(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Reminder Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-600">Total Sent</p>
                    <p className="text-2xl font-bold text-blue-600">{paymentReminders.length}</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-600">Responses</p>
                    <p className="text-2xl font-bold text-green-600">
                      {paymentReminders.filter(r => r.response_received).length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {paymentReminders.filter(r => !r.response_received).length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {paymentReminders.filter(r => {
                        const sentDate = new Date(r.sent_date);
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return sentDate >= weekAgo;
                      }).length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Reminders List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Recent Reminders</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Invoices</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type & Level</TableHead>
                        <TableHead>Sent Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentReminders.map((reminder) => (
                        <TableRow key={reminder.id}>
                          <TableCell>
                            <p className="font-medium">{reminder.vendor_name}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              {reminder.invoice_numbers.slice(0, 2).map(invoice => (
                                <p key={invoice} className="text-sm">{invoice}</p>
                              ))}
                              {reminder.invoice_numbers.length > 2 && (
                                <p className="text-xs text-gray-500">+{reminder.invoice_numbers.length - 2} more</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{formatCurrency(reminder.total_amount)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className="bg-blue-100 text-blue-800">
                                {reminder.reminder_type.toUpperCase()}
                              </Badge>
                              <Badge className={
                                reminder.reminder_level === 'gentle' ? 'bg-green-100 text-green-800' :
                                reminder.reminder_level === 'firm' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {reminder.reminder_level.toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{new Date(reminder.sent_date).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={reminder.response_received ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                              {reminder.response_received ? 'Responded' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {reminder.next_reminder_date && !reminder.response_received ? (
                              <p className="text-sm text-gray-600">
                                {new Date(reminder.next_reminder_date).toLocaleDateString()}
                              </p>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Payment Trends
                </CardTitle>
                <CardDescription>
                  Monthly payment patterns and aging analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart representation */}
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end justify-between">
                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                      <div key={month} className="flex flex-col items-center">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ 
                            height: `${100 + index * 25}px`, 
                            width: '28px',
                            marginBottom: '8px'
                          }}
                        />
                        <div 
                          className="bg-gradient-to-t from-red-500 to-red-400 rounded-t"
                          style={{ 
                            height: `${30 + index * 8}px`, 
                            width: '28px',
                            marginBottom: '8px'
                          }}
                        />
                        <span className="text-xs text-gray-600">{month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-sm">Paid On Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-sm">Overdue</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MSME Compliance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  MSME Compliance Score
                </CardTitle>
                <CardDescription>
                  Compliance tracking over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">78%</div>
                    <p className="text-gray-600">Overall Compliance Score</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-time Payments</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Zero Violations</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quick Resolution</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Top Vendors by Outstanding
                </CardTitle>
                <CardDescription>
                  Largest outstanding amounts by vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentSummary
                    .sort((a, b) => b.total_outstanding - a.total_outstanding)
                    .slice(0, 5)
                    .map((vendor, index) => (
                      <div key={vendor.vendor_id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{vendor.vendor_name}</p>
                            <p className="text-xs text-gray-500">{vendor.vendor_type.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(vendor.total_outstanding)}</p>
                          <p className="text-xs text-gray-500">{vendor.total_invoices} invoices</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common payables management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Download className="w-6 h-6 mb-1" />
                    <span className="text-xs">Export Aging</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Send className="w-6 h-6 mb-1" />
                    <span className="text-xs">Bulk Reminders</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Shield className="w-6 h-6 mb-1" />
                    <span className="text-xs">MSME Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Calculator className="w-6 h-6 mb-1" />
                    <span className="text-xs">Payment Plan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Payment Details</h3>
              
              {selectedPayable && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{selectedPayable.vendor_name}</p>
                  <p className="text-sm text-gray-600">{selectedPayable.invoice_number}</p>
                  <p className="text-sm text-gray-600">Outstanding: {formatCurrency(selectedPayable.outstanding_amount)}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="payment_amount">Payment Amount *</Label>
                <Input
                  id="payment_amount"
                  type="number"
                  value={paymentFormData.payment_amount}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, payment_amount: e.target.value }))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <Label htmlFor="payment_date">Payment Date *</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={paymentFormData.payment_date}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select 
                  value={paymentFormData.payment_method} 
                  onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Transaction Details</h3>
              
              <div>
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={paymentFormData.reference_number}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                  placeholder="UTR/Cheque/Reference Number"
                />
              </div>
              
              <div>
                <Label htmlFor="bank_account">Bank Account</Label>
                <Input
                  id="bank_account"
                  value={paymentFormData.bank_account}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, bank_account: e.target.value }))}
                  placeholder="Bank account used"
                />
              </div>
              
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={paymentFormData.remarks}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePayment} className="bg-green-600 hover:bg-green-700">
              Record Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default PayablesAging; 