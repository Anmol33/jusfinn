import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Filter,
  Search,
  Bell,
  User,
  Building,
  FileText,
  Flag,
  Circle,
  CheckCircle2,
  Users,
  Settings,
  ArrowRight,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  Target,
  RefreshCw,
  ChevronRight,
  Calendar,
  Zap,
  Activity,
  AlertCircle,
  Timer,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  Eye,
  UserPlus
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  client: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "in_progress" | "review" | "completed";
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  description: string;
  tags: string[];
  estimatedHours: number;
  actualHours?: number;
  progress: number;
  createdAt: string;
}

const TaskScheduler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("priority");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Apple Design: Single state for all tasks
  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: "1",
      title: "GST Return - ABC Corp",
      client: "ABC Corporation",
      type: "GST Return",
      priority: "critical",
      status: "pending",
      dueDate: "2024-01-18",
      dueTime: "2:00 PM",
      assignedTo: "You",
      description: "Monthly GST return filing for ABC Corporation",
      tags: ["GST", "Monthly", "Urgent"],
      estimatedHours: 2,
      progress: 0,
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "TDS Return - XYZ Ltd",
      client: "XYZ Industries Ltd",
      type: "TDS Return",
      priority: "critical",
      status: "in_progress",
      dueDate: "2024-01-18",
      dueTime: "4:00 PM",
      assignedTo: "You",
      description: "Q3 TDS return preparation and filing",
      tags: ["TDS", "Quarterly", "Review"],
      estimatedHours: 3,
      actualHours: 1.5,
      progress: 50,
      createdAt: "2024-01-12"
    },
    {
      id: "3",
      title: "Bank Reconciliation - DEF",
      client: "DEF Enterprises",
      type: "Bank Reconciliation", 
      priority: "high",
      status: "pending",
      dueDate: "2024-01-19",
      dueTime: "10:00 AM",
      assignedTo: "You",
      description: "December 2023 bank reconciliation",
      tags: ["Bank", "Reconciliation", "Monthly"],
      estimatedHours: 4,
      progress: 25,
      createdAt: "2024-01-16"
    },
    {
      id: "4",
      title: "ITR Preparation - GHI",
      client: "GHI Services",
      type: "Income Tax Return",
      priority: "high",
      status: "review",
      dueDate: "2024-01-20",
      dueTime: "End of day",
      assignedTo: "You",
      description: "Individual ITR preparation and review",
      tags: ["ITR", "Individual", "Preparation"],
      estimatedHours: 2,
      progress: 85,
      createdAt: "2024-01-17"
    },
    {
      id: "5",
      title: "Compliance Review - JKL",
      client: "JKL Corporation",
      type: "Compliance Review",
      priority: "medium",
      status: "pending",
      dueDate: "2024-01-21",
      dueTime: "11:00 AM",
      assignedTo: "You",
      description: "Monthly compliance status review",
      tags: ["Compliance", "Review", "Monthly"],
      estimatedHours: 1.5,
      progress: 0,
      createdAt: "2024-01-18"
    },
    {
      id: "6",
      title: "Document Review - MNO",
      client: "MNO Limited",
      type: "Document Review",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-15",
      dueTime: "5:00 PM",
      assignedTo: "You",
      description: "Annual document review completed",
      tags: ["Documents", "Annual", "Completed"],
      estimatedHours: 3,
      actualHours: 2.5,
      progress: 100,
      createdAt: "2024-01-10"
    }
  ]);

  // Apple Design: Derived state for task categorization
  const criticalTasks = allTasks.filter(t => t.priority === "critical");
  const highPriorityTasks = allTasks.filter(t => t.priority === "high");
  const mediumPriorityTasks = allTasks.filter(t => t.priority === "medium");

  // Apple Design: Clean task summary
  const taskSummary = {
    total: allTasks.length,
    critical: criticalTasks.length,
    high: highPriorityTasks.length,
    medium: mediumPriorityTasks.length,
    pending: allTasks.filter(t => t.status === "pending").length,
    inProgress: allTasks.filter(t => t.status === "in_progress").length,
    completed: allTasks.filter(t => t.status === "completed").length,
    review: allTasks.filter(t => t.status === "review").length
  };

  // Apple Design: Priority color system
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-gray-600" />;
      case "in_progress": return <Activity className="w-4 h-4 text-blue-600" />;
      case "review": return <Eye className="w-4 h-4 text-orange-600" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "review": return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleTaskAction = (action: string, taskId: string) => {
    // Apple Design: Real functional actions with state updates
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    switch (action) {
      case "start":
        // Update task status to in_progress
        setAllTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: "in_progress" as const, progress: Math.max(t.progress, 25) } : t
        ));
        toast({
          title: "▶️ Task Started",
          description: `Working on ${task.title}`,
        });
        break;
      case "complete":
        // Mark task as completed
        setAllTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: "completed" as const, progress: 100 } : t
        ));
        toast({
          title: "✅ Task Completed",
          description: `${task.title} marked as completed`,
        });
        break;
      case "pause":
        // Pause task
        setAllTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, status: "pending" as const } : t
        ));
        toast({
          title: "⏸️ Task Paused",
          description: `${task.title} paused`,
        });
        break;
      case "edit":
        // Open edit dialog (for demo, just show toast)
        toast({
          title: "✏️ Edit Task",
          description: `Opening edit dialog for ${task.title}`,
        });
        break;
      case "delete":
        // Remove task from list
        setAllTasks(prev => prev.filter(t => t.id !== taskId));
        toast({
          title: "🗑️ Task Deleted",
          description: `${task.title} removed from task list`,
        });
        break;
      case "view":
        // Show task details
        toast({
          title: "👁️ Task Details",
          description: `Viewing details for ${task.title}`,
        });
        break;
      case "assign":
        // Assign task (for demo, just show toast)
        toast({
          title: "👤 Assign Task",
          description: `Assigning ${task.title} to team member`,
        });
        break;
      default:
        toast({
          title: "Task Action",
          description: `${action} performed on ${task.title}`,
        });
    }
  };

  const handleAddTask = () => {
    // Apple Design: Real task creation with state update
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      client: "Demo Client",
      type: "General",
      priority: "medium",
      status: "pending",
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: "End of day",
      assignedTo: "You",
      description: "Demo task created from quick action",
      tags: ["New", "Demo"],
      estimatedHours: 1,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAllTasks(prev => [newTask, ...prev]);
    setShowAddDialog(false);
    
    toast({
      title: "✅ Task Added",
      description: "New task created successfully",
    });
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-1 h-12 rounded-full ${getPriorityColor(task.priority)}`} />
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-900 text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{task.client} • {task.type}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${getPriorityBadgeColor(task.priority)} text-xs font-medium`}>
                  {task.priority.toUpperCase()}
                </Badge>
                <Badge className={`${getStatusColor(task.status)} text-xs font-medium`}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1 capitalize">{task.status.replace("_", " ")}</span>
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTaskAction("view", task.id)}
              className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {task.status === "pending" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTaskAction("start", task.id)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              >
                <PlayCircle className="w-4 h-4" />
              </Button>
            )}
            {task.status === "in_progress" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTaskAction("pause", task.id)}
                className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
              >
                <PauseCircle className="w-4 h-4" />
              </Button>
            )}
            {task.status !== "completed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTaskAction("complete", task.id)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTaskAction("delete", task.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <p className="line-clamp-2">{task.description}</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Due: {task.dueTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              <span>{task.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{task.assignedTo}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Progress:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  task.status === "completed" ? "bg-green-500" : 
                  task.status === "in_progress" ? "bg-blue-500" : "bg-gray-400"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple Design: Clean header with actions */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 mt-1">Manage your priority tasks and deadlines</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task for your workflow</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Button onClick={handleAddTask} className="w-full">
                      Create Demo Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Task summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{taskSummary.total}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <CheckSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-3xl font-bold text-red-600">{taskSummary.critical}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{taskSummary.inProgress}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{taskSummary.completed}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apple Design: Task priority view */}
        <div className="space-y-8">
          {/* Critical Tasks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              Critical Tasks ({criticalTasks.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {criticalTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* High Priority Tasks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full" />
              High Priority ({highPriorityTasks.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {highPriorityTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Medium Priority Tasks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              Medium Priority ({mediumPriorityTasks.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mediumPriorityTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler; 