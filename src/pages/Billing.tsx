import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  IndianRupee, 
  Clock, 
  User, 
  Building, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Target,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Send,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Timer,
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  PieChart,
  BarChart3,
  ArrowRight,
  PlayCircle,
  Pause,
  StopCircle,
  DollarSign,
  Percent,
  Mail,
  Phone,
  Settings,
  Activity,
  Wallet,
  TrendingUpIcon,
  AlertCircle,
  ClockIcon,
  UserIcon,
  BuildingIcon
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Billing = () => {
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);

  // Billing metrics
  const billingMetrics = {
    totalRevenue: 2850000, // ₹28.5L
    monthlyRevenue: 450000, // ₹4.5L
    pendingInvoices: 12,
    outstandingAmount: 680000, // ₹6.8L
    averageRealization: 87.5, // %
    billableHours: 124,
    nonBillableHours: 18,
    utilizationRate: 87.3 // %
  };

  // Time tracking data
  const timeTracking = [
    {
      id: 1,
      client: "ABC Corporation",
      project: "GST Return Filing",
      assignee: "Rahul Sharma",
      date: "2024-01-19",
      hours: 4.5,
      rate: 2500,
      amount: 11250,
      status: "approved",
      description: "GST return preparation and filing",
      billable: true
    },
    {
      id: 2,
      client: "XYZ Industries Ltd",
      project: "Income Tax Return",
      assignee: "Priya Patel",
      date: "2024-01-19",
      hours: 6.0,
      rate: 3000,
      amount: 18000,
      status: "pending",
      description: "ITR-6 preparation and computation",
      billable: true
    },
    {
      id: 3,
      client: "DEF Enterprises",
      project: "TDS Return",
      assignee: "Amit Kumar",
      date: "2024-01-19",
      hours: 2.5,
      rate: 2000,
      amount: 5000,
      status: "approved",
      description: "TDS return filing and certificate generation",
      billable: true
    },
    {
      id: 4,
      client: "Internal",
      project: "Team Meeting",
      assignee: "CA Mehta",
      date: "2024-01-19",
      hours: 1.0,
      rate: 0,
      amount: 0,
      status: "logged",
      description: "Weekly team coordination meeting",
      billable: false
    }
  ];

  // Invoice data
  const invoices = [
    {
      id: "INV-2024-001",
      client: "ABC Corporation",
      amount: 75000,
      dueDate: "2024-01-25",
      status: "pending",
      issueDate: "2024-01-15",
      services: ["GST Filing", "TDS Return"],
      hours: 12.5,
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2024-002",
      client: "XYZ Industries Ltd",
      amount: 125000,
      dueDate: "2024-01-20",
      status: "overdue",
      issueDate: "2024-01-10",
      services: ["Income Tax Return", "Audit"],
      hours: 25.0,
      paymentTerms: "Net 30"
    },
    {
      id: "INV-2024-003",
      client: "GHI Services",
      amount: 45000,
      dueDate: "2024-01-30",
      status: "paid",
      issueDate: "2024-01-18",
      services: ["GST Filing"],
      hours: 8.0,
      paymentTerms: "Net 15"
    },
    {
      id: "INV-2024-004",
      client: "JKL Manufacturing",
      amount: 95000,
      dueDate: "2024-02-05",
      status: "draft",
      issueDate: "2024-01-19",
      services: ["Notice Response", "Compliance"],
      hours: 18.5,
      paymentTerms: "Net 30"
    }
  ];

  // Client billing rates
  const clientRates = [
    { client: "ABC Corporation", rate: 2500, type: "per_hour", category: "Premium" },
    { client: "XYZ Industries Ltd", rate: 3000, type: "per_hour", category: "Enterprise" },
    { client: "DEF Enterprises", rate: 2000, type: "per_hour", category: "Standard" },
    { client: "GHI Services", rate: 2200, type: "per_hour", category: "Standard" },
    { client: "JKL Manufacturing", rate: 2800, type: "per_hour", category: "Premium" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-300";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-300";
      case "overdue": return "bg-red-100 text-red-800 border-red-300";
      case "draft": return "bg-blue-100 text-blue-800 border-blue-300";
      case "approved": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    return <Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const handleStartTimer = (clientId: number) => {
    setActiveTimer(clientId);
    toast({
      title: "Timer Started",
      description: `Time tracking started for client ${clientId}`,
    });
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
    toast({
      title: "Timer Stopped",
      description: "Time entry saved successfully",
    });
  };

  const handleGenerateInvoice = (clientId: string) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice created for ${clientId}`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoiceId} sent to client`,
    });
  };

  const handleMarkPaid = (invoiceId: string) => {
    toast({
      title: "Payment Recorded",
      description: `Invoice ${invoiceId} marked as paid`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing & Invoicing</h1>
              <p className="text-gray-600 mt-1">Time tracking, invoicing and revenue management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>Generate invoice for client services</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client">Client</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientRates.map(rate => (
                              <SelectItem key={rate.client} value={rate.client}>
                                {rate.client}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" placeholder="Enter amount" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="services">Services</Label>
                      <Textarea id="services" placeholder="Describe services provided" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hours">Hours</Label>
                        <Input id="hours" type="number" placeholder="Total hours" />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        handleGenerateInvoice("new");
                        setIsInvoiceDialogOpen(false);
                      }}>
                        Generate Invoice
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingMetrics.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">+12.5% from last month</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Outstanding Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingMetrics.outstandingAmount)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-red-100 text-red-800">{billingMetrics.pendingInvoices} pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Billable Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{billingMetrics.billableHours}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {billingMetrics.utilizationRate}% utilization
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Realization Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{billingMetrics.averageRealization}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-purple-100 text-purple-800">Above target</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="time_tracking">Time Tracking</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Latest billing activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.slice(0, 4).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{invoice.id}</h4>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="text-sm text-gray-600">{invoice.client}</p>
                          <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                          <p className="text-sm text-gray-500">{invoice.hours}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Time Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Time Tracking</CardTitle>
                  <CardDescription>Current time entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeTracking.slice(0, 4).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{entry.project}</h4>
                            {getStatusBadge(entry.status)}
                          </div>
                          <p className="text-sm text-gray-600">{entry.client}</p>
                          <p className="text-sm text-gray-500">by {entry.assignee}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{entry.hours}h</p>
                          <p className="text-sm text-gray-500">{formatCurrency(entry.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 flex-col bg-blue-600 hover:bg-blue-700">
                    <Timer className="w-6 h-6 mb-1" />
                    Start Timer
                  </Button>
                  <Button className="h-16 flex-col bg-green-600 hover:bg-green-700">
                    <Receipt className="w-6 h-6 mb-1" />
                    Generate Invoice
                  </Button>
                  <Button className="h-16 flex-col bg-purple-600 hover:bg-purple-700">
                    <BarChart3 className="w-6 h-6 mb-1" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Invoices</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold">{invoice.id}</h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{invoice.client}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {invoice.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{invoice.hours} hours</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        <p className="text-sm text-gray-500">{invoice.paymentTerms}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                        {invoice.status === "pending" && (
                          <Button size="sm" onClick={() => handleMarkPaid(invoice.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time_tracking" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Time Tracking</h2>
              <div className="flex items-center space-x-2">
                {activeTimer ? (
                  <Button variant="outline" onClick={handleStopTimer}>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Timer
                  </Button>
                ) : (
                  <Button onClick={() => handleStartTimer(1)}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Timer
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {timeTracking.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold">{entry.project}</h3>
                          {getStatusBadge(entry.status)}
                          <Badge variant={entry.billable ? "default" : "secondary"}>
                            {entry.billable ? "Billable" : "Non-billable"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{entry.client}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{entry.assignee}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{entry.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{entry.hours}h</p>
                        <p className="text-sm text-gray-500">Rate: {formatCurrency(entry.rate)}/hr</p>
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(entry.amount)}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {entry.status === "pending" && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold">{formatCurrency(billingMetrics.monthlyRevenue)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <span className="font-semibold">{formatCurrency(400000)}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="font-semibold">{formatCurrency(500000)}</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientRates.slice(0, 5).map((client) => (
                      <div key={client.client} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{client.client}</p>
                          <p className="text-sm text-gray-600">{client.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(client.rate)}/hr</p>
                        </div>
                      </div>
                    ))}
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

export default Billing; 