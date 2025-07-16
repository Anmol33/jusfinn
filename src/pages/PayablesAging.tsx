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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
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
  BarChart3
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

const PayablesAging = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("aging");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payables, setPayables] = useState<PayableRecord[]>([]);
  const [msmeAlerts, setMsmeAlerts] = useState<MSMEAlert[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("all");
  const [agingFilter, setAgingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_outstanding: 0,
    msme_outstanding: 0,
    overdue_amount: 0,
    msme_violations: 0,
    vendors_at_risk: 0,
    payment_score: 0
  });

  // Aging buckets for analysis
  const agingBuckets = [
    { key: '0-30', label: '0-30 Days', color: 'bg-green-100 text-green-800' },
    { key: '31-45', label: '31-45 Days', color: 'bg-yellow-100 text-yellow-800' },
    { key: '46-60', label: '46-60 Days', color: 'bg-orange-100 text-orange-800' },
    { key: '61-90', label: '61-90 Days', color: 'bg-red-100 text-red-800' },
    { key: '90+', label: '90+ Days', color: 'bg-red-200 text-red-900' }
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadPayablesData();
    loadStats();
  }, []);

  const loadPayablesData = async () => {
    setLoading(true);
    
    // Mock Payable Records
    const mockPayables: PayableRecord[] = [
      {
        id: "1",
        vendor_id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_type: "msme",
        vendor_gstin: "06ABCPD1234E1Z5",
        udyam_number: "UDYAM-HR-03-0012345",
        invoice_number: "ABC-001",
        invoice_date: "2024-02-15",
        due_date: "2024-03-16",
        original_amount: 100000,
        paid_amount: 0,
        outstanding_amount: 100000,
        days_outstanding: 30,
        aging_bucket: "0-30",
        msme_compliance_status: "compliant",
        msme_days_remaining: 15,
        payment_terms: "30 days",
        priority: "medium",
        status: "pending",
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-02-15"
      },
      {
        id: "2",
        vendor_id: "2",
        vendor_name: "XYZ Consultants",
        vendor_type: "non_msme",
        vendor_gstin: "07XYZPD5678F1Z8",
        invoice_number: "XYZ-002",
        invoice_date: "2024-01-20",
        due_date: "2024-02-19",
        original_amount: 50000,
        paid_amount: 20000,
        outstanding_amount: 30000,
        days_outstanding: 55,
        aging_bucket: "46-60",
        msme_compliance_status: "compliant",
        payment_terms: "30 days",
        priority: "low",
        status: "partially_paid",
        last_payment_date: "2024-02-10",
        created_by: "User 2",
        created_date: "2024-01-20",
        last_modified: "2024-02-10"
      },
      {
        id: "3",
        vendor_id: "3",
        vendor_name: "MSME Tech Solutions",
        vendor_type: "msme",
        vendor_gstin: "24MSME1234T1Z3",
        udyam_number: "UDYAM-GJ-05-0067890",
        invoice_number: "MSME-003",
        invoice_date: "2024-01-01",
        due_date: "2024-01-31",
        original_amount: 75000,
        paid_amount: 0,
        outstanding_amount: 75000,
        days_outstanding: 70,
        aging_bucket: "61-90",
        msme_compliance_status: "violated",
        payment_terms: "30 days",
        priority: "high",
        status: "overdue",
        created_by: "User 1",
        created_date: "2024-01-01",
        last_modified: "2024-01-01"
      }
    ];

    // Mock MSME Alerts
    const mockMSMEAlerts: MSMEAlert[] = [
      {
        id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_id: "1",
        udyam_number: "UDYAM-HR-03-0012345",
        invoice_number: "ABC-001",
        invoice_date: "2024-02-15",
        due_date: "2024-03-16",
        outstanding_amount: 100000,
        days_to_violation: 15,
        alert_type: "warning",
        alert_message: "MSME payment due in 15 days",
        created_date: "2024-03-01"
      },
      {
        id: "2",
        vendor_name: "MSME Tech Solutions",
        vendor_id: "3",
        udyam_number: "UDYAM-GJ-05-0067890",
        invoice_number: "MSME-003",
        invoice_date: "2024-01-01",
        due_date: "2024-01-31",
        outstanding_amount: 75000,
        days_to_violation: -25,
        alert_type: "violated",
        alert_message: "MSME payment overdue by 25 days - Legal compliance violation",
        created_date: "2024-02-25"
      }
    ];

    // Mock Payment Summary
    const mockPaymentSummary: PaymentSummary[] = [
      {
        vendor_id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_type: "msme",
        total_outstanding: 100000,
        total_invoices: 1,
        overdue_amount: 0,
        overdue_invoices: 0,
        msme_violations: 0,
        oldest_invoice_days: 30,
        payment_score: 85
      },
      {
        vendor_id: "3",
        vendor_name: "MSME Tech Solutions",
        vendor_type: "msme",
        total_outstanding: 75000,
        total_invoices: 1,
        overdue_amount: 75000,
        overdue_invoices: 1,
        msme_violations: 1,
        oldest_invoice_days: 70,
        payment_score: 25
      }
    ];

    setPayables(mockPayables);
    setMsmeAlerts(mockMSMEAlerts);
    setPaymentSummary(mockPaymentSummary);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total_outstanding: 1250000,
      msme_outstanding: 450000,
      overdue_amount: 280000,
      msme_violations: 3,
      vendors_at_risk: 8,
      payment_score: 72
    });
  };

  const handleMakePayment = (payableId: string, amount: number) => {
    setPayables(prev => prev.map(payable => {
      if (payable.id === payableId) {
        const newPaidAmount = payable.paid_amount + amount;
        const newOutstanding = payable.original_amount - newPaidAmount;
        const newStatus = newOutstanding <= 0 ? "paid" : "partially_paid";
        
        return {
          ...payable,
          paid_amount: newPaidAmount,
          outstanding_amount: newOutstanding,
          status: newStatus as any,
          last_payment_date: new Date().toISOString().split('T')[0]
        };
      }
      return payable;
    }));
    
    toast({
      title: "💰 Payment Recorded",
      description: `Payment of ₹${amount.toLocaleString()} recorded successfully.`,
    });
  };

  const handleSendReminder = (payableId: string) => {
    toast({
      title: "📧 Reminder Sent",
      description: "Payment reminder sent to vendor successfully.",
    });
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-orange-100 text-orange-800';
      case 'violated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'violated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgingBucketColor = (bucket: string) => {
    const bucketConfig = agingBuckets.find(b => b.key === bucket);
    return bucketConfig ? bucketConfig.color : 'bg-gray-100 text-gray-800';
  };

  const filteredPayables = payables.filter(payable => {
    const matchesSearch = 
      payable.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payable.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendorType = vendorTypeFilter === "all" || payable.vendor_type === vendorTypeFilter;
    const matchesAging = agingFilter === "all" || payable.aging_bucket === agingFilter;
    const matchesStatus = statusFilter === "all" || payable.status === statusFilter;
    return matchesSearch && matchesVendorType && matchesAging && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Payables Aging - JusFinn AI</title>
        <meta name="description" content="Track accounts payable aging with MSME compliance monitoring and automated payment reminders." />
        <meta name="keywords" content="payables aging, accounts payable, MSME compliance, payment tracking, vendor payments, aging analysis" />
        <meta property="og:title" content="Payables Aging - JusFinn AI" />
        <meta property="og:description" content="Comprehensive payables management with MSME compliance and aging analysis." />
        <link rel="canonical" href="https://your-domain.com/payables-aging" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payables Aging</h1>
          <p className="text-gray-600 mt-2">
            Track vendor payments with MSME compliance and aging analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowPaymentForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_outstanding/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total payables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MSME Outstanding</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.msme_outstanding/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              MSME vendors
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.overdue_amount/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Past due amount
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MSME Violations</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.msme_violations}</div>
            <p className="text-xs text-muted-foreground">
              Compliance breaches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.vendors_at_risk}</div>
            <p className="text-xs text-muted-foreground">
              Vendors at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.payment_score}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MSME Alerts */}
      {msmeAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="w-5 h-5" />
              MSME Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {msmeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getAlertTypeColor(alert.alert_type)}>
                        {alert.alert_type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.vendor_name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.alert_message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Invoice: {alert.invoice_number} | Amount: ₹{alert.outstanding_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
          <TabsTrigger value="msme">MSME Compliance</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Summary</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="aging" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by vendor name or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={vendorTypeFilter} onValueChange={setVendorTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Vendor Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="msme">MSME</SelectItem>
                      <SelectItem value="non_msme">Non-MSME</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={agingFilter} onValueChange={setAgingFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Aging" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      {agingBuckets.map((bucket) => (
                        <SelectItem key={bucket.key} value={bucket.key}>
                          {bucket.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partially_paid">Partially Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aging Buckets Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {agingBuckets.map((bucket) => {
              const bucketPayables = payables.filter(p => p.aging_bucket === bucket.key);
              const bucketAmount = bucketPayables.reduce((sum, p) => sum + p.outstanding_amount, 0);
              
              return (
                <Card key={bucket.key}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Badge className={bucket.color + " mb-2"}>
                        {bucket.label}
                      </Badge>
                      <div className="text-2xl font-bold">₹{(bucketAmount/1000).toFixed(0)}K</div>
                      <p className="text-sm text-gray-600">{bucketPayables.length} invoices</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Payables Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payables Aging Report</CardTitle>
              <CardDescription>
                Detailed aging analysis with MSME compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Aging</TableHead>
                      <TableHead>MSME Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayables.map((payable) => (
                      <TableRow key={payable.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {payable.vendor_name}
                              {payable.vendor_type === 'msme' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  MSME
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{payable.vendor_gstin}</div>
                            {payable.udyam_number && (
                              <div className="text-xs text-gray-400">{payable.udyam_number}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payable.invoice_number}</div>
                            <div className="text-sm text-gray-500">
                              Date: {new Date(payable.invoice_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Due: {new Date(payable.due_date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{payable.outstanding_amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              Original: ₹{payable.original_amount.toLocaleString()}
                            </div>
                            {payable.paid_amount > 0 && (
                              <div className="text-sm text-green-600">
                                Paid: ₹{payable.paid_amount.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge className={getAgingBucketColor(payable.aging_bucket)}>
                              {payable.days_outstanding} days
                            </Badge>
                            <div className="text-sm text-gray-500 mt-1">
                              {payable.aging_bucket} bucket
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge className={getComplianceStatusColor(payable.msme_compliance_status)}>
                              {payable.msme_compliance_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {payable.msme_days_remaining !== undefined && (
                              <div className="text-sm text-gray-500 mt-1">
                                {payable.msme_days_remaining > 0 
                                  ? `${payable.msme_days_remaining} days left`
                                  : `${Math.abs(payable.msme_days_remaining)} days overdue`
                                }
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(payable.priority)}>
                            {payable.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* View details */}}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMakePayment(payable.id, payable.outstanding_amount)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(payable.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Send className="w-4 h-4" />
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
                Monitor 45-day payment rule compliance for MSME vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {payables.filter(p => p.vendor_type === 'msme' && p.msme_compliance_status === 'compliant').length}
                    </div>
                    <p className="text-sm text-gray-600">Compliant MSME Vendors</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {payables.filter(p => p.vendor_type === 'msme' && p.msme_compliance_status === 'at_risk').length}
                    </div>
                    <p className="text-sm text-gray-600">At Risk</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {payables.filter(p => p.vendor_type === 'msme' && p.msme_compliance_status === 'violated').length}
                    </div>
                    <p className="text-sm text-gray-600">Violations</p>
                  </CardContent>
                </Card>
              </div>

              {/* MSME Payables Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSME Vendor</TableHead>
                      <TableHead>Udyam Number</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Days Outstanding</TableHead>
                      <TableHead>Compliance Status</TableHead>
                      <TableHead>Action Required</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.filter(p => p.vendor_type === 'msme').map((payable) => (
                      <TableRow key={payable.id}>
                        <TableCell>
                          <div className="font-medium">{payable.vendor_name}</div>
                          <div className="text-sm text-gray-500">{payable.invoice_number}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-mono">{payable.udyam_number}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{payable.outstanding_amount.toLocaleString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{payable.days_outstanding} days</div>
                          <div className="text-sm text-gray-500">
                            Due: {new Date(payable.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getComplianceStatusColor(payable.msme_compliance_status)}>
                            {payable.msme_compliance_status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {payable.msme_days_remaining !== undefined && (
                            <div className="text-sm text-gray-500 mt-1">
                              {payable.msme_days_remaining > 0 
                                ? `${payable.msme_days_remaining} days to comply`
                                : `${Math.abs(payable.msme_days_remaining)} days overdue`
                              }
                            </div>
                          )}
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

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Vendor Payment Summary
              </CardTitle>
              <CardDescription>
                Consolidated view of vendor payment performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentSummary.map((summary) => (
                  <div key={summary.vendor_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{summary.vendor_name}</h3>
                          <Badge variant="outline" className={summary.vendor_type === 'msme' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}>
                            {summary.vendor_type.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500">Score:</span>
                            <Badge className={summary.payment_score >= 80 ? 'bg-green-100 text-green-800' : 
                                           summary.payment_score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-red-100 text-red-800'}>
                              {summary.payment_score}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Total Outstanding</p>
                            <p className="font-medium">₹{summary.total_outstanding.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{summary.total_invoices} invoices</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Overdue Amount</p>
                            <p className="font-medium text-red-600">₹{summary.overdue_amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">{summary.overdue_invoices} overdue</p>
                          </div>
                          <div>
                            <p className="text-gray-500">MSME Violations</p>
                            <p className="font-medium text-red-600">{summary.msme_violations}</p>
                            <p className="text-xs text-gray-400">Compliance breaches</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Oldest Invoice</p>
                            <p className="font-medium">{summary.oldest_invoice_days} days</p>
                            <p className="text-xs text-gray-400">Age of oldest unpaid</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Payment Trends
                </CardTitle>
                <CardDescription>
                  Track payment patterns and aging trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  MSME Compliance Metrics
                </CardTitle>
                <CardDescription>
                  Monitor MSME payment compliance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">MSME analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Payables Reports
              </CardTitle>
              <CardDescription>
                Generate comprehensive aging and compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Clock className="w-8 h-8 mb-2" />
                  <span>Aging Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Shield className="w-8 h-8 mb-2" />
                  <span>MSME Compliance Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Building2 className="w-8 h-8 mb-2" />
                  <span>Vendor Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <span>Overdue Analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Form Dialog - Placeholder */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Payment recording form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include vendor selection, payment method, and automatic aging updates
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Record Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayablesAging; 