import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye,
  Download,
  Upload,
  Calculator,
  FileText,
  TrendingUp,
  AlertCircle,
  Zap,
  Settings,
  Filter,
  Search,
  ArrowDown,
  ArrowUp,
  Clock,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


const Reconciliation = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationProgress, setReconciliationProgress] = useState(0);
  const [selectedBank, setSelectedBank] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");

  const clients = [
    { id: 1, name: "ABC Corporation", pan: "ABCDE1234F" },
    { id: 2, name: "XYZ Industries Ltd", pan: "XYZAB5678G" },
    { id: 3, name: "DEF Enterprises", pan: "DEFGH9012H" }
  ];

  const reconciliationTypes = [
    {
      id: 1,
      name: "Sales Register vs GSTR-1",
      description: "Match sales invoices with GSTR-1 filing for GST compliance",
      status: "ready",
      matchRate: 94,
      discrepancies: 12,
      lastRun: "2 hours ago",
      icon: FileText
    },
    {
      id: 2,
      name: "Purchase Register vs GSTR-2B",
      description: "Verify purchase invoices with GSTR-2B for ITC reconciliation",
      status: "in_progress",
      matchRate: 87,
      discrepancies: 18,
      lastRun: "Running...",
      icon: Calculator
    },
    {
      id: 3,
      name: "Bank Statement vs Invoices",
      description: "Match bank transactions with invoice payments/receipts",
      status: "completed",
      matchRate: 96,
      discrepancies: 8,
      lastRun: "1 day ago",
      icon: TrendingUp
    },
    {
      id: 4,
      name: "GSTR-3B vs Computed Liability",
      description: "Reconcile filed GSTR-3B with computed tax liability",
      status: "ready",
      matchRate: 92,
      discrepancies: 15,
      lastRun: "3 hours ago",
      icon: Calculator
    },
    {
      id: 5,
      name: "TDS Deducted vs TDS Deposited",
      description: "Match TDS deductions with actual deposits to government",
      status: "completed",
      matchRate: 98,
      discrepancies: 3,
      lastRun: "1 day ago",
      icon: RefreshCw
    },
    {
      id: 6,
      name: "Books vs IT Computation",
      description: "Reconcile book profits with Income Tax computation",
      status: "ready",
      matchRate: 89,
      discrepancies: 22,
      lastRun: "5 hours ago",
      icon: FileText
    },
    {
      id: 7,
      name: "Creditors vs Purchase Register",
      description: "Match outstanding creditors with purchase records",
      status: "completed",
      matchRate: 95,
      discrepancies: 11,
      lastRun: "6 hours ago",
      icon: TrendingUp
    },
    {
      id: 8,
      name: "Debtors vs Sales Register",
      description: "Reconcile outstanding debtors with sales transactions",
      status: "ready",
      matchRate: 93,
      discrepancies: 14,
      lastRun: "4 hours ago",
      icon: FileText
    },
    {
      id: 9,
      name: "Inventory vs Stock Register",
      description: "Match physical inventory with stock register entries",
      status: "completed",
      matchRate: 91,
      discrepancies: 17,
      lastRun: "2 days ago",
      icon: Calculator
    }
  ];

  const discrepancies = [
    {
      id: 1,
      type: "Sales Register vs GSTR-1",
      description: "Invoice amount mismatch",
      details: "Invoice INV-001: Sales Register ₹1,18,000 vs GSTR-1 ₹1,18,500",
      severity: "high",
      suggestion: "Check for rate difference or additional charges",
      status: "pending"
    },
    {
      id: 2,
      type: "Purchase Register vs GSTR-2B",
      description: "Missing ITC claim",
      details: "Invoice ABC-123: Available in GSTR-2B but not claimed in purchase register",
      severity: "medium",
      suggestion: "Verify vendor details and claim ITC",
      status: "resolved"
    },
    {
      id: 3,
      type: "Bank Statement vs Invoices",
      description: "Payment timing difference",
      details: "Invoice DEF-456: Payment received on 15th but invoice dated 10th",
      severity: "low",
      suggestion: "Normal timing difference, no action needed",
      status: "reviewed"
    },
    {
      id: 4,
      type: "Sales Register vs GSTR-1",
      description: "Duplicate entry detected",
      details: "Invoice GHI-789: Appears twice in sales register",
      severity: "high",
      suggestion: "Remove duplicate entry from sales register",
      status: "pending"
    }
  ];

  const reconciliationSummary = {
    totalRecords: 2456,
    matched: 2398,
    discrepancies: 58,
    matchRate: 97.6,
    lastUpdate: "2 hours ago"
  };

  // Apple Design: Priority-focused reconciliation stats
  const reconciliationStats = [
    {
      title: "Outstanding Items",
      value: "23",
      color: "text-red-500",
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      trend: "+5 from last month"
    },
    {
      title: "Matched Transactions",
      value: "847",
      color: "text-green-500",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      trend: "+12% vs last month"
    },
    {
      title: "Pending Review",
      value: "12",
      color: "text-amber-500",
      icon: Clock,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      trend: "3 due today"
    },
    {
      title: "Auto-Matched",
      value: "94.2%",
      color: "text-blue-500",
      icon: Bot,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      trend: "AI accuracy rate"
    }
  ];

  // Sample reconciliation data with priority classification
  const reconciliationItems = [
    {
      id: "1",
      bankAccount: "HDFC Bank - Current A/c",
      date: "2024-01-15",
      description: "NEFT Transfer from ABC Corp",
      bankAmount: 125000,
      bookAmount: 125000,
      difference: 0,
      status: "matched",
      priority: "low",
      type: "receipt",
      reference: "TXN240115001"
    },
    {
      id: "2",
      bankAccount: "ICICI Bank - Savings A/c",
      date: "2024-01-14",
      description: "Cheque Payment to XYZ Suppliers",
      bankAmount: -45000,
      bookAmount: -44800,
      difference: -200,
      status: "unmatched",
      priority: "high",
      type: "payment",
      reference: "CHQ240114002"
    },
    {
      id: "3",
      bankAccount: "SBI Bank - Current A/c",
      date: "2024-01-13",
      description: "Online Transfer - Salary",
      bankAmount: -85000,
      bookAmount: -85000,
      difference: 0,
      status: "matched",
      priority: "low",
      type: "payment",
      reference: "OTR240113003"
    },
    {
      id: "4",
      bankAccount: "HDFC Bank - Current A/c",
      date: "2024-01-12",
      description: "Bank Charges",
      bankAmount: -250,
      bookAmount: 0,
      difference: -250,
      status: "unmatched",
      priority: "critical",
      type: "payment",
      reference: "BNK240112004"
    }
  ];

  const handleStartReconciliation = (type: string) => {
    if (!selectedClient || !selectedPeriod) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please select a client and period first",
        variant: "destructive"
      });
      return;
    }

    setIsReconciling(true);
    setReconciliationProgress(0);

    // Show initial toast
    toast({
      title: "🚀 AI Reconciliation Started",
      description: `Processing ${reconciliationSummary.totalRecords} records with advanced AI matching...`,
    });

    const stages = [
      { progress: 20, message: "📊 Loading data sources..." },
      { progress: 40, message: "🔍 AI pattern matching..." },
      { progress: 60, message: "🤖 Detecting discrepancies..." },
      { progress: 80, message: "📈 Generating insights..." },
      { progress: 100, message: "✅ Reconciliation complete!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setReconciliationProgress(stage.progress);
        
        toast({
          title: stage.message,
          description: `${stage.progress}% complete`,
        });
        
        currentStage++;
      } else {
        clearInterval(interval);
        setIsReconciling(false);
        const discrepancyCount = Math.floor(Math.random() * 10) + 5;
        toast({
          title: "🎉 Reconciliation Complete!",
          description: `AI analysis finished! Found ${discrepancyCount} discrepancies with 97.6% match rate. ${discrepancyCount - 2} auto-resolved.`,
        });
      }
    }, 1000);
  };

  const handleResolveDiscrepancy = (discrepancyId: number) => {
    const discrepancy = discrepancies.find(d => d.id === discrepancyId);
    toast({
      title: "✅ Discrepancy Resolved",
      description: `Successfully resolved: ${discrepancy?.description}. System updated and client notified.`,
    });
  };

  const handleRunSpecificReconciliation = (typeName: string) => {
    setIsReconciling(true);
    setReconciliationProgress(0);

    // Show type-specific toast
    toast({
      title: `🚀 ${typeName} Started`,
      description: `Running AI-powered reconciliation for ${typeName}...`,
    });

    const typeSpecificStages = {
      "Sales Register vs GSTR-1": [
        { progress: 25, message: "📊 Loading sales register data..." },
        { progress: 50, message: "🔍 Matching with GSTR-1 entries..." },
        { progress: 75, message: "🤖 Detecting HSN code mismatches..." },
        { progress: 100, message: "✅ Sales reconciliation complete!" }
      ],
      "Purchase Register vs GSTR-2B": [
        { progress: 25, message: "📊 Loading purchase register..." },
        { progress: 50, message: "🔍 Matching with GSTR-2B data..." },
        { progress: 75, message: "🤖 Validating ITC claims..." },
        { progress: 100, message: "✅ Purchase reconciliation complete!" }
      ],
      "Bank Statement vs Invoices": [
        { progress: 25, message: "📊 Loading bank statements..." },
        { progress: 50, message: "🔍 Matching transactions..." },
        { progress: 75, message: "🤖 Detecting payment delays..." },
        { progress: 100, message: "✅ Bank reconciliation complete!" }
      ],
      "GSTR-3B vs Computed Liability": [
        { progress: 25, message: "📊 Loading GSTR-3B returns..." },
        { progress: 50, message: "🔍 Computing tax liability..." },
        { progress: 75, message: "🤖 Analyzing tax differences..." },
        { progress: 100, message: "✅ GSTR-3B reconciliation complete!" }
      ],
      "TDS Deducted vs TDS Deposited": [
        { progress: 25, message: "📊 Loading TDS records..." },
        { progress: 50, message: "🔍 Matching with challan data..." },
        { progress: 75, message: "🤖 Validating deposit timing..." },
        { progress: 100, message: "✅ TDS reconciliation complete!" }
      ],
      "Books vs IT Computation": [
        { progress: 25, message: "📊 Loading book entries..." },
        { progress: 50, message: "🔍 Analyzing IT adjustments..." },
        { progress: 75, message: "🤖 Computing tax variations..." },
        { progress: 100, message: "✅ IT reconciliation complete!" }
      ],
      "Creditors vs Purchase Register": [
        { progress: 25, message: "📊 Loading creditor balances..." },
        { progress: 50, message: "🔍 Matching purchase entries..." },
        { progress: 75, message: "🤖 Analyzing aging patterns..." },
        { progress: 100, message: "✅ Creditor reconciliation complete!" }
      ],
      "Debtors vs Sales Register": [
        { progress: 25, message: "📊 Loading debtor balances..." },
        { progress: 50, message: "🔍 Matching sales entries..." },
        { progress: 75, message: "🤖 Analyzing collection patterns..." },
        { progress: 100, message: "✅ Debtor reconciliation complete!" }
      ],
      "Inventory vs Stock Register": [
        { progress: 25, message: "📊 Loading inventory data..." },
        { progress: 50, message: "🔍 Matching stock movements..." },
        { progress: 75, message: "🤖 Analyzing variance patterns..." },
        { progress: 100, message: "✅ Inventory reconciliation complete!" }
      ]
    };

    const stages = typeSpecificStages[typeName as keyof typeof typeSpecificStages] || [
      { progress: 50, message: "🔍 Processing data..." },
      { progress: 100, message: "✅ Reconciliation complete!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setReconciliationProgress(stage.progress);
        
        toast({
          title: stage.message,
          description: `${stage.progress}% complete`,
        });
        
        currentStage++;
      } else {
        clearInterval(interval);
        setIsReconciling(false);
        
        // Generate type-specific results
        const results = {
          "Sales Register vs GSTR-1": {
            matched: 1234,
            discrepancies: 12,
            matchRate: 94,
            details: "Found 12 amount mismatches, 3 HSN code differences"
          },
          "Purchase Register vs GSTR-2B": {
            matched: 856,
            discrepancies: 18,
            matchRate: 87,
            details: "Found 18 ITC claim issues, 5 vendor mismatches"
          },
          "Bank Statement vs Invoices": {
            matched: 2103,
            discrepancies: 8,
            matchRate: 96,
            details: "Found 8 payment timing differences, 2 amount variations"
          },
          "GSTR-3B vs Computed Liability": {
            matched: 945,
            discrepancies: 15,
            matchRate: 92,
            details: "Found 15 tax computation differences, 7 ITC reversals"
          },
          "TDS Deducted vs TDS Deposited": {
            matched: 234,
            discrepancies: 3,
            matchRate: 98,
            details: "Found 3 late deposit instances, all within compliance period"
          },
          "Books vs IT Computation": {
            matched: 1567,
            discrepancies: 22,
            matchRate: 89,
            details: "Found 22 book-tax differences, 12 depreciation adjustments"
          },
          "Creditors vs Purchase Register": {
            matched: 789,
            discrepancies: 11,
            matchRate: 95,
            details: "Found 11 aging differences, 4 advance payment adjustments"
          },
          "Debtors vs Sales Register": {
            matched: 1023,
            discrepancies: 14,
            matchRate: 93,
            details: "Found 14 collection timing differences, 6 credit note adjustments"
          },
          "Inventory vs Stock Register": {
            matched: 1456,
            discrepancies: 17,
            matchRate: 91,
            details: "Found 17 quantity variances, 8 valuation differences"
          }
        };

        const result = results[typeName as keyof typeof results];
        
        toast({
          title: `🎉 ${typeName} Complete!`,
          description: `Matched ${result?.matched} records with ${result?.matchRate}% accuracy. ${result?.details}`,
        });
      }
    }, 1200);
  };

  const handleExportReport = () => {
    toast({
      title: "📊 Exporting Report",
      description: "Generating comprehensive reconciliation report with AI insights...",
    });
    
    // Simulate export progress
    setTimeout(() => {
      toast({
        title: "✅ Report Ready",
        description: "Reconciliation_Report_Jan2024.xlsx is ready for download. Contains 2,456 records with detailed analysis.",
      });
    }, 2000);
  };

  const handleViewDetails = (typeName: string) => {
    const details = {
      "Sales Register vs GSTR-1": {
        description: "Detailed analysis of sales register entries matched against GSTR-1 filing",
        insights: "94% match rate with 12 discrepancies found. Most common issues: HSN code mismatches (7) and amount differences (5)."
      },
      "Purchase Register vs GSTR-2B": {
        description: "Comprehensive matching of purchase register with GSTR-2B for ITC validation",
        insights: "87% match rate with 18 discrepancies. Key issues: Missing ITC claims (12), vendor detail mismatches (6)."
      },
      "Bank Statement vs Invoices": {
        description: "Bank statement reconciliation with invoice payments and receipts",
        insights: "96% match rate with 8 discrepancies. Primary issues: Payment timing differences (6), amount variations (2)."
      },
      "GSTR-3B vs Computed Liability": {
        description: "Reconciliation between filed GSTR-3B returns and computed tax liability",
        insights: "92% match rate with 15 discrepancies. Key issues: ITC reversal timing (7), tax computation differences (8)."
      },
      "TDS Deducted vs TDS Deposited": {
        description: "Verification of TDS deductions against actual government deposits",
        insights: "98% match rate with 3 discrepancies. Issues: Late deposit instances (3), all within due dates."
      },
      "Books vs IT Computation": {
        description: "Reconciliation of book profits with Income Tax computation schedules",
        insights: "89% match rate with 22 discrepancies. Key issues: Depreciation differences (12), timing adjustments (10)."
      },
      "Creditors vs Purchase Register": {
        description: "Matching outstanding creditor balances with purchase register entries",
        insights: "95% match rate with 11 discrepancies. Issues: Aging differences (7), advance payment adjustments (4)."
      },
      "Debtors vs Sales Register": {
        description: "Reconciliation of outstanding debtor balances with sales transactions",
        insights: "93% match rate with 14 discrepancies. Issues: Collection timing (8), credit note adjustments (6)."
      },
      "Inventory vs Stock Register": {
        description: "Physical inventory matching with stock register movements and valuations",
        insights: "91% match rate with 17 discrepancies. Issues: Quantity variances (9), valuation differences (8)."
      }
    };
    
    const detail = details[typeName as keyof typeof details];
    
    toast({
      title: `📋 ${typeName} Details`,
      description: `${detail?.description}. ${detail?.insights}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDiscrepancyStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-l-red-500";
      case "high": return "border-l-amber-500";
      case "medium": return "border-l-blue-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "receipt": return <ArrowDown className="w-4 h-4 text-green-600" />;
      case "payment": return <ArrowUp className="w-4 h-4 text-red-600" />;
      default: return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(absoluteAmount);
    return isNegative ? `-${formatted}` : formatted;
  };

  const filteredItems = reconciliationItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesBank = selectedBank === "all" || item.bankAccount.includes(selectedBank);
    return matchesSearch && matchesStatus && matchesBank;
  });

  // Apple Design: Group by priority
  const groupedItems = {
    critical: filteredItems.filter(item => item.priority === "critical"),
    high: filteredItems.filter(item => item.priority === "high"),
    medium: filteredItems.filter(item => item.priority === "medium"),
    low: filteredItems.filter(item => item.priority === "low")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Glassmorphism Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reconciliation</h1>
              <p className="text-gray-600 mt-1">AI-powered reconciliation assistant</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Auto Reconcile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Priority-focused stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {reconciliationStats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Apple Design: Clean filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              <SelectItem value="HDFC">HDFC Bank</SelectItem>
              <SelectItem value="ICICI">ICICI Bank</SelectItem>
              <SelectItem value="SBI">SBI Bank</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="unmatched">Unmatched</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Review</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apple Design: Priority-grouped reconciliation items */}
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([priority, items]) => (
            items.length > 0 && (
              <div key={priority} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    priority === 'critical' ? 'bg-red-500' :
                    priority === 'high' ? 'bg-amber-500' :
                    priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {priority} Priority ({items.length})
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className={`${getPriorityColor(item.priority)} border-l-4 bg-white border-gray-200 hover:shadow-md transition-all duration-200`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{item.description}</h3>
                                <Badge className={`${getStatusColor(item.status)} border text-xs`}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.bankAccount}</p>
                              <p className="text-xs text-gray-500">Ref: {item.reference} • {item.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Bank:</span>
                                <span className="font-medium">{formatAmount(item.bankAmount)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Book:</span>
                                <span className="font-medium">{formatAmount(item.bookAmount)}</span>
                              </div>
                              {item.difference !== 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Diff:</span>
                                  <span className="font-medium text-red-600">{formatAmount(item.difference)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {item.status === "unmatched" && (
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Match
                              </Button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Priority: <span className="capitalize font-medium">{item.priority}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="text-center py-12">
              <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reconciliation items found</h3>
              <p className="text-gray-600">Try adjusting your filters or import bank statements</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reconciliation; 