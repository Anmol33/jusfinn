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
  Wallet, 
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
  DollarSign,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Mail,
  Phone,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Banknote,
  Shield,
  Bell
} from 'lucide-react';

interface PaymentEntry {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMode: 'Cash' | 'Cheque' | 'Bank Transfer' | 'UPI' | 'Card' | 'Online';
  referenceNumber: string;
  bankName?: string;
  chequeNumber?: string;
  chequeDate?: string;
  upiId?: string;
  transactionId?: string;
  status: 'Received' | 'Pending' | 'Bounced' | 'Cancelled';
  notes?: string;
}

interface TCSCalculation {
  applicable: boolean;
  rate: number;
  thresholdAmount: number;
  tcsAmount: number;
  totalReceipts: number;
}

interface PaymentCollection {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGSTIN: string;
  paymentAgainst: 'Invoice' | 'Advance' | 'On Account';
  invoiceReferences: string[];
  totalInvoiceAmount: number;
  totalAmountReceived: number;
  allocation: {
    invoiceNumber: string;
    invoiceAmount: number;
    allocatedAmount: number;
    balanceAmount: number;
  }[];
  paymentEntries: PaymentEntry[];
  tcsCalculation?: TCSCalculation;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    depositedTo: string;
  };
  reconciliation: {
    reconciled: boolean;
    reconciledDate?: string;
    reconciledBy?: string;
    bankStatementRef?: string;
    discrepancy?: number;
  };
  reminderHistory: {
    sentDate: string;
    reminderType: 'Email' | 'SMS' | 'WhatsApp' | 'Call';
    recipient: string;
    status: 'Sent' | 'Delivered' | 'Failed';
    response?: string;
  }[];
  status: 'Draft' | 'Confirmed' | 'Deposited' | 'Reconciled' | 'Partial';
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for payment collections
const mockPayments: PaymentCollection[] = [
  {
    id: '1',
    receiptNumber: 'RCP/2024/001',
    receiptDate: '2024-02-05',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerEmail: 'rahul@techsolutions.com',
    customerPhone: '+91-9876543210',
    customerGSTIN: '27ABCDE1234F1Z5',
    paymentAgainst: 'Invoice',
    invoiceReferences: ['INV/2024/001'],
    totalInvoiceAmount: 308275,
    totalAmountReceived: 308275,
    allocation: [
      {
        invoiceNumber: 'INV/2024/001',
        invoiceAmount: 308275,
        allocatedAmount: 308275,
        balanceAmount: 0
      }
    ],
    paymentEntries: [
      {
        id: 'PE1',
        paymentDate: '2024-02-05',
        amount: 308275,
        paymentMode: 'Bank Transfer',
        referenceNumber: 'NEFT123456789',
        bankName: 'HDFC Bank',
        transactionId: 'TXN2024020512345',
        status: 'Received',
        notes: 'Full payment received for laptop purchase'
      }
    ],
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      depositedTo: 'Current Account'
    },
    reconciliation: {
      reconciled: true,
      reconciledDate: '2024-02-06',
      reconciledBy: 'Finance Team',
      bankStatementRef: 'BS/2024/02/001',
      discrepancy: 0
    },
    reminderHistory: [
      {
        sentDate: '2024-02-01',
        reminderType: 'Email',
        recipient: 'rahul@techsolutions.com',
        status: 'Delivered',
        response: 'Customer confirmed payment on 5th Feb'
      },
      {
        sentDate: '2024-02-03',
        reminderType: 'WhatsApp',
        recipient: '+91-9876543210',
        status: 'Delivered'
      }
    ],
    status: 'Reconciled',
    createdDate: '2024-02-05',
    lastModified: '2024-02-06',
    createdBy: 'Admin'
  },
  {
    id: '2',
    receiptNumber: 'RCP/2024/002',
    receiptDate: '2024-02-08',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerEmail: 'priya@globalexports.com',
    customerPhone: '+91-9123456789',
    customerGSTIN: '19FGHIJ5678K2L3',
    paymentAgainst: 'Invoice',
    invoiceReferences: ['INV/2024/002'],
    totalInvoiceAmount: 254880,
    totalAmountReceived: 127440,
    allocation: [
      {
        invoiceNumber: 'INV/2024/002',
        invoiceAmount: 254880,
        allocatedAmount: 127440,
        balanceAmount: 127440
      }
    ],
    paymentEntries: [
      {
        id: 'PE2',
        paymentDate: '2024-02-08',
        amount: 127440,
        paymentMode: 'Bank Transfer',
        referenceNumber: 'RTGS987654321',
        bankName: 'SBI Bank',
        transactionId: 'TXN2024020898765',
        status: 'Received',
        notes: '50% advance payment as per agreement'
      }
    ],
    tcsCalculation: {
      applicable: true,
      rate: 0.1,
      thresholdAmount: 5000000,
      tcsAmount: 216,
      totalReceipts: 2160000
    },
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      depositedTo: 'Current Account'
    },
    reconciliation: {
      reconciled: true,
      reconciledDate: '2024-02-09',
      reconciledBy: 'Finance Team',
      bankStatementRef: 'BS/2024/02/002'
    },
    reminderHistory: [
      {
        sentDate: '2024-02-06',
        reminderType: 'Email',
        recipient: 'priya@globalexports.com',
        status: 'Delivered',
        response: 'Advance payment processed'
      }
    ],
    status: 'Partial',
    createdDate: '2024-02-08',
    lastModified: '2024-02-09',
    createdBy: 'Admin'
  },
  {
    id: '3',
    receiptNumber: 'RCP/2024/003',
    receiptDate: '2024-02-10',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerEmail: 'amit@retailchain.com',
    customerPhone: '+91-9898765432',
    customerGSTIN: '24KLMNO9012P3Q4',
    paymentAgainst: 'Advance',
    invoiceReferences: [],
    totalInvoiceAmount: 0,
    totalAmountReceived: 100000,
    allocation: [],
    paymentEntries: [
      {
        id: 'PE3',
        paymentDate: '2024-02-10',
        amount: 100000,
        paymentMode: 'Cheque',
        referenceNumber: 'CHQ001234',
        chequeNumber: '123456',
        chequeDate: '2024-02-10',
        bankName: 'ICICI Bank',
        status: 'Pending',
        notes: 'Advance payment for future orders'
      }
    ],
    bankDetails: {
      accountName: 'JusFinn Technologies Pvt Ltd',
      accountNumber: '1234567890123456',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      depositedTo: 'Current Account'
    },
    reconciliation: {
      reconciled: false
    },
    reminderHistory: [],
    status: 'Deposited',
    createdDate: '2024-02-10',
    lastModified: '2024-02-10',
    createdBy: 'Admin'
  }
];

export default function PaymentCollection() {
  const [payments] = useState<PaymentCollection[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentMode, setFilterPaymentMode] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentCollection | null>(null);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus;
    const matchesPaymentMode = filterPaymentMode === 'all' || 
                              payment.paymentEntries.some(pe => pe.paymentMode.toLowerCase().replace(/ /g, '') === filterPaymentMode);
    return matchesSearch && matchesStatus && matchesPaymentMode;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case 'Deposited':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Deposited</Badge>;
      case 'Reconciled':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Reconciled</Badge>;
      case 'Partial':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentModeBadge = (mode: string) => {
    switch (mode) {
      case 'Cash':
        return <Badge className="bg-green-100 text-green-800">Cash</Badge>;
      case 'Cheque':
        return <Badge className="bg-blue-100 text-blue-800">Cheque</Badge>;
      case 'Bank Transfer':
        return <Badge className="bg-purple-100 text-purple-800">Bank Transfer</Badge>;
      case 'UPI':
        return <Badge className="bg-orange-100 text-orange-800">UPI</Badge>;
      case 'Card':
        return <Badge className="bg-yellow-100 text-yellow-800">Card</Badge>;
      case 'Online':
        return <Badge className="bg-blue-100 text-blue-800">Online</Badge>;
      default:
        return <Badge variant="outline">{mode}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Received':
        return <Badge className="bg-green-100 text-green-800">Received</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Bounced':
        return <Badge className="bg-red-100 text-red-800">Bounced</Badge>;
      case 'Cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCollectionEfficiency = () => {
    const totalInvoiceAmount = payments.reduce((sum, p) => sum + p.totalInvoiceAmount, 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.totalAmountReceived, 0);
    return totalInvoiceAmount > 0 ? ((totalCollected / totalInvoiceAmount) * 100).toFixed(1) : '0';
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Payment Collection - JusFinn</title>
        <meta name="description" content="Track payments, manage bank reconciliation, and automate collection reminders with TCS compliance." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Payment Collection
          </h1>
          <p className="text-gray-600">Track payments, bank reconciliation, and automated collection management</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Record customer payment and allocate against invoices
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Payment recording form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingPayment(false)}>
                  Record Payment
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
                placeholder="Search payments by receipt number, customer name, or customer code..."
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
                  <SelectItem value="deposited">Deposited</SelectItem>
                  <SelectItem value="reconciled">Reconciled</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPaymentMode} onValueChange={setFilterPaymentMode}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Collections</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{payments.reduce((sum, p) => sum + p.totalAmountReceived, 0).toLocaleString()}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Collection Efficiency</p>
                <p className="text-2xl font-bold text-green-900">{getCollectionEfficiency()}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Reconciliation</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {payments.filter(p => !p.reconciliation.reconciled).length}
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
                <p className="text-sm text-purple-600 font-medium">TCS Collected</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{payments.reduce((sum, p) => sum + (p.tcsCalculation?.tcsAmount || 0), 0).toLocaleString()}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Payment Collection Management
          </CardTitle>
          <CardDescription>
            Track customer payments with bank reconciliation and automated reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Details</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Payment Details</TableHead>
                  <TableHead>Amount & Allocation</TableHead>
                  <TableHead>Reconciliation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{payment.receiptNumber}</div>
                        <div className="text-sm text-gray-500">Date: {payment.receiptDate}</div>
                        <div className="text-sm text-gray-500">
                          Against: {payment.paymentAgainst}
                        </div>
                        {payment.invoiceReferences.length > 0 && (
                          <div className="text-sm text-blue-600">
                            Invoices: {payment.invoiceReferences.join(', ')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerCode}</div>
                        <div className="text-sm font-mono text-gray-500">{payment.customerGSTIN}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {payment.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {payment.paymentEntries.map((entry, index) => (
                          <div key={index} className="space-y-1">
                            {getPaymentModeBadge(entry.paymentMode)}
                            <div className="text-sm">₹{entry.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{entry.referenceNumber}</div>
                            {getPaymentStatusBadge(entry.status)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{payment.totalAmountReceived.toLocaleString()}</div>
                        {payment.totalInvoiceAmount > 0 && (
                          <>
                            <div className="text-sm text-gray-500">
                              Invoice: ₹{payment.totalInvoiceAmount.toLocaleString()}
                            </div>
                            <div className="text-sm">
                              <Progress 
                                value={(payment.totalAmountReceived / payment.totalInvoiceAmount) * 100} 
                                className="h-2"
                              />
                              <span className="text-xs text-gray-500">
                                {((payment.totalAmountReceived / payment.totalInvoiceAmount) * 100).toFixed(1)}% collected
                              </span>
                            </div>
                          </>
                        )}
                        {payment.tcsCalculation?.applicable && (
                          <div className="text-sm text-purple-600">
                            TCS: ₹{payment.tcsCalculation.tcsAmount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {payment.reconciliation.reconciled ? (
                          <>
                            <Badge className="bg-green-100 text-green-800">Reconciled</Badge>
                            <div className="text-sm text-gray-500">
                              Date: {payment.reconciliation.reconciledDate}
                            </div>
                            <div className="text-sm text-gray-500">
                              By: {payment.reconciliation.reconciledBy}
                            </div>
                          </>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Payment {payment.receiptNumber}</SheetTitle>
                              <SheetDescription>
                                Complete payment details with allocation, reconciliation, and reminder tracking
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                                  <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
                                  <TabsTrigger value="tcs">TCS</TabsTrigger>
                                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Payment Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Receipt Number</Label>
                                          <Input value={payment.receiptNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Receipt Date</Label>
                                          <Input value={payment.receiptDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Payment Against</Label>
                                          <Input value={payment.paymentAgainst} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Amount Received</Label>
                                          <Input value={`₹${payment.totalAmountReceived.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="mt-2">
                                            {getStatusBadge(payment.status)}
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
                                          <Input value={payment.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={payment.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer GSTIN</Label>
                                          <Input value={payment.customerGSTIN} readOnly />
                                        </div>
                                        <div>
                                          <Label>Email</Label>
                                          <Input value={payment.customerEmail} readOnly />
                                        </div>
                                        <div>
                                          <Label>Phone</Label>
                                          <Input value={payment.customerPhone} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Entries</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Mode</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Bank/Details</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Notes</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {payment.paymentEntries.map((entry, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{entry.paymentDate}</TableCell>
                                              <TableCell>{getPaymentModeBadge(entry.paymentMode)}</TableCell>
                                              <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                                              <TableCell className="font-mono text-sm">{entry.referenceNumber}</TableCell>
                                              <TableCell>
                                                {entry.bankName && <div>{entry.bankName}</div>}
                                                {entry.chequeNumber && <div>Cheque: {entry.chequeNumber}</div>}
                                                {entry.upiId && <div>UPI: {entry.upiId}</div>}
                                                {entry.transactionId && <div>TXN: {entry.transactionId}</div>}
                                              </TableCell>
                                              <TableCell>{getPaymentStatusBadge(entry.status)}</TableCell>
                                              <TableCell className="text-sm">{entry.notes}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Bank Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Account Name</Label>
                                          <Input value={payment.bankDetails.accountName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Account Number</Label>
                                          <Input value={payment.bankDetails.accountNumber} readOnly className="font-mono" />
                                        </div>
                                        <div>
                                          <Label>Bank Name</Label>
                                          <Input value={payment.bankDetails.bankName} readOnly />
                                        </div>
                                        <div>
                                          <Label>IFSC Code</Label>
                                          <Input value={payment.bankDetails.ifscCode} readOnly className="font-mono" />
                                        </div>
                                        <div>
                                          <Label>Deposited To</Label>
                                          <Input value={payment.bankDetails.depositedTo} readOnly />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="allocation" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Allocation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {payment.allocation.length > 0 ? (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Invoice Number</TableHead>
                                              <TableHead>Invoice Amount</TableHead>
                                              <TableHead>Allocated Amount</TableHead>
                                              <TableHead>Balance Amount</TableHead>
                                              <TableHead>Allocation %</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {payment.allocation.map((allocation, index) => (
                                              <TableRow key={index}>
                                                <TableCell className="font-medium text-blue-600">
                                                  {allocation.invoiceNumber}
                                                </TableCell>
                                                <TableCell>₹{allocation.invoiceAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-green-600">
                                                  ₹{allocation.allocatedAmount.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-orange-600">
                                                  ₹{allocation.balanceAmount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                  <div className="flex items-center space-x-2">
                                                    <Progress 
                                                      value={(allocation.allocatedAmount / allocation.invoiceAmount) * 100} 
                                                      className="h-2 flex-1"
                                                    />
                                                    <span className="text-sm">
                                                      {((allocation.allocatedAmount / allocation.invoiceAmount) * 100).toFixed(1)}%
                                                    </span>
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <div className="text-center p-8">
                                          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">Advance payment - no invoice allocation</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            This amount will be available for future invoice adjustments
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="reconciliation" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Bank Reconciliation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Reconciliation Status</Label>
                                          <div className="mt-2">
                                            <Badge className={payment.reconciliation.reconciled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                              {payment.reconciliation.reconciled ? 'Reconciled' : 'Pending Reconciliation'}
                                            </Badge>
                                          </div>
                                        </div>
                                        {payment.reconciliation.reconciled && (
                                          <>
                                            <div>
                                              <Label>Reconciled Date</Label>
                                              <Input value={payment.reconciliation.reconciledDate || ''} readOnly />
                                            </div>
                                            <div>
                                              <Label>Reconciled By</Label>
                                              <Input value={payment.reconciliation.reconciledBy || ''} readOnly />
                                            </div>
                                            <div>
                                              <Label>Bank Statement Reference</Label>
                                              <Input value={payment.reconciliation.bankStatementRef || ''} readOnly />
                                            </div>
                                            {payment.reconciliation.discrepancy !== undefined && (
                                              <div>
                                                <Label>Discrepancy</Label>
                                                <Input 
                                                  value={`₹${payment.reconciliation.discrepancy.toLocaleString()}`} 
                                                  readOnly 
                                                  className={payment.reconciliation.discrepancy === 0 ? 'text-green-600' : 'text-red-600'}
                                                />
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                      
                                      {!payment.reconciliation.reconciled && (
                                        <div className="p-4 bg-yellow-50 rounded-lg">
                                          <h5 className="font-medium text-yellow-800 mb-2">Pending Reconciliation</h5>
                                          <p className="text-sm text-yellow-700">
                                            This payment is pending bank reconciliation. Please match with bank statement and update status.
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="tcs" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">TCS (Tax Collected at Source)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {payment.tcsCalculation ? (
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label>TCS Applicable</Label>
                                            <div className="mt-2">
                                              <Badge className={payment.tcsCalculation.applicable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                {payment.tcsCalculation.applicable ? 'Yes' : 'No'}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>TCS Rate</Label>
                                            <Input value={`${payment.tcsCalculation.rate}%`} readOnly />
                                          </div>
                                          <div>
                                            <Label>Threshold Amount</Label>
                                            <Input value={`₹${payment.tcsCalculation.thresholdAmount.toLocaleString()}`} readOnly />
                                          </div>
                                          <div>
                                            <Label>Total Receipts (Annual)</Label>
                                            <Input value={`₹${payment.tcsCalculation.totalReceipts.toLocaleString()}`} readOnly />
                                          </div>
                                          <div>
                                            <Label>TCS Amount</Label>
                                            <Input 
                                              value={`₹${payment.tcsCalculation.tcsAmount.toLocaleString()}`} 
                                              readOnly 
                                              className="text-red-600 font-semibold"
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center p-8">
                                          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">TCS not applicable for this payment</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            TCS applies when total receipts exceed ₹50 lakhs in a financial year
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="reminders" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Reminder History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {payment.reminderHistory.length > 0 ? (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Date</TableHead>
                                              <TableHead>Type</TableHead>
                                              <TableHead>Recipient</TableHead>
                                              <TableHead>Status</TableHead>
                                              <TableHead>Response</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {payment.reminderHistory.map((reminder, index) => (
                                              <TableRow key={index}>
                                                <TableCell>{reminder.sentDate}</TableCell>
                                                <TableCell>
                                                  <Badge className="bg-blue-100 text-blue-800">
                                                    {reminder.reminderType}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">{reminder.recipient}</TableCell>
                                                <TableCell>
                                                  <Badge className={
                                                    reminder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    reminder.status === 'Sent' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                  }>
                                                    {reminder.status}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">{reminder.response || '-'}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <div className="text-center p-8">
                                          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">No reminders sent</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            Payment received without requiring reminders
                                          </p>
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