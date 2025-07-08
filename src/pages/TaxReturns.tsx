import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Settings,
  Filter,
  Target,
  TrendingUp,
  BarChart3,
  Send,
  Bot,
  Calculator,
  Receipt,
  CreditCard,
  Shield,
  Star,
  ArrowRight,
  PieChart,
  FileSpreadsheet,
  Archive,
  Edit,
  Trash2,
  ChevronRight,
  Activity,
  PlayCircle,
  Building2,
  Users,
  CheckSquare,
  AlertCircle,
  IndianRupee,
  Zap,
  FileCheck,
  Timer,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TaxReturn {
  id: string;
  clientName: string;
  clientType: "Individual" | "Company" | "Partnership" | "LLP" | "Trust";
  returnType: "ITR-1" | "ITR-2" | "ITR-3" | "ITR-4" | "ITR-5" | "ITR-6" | "ITR-7";
  assessmentYear: string;
  filingStatus: "draft" | "in_progress" | "review" | "filed" | "processed" | "overdue";
  dueDate: string;
  filedDate?: string;
  acknowledgmentNumber?: string;
  refundAmount?: number;
  taxLiability: number;
  priority: "high" | "medium" | "low";
  assignedTo: string;
  completionPercentage: number;
  estimatedRefund?: number;
  totalIncome: number;
  documentsReceived: boolean;
  clientPAN: string;
  lastUpdated: string;
}

const TaxReturns = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workflow");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnTypeFilter, setReturnTypeFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedReturnType, setSelectedReturnType] = useState("");

  // Apple Design: Clean tax return data with CA workflow focus
  const taxReturns: TaxReturn[] = [
    {
      id: "1",
      clientName: "ABC Corporation",
      clientType: "Company",
      returnType: "ITR-6",
      assessmentYear: "2024-25",
      filingStatus: "in_progress",
      dueDate: "2024-07-31",
      taxLiability: 2500000,
      priority: "high",
      assignedTo: "You",
      completionPercentage: 75,
      totalIncome: 15000000,
      documentsReceived: true,
      clientPAN: "ABCDE1234F",
      lastUpdated: "2024-01-18"
    },
    {
      id: "2",
      clientName: "XYZ Industries Ltd",
      clientType: "Company",
      returnType: "ITR-6",
      assessmentYear: "2024-25",
      filingStatus: "review",
      dueDate: "2024-07-31",
      taxLiability: 1800000,
      priority: "high",
      assignedTo: "You",
      completionPercentage: 90,
      totalIncome: 12000000,
      documentsReceived: true,
      clientPAN: "XYZAB5678G",
      lastUpdated: "2024-01-17"
    },
    {
      id: "3",
      clientName: "Rajesh Kumar",
      clientType: "Individual",
      returnType: "ITR-2",
      assessmentYear: "2024-25",
      filingStatus: "draft",
      dueDate: "2024-07-31",
      taxLiability: 45000,
      priority: "medium",
      assignedTo: "You",
      completionPercentage: 25,
      estimatedRefund: 15000,
      totalIncome: 850000,
      documentsReceived: false,
      clientPAN: "DEFGH9012H",
      lastUpdated: "2024-01-16"
    },
    {
      id: "4",
      clientName: "Priya Sharma",
      clientType: "Individual",
      returnType: "ITR-1",
      assessmentYear: "2024-25",
      filingStatus: "filed",
      dueDate: "2024-07-31",
      filedDate: "2024-01-15",
      acknowledgmentNumber: "123456789012345",
      taxLiability: 0,
      priority: "low",
      assignedTo: "You",
      completionPercentage: 100,
      estimatedRefund: 25000,
      totalIncome: 650000,
      documentsReceived: true,
      clientPAN: "JKLMN7890J",
      lastUpdated: "2024-01-15"
    },
    {
      id: "5",
      clientName: "DEF Enterprises",
      clientType: "Partnership",
      returnType: "ITR-5",
      assessmentYear: "2024-25",
      filingStatus: "overdue",
      dueDate: "2024-07-31",
      taxLiability: 350000,
      priority: "high",
      assignedTo: "You",
      completionPercentage: 60,
      totalIncome: 3500000,
      documentsReceived: true,
      clientPAN: "GHIJK3456I",
      lastUpdated: "2024-01-10"
    },
    {
      id: "6",
      clientName: "GHI Services LLP",
      clientType: "LLP",
      returnType: "ITR-5",
      assessmentYear: "2024-25",
      filingStatus: "processed",
      dueDate: "2024-07-31",
      filedDate: "2024-01-12",
      acknowledgmentNumber: "987654321098765",
      taxLiability: 120000,
      priority: "medium",
      assignedTo: "You",
      completionPercentage: 100,
      totalIncome: 2800000,
      documentsReceived: true,
      clientPAN: "MNOPQ4567K",
      lastUpdated: "2024-01-12"
    }
  ];

  // Apple Design: Clean summary with CA-friendly metrics
  const returnsSummary = {
    total: taxReturns.length,
    draft: taxReturns.filter(r => r.filingStatus === "draft").length,
    inProgress: taxReturns.filter(r => r.filingStatus === "in_progress").length,
    filed: taxReturns.filter(r => r.filingStatus === "filed").length,
    overdue: taxReturns.filter(r => r.filingStatus === "overdue").length,
    totalTaxLiability: taxReturns.reduce((sum, r) => sum + r.taxLiability, 0),
    totalRefunds: taxReturns.reduce((sum, r) => sum + (r.estimatedRefund || 0), 0),
    avgCompletion: Math.round(taxReturns.reduce((sum, r) => sum + r.completionPercentage, 0) / taxReturns.length),
    documentsReceived: taxReturns.filter(r => r.documentsReceived).length
  };

  // Apple Design: Status and priority color systems
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "review": return "bg-purple-100 text-purple-800 border-purple-200";
      case "filed": return "bg-green-100 text-green-800 border-green-200";
      case "processed": return "bg-green-100 text-green-800 border-green-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Edit className="w-4 h-4 text-gray-600" />;
      case "in_progress": return <Activity className="w-4 h-4 text-blue-600" />;
      case "review": return <Eye className="w-4 h-4 text-purple-600" />;
      case "filed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processed": return <FileCheck className="w-4 h-4 text-green-600" />;
      case "overdue": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getReturnTypeIcon = (returnType: string) => {
    switch (returnType) {
      case "ITR-1": return <User className="w-4 h-4 text-green-600" />;
      case "ITR-2": return <User className="w-4 h-4 text-blue-600" />;
      case "ITR-3": return <User className="w-4 h-4 text-purple-600" />;
      case "ITR-4": return <Building className="w-4 h-4 text-orange-600" />;
      case "ITR-5": return <Users className="w-4 h-4 text-red-600" />;
      case "ITR-6": return <Building2 className="w-4 h-4 text-blue-600" />;
      case "ITR-7": return <Shield className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getClientTypeIcon = (clientType: string) => {
    switch (clientType) {
      case "Individual": return <User className="w-4 h-4 text-green-600" />;
      case "Company": return <Building2 className="w-4 h-4 text-blue-600" />;
      case "Partnership": return <Users className="w-4 h-4 text-purple-600" />;
      case "LLP": return <Briefcase className="w-4 h-4 text-orange-600" />;
      case "Trust": return <Shield className="w-4 h-4 text-indigo-600" />;
      default: return <Building className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleReturnAction = (action: string, returnId: string) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    toast({
      title: `${action} - ${taxReturn?.clientName}`,
      description: `${action} action initiated for ${taxReturn?.returnType}`,
    });
  };

  const handleStartReturn = () => {
    if (!selectedClient || !selectedReturnType) {
      toast({
        title: "Missing Information",
        description: "Please select both client and return type",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "New Return Started",
      description: `Starting ${selectedReturnType} for ${selectedClient}`,
    });
  };

  const TaxReturnCard = ({ taxReturn }: { taxReturn: TaxReturn }) => (
    <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-1 h-12 rounded-full ${getPriorityColor(taxReturn.priority)}`} />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                {getClientTypeIcon(taxReturn.clientType)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-900 text-lg">{taxReturn.clientName}</h3>
                <p className="text-sm text-gray-600">{taxReturn.clientType} • {taxReturn.returnType}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReturnAction("Continue", taxReturn.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <PlayCircle className="w-4 h-4 mr-1" />
              Continue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReturnAction("View", taxReturn.id)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">PAN: {taxReturn.clientPAN}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Due: {taxReturn.dueDate}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Income: ₹{(taxReturn.totalIncome / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Tax: ₹{(taxReturn.taxLiability / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${getStatusColor(taxReturn.filingStatus)} text-xs font-medium`}>
            {getStatusIcon(taxReturn.filingStatus)}
            <span className="ml-1">{taxReturn.filingStatus.replace('_', ' ').toUpperCase()}</span>
          </Badge>
          {taxReturn.documentsReceived && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <CheckSquare className="w-3 h-3 mr-1" />
              Docs Received
            </Badge>
          )}
          {taxReturn.estimatedRefund && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              <IndianRupee className="w-3 h-3 mr-1" />
              Refund Expected
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completion Progress</span>
            <span className="text-sm font-medium text-gray-900">{taxReturn.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                taxReturn.completionPercentage === 100 ? 'bg-green-500' : 
                taxReturn.completionPercentage > 75 ? 'bg-blue-500' :
                taxReturn.completionPercentage > 50 ? 'bg-yellow-500' :
                taxReturn.completionPercentage > 25 ? 'bg-orange-500' : 'bg-gray-400'
              }`}
              style={{ width: `${taxReturn.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Last Updated: {taxReturn.lastUpdated}</span>
            {taxReturn.acknowledgmentNumber && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                ACK: {taxReturn.acknowledgmentNumber.slice(-6)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filteredReturns = taxReturns.filter(taxReturn => {
    const matchesSearch = taxReturn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         taxReturn.clientPAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         taxReturn.returnType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || taxReturn.filingStatus === statusFilter;
    const matchesReturnType = returnTypeFilter === "all" || taxReturn.returnType === returnTypeFilter;
    return matchesSearch && matchesStatus && matchesReturnType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Apple Design: Clean, minimal header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tax Returns</h1>
              <p className="text-gray-500 mt-1 font-medium">Manage income tax return filing and compliance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search returns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-white/90 backdrop-blur-sm border-gray-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/90 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStartReturn}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Return
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Tax return summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{returnsSummary.total}</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{returnsSummary.inProgress}</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Filed</p>
                  <p className="text-2xl font-bold text-green-600">{returnsSummary.filed}</p>
                </div>
                <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{returnsSummary.overdue}</p>
                </div>
                <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apple Design: CA workflow-focused tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="workflow" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Filing Workflow
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Client Returns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="mt-6">
            <div className="space-y-8">
              {/* Critical - Overdue Returns */}
              {returnsSummary.overdue > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-red-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">Overdue Returns</h2>
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      {returnsSummary.overdue}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReturns.filter(r => r.filingStatus === "overdue").map((taxReturn) => (
                      <TaxReturnCard key={taxReturn.id} taxReturn={taxReturn} />
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Returns */}
              {returnsSummary.inProgress > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {returnsSummary.inProgress}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReturns.filter(r => r.filingStatus === "in_progress").map((taxReturn) => (
                      <TaxReturnCard key={taxReturn.id} taxReturn={taxReturn} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ready for Review */}
              {filteredReturns.filter(r => r.filingStatus === "review").length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">Ready for Review</h2>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {filteredReturns.filter(r => r.filingStatus === "review").length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReturns.filter(r => r.filingStatus === "review").map((taxReturn) => (
                      <TaxReturnCard key={taxReturn.id} taxReturn={taxReturn} />
                    ))}
                  </div>
                </div>
              )}

              {/* Draft Returns */}
              {returnsSummary.draft > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gray-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">Draft Returns</h2>
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      {returnsSummary.draft}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReturns.filter(r => r.filingStatus === "draft").map((taxReturn) => (
                      <TaxReturnCard key={taxReturn.id} taxReturn={taxReturn} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReturns.map((taxReturn) => (
                <TaxReturnCard key={taxReturn.id} taxReturn={taxReturn} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Filing Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Completion</span>
                    <span className="text-sm font-bold text-gray-900">{returnsSummary.avgCompletion}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents Received</span>
                    <span className="text-sm font-bold text-gray-900">{returnsSummary.documentsReceived}/{returnsSummary.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tax Liability</span>
                    <span className="text-sm font-bold text-gray-900">₹{(returnsSummary.totalTaxLiability / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expected Refunds</span>
                    <span className="text-sm font-bold text-green-600">₹{(returnsSummary.totalRefunds / 1000).toFixed(0)}K</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Return Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["ITR-1", "ITR-2", "ITR-3", "ITR-4", "ITR-5", "ITR-6", "ITR-7"].map(returnType => {
                    const count = taxReturns.filter(r => r.returnType === returnType).length;
                    if (count === 0) return null;
                    return (
                      <div key={returnType} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getReturnTypeIcon(returnType)}
                          <span className="text-sm font-medium text-gray-900">{returnType}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxReturns;