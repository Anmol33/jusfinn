import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Target,
  ArrowRight,
  Bell,
  User,
  Building,
  IndianRupee,
  Timer,
  Phone,
  Mail,
  MessageSquare,
  Star,
  PlayCircle,
  Pause,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Upload,
  Edit,
  MoreHorizontal,
  Filter,
  Search,
  RefreshCw,
  Zap,
  Activity,
  Workflow,
  AlertCircle,
  CalendarDays,
  Clock4,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const TodaysPriorities = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Today's critical metrics
  const todaysMetrics = {
    urgentDeadlines: 8,
    reviewsPending: 5,
    clientCalls: 3,
    revenueAtRisk: 340000, // ₹3.4L
    complianceAlerts: 2,
    teamCapacity: 87 // %
  };

  // Priority actions for today
  const priorityActions = [
    {
      id: 1,
      type: "deadline",
      title: "GST Return Filing - ABC Corporation",
      client: "ABC Corporation",
      deadline: "Today 6:00 PM",
      priority: "critical",
      status: "ready_to_file",
      assignee: "Rahul Sharma",
      timeLeft: "3 hours",
      revenue: 45000,
      actions: ["file", "review", "call_client"],
      progress: 95,
      riskLevel: "high",
      category: "gst_filing"
    },
    {
      id: 2,
      type: "review",
      title: "Income Tax Return - XYZ Industries",
      client: "XYZ Industries Ltd",
      deadline: "Today 8:00 PM",
      priority: "high",
      status: "pending_review",
      assignee: "Priya Patel",
      timeLeft: "5 hours",
      revenue: 85000,
      actions: ["review", "approve", "request_changes"],
      progress: 90,
      riskLevel: "medium",
      category: "itr_filing"
    },
    {
      id: 3,
      type: "client_call",
      title: "Client Call - DEF Enterprises",
      client: "DEF Enterprises",
      deadline: "Today 2:00 PM",
      priority: "high",
      status: "scheduled",
      assignee: "CA Mehta",
      timeLeft: "1 hour",
      revenue: 0,
      actions: ["join_call", "reschedule", "prepare_agenda"],
      progress: 100,
      riskLevel: "low",
      category: "client_meeting"
    },
    {
      id: 4,
      type: "compliance",
      title: "TDS Certificate Generation - GHI Services",
      client: "GHI Services",
      deadline: "Today 4:00 PM",
      priority: "medium",
      status: "in_progress",
      assignee: "Amit Kumar",
      timeLeft: "2 hours",
      revenue: 25000,
      actions: ["continue", "review", "generate"],
      progress: 70,
      riskLevel: "low",
      category: "tds_compliance"
    },
    {
      id: 5,
      type: "notice",
      title: "Tax Notice Response - JKL Manufacturing",
      client: "JKL Manufacturing",
      deadline: "Today 7:00 PM",
      priority: "critical",
      status: "pending_response",
      assignee: "Sita Verma",
      timeLeft: "4 hours",
      revenue: 75000,
      actions: ["draft_response", "collect_evidence", "submit"],
      progress: 45,
      riskLevel: "high",
      category: "notice_response"
    }
  ];

  // Quick actions for immediate workflow
  const quickActions = [
    {
      id: "file_returns",
      title: "File Ready Returns",
      description: "5 returns ready for filing",
      icon: Upload,
      count: 5,
      color: "bg-green-600 hover:bg-green-700",
      urgency: "high"
    },
    {
      id: "review_pending",
      title: "Review Pending Work",
      description: "3 items awaiting review",
      icon: Eye,
      count: 3,
      color: "bg-blue-600 hover:bg-blue-700",
      urgency: "medium"
    },
    {
      id: "client_follow_up",
      title: "Client Follow-ups",
      description: "7 clients to contact",
      icon: Phone,
      count: 7,
      color: "bg-purple-600 hover:bg-purple-700",
      urgency: "medium"
    },
    {
      id: "compliance_check",
      title: "Compliance Review",
      description: "2 compliance alerts",
      icon: AlertTriangle,
      count: 2,
      color: "bg-red-600 hover:bg-red-700",
      urgency: "high"
    }
  ];

  // Team status for coordination
  const teamStatus = [
    { name: "Rahul Sharma", status: "available", currentTask: "GST Filing - ABC Corp", utilization: 95, priority: "critical" },
    { name: "Priya Patel", status: "busy", currentTask: "ITR Review - XYZ Industries", utilization: 87, priority: "high" },
    { name: "CA Mehta", status: "in_meeting", currentTask: "Client Call - DEF Enterprises", utilization: 92, priority: "medium" },
    { name: "Amit Kumar", status: "available", currentTask: "TDS Certificates", utilization: 78, priority: "medium" },
    { name: "Sita Verma", status: "busy", currentTask: "Notice Response", utilization: 89, priority: "critical" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_to_file": return "bg-green-100 text-green-800 border-green-300";
      case "pending_review": return "bg-amber-100 text-amber-800 border-amber-300";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "scheduled": return "bg-purple-100 text-purple-800 border-purple-300";
      case "pending_response": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-l-red-500 bg-red-50";
      case "high": return "border-l-orange-500 bg-orange-50";
      case "medium": return "border-l-blue-500 bg-blue-50";
      case "low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case "high": return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case "medium": return <Badge className="bg-blue-500 hover:bg-blue-600">Medium</Badge>;
      case "low": return <Badge className="bg-green-500 hover:bg-green-600">Low</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-amber-100 text-amber-800";
      case "in_meeting": return "bg-blue-100 text-blue-800";
      case "away": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuickAction = (actionId: string) => {
    toast({
      title: "Action Initiated",
      description: `Starting ${actionId} workflow`,
    });
  };

  const handleTaskAction = (taskId: number, action: string) => {
    toast({
      title: `${action} initiated`,
      description: `Task ${taskId} - ${action} started`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Today's Priorities</h1>
              <p className="text-gray-600 mt-1">Focus on what matters most - {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search priorities..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-red-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-700">{todaysMetrics.urgentDeadlines}</div>
              <div className="text-sm text-gray-600 font-medium">Urgent Deadlines</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-amber-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-amber-700">{todaysMetrics.reviewsPending}</div>
              <div className="text-sm text-gray-600 font-medium">Reviews Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-700">{todaysMetrics.clientCalls}</div>
              <div className="text-sm text-gray-600 font-medium">Client Calls</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-700">{formatCurrency(todaysMetrics.revenueAtRisk)}</div>
              <div className="text-sm text-gray-600 font-medium">Revenue at Risk</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-700">{todaysMetrics.complianceAlerts}</div>
              <div className="text-sm text-gray-600 font-medium">Compliance Alerts</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-700">{todaysMetrics.teamCapacity}%</div>
              <div className="text-sm text-gray-600 font-medium">Team Capacity</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6" onClick={() => handleQuickAction(action.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{action.count}</div>
                      <Badge variant={action.urgency === "high" ? "destructive" : "secondary"}>
                        {action.urgency}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Priority Tasks</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Timer className="w-4 h-4 mr-2" />
                Time Tracking
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {priorityActions.map((task) => (
              <Card key={task.id} className={`border-l-4 ${getPriorityColor(task.priority)} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{task.client}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.deadline}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Timer className="w-4 h-4" />
                          <span>{task.timeLeft} left</span>
                        </div>
                        {task.revenue > 0 && (
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="w-4 h-4" />
                            <span>{formatCurrency(task.revenue)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {task.actions.map((action) => (
                        <Button
                          key={action}
                          size="sm"
                          variant={action === "file" || action === "approve" ? "default" : "outline"}
                          onClick={() => handleTaskAction(task.id, action)}
                        >
                          {action === "file" && <Upload className="w-4 h-4 mr-1" />}
                          {action === "review" && <Eye className="w-4 h-4 mr-1" />}
                          {action === "approve" && <CheckCircle className="w-4 h-4 mr-1" />}
                          {action === "call_client" && <Phone className="w-4 h-4 mr-1" />}
                          {action.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamStatus.map((member) => (
              <Card key={member.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <Badge className={getTeamStatusColor(member.status)}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{member.utilization}%</div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Current:</strong> {member.currentTask}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={member.priority === "critical" ? "destructive" : "secondary"}>
                        {member.priority}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysPriorities; 