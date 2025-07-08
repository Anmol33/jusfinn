import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MessageSquare,
  Bell,
  Download,
  Eye,
  User,
  Building,
  Phone,
  Mail,
  IndianRupee,
  TrendingUp,
  Activity,
  Send,
  Paperclip,
  Shield,
  Settings,
  Plus,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ClientPortal = () => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Mock client data
  const clientInfo = {
    name: "ABC Corporation",
    pan: "ABCDE1234F",
    gstin: "07ABCDE1234F1Z5",
    type: "Private Limited",
    contactPerson: "Mr. Rajesh Kumar",
    email: "rajesh@abccorp.com",
    phone: "+91 9876543210",
    address: "123 Business Park, Mumbai, Maharashtra 400001"
  };

  const complianceStatus = {
    overallScore: 92,
    gstCompliance: 95,
    incomeTaxCompliance: 89,
    tdsCompliance: 94,
    rocCompliance: 90,
    lastUpdated: "2024-01-15"
  };

  const upcomingDeadlines = [
    { id: 1, task: "GST Return Filing", date: "2024-01-20", priority: "high", status: "pending" },
    { id: 2, task: "TDS Return Q3", date: "2024-01-31", priority: "medium", status: "in_progress" },
    { id: 3, task: "Income Tax Advance Payment", date: "2024-02-15", priority: "medium", status: "scheduled" }
  ];

  const recentDocuments = [
    { id: 1, name: "GST Return - December 2023", type: "GST Return", date: "2024-01-10", status: "submitted" },
    { id: 2, name: "TDS Certificate Q3", type: "TDS Certificate", date: "2024-01-08", status: "available" },
    { id: 3, name: "Income Tax Computation", type: "Tax Computation", date: "2024-01-05", status: "draft" }
  ];

  const messages = [
    {
      id: 1,
      from: "CA Mehta",
      subject: "GST Return Filing Update",
      content: "Your GST return for December 2023 has been filed successfully. The acknowledgment is attached.",
      timestamp: "2024-01-15 10:30 AM",
      read: false,
      attachments: 1
    },
    {
      id: 2,
      from: "CA Mehta",
      subject: "TDS Certificate Available",
      content: "Your TDS certificate for Q3 FY 2023-24 is now available for download.",
      timestamp: "2024-01-12 2:15 PM",
      read: true,
      attachments: 0
    }
  ];

  const notifications = [
    { id: 1, type: "deadline", message: "GST Return due in 5 days", timestamp: "2 hours ago" },
    { id: 2, type: "document", message: "New TDS certificate available", timestamp: "1 day ago" },
    { id: 3, type: "update", message: "Compliance score updated to 92%", timestamp: "3 days ago" }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Upload Complete",
            description: "Your documents have been uploaded successfully and sent to CA Mehta",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    toast({
      title: "Message Sent",
      description: "Your message has been sent to CA Mehta",
    });
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-green-100 text-green-800";
      case "available": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline": return <Clock className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "update": return <TrendingUp className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-gray-600 mt-1">Welcome back, {clientInfo.contactPerson}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications ({notifications.length})
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-600">
                    {complianceStatus.overallScore}%
                  </CardTitle>
                  <CardDescription>Overall Compliance</CardDescription>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-600">
                    {upcomingDeadlines.length}
                  </CardTitle>
                  <CardDescription>Upcoming Deadlines</CardDescription>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                1 high priority
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    {recentDocuments.length}
                  </CardTitle>
                  <CardDescription>Recent Documents</CardDescription>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                2 ready for download
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-600">
                    {messages.filter(m => !m.read).length}
                  </CardTitle>
                  <CardDescription>Unread Messages</CardDescription>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-purple-600 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                New from CA Mehta
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Upload Progress */}
        {isUploading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading documents...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-600">
                  Your documents are being securely uploaded to your CA...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{deadline.task}</p>
                          <p className="text-sm text-gray-600">Due: {deadline.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Badge className={getStatusColor(deadline.status)}>
                            {deadline.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Compliance Overview
                  </CardTitle>
                  <CardDescription>
                    Your current compliance status across all areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Overall Compliance Score</p>
                        <p className="text-sm text-gray-600">Last updated: {complianceStatus.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{complianceStatus.overallScore}%</p>
                        <p className="text-sm text-green-600">Excellent</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">GST Compliance</span>
                          <span className="text-sm text-gray-600">{complianceStatus.gstCompliance}%</span>
                        </div>
                        <Progress value={complianceStatus.gstCompliance} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Income Tax Compliance</span>
                          <span className="text-sm text-gray-600">{complianceStatus.incomeTaxCompliance}%</span>
                        </div>
                        <Progress value={complianceStatus.incomeTaxCompliance} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">TDS Compliance</span>
                          <span className="text-sm text-gray-600">{complianceStatus.tdsCompliance}%</span>
                        </div>
                        <Progress value={complianceStatus.tdsCompliance} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">ROC Compliance</span>
                          <span className="text-sm text-gray-600">{complianceStatus.rocCompliance}%</span>
                        </div>
                        <Progress value={complianceStatus.rocCompliance} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Document Center
                      </CardTitle>
                      <CardDescription>
                        Upload documents and access your files
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Documents
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Documents</DialogTitle>
                          <DialogDescription>
                            Select documents to upload to your CA
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-4">
                              Drop files here or click to browse
                            </p>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="hidden"
                              id="document-upload"
                            />
                            <label htmlFor="document-upload">
                              <Button variant="outline" className="cursor-pointer">
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Files
                              </Button>
                            </label>
                          </div>
                          <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                              All uploads are encrypted and secure. Your CA will be notified automatically.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Messages
                      </CardTitle>
                      <CardDescription>
                        Communicate with your CA
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 border rounded-lg ${!msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{msg.from}</p>
                              {!msg.read && <Badge variant="secondary">New</Badge>}
                              {msg.attachments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Paperclip className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">{msg.attachments}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium mt-1">{msg.subject}</p>
                            <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                          </div>
                          <span className="text-xs text-gray-500">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 border rounded-lg">
                    <Label htmlFor="message-input">Send Message</Label>
                    <Textarea
                      id="message-input"
                      placeholder="Type your message to CA Mehta..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-2"
                    />
                    <Button className="mt-3" onClick={handleSendMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Company Profile
                  </CardTitle>
                  <CardDescription>
                    Your company information and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" value={clientInfo.name} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="company-type">Company Type</Label>
                        <Input id="company-type" value={clientInfo.type} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pan">PAN</Label>
                        <Input id="pan" value={clientInfo.pan} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input id="gstin" value={clientInfo.gstin} readOnly />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input id="contact-person" value={clientInfo.contactPerson} readOnly />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={clientInfo.email} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={clientInfo.phone} readOnly />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" value={clientInfo.address} readOnly />
                    </div>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        To update your company information, please contact your CA or send a message through the portal.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortal; 