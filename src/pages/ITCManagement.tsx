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
  PieChart,
  Calculator,
  GitCompare,
  ShieldCheck,
  AlertCircle,
  Zap,
  TrendingDown
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

interface ITCUtilization {
  id: string;
  utilization_type: 'output_liability' | 'interest' | 'penalty' | 'fee';
  utilized_amount: number;
  return_period: string;
  utilization_date: string;
  reference_number: string;
  balance_after_utilization: number;
  created_date: string;
}

interface FormData {
  invoice_number: string;
  vendor_name: string;
  vendor_gstin: string;
  invoice_date: string;
  invoice_value: string;
  cgst_amount: string;
  sgst_amount: string;
  igst_amount: string;
  purchase_type: string;
  hsn_code: string;
  place_of_supply: string;
  claim_reason: string;
  reverse_charge: boolean;
  period: string;
}

const ITCManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("itc");
  const [showITCForm, setShowITCForm] = useState(false);
  const [showReversalForm, setShowReversalForm] = useState(false);
  const [editingITC, setEditingITC] = useState<ITCRecord | null>(null);
  const [itcRecords, setItcRecords] = useState<ITCRecord[]>([]);
  const [gstr2bRecords, setGstr2bRecords] = useState<GSTR2BRecord[]>([]);
  const [itcReversals, setItcReversals] = useState<ITCReversal[]>([]);
  const [itcUtilizations, setItcUtilizations] = useState<ITCUtilization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    invoice_number: '',
    vendor_name: '',
    vendor_gstin: '',
    invoice_date: '',
    invoice_value: '',
    cgst_amount: '',
    sgst_amount: '',
    igst_amount: '',
    purchase_type: '',
    hsn_code: '',
    place_of_supply: '',
    claim_reason: '',
    reverse_charge: false,
    period: ''
  });
  const [stats, setStats] = useState({
    total_itc_eligible: 0,
    total_itc_claimed: 0,
    total_itc_reversed: 0,
    pending_claims: 0,
    gstr2b_unmatched: 0,
    this_month: 0,
    available_balance: 0,
    utilization_this_month: 0
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
  const financialPeriods = [
    "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024",
    "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
  ];

  // Purchase types
  const purchaseTypes = [
    { value: "goods", label: "Goods" },
    { value: "services", label: "Services" },
    { value: "capital_goods", label: "Capital Goods" },
    { value: "input_services", label: "Input Services" }
  ];

  // Mock data generation
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Mock ITC Records
    const mockITCRecords: ITCRecord[] = [
      {
        id: "ITC001",
        invoice_number: "TCS/24-25/001",
        vendor_name: "TCS Limited",
        vendor_gstin: "27AAACT2727Q1ZZ",
        invoice_date: "2024-10-15",
        invoice_value: 590000,
        cgst_amount: 53100,
        sgst_amount: 53100,
        igst_amount: 0,
        total_gst: 106200,
        itc_eligible_amount: 106200,
        itc_claimed_amount: 106200,
        itc_reversed_amount: 0,
        itc_status: "claimed",
        claim_reason: "input_services",
        period: "Oct 2024",
        financial_year: "2024-25",
        gstr2b_matched: true,
        gstr2b_month: "Oct 2024",
        purchase_type: "input_services",
        hsn_code: "998313",
        place_of_supply: "Maharashtra",
        reverse_charge: false,
        created_by: "Rajesh Kumar",
        created_date: "2024-10-15",
        last_modified: "2024-10-20"
      },
      {
        id: "ITC002",
        invoice_number: "AMZN/2024/1234",
        vendor_name: "Amazon Web Services",
        vendor_gstin: "29AALCA0442L1ZS",
        invoice_date: "2024-10-10",
        invoice_value: 125000,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 22500,
        total_gst: 22500,
        itc_eligible_amount: 22500,
        itc_claimed_amount: 22500,
        itc_reversed_amount: 0,
        itc_status: "claimed",
        claim_reason: "input_services",
        period: "Oct 2024",
        financial_year: "2024-25",
        gstr2b_matched: true,
        gstr2b_month: "Oct 2024",
        purchase_type: "input_services",
        hsn_code: "998313",
        place_of_supply: "Karnataka",
        reverse_charge: false,
        created_by: "Priya Sharma",
        created_date: "2024-10-10",
        last_modified: "2024-10-25"
      },
      {
        id: "ITC003",
        invoice_number: "DELL/2024/5678",
        vendor_name: "Dell Technologies",
        vendor_gstin: "06AABCD1234E1Z5",
        invoice_date: "2024-09-25",
        invoice_value: 850000,
        cgst_amount: 76500,
        sgst_amount: 76500,
        igst_amount: 0,
        total_gst: 153000,
        itc_eligible_amount: 153000,
        itc_claimed_amount: 153000,
        itc_reversed_amount: 30600,
        itc_status: "reversed",
        claim_reason: "capital_goods",
        reversal_reason: "Used for exempt supplies (20%)",
        period: "Sep 2024",
        financial_year: "2024-25",
        gstr2b_matched: true,
        gstr2b_month: "Sep 2024",
        purchase_type: "capital_goods",
        hsn_code: "847130",
        place_of_supply: "Haryana",
        reverse_charge: false,
        created_by: "Amit Singh",
        created_date: "2024-09-25",
        last_modified: "2024-10-30"
      },
      {
        id: "ITC004",
        invoice_number: "MSFT/2024/9101",
        vendor_name: "Microsoft Corporation",
        vendor_gstin: "29AALCM0442L1ZT",
        invoice_date: "2024-10-20",
        invoice_value: 450000,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 81000,
        total_gst: 81000,
        itc_eligible_amount: 81000,
        itc_claimed_amount: 0,
        itc_reversed_amount: 0,
        itc_status: "eligible",
        claim_reason: "input_services",
        period: "Oct 2024",
        financial_year: "2024-25",
        gstr2b_matched: false,
        purchase_type: "input_services",
        hsn_code: "998313",
        place_of_supply: "Karnataka",
        reverse_charge: false,
        created_by: "Neha Gupta",
        created_date: "2024-10-20",
        last_modified: "2024-10-28"
      },
      {
        id: "ITC005",
        invoice_number: "INFY/2024/2468",
        vendor_name: "Infosys Limited",
        vendor_gstin: "29AABCI1681G1Z0",
        invoice_date: "2024-10-05",
        invoice_value: 750000,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 135000,
        total_gst: 135000,
        itc_eligible_amount: 135000,
        itc_claimed_amount: 135000,
        itc_reversed_amount: 0,
        itc_status: "claimed",
        claim_reason: "input_services",
        period: "Oct 2024",
        financial_year: "2024-25",
        gstr2b_matched: true,
        gstr2b_month: "Oct 2024",
        purchase_type: "input_services",
        hsn_code: "998313",
        place_of_supply: "Karnataka",
        reverse_charge: false,
        created_by: "Suresh Reddy",
        created_date: "2024-10-05",
        last_modified: "2024-10-22"
      }
    ];

    // Mock GSTR-2B Records
    const mockGSTR2BRecords: GSTR2BRecord[] = [
      {
        id: "GSTR2B001",
        supplier_gstin: "27AAACT2727Q1ZZ",
        supplier_name: "TCS Limited",
        invoice_number: "TCS/24-25/001",
        invoice_date: "2024-10-15",
        invoice_value: 590000,
        place_of_supply: "Maharashtra",
        reverse_charge: false,
        itc_igst: 0,
        itc_cgst: 53100,
        itc_sgst: 53100,
        itc_cess: 0,
        return_period: "Oct 2024",
        matched_with_books: true,
        matched_invoice_id: "ITC001",
        action_required: false,
        created_date: "2024-11-15"
      },
      {
        id: "GSTR2B002",
        supplier_gstin: "19AABCD5678E1F2",
        supplier_name: "Unmatched Supplier Pvt Ltd",
        invoice_number: "UNM/2024/1111",
        invoice_date: "2024-10-18",
        invoice_value: 235000,
        place_of_supply: "West Bengal",
        reverse_charge: false,
        itc_igst: 42300,
        itc_cgst: 0,
        itc_sgst: 0,
        itc_cess: 0,
        return_period: "Oct 2024",
        matched_with_books: false,
        discrepancy_amount: 42300,
        discrepancy_reason: "Invoice not found in purchase records",
        action_required: true,
        created_date: "2024-11-15"
      },
      {
        id: "GSTR2B003",
        supplier_gstin: "36AEFGH9012I3J4",
        supplier_name: "Missing Supplier Ltd",
        invoice_number: "MISS/2024/2222",
        invoice_date: "2024-10-22",
        invoice_value: 180000,
        place_of_supply: "Telangana",
        reverse_charge: true,
        itc_igst: 32400,
        itc_cgst: 0,
        itc_sgst: 0,
        itc_cess: 0,
        return_period: "Oct 2024",
        matched_with_books: false,
        discrepancy_amount: 32400,
        discrepancy_reason: "Reverse charge invoice not booked",
        action_required: true,
        created_date: "2024-11-15"
      }
    ];

    // Mock ITC Reversals
    const mockITCReversals: ITCReversal[] = [
      {
        id: "REV001",
        reversal_type: "rule_42",
        reversal_reason: "Proportionate reversal for exempt supplies",
        original_itc_amount: 153000,
        reversal_amount: 30600,
        reversal_date: "2024-10-30",
        return_period: "Oct 2024",
        status: "reversed",
        remarks: "20% of ITC reversed as per Rule 42",
        created_by: "Amit Singh",
        created_date: "2024-10-30"
      },
      {
        id: "REV002",
        reversal_type: "non_payment",
        reversal_reason: "Non-payment to supplier beyond 180 days",
        original_itc_amount: 45000,
        reversal_amount: 45000,
        reversal_date: "2024-10-25",
        return_period: "Oct 2024",
        status: "calculated",
        remarks: "Invoice due date exceeded 180 days",
        created_by: "Priya Sharma",
        created_date: "2024-10-25"
      }
    ];

    // Mock ITC Utilizations
    const mockITCUtilizations: ITCUtilization[] = [
      {
        id: "UTIL001",
        utilization_type: "output_liability",
        utilized_amount: 285000,
        return_period: "Oct 2024",
        utilization_date: "2024-10-20",
        reference_number: "GSTR3B/Oct2024",
        balance_after_utilization: 198600,
        created_date: "2024-10-20"
      },
      {
        id: "UTIL002",
        utilization_type: "interest",
        utilized_amount: 15000,
        return_period: "Sep 2024",
        utilization_date: "2024-09-30",
        reference_number: "INT/Sep2024",
        balance_after_utilization: 483600,
        created_date: "2024-09-30"
      }
    ];

    setItcRecords(mockITCRecords);
    setGstr2bRecords(mockGSTR2BRecords);
    setItcReversals(mockITCReversals);
    setItcUtilizations(mockITCUtilizations);

    // Calculate stats
    const totalEligible = mockITCRecords.reduce((sum, record) => sum + record.itc_eligible_amount, 0);
    const totalClaimed = mockITCRecords.reduce((sum, record) => sum + record.itc_claimed_amount, 0);
    const totalReversed = mockITCRecords.reduce((sum, record) => sum + record.itc_reversed_amount, 0);
    const pendingClaims = mockITCRecords.filter(record => record.itc_status === 'eligible').length;
    const unmatchedGSTR2B = mockGSTR2BRecords.filter(record => !record.matched_with_books).length;
    const thisMonthClaimed = mockITCRecords
      .filter(record => record.period === "Oct 2024")
      .reduce((sum, record) => sum + record.itc_claimed_amount, 0);
    const availableBalance = totalClaimed - totalReversed - mockITCUtilizations.reduce((sum, util) => sum + util.utilized_amount, 0);
    const utilizationThisMonth = mockITCUtilizations
      .filter(util => util.return_period === "Oct 2024")
      .reduce((sum, util) => sum + util.utilized_amount, 0);

    setStats({
      total_itc_eligible: totalEligible,
      total_itc_claimed: totalClaimed,
      total_itc_reversed: totalReversed,
      pending_claims: pendingClaims,
      gstr2b_unmatched: unmatchedGSTR2B,
      this_month: thisMonthClaimed,
      available_balance: availableBalance,
      utilization_this_month: utilizationThisMonth
    });
  };

  const filteredITCRecords = itcRecords.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor_gstin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.itc_status === statusFilter;
    const matchesPeriod = periodFilter === "all" || record.period === periodFilter;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const filteredGSTR2BRecords = gstr2bRecords.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.supplier_gstin.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleAddITC = () => {
    setEditingITC(null);
    setFormData({
      invoice_number: '',
      vendor_name: '',
      vendor_gstin: '',
      invoice_date: '',
      invoice_value: '',
      cgst_amount: '',
      sgst_amount: '',
      igst_amount: '',
      purchase_type: '',
      hsn_code: '',
      place_of_supply: '',
      claim_reason: '',
      reverse_charge: false,
      period: ''
    });
    setShowITCForm(true);
  };

  const handleEditITC = (record: ITCRecord) => {
    setEditingITC(record);
    setFormData({
      invoice_number: record.invoice_number,
      vendor_name: record.vendor_name,
      vendor_gstin: record.vendor_gstin,
      invoice_date: record.invoice_date,
      invoice_value: record.invoice_value.toString(),
      cgst_amount: record.cgst_amount.toString(),
      sgst_amount: record.sgst_amount.toString(),
      igst_amount: record.igst_amount.toString(),
      purchase_type: record.purchase_type,
      hsn_code: record.hsn_code || '',
      place_of_supply: record.place_of_supply,
      claim_reason: record.claim_reason,
      reverse_charge: record.reverse_charge,
      period: record.period
    });
    setShowITCForm(true);
  };

  const handleFormChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total GST when individual GST components change
      if (field === 'cgst_amount' || field === 'sgst_amount' || field === 'igst_amount') {
        const cgst = parseFloat(updated.cgst_amount) || 0;
        const sgst = parseFloat(updated.sgst_amount) || 0;
        const igst = parseFloat(updated.igst_amount) || 0;
        // Total GST is calculated automatically in the form display
      }
      
      return updated;
    });
  };

  const handleSaveITC = () => {
    if (!formData.invoice_number || !formData.vendor_name || !formData.vendor_gstin) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const cgst = parseFloat(formData.cgst_amount) || 0;
    const sgst = parseFloat(formData.sgst_amount) || 0;
    const igst = parseFloat(formData.igst_amount) || 0;
    const totalGST = cgst + sgst + igst;

    const newRecord: ITCRecord = {
      id: editingITC ? editingITC.id : `ITC${String(itcRecords.length + 1).padStart(3, '0')}`,
      invoice_number: formData.invoice_number,
      vendor_name: formData.vendor_name,
      vendor_gstin: formData.vendor_gstin,
      invoice_date: formData.invoice_date,
      invoice_value: parseFloat(formData.invoice_value) || 0,
      cgst_amount: cgst,
      sgst_amount: sgst,
      igst_amount: igst,
      total_gst: totalGST,
      itc_eligible_amount: totalGST,
      itc_claimed_amount: 0,
      itc_reversed_amount: 0,
      itc_status: 'eligible',
      claim_reason: formData.claim_reason,
      period: formData.period,
      financial_year: "2024-25",
      gstr2b_matched: false,
      purchase_type: formData.purchase_type as 'goods' | 'services' | 'capital_goods' | 'input_services',
      hsn_code: formData.hsn_code,
      place_of_supply: formData.place_of_supply,
      reverse_charge: formData.reverse_charge,
      created_by: "Current User",
      created_date: new Date().toISOString().split('T')[0],
      last_modified: new Date().toISOString().split('T')[0]
    };

    if (editingITC) {
      setItcRecords(prev => prev.map(record => 
        record.id === editingITC.id ? newRecord : record
      ));
      toast({
        title: "Success",
        description: "ITC record updated successfully",
      });
    } else {
      setItcRecords(prev => [...prev, newRecord]);
      toast({
        title: "Success",
        description: "ITC record created successfully",
      });
    }

    setShowITCForm(false);
    setEditingITC(null);
  };

  const handleClaimITC = (recordId: string) => {
    setItcRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          itc_status: 'claimed' as const,
          itc_claimed_amount: record.itc_eligible_amount,
          last_modified: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    }));

    toast({
      title: "Success",
      description: "ITC claimed successfully",
    });
  };

  const handleBulkClaim = () => {
    if (selectedRecords.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select records to claim ITC",
        variant: "destructive",
      });
      return;
    }

    setItcRecords(prev => prev.map(record => {
      if (selectedRecords.includes(record.id) && record.itc_status === 'eligible') {
        return {
          ...record,
          itc_status: 'claimed' as const,
          itc_claimed_amount: record.itc_eligible_amount,
          last_modified: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    }));

    toast({
      title: "Success",
      description: `ITC claimed for ${selectedRecords.length} records`,
    });

    setSelectedRecords([]);
  };

  const handleReconcile = () => {
    setReconciling(true);
    
    // Simulate reconciliation process
    setTimeout(() => {
      // Auto-match records
      setGstr2bRecords(prev => prev.map(gstr2bRecord => {
        const matchedITC = itcRecords.find(itcRecord => 
          itcRecord.invoice_number === gstr2bRecord.invoice_number &&
          itcRecord.vendor_gstin === gstr2bRecord.supplier_gstin
        );
        
        if (matchedITC) {
          return {
            ...gstr2bRecord,
            matched_with_books: true,
            matched_invoice_id: matchedITC.id,
            action_required: false
          };
        }
        return gstr2bRecord;
      }));

      // Update ITC records as matched
      setItcRecords(prev => prev.map(itcRecord => {
        const gstr2bMatch = gstr2bRecords.find(gstr2bRecord => 
          gstr2bRecord.invoice_number === itcRecord.invoice_number &&
          gstr2bRecord.supplier_gstin === itcRecord.vendor_gstin
        );
        
        if (gstr2bMatch) {
          return {
            ...itcRecord,
            gstr2b_matched: true,
            gstr2b_month: gstr2bMatch.return_period,
            last_modified: new Date().toISOString().split('T')[0]
          };
        }
        return itcRecord;
      }));

      setReconciling(false);
      toast({
        title: "Reconciliation Complete",
        description: "GSTR-2B matching completed successfully",
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      eligible: { color: "bg-blue-100 text-blue-800", text: "Eligible" },
      claimed: { color: "bg-green-100 text-green-800", text: "Claimed" },
      reversed: { color: "bg-orange-100 text-orange-800", text: "Reversed" },
      blocked: { color: "bg-red-100 text-red-800", text: "Blocked" },
      lapsed: { color: "bg-gray-100 text-gray-800", text: "Lapsed" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.eligible;
    return <Badge className={config.color}>{config.text}</Badge>;
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
        <title>ITC Management - JusFinn</title>
        <meta name="description" content="Comprehensive ITC management with GSTR-2B reconciliation" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ITC Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Input Tax Credit claims, reversals, and GSTR-2B reconciliation
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleReconcile}
              disabled={reconciling}
              className="flex items-center gap-2"
            >
              {reconciling ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Reconciling...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4" />
                  GSTR-2B Reconcile
                </>
              )}
            </Button>
            <Button 
              onClick={handleAddITC}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add ITC Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total ITC Eligible</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.total_itc_eligible)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total ITC Claimed</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.total_itc_claimed)}</p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Available Balance</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(stats.available_balance)}</p>
                </div>
                <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Pending Claims</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.pending_claims}</p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="itc">ITC Records</TabsTrigger>
          <TabsTrigger value="gstr2b">GSTR-2B Matching</TabsTrigger>
          <TabsTrigger value="reversals">ITC Reversals</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="itc" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    ITC Records
                  </CardTitle>
                  <CardDescription>
                    Manage input tax credit records and claims
                  </CardDescription>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  {selectedRecords.length > 0 && (
                    <Button onClick={handleBulkClaim} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Claim Selected ({selectedRecords.length})
                    </Button>
                  )}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="eligible">Eligible</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="reversed">Reversed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    {financialPeriods.map(period => (
                      <SelectItem key={period} value={period}>{period}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ITC Records Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRecords.length === filteredITCRecords.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecords(filteredITCRecords.map(r => r.id));
                            } else {
                              setSelectedRecords([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>GST Amount</TableHead>
                      <TableHead>ITC Status</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>GSTR-2B</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredITCRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRecords(prev => [...prev, record.id]);
                              } else {
                                setSelectedRecords(prev => prev.filter(id => id !== record.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.invoice_number}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.invoice_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Value: {formatCurrency(record.invoice_value)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.vendor_name}</p>
                            <p className="text-sm text-gray-500">{record.vendor_gstin}</p>
                            <p className="text-sm text-gray-500">{record.place_of_supply}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(record.total_gst)}</p>
                            <div className="text-sm text-gray-500">
                              {record.cgst_amount > 0 && <p>CGST: {formatCurrency(record.cgst_amount)}</p>}
                              {record.sgst_amount > 0 && <p>SGST: {formatCurrency(record.sgst_amount)}</p>}
                              {record.igst_amount > 0 && <p>IGST: {formatCurrency(record.igst_amount)}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(record.itc_status)}
                            {record.itc_status === 'claimed' && (
                              <p className="text-sm text-green-600">
                                Claimed: {formatCurrency(record.itc_claimed_amount)}
                              </p>
                            )}
                            {record.itc_reversed_amount > 0 && (
                              <p className="text-sm text-orange-600">
                                Reversed: {formatCurrency(record.itc_reversed_amount)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{record.period}</p>
                          <p className="text-xs text-gray-500">{record.financial_year}</p>
                        </TableCell>
                        <TableCell>
                          {record.gstr2b_matched ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Matched
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditITC(record)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {record.itc_status === 'eligible' && (
                              <Button
                                size="sm"
                                onClick={() => handleClaimITC(record.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Claim
                              </Button>
                            )}
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5" />
                    GSTR-2B Reconciliation
                  </CardTitle>
                  <CardDescription>
                    Match GSTR-2B data with purchase records
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import GSTR-2B
                  </Button>
                  <Button
                    onClick={handleReconcile}
                    disabled={reconciling}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {reconciling ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Auto-Match
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Auto-Match
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search GSTR-2B records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* GSTR-2B Records Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Details</TableHead>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>ITC Amount</TableHead>
                      <TableHead>Matching Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGSTR2BRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.supplier_name}</p>
                            <p className="text-sm text-gray-500">{record.supplier_gstin}</p>
                            <p className="text-sm text-gray-500">{record.place_of_supply}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.invoice_number}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.invoice_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Value: {formatCurrency(record.invoice_value)}
                            </p>
                            {record.reverse_charge && (
                              <Badge className="bg-orange-100 text-orange-800 mt-1">
                                Reverse Charge
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {formatCurrency(record.itc_igst + record.itc_cgst + record.itc_sgst)}
                            </p>
                            <div className="text-sm text-gray-500">
                              {record.itc_cgst > 0 && <p>CGST: {formatCurrency(record.itc_cgst)}</p>}
                              {record.itc_sgst > 0 && <p>SGST: {formatCurrency(record.itc_sgst)}</p>}
                              {record.itc_igst > 0 && <p>IGST: {formatCurrency(record.itc_igst)}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {record.matched_with_books ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Matched
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Unmatched
                              </Badge>
                            )}
                            {record.action_required && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Action Required
                              </Badge>
                            )}
                            {record.discrepancy_amount && (
                              <p className="text-sm text-red-600">
                                Discrepancy: {formatCurrency(record.discrepancy_amount)}
                              </p>
                            )}
                            {record.discrepancy_reason && (
                              <p className="text-xs text-gray-500">{record.discrepancy_reason}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!record.matched_with_books && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Target className="w-4 h-4 mr-1" />
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reversals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    ITC Reversals
                  </CardTitle>
                  <CardDescription>
                    Manage ITC reversals as per GST rules
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowReversalForm(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Reversal
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Reversal Calculator */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Automated Reversal Calculator</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Rule 42 - Proportionate Reversal</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      For common credit used for taxable and exempt supplies
                    </p>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(30600)}
                    </div>
                    <p className="text-xs text-gray-500">Calculated for current period</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Rule 43 - Common Credit</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Reversal for common input services
                    </p>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(0)}
                    </div>
                    <p className="text-xs text-gray-500">No reversal required</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Non-Payment (180 days)</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      ITC to be reversed for unpaid invoices
                    </p>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(45000)}
                    </div>
                    <p className="text-xs text-gray-500">3 invoices due</p>
                  </div>
                </div>
              </div>

              {/* Reversals Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reversal Type</TableHead>
                      <TableHead>Amount Details</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itcReversals.map((reversal) => (
                      <TableRow key={reversal.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reversal.reversal_type.toUpperCase()}</p>
                            <p className="text-sm text-gray-500">{reversal.reversal_reason}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Reversal: {formatCurrency(reversal.reversal_amount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Original: {formatCurrency(reversal.original_itc_amount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(reversal.reversal_date).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{reversal.return_period}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            reversal.status === 'reversed' 
                              ? 'bg-green-100 text-green-800' 
                              : reversal.status === 'calculated'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }>
                            {reversal.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{reversal.created_by}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(reversal.created_date).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {reversal.status === 'calculated' && (
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reverse
                              </Button>
                            )}
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

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                ITC Utilization
              </CardTitle>
              <CardDescription>
                Track ITC utilization for output liability, interest, and penalties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Utilization Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600">Available Balance</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(stats.available_balance)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600">This Month Utilization</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(stats.utilization_this_month)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600">Total Utilized</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatCurrency(300000)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilization Records */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilization Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itcUtilizations.map((utilization) => (
                      <TableRow key={utilization.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              utilization.utilization_type === 'output_liability' ? 'bg-green-500' :
                              utilization.utilization_type === 'interest' ? 'bg-orange-500' :
                              utilization.utilization_type === 'penalty' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <span className="font-medium">
                              {utilization.utilization_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(utilization.utilized_amount)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{utilization.return_period}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-mono">{utilization.reference_number}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatCurrency(utilization.balance_after_utilization)}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(utilization.utilization_date).toLocaleDateString()}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ITC Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  ITC Trends
                </CardTitle>
                <CardDescription>
                  Monthly ITC claims and reversals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart placeholder with realistic data representation */}
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end justify-between">
                    {financialPeriods.slice(0, 6).map((period, index) => (
                      <div key={period} className="flex flex-col items-center">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ 
                            height: `${120 + index * 20}px`, 
                            width: '24px',
                            marginBottom: '8px'
                          }}
                        />
                        <div 
                          className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t"
                          style={{ 
                            height: `${20 + index * 5}px`, 
                            width: '24px',
                            marginBottom: '8px'
                          }}
                        />
                        <span className="text-xs text-gray-600 transform -rotate-45 origin-left">
                          {period.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-sm">ITC Claimed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded" />
                      <span className="text-sm">ITC Reversed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor-wise Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Vendor-wise Analysis
                </CardTitle>
                <CardDescription>
                  Top vendors by ITC contribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pie chart representation */}
                  <div className="h-40 w-40 mx-auto relative">
                    <div className="w-full h-full rounded-full border-8 border-blue-500 border-t-green-500 border-r-orange-500 border-b-purple-500 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-gray-500">Vendors</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vendor breakdown */}
                  <div className="space-y-2">
                    {[
                      { name: "TCS Limited", amount: 106200, color: "bg-blue-500" },
                      { name: "Infosys Limited", amount: 135000, color: "bg-green-500" },
                      { name: "Dell Technologies", amount: 153000, color: "bg-orange-500" },
                      { name: "Amazon Web Services", amount: 22500, color: "bg-purple-500" },
                      { name: "Microsoft Corporation", amount: 81000, color: "bg-pink-500" }
                    ].map((vendor, index) => (
                      <div key={vendor.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${vendor.color}`} />
                          <span className="text-sm">{vendor.name}</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(vendor.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Compliance Score
                </CardTitle>
                <CardDescription>
                  Overall ITC compliance health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                    <p className="text-gray-600">Excellent Compliance</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>GSTR-2B Matching</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Timely Reversals</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Documentation</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>
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
                  Common ITC management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col">
                    <Download className="w-6 h-6 mb-1" />
                    <span className="text-xs">Export ITC Register</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Import GSTR-2B</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Calculator className="w-6 h-6 mb-1" />
                    <span className="text-xs">Calculate Reversals</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="w-6 h-6 mb-1" />
                    <span className="text-xs">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ITC Form Dialog */}
      <Dialog open={showITCForm} onOpenChange={setShowITCForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingITC ? 'Edit ITC Record' : 'Add New ITC Record'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Invoice Details</h3>
              
              <div>
                <Label htmlFor="invoice_number">Invoice Number *</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => handleFormChange('invoice_number', e.target.value)}
                  placeholder="INV/2024/001"
                />
              </div>
              
              <div>
                <Label htmlFor="invoice_date">Invoice Date *</Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => handleFormChange('invoice_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="invoice_value">Invoice Value *</Label>
                <Input
                  id="invoice_value"
                  type="number"
                  value={formData.invoice_value}
                  onChange={(e) => handleFormChange('invoice_value', e.target.value)}
                  placeholder="100000"
                />
              </div>
              
              <div>
                <Label htmlFor="purchase_type">Purchase Type *</Label>
                <Select value={formData.purchase_type} onValueChange={(value) => handleFormChange('purchase_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purchase type" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hsn_code">HSN/SAC Code</Label>
                <Input
                  id="hsn_code"
                  value={formData.hsn_code}
                  onChange={(e) => handleFormChange('hsn_code', e.target.value)}
                  placeholder="998313"
                />
              </div>
            </div>

            {/* Vendor & GST Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Vendor & GST Details</h3>
              
              <div>
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => handleFormChange('vendor_name', e.target.value)}
                  placeholder="ABC Pvt Ltd"
                />
              </div>
              
              <div>
                <Label htmlFor="vendor_gstin">Vendor GSTIN *</Label>
                <Input
                  id="vendor_gstin"
                  value={formData.vendor_gstin}
                  onChange={(e) => handleFormChange('vendor_gstin', e.target.value)}
                  placeholder="27AABCC1234D1Z5"
                />
              </div>
              
              <div>
                <Label htmlFor="place_of_supply">Place of Supply *</Label>
                <Input
                  id="place_of_supply"
                  value={formData.place_of_supply}
                  onChange={(e) => handleFormChange('place_of_supply', e.target.value)}
                  placeholder="Maharashtra"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="cgst_amount">CGST Amount</Label>
                  <Input
                    id="cgst_amount"
                    type="number"
                    value={formData.cgst_amount}
                    onChange={(e) => handleFormChange('cgst_amount', e.target.value)}
                    placeholder="9000"
                  />
                </div>
                <div>
                  <Label htmlFor="sgst_amount">SGST Amount</Label>
                  <Input
                    id="sgst_amount"
                    type="number"
                    value={formData.sgst_amount}
                    onChange={(e) => handleFormChange('sgst_amount', e.target.value)}
                    placeholder="9000"
                  />
                </div>
                <div>
                  <Label htmlFor="igst_amount">IGST Amount</Label>
                  <Input
                    id="igst_amount"
                    type="number"
                    value={formData.igst_amount}
                    onChange={(e) => handleFormChange('igst_amount', e.target.value)}
                    placeholder="18000"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium">
                  Total GST: {formatCurrency(
                    (parseFloat(formData.cgst_amount) || 0) + 
                    (parseFloat(formData.sgst_amount) || 0) + 
                    (parseFloat(formData.igst_amount) || 0)
                  )}
                </p>
              </div>
            </div>

            {/* ITC Details */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-semibold text-gray-900">ITC Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claim_reason">Claim Reason *</Label>
                  <Select value={formData.claim_reason} onValueChange={(value) => handleFormChange('claim_reason', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {claimReasons.map(reason => (
                        <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="period">Return Period *</Label>
                  <Select value={formData.period} onValueChange={(value) => handleFormChange('period', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialPeriods.map(period => (
                        <SelectItem key={period} value={period}>{period}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reverse_charge"
                  checked={formData.reverse_charge}
                  onCheckedChange={(checked) => handleFormChange('reverse_charge', !!checked)}
                />
                <Label htmlFor="reverse_charge">Reverse Charge Applicable</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button variant="outline" onClick={() => setShowITCForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveITC} className="bg-blue-600 hover:bg-blue-700">
              {editingITC ? 'Update Record' : 'Create Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default ITCManagement; 