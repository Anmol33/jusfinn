import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Upload,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Send,
  Plus,
  Bot,
  Shield,
  Building,
  User,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface NoticeData {
  id: string;
  noticeNumber: string;
  clientName: string;
  noticeType: string;
  receivedDate: string;
  responseDate: string;
  status: string;
  priority: string;
  assessmentYear: string;
  taxDemand: string;
  officer: string;
  lastAction: string;
  daysLeft: number;
}

const NoticeResponse = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState("");
  const [uploadedNotice, setUploadedNotice] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Apple Design: Clean, minimal stats
  const quickStats = [
    { title: "Active Notices", value: "8", icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-50", borderColor: "border-red-100" },
    { title: "Resolved", value: "43", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-50", borderColor: "border-green-100" },
    { title: "AI Accuracy", value: "96%", icon: Bot, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-100" },
    { title: "Avg Response Time", value: "2.4 days", icon: Clock, color: "text-gray-500", bgColor: "bg-gray-50", borderColor: "border-gray-100" }
  ];

  const clients = [
    { id: 1, name: "ABC Corporation", pan: "ABCDE1234F", type: "Company" },
    { id: 2, name: "XYZ Industries Ltd", pan: "XYZAB5678G", type: "Company" },
    { id: 3, name: "Rajesh Kumar", pan: "DEFGH9012H", type: "Individual" },
    { id: 4, name: "Priya Sharma", pan: "JKLMN7890J", type: "Individual" }
  ];

  const noticesData: NoticeData[] = [
    {
      id: "1",
      noticeNumber: "ITNS281/AO/2024/001",
      clientName: "ABC Corporation",
      noticeType: "Section 143(2) Scrutiny",
      receivedDate: "2024-01-15",
      responseDate: "2024-01-30",
      status: "Response Due",
      priority: "high",
      assessmentYear: "2023-24",
      taxDemand: "₹2,50,000",
      officer: "AO Ward 5(1)",
      lastAction: "Notice uploaded",
      daysLeft: 8
    },
    {
      id: "2",
      noticeNumber: "ITNS281/AO/2024/002",
      clientName: "XYZ Industries Ltd",
      noticeType: "Section 148 Reassessment",
      receivedDate: "2024-01-10",
      responseDate: "2024-01-25",
      status: "Under Review",
      priority: "medium",
      assessmentYear: "2022-23",
      taxDemand: "₹1,25,000",
      officer: "AO Ward 3(2)",
      lastAction: "Response submitted",
      daysLeft: 3
    },
    {
      id: "3",
      noticeNumber: "ITNS281/AO/2024/003",
      clientName: "Rajesh Kumar",
      noticeType: "Section 142(1) Enquiry",
      receivedDate: "2024-01-05",
      responseDate: "2024-01-20",
      status: "Awaiting Reply",
      priority: "low",
      assessmentYear: "2023-24",
      taxDemand: "₹45,000",
      officer: "AO Ward 2(3)",
      lastAction: "Additional documents requested",
      daysLeft: -2
    }
  ];

  const handleNoticeUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedNotice(file);
      setIsAnalyzing(true);
      setAnalysisProgress(0);

      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAnalyzing(false);
            toast({
              title: "Analysis Complete",
              description: "Notice analyzed successfully with 94.6% confidence",
            });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleGenerateResponse = () => {
    if (!selectedClient) {
      toast({
        title: "Select Client",
        description: "Please select a client before generating response",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AI Processing",
      description: "Analyzing notice and generating comprehensive response...",
    });

    setTimeout(() => {
      const clientName = clients.find(c => c.id.toString() === selectedClient)?.name || "Client";
      const response = `AI-Generated Response to Income Tax Notice

Subject: Response to Notice u/s 143(2) - Scrutiny Assessment - AY 2023-24
Client: ${clientName}

Dear Assessing Officer,

With reference to your notice dated 15th January 2024, we submit the following response:

AI ANALYSIS SUMMARY:
- Notice Type: Section 143(2) Scrutiny Notice
- Key Queries Identified: 3
- Evidence Documents Auto-Collated: 12
- Confidence Level: 94.6%

QUERY 1: TDS Credit Discrepancy
Evidence: Form 26AS, Form 16A (x5), Bank Statements
Response: Difference due to late receipt of one Form 16A. Corrected computation attached.

QUERY 2: Business Expenses Verification
Evidence: Professional service invoices, CA certificates, payment proofs
Response: All expenses genuine and supported by proper documentation.

QUERY 3: Capital Gains Computation
Evidence: Broker statements, purchase receipts, LTCG computation
Response: LTCG correctly computed and offered to tax.

We request you to accept our submissions and close the proceedings.

Yours faithfully,
[CA Name]
Chartered Accountant`;

      setGeneratedResponse(response);
      toast({
        title: "Response Generated",
        description: "AI has generated a comprehensive response based on the notice analysis",
      });
    }, 2000);
  };

  const handleSubmitResponse = () => {
    toast({
      title: "Response Submitted",
      description: "Your response has been submitted to the tax department",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Response Due": return "bg-red-50 text-red-700 border-red-200";
      case "Under Review": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Awaiting Reply": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-orange-500";
      case "low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 7) return "text-red-600";
    if (daysLeft <= 15) return "text-orange-600";
    return "text-green-600";
  };

  const filteredNotices = noticesData.filter(notice => {
    const matchesSearch = notice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.noticeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.noticeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || notice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apple Design: Group notices by priority
  const groupedNotices = {
    critical: filteredNotices.filter(n => n.priority === "high"),
    high: filteredNotices.filter(n => n.priority === "medium"),
    medium: filteredNotices.filter(n => n.priority === "low"),
    low: filteredNotices.filter(n => n.priority === "low")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Glassmorphism Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notice Response</h1>
              <p className="text-gray-600 mt-1">AI-powered tax notice management</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Notice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Tax Notice</DialogTitle>
                  <DialogDescription>Upload the tax notice for AI analysis</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client-select">Select Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name} ({client.pan})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Drop your tax notice here or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleNoticeUpload(e.target.files)}
                      className="hidden"
                      id="notice-upload"
                    />
                    <label htmlFor="notice-upload">
                      <Button variant="outline" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </label>
                  </div>
                  {uploadedNotice && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">{uploadedNotice.name}</p>
                      <p className="text-xs text-blue-600">{(uploadedNotice.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600">AI Analysis in Progress...</span>
                        <span className="font-medium">{Math.round(analysisProgress)}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Priority-focused stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Apple Design: Clean search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notices by client name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Response Due">Response Due</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Awaiting Reply">Awaiting Reply</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apple Design: Priority-grouped notices */}
        <div className="space-y-8">
          {Object.entries(groupedNotices).map(([priority, notices]) => (
            notices.length > 0 && (
              <div key={priority} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    priority === 'critical' ? 'bg-red-500' :
                    priority === 'high' ? 'bg-amber-500' :
                    priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {priority} Priority ({notices.length})
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <Card key={notice.id} className={`${getPriorityColor(notice.priority)} border-l-4 bg-white border-gray-200 hover:shadow-md transition-all duration-200`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-gray-900">{notice.clientName}</h3>
                              <Badge className={`${getStatusColor(notice.status)} border`}>
                                {notice.status}
                              </Badge>
                              {notice.daysLeft > 0 && (
                                <span className={`text-sm font-medium ${getUrgencyColor(notice.daysLeft)}`}>
                                  {notice.daysLeft} days left
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div className="space-y-1">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Notice Number</p>
                                <p className="font-medium text-gray-900">{notice.noticeNumber}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Notice Type</p>
                                <p className="font-medium text-gray-900">{notice.noticeType}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Assessment Year</p>
                                <p className="font-medium text-gray-900">{notice.assessmentYear}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Tax Demand</p>
                                <p className="font-medium text-gray-900">{notice.taxDemand}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Generate Response
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
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

        {filteredNotices.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-600">Try adjusting your search or upload a new notice</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NoticeResponse; 