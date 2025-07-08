import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Building, 
  User, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Settings,
  Download,
  Upload,
  Target,
  TrendingUp,
  Shield,
  Star,
  ChevronRight,
  Activity,
  Zap,
  Building2,
  UserCheck,
  UserX,
  AlertCircle,
  Crown,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Client {
  id: string;
  name: string;
  type: "Individual" | "Company" | "Partnership" | "LLP" | "Trust";
  pan: string;
  gstin?: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive" | "pending" | "suspended";
  nextDue: string;
  lastActivity: string;
  complianceScore: number;
  monthlyRevenue: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  joinedDate: string;
  assignedCA: string;
  priority: "high" | "medium" | "low";
}

const ClientManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Apple Design: State management for clients
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "ABC Corporation",
      type: "Company",
      pan: "ABCDE1234F",
      gstin: "07ABCDE1234F1Z5",
      email: "finance@abccorp.com",
      phone: "+91 98765 43210",
      address: "Mumbai, Maharashtra",
      status: "active",
      nextDue: "Jan 20, 2024",
      lastActivity: "2 hours ago",
      complianceScore: 95,
      monthlyRevenue: 125000,
      totalTasks: 15,
      pendingTasks: 3,
      completedTasks: 12,
      joinedDate: "2023-04-15",
      assignedCA: "You",
      priority: "high"
    },
    {
      id: "2",
      name: "XYZ Industries Ltd",
      type: "Company",
      pan: "XYZAB5678G",
      gstin: "27XYZAB5678G1Z8",
      email: "accounts@xyzind.com",
      phone: "+91 87654 32109",
      address: "Delhi, NCR",
      status: "active",
      nextDue: "Jan 22, 2024",
      lastActivity: "1 day ago",
      complianceScore: 88,
      monthlyRevenue: 85000,
      totalTasks: 12,
      pendingTasks: 2,
      completedTasks: 10,
      joinedDate: "2023-02-20",
      assignedCA: "You",
      priority: "high"
    },
    {
      id: "3",
      name: "Rajesh Kumar",
      type: "Individual",
      pan: "DEFGH9012H",
      email: "rajesh.kumar@email.com",
      phone: "+91 76543 21098",
      address: "Bangalore, Karnataka",
      status: "active",
      nextDue: "Jan 25, 2024",
      lastActivity: "3 days ago",
      complianceScore: 92,
      monthlyRevenue: 15000,
      totalTasks: 8,
      pendingTasks: 1,
      completedTasks: 7,
      joinedDate: "2023-06-10",
      assignedCA: "You",
      priority: "medium"
    },
    {
      id: "4",
      name: "DEF Enterprises",
      type: "Partnership",
      pan: "GHIJK3456I",
      gstin: "33GHIJK3456I1Z2",
      email: "partner@defent.com",
      phone: "+91 65432 10987",
      address: "Chennai, Tamil Nadu",
      status: "pending",
      nextDue: "Jan 28, 2024",
      lastActivity: "1 week ago",
      complianceScore: 75,
      monthlyRevenue: 45000,
      totalTasks: 10,
      pendingTasks: 5,
      completedTasks: 5,
      joinedDate: "2023-12-01",
      assignedCA: "You",
      priority: "medium"
    },
    {
      id: "5",
      name: "Priya Sharma",
      type: "Individual",
      pan: "JKLMN7890J",
      email: "priya.sharma@email.com",
      phone: "+91 54321 09876",
      address: "Pune, Maharashtra",
      status: "active",
      nextDue: "Feb 1, 2024",
      lastActivity: "5 days ago",
      complianceScore: 90,
      monthlyRevenue: 12000,
      totalTasks: 6,
      pendingTasks: 0,
      completedTasks: 6,
      joinedDate: "2023-08-15",
      assignedCA: "You",
      priority: "low"
    },
    {
      id: "6",
      name: "GHI Services LLP",
      type: "LLP",
      pan: "MNOPQ4567K",
      gstin: "19MNOPQ4567K1Z9",
      email: "admin@ghiservices.com",
      phone: "+91 43210 98765",
      address: "Hyderabad, Telangana",
      status: "inactive",
      nextDue: "Jan 30, 2024",
      lastActivity: "2 weeks ago",
      complianceScore: 65,
      monthlyRevenue: 35000,
      totalTasks: 8,
      pendingTasks: 8,
      completedTasks: 0,
      joinedDate: "2023-01-10",
      assignedCA: "You",
      priority: "low"
    }
  ]);

  // Apple Design: Clean summary statistics
  const clientSummary = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    pending: clients.filter(c => c.status === "pending").length,
    inactive: clients.filter(c => c.status === "inactive").length,
    highPriority: clients.filter(c => c.priority === "high").length,
    totalRevenue: clients.reduce((sum, c) => sum + c.monthlyRevenue, 0),
    avgCompliance: Math.round(clients.reduce((sum, c) => sum + c.complianceScore, 0) / clients.length),
    pendingTasks: clients.reduce((sum, c) => sum + c.pendingTasks, 0)
  };

  // Apple Design: Status and priority color systems
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "inactive": return <UserX className="w-4 h-4 text-gray-600" />;
      case "suspended": return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case "Company": return <Building2 className="w-4 h-4 text-blue-600" />;
      case "Individual": return <User className="w-4 h-4 text-green-600" />;
      case "Partnership": return <Users className="w-4 h-4 text-purple-600" />;
      case "LLP": return <Briefcase className="w-4 h-4 text-orange-600" />;
      case "Trust": return <Shield className="w-4 h-4 text-indigo-600" />;
      default: return <Building className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleClientAction = (action: string, clientId: string) => {
    // Apple Design: Real functional actions with state updates
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    switch (action) {
      case "View":
        toast({
          title: `👁️ Viewing: ${client.name}`,
          description: `Opening ${client.type} profile and task history...`,
        });
        navigate("/task-scheduler");
        break;
      case "Edit":
        toast({
          title: `✏️ Editing: ${client.name}`,
          description: "Opening client details for modification...",
        });
        break;
      case "Add Task":
        // Update client task count with real state change
        setClients(prev => prev.map(c => 
          c.id === clientId 
            ? { ...c, pendingTasks: c.pendingTasks + 1, totalTasks: c.totalTasks + 1 }
            : c
        ));
        toast({
          title: `➕ New Task for ${client.name}`,
          description: "Task added successfully",
        });
        break;
      case "Activate":
        // Change client status to active
        setClients(prev => prev.map(c => 
          c.id === clientId 
            ? { ...c, status: "active" as const, lastActivity: new Date().toISOString().split('T')[0] }
            : c
        ));
        toast({
          title: `✅ Client Activated`,
          description: `${client.name} is now active`,
        });
        break;
      case "Suspend":
        // Change client status to suspended
        setClients(prev => prev.map(c => 
          c.id === clientId 
            ? { ...c, status: "suspended" as const }
            : c
        ));
        toast({
          title: `⏸️ Client Suspended`,
          description: `${client.name} has been suspended`,
        });
        break;
      case "Delete":
        // Remove client from list
        setClients(prev => prev.filter(c => c.id !== clientId));
        toast({
          title: `🗑️ Client Deleted`,
          description: `${client.name} removed from client list`,
        });
        break;
      case "View Documents":
        toast({
          title: `📁 Documents: ${client.name}`,
          description: "Opening client document library...",
        });
        navigate("/document-center");
        break;
      case "Generate Report":
        toast({
          title: `📊 Generating Report: ${client.name}`,
          description: "Creating compliance and financial summary...",
        });
        navigate("/reports");
        break;
      default:
        toast({
          title: `Client ${action}`,
          description: `${client.name} • ${action} completed`,
        });
    }
  };

  const handleAddClient = () => {
    // Apple Design: Progressive disclosure for client onboarding
    toast({
      title: "➕ New Client Registration",
      description: "Opening smart client onboarding wizard...",
    });
    // In real app: Open multi-step modal with client type selection, 
    // smart form with PAN validation, GSTIN verification, etc.
  };

  const ClientCard = ({ client }: { client: Client }) => (
    <Card className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50">
              {getClientTypeIcon(client.type)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-900 text-lg">{client.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{client.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClientAction("View", client.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClientAction("Edit", client.id)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{client.phone}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{client.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Next Due: {client.nextDue}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${getStatusColor(client.status)} text-xs font-medium`}>
            {getStatusIcon(client.status)}
            <span className="ml-1">{client.status.toUpperCase()}</span>
          </Badge>
          <Badge className={`${getPriorityColor(client.priority)} text-xs font-medium`}>
            {client.priority.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Compliance Score</span>
            <span className={`text-sm font-bold ${getComplianceColor(client.complianceScore)}`}>
              {client.complianceScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                client.complianceScore >= 90 ? 'bg-green-500' : 
                client.complianceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${client.complianceScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{client.totalTasks}</div>
            <div className="text-xs text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{client.pendingTasks}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">₹{(client.monthlyRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">Monthly</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Last Activity: {client.lastActivity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClientAction("Add Task", client.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.pan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Apple Design: Clean, minimal header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clients</h1>
              <p className="text-gray-500 mt-1 font-medium">Manage your client relationships and tasks</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-white/90 backdrop-blur-sm border-gray-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/90 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 bg-white/90 backdrop-blur-sm border-gray-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="LLP">LLP</SelectItem>
                  <SelectItem value="Trust">Trust</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddClient}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple Design: Client summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clientSummary.total}</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Clients</p>
                  <p className="text-2xl font-bold text-green-600">{clientSummary.active}</p>
                </div>
                <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">₹{(clientSummary.totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Compliance</p>
                  <p className="text-2xl font-bold text-green-600">{clientSummary.avgCompliance}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apple Design: Client Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Clients ({filteredClients.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-gray-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-gray-200">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </div>

        {/* Apple Design: Empty state */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement; 