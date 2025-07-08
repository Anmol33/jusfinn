import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Activity,
  Users,
  IndianRupee,
  Calendar,
  FileText,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Printer,
  Mail,
  Building,
  User,
  Timer,
  DollarSign,
  Percent,
  Award,
  Zap,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Info,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUpIcon,
  Calculator,
  Receipt,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Key performance metrics
  const performanceMetrics = {
    totalRevenue: 2850000, // ₹28.5L
    monthlyGrowth: 12.5, // %
    activeClients: 156,
    completedTasks: 342,
    averageRealization: 87.5, // %
    teamUtilization: 89.2, // %
    complianceScore: 96.8, // %
    clientSatisfaction: 4.6 // /5
  };

  // Revenue analytics
  const revenueData = [
    { month: "Jan", revenue: 380000, target: 400000, growth: 8.5 },
    { month: "Feb", revenue: 420000, target: 400000, growth: 12.3 },
    { month: "Mar", revenue: 450000, target: 450000, growth: 15.2 },
    { month: "Apr", revenue: 485000, target: 450000, growth: 18.7 },
    { month: "May", revenue: 520000, target: 500000, growth: 22.1 },
    { month: "Jun", revenue: 545000, target: 500000, growth: 25.4 }
  ];

  // Client performance
  const clientPerformance = [
    { 
      client: "ABC Corporation", 
      revenue: 285000, 
      projects: 12, 
      completion: 95, 
      satisfaction: 4.8,
      category: "Enterprise",
      growth: 18.5
    },
    { 
      client: "XYZ Industries Ltd", 
      revenue: 245000, 
      projects: 8, 
      completion: 89, 
      satisfaction: 4.5,
      category: "Mid-Market",
      growth: 12.3
    },
    { 
      client: "DEF Enterprises", 
      revenue: 180000, 
      projects: 15, 
      completion: 92, 
      satisfaction: 4.7,
      category: "SME",
      growth: 22.1
    },
    { 
      client: "GHI Services", 
      revenue: 165000, 
      projects: 10, 
      completion: 88, 
      satisfaction: 4.4,
      category: "SME",
      growth: 8.7
    },
    { 
      client: "JKL Manufacturing", 
      revenue: 220000, 
      projects: 9, 
      completion: 94, 
      satisfaction: 4.6,
      category: "Premium",
      growth: 15.2
    }
  ];

  // Service line performance
  const serviceLines = [
    { 
      service: "Income Tax Returns", 
      revenue: 1200000, 
      count: 156, 
      avgValue: 7692, 
      growth: 15.2,
      margin: 78.5
    },
    { 
      service: "GST Services", 
      revenue: 890000, 
      count: 124, 
      avgValue: 7177, 
      growth: 22.1,
      margin: 82.1
    },
    { 
      service: "Audit & Assurance", 
      revenue: 650000, 
      count: 42, 
      avgValue: 15476, 
      growth: 8.7,
      margin: 65.3
    },
    { 
      service: "TDS & Compliance", 
      revenue: 420000, 
      count: 89, 
      avgValue: 4719, 
      growth: 18.9,
      margin: 85.2
    },
    { 
      service: "Notice Management", 
      revenue: 285000, 
      count: 32, 
      avgValue: 8906, 
      growth: 25.4,
      margin: 72.8
    }
  ];

  // Team productivity
  const teamProductivity = [
    { 
      name: "Rahul Sharma", 
      billableHours: 165, 
      revenue: 412500, 
      utilization: 95.2, 
      efficiency: 89.5,
      clients: 8,
      rating: 4.8
    },
    { 
      name: "Priya Patel", 
      billableHours: 142, 
      revenue: 426000, 
      utilization: 87.6, 
      efficiency: 92.1,
      clients: 6,
      rating: 4.7
    },
    { 
      name: "Amit Kumar", 
      billableHours: 138, 
      revenue: 276000, 
      utilization: 78.2, 
      efficiency: 85.3,
      clients: 9,
      rating: 4.5
    },
    { 
      name: "Sita Verma", 
      billableHours: 125, 
      revenue: 312500, 
      utilization: 82.5, 
      efficiency: 88.7,
      clients: 7,
      rating: 4.6
    },
    { 
      name: "Neha Gupta", 
      billableHours: 156, 
      revenue: 374400, 
      utilization: 91.8, 
      efficiency: 90.2,
      clients: 8,
      rating: 4.9
    }
  ];

  // Compliance metrics
  const complianceMetrics = {
    totalFilings: 245,
    onTimeFilings: 238,
    overdueFilings: 7,
    complianceRate: 97.1,
    averageProcessingTime: 2.8, // days
    qualityScore: 96.8,
    clientApprovalRate: 94.2,
    revisionRate: 5.8
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-green-500";
    if (utilization >= 80) return "bg-blue-500";
    if (utilization >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Report has been exported successfully",
    });
  };

  const handleSendReport = () => {
    toast({
      title: "Report Sent",
      description: "Report has been sent to stakeholders",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Custom report has been generated",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Performance insights and business intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Custom Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceMetrics.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {getGrowthIcon(performanceMetrics.monthlyGrowth)}
                <span className={`ml-1 text-sm font-medium ${getGrowthColor(performanceMetrics.monthlyGrowth)}`}>
                  {performanceMetrics.monthlyGrowth}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.activeClients}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">+8 new this month</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Utilization</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.teamUtilization}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={performanceMetrics.teamUtilization} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.complianceScore}%</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-2">
                <Badge className="bg-emerald-100 text-emerald-800">Excellent</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Reports */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue vs target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.slice(-3).map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{data.month}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{formatCurrency(data.revenue)}</span>
                            <span className={`text-xs font-medium ${getGrowthColor(data.growth)}`}>
                              {data.growth}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(data.revenue / data.target) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Target: {formatCurrency(data.target)}</span>
                            <span>{Math.round((data.revenue / data.target) * 100)}% achieved</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>Revenue by service line</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceLines.slice(0, 5).map((service) => (
                      <div key={service.service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.service}</h4>
                          <p className="text-sm text-gray-600">{service.count} projects</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                          <div className="flex items-center text-sm">
                            {getGrowthIcon(service.growth)}
                            <span className={`ml-1 ${getGrowthColor(service.growth)}`}>
                              {service.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{performanceMetrics.completedTasks}</div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{performanceMetrics.averageRealization}%</div>
                    <div className="text-sm text-gray-600">Average Realization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{performanceMetrics.clientSatisfaction}/5</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{performanceMetrics.complianceScore}%</div>
                    <div className="text-sm text-gray-600">Compliance Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>By service line</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceLines.map((service) => (
                      <div key={service.service} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{service.service}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(service.revenue)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <Progress value={(service.revenue / 1200000) * 100} className="h-2" />
                          </div>
                          <div className="flex items-center text-sm">
                            {getGrowthIcon(service.growth)}
                            <span className={`ml-1 ${getGrowthColor(service.growth)}`}>
                              {service.growth}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Avg: {formatCurrency(service.avgValue)}</span>
                          <span>Margin: {service.margin}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>Revenue vs target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{data.month} 2024</p>
                            <p className="text-sm text-gray-600">
                              {Math.round((data.revenue / data.target) * 100)}% of target
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(data.revenue)}</p>
                          <div className="flex items-center text-sm">
                            {getGrowthIcon(data.growth)}
                            <span className={`ml-1 ${getGrowthColor(data.growth)}`}>
                              {data.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Client Performance</h2>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              
              {clientPerformance.map((client) => (
                <Card key={client.client} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold">{client.client}</h3>
                          <Badge variant="secondary">{client.category}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-semibold">{formatCurrency(client.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Projects</p>
                            <p className="font-semibold">{client.projects}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Completion</p>
                            <p className={`font-semibold ${getPerformanceColor(client.completion)}`}>
                              {client.completion}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Satisfaction</p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="ml-1 font-semibold">{client.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm">
                          {getGrowthIcon(client.growth)}
                          <span className={`ml-1 ${getGrowthColor(client.growth)}`}>
                            {client.growth}%
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Team Productivity</h2>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
              </div>
              
              {teamProductivity.map((member) => (
                <Card key={member.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{member.name}</h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">{member.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-semibold">{formatCurrency(member.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Hours</p>
                            <p className="font-semibold">{member.billableHours}h</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Utilization</p>
                            <p className={`font-semibold ${getPerformanceColor(member.utilization)}`}>
                              {member.utilization}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Clients</p>
                            <p className="font-semibold">{member.clients}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-16 relative">
                          <div className="w-full h-full bg-gray-200 rounded-full">
                            <div 
                              className={`h-full ${getUtilizationColor(member.utilization)} rounded-full`}
                              style={{ width: `${member.utilization}%` }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">
                              {Math.round(member.utilization)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Utilization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                  <CardDescription>Filing performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Filings</span>
                      <span className="font-semibold">{complianceMetrics.totalFilings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">On-Time Filings</span>
                      <span className="font-semibold text-green-600">{complianceMetrics.onTimeFilings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Overdue Filings</span>
                      <span className="font-semibold text-red-600">{complianceMetrics.overdueFilings}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Compliance Rate</span>
                        <span className="font-semibold text-emerald-600">{complianceMetrics.complianceRate}%</span>
                      </div>
                      <Progress value={complianceMetrics.complianceRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                  <CardDescription>Service quality indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quality Score</span>
                      <span className="font-semibold text-blue-600">{complianceMetrics.qualityScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Client Approval Rate</span>
                      <span className="font-semibold text-green-600">{complianceMetrics.clientApprovalRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revision Rate</span>
                      <span className="font-semibold text-yellow-600">{complianceMetrics.revisionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Processing Time</span>
                      <span className="font-semibold">{complianceMetrics.averageProcessingTime} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{complianceMetrics.complianceRate}%</div>
                    <div className="text-sm text-gray-600">Overall Compliance</div>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-800">Excellent</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{complianceMetrics.averageProcessingTime}</div>
                    <div className="text-sm text-gray-600">Avg Processing Days</div>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">Within Target</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{complianceMetrics.qualityScore}%</div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                    <Badge className="mt-2 bg-purple-100 text-purple-800">High Quality</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports; 