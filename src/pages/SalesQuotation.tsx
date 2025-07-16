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
  Send, 
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
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Download,
  Share,
  Target,
  Users
} from 'lucide-react';

interface QuotationItem {
  itemCode: string;
  itemName: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

interface SalesQuotation {
  id: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  shippingAddress: string;
  salesPerson: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Approved' | 'Rejected' | 'Expired' | 'Converted';
  items: QuotationItem[];
  subTotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  termsAndConditions: string;
  notes: string;
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  conversionData?: {
    convertedToOrder: boolean;
    orderNumber?: string;
    conversionDate?: string;
  };
  followUp: {
    lastContactDate?: string;
    nextFollowUpDate?: string;
    followUpNotes?: string;
    contactAttempts: number;
  };
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for quotations
const mockQuotations: SalesQuotation[] = [
  {
    id: '1',
    quotationNumber: 'QUO/2024/001',
    quotationDate: '2024-01-15',
    validUntil: '2024-02-14',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerEmail: 'rahul@techsolutions.com',
    customerPhone: '+91-9876543210',
    billingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    shippingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    salesPerson: 'Amit Kumar',
    status: 'Approved',
    items: [
      {
        itemCode: 'ITEM001',
        itemName: 'Laptop Computer',
        description: 'High-performance business laptop',
        hsnSacCode: '84713000',
        quantity: 5,
        unit: 'NOS',
        unitPrice: 55000,
        discount: 5,
        discountType: 'percentage',
        taxableAmount: 261250,
        gstRate: 18,
        gstAmount: 47025,
        totalAmount: 308275
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
    termsAndConditions: 'Standard terms and conditions apply. Payment within 30 days.',
    notes: 'Bulk discount applicable for quantities above 10 units.',
    paymentTerms: '30 days net',
    deliveryTerms: '7-10 working days',
    warranty: '1 year manufacturer warranty',
    conversionData: {
      convertedToOrder: true,
      orderNumber: 'SO/2024/001',
      conversionDate: '2024-01-20'
    },
    followUp: {
      lastContactDate: '2024-01-18',
      nextFollowUpDate: '2024-01-25',
      followUpNotes: 'Customer approved the quotation',
      contactAttempts: 2
    },
    createdDate: '2024-01-15',
    lastModified: '2024-01-20',
    createdBy: 'Admin'
  },
  {
    id: '2',
    quotationNumber: 'QUO/2024/002',
    quotationDate: '2024-01-18',
    validUntil: '2024-02-17',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerEmail: 'priya@globalexports.com',
    customerPhone: '+91-9123456789',
    billingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    shippingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    salesPerson: 'Priya Sharma',
    status: 'Sent',
    items: [
      {
        itemCode: 'SERV001',
        itemName: 'Software Development',
        description: 'Custom software development services',
        hsnSacCode: '998314',
        quantity: 200,
        unit: 'HOURS',
        unitPrice: 2000,
        discount: 10,
        discountType: 'percentage',
        taxableAmount: 360000,
        gstRate: 18,
        gstAmount: 64800,
        totalAmount: 424800
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
    termsAndConditions: 'Payment in advance for development work. Milestone-based delivery.',
    notes: 'Project timeline: 8-10 weeks',
    paymentTerms: '50% advance, 50% on delivery',
    deliveryTerms: '8-10 weeks',
    warranty: '6 months post-delivery support',
    followUp: {
      lastContactDate: '2024-01-22',
      nextFollowUpDate: '2024-01-28',
      followUpNotes: 'Awaiting customer response',
      contactAttempts: 1
    },
    createdDate: '2024-01-18',
    lastModified: '2024-01-22',
    createdBy: 'Admin'
  },
  {
    id: '3',
    quotationNumber: 'QUO/2024/003',
    quotationDate: '2024-01-20',
    validUntil: '2024-02-19',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerEmail: 'amit@retailchain.com',
    customerPhone: '+91-9898765432',
    billingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    shippingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    salesPerson: 'Suresh Patel',
    status: 'Viewed',
    items: [
      {
        itemCode: 'ITEM002',
        itemName: 'Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        hsnSacCode: '94013000',
        quantity: 25,
        unit: 'NOS',
        unitPrice: 8500,
        discount: 0,
        discountType: 'amount',
        taxableAmount: 212500,
        gstRate: 18,
        gstAmount: 38250,
        totalAmount: 250750
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
    termsAndConditions: 'Standard warranty and return policy applies.',
    notes: 'Free installation and setup included.',
    paymentTerms: '45 days net',
    deliveryTerms: '15-20 working days',
    warranty: '2 years warranty',
    followUp: {
      lastContactDate: '2024-01-25',
      nextFollowUpDate: '2024-01-30',
      followUpNotes: 'Customer is reviewing the quotation',
      contactAttempts: 1
    },
    createdDate: '2024-01-20',
    lastModified: '2024-01-25',
    createdBy: 'Admin'
  }
];

export default function SalesQuotation() {
  const [quotations] = useState<SalesQuotation[]>(mockQuotations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedQuotation, setSelectedQuotation] = useState<SalesQuotation | null>(null);
  const [isAddingQuotation, setIsAddingQuotation] = useState(false);

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quotation.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sent</Badge>;
      case 'Viewed':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Viewed</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'Expired':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Expired</Badge>;
      case 'Converted':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getValidityStatus = (validUntil: string) => {
    const validDate = new Date(validUntil);
    const today = new Date();
    const daysLeft = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{daysLeft} days left</Badge>;
    }
  };

  const calculateConversionRate = () => {
    const convertedQuotations = quotations.filter(q => q.conversionData?.convertedToOrder).length;
    return quotations.length > 0 ? ((convertedQuotations / quotations.length) * 100).toFixed(1) : '0';
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Sales Quotation - JusFinn</title>
        <meta name="description" content="Manage sales quotations with validity tracking, customer approvals, and conversion analytics." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Sales Quotation
          </h1>
          <p className="text-gray-600">Create and manage sales quotations with automated follow-ups</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingQuotation} onOpenChange={setIsAddingQuotation}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quotation</DialogTitle>
                <DialogDescription>
                  Generate a new sales quotation with complete customer and item details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Quotation creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingQuotation(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingQuotation(false)}>
                  Create Quotation
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
                placeholder="Search quotations by number, customer name, or customer code..."
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
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Quotations</p>
                <p className="text-2xl font-bold text-blue-900">{quotations.length}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-900">{calculateConversionRate()}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{quotations.reduce((sum, q) => sum + q.grandTotal, 0).toLocaleString()}
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
                <p className="text-sm text-orange-600 font-medium">Pending Follow-up</p>
                <p className="text-2xl font-bold text-orange-900">
                  {quotations.filter(q => q.status === 'Sent' || q.status === 'Viewed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotation List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Quotation Management
          </CardTitle>
          <CardDescription>
            Track quotation status, validity, and conversion performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation Details</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{quotation.quotationNumber}</div>
                        <div className="text-sm text-gray-500">Date: {quotation.quotationDate}</div>
                        <div className="text-sm text-gray-500">Sales: {quotation.salesPerson}</div>
                        {quotation.conversionData?.convertedToOrder && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Converted: {quotation.conversionData.orderNumber}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{quotation.customerName}</div>
                        <div className="text-sm text-gray-500">{quotation.customerCode}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {quotation.customerEmail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {quotation.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{quotation.grandTotal.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Subtotal: ₹{quotation.subTotal.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Tax: ₹{quotation.totalTax.toLocaleString()}
                        </div>
                        {quotation.totalDiscount > 0 && (
                          <div className="text-sm text-green-600">
                            Discount: ₹{quotation.totalDiscount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Valid until: {quotation.validUntil}</div>
                        {getValidityStatus(quotation.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quotation.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {quotation.followUp.nextFollowUpDate && (
                          <div className="text-sm">
                            Next: {quotation.followUp.nextFollowUpDate}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Attempts: {quotation.followUp.contactAttempts}
                        </div>
                        {quotation.followUp.followUpNotes && (
                          <div className="text-xs text-gray-400 truncate max-w-32">
                            {quotation.followUp.followUpNotes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedQuotation(quotation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Quotation {quotation.quotationNumber}</SheetTitle>
                              <SheetDescription>
                                Complete quotation details and customer information
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="terms">Terms</TabsTrigger>
                                  <TabsTrigger value="followup">Follow-up</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Quotation Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Quotation Number</Label>
                                          <Input value={quotation.quotationNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Date</Label>
                                          <Input value={quotation.quotationDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Valid Until</Label>
                                          <Input value={quotation.validUntil} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sales Person</Label>
                                          <Input value={quotation.salesPerson} readOnly />
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="mt-2">
                                            {getStatusBadge(quotation.status)}
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
                                          <Input value={quotation.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={quotation.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <Input value={quotation.customerEmail} readOnly />
                                        </div>
                                        <div>
                                          <Label>Phone</Label>
                                          <Input value={quotation.customerPhone} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Amount Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>Subtotal</Label>
                                          <Input value={`₹${quotation.subTotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Discount</Label>
                                          <Input value={`₹${quotation.totalDiscount.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Tax</Label>
                                          <Input value={`₹${quotation.totalTax.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Grand Total</Label>
                                          <Input 
                                            value={`₹${quotation.grandTotal.toLocaleString()}`} 
                                            readOnly 
                                            className="font-semibold"
                                          />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Quotation Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>HSN/SAC</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Rate</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead>GST</TableHead>
                                            <TableHead>Amount</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {quotation.items.map((item, index) => (
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
                                              <TableCell>
                                                {item.discount > 0 ? 
                                                  `${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : 
                                                  '-'
                                                }
                                              </TableCell>
                                              <TableCell>{item.gstRate}%</TableCell>
                                              <TableCell>₹{item.totalAmount.toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="terms" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Terms & Conditions</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Payment Terms</Label>
                                          <Textarea value={quotation.paymentTerms} readOnly />
                                        </div>
                                        <div>
                                          <Label>Delivery Terms</Label>
                                          <Textarea value={quotation.deliveryTerms} readOnly />
                                        </div>
                                        <div>
                                          <Label>Warranty</Label>
                                          <Textarea value={quotation.warranty} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Additional Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Terms and Conditions</Label>
                                          <Textarea value={quotation.termsAndConditions} readOnly />
                                        </div>
                                        <div>
                                          <Label>Notes</Label>
                                          <Textarea value={quotation.notes} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="followup" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Follow-up Management</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Last Contact Date</Label>
                                          <Input value={quotation.followUp.lastContactDate || 'Not contacted'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Next Follow-up Date</Label>
                                          <Input value={quotation.followUp.nextFollowUpDate || 'Not scheduled'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Contact Attempts</Label>
                                          <Input value={quotation.followUp.contactAttempts} readOnly />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Follow-up Notes</Label>
                                        <Textarea 
                                          value={quotation.followUp.followUpNotes || 'No notes available'} 
                                          readOnly 
                                        />
                                      </div>
                                      
                                      {quotation.conversionData?.convertedToOrder && (
                                        <div className="p-4 bg-green-50 rounded-lg">
                                          <h4 className="font-medium text-green-800 mb-2">Conversion Details</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="text-sm">
                                              <span className="font-medium">Order Number:</span> {quotation.conversionData.orderNumber}
                                            </div>
                                            <div className="text-sm">
                                              <span className="font-medium">Conversion Date:</span> {quotation.conversionData.conversionDate}
                                            </div>
                                          </div>
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
                          <Share className="h-4 w-4" />
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