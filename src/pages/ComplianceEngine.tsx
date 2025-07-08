import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileCheck, 
  Target, 
  Bell,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertCircle,
  Shield,
  Users,
  RefreshCw,
  Eye,
  Download,
  Settings,
  Filter,
  Search,
  Plus,
  BookOpen,
  Lightbulb,
  Zap,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ComplianceEngine = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompliance, setSelectedCompliance] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const clients = [
    { id: 1, name: "ABC Corporation", pan: "ABCDE1234F", complianceScore: 95 },
    { id: 2, name: "XYZ Industries Ltd", pan: "XYZAB5678G", complianceScore: 88 },
    { id: 3, name: "DEF Enterprises", pan: "DEFGH9012H", complianceScore: 92 },
    { id: 4, name: "GHI Services", pan: "GHIJK5678L", complianceScore: 85 }
  ];

  const complianceTypes = [
    { id: 1, name: "Income Tax", category: "Direct Tax", frequency: "Annual/Quarterly" },
    { id: 2, name: "GST Returns", category: "Indirect Tax", frequency: "Monthly" },
    { id: 3, name: "TDS Returns", category: "Direct Tax", frequency: "Quarterly" },
    { id: 4, name: "ROC Filings", category: "Corporate", frequency: "Annual" },
    { id: 5, name: "PF Returns", category: "Labor Law", frequency: "Monthly" },
    { id: 6, name: "ESI Returns", category: "Labor Law", frequency: "Monthly" },
    { id: 7, name: "Professional Tax", category: "State Tax", frequency: "Monthly" },
    { id: 8, name: "Audit Reports", category: "Corporate", frequency: "Annual" }
  ];

  const complianceTasks = [
    { 
      id: 1, 
      task: "GST Return Filing - GSTR-3B", 
      client: "ABC Corporation",
      deadline: "2024-01-20", 
      status: "pending", 
      priority: "high",
      type: "GST Returns",
      progress: 25,
      assignedTo: "CA Sharma",
      penaltyAmount: "₹2,000",
      autoReminder: true
    },
    { 
      id: 2, 
      task: "Income Tax Audit Report", 
      client: "XYZ Industries Ltd",
      deadline: "2024-01-25", 
      status: "in-progress", 
      priority: "medium",
      type: "Income Tax",
      progress: 60,
      assignedTo: "CA Patel",
      penaltyAmount: "₹5,000",
      autoReminder: true
    },
    { 
      id: 3, 
      task: "TDS Return - Q3 2023", 
      client: "DEF Enterprises",
      deadline: "2024-01-15", 
      status: "completed", 
      priority: "low",
      type: "TDS Returns",
      progress: 100,
      assignedTo: "CA Kumar",
      penaltyAmount: "₹0",
      autoReminder: false
    },
    { 
      id: 4, 
      task: "Annual ROC Filing", 
      client: "GHI Services",
      deadline: "2024-02-01", 
      status: "pending", 
      priority: "high",
      type: "ROC Filings",
      progress: 10,
      assignedTo: "CA Singh",
      penaltyAmount: "₹10,000",
      autoReminder: true
    },
    { 
      id: 5, 
      task: "PF Return - December 2023", 
      client: "ABC Corporation",
      deadline: "2024-01-30", 
      status: "in-progress", 
      priority: "medium",
      type: "PF Returns",
      progress: 40,
      assignedTo: "CA Verma",
      penaltyAmount: "₹1,000",
      autoReminder: true
    },
    { 
      id: 6, 
      task: "ESI Return - December 2023", 
      client: "XYZ Industries Ltd",
      deadline: "2024-01-18", 
      status: "pending", 
      priority: "low",
      type: "ESI Returns",
      progress: 0,
      assignedTo: "CA Mehta",
      penaltyAmount: "₹500",
      autoReminder: true
    }
  ];

  const regulatoryUpdates = [
    {
      id: 1,
      title: "New GST Amendment - E-invoicing Mandatory",
      category: "GST",
      date: "2024-01-10",
      impact: "high",
      description: "E-invoicing now mandatory for businesses with turnover ≥ ₹5 crores",
      affectedClients: 3,
      action: "Update client systems and processes"
    },
    {
      id: 2,
      title: "TDS Rate Changes for FY 2024-25",
      category: "Income Tax",
      date: "2024-01-08",
      impact: "medium",
      description: "TDS rates revised for professional services from 10% to 12%",
      affectedClients: 5,
      action: "Review and update TDS computations"
    },
    {
      id: 3,
      title: "New ROC Filing Requirements",
      category: "Corporate Law",
      date: "2024-01-05",
      impact: "medium",
      description: "Additional disclosures required in Annual Returns",
      affectedClients: 2,
      action: "Prepare additional documentation"
    },
    {
      id: 4,
      title: "Updated PF Contribution Rates",
      category: "Labor Law",
      date: "2024-01-03",
      impact: "low",
      description: "PF contribution ceiling increased to ₹15,000",
      affectedClients: 4,
      action: "Update payroll calculations"
    }
  ];

  const complianceCalendar = [
    { date: "2024-01-15", event: "TDS Return Q3 Due", type: "deadline", priority: "high" },
    { date: "2024-01-18", event: "ESI Return Due", type: "deadline", priority: "medium" },
    { date: "2024-01-20", event: "GST Return Filing", type: "deadline", priority: "high" },
    { date: "2024-01-25", event: "Income Tax Audit", type: "deadline", priority: "medium" },
    { date: "2024-01-30", event: "PF Return Due", type: "deadline", priority: "medium" },
    { date: "2024-02-01", event: "ROC Filing Due", type: "deadline", priority: "high" }
  ];

  const complianceStats = {
    totalCompliances: 45,
    completed: 32,
    inProgress: 8,
    pending: 5,
    overdue: 2,
    averageScore: 91.2,
    upcomingDeadlines: 6,
    activeAlerts: 4
  };

  interface ComplianceTask {
    id: number;
    task: string;
    client: string;
    deadline: string;
    status: string;
    priority: string;
    type: string;
    progress: number;
    assignedTo: string;
    penaltyAmount: string;
    autoReminder: boolean;
  }

  const handleViewTask = (task: ComplianceTask) => {
    toast({
      title: `${task.task}`,
      description: `${task.client} | Due: ${task.deadline} | Priority: ${task.priority} | Progress: ${task.progress}%`,
    });
  };

  const handleStartCompliance = (taskId: number) => {
    const task = complianceTasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "📋 Compliance Task Started",
        description: `Started working on: ${task.task} for ${task.client}`,
      });
      // Simulate progress update
      setTimeout(() => {
        toast({
          title: "📈 Progress Updated",
          description: `Task progress updated to ${task.progress + 20}%`,
        });
      }, 2000);
    }
  };

  const handleSetReminder = (taskId: number) => {
    const task = complianceTasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "🔔 Reminder Set",
        description: `Reminder set for ${task.task} - 2 days before deadline`,
      });
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "📊 Generating Compliance Report",
      description: "Comprehensive compliance report with all clients and deadlines...",
    });
    
    setTimeout(() => {
      toast({
        title: "✅ Report Generated",
        description: "Compliance report ready for download",
      });
    }, 3000);
  };

  const handleBulkAction = (action: string) => {
    const actions = {
      "send-reminders": "📧 Bulk reminders sent to all clients with pending compliances",
      "update-calendar": "📅 Calendar updated with new compliance deadlines",
      "generate-alerts": "🚨 Compliance alerts generated for high-priority items",
      "sync-updates": "🔄 Regulatory updates synchronized across all clients"
    };
    
    toast({
      title: "Bulk Action Completed",
      description: actions[action as keyof typeof actions] || "Action completed successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress": return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case "pending": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <FileCheck className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-red-100 text-red-800";
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceScore = (score: number) => {
    if (score >= 95) return { color: "text-green-600", grade: "A+" };
    if (score >= 90) return { color: "text-green-500", grade: "A" };
    if (score >= 85) return { color: "text-yellow-600", grade: "B+" };
    if (score >= 80) return { color: "text-yellow-500", grade: "B" };
    return { color: "text-red-500", grade: "C" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Compliance Engine</h1>
          <p className="text-xl text-gray-600">Comprehensive compliance management and regulatory oversight</p>
        </div>

        {/* Compliance Statistics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-600">
                    {complianceStats.completed}
                  </CardTitle>
                  <CardDescription>Completed</CardDescription>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8 this month
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-yellow-600">
                    {complianceStats.inProgress}
                  </CardTitle>
                  <CardDescription>In Progress</CardDescription>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-yellow-600 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1" />
                Active tracking
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-red-600">
                    {complianceStats.pending}
                  </CardTitle>
                  <CardDescription>Pending</CardDescription>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Requires attention
              </div>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    {complianceStats.averageScore}%
                  </CardTitle>
                  <CardDescription>Average Score</CardDescription>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-600 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Excellent compliance
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks">Compliance Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="updates">Regulatory Updates</TabsTrigger>
            <TabsTrigger value="clients">Client Scores</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage compliance tasks efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-filter">Filter by Client</Label>
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger>
                          <SelectValue placeholder="All clients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Clients</SelectItem>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="compliance-filter">Filter by Compliance Type</Label>
                      <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
                        <SelectTrigger>
                          <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          {complianceTypes.map(type => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name} ({type.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleBulkAction("send-reminders")}>
                      <Bell className="w-4 h-4 mr-2" />
                      Send Reminders
                    </Button>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("update-calendar")}>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Update Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Compliance Tasks</CardTitle>
                  <CardDescription>Manage all your compliance requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <h3 className="font-semibold">{task.task}</h3>
                              <p className="text-sm text-gray-600">
                                {task.client} • Due: {task.deadline} • Assigned to: {task.assignedTo}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Penalty if delayed: {task.penaltyAmount}</span>
                            <div className="flex items-center space-x-2">
                              {task.autoReminder && (
                                <Badge variant="outline">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Auto-reminder
                                </Badge>
                              )}
                              <Badge variant="outline">{task.type}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" onClick={() => handleViewTask(task)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {task.status !== 'completed' && (
                            <Button size="sm" variant="outline" onClick={() => handleStartCompliance(task.id)}>
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Start Work
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleSetReminder(task.id)}>
                            <Bell className="w-4 h-4 mr-1" />
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Calendar</CardTitle>
                  <CardDescription>View upcoming deadlines and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Critical dates to remember</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceCalendar.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CalendarIcon className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-gray-600">{event.date}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Updates</CardTitle>
                <CardDescription>Stay informed about latest regulatory changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulatoryUpdates.map((update) => (
                    <div key={update.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{update.title}</h3>
                          <p className="text-sm text-gray-600">{update.category} • {update.date}</p>
                        </div>
                        <Badge className={getImpactColor(update.impact)}>
                          {update.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{update.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Affects {update.affectedClients} clients
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Read More
                          </Button>
                          <Button size="sm">
                            <Zap className="w-4 h-4 mr-1" />
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Compliance Scores</CardTitle>
                <CardDescription>Monitor compliance performance across all clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => {
                    const scoreData = getComplianceScore(client.complianceScore);
                    return (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.pan}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${scoreData.color}`}>
                              {client.complianceScore}%
                            </div>
                            <div className="text-sm text-gray-600">Grade: {scoreData.grade}</div>
                          </div>
                          <div className="w-20">
                            <Progress value={client.complianceScore} className="h-2" />
                          </div>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Settings</CardTitle>
                  <CardDescription>Configure compliance engine preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Reminder Days Before Deadline</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auto-alerts">Auto-Generate Alerts</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="report-frequency">Report Generation Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Actions</CardTitle>
                  <CardDescription>Perform bulk operations on compliance data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => handleBulkAction("send-reminders")}>
                      <Bell className="w-4 h-4 mr-2" />
                      Send All Reminders
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("generate-alerts")}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Generate Alerts
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("update-calendar")}>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Sync Calendar
                    </Button>
                    <Button variant="outline" onClick={() => handleBulkAction("sync-updates")}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Updates
                    </Button>
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

export default ComplianceEngine;
