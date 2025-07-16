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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Upload,
  Scan,
  Receipt,
  Building2,
  Calendar,
  IndianRupee,
  Search,
  Filter,
  Download,
  RefreshCw,
  XCircle,
  ShoppingCart,
  Package,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseBillItem {
  id: string;
  grn_item_id?: string;
  po_item_id?: string;
  item_description: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  rate: number;
  discount_percent: number;
  taxable_amount: number;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  itc_eligible: boolean;
  itc_claimed: boolean;
}

interface PurchaseBill {
  id: string;
  bill_number: string;
  vendor_bill_number: string;
  vendor_id: string;
  vendor_name: string;
  vendor_gstin?: string;
  vendor_pan: string;
  bill_date: string;
  due_date: string;
  po_number?: string;
  po_id?: string;
  grn_number?: string;
  grn_id?: string;
  bill_type: 'goods' | 'services' | 'mixed';
  place_of_supply: string;
  reverse_charge: boolean;
  status: 'draft' | 'pending_verification' | 'verified' | 'approved' | 'paid' | 'rejected';
  matching_status: 'unmatched' | 'partial_match' | 'fully_matched' | 'discrepancy';
  items: PurchaseBillItem[];
  subtotal: number;
  total_discount: number;
  total_cgst: number;
  total_sgst: number;
  total_igst: number;
  total_amount: number;
  total_itc_eligible: number;
  total_itc_claimed: number;
  tds_section?: string;
  tds_rate: number;
  tds_amount: number;
  net_payable: number;
  ocr_processed: boolean;
  ocr_confidence: number;
  ocr_data?: any;
  invoice_file_url?: string;
  payment_terms: string;
  remarks?: string;
  created_by: string;
  created_date: string;
  last_modified: string;
  verified_by?: string;
  verified_date?: string;
  approved_by?: string;
  approved_date?: string;
}

const PurchaseBills = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bills");
  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState<PurchaseBill | null>(null);
  const [bills, setBills] = useState<PurchaseBill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending_verification: 0,
    approved: 0,
    this_month: 0,
    total_amount: 0,
    itc_claimed: 0
  });

  // Indian states for place of supply
  const indianStates = [
    { code: "01", name: "Jammu and Kashmir" },
    { code: "02", name: "Himachal Pradesh" },
    { code: "03", name: "Punjab" },
    { code: "04", name: "Chandigarh" },
    { code: "05", name: "Uttarakhand" },
    { code: "06", name: "Haryana" },
    { code: "07", name: "Delhi" },
    { code: "08", name: "Rajasthan" },
    { code: "09", name: "Uttar Pradesh" },
    { code: "10", name: "Bihar" },
    { code: "11", name: "Sikkim" },
    { code: "12", name: "Arunachal Pradesh" },
    { code: "13", name: "Nagaland" },
    { code: "14", name: "Manipur" },
    { code: "15", name: "Mizoram" },
    { code: "16", name: "Tripura" },
    { code: "17", name: "Meghalaya" },
    { code: "18", name: "Assam" },
    { code: "19", name: "West Bengal" },
    { code: "20", name: "Jharkhand" },
    { code: "21", name: "Odisha" },
    { code: "22", name: "Chhattisgarh" },
    { code: "23", name: "Madhya Pradesh" },
    { code: "24", name: "Gujarat" },
    { code: "25", name: "Daman and Diu" },
    { code: "26", name: "Dadra and Nagar Haveli" },
    { code: "27", name: "Maharashtra" },
    { code: "28", name: "Andhra Pradesh" },
    { code: "29", name: "Karnataka" },
    { code: "30", name: "Goa" },
    { code: "31", name: "Lakshadweep" },
    { code: "32", name: "Kerala" },
    { code: "33", name: "Tamil Nadu" },
    { code: "34", name: "Puducherry" },
    { code: "35", name: "Andaman and Nicobar Islands" },
    { code: "36", name: "Telangana" },
    { code: "37", name: "Ladakh" }
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadBills();
    loadStats();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    // Mock data
    const mockBills: PurchaseBill[] = [
      {
        id: "1",
        bill_number: "BILL/2024/001",
        vendor_bill_number: "ABC-INV-001",
        vendor_id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_gstin: "06ABCPD1234E1Z5",
        vendor_pan: "ABCPD1234E",
        bill_date: "2024-03-01",
        due_date: "2024-03-31",
        po_number: "PO/2024/001",
        po_id: "1",
        grn_number: "GRN/2024/001",
        grn_id: "1",
        bill_type: "goods",
        place_of_supply: "06",
        reverse_charge: false,
        status: "approved",
        matching_status: "fully_matched",
        items: [
          {
            id: "1",
            grn_item_id: "1",
            po_item_id: "1",
            item_description: "Office Stationery Bundle",
            hsn_code: "4817",
            quantity: 10,
            unit: "Set",
            rate: 500,
            discount_percent: 10,
            taxable_amount: 4500,
            cgst_rate: 9,
            sgst_rate: 9,
            igst_rate: 0,
            cgst_amount: 405,
            sgst_amount: 405,
            igst_amount: 0,
            total_amount: 5310,
            itc_eligible: true,
            itc_claimed: true
          }
        ],
        subtotal: 4500,
        total_discount: 500,
        total_cgst: 405,
        total_sgst: 405,
        total_igst: 0,
        total_amount: 5310,
        total_itc_eligible: 810,
        total_itc_claimed: 810,
        tds_section: "194C",
        tds_rate: 1,
        tds_amount: 45,
        net_payable: 5265,
        ocr_processed: true,
        ocr_confidence: 95,
        invoice_file_url: "/invoices/bill-001.pdf",
        payment_terms: "30 days",
        created_by: "User 1",
        created_date: "2024-03-01",
        last_modified: "2024-03-02",
        verified_by: "Accountant",
        verified_date: "2024-03-01",
        approved_by: "Manager",
        approved_date: "2024-03-02"
      },
      {
        id: "2",
        bill_number: "BILL/2024/002",
        vendor_bill_number: "XYZ-SRV-002",
        vendor_id: "2",
        vendor_name: "XYZ Consultants",
        vendor_gstin: "07XYZPD5678F1Z8",
        vendor_pan: "XYZPD5678F",
        bill_date: "2024-03-05",
        due_date: "2024-03-20",
        bill_type: "services",
        place_of_supply: "07",
        reverse_charge: false,
        status: "pending_verification",
        matching_status: "unmatched",
        items: [
          {
            id: "1",
            item_description: "Consulting Services",
            hsn_code: "9954",
            quantity: 1,
            unit: "Service",
            rate: 50000,
            discount_percent: 0,
            taxable_amount: 50000,
            cgst_rate: 9,
            sgst_rate: 9,
            igst_rate: 0,
            cgst_amount: 4500,
            sgst_amount: 4500,
            igst_amount: 0,
            total_amount: 59000,
            itc_eligible: true,
            itc_claimed: false
          }
        ],
        subtotal: 50000,
        total_discount: 0,
        total_cgst: 4500,
        total_sgst: 4500,
        total_igst: 0,
        total_amount: 59000,
        total_itc_eligible: 9000,
        total_itc_claimed: 0,
        tds_section: "194J",
        tds_rate: 10,
        tds_amount: 5000,
        net_payable: 54000,
        ocr_processed: true,
        ocr_confidence: 88,
        invoice_file_url: "/invoices/bill-002.pdf",
        payment_terms: "15 days",
        created_by: "User 2",
        created_date: "2024-03-05",
        last_modified: "2024-03-05"
      }
    ];
    setBills(mockBills);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total: 67,
      pending_verification: 15,
      approved: 45,
      this_month: 23,
      total_amount: 1250000,
      itc_claimed: 180000
    });
  };

  const handleCreateBill = () => {
    setEditingBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (bill: PurchaseBill) => {
    setEditingBill(bill);
    setShowBillForm(true);
  };

  const handleDeleteBill = (billId: string) => {
    setBills(prev => prev.filter(bill => bill.id !== billId));
    toast({
      title: "✅ Success",
      description: "Purchase bill deleted successfully.",
    });
  };

  const handleVerifyBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { 
            ...bill, 
            status: "verified" as const, 
            verified_by: "Current User", 
            verified_date: new Date().toISOString().split('T')[0] 
          }
        : bill
    ));
    toast({
      title: "✅ Success",
      description: "Bill verified successfully.",
    });
  };

  const handleApproveBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { 
            ...bill, 
            status: "approved" as const, 
            approved_by: "Current User", 
            approved_date: new Date().toISOString().split('T')[0] 
          }
        : bill
    ));
    toast({
      title: "✅ Success",
      description: "Bill approved successfully.",
    });
  };

  const handleRejectBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status: "rejected" as const }
        : bill
    ));
    toast({
      title: "❌ Rejected",
      description: "Bill rejected.",
    });
  };

  const handleOCRProcess = async (billId: string) => {
    setOcrProcessing(billId);
    
    // Simulate OCR processing
    setTimeout(() => {
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              ocr_processed: true, 
              ocr_confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
            }
          : bill
      ));
      setOcrProcessing(null);
      toast({
        title: "🔍 OCR Complete",
        description: "Invoice data extracted successfully.",
      });
    }, 3000);
  };

  const handleClaimITC = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { 
            ...bill, 
            items: bill.items.map(item => ({ ...item, itc_claimed: true })),
            total_itc_claimed: bill.total_itc_eligible
          }
        : bill
    ));
    toast({
      title: "✅ ITC Claimed",
      description: "Input Tax Credit claimed successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchingStatusColor = (status: string) => {
    switch (status) {
      case 'unmatched': return 'bg-red-100 text-red-800';
      case 'partial_match': return 'bg-yellow-100 text-yellow-800';
      case 'fully_matched': return 'bg-green-100 text-green-800';
      case 'discrepancy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor_bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Purchase Bills - JusFinn AI</title>
        <meta name="description" content="Manage purchase bills with OCR processing, GST validation, ITC tracking, and three-way matching." />
        <meta name="keywords" content="purchase bills, invoice processing, OCR, GST validation, ITC tracking, three-way matching, accounts payable" />
        <meta property="og:title" content="Purchase Bills - JusFinn AI" />
        <meta property="og:description" content="Advanced purchase bill management with AI-powered OCR and compliance features." />
        <link rel="canonical" href="https://your-domain.com/purchase-bills" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Bills</h1>
          <p className="text-gray-600 mt-2">
            Process invoices with OCR, validate GST, and track ITC with three-way matching
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateBill}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All purchase bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_verification}</div>
            <p className="text-xs text-muted-foreground">
              Need verification
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Ready for payment
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.this_month}</div>
            <p className="text-xs text-muted-foreground">
              New bills added
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_amount/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total bill value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Claimed</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.itc_claimed/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Input tax credit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bills">All Bills</TabsTrigger>
          <TabsTrigger value="ocr">OCR Processing</TabsTrigger>
          <TabsTrigger value="matching">Three-Way Matching</TabsTrigger>
          <TabsTrigger value="itc">ITC Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bills" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by bill number, vendor bill number, or vendor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_verification">Pending Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills List */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Bills</CardTitle>
              <CardDescription>
                Manage all purchase bills with OCR processing and compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{bill.bill_number}</h3>
                            <Badge className={getStatusColor(bill.status)}>
                              {bill.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getMatchingStatusColor(bill.matching_status)}>
                              {bill.matching_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {bill.ocr_processed && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                🔍 OCR: {bill.ocr_confidence}%
                              </Badge>
                            )}
                            {bill.total_itc_claimed > 0 && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                💰 ITC Claimed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{bill.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Vendor Bill: {bill.vendor_bill_number}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Date: {new Date(bill.bill_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                <span>Amount: ₹{bill.total_amount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4" />
                                <span>ITC: ₹{bill.total_itc_eligible.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                <span>Net: ₹{bill.net_payable.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              {bill.po_number && (
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>PO: {bill.po_number}</span>
                                </div>
                              )}
                              {bill.grn_number && (
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4" />
                                  <span>GRN: {bill.grn_number}</span>
                                </div>
                              )}
                              <div className="text-sm">
                                <strong>Type:</strong> {bill.bill_type}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm">
                                <strong>Due:</strong> {new Date(bill.due_date).toLocaleDateString()}
                              </div>
                              {bill.tds_amount > 0 && (
                                <div className="text-sm">
                                  <strong>TDS:</strong> ₹{bill.tds_amount} ({bill.tds_section})
                                </div>
                              )}
                              <div className="text-sm">
                                <strong>Terms:</strong> {bill.payment_terms}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* View bill */}}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!bill.ocr_processed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOCRProcess(bill.id)}
                              disabled={ocrProcessing === bill.id}
                            >
                              {ocrProcessing === bill.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Scan className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          {bill.total_itc_eligible > 0 && !bill.total_itc_claimed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClaimITC(bill.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBill(bill)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {bill.status === 'pending_verification' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyBill(bill.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {bill.status === 'verified' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveBill(bill.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBill(bill.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                OCR Processing Dashboard
              </CardTitle>
              <CardDescription>
                AI-powered invoice data extraction and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.filter(bill => !bill.ocr_processed).map((bill) => (
                  <div key={bill.id} className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{bill.bill_number}</h3>
                        <p className="text-sm text-gray-600">{bill.vendor_name}</p>
                        <p className="text-sm">Vendor Bill: {bill.vendor_bill_number}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOCRProcess(bill.id)}
                          disabled={ocrProcessing === bill.id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {ocrProcessing === bill.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-1" />
                              Start OCR
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    {ocrProcessing === bill.id && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">Processing invoice...</span>
                        </div>
                        <Progress value={66} className="w-full" />
                      </div>
                    )}
                  </div>
                ))}
                {bills.filter(bill => !bill.ocr_processed).length === 0 && (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">All bills have been processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Three-Way Matching
              </CardTitle>
              <CardDescription>
                Match Purchase Orders, GRNs, and Purchase Bills for audit compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Three-way matching dashboard coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Automatic matching with discrepancy alerts and audit trails
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                ITC Tracking Dashboard
              </CardTitle>
              <CardDescription>
                Monitor Input Tax Credit eligibility and claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">₹{bills.reduce((sum, bill) => sum + bill.total_itc_eligible, 0).toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Total ITC Eligible</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">₹{bills.reduce((sum, bill) => sum + bill.total_itc_claimed, 0).toLocaleString()}</div>
                      <p className="text-sm text-gray-600">ITC Claimed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">₹{bills.reduce((sum, bill) => sum + (bill.total_itc_eligible - bill.total_itc_claimed), 0).toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Pending Claims</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  {bills.filter(bill => bill.total_itc_eligible > bill.total_itc_claimed).map((bill) => (
                    <div key={bill.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">{bill.bill_number}</span>
                        <span className="text-sm text-gray-500 ml-2">{bill.vendor_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">₹{(bill.total_itc_eligible - bill.total_itc_claimed).toLocaleString()}</span>
                        <Button
                          size="sm"
                          onClick={() => handleClaimITC(bill.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Claim ITC
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  <IndianRupee className="w-5 h-5" />
                  Financial Analytics
                </CardTitle>
                <CardDescription>
                  Monitor spending patterns and tax implications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Financial analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Purchase Bill Form Dialog - Placeholder */}
      <Dialog open={showBillForm} onOpenChange={setShowBillForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBill ? 'Edit Purchase Bill' : 'Create New Purchase Bill'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Purchase bill form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include OCR upload, vendor selection, GST validation, ITC calculation
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowBillForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingBill ? 'Update Bill' : 'Create Bill'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseBills; 