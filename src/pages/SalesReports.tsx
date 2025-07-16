import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Target, 
  TrendingUp, 
  DollarSign,
  Users,
  ShoppingCart,
  Receipt,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Package,
  Percent,
  Clock,
  Activity,
  Globe,
  Settings,
  Zap
} from 'lucide-react';

interface SalesMetric {
  period: string;
  totalSales: number;
  totalInvoices: number;
  totalTax: number;
  averageOrderValue: number;
  topCustomer: string;
  topProduct: string;
  growthRate: number;
}

interface GSTR1Summary {
  period: string;
  b2bSales: number;
  b2cSales: number;
  exportSales: number;
  totalTaxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTax: number;
  status: 'Draft' | 'Filed' | 'Not Filed';
  filedDate?: string;
  acknowledgmentNumber?: string;
}

interface CustomerAnalytics {
  customerCode: string;
  customerName: string;
  totalSales: number;
  totalInvoices: number;
  averageOrderValue: number;
  paymentBehavior: 'Excellent' | 'Good' | 'Average' | 'Poor';
  lastOrderDate: string;
  loyaltyScore: number;
  growthTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

interface ProductAnalytics {
  itemCode: string;
  itemName: string;
  category: string;
  totalSales: number;
  quantitySold: number;
  averageSellingPrice: number;
  profitMargin: number;
  topCustomer: string;
  growthTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

interface SalesReport {
  id: string;
  reportName: string;
  reportType: 'Sales Summary' | 'Customer Analysis' | 'Product Analysis' | 'GSTR-1' | 'Tax Summary' | 'Performance Dashboard';
  period: string;
  generatedDate: string;
  generatedBy: string;
  status: 'Generated' | 'Scheduled' | 'Failed';
  fileFormat: 'PDF' | 'Excel' | 'CSV';
  fileSize: string;
  description: string;
}

// Mock data
const mockSalesMetrics: SalesMetric[] = [
  {
    period: 'Jan 2024',
    totalSales: 813905,
    totalInvoices: 3,
    totalTax: 133155,
    averageOrderValue: 271302,
    topCustomer: 'Retail Chain Pvt Ltd',
    topProduct: 'Laptop Computer',
    growthRate: 15.2
  },
  {
    period: 'Feb 2024',
    totalSales: 950000,
    totalInvoices: 5,
    totalTax: 171000,
    averageOrderValue: 190000,
    topCustomer: 'Tech Solutions Pvt Ltd',
    topProduct: 'Software Development',
    growthRate: 16.7
  }
];

const mockGSTR1Data: GSTR1Summary[] = [
  {
    period: 'Jan 2024',
    b2bSales: 680750,
    b2cSales: 0,
    exportSales: 0,
    totalTaxableValue: 680750,
    cgstAmount: 56537.5,
    sgstAmount: 56537.5,
    igstAmount: 38250,
    cessAmount: 0,
    totalTax: 151325,
    status: 'Filed',
    filedDate: '2024-02-10',
    acknowledgmentNumber: 'ACK123456789012'
  },
  {
    period: 'Feb 2024',
    b2bSales: 850000,
    b2cSales: 50000,
    exportSales: 0,
    totalTaxableValue: 900000,
    cgstAmount: 72000,
    sgstAmount: 72000,
    igstAmount: 27000,
    cessAmount: 0,
    totalTax: 171000,
    status: 'Draft'
  }
];

const mockCustomerAnalytics: CustomerAnalytics[] = [
  {
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    totalSales: 308275,
    totalInvoices: 1,
    averageOrderValue: 308275,
    paymentBehavior: 'Excellent',
    lastOrderDate: '2024-01-30',
    loyaltyScore: 95,
    growthTrend: 'Increasing'
  },
  {
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    totalSales: 254880,
    totalInvoices: 1,
    averageOrderValue: 254880,
    paymentBehavior: 'Good',
    lastOrderDate: '2024-01-31',
    loyaltyScore: 82,
    growthTrend: 'Stable'
  },
  {
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    totalSales: 250750,
    totalInvoices: 1,
    averageOrderValue: 250750,
    paymentBehavior: 'Poor',
    lastOrderDate: '2024-02-01',
    loyaltyScore: 45,
    growthTrend: 'Decreasing'
  }
];

const mockProductAnalytics: ProductAnalytics[] = [
  {
    itemCode: 'ITEM001',
    itemName: 'Laptop Computer',
    category: 'Electronics',
    totalSales: 308275,
    quantitySold: 5,
    averageSellingPrice: 61655,
    profitMargin: 12.5,
    topCustomer: 'Tech Solutions Pvt Ltd',
    growthTrend: 'Increasing'
  },
  {
    itemCode: 'SERV001',
    itemName: 'Software Development',
    category: 'IT Services',
    totalSales: 254880,
    quantitySold: 120,
    averageSellingPrice: 2124,
    profitMargin: 25.0,
    topCustomer: 'Global Exports Ltd',
    growthTrend: 'Stable'
  },
  {
    itemCode: 'ITEM002',
    itemName: 'Office Chair',
    category: 'Furniture',
    totalSales: 250750,
    quantitySold: 25,
    averageSellingPrice: 10030,
    profitMargin: 15.0,
    topCustomer: 'Retail Chain Pvt Ltd',
    growthTrend: 'Decreasing'
  }
];

const mockReports: SalesReport[] = [
  {
    id: '1',
    reportName: 'Monthly Sales Summary - January 2024',
    reportType: 'Sales Summary',
    period: 'Jan 2024',
    generatedDate: '2024-02-01',
    generatedBy: 'Admin',
    status: 'Generated',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    description: 'Comprehensive sales summary with customer and product breakdown'
  },
  {
    id: '2',
    reportName: 'GSTR-1 Return - January 2024',
    reportType: 'GSTR-1',
    period: 'Jan 2024',
    generatedDate: '2024-02-10',
    generatedBy: 'Finance Team',
    status: 'Generated',
    fileFormat: 'Excel',
    fileSize: '1.8 MB',
    description: 'GSTR-1 return data ready for filing'
  },
  {
    id: '3',
    reportName: 'Customer Performance Analysis',
    reportType: 'Customer Analysis',
    period: 'Q4 2023',
    generatedDate: '2024-01-15',
    generatedBy: 'Sales Team',
    status: 'Generated',
    fileFormat: 'PDF',
    fileSize: '3.2 MB',
    description: 'Detailed customer performance and behavior analysis'
  }
];

export default function SalesReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Jan 2024');
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.reportType.toLowerCase().replace(/ /g, '') === selectedReportType;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generated':
        return <Badge className="bg-green-100 text-green-800">Generated</Badge>;
      case 'Scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGSTRStatusBadge = (status: string) => {
    switch (status) {
      case 'Filed':
        return <Badge className="bg-green-100 text-green-800">Filed</Badge>;
      case 'Draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'Not Filed':
        return <Badge className="bg-red-100 text-red-800">Not Filed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Increasing':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'Decreasing':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const currentMetrics = mockSalesMetrics.find(m => m.period === selectedPeriod) || mockSalesMetrics[0];
  const currentGSTR = mockGSTR1Data.find(g => g.period === selectedPeriod) || mockGSTR1Data[0];

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Sales Reports - JusFinn</title>
        <meta name="description" content="Comprehensive sales analytics with GSTR-1 preparation, performance dashboards, and compliance reporting." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Sales Reports & Analytics
          </h1>
          <p className="text-gray-600">Comprehensive sales analytics with GSTR-1 preparation and performance insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jan 2024">Jan 2024</SelectItem>
              <SelectItem value="Feb 2024">Feb 2024</SelectItem>
              <SelectItem value="Mar 2024">Mar 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Target className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Sales Report</DialogTitle>
                <DialogDescription>
                  Create custom sales reports with specific filters and formats
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Report generation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Generate Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-blue-900">₹{currentMetrics.totalSales.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">+{currentMetrics.growthRate}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-green-900">{currentMetrics.totalInvoices}</p>
                <p className="text-sm text-green-600">Avg: ₹{currentMetrics.averageOrderValue.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Tax</p>
                <p className="text-2xl font-bold text-purple-900">₹{currentMetrics.totalTax.toLocaleString()}</p>
                <p className="text-sm text-purple-600">GST Liability</p>
              </div>
              <Percent className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">GSTR-1 Status</p>
                <div className="mt-2">
                  {getGSTRStatusBadge(currentGSTR.status)}
                </div>
                {currentGSTR.filedDate && (
                  <p className="text-sm text-orange-600 mt-1">Filed: {currentGSTR.filedDate}</p>
                )}
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Dashboard */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend
                </CardTitle>
                <CardDescription>Monthly sales performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSalesMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{metric.period}</p>
                        <p className="text-sm text-gray-500">{metric.totalInvoices} invoices</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{metric.totalSales.toLocaleString()}</p>
                        <div className="flex items-center">
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 ml-1">+{metric.growthRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>Best performing customers and products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Top Customer</p>
                    <p className="font-semibold">{currentMetrics.topCustomer}</p>
                    <p className="text-sm text-gray-500">Highest revenue contributor</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Top Product</p>
                    <p className="font-semibold">{currentMetrics.topProduct}</p>
                    <p className="text-sm text-gray-500">Best selling item</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Average Order Value</p>
                    <p className="font-semibold">₹{currentMetrics.averageOrderValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Per transaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Sales Distribution
              </CardTitle>
              <CardDescription>Sales breakdown by product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockProductAnalytics.map((product, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{product.category}</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">
                      ₹{product.totalSales.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.quantitySold} units sold
                    </p>
                    <div className="mt-2">
                      <Progress value={(product.totalSales / 813905) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {((product.totalSales / 813905) * 100).toFixed(1)}% of total sales
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gstr1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                GSTR-1 Return Summary
              </CardTitle>
              <CardDescription>Monthly GSTR-1 filing status and tax summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockGSTR1Data.map((gstr, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{gstr.period}</h3>
                        <p className="text-sm text-gray-500">GSTR-1 Return</p>
                      </div>
                      <div className="text-right">
                        {getGSTRStatusBadge(gstr.status)}
                        {gstr.filedDate && (
                          <p className="text-sm text-gray-500 mt-1">Filed: {gstr.filedDate}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-600">B2B Sales</p>
                        <p className="font-semibold">₹{gstr.b2bSales.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-sm text-green-600">B2C Sales</p>
                        <p className="font-semibold">₹{gstr.b2cSales.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <p className="text-sm text-purple-600">Export Sales</p>
                        <p className="font-semibold">₹{gstr.exportSales.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <p className="text-sm text-orange-600">Total Taxable</p>
                        <p className="font-semibold">₹{gstr.totalTaxableValue.toLocaleString()}</p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-600">CGST</p>
                        <p className="font-semibold">₹{gstr.cgstAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-600">SGST</p>
                        <p className="font-semibold">₹{gstr.sgstAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-600">IGST</p>
                        <p className="font-semibold">₹{gstr.igstAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-600">Total Tax</p>
                        <p className="font-semibold">₹{gstr.totalTax.toLocaleString()}</p>
                      </div>
                    </div>

                    {gstr.acknowledgmentNumber && (
                      <div className="mt-4 p-3 bg-green-50 rounded">
                        <p className="text-sm text-green-600">Acknowledgment Number</p>
                        <p className="font-mono text-sm">{gstr.acknowledgmentNumber}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Performance Analytics
              </CardTitle>
              <CardDescription>Detailed customer behavior and sales analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Details</TableHead>
                      <TableHead>Sales Performance</TableHead>
                      <TableHead>Order Metrics</TableHead>
                      <TableHead>Payment Behavior</TableHead>
                      <TableHead>Loyalty Score</TableHead>
                      <TableHead>Growth Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCustomerAnalytics.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{customer.customerName}</div>
                            <div className="text-sm text-gray-500">{customer.customerCode}</div>
                            <div className="text-sm text-gray-500">Last Order: {customer.lastOrderDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">₹{customer.totalSales.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Total Revenue</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{customer.totalInvoices} invoices</div>
                            <div className="text-sm">Avg: ₹{customer.averageOrderValue.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            customer.paymentBehavior === 'Excellent' ? 'bg-green-100 text-green-800' :
                            customer.paymentBehavior === 'Good' ? 'bg-blue-100 text-blue-800' :
                            customer.paymentBehavior === 'Average' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {customer.paymentBehavior}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">{customer.loyaltyScore}/100</div>
                            <Progress value={customer.loyaltyScore} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(customer.growthTrend)}
                            <span className="text-sm">{customer.growthTrend}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Performance Analytics
              </CardTitle>
              <CardDescription>Sales analysis by products and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Details</TableHead>
                      <TableHead>Sales Performance</TableHead>
                      <TableHead>Quantity Metrics</TableHead>
                      <TableHead>Pricing Analysis</TableHead>
                      <TableHead>Top Customer</TableHead>
                      <TableHead>Growth Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProductAnalytics.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{product.itemName}</div>
                            <div className="text-sm text-gray-500">{product.itemCode}</div>
                            <Badge className="bg-gray-100 text-gray-800">{product.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">₹{product.totalSales.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Total Revenue</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{product.quantitySold} units</div>
                            <div className="text-sm text-gray-500">Total Sold</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">Avg: ₹{product.averageSellingPrice.toLocaleString()}</div>
                            <div className="text-sm text-green-600">Margin: {product.profitMargin}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{product.topCustomer}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(product.growthTrend)}
                            <span className="text-sm">{product.growthTrend}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reports by name or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="salessummary">Sales Summary</SelectItem>
                      <SelectItem value="customeranalysis">Customer Analysis</SelectItem>
                      <SelectItem value="productanalysis">Product Analysis</SelectItem>
                      <SelectItem value="gstr-1">GSTR-1</SelectItem>
                      <SelectItem value="taxsummary">Tax Summary</SelectItem>
                      <SelectItem value="performancedashboard">Performance Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Reports
              </CardTitle>
              <CardDescription>Download and manage previously generated sales reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>File Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{report.reportName}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {report.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">{report.reportType}</Badge>
                        </TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{report.generatedDate}</div>
                            <div className="text-sm text-gray-500">by {report.generatedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{report.fileFormat}</div>
                            <div className="text-sm text-gray-500">{report.fileSize}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 