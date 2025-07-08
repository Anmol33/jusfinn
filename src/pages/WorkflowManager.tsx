import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Bot,
  Zap,
  Target,
  ArrowRight,
  Edit,
  Copy,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  Activity,
  ChevronRight,
  List,
  Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


const WorkflowManager = () => {
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Apple Design: Priority-focused workflow stats
  const workflowStats = [
    {
      title: "Active Workflows",
      value: "18",
      color: "text-blue-500",
      icon: Play,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      trend: "5 running now"
    },
    {
      title: "Pending Approval",
      value: "7",
      color: "text-amber-500",
      icon: Clock,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      trend: "3 due today"
    },
    {
      title: "Completed",
      value: "142",
      color: "text-green-500",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      trend: "This month"
    },
    {
      title: "Efficiency",
      value: "94%",
      color: "text-purple-500",
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      trend: "Automation rate"
    }
  ];

  // Sample workflow data with priority classification
  const workflows = [
    {
      id: "1",
      name: "GST Return Filing Process",
      description: "Automated GST return preparation and filing workflow",
      status: "active",
      priority: "high",
      progress: 75,
      client: "ABC Corporation",
      assignee: "CA Rajesh Kumar",
      dueDate: "2024-01-25",
      startDate: "2024-01-15",
      steps: [
        { id: 1, name: "Data Collection", status: "completed", duration: "2 hours" },
        { id: 2, name: "Reconciliation", status: "completed", duration: "4 hours" },
        { id: 3, name: "Return Preparation", status: "in_progress", duration: "3 hours" },
        { id: 4, name: "Review & Approval", status: "pending", duration: "1 hour" },
        { id: 5, name: "Filing", status: "pending", duration: "30 minutes" }
      ],
      type: "GST Filing",
      category: "compliance",
      automationLevel: "high"
    },
    {
      id: "2",
      name: "Income Tax Return Processing",
      description: "End-to-end ITR processing with document verification",
      status: "active",
      priority: "critical",
      progress: 45,
      client: "XYZ Industries Ltd",
      assignee: "CA Priya Sharma",
      dueDate: "2024-01-28",
      startDate: "2024-01-18",
      steps: [
        { id: 1, name: "Document Upload", status: "completed", duration: "1 hour" },
        { id: 2, name: "Data Validation", status: "completed", duration: "2 hours" },
        { id: 3, name: "Tax Computation", status: "in_progress", duration: "4 hours" },
        { id: 4, name: "Form Filling", status: "pending", duration: "2 hours" },
        { id: 5, name: "E-filing", status: "pending", duration: "1 hour" }
      ],
      type: "ITR Filing",
      category: "tax",
      automationLevel: "medium"
    },
    {
      id: "3",
      name: "Audit Report Generation",
      description: "Comprehensive audit report with findings and recommendations",
      status: "review",
      priority: "medium",
      progress: 90,
      client: "DEF Enterprises",
      assignee: "CA Amit Gupta",
      dueDate: "2024-01-30",
      startDate: "2024-01-10",
      steps: [
        { id: 1, name: "Financial Analysis", status: "completed", duration: "8 hours" },
        { id: 2, name: "Testing & Verification", status: "completed", duration: "12 hours" },
        { id: 3, name: "Report Drafting", status: "completed", duration: "6 hours" },
        { id: 4, name: "Partner Review", status: "in_progress", duration: "2 hours" },
        { id: 5, name: "Client Presentation", status: "pending", duration: "1 hour" }
      ],
      type: "Audit",
      category: "audit",
      automationLevel: "low"
    }
  ];

  const workflowTemplates = [
    {
      id: "t1",
      name: "Monthly GST Filing",
      description: "Template for monthly GST return filing process",
      estimatedTime: "6-8 hours",
      steps: 5,
      automationLevel: "high",
      category: "compliance"
    },
    {
      id: "t2",
      name: "Annual Tax Return",
      description: "Complete ITR filing workflow with documentation",
      estimatedTime: "8-12 hours",
      steps: 7,
      automationLevel: "medium",
      category: "tax"
    },
    {
      id: "t3",
      name: "Quarterly Audit",
      description: "Standard audit workflow for quarterly reviews",
      estimatedTime: "20-30 hours",
      steps: 8,
      automationLevel: "low",
      category: "audit"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paused": return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "pending": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending": return <Circle className="w-4 h-4 text-gray-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAutomationLevel = (level: string) => {
    switch (level) {
      case "high": return { color: "text-green-600", label: "High Automation" };
      case "medium": return { color: "text-amber-600", label: "Medium Automation" };
      case "low": return { color: "text-red-600", label: "Low Automation" };
      default: return { color: "text-gray-600", label: "Manual" };
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apple Design: Group by priority
  const groupedWorkflows = {
    critical: filteredWorkflows.filter(w => w.priority === "critical"),
    high: filteredWorkflows.filter(w => w.priority === "high"),
    medium: filteredWorkflows.filter(w => w.priority === "medium"),
    low: filteredWorkflows.filter(w => w.priority === "low")
  };

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft < 0) return "text-red-600 font-bold";
    if (daysLeft <= 2) return "text-red-600 font-semibold";
    if (daysLeft <= 5) return "text-amber-600 font-medium";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Glassmorphism Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflow Manager</h1>
              <p className="text-gray-600 mt-1">Automated workflow orchestration</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Priority-focused stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {workflowStats.map((stat, index) => (
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

        {/* Apple Design: Clean tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-96 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="active" className="rounded-md">Active Workflows</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-md">Templates</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {/* Apple Design: Clean filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apple Design: Priority-grouped workflows */}
            <div className="space-y-8">
              {Object.entries(groupedWorkflows).map(([priority, workflows]) => (
                workflows.length > 0 && (
                  <div key={priority} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-amber-500' :
                        priority === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {priority} Priority ({workflows.length})
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      {workflows.map((workflow) => {
                        const daysLeft = getDaysLeft(workflow.dueDate);
                        const automation = getAutomationLevel(workflow.automationLevel);
                        
                        return (
                          <Card key={workflow.id} className={`${getPriorityColor(workflow.priority)} border-l-4 bg-white border-gray-200 hover:shadow-md transition-all duration-200`}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                                    <Badge className={`${getStatusColor(workflow.status)} border text-xs`}>
                                      {workflow.status}
                                    </Badge>
                                    <span className={`text-sm font-medium ${getUrgencyColor(daysLeft)}`}>
                                      {daysLeft > 0 ? `${daysLeft} days left` : 
                                       daysLeft === 0 ? 'Due today' : 
                                       `${Math.abs(daysLeft)} days overdue`}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                    <div className="space-y-1">
                                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Client</p>
                                      <p className="font-medium text-gray-900">{workflow.client}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Assignee</p>
                                      <p className="font-medium text-gray-900">{workflow.assignee}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Type</p>
                                      <p className="font-medium text-gray-900">{workflow.type}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Automation</p>
                                      <p className={`font-medium ${automation.color}`}>{automation.label}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Progress bar */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">Progress</span>
                                  <span className="text-sm font-medium text-gray-700">{workflow.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${workflow.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Workflow steps */}
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Steps</h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {workflow.steps.slice(0, 3).map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-1 text-xs">
                                      {getStepStatusIcon(step.status)}
                                      <span className={getStepStatusColor(step.status)}>{step.name}</span>
                                      {index < 2 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                                    </div>
                                  ))}
                                  {workflow.steps.length > 3 && (
                                    <span className="text-xs text-gray-500">+{workflow.steps.length - 3} more</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Play className="w-4 h-4 mr-2" />
                                    Continue
                                  </Button>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Started: {new Date(workflow.startDate).toLocaleDateString()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map((template) => {
                const automation = getAutomationLevel(template.automationLevel);
                return (
                  <Card key={template.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{template.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <List className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{template.steps} steps</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-gray-400" />
                              <span className={automation.color}>{automation.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed workflow performance metrics coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredWorkflows.length === 0 && activeTab === "active" && (
          <Card className="bg-white border-gray-200">
            <CardContent className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
              <p className="text-gray-600">Try adjusting your filters or create a new workflow</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkflowManager; 