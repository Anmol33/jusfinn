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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Eye, 
  Copy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  Truck,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Download,
  Share,
  Target,
  Users,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';

interface OrderItem {
  itemCode: string;
  itemName: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  orderedQty: number;
  deliveredQty: number;
  pendingQty: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  deliveryDate: string;
  status: 'Pending' | 'Partial' | 'Delivered';
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  quotationRef?: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: string;
  salesPerson: string;
  status: 'Draft' | 'Confirmed' | 'In Production' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: OrderItem[];
  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  advanceReceived: number;
  balanceAmount: number;
  termsAndConditions: string;
  notes: string;
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  approvalWorkflow: {
    requiresApproval: boolean;
    approvedBy?: string;
    approvalDate?: string;
    approvalNotes?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  };
  progressTracking: {
    orderConfirmed: boolean;
    productionStarted: boolean;
    qualityChecked: boolean;
    packaged: boolean;
    shipped: boolean;
    delivered: boolean;
  };
  deliveryTracking?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    currentStatus: string;
  };
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for sales orders
const mockOrders: SalesOrder[] = [
  {
    id: '1',
    orderNumber: 'SO/2024/001',
    orderDate: '2024-01-20',
    quotationRef: 'QUO/2024/001',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerEmail: 'rahul@techsolutions.com',
    customerPhone: '+91-9876543210',
    billingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    shippingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    salesPerson: 'Amit Kumar',
    status: 'Shipped',
    priority: 'High',
    expectedDeliveryDate: '2024-01-30',
    actualDeliveryDate: '2024-01-28',
    items: [
      {
        itemCode: 'ITEM001',
        itemName: 'Laptop Computer',
        description: 'High-performance business laptop',
        hsnSacCode: '84713000',
        quantity: 5,
        orderedQty: 5,
        deliveredQty: 5,
        pendingQty: 0,
        unit: 'NOS',
        unitPrice: 55000,
        discount: 5,
        discountType: 'percentage',
        taxableAmount: 261250,
        gstRate: 18,
        gstAmount: 47025,
        totalAmount: 308275,
        deliveryDate: '2024-01-30',
        status: 'Delivered'
      }
    ],
    subTotal: 275000,
    totalDiscount: 13750,
    totalTaxableAmount: 261250,
    cgst: 23512.5,
    sgst: 23512.5,
    igst: 0,
    totalTax: 47025,
    grandTotal: 308275,
    advanceReceived: 150000,
    balanceAmount: 158275,
    termsAndConditions: 'Standard terms and conditions apply. Payment within 30 days.',
    notes: 'Priority order - expedite delivery',
    paymentTerms: '30 days net',
    deliveryTerms: '7-10 working days',
    warranty: '1 year manufacturer warranty',
    approvalWorkflow: {
      requiresApproval: true,
      approvedBy: 'Sales Manager',
      approvalDate: '2024-01-20',
      approvalNotes: 'Approved for high-value customer',
      status: 'Approved'
    },
    progressTracking: {
      orderConfirmed: true,
      productionStarted: true,
      qualityChecked: true,
      packaged: true,
      shipped: true,
      delivered: true
    },
    deliveryTracking: {
      carrier: 'Blue Dart Express',
      trackingNumber: 'BD123456789',
      estimatedDelivery: '2024-01-30',
      currentStatus: 'Delivered'
    },
    createdDate: '2024-01-20',
    lastModified: '2024-01-28',
    createdBy: 'Admin'
  },
  {
    id: '2',
    orderNumber: 'SO/2024/002',
    orderDate: '2024-01-22',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerEmail: 'priya@globalexports.com',
    customerPhone: '+91-9123456789',
    billingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    shippingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    salesPerson: 'Priya Sharma',
    status: 'In Production',
    priority: 'Medium',
    expectedDeliveryDate: '2024-02-15',
    items: [
      {
        itemCode: 'SERV001',
        itemName: 'Software Development',
        description: 'Custom software development services',
        hsnSacCode: '998314',
        quantity: 200,
        orderedQty: 200,
        deliveredQty: 120,
        pendingQty: 80,
        unit: 'HOURS',
        unitPrice: 2000,
        discount: 10,
        discountType: 'percentage',
        taxableAmount: 360000,
        gstRate: 18,
        gstAmount: 64800,
        totalAmount: 424800,
        deliveryDate: '2024-02-15',
        status: 'Partial'
      }
    ],
    subTotal: 400000,
    totalDiscount: 40000,
    totalTaxableAmount: 360000,
    cgst: 32400,
    sgst: 32400,
    igst: 0,
    totalTax: 64800,
    grandTotal: 424800,
    advanceReceived: 212400,
    balanceAmount: 212400,
    termsAndConditions: 'Payment in milestones. Quality assurance included.',
    notes: 'Development project with 8-week timeline',
    paymentTerms: '50% advance, 50% on completion',
    deliveryTerms: '8-10 weeks',
    warranty: '6 months post-delivery support',
    approvalWorkflow: {
      requiresApproval: true,
      approvedBy: 'Project Manager',
      approvalDate: '2024-01-22',
      approvalNotes: 'Technical feasibility confirmed',
      status: 'Approved'
    },
    progressTracking: {
      orderConfirmed: true,
      productionStarted: true,
      qualityChecked: false,
      packaged: false,
      shipped: false,
      delivered: false
    },
    createdDate: '2024-01-22',
    lastModified: '2024-01-26',
    createdBy: 'Admin'
  },
  {
    id: '3',
    orderNumber: 'SO/2024/003',
    orderDate: '2024-01-25',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerEmail: 'amit@retailchain.com',
    customerPhone: '+91-9898765432',
    billingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    shippingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    salesPerson: 'Suresh Patel',
    status: 'Confirmed',
    priority: 'High',
    expectedDeliveryDate: '2024-02-10',
    items: [
      {
        itemCode: 'ITEM002',
        itemName: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        hsnSacCode: '94013000',
        quantity: 25,
        orderedQty: 25,
        deliveredQty: 0,
        pendingQty: 25,
        unit: 'NOS',
        unitPrice: 8500,
        discount: 0,
        discountType: 'amount',
        taxableAmount: 212500,
        gstRate: 18,
        gstAmount: 38250,
        totalAmount: 250750,
        deliveryDate: '2024-02-10',
        status: 'Pending'
      }
    ],
    subTotal: 212500,
    totalDiscount: 0,
    totalTaxableAmount: 212500,
    cgst: 19125,
    sgst: 19125,
    igst: 0,
    totalTax: 38250,
    grandTotal: 250750,
    advanceReceived: 0,
    balanceAmount: 250750,
    termsAndConditions: 'Standard warranty and return policy applies.',
    notes: 'Bulk order - coordinate with warehouse',
    paymentTerms: '45 days net',
    deliveryTerms: '15-20 working days',
    warranty: '2 years warranty',
    approvalWorkflow: {
      requiresApproval: false,
      status: 'Approved'
    },
    progressTracking: {
      orderConfirmed: true,
      productionStarted: false,
      qualityChecked: false,
      packaged: false,
      shipped: false,
      delivered: false
    },
    createdDate: '2024-01-25',
    lastModified: '2024-01-26',
    createdBy: 'Admin'
  }
];

export default function SalesOrder() {
  const [orders] = useState<SalesOrder[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase().replace(/ /g, '') === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case 'In Production':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Production</Badge>;
      case 'Ready to Ship':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Ready to Ship</Badge>;
      case 'Shipped':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Low</Badge>;
      case 'Medium':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Medium</Badge>;
      case 'High':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'Urgent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getProgressPercentage = (progress: any) => {
    const totalSteps = Object.keys(progress).length;
    const completedSteps = Object.values(progress).filter(Boolean).length;
    return (completedSteps / totalSteps) * 100;
  };

  const getDeliveryStatus = (expectedDate: string, actualDate?: string, status?: string) => {
    if (actualDate) {
      const expected = new Date(expectedDate);
      const actual = new Date(actualDate);
      if (actual <= expected) {
        return <Badge className="bg-green-100 text-green-800">On Time</Badge>;
      } else {
        return <Badge className="bg-red-100 text-red-800">Delayed</Badge>;
      }
    }
    
    const today = new Date();
    const expected = new Date(expectedDate);
    const daysLeft = Math.ceil((expected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{daysLeft} days left</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Sales Order - JusFinn</title>
        <meta name="description" content="Manage sales orders with delivery tracking, approval workflows, and progress monitoring." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Sales Order
          </h1>
          <p className="text-gray-600">Track orders from confirmation to delivery with complete visibility</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingOrder} onOpenChange={setIsAddingOrder}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Sales Order</DialogTitle>
                <DialogDescription>
                  Create a new sales order from quotation or manually enter details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Sales order creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingOrder(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingOrder(false)}>
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by number, customer name, or customer code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="inproduction">In Production</SelectItem>
                  <SelectItem value="readytoship">Ready to Ship</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-900">
                  {orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Order Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{orders.reduce((sum, o) => sum + o.grandTotal, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Pending Delivery</p>
                <p className="text-2xl font-bold text-orange-900">
                  {orders.filter(o => !['Delivered', 'Completed', 'Cancelled'].includes(o.status)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Management
          </CardTitle>
          <CardDescription>
            Track orders from confirmation to delivery with real-time progress updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Amount & Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">Date: {order.orderDate}</div>
                        <div className="text-sm text-gray-500">Sales: {order.salesPerson}</div>
                        {order.quotationRef && (
                          <div className="text-sm text-blue-600">Ref: {order.quotationRef}</div>
                        )}
                        {getPriorityBadge(order.priority)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerCode}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{order.grandTotal.toLocaleString()}</div>
                        <div className="text-sm text-green-600">
                          Advance: ₹{order.advanceReceived.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-600">
                          Balance: ₹{order.balanceAmount.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Expected: {order.expectedDeliveryDate}
                        </div>
                        {order.actualDeliveryDate && (
                          <div className="text-sm">
                            Actual: {order.actualDeliveryDate}
                          </div>
                        )}
                        {getDeliveryStatus(order.expectedDeliveryDate, order.actualDeliveryDate, order.status)}
                        {order.deliveryTracking && (
                          <div className="text-xs text-gray-500">
                            Track: {order.deliveryTracking.trackingNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={getProgressPercentage(order.progressTracking)} className="h-2" />
                        <div className="text-xs text-gray-500">
                          {getProgressPercentage(order.progressTracking).toFixed(0)}% Complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Order {order.orderNumber}</SheetTitle>
                              <SheetDescription>
                                Complete order details, progress tracking, and delivery information
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="progress">Progress</TabsTrigger>
                                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                                  <TabsTrigger value="approval">Approval</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Order Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Order Number</Label>
                                          <Input value={order.orderNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Order Date</Label>
                                          <Input value={order.orderDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Quotation Reference</Label>
                                          <Input value={order.quotationRef || 'N/A'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sales Person</Label>
                                          <Input value={order.salesPerson} readOnly />
                                        </div>
                                        <div className="flex gap-2">
                                          <div className="flex-1">
                                            <Label>Status</Label>
                                            <div className="mt-2">
                                              {getStatusBadge(order.status)}
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <Label>Priority</Label>
                                            <div className="mt-2">
                                              {getPriorityBadge(order.priority)}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Customer Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Customer Name</Label>
                                          <Input value={order.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={order.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <Input value={order.customerEmail} readOnly />
                                        </div>
                                        <div>
                                          <Label>Phone</Label>
                                          <Input value={order.customerPhone} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Financial Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>Grand Total</Label>
                                          <Input value={`₹${order.grandTotal.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                        <div>
                                          <Label>Advance Received</Label>
                                          <Input value={`₹${order.advanceReceived.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Balance Amount</Label>
                                          <Input value={`₹${order.balanceAmount.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Tax</Label>
                                          <Input value={`₹${order.totalTax.toLocaleString()}`} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Order Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>HSN/SAC</TableHead>
                                            <TableHead>Ordered</TableHead>
                                            <TableHead>Delivered</TableHead>
                                            <TableHead>Pending</TableHead>
                                            <TableHead>Rate</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {order.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                <div>
                                                  <div className="font-medium">{item.itemName}</div>
                                                  <div className="text-sm text-gray-500">{item.itemCode}</div>
                                                </div>
                                              </TableCell>
                                              <TableCell>{item.hsnSacCode}</TableCell>
                                              <TableCell>{item.orderedQty} {item.unit}</TableCell>
                                              <TableCell>{item.deliveredQty} {item.unit}</TableCell>
                                              <TableCell>{item.pendingQty} {item.unit}</TableCell>
                                              <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                                              <TableCell>₹{item.totalAmount.toLocaleString()}</TableCell>
                                              <TableCell>
                                                {item.status === 'Delivered' ? 
                                                  <Badge className="bg-green-100 text-green-800">Delivered</Badge> :
                                                  item.status === 'Partial' ?
                                                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge> :
                                                  <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                                                }
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="progress" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Progress Tracking</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.orderConfirmed ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.orderConfirmed ? 'text-green-600' : 'text-gray-500'}>
                                            Order Confirmed
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.productionStarted ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.productionStarted ? 'text-green-600' : 'text-gray-500'}>
                                            Production Started
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.qualityChecked ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.qualityChecked ? 'text-green-600' : 'text-gray-500'}>
                                            Quality Checked
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.packaged ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.packaged ? 'text-green-600' : 'text-gray-500'}>
                                            Packaged
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.shipped ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.shipped ? 'text-green-600' : 'text-gray-500'}>
                                            Shipped
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          {order.progressTracking.delivered ? 
                                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                                            <XCircle className="h-5 w-5 text-gray-400" />
                                          }
                                          <span className={order.progressTracking.delivered ? 'text-green-600' : 'text-gray-500'}>
                                            Delivered
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <Label>Overall Progress</Label>
                                        <div className="mt-2">
                                          <Progress value={getProgressPercentage(order.progressTracking)} className="h-3" />
                                          <div className="text-sm text-gray-500 mt-1">
                                            {getProgressPercentage(order.progressTracking).toFixed(0)}% Complete
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="delivery" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Delivery Schedule</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Expected Delivery Date</Label>
                                          <Input value={order.expectedDeliveryDate} readOnly />
                                        </div>
                                        {order.actualDeliveryDate && (
                                          <div>
                                            <Label>Actual Delivery Date</Label>
                                            <Input value={order.actualDeliveryDate} readOnly />
                                          </div>
                                        )}
                                        <div>
                                          <Label>Delivery Status</Label>
                                          <div className="mt-2">
                                            {getDeliveryStatus(order.expectedDeliveryDate, order.actualDeliveryDate, order.status)}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    {order.deliveryTracking && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Tracking Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <Label>Carrier</Label>
                                            <Input value={order.deliveryTracking.carrier} readOnly />
                                          </div>
                                          <div>
                                            <Label>Tracking Number</Label>
                                            <Input value={order.deliveryTracking.trackingNumber} readOnly />
                                          </div>
                                          <div>
                                            <Label>Current Status</Label>
                                            <Input value={order.deliveryTracking.currentStatus} readOnly />
                                          </div>
                                          <div>
                                            <Label>Estimated Delivery</Label>
                                            <Input value={order.deliveryTracking.estimatedDelivery} readOnly />
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Delivery Addresses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Billing Address</Label>
                                          <Textarea value={order.billingAddress} readOnly />
                                        </div>
                                        <div>
                                          <Label>Shipping Address</Label>
                                          <Textarea value={order.shippingAddress} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="approval" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Approval Workflow</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Requires Approval</Label>
                                          <Input value={order.approvalWorkflow.requiresApproval ? 'Yes' : 'No'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Approval Status</Label>
                                          <div className="mt-2">
                                            {order.approvalWorkflow.status === 'Approved' ? 
                                              <Badge className="bg-green-100 text-green-800">Approved</Badge> :
                                              order.approvalWorkflow.status === 'Rejected' ?
                                              <Badge className="bg-red-100 text-red-800">Rejected</Badge> :
                                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {order.approvalWorkflow.approvedBy && (
                                        <>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label>Approved By</Label>
                                              <Input value={order.approvalWorkflow.approvedBy} readOnly />
                                            </div>
                                            <div>
                                              <Label>Approval Date</Label>
                                              <Input value={order.approvalWorkflow.approvalDate || ''} readOnly />
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <Label>Approval Notes</Label>
                                            <Textarea value={order.approvalWorkflow.approvalNotes || ''} readOnly />
                                          </div>
                                        </>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
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
    </div>
  );
} 