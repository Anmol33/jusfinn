import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  IndianRupee,
  Building2,
  Package,
  CreditCard,
  Receipt,
  Percent,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { integrationService } from "@/lib/integrationService";
import { DashboardMetrics, CrossModuleAlert, AggregatedData } from "@/types/integration";

interface CustomWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'trend';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
  isVisible: boolean;
}

interface DashboardFilter {
  dateRange: string;
  vendor: string;
  department: string;
  status: string;
  amount: { min: number; max: number };
}

const CustomDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<CrossModuleAlert[]>([]);
  const [widgets, setWidgets] = useState<CustomWidget[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  
  const [filters, setFilters] = useState<DashboardFilter>({
    dateRange: 'this_month',
    vendor: 'all',
    department: 'all',
    status: 'all',
    amount: { min: 0, max: 10000000 }
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsResponse, alertsResponse] = await Promise.all([
        integrationService.getDashboardMetrics(),
        loadCrossModuleAlerts()
      ]);

      if (metricsResponse.success) {
        setMetrics(metricsResponse.data!);
      }

      setAlerts(alertsResponse);
      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock alerts data
  const loadCrossModuleAlerts = async (): Promise<CrossModuleAlert[]> => {
    return [
      {
        id: '1',
        type: 'warning',
        module: 'payables_aging',
        title: 'MSME Payment Due',
        message: 'ABC Suppliers MSME payment due in 2 days - ₹45,000',
        severity: 'high',
        actionRequired: true,
        relatedRecords: [],
        createdDate: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'error',
        module: 'purchase_bills',
        title: 'Three-Way Matching Failed',
        message: 'Bill INV/2024/123 has discrepancies with PO/2024/456',
        severity: 'critical',
        actionRequired: true,
        relatedRecords: [],
        createdDate: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'info',
        module: 'itc_management',
        title: 'ITC Filing Due',
        message: 'GSTR-3B filing due for January 2024',
        severity: 'medium',
        actionRequired: false,
        relatedRecords: [],
        createdDate: new Date().toISOString(),
      }
    ];
  };

  // Initialize dashboard
  useEffect(() => {
    loadDashboardData();
    initializeDefaultWidgets();

    // Auto-refresh setup
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadDashboardData, refreshInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const initializeDefaultWidgets = () => {
    const defaultWidgets: CustomWidget[] = [
      {
        id: 'vendor-overview',
        title: 'Vendor Overview',
        type: 'metric',
        size: 'small',
        position: { x: 0, y: 0, w: 3, h: 1 },
        config: { metric: 'vendors' },
        isVisible: true
      },
      {
        id: 'po-pipeline',
        title: 'PO Pipeline',
        type: 'chart',
        size: 'medium',
        position: { x: 3, y: 0, w: 6, h: 2 },
        config: { chartType: 'pipeline' },
        isVisible: true
      },
      {
        id: 'payment-trends',
        title: 'Payment Trends',
        type: 'chart',
        size: 'large',
        position: { x: 0, y: 2, w: 9, h: 3 },
        config: { chartType: 'trends' },
        isVisible: true
      }
    ];
    setWidgets(defaultWidgets);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Custom Dashboard - JusFinn</title>
        <meta name="description" content="Comprehensive Purchase & Expense analytics dashboard" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Purchase & Expense Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Integrated analytics across all Purchase & Expense modules
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
              {autoRefresh && <Badge variant="outline" className="ml-2">Auto-refresh ON</Badge>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Customize
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Quick Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label>Date Range</Label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This Week</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="this_quarter">This Quarter</SelectItem>
                    <SelectItem value="this_year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Vendor</Label>
                <Select 
                  value={filters.vendor} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, vendor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="preferred">Preferred</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Department</Label>
                <Select 
                  value={filters.department} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={loadDashboardData}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Banner */}
        {alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">Critical Alerts</h3>
                  <p className="text-sm text-red-700">
                    {alerts.filter(alert => alert.severity === 'critical').length} critical and{' '}
                    {alerts.filter(alert => alert.severity === 'high').length} high priority alerts require attention
                  </p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="vendor">Vendor Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Vendors</p>
                      <p className="text-2xl font-bold text-blue-900">{metrics?.totalVendors || 0}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {metrics?.activeVendors || 0} active
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Purchase Orders</p>
                      <p className="text-2xl font-bold text-green-900">{metrics?.totalPOs || 0}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {metrics?.pendingPOs || 0} pending
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Outstanding Payables</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatCurrency(metrics?.outstandingPayables || 0)}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        {metrics?.pendingBills || 0} bills pending
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                      <IndianRupee className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total ITC</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(metrics?.totalITC || 0)}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Current month
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Purchase Workflow Pipeline
                </CardTitle>
                <CardDescription>
                  Track the flow from PO creation to payment completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pipeline visualization */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {metrics?.totalPOs || 0}
                        </div>
                        <p className="text-sm font-medium mt-2">Purchase Orders</p>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-gray-400" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {metrics?.totalGRNs || 0}
                        </div>
                        <p className="text-sm font-medium mt-2">Goods Receipt</p>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-gray-400" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {metrics?.totalBills || 0}
                        </div>
                        <p className="text-sm font-medium mt-2">Bills</p>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-gray-400" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {metrics?.totalPayments || 0}
                        </div>
                        <p className="text-sm font-medium mt-2">Payments</p>
                      </div>
                    </div>
                  </div>

                  {/* Conversion rates */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">92%</p>
                      <p className="text-sm text-gray-600">PO to GRN</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">87%</p>
                      <p className="text-sm text-gray-600">GRN to Bill</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">95%</p>
                      <p className="text-sm text-gray-600">Bill to Payment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>
                  Purchase & expense trends over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end justify-between">
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                    <div key={month} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                        style={{ 
                          height: `${100 + index * 15}px`, 
                          width: '32px',
                          marginBottom: '8px'
                        }}
                      />
                      <span className="text-xs text-gray-600">{month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span className="text-sm">Purchase Orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span className="text-sm">Payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {/* MSME Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Compliant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                    {metrics?.msmeCompliance.compliant || 0}
                  </div>
                  <p className="text-sm text-green-700">MSME vendors</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-5 w-5" />
                    At Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-900">
                    {metrics?.msmeCompliance.atRisk || 0}
                  </div>
                  <p className="text-sm text-yellow-700">Due within 3 days</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    Violated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">
                    {metrics?.msmeCompliance.violated || 0}
                  </div>
                  <p className="text-sm text-red-700">Action required</p>
                </CardContent>
              </Card>
            </div>

            {/* TDS & ITC Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    TDS Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total TDS Deducted</span>
                    <span className="font-bold">{formatCurrency(metrics?.totalTDS || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Filing Due</span>
                    <Badge variant="outline">7 days</Badge>
                  </div>
                  <Progress value={85} className="w-full" />
                  <p className="text-xs text-gray-600">85% of quarterly target achieved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    ITC Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total ITC Claimed</span>
                    <span className="font-bold">{formatCurrency(metrics?.totalITC || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reversal Required</span>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">₹12,450</Badge>
                  </div>
                  <Progress value={92} className="w-full" />
                  <p className="text-xs text-gray-600">92% utilization rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getAlertBadgeColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">{alert.module}</span>
                          </div>
                        </div>
                      </div>
                      {alert.actionRequired && (
                        <Button size="sm" className="ml-4">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomDashboard; 