import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Upload,
  Signature,
  Key,
  Smartphone,
  Computer,
  Lock,
  Users,
  Calendar,
  RefreshCw,
  Settings,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const DigitalSignature = () => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [signingMethod, setSigningMethod] = useState("");
  const [signingProgress, setSigningProgress] = useState(0);
  const [isSigning, setIsSigning] = useState(false);

  const pendingDocuments = [
    {
      id: 1,
      name: "Income Tax Return - ABC Corp",
      type: "ITR",
      client: "ABC Corporation",
      dueDate: "2024-01-25",
      priority: "high",
      status: "ready_to_sign",
      signatories: ["CA Mehta", "Client Representative"],
      pages: 15,
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Audit Report - XYZ Ltd",
      type: "Audit Report",
      client: "XYZ Industries Ltd",
      dueDate: "2024-01-22",
      priority: "medium",
      status: "pending_review",
      signatories: ["CA Mehta", "Partner"],
      pages: 45,
      size: "5.2 MB"
    },
    {
      id: 3,
      name: "GST Return - DEF Enterprises",
      type: "GST Return",
      client: "DEF Enterprises",
      dueDate: "2024-01-20",
      priority: "high",
      status: "ready_to_sign",
      signatories: ["CA Mehta"],
      pages: 8,
      size: "1.1 MB"
    }
  ];

  const signedDocuments = [
    {
      id: 1,
      name: "TDS Return - Q3 2023",
      type: "TDS Return",
      client: "ABC Corporation",
      signedDate: "2024-01-15",
      signedBy: "CA Mehta",
      method: "DSC",
      status: "submitted",
      certificateId: "DSC-2024-001"
    },
    {
      id: 2,
      name: "Annual Filing - PQR Ltd",
      type: "ROC Filing",
      client: "PQR Limited",
      signedDate: "2024-01-12",
      signedBy: "CA Mehta",
      method: "Aadhaar eSign",
      status: "submitted",
      certificateId: "ESIGN-2024-002"
    }
  ];

  const certificates = [
    {
      id: 1,
      name: "CA Mehta - Class 3 DSC",
      type: "DSC",
      issuer: "eMudhra",
      validFrom: "2023-06-01",
      validTo: "2025-05-31",
      status: "active",
      usageCount: 145,
      serialNumber: "ABC123DEF456"
    },
    {
      id: 2,
      name: "Aadhaar eSign - Registered",
      type: "Aadhaar eSign",
      issuer: "NIC",
      validFrom: "2023-01-01",
      validTo: "2025-12-31",
      status: "active",
      usageCount: 67,
      serialNumber: "ESIGN789XYZ"
    }
  ];

  const handleDocumentSign = (documentId: number, method: string) => {
    if (!method) {
      toast({
        title: "⚠️ Select Signing Method",
        description: "Please choose either DSC or Aadhaar eSign",
        variant: "destructive"
      });
      return;
    }

    setIsSigning(true);
    setSigningProgress(0);

    // Show initial signing toast
    toast({
      title: "🔐 Digital Signing Started",
      description: `Initiating ${method} signing process...`,
    });

    const stages = [
      { progress: 25, message: "🔍 Validating certificate..." },
      { progress: 50, message: "📝 Preparing document..." },
      { progress: 75, message: "🔒 Applying digital signature..." },
      { progress: 100, message: "✅ Signature applied successfully!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setSigningProgress(stage.progress);
        
        toast({
          title: stage.message,
          description: `${stage.progress}% complete`,
        });
        
        currentStage++;
      } else {
        clearInterval(interval);
        setIsSigning(false);
        toast({
          title: "🎉 Document Signed Successfully!",
          description: `Document signed using ${method} and ready for submission. Certificate ID: ${method === 'DSC' ? 'DSC-2024-' + Math.floor(Math.random() * 1000) : 'ESIGN-2024-' + Math.floor(Math.random() * 1000)}`,
        });
      }
    }, 1000);
  };

  const handleBulkSign = () => {
    const readyDocs = pendingDocuments.filter(doc => doc.status === 'ready_to_sign');
    if (readyDocs.length === 0) {
      toast({
        title: "⚠️ No Documents Ready",
        description: "No documents are ready for signing",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "🚀 Bulk Signing Initiated",
      description: `Signing ${readyDocs.length} documents using batch processing. Estimated time: ${readyDocs.length * 30} seconds`,
    });

    // Simulate bulk signing progress
    setTimeout(() => {
      toast({
        title: "✅ Bulk Signing Complete!",
        description: `All ${readyDocs.length} documents have been signed successfully. Ready for submission.`,
      });
    }, 3000);
  };

  const handleCertificateRenewal = (certId: number) => {
    toast({
      title: "Certificate Renewal",
      description: "Certificate renewal process initiated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_to_sign": return "bg-green-100 text-green-800";
      case "pending_review": return "bg-yellow-100 text-yellow-800";
      case "signed": return "bg-blue-100 text-blue-800";
      case "submitted": return "bg-purple-100 text-purple-800";
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

  const getCertificateStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expiring": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digital Signature Center</h1>
              <p className="text-gray-600 mt-1">Secure document signing with DSC and Aadhaar eSign</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBulkSign}>
                <Signature className="w-4 h-4 mr-2" />
                Bulk Sign
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
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    {pendingDocuments.length}
                  </CardTitle>
                  <CardDescription>Pending Signatures</CardDescription>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-600">
                    {signedDocuments.length}
                  </CardTitle>
                  <CardDescription>Signed Today</CardDescription>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-600">
                    {certificates.length}
                  </CardTitle>
                  <CardDescription>Active Certificates</CardDescription>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-600">
                    {certificates.reduce((sum, cert) => sum + cert.usageCount, 0)}
                  </CardTitle>
                  <CardDescription>Total Signatures</CardDescription>
                </div>
                <Signature className="w-8 h-8 text-purple-600" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Signing Process */}
        {isSigning && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Signing Document...</span>
                  <span className="text-sm text-gray-500">{signingProgress}%</span>
                </div>
                <Progress value={signingProgress} className="h-2" />
                <p className="text-sm text-gray-600">
                  Applying digital signature using secure certificate...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Documents</TabsTrigger>
            <TabsTrigger value="signed">Signed Documents</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-6">
              {pendingDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{doc.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{doc.client}</p>
                          <div className="flex items-center space-x-4 mb-3">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(doc.priority)}>
                              {doc.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Due: {doc.dueDate}</span>
                            <span>Pages: {doc.pages}</span>
                            <span>Size: {doc.size}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Signatories: </span>
                            <span className="text-sm">{doc.signatories.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                          {doc.status === 'ready_to_sign' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="w-full">
                                  <Signature className="w-4 h-4 mr-1" />
                                  Sign Document
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Sign Document</DialogTitle>
                                  <DialogDescription>
                                    Choose your preferred signing method
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="signing-method">Signing Method</Label>
                                    <Select value={signingMethod} onValueChange={setSigningMethod}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose signing method" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="dsc">
                                          <div className="flex items-center space-x-2">
                                            <Key className="w-4 h-4" />
                                            <span>Digital Signature Certificate (DSC)</span>
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="aadhaar">
                                          <div className="flex items-center space-x-2">
                                            <Smartphone className="w-4 h-4" />
                                            <span>Aadhaar eSign</span>
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Alert>
                                    <Shield className="h-4 w-4" />
                                    <AlertDescription>
                                      Your signature will be legally binding and compliant with IT Act 2000.
                                    </AlertDescription>
                                  </Alert>
                                  <div className="flex space-x-2">
                                    <Button 
                                      className="flex-1"
                                      onClick={() => handleDocumentSign(doc.id, signingMethod)}
                                    >
                                      <Signature className="w-4 h-4 mr-2" />
                                      Sign Now
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signed">
            <Card>
              <CardHeader>
                <CardTitle>Recently Signed Documents</CardTitle>
                <CardDescription>
                  Documents that have been digitally signed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">{doc.client}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">Signed by: {doc.signedBy}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">Method: {doc.method}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">Date: {doc.signedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <div className="space-y-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          {cert.type === 'DSC' ? (
                            <Key className="w-6 h-6 text-white" />
                          ) : (
                            <Smartphone className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{cert.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Issuer: {cert.issuer}</p>
                          <div className="flex items-center space-x-4 mb-3">
                            <Badge className={getCertificateStatusColor(cert.status)}>
                              {cert.status}
                            </Badge>
                            <span className="text-sm text-gray-500">Used: {cert.usageCount} times</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Valid: {cert.validFrom} to {cert.validTo}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Serial: </span>
                            <span className="text-sm font-mono">{cert.serialNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="space-y-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCertificateRenewal(cert.id)}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Renew
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Signature Preferences</CardTitle>
                  <CardDescription>
                    Configure your default signing settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="default-method">Default signing method</Label>
                        <p className="text-sm text-gray-600">Choose your preferred signing method</p>
                      </div>
                      <Select defaultValue="dsc">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dsc">DSC</SelectItem>
                          <SelectItem value="aadhaar">Aadhaar eSign</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-timestamp">Auto-timestamp documents</Label>
                        <p className="text-sm text-gray-600">Automatically add timestamps to signed documents</p>
                      </div>
                      <input type="checkbox" id="auto-timestamp" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="backup-cert">Backup certificates</Label>
                        <p className="text-sm text-gray-600">Automatically backup certificate files</p>
                      </div>
                      <input type="checkbox" id="backup-cert" defaultChecked className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pin-required">PIN verification required</Label>
                        <p className="text-sm text-gray-600">Require PIN for each signature</p>
                      </div>
                      <input type="checkbox" id="pin-required" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout">Session timeout</Label>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

export default DigitalSignature; 