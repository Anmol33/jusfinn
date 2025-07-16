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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Building,
  Globe,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';

interface Customer {
  id: string;
  customerCode: string;
  companyName: string;
  contactPerson: string;
  gstin: string;
  pan: string;
  customerType: 'Individual' | 'Company' | 'Partnership' | 'LLP' | 'HUF';
  category: 'Regular' | 'Key Account' | 'VIP' | 'New';
  status: 'Active' | 'Inactive' | 'Suspended';
  creditLimit: number;
  creditDays: number;
  billingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contactDetails: {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    alternateEmail?: string;
    website?: string;
  };
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branch: string;
  };
  salesData: {
    totalSales: number;
    lastOrderDate: string;
    averageOrderValue: number;
    outstandingAmount: number;
  };
  taxInfo: {
    tcsApplicable: boolean;
    tcsRate: number;
    exportCustomer: boolean;
    lutNumber?: string;
  };
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: '1',
    customerCode: 'CUST001',
    companyName: 'Tech Solutions Pvt Ltd',
    contactPerson: 'Rahul Kumar',
    gstin: '27ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    customerType: 'Company',
    category: 'Key Account',
    status: 'Active',
    creditLimit: 500000,
    creditDays: 30,
    billingAddress: {
      address: '123 Business Park, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      country: 'India'
    },
    shippingAddress: {
      address: '123 Business Park, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      country: 'India'
    },
    contactDetails: {
      primaryPhone: '+91-9876543210',
      secondaryPhone: '+91-9876543211',
      email: 'rahul@techsolutions.com',
      alternateEmail: 'accounts@techsolutions.com',
      website: 'www.techsolutions.com'
    },
    bankDetails: {
      accountHolderName: 'Tech Solutions Pvt Ltd',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      branch: 'Noida Sector 62'
    },
    salesData: {
      totalSales: 2500000,
      lastOrderDate: '2024-01-15',
      averageOrderValue: 125000,
      outstandingAmount: 87500
    },
    taxInfo: {
      tcsApplicable: false,
      tcsRate: 0,
      exportCustomer: false
    },
    createdDate: '2023-06-15',
    lastModified: '2024-01-15',
    createdBy: 'Admin'
  },
  {
    id: '2',
    customerCode: 'CUST002',
    companyName: 'Global Exports Ltd',
    contactPerson: 'Priya Sharma',
    gstin: '19FGHIJ5678K2L3',
    pan: 'FGHIJ5678K',
    customerType: 'Company',
    category: 'Regular',
    status: 'Active',
    creditLimit: 1000000,
    creditDays: 45,
    billingAddress: {
      address: '456 Export House, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    shippingAddress: {
      address: '456 Export House, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    contactDetails: {
      primaryPhone: '+91-9123456789',
      email: 'priya@globalexports.com',
      website: 'www.globalexports.com'
    },
    salesData: {
      totalSales: 5500000,
      lastOrderDate: '2024-01-20',
      averageOrderValue: 275000,
      outstandingAmount: 150000
    },
    taxInfo: {
      tcsApplicable: true,
      tcsRate: 0.1,
      exportCustomer: true,
      lutNumber: 'LUT/2023/001234'
    },
    createdDate: '2023-04-10',
    lastModified: '2024-01-20',
    createdBy: 'Admin'
  },
  {
    id: '3',
    customerCode: 'CUST003',
    companyName: 'Retail Chain Pvt Ltd',
    contactPerson: 'Amit Patel',
    gstin: '24KLMNO9012P3Q4',
    pan: 'KLMNO9012P',
    customerType: 'Company',
    category: 'VIP',
    status: 'Active',
    creditLimit: 2000000,
    creditDays: 60,
    billingAddress: {
      address: '789 Commercial Complex, C.G. Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
      country: 'India'
    },
    shippingAddress: {
      address: '789 Commercial Complex, C.G. Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
      country: 'India'
    },
    contactDetails: {
      primaryPhone: '+91-9898765432',
      email: 'amit@retailchain.com',
      website: 'www.retailchain.com'
    },
    salesData: {
      totalSales: 8750000,
      lastOrderDate: '2024-01-25',
      averageOrderValue: 437500,
      outstandingAmount: 325000
    },
    taxInfo: {
      tcsApplicable: false,
      tcsRate: 0,
      exportCustomer: false
    },
    createdDate: '2023-01-20',
    lastModified: '2024-01-25',
    createdBy: 'Admin'
  }
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
  'Andaman and Nicobar Islands'
];

export default function CustomerMaster() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'Suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Key Account':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Key Account</Badge>;
      case 'VIP':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">VIP</Badge>;
      case 'Regular':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Regular</Badge>;
      case 'New':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">New</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const validateGSTIN = (gstin: string): boolean => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Customer Master - JusFinn</title>
        <meta name="description" content="Manage customer information, credit limits, and contact details with GST compliance." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Customer Master
          </h1>
          <p className="text-gray-600">Manage customer information and relationships</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer record with complete information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Add customer form would go here */}
                <p className="text-sm text-gray-500">Customer creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingCustomer(false)}>
                  Save Customer
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
                placeholder="Search customers by name, code, or contact person..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Customers</p>
                <p className="text-2xl font-bold text-green-900">
                  {customers.filter(c => c.status === 'Active').length}
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
                <p className="text-sm text-purple-600 font-medium">Total Outstanding</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{customers.reduce((sum, c) => sum + c.salesData.outstandingAmount, 0).toLocaleString()}
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
                <p className="text-sm text-orange-600 font-medium">Credit Limit Used</p>
                <p className="text-2xl font-bold text-orange-900">65%</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Database
          </CardTitle>
          <CardDescription>
            Manage your customer relationships and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>GST & PAN</TableHead>
                  <TableHead>Credit Info</TableHead>
                  <TableHead>Sales Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{customer.companyName}</div>
                        <div className="text-sm text-gray-500">{customer.customerCode}</div>
                        <div className="text-sm text-gray-500">{customer.contactPerson}</div>
                        {getCategoryBadge(customer.category)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.contactDetails.primaryPhone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.contactDetails.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {customer.billingAddress.city}, {customer.billingAddress.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-mono">
                          {validateGSTIN(customer.gstin) ? 
                            <span className="text-green-600">✓ {customer.gstin}</span> : 
                            <span className="text-red-600">✗ {customer.gstin}</span>
                          }
                        </div>
                        <div className="text-sm font-mono">
                          {validatePAN(customer.pan) ? 
                            <span className="text-green-600">✓ {customer.pan}</span> : 
                            <span className="text-red-600">✗ {customer.pan}</span>
                          }
                        </div>
                        {customer.taxInfo.exportCustomer && (
                          <Badge className="bg-blue-100 text-blue-800">Export Customer</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Limit:</span> ₹{customer.creditLimit.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Days:</span> {customer.creditDays}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Used:</span> 
                          <span className={`ml-1 ${
                            (customer.salesData.outstandingAmount / customer.creditLimit) > 0.8 ? 
                            'text-red-600' : 'text-green-600'
                          }`}>
                            {((customer.salesData.outstandingAmount / customer.creditLimit) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Total:</span> ₹{customer.salesData.totalSales.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Outstanding:</span> ₹{customer.salesData.outstandingAmount.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Avg Order:</span> ₹{customer.salesData.averageOrderValue.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[800px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>{customer.companyName}</SheetTitle>
                              <SheetDescription>
                                Customer details and management
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                                  <TabsTrigger value="financial">Financial</TabsTrigger>
                                  <TabsTrigger value="activity">Activity</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={customer.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Company Name</Label>
                                          <Input value={customer.companyName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Contact Person</Label>
                                          <Input value={customer.contactPerson} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Type</Label>
                                          <Input value={customer.customerType} readOnly />
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>GSTIN</Label>
                                          <div className="flex items-center space-x-2">
                                            <Input value={customer.gstin} readOnly />
                                            {validateGSTIN(customer.gstin) ? 
                                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            }
                                          </div>
                                        </div>
                                        <div>
                                          <Label>PAN</Label>
                                          <div className="flex items-center space-x-2">
                                            <Input value={customer.pan} readOnly />
                                            {validatePAN(customer.pan) ? 
                                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="addresses" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Billing Address</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <Textarea value={customer.billingAddress.address} readOnly />
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input value={customer.billingAddress.city} readOnly />
                                          <Input value={customer.billingAddress.state} readOnly />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input value={customer.billingAddress.pincode} readOnly />
                                          <Input value={customer.billingAddress.country} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Shipping Address</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <Textarea value={customer.shippingAddress.address} readOnly />
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input value={customer.shippingAddress.city} readOnly />
                                          <Input value={customer.shippingAddress.state} readOnly />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input value={customer.shippingAddress.pincode} readOnly />
                                          <Input value={customer.shippingAddress.country} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="financial" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Credit Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Credit Limit</Label>
                                          <Input value={`₹${customer.creditLimit.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Credit Days</Label>
                                          <Input value={`${customer.creditDays} days`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Outstanding Amount</Label>
                                          <Input 
                                            value={`₹${customer.salesData.outstandingAmount.toLocaleString()}`} 
                                            readOnly 
                                            className={
                                              (customer.salesData.outstandingAmount / customer.creditLimit) > 0.8 ? 
                                              'text-red-600' : ''
                                            }
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Sales Performance</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Total Sales</Label>
                                          <Input value={`₹${customer.salesData.totalSales.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Average Order Value</Label>
                                          <Input value={`₹${customer.salesData.averageOrderValue.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Last Order Date</Label>
                                          <Input value={customer.salesData.lastOrderDate} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="activity" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                          <Calendar className="h-4 w-4 text-blue-600" />
                                          <div>
                                            <p className="text-sm font-medium">Last Order</p>
                                            <p className="text-xs text-gray-500">{customer.salesData.lastOrderDate}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                          <TrendingUp className="h-4 w-4 text-green-600" />
                                          <div>
                                            <p className="text-sm font-medium">Customer Since</p>
                                            <p className="text-xs text-gray-500">{customer.createdDate}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                          <User className="h-4 w-4 text-purple-600" />
                                          <div>
                                            <p className="text-sm font-medium">Created By</p>
                                            <p className="text-xs text-gray-500">{customer.createdBy}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
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