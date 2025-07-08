import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Building,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet,
  Archive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Share,
  Settings,
  MoreVertical,
  Tag,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Paperclip,
  Shield,
  CloudUpload,
  HardDrive
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: "PDF" | "Excel" | "Word" | "Image" | "Other";
  category: "Tax Returns" | "GST" | "TDS" | "Bank Statements" | "Compliance" | "Audit" | "Invoices" | "Others";
  client: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: "uploaded" | "processed" | "reviewed" | "approved" | "rejected";
  tags: string[];
  description: string;
  lastModified: string;
  isStarred: boolean;
  version: number;
}

const DocumentCenter = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Apple Design: Priority-focused document stats
  const documentStats = [
    {
      title: "Total Documents",
      value: "1,247",
      color: "text-blue-500",
      icon: FileText,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      trend: "+23 this week"
    },
    {
      title: "Pending Review",
      value: "34",
      color: "text-amber-500",
      icon: Clock,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      trend: "12 due today"
    },
    {
      title: "Approved",
      value: "1,156",
      color: "text-green-500",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      trend: "92.7% approval rate"
    },
    {
      title: "Storage Used",
      value: "8.4 GB",
      color: "text-purple-500",
      icon: HardDrive,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      trend: "of 50 GB limit"
    }
  ];

  // Sample document data with priority classification
  const documents = [
    {
      id: "1",
      name: "ABC Corp Annual Returns FY2023-24.pdf",
      type: "Annual Returns",
      client: "ABC Corporation",
      uploadDate: "2024-01-18",
      size: "2.4 MB",
      status: "approved",
      priority: "high",
      category: "Compliance",
      lastModified: "2 hours ago",
      author: "CA Rajesh Kumar",
      tags: ["Annual Return", "ROC Filing", "Companies Act"],
      downloadCount: 12,
      version: "v2.1"
    },
    {
      id: "2",
      name: "XYZ Industries GST Return Dec 2023.xlsx",
      type: "GST Returns",
      client: "XYZ Industries Ltd",
      uploadDate: "2024-01-15",
      size: "856 KB",
      status: "pending_review",
      priority: "critical",
      category: "Tax Returns",
      lastModified: "1 day ago",
      author: "CA Priya Sharma",
      tags: ["GST Return", "GSTR-3B", "Monthly Filing"],
      downloadCount: 5,
      version: "v1.0"
    },
    {
      id: "3",
      name: "Rajesh Kumar Income Tax Return AY2023-24.pdf",
      type: "Income Tax",
      client: "Rajesh Kumar",
      uploadDate: "2024-01-12",
      size: "1.2 MB",
      status: "approved",
      priority: "medium",
      category: "Tax Returns",
      lastModified: "3 days ago",
      author: "CA Amit Gupta",
      tags: ["ITR-1", "Salary Income", "Individual"],
      downloadCount: 8,
      version: "v1.2"
    },
    {
      id: "4",
      name: "DEF Enterprises Audit Report FY2023.pdf",
      type: "Audit Report",
      client: "DEF Enterprises",
      uploadDate: "2024-01-10",
      size: "4.8 MB",
      status: "draft",
      priority: "high",
      category: "Audit",
      lastModified: "5 days ago",
      author: "CA Neha Patel",
      tags: ["Statutory Audit", "Financial Statements", "Companies Act"],
      downloadCount: 3,
      version: "v0.9"
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", count: 1247 },
    { id: "tax-returns", name: "Tax Returns", count: 456 },
    { id: "compliance", name: "Compliance", count: 234 },
    { id: "audit", name: "Audit Documents", count: 189 },
    { id: "financial", name: "Financial Statements", count: 156 },
    { id: "contracts", name: "Contracts & Agreements", count: 89 },
    { id: "invoices", name: "Invoices & Bills", count: 123 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
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

  const getFileIcon = (type: string) => {
    if (type.includes("PDF") || type.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes("Excel") || type.includes("xlsx")) return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    if (type.includes("Word") || type.includes("docx")) return <File className="w-6 h-6 text-blue-500" />;
    if (type.includes("Image")) return <Image className="w-6 h-6 text-purple-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category.toLowerCase().includes(selectedCategory.replace("-", " "));
    const matchesClient = selectedClient === "all" || doc.client === selectedClient;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesClient && matchesStatus;
  });

  // Apple Design: Group by priority
  const groupedDocuments = {
    critical: filteredDocuments.filter(doc => doc.priority === "critical"),
    high: filteredDocuments.filter(doc => doc.priority === "high"),
    medium: filteredDocuments.filter(doc => doc.priority === "medium"),
    low: filteredDocuments.filter(doc => doc.priority === "low")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Glassmorphism Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600 mt-1">Centralized document management hub</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Bulk Export
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Priority-focused stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {documentStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Apple Design: Clean sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apple Design: Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Apple Design: Clean filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg p-1 bg-gray-100">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Apple Design: Priority-grouped documents */}
            <div className="space-y-8">
              {Object.entries(groupedDocuments).map(([priority, docs]) => (
                docs.length > 0 && (
                  <div key={priority} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-amber-500' :
                        priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {priority} Priority ({docs.length})
                      </h2>
                    </div>

                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {docs.map((doc) => (
                          <Card key={doc.id} className={`${getPriorityColor(doc.priority)} border-l-4 bg-white border-gray-200 hover:shadow-lg transition-all duration-200`}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-3 mb-4">
                                {getFileIcon(doc.name)}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 truncate" title={doc.name}>
                                    {doc.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">{doc.client}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={`${getStatusColor(doc.status)} border text-xs`}>
                                      {doc.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{doc.size}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-1">
                                  {doc.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {doc.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{doc.lastModified}</span>
                                  <span>{doc.downloadCount} downloads</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="flex-1 border-gray-300 hover:bg-gray-50">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {docs.map((doc) => (
                          <Card key={doc.id} className={`${getPriorityColor(doc.priority)} border-l-4 bg-white border-gray-200 hover:shadow-md transition-all duration-200`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  {getFileIcon(doc.name)}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                      <span>{doc.client}</span>
                                      <span>{doc.size}</span>
                                      <span>{doc.lastModified}</span>
                                      <Badge className={`${getStatusColor(doc.status)} border text-xs`}>
                                        {doc.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600">Try adjusting your search or upload new documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCenter; 