import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Eye, 
  Users, 
  FileText, 
  TrendingUp, 
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Target,
  Shield,
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Plus,
  RefreshCw,
  User,
  AlertCircle,
  FileCheck,
  Zap,
  BookOpen,
  MessageSquare,
  Bell,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AuditCommandCentre = () => {
  const { toast } = useToast();
  const [selectedAudit, setSelectedAudit] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");

  const teamMembers = [
    { id: 1, name: "CA Sharma", role: "Senior Auditor", expertise: "Statutory Audit", activeAudits: 3 },
    { id: 2, name: "CA Patel", role: "Tax Auditor", expertise: "Tax Audit", activeAudits: 2 },
    { id: 3, name: "CA Kumar", role: "Internal Auditor", expertise: "Internal Audit", activeAudits: 4 },
    { id: 4, name: "CA Singh", role: "Compliance Auditor", expertise: "Compliance Audit", activeAudits: 2 },
    { id: 5, name: "CA Verma", role: "IT Auditor", expertise: "Information Systems", activeAudits: 1 },
    { id: 6, name: "CA Mehta", role: "Risk Auditor", expertise: "Risk Assessment", activeAudits: 3 }
  ];

  const auditTypes = [
    { id: 1, name: "Statutory Audit", frequency: "Annual", complexity: "High" },
    { id: 2, name: "Tax Audit", frequency: "Annual", complexity: "Medium" },
    { id: 3, name: "Internal Audit", frequency: "Quarterly", complexity: "Medium" },
    { id: 4, name: "Compliance Audit", frequency: "Monthly", complexity: "Low" },
    { id: 5, name: "Information Systems Audit", frequency: "Bi-Annual", complexity: "High" },
    { id: 6, name: "Risk Assessment Audit", frequency: "Quarterly", complexity: "High" }
  ];

  const activeAudits = [
    { 
      id: 1, 
      client: "ABC Corp", 
      type: "Statutory Audit", 
      progress: 75, 
      status: "in-progress", 
      auditor: "CA Sharma",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      riskLevel: "medium",
      documentsReviewed: 156,
      totalDocuments: 200,
      findings: 3,
      recommendations: 8,
      materialMisstatements: 1,
      budget: "₹2,50,000",
      spent: "₹1,87,500"
    },
    { 
      id: 2, 
      client: "XYZ Ltd", 
      type: "Tax Audit", 
      progress: 40, 
      status: "in-progress", 
      auditor: "CA Patel",
      startDate: "2024-01-05",
      endDate: "2024-02-15",
      riskLevel: "low",
      documentsReviewed: 89,
      totalDocuments: 150,
      findings: 1,
      recommendations: 4,
      materialMisstatements: 0,
      budget: "₹1,50,000",
      spent: "₹60,000"
    },
    { 
      id: 3, 
      client: "DEF Industries", 
      type: "Internal Audit", 
      progress: 90, 
      status: "review", 
      auditor: "CA Kumar",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      riskLevel: "high",
      documentsReviewed: 298,
      totalDocuments: 320,
      findings: 8,
      recommendations: 15,
      materialMisstatements: 2,
      budget: "₹3,00,000",
      spent: "₹2,70,000"
    },
    { 
      id: 4, 
      client: "GHI Services", 
      type: "Compliance Audit", 
      progress: 25, 
      status: "planning", 
      auditor: "CA Singh",
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      riskLevel: "medium",
      documentsReviewed: 25,
      totalDocuments: 100,
      findings: 0,
      recommendations: 2,
      materialMisstatements: 0,
      budget: "₹1,00,000",
      spent: "₹25,000"
    },
    { 
      id: 5, 
      client: "JKL Enterprises", 
      type: "Information Systems Audit", 
      progress: 60, 
      status: "in-progress", 
      auditor: "CA Verma",
      startDate: "2024-01-03",
      endDate: "2024-02-28",
      riskLevel: "high",
      documentsReviewed: 178,
      totalDocuments: 250,
      findings: 6,
      recommendations: 12,
      materialMisstatements: 1,
      budget: "₹4,00,000",
      spent: "₹2,40,000"
    },
    { 
      id: 6, 
      client: "MNO Trading", 
      type: "Risk Assessment Audit", 
      progress: 85, 
      status: "review", 
      auditor: "CA Mehta",
      startDate: "2023-12-20",
      endDate: "2024-01-20",
      riskLevel: "medium",
      documentsReviewed: 189,
      totalDocuments: 200,
      findings: 4,
      recommendations: 9,
      materialMisstatements: 0,
      budget: "₹2,00,000",
      spent: "₹1,70,000"
    }
  ];

  const auditFindings = [
    {
      id: 1,
      auditId: 1,
      client: "ABC Corp",
      category: "Financial Reporting",
      severity: "high",
      finding: "Inadequate segregation of duties in accounts payable process",
      recommendation: "Implement proper segregation of duties and authorization controls",
      status: "open",
      assignedTo: "CA Sharma",
      dueDate: "2024-01-25"
    },
    {
      id: 2,
      auditId: 2,
      client: "XYZ Ltd",
      category: "Tax Compliance",
      severity: "medium",
      finding: "Delayed filing of advance tax payments",
      recommendation: "Setup automated reminders for tax payment due dates",
      status: "in-progress",
      assignedTo: "CA Patel",
      dueDate: "2024-02-01"
    },
    {
      id: 3,
      auditId: 3,
      client: "DEF Industries",
      category: "Internal Controls",
      severity: "high",
      finding: "Weak IT access controls and user management",
      recommendation: "Implement role-based access controls and regular access reviews",
      status: "open",
      assignedTo: "CA Kumar",
      dueDate: "2024-01-30"
    },
    {
      id: 4,
      auditId: 5,
      client: "JKL Enterprises",
      category: "Information Systems",
      severity: "medium",
      finding: "Insufficient backup and disaster recovery procedures",
      recommendation: "Develop comprehensive backup and disaster recovery plan",
      status: "resolved",
      assignedTo: "CA Verma",
      dueDate: "2024-01-15"
    }
  ];

  const auditStats = {
    totalAudits: 24,
    activeAudits: 8,
    completedAudits: 14,
    reviewStage: 2,
    averageProgress: 87,
    totalFindings: 45,
    criticalFindings: 12,
    resolvedFindings: 28,
    teamUtilization: 85.5,
    budgetUtilization: 78.2
  };

  const upcomingAudits = [
    {
      id: 1,
      client: "PQR Limited",
      type: "Statutory Audit",
      startDate: "2024-02-01",
      assignedTo: "CA Sharma",
      riskLevel: "high",
      estimatedDuration: "45 days"
    },
    {
      id: 2,
      client: "STU Corporation",
      type: "Tax Audit",
      startDate: "2024-02-15",
      assignedTo: "CA Patel",
      riskLevel: "medium",
      estimatedDuration: "30 days"
    },
    {
      id: 3,
      client: "VWX Industries",
      type: "Internal Audit",
      startDate: "2024-02-20",
      assignedTo: "CA Kumar",
      riskLevel: "low",
      estimatedDuration: "20 days"
    }
  ];

  const handleViewAuditDetails = (auditId: number) => {
    const audit = activeAudits.find(a => a.id === auditId);
    if (audit) {
      toast({
        title: `${audit.client} - ${audit.type}`,
        description: `Progress: ${audit.progress}% | Auditor: ${audit.auditor} | Risk: ${audit.riskLevel} | Findings: ${audit.findings}`,
      });
    }
  };

  const handleUpdateProgress = (auditId: number) => {
    const audit = activeAudits.find(a => a.id === auditId);
    if (audit) {
      const newProgress = Math.min(audit.progress + 10, 100);
      toast({
        title: "📈 Progress Updated",
        description: `${audit.client} audit progress updated to ${newProgress}%`,
      });
    }
  };

  const handleAssignAuditor = (auditId: number, auditorId: string) => {
    const audit = activeAudits.find(a => a.id === auditId);
    const auditor = teamMembers.find(m => m.id.toString() === auditorId);
    if (audit && auditor) {
      toast({
        title: "👥 Auditor Assigned",
        description: `${auditor.name} assigned to ${audit.client} audit`,
      });
    }
  };

  const handleGenerateReport = (auditId: number) => {
    const audit = activeAudits.find(a => a.id === auditId);
    if (audit) {
      toast({
        title: "📊 Generating Audit Report",
        description: `Comprehensive audit report for ${audit.client} is being generated...`,
      });
      
      setTimeout(() => {
        toast({
          title: "✅ Report Generated",
          description: "Audit report ready for download",
        });
      }, 3000);
    }
  };

  const handleScheduleAudit = () => {
    toast({
      title: "📅 Audit Scheduled",
      description: "New audit has been scheduled and assigned to team member",
    });
  };

  const handleBulkAction = (action: string) => {
    const actions = {
      "update-progress": "📈 Progress updated for all active audits",
      "generate-reports": "📊 Audit reports generated for completed audits",
      "send-reminders": "📧 Reminder emails sent to all team members",
      "sync-calendar": "📅 Calendar synchronized with audit schedules"
    };
    
    toast({
      title: "Bulk Action Completed",
      description: actions[action as keyof typeof actions] || "Action completed successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "review": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "planning": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "review": return <Eye className="w-4 h-4 text-blue-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />;
      case "planning": return <Calendar className="w-4 h-4 text-purple-600" />;
      default: return <FileCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
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

  const getFindingStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "open": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Audit Command Centre</h1>
          <p className="text-xl text-gray-600">Comprehensive audit management and team coordination</p>
        </div>

        {/* Audit Statistics */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    {auditStats.activeAudits}
                  </CardTitle>
                  <CardDescription>Active Audits</CardDescription>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-600 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Real-time tracking
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-600">
                    {auditStats.completedAudits}
                  </CardTitle>
                  <CardDescription>Completed</CardDescription>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +4 this month
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-600">
                    {auditStats.totalFindings}
                  </CardTitle>
                  <CardDescription>Total Findings</CardDescription>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-purple-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {auditStats.criticalFindings} critical
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-orange-600">
                    {auditStats.teamUtilization}%
                  </CardTitle>
                  <CardDescription>Team Utilization</CardDescription>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-600 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Optimal capacity
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-indigo-600">
                    {auditStats.averageProgress}%
                  </CardTitle>
                  <CardDescription>Avg Progress</CardDescription>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-indigo-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Above target
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="audits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="audits">Active Audits</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="audits">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage audits efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="audit-filter">Filter by Audit Type</Label>
                      <Select value={selectedAudit} onValueChange={setSelectedAudit}>
                        <SelectTrigger>
                          <SelectValue placeholder="All audits" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          {auditTypes.map(type => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="team-filter">Filter by Team Member</Label>
                      <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                        <SelectTrigger>
                          <SelectValue placeholder="All team members" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Members</SelectItem>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="risk-filter">Filter by Risk Level</Label>
                      <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="All risk levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Levels</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="low">Low Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule New Audit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule New Audit</DialogTitle>
                          <DialogDescription>
                            Create a new audit engagement
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="client-name">Client Name</Label>
                            <Input id="client-name" placeholder="Enter client name" />
                          </div>
                          <div>
                            <Label htmlFor="audit-type">Audit Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select audit type" />
                              </SelectTrigger>
                              <SelectContent>
                                {auditTypes.map(type => (
                                  <SelectItem key={type.id} value={type.name}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="assigned-auditor">Assigned Auditor</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select auditor" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map(member => (
                                  <SelectItem key={member.id} value={member.name}>
                                    {member.name} ({member.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleScheduleAudit} className="w-full">
                            Schedule Audit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => handleBulkAction("update-progress")}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("generate-reports")}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Audits */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Audit Engagements</CardTitle>
                  <CardDescription>Monitor and manage all ongoing audits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeAudits.map((audit) => (
                      <div key={audit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(audit.status)}
                            <div>
                              <h3 className="font-semibold">{audit.client} - {audit.type}</h3>
                              <p className="text-sm text-gray-600">
                                {audit.auditor} • {audit.startDate} to {audit.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(audit.status)}>
                              {audit.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={getRiskColor(audit.riskLevel)}>
                              {audit.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">{audit.progress}%</span>
                            </div>
                            <Progress value={audit.progress} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Documents</span>
                              <span className="text-sm font-medium">{audit.documentsReviewed}/{audit.totalDocuments}</span>
                            </div>
                            <Progress value={(audit.documentsReviewed / audit.totalDocuments) * 100} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Budget</span>
                              <span className="text-sm font-medium">{audit.spent}/{audit.budget}</span>
                            </div>
                            <Progress value={(parseFloat(audit.spent.replace(/[₹,]/g, '')) / parseFloat(audit.budget.replace(/[₹,]/g, ''))) * 100} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex space-x-4">
                            <span className="text-gray-600">Findings: <span className="font-medium">{audit.findings}</span></span>
                            <span className="text-gray-600">Recommendations: <span className="font-medium">{audit.recommendations}</span></span>
                            <span className="text-gray-600">Material Issues: <span className="font-medium">{audit.materialMisstatements}</span></span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleViewAuditDetails(audit.id)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdateProgress(audit.id)}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Update Progress
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleGenerateReport(audit.id)}>
                            <Download className="w-4 h-4 mr-1" />
                            Generate Report
                          </Button>
                          <Select onValueChange={(value) => handleAssignAuditor(audit.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Reassign" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id.toString()}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="findings">
            <Card>
              <CardHeader>
                <CardTitle>Audit Findings & Recommendations</CardTitle>
                <CardDescription>Track and manage audit findings across all engagements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditFindings.map((finding) => (
                    <div key={finding.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{finding.client} - {finding.category}</h3>
                          <p className="text-sm text-gray-600">Assigned to: {finding.assignedTo} • Due: {finding.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          <Badge className={getFindingStatusColor(finding.status)}>
                            {finding.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-sm">Finding:</h4>
                          <p className="text-sm text-gray-700">{finding.finding}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Recommendation:</h4>
                          <p className="text-sm text-gray-700">{finding.recommendation}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Add Comment
                        </Button>
                        {finding.status !== 'resolved' && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage audit team members and their assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role} • {member.expertise}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{member.activeAudits}</div>
                          <div className="text-sm text-gray-600">Active Audits</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Audits</CardTitle>
                  <CardDescription>Planned audit engagements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAudits.map((audit) => (
                      <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{audit.client} - {audit.type}</p>
                            <p className="text-sm text-gray-600">
                              {audit.startDate} • {audit.assignedTo} • {audit.estimatedDuration}
                            </p>
                          </div>
                        </div>
                        <Badge className={getRiskColor(audit.riskLevel)}>
                          {audit.riskLevel} risk
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Team Availability</CardTitle>
                  <CardDescription>Current team member availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{member.activeAudits}/5 audits</div>
                          <div className="text-sm text-gray-600">
                            {member.activeAudits < 3 ? "Available" : member.activeAudits < 5 ? "Busy" : "Overloaded"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Audit Duration</span>
                        <span className="text-sm">32 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">On-Time Completion Rate</span>
                        <span className="text-sm">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Client Satisfaction Score</span>
                        <span className="text-sm">4.8/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Findings per Audit</span>
                        <span className="text-sm">3.2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Resolution Rate</span>
                        <span className="text-sm">87%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                    <CardDescription>Team and budget utilization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Team Utilization</span>
                          <span className="text-sm">{auditStats.teamUtilization}%</span>
                        </div>
                        <Progress value={auditStats.teamUtilization} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Budget Utilization</span>
                          <span className="text-sm">{auditStats.budgetUtilization}%</span>
                        </div>
                        <Progress value={auditStats.budgetUtilization} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Finding Resolution</span>
                          <span className="text-sm">{Math.round((auditStats.resolvedFindings / auditStats.totalFindings) * 100)}%</span>
                        </div>
                        <Progress value={(auditStats.resolvedFindings / auditStats.totalFindings) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditCommandCentre;
