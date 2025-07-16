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
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Eye, 
  Copy, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  Share,
  Target,
  Users,
  Navigation,
  Clock,
  Route,
  Shield,
  Receipt,
  CreditCard,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface InvoiceItem {
  itemCode: string;
  itemName: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  totalValue: number;
}

interface TaxInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  challanRef?: string;
  orderRef?: string;
  quotationRef?: string;
  placeOfSupply: string;
  customerCode: string;
  customerName: string;
  customerGSTIN: string;
  customerPAN: string;
  billingAddress: string;
  shippingAddress: string;
  salesPerson: string;
  status: 'Draft' | 'Generated' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue';
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableValue: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  cessTotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  paymentTerms: string;
  notes: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    branch: string;
  };
  eInvoice?: {
    irn: string;
    ackNumber: string;
    ackDate: string;
    signedQRCode: string;
    status: 'Generated' | 'Cancelled';
    cancelDate?: string;
    cancelReason?: string;
  };
  gstr1Status: {
    included: boolean;
    period?: string;
    filingDate?: string;
  };
  tcs?: {
    applicable: boolean;
    rate: number;
    amount: number;
  };
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for tax invoices
const mockInvoices: TaxInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV/2024/001',
    invoiceDate: '2024-01-30',
    challanRef: 'DC/2024/001',
    orderRef: 'SO/2024/001',
    quotationRef: 'QUO/2024/001',
    placeOfSupply: 'Uttar Pradesh',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerGSTIN: '27ABCDE1234F1Z5',
    customerPAN: 'ABCDE1234F',
    billingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    shippingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    salesPerson: 'Amit Kumar',
    status: 'Paid',
    paymentStatus: 'Paid',
    items: [
      {
        itemCode: 'ITEM001',
        itemName: 'Laptop Computer',
        description: 'High-performance business laptop',
        hsnSacCode: '84713000',
        quantity: 5,
        unit: 'NOS',
        unitPrice: 55000,
        discount: 13750,
        discountType: 'amount',
        taxableValue: 261250,
        gstRate: 18,
        cgstAmount: 23512.5,
        sgstAmount: 23512.5,
        igstAmount: 0,
        cessAmount: 0,
        totalTaxAmount: 47025,
        totalValue: 308275
      }
    ],
    subtotal: 275000,
    totalDiscount: 13750,
    totalTaxableValue: 261250,
    cgstTotal: 23512.5,
    sgstTotal: 23512.5,
    igstTotal: 0,
    cessTotal: 0,
    totalTax: 47025,
    roundOff: 0,
    grandTotal: 308275,
    paidAmount: 308275,
    balanceAmount: 0,
    dueDate: '2024-02-29',
    paymentTerms: '30 days net',
    notes: 'Thank you for your business!',
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      branch: 'Gurgaon Sector 30'
    },
    eInvoice: {
      irn: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j',
      ackNumber: 'ACK123456789012',
      ackDate: '2024-01-30',
      signedQRCode: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAiLCJ0eXAiOiJKV1QifQ...',
      status: 'Generated'
    },
    gstr1Status: {
      included: true,
      period: '01-2024',
      filingDate: '2024-02-10'
    },
    createdDate: '2024-01-30',
    lastModified: '2024-02-05',
    createdBy: 'Admin'
  },
  {
    id: '2',
    invoiceNumber: 'INV/2024/002',
    invoiceDate: '2024-01-31',
    orderRef: 'SO/2024/002',
    placeOfSupply: 'Maharashtra',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerGSTIN: '19FGHIJ5678K2L3',
    customerPAN: 'FGHIJ5678K',
    billingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    shippingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    salesPerson: 'Priya Sharma',
    status: 'Partially Paid',
    paymentStatus: 'Partially Paid',
    items: [
      {
        itemCode: 'SERV001',
        itemName: 'Software Development Services',
        description: 'Custom software development - Phase 1',
        hsnSacCode: '998314',
        quantity: 120,
        unit: 'HOURS',
        unitPrice: 2000,
        discount: 24000,
        discountType: 'amount',
        taxableValue: 216000,
        gstRate: 18,
        cgstAmount: 19440,
        sgstAmount: 19440,
        igstAmount: 0,
        cessAmount: 0,
        totalTaxAmount: 38880,
        totalValue: 254880
      }
    ],
    subtotal: 240000,
    totalDiscount: 24000,
    totalTaxableValue: 216000,
    cgstTotal: 19440,
    sgstTotal: 19440,
    igstTotal: 0,
    cessTotal: 0,
    totalTax: 38880,
    roundOff: 0,
    grandTotal: 254880,
    paidAmount: 127440, // 50% paid
    balanceAmount: 127440,
    dueDate: '2024-03-02',
    paymentTerms: '50% advance, 50% on completion',
    notes: 'Milestone-based payment as per agreement',
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      branch: 'Gurgaon Sector 30'
    },
    eInvoice: {
      irn: '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k',
      ackNumber: 'ACK234567890123',
      ackDate: '2024-01-31',
      signedQRCode: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzNDU2Nzg5MDEiLCJ0eXAiOiJKV1QifQ...',
      status: 'Generated'
    },
    gstr1Status: {
      included: false
    },
    tcs: {
      applicable: true,
      rate: 0.1,
      amount: 216
    },
    createdDate: '2024-01-31',
    lastModified: '2024-02-05',
    createdBy: 'Admin'
  },
  {
    id: '3',
    invoiceNumber: 'INV/2024/003',
    invoiceDate: '2024-02-01',
    challanRef: 'DC/2024/002',
    orderRef: 'SO/2024/003',
    placeOfSupply: 'Gujarat',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerGSTIN: '24KLMNO9012P3Q4',
    customerPAN: 'KLMNO9012P',
    billingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    shippingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    salesPerson: 'Suresh Patel',
    status: 'Overdue',
    paymentStatus: 'Overdue',
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
        taxableValue: 212500,
        gstRate: 18,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 38250, // Inter-state supply
        cessAmount: 0,
        totalTaxAmount: 38250,
        totalValue: 250750
      }
    ],
    subtotal: 212500,
    totalDiscount: 0,
    totalTaxableValue: 212500,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 38250,
    cessTotal: 0,
    totalTax: 38250,
    roundOff: 0,
    grandTotal: 250750,
    paidAmount: 0,
    balanceAmount: 250750,
    dueDate: '2024-02-16',
    paymentTerms: '15 days net',
    notes: 'Payment overdue - please remit immediately',
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      branch: 'Gurgaon Sector 30'
    },
    eInvoice: {
      irn: '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l',
      ackNumber: 'ACK345678901234',
      ackDate: '2024-02-01',
      signedQRCode: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM0NTY3ODkwMTIiLCJ0eXAiOiJKV1QifQ...',
      status: 'Generated'
    },
    gstr1Status: {
      included: false
    },
    createdDate: '2024-02-01',
    lastModified: '2024-02-17',
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

export default function TaxInvoice() {
  const [invoices] = useState<TaxInvoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<TaxInvoice | null>(null);
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status.toLowerCase().replace(/ /g, '') === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || invoice.paymentStatus.toLowerCase().replace(/ /g, '') === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Generated':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Generated</Badge>;
      case 'Sent':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Sent</Badge>;
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'Partially Paid':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Partially Paid</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'Partially Paid':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Paid</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEInvoiceBadge = (eInvoice?: any) => {
    if (!eInvoice) {
      return <Badge className="bg-gray-100 text-gray-800">No E-Invoice</Badge>;
    }
    
    switch (eInvoice.status) {
      case 'Generated':
        return <Badge className="bg-green-100 text-green-800">E-Invoice Generated</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800">E-Invoice Cancelled</Badge>;
      default:
        return <Badge variant="outline">{eInvoice.status}</Badge>;
    }
  };

  const getDueDateStatus = (dueDate: string, paymentStatus: string) => {
    if (paymentStatus === 'Paid') {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    }
    
    const due = new Date(dueDate);
    const today = new Date();
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <Badge className="bg-red-100 text-red-800">Overdue by {Math.abs(daysLeft)} days</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due in {daysLeft} days</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{daysLeft} days remaining</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Tax Invoice - JusFinn</title>
        <meta name="description" content="Generate and manage tax invoices with E-Invoice IRN, QR codes, and complete GST compliance." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Tax Invoice
          </h1>
          <p className="text-gray-600">Generate GST-compliant invoices with E-Invoice IRN and digital signatures</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingInvoice} onOpenChange={setIsAddingInvoice}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Tax Invoice</DialogTitle>
                <DialogDescription>
                  Generate a GST-compliant tax invoice with E-Invoice IRN and QR code
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Tax invoice creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingInvoice(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingInvoice(false)}>
                  Create Invoice
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
                placeholder="Search invoices by number, customer name, or customer code..."
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
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partiallypaid">Partially Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partiallypaid">Partially Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900">{invoices.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{invoices.reduce((sum, i) => sum + i.grandTotal, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ₹{invoices.reduce((sum, i) => sum + i.balanceAmount, 0).toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">E-Invoices</p>
                <p className="text-2xl font-bold text-purple-900">
                  {invoices.filter(i => i.eInvoice).length}
                </p>
              </div>
              <QrCode className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Tax Invoice Management
          </CardTitle>
          <CardDescription>
            Generate and track GST-compliant invoices with E-Invoice integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Details</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Amount & Payment</TableHead>
                  <TableHead>E-Invoice</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">Date: {invoice.invoiceDate}</div>
                        <div className="text-sm text-gray-500">Sales: {invoice.salesPerson}</div>
                        {invoice.orderRef && (
                          <div className="text-sm text-blue-600">Order: {invoice.orderRef}</div>
                        )}
                        {invoice.challanRef && (
                          <div className="text-sm text-purple-600">Challan: {invoice.challanRef}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.customerCode}</div>
                        <div className="text-sm font-mono text-gray-500">{invoice.customerGSTIN}</div>
                        <div className="text-sm text-gray-500">{invoice.placeOfSupply}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{invoice.grandTotal.toLocaleString()}</div>
                        <div className="text-sm text-green-600">
                          Paid: ₹{invoice.paidAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-600">
                          Balance: ₹{invoice.balanceAmount.toLocaleString()}
                        </div>
                        {getPaymentStatusBadge(invoice.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {invoice.eInvoice ? (
                          <>
                            <div className="text-sm font-mono text-green-600 truncate max-w-32">
                              {invoice.eInvoice.irn.substring(0, 16)}...
                            </div>
                            <div className="text-sm text-gray-500">
                              ACK: {invoice.eInvoice.ackNumber}
                            </div>
                            {getEInvoiceBadge(invoice.eInvoice)}
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-gray-500">Not Generated</div>
                            {getEInvoiceBadge()}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Due: {invoice.dueDate}</div>
                        {getDueDateStatus(invoice.dueDate, invoice.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Invoice {invoice.invoiceNumber}</SheetTitle>
                              <SheetDescription>
                                Complete tax invoice details with E-Invoice information and payment tracking
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="einvoice">E-Invoice</TabsTrigger>
                                  <TabsTrigger value="payment">Payment</TabsTrigger>
                                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Invoice Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Invoice Number</Label>
                                          <Input value={invoice.invoiceNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Invoice Date</Label>
                                          <Input value={invoice.invoiceDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Place of Supply</Label>
                                          <Input value={invoice.placeOfSupply} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sales Person</Label>
                                          <Input value={invoice.salesPerson} readOnly />
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="mt-2">
                                            {getStatusBadge(invoice.status)}
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
                                          <Input value={invoice.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={invoice.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer GSTIN</Label>
                                          <Input value={invoice.customerGSTIN} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer PAN</Label>
                                          <Input value={invoice.customerPAN} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">References</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <Label>Order Reference</Label>
                                          <Input value={invoice.orderRef || 'N/A'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Challan Reference</Label>
                                          <Input value={invoice.challanRef || 'N/A'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Quotation Reference</Label>
                                          <Input value={invoice.quotationRef || 'N/A'} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Amount Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>Subtotal</Label>
                                          <Input value={`₹${invoice.subtotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Discount</Label>
                                          <Input value={`₹${invoice.totalDiscount.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Tax</Label>
                                          <Input value={`₹${invoice.totalTax.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Grand Total</Label>
                                          <Input value={`₹${invoice.grandTotal.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Invoice Items</CardTitle>
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
                                            <TableHead>Taxable Value</TableHead>
                                            <TableHead>GST</TableHead>
                                            <TableHead>Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {invoice.items.map((item, index) => (
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
                                                  `₹${item.discount.toLocaleString()}` : 
                                                  '-'
                                                }
                                              </TableCell>
                                              <TableCell>₹{item.taxableValue.toLocaleString()}</TableCell>
                                              <TableCell>
                                                <div className="text-sm">
                                                  <div>CGST: ₹{item.cgstAmount.toLocaleString()}</div>
                                                  <div>SGST: ₹{item.sgstAmount.toLocaleString()}</div>
                                                  {item.igstAmount > 0 && <div>IGST: ₹{item.igstAmount.toLocaleString()}</div>}
                                                </div>
                                              </TableCell>
                                              <TableCell>₹{item.totalValue.toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="einvoice" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">E-Invoice Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {invoice.eInvoice ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label>IRN (Invoice Reference Number)</Label>
                                            <Textarea value={invoice.eInvoice.irn} readOnly className="font-mono text-sm" />
                                          </div>
                                          <div>
                                            <Label>Acknowledgment Number</Label>
                                            <Input value={invoice.eInvoice.ackNumber} readOnly />
                                          </div>
                                          <div>
                                            <Label>Acknowledgment Date</Label>
                                            <Input value={invoice.eInvoice.ackDate} readOnly />
                                          </div>
                                          <div>
                                            <Label>Status</Label>
                                            <div className="mt-2">
                                              {getEInvoiceBadge(invoice.eInvoice)}
                                            </div>
                                          </div>
                                          <div className="md:col-span-2">
                                            <Label>Signed QR Code</Label>
                                            <Textarea 
                                              value={invoice.eInvoice.signedQRCode} 
                                              readOnly 
                                              className="font-mono text-xs"
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center p-8">
                                          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">E-Invoice not generated</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            E-Invoice is required for B2B transactions above ₹50 lakhs
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="payment" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Payment Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Grand Total</Label>
                                          <Input value={`₹${invoice.grandTotal.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                        <div>
                                          <Label>Paid Amount</Label>
                                          <Input value={`₹${invoice.paidAmount.toLocaleString()}`} readOnly className="text-green-600" />
                                        </div>
                                        <div>
                                          <Label>Balance Amount</Label>
                                          <Input value={`₹${invoice.balanceAmount.toLocaleString()}`} readOnly className="text-orange-600" />
                                        </div>
                                        <div>
                                          <Label>Due Date</Label>
                                          <Input value={invoice.dueDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Payment Status</Label>
                                          <div className="mt-2">
                                            {getPaymentStatusBadge(invoice.paymentStatus)}
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Payment Terms</Label>
                                          <Textarea value={invoice.paymentTerms} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Bank Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Account Name</Label>
                                          <Input value={invoice.bankDetails.accountName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Account Number</Label>
                                          <Input value={invoice.bankDetails.accountNumber} readOnly className="font-mono" />
                                        </div>
                                        <div>
                                          <Label>Bank Name</Label>
                                          <Input value={invoice.bankDetails.bankName} readOnly />
                                        </div>
                                        <div>
                                          <Label>IFSC Code</Label>
                                          <Input value={invoice.bankDetails.ifscCode} readOnly className="font-mono" />
                                        </div>
                                        <div>
                                          <Label>Branch</Label>
                                          <Input value={invoice.bankDetails.branch} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="compliance" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">GSTR-1 Compliance</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Included in GSTR-1</Label>
                                          <div className="mt-2">
                                            <Badge className={invoice.gstr1Status.included ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                              {invoice.gstr1Status.included ? 'Yes' : 'Not Yet'}
                                            </Badge>
                                          </div>
                                        </div>
                                        {invoice.gstr1Status.period && (
                                          <div>
                                            <Label>Filing Period</Label>
                                            <Input value={invoice.gstr1Status.period} readOnly />
                                          </div>
                                        )}
                                        {invoice.gstr1Status.filingDate && (
                                          <div>
                                            <Label>Filing Date</Label>
                                            <Input value={invoice.gstr1Status.filingDate} readOnly />
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  {invoice.tcs && (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">TCS Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <Label>TCS Applicable</Label>
                                            <div className="mt-2">
                                              <Badge className={invoice.tcs.applicable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                {invoice.tcs.applicable ? 'Yes' : 'No'}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>TCS Rate</Label>
                                            <Input value={`${invoice.tcs.rate}%`} readOnly />
                                          </div>
                                          <div>
                                            <Label>TCS Amount</Label>
                                            <Input value={`₹${invoice.tcs.amount.toLocaleString()}`} readOnly />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">GST Tax Breakdown</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>CGST Total</Label>
                                          <Input value={`₹${invoice.cgstTotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>SGST Total</Label>
                                          <Input value={`₹${invoice.sgstTotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>IGST Total</Label>
                                          <Input value={`₹${invoice.igstTotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Cess Total</Label>
                                          <Input value={`₹${invoice.cessTotal.toLocaleString()}`} readOnly />
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <QrCode className="h-4 w-4" />
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