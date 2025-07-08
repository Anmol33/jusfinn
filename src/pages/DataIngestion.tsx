import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File, 
  Archive,
  CloudUpload, 
  Check, 
  X, 
  Eye, 
  Download, 
  RefreshCw, 
  Bot,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Target,
  BarChart3,
  Settings,
  Zap,
  Shield,
  Database,
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Cpu,
  HardDrive,
  Layers
} from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: "uploading" | "processing" | "completed" | "failed" | "extracting";
  progress: number;
  client: string;
  category: string;
  extractedData?: {
    fields: number;
    accuracy: number;
    entities: string[];
    summary: string;
  };
  thumbnailUrl?: string;
  processingTime?: number;
  aiInsights?: string[];
}

const DataIngestion = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);

  // Sample uploaded files with AI processing results
  const sampleFiles: UploadedFile[] = [
    {
      id: "1",
      name: "ABC Corp Financial Statements Q4.pdf",
      type: "application/pdf",
      size: 2456789,
      uploadDate: "2024-01-18T10:30:00Z",
      status: "completed",
      progress: 100,
      client: "ABC Corporation",
      category: "Financial Statements",
      extractedData: {
        fields: 45,
        accuracy: 96.8,
        entities: ["Revenue", "Expenses", "Assets", "Liabilities", "Equity"],
        summary: "Q4 financial statements with revenue of ₹15.2Cr and net profit of ₹2.8Cr"
      },
      processingTime: 45,
      aiInsights: [
        "Revenue increased by 18% compared to Q3",
        "Working capital ratio improved to 2.3",
        "Identified 3 potential tax optimization opportunities"
      ]
    },
    {
      id: "2",
      name: "XYZ Industries Bank Statement Dec.pdf",
      type: "application/pdf",
      size: 1234567,
      uploadDate: "2024-01-17T15:45:00Z",
      status: "completed",
      progress: 100,
      client: "XYZ Industries Ltd",
      category: "Bank Statements",
      extractedData: {
        fields: 156,
        accuracy: 98.2,
        entities: ["Transactions", "Balance", "Credits", "Debits", "Interest"],
        summary: "December bank statement with 156 transactions totaling ₹8.5Cr"
      },
      processingTime: 32,
      aiInsights: [
        "Detected recurring vendor payments pattern",
        "Average daily balance maintained at ₹45L",
        "TDS deductions properly accounted"
      ]
    },
    {
      id: "3",
      name: "Rajesh Kumar Salary Certificate.jpg",
      type: "image/jpeg",
      size: 456789,
      uploadDate: "2024-01-16T09:20:00Z",
      status: "processing",
      progress: 75,
      client: "Rajesh Kumar",
      category: "Income Documents",
      extractedData: {
        fields: 12,
        accuracy: 94.5,
        entities: ["Basic Salary", "HRA", "PF", "TDS", "Net Pay"],
        summary: "Salary certificate for FY 2023-24 with annual CTC of ₹8.5L"
      },
      processingTime: 18
    },
    {
      id: "4",
      name: "DEF Enterprises GST Returns.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 789012,
      uploadDate: "2024-01-15T14:10:00Z",
      status: "failed",
      progress: 0,
      client: "DEF Enterprises",
      category: "GST Documents"
    }
  ];

  // AI Processing Statistics
  const processingStats = {
    totalProcessed: 1247,
    successRate: 96.4,
    avgProcessingTime: 38,
    dataFieldsExtracted: 15678,
    accuracyRate: 97.2,
    automationSavings: "234 hours"
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('image')) return <Image className="w-6 h-6 text-purple-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    if (type.includes('document') || type.includes('word')) return <File className="w-6 h-6 text-blue-500" />;
    return <Archive className="w-6 h-6 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading": return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "extracting": return "bg-purple-50 text-purple-700 border-purple-200";
      case "completed": return "bg-green-50 text-green-700 border-green-200";
      case "failed": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading": return <Upload className="w-4 h-4" />;
      case "processing": return <Bot className="w-4 h-4 animate-pulse" />;
      case "extracting": return <Sparkles className="w-4 h-4 animate-spin" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "failed": return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    // Apple Design: Intelligent file handling with immediate feedback
    const newFiles: UploadedFile[] = Array.from(fileList).map((file, index) => {
      // Smart category detection based on file name and type
      let smartCategory = selectedCategory || "General";
      const fileName = file.name.toLowerCase();
      
      if (fileName.includes('invoice') || fileName.includes('bill')) smartCategory = "Invoices";
      else if (fileName.includes('bank') || fileName.includes('statement')) smartCategory = "Bank Statements";
      else if (fileName.includes('receipt')) smartCategory = "Receipts";
      else if (fileName.includes('tax') || fileName.includes('itr')) smartCategory = "Tax Documents";
      else if (fileName.includes('gst')) smartCategory = "GST Documents";

      return {
        id: Date.now() + index + "",
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: "uploading",
        progress: 0,
        client: selectedClient || "Unassigned",
        category: smartCategory
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    // Apple Design: Staggered processing with smart feedback
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        simulateProcessing(file.id);
      }, index * 500); // Faster staggering for better UX
    });

    // Smart toast with file type detection
    const fileTypes = [...new Set(newFiles.map(f => {
      if (f.type.includes('pdf')) return 'PDF';
      if (f.type.includes('image')) return 'Image';
      if (f.type.includes('excel') || f.type.includes('spreadsheet')) return 'Excel';
      return 'Document';
    }))];

    toast({
      title: `🚀 ${newFiles.length} Files Processing`,
      description: `${fileTypes.join(', ')} files uploaded • AI extraction starting...`,
    });
  };

  const simulateProcessing = (fileId: string) => {
    // Apple Design: Progressive AI processing with contextual feedback
    const file = files.find(f => f.id === fileId) || allFiles.find(f => f.id === fileId);
    if (!file) return;

    const updateProgress = (progress: number, status: UploadedFile["status"]) => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress, status } : f
      ));
    };

    // Upload phase with Apple-style smooth progression
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 12; // Slightly faster for better perceived performance
      updateProgress(progress, "uploading");
      
      if (progress >= 100) {
        clearInterval(uploadInterval);
        
        // Show upload complete notification
        toast({
          title: `📤 Upload Complete: ${file.name}`,
          description: "Starting AI data extraction...",
        });
        
        // Processing phase with contextual updates
        setTimeout(() => {
          updateProgress(25, "processing");
          
          // Show AI processing start
          toast({
            title: `🤖 AI Processing: ${file.name}`,
            description: "Extracting data with 94.6% accuracy...",
          });
          
          const processingInterval = setInterval(() => {
            progress += 18; // Faster processing for better UX
            updateProgress(Math.min(progress, 95), "processing");
            
            if (progress >= 95) {
              clearInterval(processingInterval);
              updateProgress(100, "completed");
              
              // Smart data extraction based on file category
              const smartExtraction = {
                fields: file.category === "Invoices" ? Math.floor(Math.random() * 20) + 15 :
                        file.category === "Bank Statements" ? Math.floor(Math.random() * 30) + 25 :
                        Math.floor(Math.random() * 40) + 10,
                accuracy: Math.floor(Math.random() * 8) + 92, // Higher accuracy range
                entities: file.category === "Invoices" ? ["Invoice Number", "Amount", "Date", "Vendor", "GST"] :
                          file.category === "Bank Statements" ? ["Transaction ID", "Amount", "Date", "Description", "Balance"] :
                          ["Amount", "Date", "Description", "Category", "Reference"],
                summary: `AI extraction completed for ${file.category.toLowerCase()}`
              };

              // Add extracted data
              setFiles(prev => prev.map(f => 
                f.id === fileId ? {
                  ...f,
                  extractedData: smartExtraction,
                  processingTime: Math.floor(Math.random() * 45) + 15 // Realistic processing time
                } : f
              ));

              // Success notification with details
              toast({
                title: `✅ Processing Complete: ${file.name}`,
                description: `${smartExtraction.fields} fields extracted • ${smartExtraction.accuracy}% accuracy`,
              });
            }
          }, 600); // Smoother interval
        }, 800);
      }
    }, 180); // Smooth upload progression
  };

  const handleRetryProcessing = (fileId: string) => {
    // Apple Design: Smart retry with user feedback
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f
    ));
    
    toast({
      title: `🔄 Retrying: ${file.name}`,
      description: "Re-processing with enhanced AI algorithms...",
    });
    
    simulateProcessing(fileId);
  };

  const handleDeleteFile = (fileId: string) => {
    // Apple Design: Contextual deletion with file details
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setFiles(prev => prev.filter(f => f.id !== fileId));
    
    toast({
      title: `🗑️ Removed: ${file.name}`,
      description: `${file.category} file removed from ${file.client} queue`,
      variant: "destructive"
    });
  };

  const allFiles = [...sampleFiles, ...files];
  const filteredFiles = allFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Apple Design: Clean header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Upload Files</h1>
              <p className="text-gray-600 mt-1">AI-powered document processing and data extraction</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                AI Settings
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Clean summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">AI Accuracy</p>
                  <p className="text-2xl font-semibold text-gray-900">{processingStats.accuracyRate}%</p>
                </div>
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Documents Processed</p>
                  <p className="text-2xl font-semibold text-gray-900">{processingStats.totalProcessed}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Saved</p>
                  <p className="text-2xl font-semibold text-green-600">{processingStats.automationSavings}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="upload" className="rounded-md">Upload Files</TabsTrigger>
            <TabsTrigger value="processing" className="rounded-md">Processing Queue</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-md">Completed</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-md">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Apple Design: Clean upload interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Upload Documents</CardTitle>
                    <CardDescription>Drag and drop files or click to browse. AI will automatically extract and process data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <CloudUpload className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {dragActive ? 'Drop files here' : 'Upload your documents'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Support for PDF, Excel, Word, Images (max 10MB each)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                      />
                      <label htmlFor="file-upload">
                        <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                          <Plus className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </label>
                    </div>

                    {/* Client and Category Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <Label htmlFor="client">Assign to Client</Label>
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ABC Corporation">ABC Corporation</SelectItem>
                            <SelectItem value="XYZ Industries Ltd">XYZ Industries Ltd</SelectItem>
                            <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                            <SelectItem value="DEF Enterprises">DEF Enterprises</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Document Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Financial Statements">Financial Statements</SelectItem>
                            <SelectItem value="Bank Statements">Bank Statements</SelectItem>
                            <SelectItem value="Tax Documents">Tax Documents</SelectItem>
                            <SelectItem value="GST Documents">GST Documents</SelectItem>
                            <SelectItem value="Income Documents">Income Documents</SelectItem>
                            <SelectItem value="Compliance Documents">Compliance Documents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">AI Processing Power</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Smart Data Extraction</p>
                        <p className="text-sm text-blue-600">Automatically identifies key fields</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Data Validation</p>
                        <p className="text-sm text-green-600">Real-time accuracy checking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">Fast Processing</p>
                        <p className="text-sm text-purple-600">Average 30 seconds per document</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Processing Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Clear, high-resolution images work best</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>PDF files should be text-searchable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Excel files maintain original formatting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Batch upload saves time</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Processing Queue</h2>
                <p className="text-gray-600">Files currently being processed by AI</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFiles.filter(f => f.status !== "completed").map((file) => (
                <Card key={file.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                          <Badge className={`${getStatusColor(file.status)} border`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(file.status)}
                              <span>{file.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>Client: {file.client}</div>
                          <div>Category: {file.category}</div>
                          <div>Size: {formatFileSize(file.size)}</div>
                          <div>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {file.status === "uploading" ? "Uploading..." : 
                               file.status === "processing" ? "AI Processing..." :
                               file.status === "extracting" ? "Extracting Data..." :
                               file.status === "failed" ? "Processing Failed" : "Processing"}
                            </span>
                            <span className="font-medium">{file.progress}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>

                        {file.extractedData && file.status === "processing" && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Fields Found</span>
                              <p className="font-medium text-gray-900">{file.extractedData.fields}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Accuracy</span>
                              <p className="font-medium text-gray-900">{file.extractedData.accuracy}%</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Processing Time</span>
                              <p className="font-medium text-gray-900">{file.processingTime}s</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Entities</span>
                              <p className="font-medium text-gray-900">{file.extractedData.entities.length}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.status === "failed" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleRetryProcessing(file.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-300"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Completed Processing</h2>
                <p className="text-gray-600">Successfully processed documents with extracted data</p>
              </div>
              <Button variant="outline" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFiles.filter(f => f.status === "completed").map((file) => (
                <Card key={file.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{file.client} • {file.category}</p>
                        
                        {file.extractedData && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Accuracy</span>
                                <p className="font-medium text-green-600">{file.extractedData.accuracy}%</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Fields</span>
                                <p className="font-medium text-gray-900">{file.extractedData.fields}</p>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Summary</span>
                              <p className="text-sm text-gray-700 mt-1">{file.extractedData.summary}</p>
                            </div>
                            
                            <div>
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Entities</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {file.extractedData.entities.map((entity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {entity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                        <Eye className="w-4 h-4 mr-2" />
                        View Data
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Processing Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-semibold text-green-600">{processingStats.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Processing Time</span>
                      <span className="font-semibold">{processingStats.avgProcessingTime}s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Data Fields Extracted</span>
                      <span className="font-semibold">{processingStats.dataFieldsExtracted.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Savings</span>
                      <span className="font-semibold text-blue-600">{processingStats.automationSavings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Document Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Financial Statements", "Bank Statements", "Tax Documents", "GST Documents", "Income Documents"].map((category, index) => {
                      const count = Math.floor(Math.random() * 20) + 5;
                      const percentage = Math.floor(Math.random() * 30) + 10;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{count}</span>
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Recent Insights</h4>
                    {sampleFiles.filter(f => f.aiInsights).map((file) => (
                      <div key={file.id} className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        {file.aiInsights?.map((insight, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">System Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Consider batch processing during off-peak hours for better performance</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Some documents may benefit from higher resolution scanning</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Processing accuracy has improved by 12% this month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataIngestion; 