import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  Calendar,
  TrendingUp,
  ArrowRight,
  Plus,
  Bell,
  Search,
  Settings,
  BarChart3,
  Shield,
  Target,
  Building,
  User,
  MessageSquare,
  RefreshCw,
  IndianRupee,
  ChevronRight,
  Zap,
  Activity,
  X,
  Check,
  Upload,
  Eye,
  Edit,
  PlayCircle,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Apple Design: State management for realistic demo
interface Task {
  id: number;
  title: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  dueTime: string;
  client: string;
  status: "pending" | "in_progress" | "review" | "completed";
  progress: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // Get user info from localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { user } = JSON.parse(authData);
      setUserInfo(user);
    }
  }, []);

  // Apple Design: Realistic state management
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: "GST Return - ABC Corp", 
      type: "GST Filing", 
      priority: "critical", 
      dueTime: "2:00 PM",
      client: "ABC Corporation",
      status: "in_progress",
      progress: 75
    },
    { 
      id: 2, 
      title: "TDS Return - XYZ Ltd", 
      type: "TDS Filing", 
      priority: "high", 
      dueTime: "4:00 PM",
      client: "XYZ Industries",
      status: "pending",
      progress: 0
    },
    { 
      id: 3, 
      title: "ITR Review - Rajesh Kumar", 
      type: "Tax Return", 
      priority: "medium", 
      dueTime: "End of day",
      client: "Rajesh Kumar",
      status: "review",
      progress: 90
    },
    { 
      id: 4, 
      title: "Bank Reconciliation - DEF", 
      type: "Reconciliation", 
      priority: "medium", 
      dueTime: "Tomorrow",
      client: "DEF Enterprises",
      status: "pending",
      progress: 25
    },
    { 
      id: 5, 
      title: "Client Meeting Prep", 
      type: "Meeting", 
      priority: "low", 
      dueTime: "3:00 PM",
      client: "Multiple clients",
      status: "pending",
      progress: 50
    }
  ]);

  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    client: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    dueTime: string;
  }>({
    title: "",
    client: "",
    type: "",
    priority: "medium",
    dueTime: ""
  });

  const [metrics, setMetrics] = useState({
    activeClients: 156,
    revenue: 12.5,
    pendingTasks: 23,
    complianceScore: 94
  });

  // Apple Design: Real activity with state updates
  const [recentActivity, setRecentActivity] = useState([
    { 
      id: 1, 
      action: "GST Return Filed", 
      client: "ABC Corporation", 
      time: "10 min ago",
      type: "success",
      icon: CheckCircle
    },
    { 
      id: 2, 
      action: "Document Uploaded", 
      client: "XYZ Industries", 
      time: "25 min ago",
      type: "info",
      icon: FileText
    },
    { 
      id: 3, 
      action: "Notice Response Sent", 
      client: "Rajesh Kumar", 
      time: "1 hour ago",
      type: "success",
      icon: MessageSquare
    }
  ]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-client":
        // Apple Design: Real navigation with state update
        setMetrics(prev => ({ ...prev, activeClients: prev.activeClients + 1 }));
        setRecentActivity(prev => [
          {
            id: Date.now(),
            action: "New Client Added",
            client: "Demo Client",
            time: "Just now",
            type: "success",
            icon: Users
          },
          ...prev.slice(0, 2)
        ]);
        toast({
          title: "✨ New Client Added",
          description: "Demo client successfully registered",
        });
        navigate("/client-management");
        break;
      case "gst-filing":
        // Apple Design: Start workflow with state update
        setTasks(prev => prev.map(task => 
          task.id === 1 
            ? { ...task, status: "in_progress" as const, progress: Math.min(task.progress + 15, 100) }
            : task
        ));
        toast({
          title: "🚀 GST Filing Started",
          description: "GST workflow initiated for ABC Corporation",
        });
        navigate("/tax-returns");
        break;
      case "upload-docs":
        // Apple Design: Simulate document upload
        setRecentActivity(prev => [
          {
            id: Date.now(),
            action: "Document Uploaded",
            client: "Demo Upload",
            time: "Just now",
            type: "info",
            icon: Upload
          },
          ...prev.slice(0, 2)
        ]);
        toast({
          title: "📁 Document Uploaded",
          description: "Demo document successfully uploaded",
        });
        navigate("/data-ingestion");
        break;
      case "calendar":
        toast({
          title: "📅 Opening Calendar",
          description: "Viewing today's schedule and deadlines",
        });
        navigate("/task-scheduler");
        break;
    }
  };

  const handleTaskAction = (taskId: number, action: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (action) {
      case "start":
        // Apple Design: Real task state updates
        setTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, status: "in_progress" as const, progress: Math.max(t.progress, 25) }
            : t
        ));
        setRecentActivity(prev => [
          {
            id: Date.now(),
            action: `Started: ${task.title}`,
            client: task.client,
            time: "Just now",
            type: "info",
            icon: PlayCircle
          },
          ...prev.slice(0, 2)
        ]);
        toast({
          title: "▶️ Task Started",
          description: `Working on ${task.title}`,
        });
        break;
      case "complete":
        // Apple Design: Complete task with metrics update
        setTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, status: "completed" as const, progress: 100 }
            : t
        ));
        setMetrics(prev => ({ ...prev, pendingTasks: prev.pendingTasks - 1 }));
        setRecentActivity(prev => [
          {
            id: Date.now(),
            action: `Completed: ${task.title}`,
            client: task.client,
            time: "Just now",
            type: "success",
            icon: CheckCircle
          },
          ...prev.slice(0, 2)
        ]);
        toast({
          title: "✅ Task Completed",
          description: `${task.title} marked as completed`,
        });
        break;
      case "view":
        toast({
          title: "👁️ Viewing Task",
          description: `Opening details for ${task.title}`,
        });
        navigate("/task-scheduler");
        break;
    }
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.client) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in task title and client",
        variant: "destructive"
      });
      return;
    }

    const newTaskItem: Task = {
      id: Date.now(),
      title: newTask.title,
      type: newTask.type || "General",
      priority: newTask.priority,
      dueTime: newTask.dueTime || "End of day",
      client: newTask.client,
      status: "pending",
      progress: 0
    };

    setTasks(prev => [newTaskItem, ...prev.slice(0, 4)]);
    setMetrics(prev => ({ ...prev, pendingTasks: prev.pendingTasks + 1 }));
    setRecentActivity(prev => [
      {
        id: Date.now(),
        action: `New Task: ${newTask.title}`,
        client: newTask.client,
        time: "Just now",
        type: "info",
        icon: Plus
      },
      ...prev.slice(0, 2)
    ]);

    setNewTask({
      title: "",
      client: "",
      type: "",
      priority: "medium",
      dueTime: ""
    });
    setShowNewTaskDialog(false);
    
    toast({
      title: "✅ Task Added",
      description: `${newTask.title} added to your task list`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress": return <Activity className="w-4 h-4 text-blue-600" />;
      case "review": return <Clock className="w-4 h-4 text-orange-600" />;
      case "pending": return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Apple Design: Dynamic key metrics
  const keyMetrics = [
    { 
      title: "Active Clients", 
      value: metrics.activeClients.toString(), 
      change: "+3", 
      trend: "up", 
      icon: Users,
      color: "bg-blue-50 text-blue-600"
    },
    { 
      title: "Revenue (Month)", 
      value: `₹${metrics.revenue}L`, 
      change: "+18%", 
      trend: "up", 
      icon: IndianRupee,
      color: "bg-green-50 text-green-600"
    },
    { 
      title: "Pending Tasks", 
      value: metrics.pendingTasks.toString(), 
      change: tasks.filter(t => t.status === "completed").length > 0 ? "-1" : "0", 
      trend: tasks.filter(t => t.status === "completed").length > 0 ? "down" : "neutral", 
      icon: Clock,
      color: "bg-orange-50 text-orange-600"
    },
    { 
      title: "Compliance Score", 
      value: `${metrics.complianceScore}%`, 
      change: "+2%", 
      trend: "up", 
      icon: Shield,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  // Apple Design: Quick actions with real functionality
  const quickActions = [
    { title: "New Client", icon: Plus, color: "bg-blue-600 hover:bg-blue-700", action: "new-client" },
    { title: "Quick GST", icon: Zap, color: "bg-green-600 hover:bg-green-700", action: "gst-filing" },
    { title: "Upload Docs", icon: FileText, color: "bg-purple-600 hover:bg-purple-700", action: "upload-docs" },
    { title: "View Calendar", icon: Calendar, color: "bg-orange-600 hover:bg-orange-700", action: "calendar" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Clean header with actions */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Today's Work</h1>
              <p className="text-gray-600 mt-1">Your priority tasks and key metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task for your workflow</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        value={newTask.client}
                        onChange={(e) => setNewTask(prev => ({ ...prev, client: e.target.value }))}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Task Type</Label>
                      <Select value={newTask.type} onValueChange={(value) => setNewTask(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GST Filing">GST Filing</SelectItem>
                          <SelectItem value="TDS Return">TDS Return</SelectItem>
                          <SelectItem value="Tax Return">Tax Return</SelectItem>
                          <SelectItem value="Reconciliation">Reconciliation</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: "critical" | "high" | "medium" | "low") => setNewTask(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueTime">Due Time</Label>
                      <Input
                        id="dueTime"
                        value={newTask.dueTime}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                        placeholder="e.g., 2:00 PM, End of day"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Info Section */}
        {userInfo && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              {userInfo.picture && (
                <img 
                  src={userInfo.picture} 
                  alt={userInfo.name} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">Welcome back, {userInfo.name}!</h3>
                <p className="text-sm text-gray-600">{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Apple Design: Key metrics with real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${metric.color.split(' ')[0]}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color.split(' ')[1]}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${metric.color.split(' ')[1]}`}>{metric.value}</p>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">vs last month</p>
                  <p className={`text-sm font-semibold ${
                    metric.trend === "up" ? "text-green-600" : 
                    metric.trend === "down" ? "text-red-600" : "text-gray-600"
                  }`}>
                    {metric.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Apple Design: Today's priorities with real actions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Today's Priorities</CardTitle>
                    <CardDescription>Your most important tasks for today</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/task-scheduler")}>
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="group p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{task.client} • {task.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status.replace("_", " ")}</span>
                        </Badge>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTaskAction(task.id, "view")}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {task.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTaskAction(task.id, "start")}
                              className="h-7 w-7 p-0 text-blue-600"
                            >
                              <PlayCircle className="w-3 h-3" />
                            </Button>
                          )}
                          {task.status !== "completed" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleTaskAction(task.id, "complete")}
                              className="h-7 w-7 p-0 text-green-600"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Due: {task.dueTime}</span>
                        <span className={`font-medium ${
                          task.status === "completed" ? "text-green-600" : 
                          task.status === "in_progress" ? "text-blue-600" : "text-gray-600"
                        }`}>
                          {task.status === "completed" ? "✅ Done" : 
                           task.status === "in_progress" ? "🔄 In Progress" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Apple Design: Quick actions and activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className={`w-full justify-start ${action.color} text-white hover:scale-105 transition-all duration-200`}
                  >
                    <action.icon className="w-4 h-4 mr-3" />
                    {action.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === "success" ? "bg-green-100" : 
                      activity.type === "info" ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <activity.icon className={`w-4 h-4 ${
                        activity.type === "success" ? "text-green-600" : 
                        activity.type === "info" ? "text-blue-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.client}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 