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
import { 
  Clipboard, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Eye, 
  Copy, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  QrCode,
  Download,
  Share,
  Target,
  Users,
  Navigation,
  Clock,
  Route,
  Shield
} from 'lucide-react';

interface ChallanItem {
  itemCode: string;
  itemName: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxableValue: number;
  gstRate: number;
  gstAmount: number;
  totalValue: number;
}

interface DeliveryChallan {
  id: string;
  challanNumber: string;
  challanDate: string;
  orderNumber: string;
  customerCode: string;
  customerName: string;
  customerGSTIN: string;
  billingAddress: string;
  shippingAddress: string;
  salesPerson: string;
  status: 'Draft' | 'Generated' | 'In Transit' | 'Delivered' | 'Returned' | 'Cancelled';
  items: ChallanItem[];
  totalQuantity: number;
  totalValue: number;
  totalTaxableValue: number;
  totalGSTAmount: number;
  transportDetails: {
    transporterName: string;
    transporterGSTIN: string;
    vehicleNumber: string;
    driverName: string;
    driverLicense: string;
    driverMobile: string;
    distance: number;
    mode: 'Road' | 'Rail' | 'Air' | 'Ship';
  };
  eWayBill?: {
    eWayBillNumber: string;
    generatedDate: string;
    validUntil: string;
    status: 'Generated' | 'Active' | 'Cancelled' | 'Expired';
    cancelReason?: string;
  };
  deliveryDetails: {
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    deliveryStatus: 'Pending' | 'In Transit' | 'Delivered' | 'Failed';
    receivedBy?: string;
    receiverSignature?: string;
    deliveryNotes?: string;
  };
  movement: {
    dispatchDate: string;
    dispatchTime: string;
    sourceLocation: string;
    destinationLocation: string;
    currentLocation?: string;
    estimatedArrival?: string;
  };
  compliance: {
    requiresEWayBill: boolean;
    eWayBillThreshold: number;
    taxableValueExceedsLimit: boolean;
    interStateMovement: boolean;
  };
  notes: string;
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for delivery challans
const mockChallans: DeliveryChallan[] = [
  {
    id: '1',
    challanNumber: 'DC/2024/001',
    challanDate: '2024-01-25',
    orderNumber: 'SO/2024/001',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerGSTIN: '27ABCDE1234F1Z5',
    billingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    shippingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    salesPerson: 'Amit Kumar',
    status: 'Delivered',
    items: [
      {
        itemCode: 'ITEM001',
        itemName: 'Laptop Computer',
        description: 'High-performance business laptop',
        hsnSacCode: '84713000',
        quantity: 5,
        unit: 'NOS',
        unitPrice: 55000,
        taxableValue: 261250,
        gstRate: 18,
        gstAmount: 47025,
        totalValue: 308275
      }
    ],
    totalQuantity: 5,
    totalValue: 308275,
    totalTaxableValue: 261250,
    totalGSTAmount: 47025,
    transportDetails: {
      transporterName: 'Express Logistics Pvt Ltd',
      transporterGSTIN: '09FGHIJ5678K2L3',
      vehicleNumber: 'DL-01-AB-1234',
      driverName: 'Rajesh Kumar',
      driverLicense: 'DL1234567890',
      driverMobile: '+91-9876543210',
      distance: 25,
      mode: 'Road'
    },
    eWayBill: {
      eWayBillNumber: 'EWB123456789012',
      generatedDate: '2024-01-25',
      validUntil: '2024-01-26',
      status: 'Active'
    },
    deliveryDetails: {
      expectedDeliveryDate: '2024-01-26',
      actualDeliveryDate: '2024-01-26',
      deliveryStatus: 'Delivered',
      receivedBy: 'Rahul Kumar',
      deliveryNotes: 'Delivered successfully and in good condition'
    },
    movement: {
      dispatchDate: '2024-01-25',
      dispatchTime: '10:30 AM',
      sourceLocation: 'Warehouse - Gurgaon',
      destinationLocation: 'Customer Site - Noida',
      currentLocation: 'Delivered',
      estimatedArrival: '2024-01-26 02:00 PM'
    },
    compliance: {
      requiresEWayBill: true,
      eWayBillThreshold: 50000,
      taxableValueExceedsLimit: true,
      interStateMovement: false
    },
    notes: 'Handle with care - fragile items',
    createdDate: '2024-01-25',
    lastModified: '2024-01-26',
    createdBy: 'Admin'
  },
  {
    id: '2',
    challanNumber: 'DC/2024/002',
    challanDate: '2024-01-26',
    orderNumber: 'SO/2024/003',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerGSTIN: '24KLMNO9012P3Q4',
    billingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    shippingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    salesPerson: 'Suresh Patel',
    status: 'In Transit',
    items: [
      {
        itemCode: 'ITEM002',
        itemName: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        hsnSacCode: '94013000',
        quantity: 25,
        unit: 'NOS',
        unitPrice: 8500,
        taxableValue: 212500,
        gstRate: 18,
        gstAmount: 38250,
        totalValue: 250750
      }
    ],
    totalQuantity: 25,
    totalValue: 250750,
    totalTaxableValue: 212500,
    totalGSTAmount: 38250,
    transportDetails: {
      transporterName: 'National Transport Co.',
      transporterGSTIN: '24PQRST6789U1V2',
      vehicleNumber: 'GJ-05-CD-5678',
      driverName: 'Manoj Patel',
      driverLicense: 'GJ9876543210',
      driverMobile: '+91-9898765432',
      distance: 450,
      mode: 'Road'
    },
    eWayBill: {
      eWayBillNumber: 'EWB987654321098',
      generatedDate: '2024-01-26',
      validUntil: '2024-01-28',
      status: 'Active'
    },
    deliveryDetails: {
      expectedDeliveryDate: '2024-01-28',
      deliveryStatus: 'In Transit'
    },
    movement: {
      dispatchDate: '2024-01-26',
      dispatchTime: '08:00 AM',
      sourceLocation: 'Warehouse - Delhi',
      destinationLocation: 'Customer Site - Ahmedabad',
      currentLocation: 'Highway Toll Plaza - Rajasthan',
      estimatedArrival: '2024-01-28 11:00 AM'
    },
    compliance: {
      requiresEWayBill: true,
      eWayBillThreshold: 50000,
      taxableValueExceedsLimit: true,
      interStateMovement: true
    },
    notes: 'Bulk delivery - coordinate with customer for unloading',
    createdDate: '2024-01-26',
    lastModified: '2024-01-27',
    createdBy: 'Admin'
  },
  {
    id: '3',
    challanNumber: 'DC/2024/003',
    challanDate: '2024-01-27',
    orderNumber: 'SO/2024/002',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerGSTIN: '19FGHIJ5678K2L3',
    billingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    shippingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    salesPerson: 'Priya Sharma',
    status: 'Generated',
    items: [
      {
        itemCode: 'SERV001',
        itemName: 'Software License',
        description: 'Annual software license with support',
        hsnSacCode: '998314',
        quantity: 1,
        unit: 'NOS',
        unitPrice: 45000,
        taxableValue: 45000,
        gstRate: 18,
        gstAmount: 8100,
        totalValue: 53100
      }
    ],
    totalQuantity: 1,
    totalValue: 53100,
    totalTaxableValue: 45000,
    totalGSTAmount: 8100,
    transportDetails: {
      transporterName: 'Mumbai Local Courier',
      transporterGSTIN: '27UVWXY1234Z5A6',
      vehicleNumber: 'MH-01-EF-9876',
      driverName: 'Arjun Singh',
      driverLicense: 'MH5432109876',
      driverMobile: '+91-9123456789',
      distance: 15,
      mode: 'Road'
    },
    deliveryDetails: {
      expectedDeliveryDate: '2024-01-28',
      deliveryStatus: 'Pending'
    },
    movement: {
      dispatchDate: '2024-01-28',
      dispatchTime: '11:00 AM',
      sourceLocation: 'Office - Bandra',
      destinationLocation: 'Customer Office - Marine Drive'
    },
    compliance: {
      requiresEWayBill: false,
      eWayBillThreshold: 50000,
      taxableValueExceedsLimit: false,
      interStateMovement: false
    },
    notes: 'Software delivery - physical media and documentation',
    createdDate: '2024-01-27',
    lastModified: '2024-01-27',
    createdBy: 'Admin'
  }
];

export default function DeliveryChallan() {
  const [challans] = useState<DeliveryChallan[]>(mockChallans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedChallan, setSelectedChallan] = useState<DeliveryChallan | null>(null);
  const [isAddingChallan, setIsAddingChallan] = useState(false);

  const filteredChallans = challans.filter(challan => {
    const matchesSearch = challan.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challan.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || challan.status.toLowerCase().replace(/ /g, '') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Generated':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Generated</Badge>;
      case 'In Transit':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Transit</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case 'Returned':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Returned</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEWayBillBadge = (eWayBill?: any) => {
    if (!eWayBill) {
      return <Badge className="bg-gray-100 text-gray-800">No E-Way Bill</Badge>;
    }
    
    switch (eWayBill.status) {
      case 'Generated':
        return <Badge className="bg-blue-100 text-blue-800">Generated</Badge>;
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'Expired':
        return <Badge className="bg-orange-100 text-orange-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{eWayBill.status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'In Transit':
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Delivery Challan - JusFinn</title>
        <meta name="description" content="Manage delivery challans with E-Way Bill integration and goods movement tracking." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Delivery Challan
          </h1>
          <p className="text-gray-600">Track goods movement with E-Way Bill compliance and real-time logistics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingChallan} onOpenChange={setIsAddingChallan}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Challan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Delivery Challan</DialogTitle>
                <DialogDescription>
                  Generate a delivery challan from sales order with transport details and E-Way Bill
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Delivery challan creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingChallan(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingChallan(false)}>
                  Create Challan
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
                placeholder="Search challans by number, customer name, or order number..."
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
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="intransit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Challans</p>
                <p className="text-2xl font-bold text-blue-900">{challans.length}</p>
              </div>
              <Clipboard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-900">
                  {challans.filter(c => c.status === 'Delivered').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">In Transit</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {challans.filter(c => c.status === 'In Transit').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">E-Way Bills</p>
                <p className="text-2xl font-bold text-purple-900">
                  {challans.filter(c => c.eWayBill).length}
                </p>
              </div>
              <QrCode className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challan List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            Delivery Challan Management
          </CardTitle>
          <CardDescription>
            Track goods movement with E-Way Bill compliance and delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challan Details</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Transport Details</TableHead>
                  <TableHead>E-Way Bill</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallans.map((challan) => (
                  <TableRow key={challan.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{challan.challanNumber}</div>
                        <div className="text-sm text-gray-500">Date: {challan.challanDate}</div>
                        <div className="text-sm text-blue-600">Order: {challan.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          Qty: {challan.totalQuantity} | Value: ₹{challan.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{challan.customerName}</div>
                        <div className="text-sm text-gray-500">{challan.customerCode}</div>
                        <div className="text-sm font-mono text-gray-500">{challan.customerGSTIN}</div>
                        <div className="text-sm text-gray-500 truncate max-w-32">
                          {challan.shippingAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{challan.transportDetails.transporterName}</div>
                        <div className="text-sm text-gray-500">{challan.transportDetails.vehicleNumber}</div>
                        <div className="text-sm text-gray-500">{challan.transportDetails.driverName}</div>
                        <div className="text-sm text-gray-500">
                          {challan.transportDetails.distance} km
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {challan.eWayBill ? (
                          <>
                            <div className="text-sm font-mono">{challan.eWayBill.eWayBillNumber}</div>
                            <div className="text-sm text-gray-500">
                              Valid: {challan.eWayBill.validUntil}
                            </div>
                            {getEWayBillBadge(challan.eWayBill)}
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-gray-500">Not Required</div>
                            {getEWayBillBadge()}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Expected: {challan.deliveryDetails.expectedDeliveryDate}
                        </div>
                        {challan.deliveryDetails.actualDeliveryDate && (
                          <div className="text-sm">
                            Actual: {challan.deliveryDetails.actualDeliveryDate}
                          </div>
                        )}
                        {getDeliveryStatusBadge(challan.deliveryDetails.deliveryStatus)}
                        {challan.movement.currentLocation && (
                          <div className="text-xs text-gray-500 truncate max-w-32">
                            At: {challan.movement.currentLocation}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(challan.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedChallan(challan)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Challan {challan.challanNumber}</SheetTitle>
                              <SheetDescription>
                                Complete delivery challan details, transport information, and tracking
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="transport">Transport</TabsTrigger>
                                  <TabsTrigger value="eway">E-Way Bill</TabsTrigger>
                                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Challan Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Challan Number</Label>
                                          <Input value={challan.challanNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Challan Date</Label>
                                          <Input value={challan.challanDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Order Reference</Label>
                                          <Input value={challan.orderNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sales Person</Label>
                                          <Input value={challan.salesPerson} readOnly />
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="mt-2">
                                            {getStatusBadge(challan.status)}
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
                                          <Input value={challan.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={challan.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer GSTIN</Label>
                                          <Input value={challan.customerGSTIN} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Addresses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Billing Address</Label>
                                          <Textarea value={challan.billingAddress} readOnly />
                                        </div>
                                        <div>
                                          <Label>Shipping Address</Label>
                                          <Textarea value={challan.shippingAddress} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Value Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>Total Quantity</Label>
                                          <Input value={challan.totalQuantity} readOnly />
                                        </div>
                                        <div>
                                          <Label>Taxable Value</Label>
                                          <Input value={`₹${challan.totalTaxableValue.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>GST Amount</Label>
                                          <Input value={`₹${challan.totalGSTAmount.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Value</Label>
                                          <Input value={`₹${challan.totalValue.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Challan Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>HSN/SAC</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Taxable Value</TableHead>
                                            <TableHead>GST Rate</TableHead>
                                            <TableHead>GST Amount</TableHead>
                                            <TableHead>Total Value</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {challan.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                <div>
                                                  <div className="font-medium">{item.itemName}</div>
                                                  <div className="text-sm text-gray-500">{item.itemCode}</div>
                                                </div>
                                              </TableCell>
                                              <TableCell>{item.hsnSacCode}</TableCell>
                                              <TableCell>{item.quantity} {item.unit}</TableCell>
                                              <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                                              <TableCell>₹{item.taxableValue.toLocaleString()}</TableCell>
                                              <TableCell>{item.gstRate}%</TableCell>
                                              <TableCell>₹{item.gstAmount.toLocaleString()}</TableCell>
                                              <TableCell>₹{item.totalValue.toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="transport" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Transport Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Transporter Name</Label>
                                          <Input value={challan.transportDetails.transporterName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Transporter GSTIN</Label>
                                          <Input value={challan.transportDetails.transporterGSTIN} readOnly />
                                        </div>
                                        <div>
                                          <Label>Vehicle Number</Label>
                                          <Input value={challan.transportDetails.vehicleNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Transport Mode</Label>
                                          <Input value={challan.transportDetails.mode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Driver Name</Label>
                                          <Input value={challan.transportDetails.driverName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Driver License</Label>
                                          <Input value={challan.transportDetails.driverLicense} readOnly />
                                        </div>
                                        <div>
                                          <Label>Driver Mobile</Label>
                                          <Input value={challan.transportDetails.driverMobile} readOnly />
                                        </div>
                                        <div>
                                          <Label>Distance (km)</Label>
                                          <Input value={challan.transportDetails.distance} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="eway" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">E-Way Bill Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {challan.eWayBill ? (
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>E-Way Bill Number</Label>
                                            <Input value={challan.eWayBill.eWayBillNumber} readOnly className="font-mono" />
                                          </div>
                                          <div>
                                            <Label>Generation Date</Label>
                                            <Input value={challan.eWayBill.generatedDate} readOnly />
                                          </div>
                                          <div>
                                            <Label>Valid Until</Label>
                                            <Input value={challan.eWayBill.validUntil} readOnly />
                                          </div>
                                          <div>
                                            <Label>Status</Label>
                                            <div className="mt-2">
                                              {getEWayBillBadge(challan.eWayBill)}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center p-8">
                                          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">E-Way Bill not required for this shipment</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            Value below threshold (₹{challan.compliance.eWayBillThreshold.toLocaleString()})
                                          </p>
                                        </div>
                                      )}
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h4 className="font-medium mb-3">Compliance Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="flex items-center space-x-2">
                                            <Label>E-Way Bill Required:</Label>
                                            <Badge className={challan.compliance.requiresEWayBill ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                              {challan.compliance.requiresEWayBill ? 'Yes' : 'No'}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Label>Inter-State Movement:</Label>
                                            <Badge className={challan.compliance.interStateMovement ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                              {challan.compliance.interStateMovement ? 'Yes' : 'No'}
                                            </Badge>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Label>E-Way Bill Threshold:</Label>
                                            <span className="text-sm">₹{challan.compliance.eWayBillThreshold.toLocaleString()}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Label>Value Exceeds Limit:</Label>
                                            <Badge className={challan.compliance.taxableValueExceedsLimit ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                              {challan.compliance.taxableValueExceedsLimit ? 'Yes' : 'No'}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="tracking" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Movement Tracking</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Dispatch Date</Label>
                                          <Input value={challan.movement.dispatchDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Dispatch Time</Label>
                                          <Input value={challan.movement.dispatchTime} readOnly />
                                        </div>
                                        <div>
                                          <Label>Source Location</Label>
                                          <Input value={challan.movement.sourceLocation} readOnly />
                                        </div>
                                        <div>
                                          <Label>Destination Location</Label>
                                          <Input value={challan.movement.destinationLocation} readOnly />
                                        </div>
                                        {challan.movement.currentLocation && (
                                          <div>
                                            <Label>Current Location</Label>
                                            <Input value={challan.movement.currentLocation} readOnly />
                                          </div>
                                        )}
                                        {challan.movement.estimatedArrival && (
                                          <div>
                                            <Label>Estimated Arrival</Label>
                                            <Input value={challan.movement.estimatedArrival} readOnly />
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Delivery Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Expected Delivery</Label>
                                          <Input value={challan.deliveryDetails.expectedDeliveryDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Delivery Status</Label>
                                          <div className="mt-2">
                                            {getDeliveryStatusBadge(challan.deliveryDetails.deliveryStatus)}
                                          </div>
                                        </div>
                                        {challan.deliveryDetails.actualDeliveryDate && (
                                          <div>
                                            <Label>Actual Delivery</Label>
                                            <Input value={challan.deliveryDetails.actualDeliveryDate} readOnly />
                                          </div>
                                        )}
                                        {challan.deliveryDetails.receivedBy && (
                                          <div>
                                            <Label>Received By</Label>
                                            <Input value={challan.deliveryDetails.receivedBy} readOnly />
                                          </div>
                                        )}
                                      </div>
                                      
                                      {challan.deliveryDetails.deliveryNotes && (
                                        <div>
                                          <Label>Delivery Notes</Label>
                                          <Textarea value={challan.deliveryDetails.deliveryNotes} readOnly />
                                        </div>
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
                          <QrCode className="h-4 w-4" />
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