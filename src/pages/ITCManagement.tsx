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
import { 
  Receipt, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  FileText,
  Calendar,
  IndianRupee,
  Building2,
  Search,
  Filter,
  XCircle,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ITCRecord {
  id: string;
  invoice_number: string;
  vendor_name: string;
  vendor_gstin: string;
  invoice_date: string;
  invoice_value: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_gst: number;
  itc_eligible_amount: number;
  itc_claimed_amount: number;
  itc_reversed_amount: number;
  itc_status: 'eligible' | 'claimed' | 'reversed' | 'blocked' | 'lapsed';
  claim_reason: string;
  reversal_reason?: string;
  period: string;
  financial_year: string;
  gstr2b_matched: boolean;
  gstr2b_month?: string;
  purchase_type: 'goods' | 'services' | 'capital_goods' | 'input_services';
  hsn_code?: string;
  place_of_supply: string;
  reverse_charge: boolean;
  created_by: string;
  created_date: string;
  last_modified: string;
}

interface GSTR2BRecord {
  id: string;
  supplier_gstin: string;
  supplier_name: string;
  invoice_number: string;
  invoice_date: string;
  invoice_value: number;
  place_of_supply: string;
  reverse_charge: boolean;
  itc_igst: number;
  itc_cgst: number;
  itc_sgst: number;
  itc_cess: number;
  return_period: string;
  matched_with_books: boolean;
  matched_invoice_id?: string;
  discrepancy_amount?: number;
  discrepancy_reason?: string;
  action_required: boolean;
  created_date: string;
}

interface ITCReversal {
  id: string;
  reversal_type: 'rule_42' | 'rule_43' | 'section_17' | 'non_payment' | 'other';
  reversal_reason: string;
  original_itc_amount: number;
  reversal_amount: number;
  reversal_date: string;
  return_period: string;
  status: 'calculated' | 'reversed' | 'filed';
  remarks?: string;
  created_by: string;
  created_date: string;
}

const ITCManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("itc");
  const [showITCForm, setShowITCForm] = useState(false);
  const [editingITC, setEditingITC] = useState<ITCRecord | null>(null);
  const [itcRecords, setItcRecords] = useState<ITCRecord[]>([]);
  const [gstr2bRecords, setGstr2bRecords] = useState<GSTR2BRecord[]>([]);
  const [itcReversals, setItcReversals] = useState<ITCReversal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [stats, setStats] = useState({
    total_itc_eligible: 0,
    total_itc_claimed: 0,
    total_itc_reversed: 0,
    pending_claims: 0,
    gstr2b_unmatched: 0,
    this_month: 0
  });

  // ITC Claim Reasons
  const claimReasons = [
    { value: "inputs", label: "Inputs for Business" },
    { value: "capital_goods", label: "Capital Goods" },
    { value: "input_services", label: "Input Services" },
    { value: "distribution", label: "Inward supplies for distribution" },
    { value: "job_work", label: "Job work services" },
    { value: "construction", label: "Construction services" },
    { value: "other", label: "Other eligible purposes" }
  ];

  // ITC Reversal Reasons
  const reversalReasons = [
    { value: "rule_42", label: "Rule 42 - Proportionate reversal" },
    { value: "rule_43", label: "Rule 43 - Common credit reversal" },
    { value: "section_17", label: "Section 17(5) - Blocked credits" },
    { value: "non_payment", label: "Non-payment to supplier (180 days)" },
    { value: "personal_use", label: "Personal/non-business use" },
    { value: "exempt_supply", label: "Used for exempt supplies" },
    { value: "other", label: "Other reasons" }
  ];

  // Financial periods
  const periods = [
    "Apr-2024", "May-2024", "Jun-2024", "Jul-2024", "Aug-2024", "Sep-2024",
    "Oct-2024", "Nov-2024", "Dec-2024", "Jan-2024", "Feb-2024", "Mar-2024"
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadITCData();
    loadStats();
  }, []);

  const loadITCData = async () => {
    setLoading(true);
    
    // Mock ITC Records
    const mockITCRecords: ITCRecord[] = [
      {
        id: "1",
        invoice_number: "ABC-001",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_gstin: "06ABCPD1234E1Z5",
        invoice_date: "2024-02-15",
        invoice_value: 100000,
        cgst_amount: 9000,
        sgst_amount: 9000,
        igst_amount: 0,
        total_gst: 18000,
        itc_eligible_amount: 18000,
        itc_claimed_amount: 18000,
        itc_reversed_amount: 0,
        itc_status: "claimed",
        claim_reason: "inputs",
        period: "Feb-2024",
        financial_year: "2023-24",
        gstr2b_matched: true,
        gstr2b_month: "Feb-2024",
        purchase_type: "goods",
        hsn_code: "4817",
        place_of_supply: "06",
        reverse_charge: false,
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-02-15"
      },
      {
        id: "2",
        invoice_number: "XYZ-002",
        vendor_name: "XYZ Consultants",
        vendor_gstin: "07XYZPD5678F1Z8",
        invoice_date: "2024-03-05",
        invoice_value: 50000,
        cgst_amount: 4500,
        sgst_amount: 4500,
        igst_amount: 0,
        total_gst: 9000,
        itc_eligible_amount: 9000,
        itc_claimed_amount: 0,
        itc_reversed_amount: 0,
        itc_status: "eligible",
        claim_reason: "input_services",
        period: "Mar-2024",
        financial_year: "2023-24",
        gstr2b_matched: false,
        purchase_type: "services",
        hsn_code: "9954",
        place_of_supply: "07",
        reverse_charge: false,
        created_by: "User 2",
        created_date: "2024-03-05",
        last_modified: "2024-03-05"
      }
    ];

    // Mock GSTR-2B Records
    const mockGSTR2BRecords: GSTR2BRecord[] = [
      {
        id: "1",
        supplier_gstin: "06ABCPD1234E1Z5",
        supplier_name: "ABC Suppliers Pvt Ltd",
        invoice_number: "ABC-001",
        invoice_date: "2024-02-15",
        invoice_value: 100000,
        place_of_supply: "06",
        reverse_charge: false,
        itc_igst: 0,
        itc_cgst: 9000,
        itc_sgst: 9000,
        itc_cess: 0,
        return_period: "022024",
        matched_with_books: true,
        matched_invoice_id: "1",
        action_required: false,
        created_date: "2024-03-12"
      },
      {
        id: "2",
        supplier_gstin: "24DEFGH5678M1Z9",
        supplier_name: "Unknown Supplier",
        invoice_number: "UNK-003",
        invoice_date: "2024-02-20",
        invoice_value: 25000,
        place_of_supply: "24",
        reverse_charge: false,
        itc_igst: 4500,
        itc_cgst: 0,
        itc_sgst: 0,
        itc_cess: 0,
        return_period: "022024",
        matched_with_books: false,
        discrepancy_amount: 25000,
        discrepancy_reason: "Invoice not found in books",
        action_required: true,
        created_date: "2024-03-12"
      }
    ];

    // Mock ITC Reversals
    const mockITCReversals: ITCReversal[] = [
      {
        id: "1",
        reversal_type: "rule_42",
        reversal_reason: "Proportionate reversal for exempt supplies",
        original_itc_amount: 50000,
        reversal_amount: 5000,
        reversal_date: "2024-03-31",
        return_period: "Mar-2024",
        status: "calculated",
        remarks: "10% of total supplies are exempt",
        created_by: "User 1",
        created_date: "2024-03-25"
      }
    ];

    setItcRecords(mockITCRecords);
    setGstr2bRecords(mockGSTR2BRecords);
    setItcReversals(mockITCReversals);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total_itc_eligible: 2500000,
      total_itc_claimed: 2200000,
      total_itc_reversed: 45000,
      pending_claims: 15,
      gstr2b_unmatched: 8,
      this_month: 380000
    });
  };

  const handleCreateITC = () => {
    setEditingITC(null);
    setShowITCForm(true);
  };

  const handleEditITC = (record: ITCRecord) => {
    setEditingITC(record);
    setShowITCForm(true);
  };

  const handleDeleteITC = (recordId: string) => {
    setItcRecords(prev => prev.filter(record => record.id !== recordId));
    toast({
      title: "✅ Success",
      description: "ITC record deleted successfully.",
    });
  };

  const handleClaimITC = (recordId: string) => {
    setItcRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            itc_status: "claimed" as const,
            itc_claimed_amount: record.itc_eligible_amount
          }
        : record
    ));
    toast({
      title: "💰 ITC Claimed",
      description: "Input Tax Credit claimed successfully.",
    });
  };

  const handleReverseITC = (recordId: string, amount: number, reason: string) => {
    setItcRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            itc_status: "reversed" as const,
            itc_reversed_amount: amount,
            reversal_reason: reason
          }
        : record
    ));
    toast({
      title: "🔄 ITC Reversed",
      description: "Input Tax Credit reversed successfully.",
    });
  };

  const handleGSTR2BReconciliation = async () => {
    setReconciling(true);
    
    // Simulate reconciliation process
    setTimeout(() => {
      // Auto-match records with same GSTIN and invoice number
      const updatedGSTR2B = gstr2bRecords.map(gstr2bRecord => {
        const matchingITC = itcRecords.find(itc => 
          itc.vendor_gstin === gstr2bRecord.supplier_gstin && 
          itc.invoice_number === gstr2bRecord.invoice_number
        );
        
        if (matchingITC && !gstr2bRecord.matched_with_books) {
          return {
            ...gstr2bRecord,
            matched_with_books: true,
            matched_invoice_id: matchingITC.id,
            action_required: false
          };
        }
        
        return gstr2bRecord;
      });
      
      setGstr2bRecords(updatedGSTR2B);
      setReconciling(false);
      
      toast({
        title: "🔄 Reconciliation Complete",
        description: "GSTR-2B reconciliation completed successfully.",
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'bg-blue-100 text-blue-800';
      case 'claimed': return 'bg-green-100 text-green-800';
      case 'reversed': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      case 'lapsed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchStatusColor = (matched: boolean) => {
    return matched ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredITCRecords = itcRecords.filter(record => {
    const matchesSearch = 
      record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor_gstin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.itc_status === statusFilter;
    const matchesPeriod = periodFilter === "all" || record.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>ITC Management - JusFinn AI</title>
        <meta name="description" content="Manage Input Tax Credit with GSTR-2B reconciliation, ITC claims, reversals, and GST compliance tracking." />
        <meta name="keywords" content="ITC management, input tax credit, GSTR-2B reconciliation, GST compliance, ITC claims, ITC reversal" />
        <meta property="og:title" content="ITC Management - JusFinn AI" />
        <meta property="og:description" content="Complete ITC management solution with automated reconciliation and compliance tracking." />
        <link rel="canonical" href="https://your-domain.com/itc-management" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ITC Management</h1>
          <p className="text-gray-600 mt-2">
            Track Input Tax Credit with GSTR-2B reconciliation and compliance management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleGSTR2BReconciliation}
            disabled={reconciling}
            variant="outline"
          >
            {reconciling ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Reconcile GSTR-2B
          </Button>
          <Button 
            onClick={handleCreateITC}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add ITC Record
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Eligible</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_itc_eligible/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total eligible amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Claimed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_itc_claimed/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total claimed amount
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Reversed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_itc_reversed/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Total reversed amount
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_claims}</div>
            <p className="text-xs text-muted-foreground">
              Eligible records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unmatched</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gstr2b_unmatched}</div>
            <p className="text-xs text-muted-foreground">
              GSTR-2B records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.this_month/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              New ITC eligible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="itc">ITC Records</TabsTrigger>
          <TabsTrigger value="gstr2b">GSTR-2B</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="reversals">Reversals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="itc" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by invoice number, vendor name, or GSTIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="eligible">Eligible</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                      <SelectItem value="reversed">Reversed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="lapsed">Lapsed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      {periods.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ITC Records List */}
          <Card>
            <CardHeader>
              <CardTitle>ITC Records</CardTitle>
              <CardDescription>
                Track all Input Tax Credit records and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>GST Amount</TableHead>
                      <TableHead>ITC Status</TableHead>
                      <TableHead>GSTR-2B</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredITCRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.invoice_number}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(record.invoice_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₹{record.invoice_value.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.vendor_name}</div>
                            <div className="text-sm text-gray-500">{record.vendor_gstin}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{record.total_gst.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              {record.cgst_amount > 0 && `CGST: ₹${record.cgst_amount.toLocaleString()}`}
                              {record.sgst_amount > 0 && ` SGST: ₹${record.sgst_amount.toLocaleString()}`}
                              {record.igst_amount > 0 && `IGST: ₹${record.igst_amount.toLocaleString()}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={getStatusColor(record.itc_status)}>
                              {record.itc_status.toUpperCase()}
                            </Badge>
                            <div className="text-sm">
                              <div>Eligible: ₹{record.itc_eligible_amount.toLocaleString()}</div>
                              <div>Claimed: ₹{record.itc_claimed_amount.toLocaleString()}</div>
                              {record.itc_reversed_amount > 0 && (
                                <div className="text-red-600">Reversed: ₹{record.itc_reversed_amount.toLocaleString()}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMatchStatusColor(record.gstr2b_matched)}>
                            {record.gstr2b_matched ? 'Matched' : 'Unmatched'}
                          </Badge>
                          {record.gstr2b_month && (
                            <div className="text-sm text-gray-500 mt-1">
                              {record.gstr2b_month}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditITC(record)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {record.itc_status === 'eligible' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClaimITC(record.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteITC(record.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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

        <TabsContent value="gstr2b" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                GSTR-2B Records
              </CardTitle>
              <CardDescription>
                Import and reconcile GSTR-2B data with purchase records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Reconciliation Status</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Import GSTR-2B */}}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Import GSTR-2B
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleGSTR2BReconciliation}
                      disabled={reconciling}
                    >
                      {reconciling ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Target className="w-4 h-4 mr-1" />
                      )}
                      Auto Reconcile
                    </Button>
                  </div>
                </div>
                
                {reconciling && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Reconciling records...</span>
                    </div>
                    <Progress value={66} className="w-full" />
                  </div>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>ITC Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gstr2bRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.supplier_name}</div>
                              <div className="text-sm text-gray-500">{record.supplier_gstin}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.invoice_number}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(record.invoice_date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{record.invoice_value.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>CGST: ₹{record.itc_cgst.toLocaleString()}</div>
                              <div>SGST: ₹{record.itc_sgst.toLocaleString()}</div>
                              <div>IGST: ₹{record.itc_igst.toLocaleString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className={getMatchStatusColor(record.matched_with_books)}>
                                {record.matched_with_books ? 'Matched' : 'Unmatched'}
                              </Badge>
                              {record.action_required && (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            {record.discrepancy_reason && (
                              <div className="text-sm text-red-600 mt-1">
                                {record.discrepancy_reason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {!record.matched_with_books && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Match
                                </Button>
                              )}
                            </div>
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

        <TabsContent value="reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Reconciliation Dashboard
              </CardTitle>
              <CardDescription>
                Track reconciliation status between books and GSTR-2B
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {gstr2bRecords.filter(r => r.matched_with_books).length}
                    </div>
                    <p className="text-sm text-gray-600">Matched Records</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {gstr2bRecords.filter(r => !r.matched_with_books).length}
                    </div>
                    <p className="text-sm text-gray-600">Unmatched Records</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {gstr2bRecords.filter(r => r.action_required).length}
                    </div>
                    <p className="text-sm text-gray-600">Action Required</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Advanced reconciliation tools coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Auto-matching, discrepancy analysis, and bulk reconciliation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reversals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                ITC Reversals
              </CardTitle>
              <CardDescription>
                Manage ITC reversals as per GST rules and regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itcReversals.map((reversal) => (
                  <div key={reversal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{reversal.reversal_type.toUpperCase()}</h3>
                        <p className="text-sm text-gray-600">{reversal.reversal_reason}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <p><strong>Original ITC:</strong> ₹{reversal.original_itc_amount.toLocaleString()}</p>
                            <p><strong>Reversal Amount:</strong> ₹{reversal.reversal_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p><strong>Date:</strong> {new Date(reversal.reversal_date).toLocaleDateString()}</p>
                            <p><strong>Period:</strong> {reversal.return_period}</p>
                          </div>
                        </div>
                        {reversal.remarks && (
                          <p className="text-sm text-gray-500 mt-2">{reversal.remarks}</p>
                        )}
                      </div>
                      <Badge className={reversal.status === 'reversed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {reversal.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">ITC reversal calculator coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Automated reversal calculations based on GST rules
                  </p>
                </div>
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
                  ITC Trends
                </CardTitle>
                <CardDescription>
                  Track ITC claim patterns and reconciliation efficiency
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
                  <PieChart className="w-5 h-5" />
                  Vendor-wise Analysis
                </CardTitle>
                <CardDescription>
                  Analyze ITC by vendors and purchase categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Vendor analysis coming soon</p>
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
                ITC Reports
              </CardTitle>
              <CardDescription>
                Generate comprehensive ITC reports for compliance and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Receipt className="w-8 h-8 mb-2" />
                  <span>ITC Register</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Target className="w-8 h-8 mb-2" />
                  <span>Reconciliation Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <XCircle className="w-8 h-8 mb-2" />
                  <span>Reversal Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-8 h-8 mb-2" />
                  <span>GSTR-2B Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ITC Form Dialog - Placeholder */}
      <Dialog open={showITCForm} onOpenChange={setShowITCForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingITC ? 'Edit ITC Record' : 'Add New ITC Record'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">ITC record form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include invoice details, GST breakdown, eligibility assessment
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowITCForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingITC ? 'Update Record' : 'Create Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ITCManagement; 