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
import { 
  HandCoins, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  FileText,
  Calendar,
  IndianRupee,
  Building2,
  User,
  Search,
  Filter,
  Upload,
  RefreshCw,
  Calculator,
  Receipt,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TDSEntry {
  id: string;
  deductee_id: string;
  deductee_name: string;
  deductee_pan: string;
  deductee_type: 'individual' | 'company' | 'firm' | 'huf' | 'aop' | 'local_authority' | 'government';
  section: string;
  payment_date: string;
  payment_amount: number;
  tds_rate: number;
  tds_amount: number;
  challan_number?: string;
  challan_date?: string;
  bank_name?: string;
  bsr_code?: string;
  nature_of_payment: string;
  certificate_issued: boolean;
  certificate_date?: string;
  quarter: string;
  financial_year: string;
  status: 'calculated' | 'deducted' | 'deposited' | 'filed' | 'certificate_issued';
  remarks?: string;
  created_by: string;
  created_date: string;
  last_modified: string;
}

interface TDSReturn {
  id: string;
  return_type: '24Q' | '26Q' | '27Q' | '27EQ';
  quarter: string;
  financial_year: string;
  filing_date: string;
  due_date: string;
  acknowledgment_number?: string;
  token_number?: string;
  total_deductees: number;
  total_amount_paid: number;
  total_tds_deducted: number;
  total_tds_deposited: number;
  status: 'draft' | 'ready' | 'filed' | 'processed' | 'corrected';
  file_path?: string;
  remarks?: string;
  created_by: string;
  created_date: string;
  last_modified: string;
}

interface TDSChallan {
  id: string;
  challan_number: string;
  deposit_date: string;
  bank_name: string;
  bsr_code: string;
  amount_deposited: number;
  interest_paid: number;
  penalty_paid: number;
  total_amount: number;
  assessment_year: string;
  challan_type: 'current' | 'arrears' | 'advance';
  status: 'pending' | 'deposited' | 'verified';
  receipt_url?: string;
  remarks?: string;
  created_by: string;
  created_date: string;
}

const TDSCompliance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entries");
  const [showTDSForm, setShowTDSForm] = useState(false);
  const [editingTDS, setEditingTDS] = useState<TDSEntry | null>(null);
  const [tdsEntries, setTdsEntries] = useState<TDSEntry[]>([]);
  const [tdsReturns, setTdsReturns] = useState<TDSReturn[]>([]);
  const [tdsChallans, setTdsChallans] = useState<TDSChallan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [quarterFilter, setQuarterFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_entries: 0,
    pending_deposit: 0,
    certificates_pending: 0,
    this_quarter: 0,
    total_deducted: 0,
    total_deposited: 0
  });

  // TDS Sections with rates and nature of payment
  const tdsSections = [
    { section: "194A", rate: 10, nature: "Interest other than on Securities", threshold: 5000 },
    { section: "194B", rate: 30, nature: "Winnings from Lottery/Crossword Puzzle", threshold: 10000 },
    { section: "194C", rate: 1, nature: "Payments to Contractors", threshold: 30000 },
    { section: "194D", rate: 5, nature: "Insurance Commission", threshold: 15000 },
    { section: "194E", rate: 20, nature: "Payments to Non-Resident Sportsmen", threshold: 0 },
    { section: "194F", rate: 20, nature: "Payments on account of repurchase", threshold: 0 },
    { section: "194G", rate: 5, nature: "Commission, Brokerage etc.", threshold: 15000 },
    { section: "194H", rate: 5, nature: "Commission or Brokerage", threshold: 15000 },
    { section: "194I", rate: 10, nature: "Rent", threshold: 180000 },
    { section: "194J", rate: 10, nature: "Professional/Technical Services", threshold: 30000 },
    { section: "194K", rate: 10, nature: "Income from Units", threshold: 5000 },
    { section: "194LA", rate: 10, nature: "Compensation for Compulsory Land Acquisition", threshold: 250000 },
    { section: "194M", rate: 5, nature: "Payments to Contractors/Sub-contractors", threshold: 5000000 },
    { section: "194N", rate: 2, nature: "Cash Withdrawal", threshold: 100000000 },
    { section: "194O", rate: 1, nature: "E-commerce Transactions", threshold: 500000 },
    { section: "194Q", rate: 0.1, nature: "Purchase of Goods", threshold: 5000000 },
    { section: "194S", rate: 1, nature: "Crypto Currency", threshold: 10000 }
  ];

  // Financial quarters
  const quarters = [
    { value: "Q1", label: "Q1 (Apr-Jun)", months: "April to June" },
    { value: "Q2", label: "Q2 (Jul-Sep)", months: "July to September" },
    { value: "Q3", label: "Q3 (Oct-Dec)", months: "October to December" },
    { value: "Q4", label: "Q4 (Jan-Mar)", months: "January to March" }
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadTDSData();
    loadStats();
  }, []);

  const loadTDSData = async () => {
    setLoading(true);
    
    // Mock TDS Entries
    const mockEntries: TDSEntry[] = [
      {
        id: "1",
        deductee_id: "1",
        deductee_name: "ABC Suppliers Pvt Ltd",
        deductee_pan: "ABCPD1234E",
        deductee_type: "company",
        section: "194C",
        payment_date: "2024-02-15",
        payment_amount: 100000,
        tds_rate: 1,
        tds_amount: 1000,
        challan_number: "ITNS281-001",
        challan_date: "2024-02-28",
        bank_name: "State Bank of India",
        bsr_code: "0123456",
        nature_of_payment: "Payments to Contractors",
        certificate_issued: true,
        certificate_date: "2024-03-15",
        quarter: "Q4",
        financial_year: "2023-24",
        status: "certificate_issued",
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-03-15"
      },
      {
        id: "2",
        deductee_id: "2",
        deductee_name: "XYZ Consultants",
        deductee_pan: "XYZPD5678F",
        deductee_type: "company",
        section: "194J",
        payment_date: "2024-03-05",
        payment_amount: 50000,
        tds_rate: 10,
        tds_amount: 5000,
        nature_of_payment: "Professional/Technical Services",
        certificate_issued: false,
        quarter: "Q4",
        financial_year: "2023-24",
        status: "deducted",
        created_by: "User 2",
        created_date: "2024-03-05",
        last_modified: "2024-03-05"
      }
    ];

    // Mock TDS Returns
    const mockReturns: TDSReturn[] = [
      {
        id: "1",
        return_type: "24Q",
        quarter: "Q3",
        financial_year: "2023-24",
        filing_date: "2024-01-31",
        due_date: "2024-01-31",
        acknowledgment_number: "ACK12345678901234567890",
        token_number: "TOK987654321",
        total_deductees: 25,
        total_amount_paid: 2500000,
        total_tds_deducted: 45000,
        total_tds_deposited: 45000,
        status: "processed",
        file_path: "/returns/24Q-Q3-2023-24.xml",
        created_by: "User 1",
        created_date: "2024-01-25",
        last_modified: "2024-01-31"
      }
    ];

    // Mock TDS Challans
    const mockChallans: TDSChallan[] = [
      {
        id: "1",
        challan_number: "ITNS281-001",
        deposit_date: "2024-02-28",
        bank_name: "State Bank of India",
        bsr_code: "0123456",
        amount_deposited: 25000,
        interest_paid: 0,
        penalty_paid: 0,
        total_amount: 25000,
        assessment_year: "2024-25",
        challan_type: "current",
        status: "deposited",
        receipt_url: "/challans/challan-001.pdf",
        created_by: "User 1",
        created_date: "2024-02-28"
      }
    ];

    setTdsEntries(mockEntries);
    setTdsReturns(mockReturns);
    setTdsChallans(mockChallans);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total_entries: 156,
      pending_deposit: 12,
      certificates_pending: 8,
      this_quarter: 45,
      total_deducted: 285000,
      total_deposited: 270000
    });
  };

  const handleCreateTDS = () => {
    setEditingTDS(null);
    setShowTDSForm(true);
  };

  const handleEditTDS = (entry: TDSEntry) => {
    setEditingTDS(entry);
    setShowTDSForm(true);
  };

  const handleDeleteTDS = (entryId: string) => {
    setTdsEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast({
      title: "✅ Success",
      description: "TDS entry deleted successfully.",
    });
  };

  const handleGenerateCertificate = (entryId: string) => {
    setTdsEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { 
            ...entry, 
            certificate_issued: true, 
            certificate_date: new Date().toISOString().split('T')[0],
            status: "certificate_issued" as const
          }
        : entry
    ));
    toast({
      title: "📄 Certificate Generated",
      description: "TDS certificate generated successfully.",
    });
  };

  const handleCalculateTDS = (amount: number, section: string): number => {
    const tdsSection = tdsSections.find(s => s.section === section);
    if (!tdsSection) return 0;
    
    if (amount < tdsSection.threshold) return 0;
    
    return Math.round((amount * tdsSection.rate) / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calculated': return 'bg-gray-100 text-gray-800';
      case 'deducted': return 'bg-yellow-100 text-yellow-800';
      case 'deposited': return 'bg-blue-100 text-blue-800';
      case 'filed': return 'bg-green-100 text-green-800';
      case 'certificate_issued': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'filed': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'corrected': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEntries = tdsEntries.filter(entry => {
    const matchesSearch = 
      entry.deductee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.deductee_pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = sectionFilter === "all" || entry.section === sectionFilter;
    const matchesQuarter = quarterFilter === "all" || entry.quarter === quarterFilter;
    return matchesSearch && matchesSection && matchesQuarter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>TDS Compliance - JusFinn AI</title>
        <meta name="description" content="Comprehensive TDS compliance management with rate calculation, filing, and certificate generation." />
        <meta name="keywords" content="TDS compliance, tax deducted at source, TDS filing, TDS certificates, TDS challan, quarterly returns" />
        <meta property="og:title" content="TDS Compliance - JusFinn AI" />
        <meta property="og:description" content="Complete TDS management solution with automated calculations and compliance tracking." />
        <link rel="canonical" href="https://your-domain.com/tds-compliance" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TDS Compliance</h1>
          <p className="text-gray-600 mt-2">
            Manage TDS deductions, deposits, and filing with automated compliance tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateTDS}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add TDS Entry
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_entries}</div>
            <p className="text-xs text-muted-foreground">
              All TDS entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deposit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_deposit}</div>
            <p className="text-xs text-muted-foreground">
              Need to deposit
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificates_pending}</div>
            <p className="text-xs text-muted-foreground">
              Pending certificates
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.this_quarter}</div>
            <p className="text-xs text-muted-foreground">
              New deductions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deducted</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_deducted/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Total TDS deducted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deposited</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_deposited/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Total deposited
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="entries">TDS Entries</TabsTrigger>
          <TabsTrigger value="challans">Challans</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by deductee name, PAN, or section..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {tdsSections.map((section) => (
                        <SelectItem key={section.section} value={section.section}>
                          {section.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quarters</SelectItem>
                      {quarters.map((quarter) => (
                        <SelectItem key={quarter.value} value={quarter.value}>
                          {quarter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TDS Entries List */}
          <Card>
            <CardHeader>
              <CardTitle>TDS Entries</CardTitle>
              <CardDescription>
                Track all TDS deductions with compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deductee</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>TDS</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.deductee_name}</div>
                            <div className="text-sm text-gray-500">{entry.deductee_pan}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.section}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(entry.payment_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>₹{entry.payment_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{entry.tds_amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{entry.tds_rate}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTDS(entry)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {!entry.certificate_issued && entry.status === 'deposited' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateCertificate(entry.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTDS(entry.id)}
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

        <TabsContent value="challans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                TDS Challans
              </CardTitle>
              <CardDescription>
                Track TDS deposits and challan receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tdsChallans.map((challan) => (
                  <div key={challan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{challan.challan_number}</h3>
                          <Badge className={challan.status === 'deposited' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {challan.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Bank:</strong> {challan.bank_name}</p>
                            <p><strong>BSR Code:</strong> {challan.bsr_code}</p>
                            <p><strong>Date:</strong> {new Date(challan.deposit_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p><strong>Amount:</strong> ₹{challan.amount_deposited.toLocaleString()}</p>
                            <p><strong>Interest:</strong> ₹{challan.interest_paid.toLocaleString()}</p>
                            <p><strong>Penalty:</strong> ₹{challan.penalty_paid.toLocaleString()}</p>
                          </div>
                          <div>
                            <p><strong>Total:</strong> ₹{challan.total_amount.toLocaleString()}</p>
                            <p><strong>AY:</strong> {challan.assessment_year}</p>
                            <p><strong>Type:</strong> {challan.challan_type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                TDS Returns
              </CardTitle>
              <CardDescription>
                Quarterly TDS return filing and tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tdsReturns.map((tdsReturn) => (
                  <div key={tdsReturn.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{tdsReturn.return_type} - {tdsReturn.quarter} {tdsReturn.financial_year}</h3>
                          <Badge className={getReturnStatusColor(tdsReturn.status)}>
                            {tdsReturn.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Filing Date:</strong> {new Date(tdsReturn.filing_date).toLocaleDateString()}</p>
                            <p><strong>Due Date:</strong> {new Date(tdsReturn.due_date).toLocaleDateString()}</p>
                            <p><strong>Deductees:</strong> {tdsReturn.total_deductees}</p>
                          </div>
                          <div>
                            <p><strong>Amount Paid:</strong> ₹{tdsReturn.total_amount_paid.toLocaleString()}</p>
                            <p><strong>TDS Deducted:</strong> ₹{tdsReturn.total_tds_deducted.toLocaleString()}</p>
                            <p><strong>TDS Deposited:</strong> ₹{tdsReturn.total_tds_deposited.toLocaleString()}</p>
                          </div>
                          <div>
                            {tdsReturn.acknowledgment_number && (
                              <p><strong>ACK:</strong> {tdsReturn.acknowledgment_number}</p>
                            )}
                            {tdsReturn.token_number && (
                              <p><strong>Token:</strong> {tdsReturn.token_number}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                TDS Certificates
              </CardTitle>
              <CardDescription>
                Generate and manage TDS certificates (Form 16A)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tdsEntries.filter(entry => !entry.certificate_issued && entry.status === 'deposited').map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{entry.deductee_name}</h3>
                        <p className="text-sm text-gray-600">PAN: {entry.deductee_pan}</p>
                        <p className="text-sm">Section {entry.section} - ₹{entry.tds_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Payment Date: {new Date(entry.payment_date).toLocaleDateString()}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateCertificate(entry.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Generate Certificate
                      </Button>
                    </div>
                  </div>
                ))}
                {tdsEntries.filter(entry => !entry.certificate_issued && entry.status === 'deposited').length === 0 && (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No certificates pending generation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                TDS Calculator
              </CardTitle>
              <CardDescription>
                Calculate TDS based on payment amount and section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calc_amount">Payment Amount (₹)</Label>
                    <Input
                      id="calc_amount"
                      type="number"
                      placeholder="Enter payment amount"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="calc_section">TDS Section</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select TDS Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {tdsSections.map((section) => (
                          <SelectItem key={section.section} value={section.section}>
                            {section.section} - {section.nature} ({section.rate}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate TDS
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">TDS Calculation Result</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS Rate:</span>
                      <span>0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threshold:</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>TDS Amount:</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Payable:</span>
                      <span>₹0</span>
                    </div>
                  </div>
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
                  TDS Trends
                </CardTitle>
                <CardDescription>
                  Track TDS deduction patterns and compliance metrics
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
                  <HandCoins className="w-5 h-5" />
                  Section-wise Analysis
                </CardTitle>
                <CardDescription>
                  Analyze TDS deductions by sections and vendors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HandCoins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Section analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* TDS Form Dialog - Placeholder */}
      <Dialog open={showTDSForm} onOpenChange={setShowTDSForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTDS ? 'Edit TDS Entry' : 'Add New TDS Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <HandCoins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">TDS entry form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include vendor selection, section assignment, automatic rate calculation
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowTDSForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingTDS ? 'Update Entry' : 'Create Entry'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TDSCompliance; 