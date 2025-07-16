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
  RotateCcw, 
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
  DollarSign,
  Percent,
  Share,
  Target,
  Users,
  Clock,
  Shield,
  Receipt,
  CreditCard,
  Mail,
  Phone,
  Building,
  ArrowLeft,
  RefreshCcw
} from 'lucide-react';

interface CreditNoteItem {
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
  reasonCode: string;
  reasonDescription: string;
}

interface CreditNote {
  id: string;
  creditNoteNumber: string;
  creditNoteDate: string;
  originalInvoiceNumber: string;
  originalInvoiceDate: string;
  reasonForCredit: 'Return' | 'Allowance' | 'Pricing Error' | 'Damaged Goods' | 'Quality Issue' | 'Others';
  reasonDescription: string;
  customerCode: string;
  customerName: string;
  customerGSTIN: string;
  customerPAN: string;
  billingAddress: string;
  shippingAddress: string;
  salesPerson: string;
  status: 'Draft' | 'Generated' | 'Sent' | 'Accepted' | 'Applied' | 'Cancelled';
  items: CreditNoteItem[];
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
  appliedAmount: number;
  balanceAmount: number;
  notes: string;
  eInvoice?: {
    irn: string;
    ackNumber: string;
    ackDate: string;
    signedQRCode: string;
    status: 'Generated' | 'Cancelled';
  };
  gstImpact: {
    originalGSTLiability: number;
    reversedGSTLiability: number;
    netGSTImpact: number;
  };
  approvalWorkflow: {
    requiresApproval: boolean;
    approvedBy?: string;
    approvalDate?: string;
    approvalNotes?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  };
  createdDate: string;
  lastModified: string;
  createdBy: string;
}

// Mock data for credit notes
const mockCreditNotes: CreditNote[] = [
  {
    id: '1',
    creditNoteNumber: 'CN/2024/001',
    creditNoteDate: '2024-02-05',
    originalInvoiceNumber: 'INV/2024/001',
    originalInvoiceDate: '2024-01-30',
    reasonForCredit: 'Damaged Goods',
    reasonDescription: 'One laptop unit damaged during transit',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerGSTIN: '27ABCDE1234F1Z5',
    customerPAN: 'ABCDE1234F',
    billingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    shippingAddress: '123 Business Park, Sector 62, Noida, UP - 201301',
    salesPerson: 'Amit Kumar',
    status: 'Applied',
    items: [
      {
        itemCode: 'ITEM001',
        itemName: 'Laptop Computer',
        description: 'High-performance business laptop - damaged unit',
        hsnSacCode: '84713000',
        quantity: 1,
        unit: 'NOS',
        unitPrice: 55000,
        discount: 2750,
        discountType: 'amount',
        taxableValue: 52250,
        gstRate: 18,
        cgstAmount: 4702.5,
        sgstAmount: 4702.5,
        igstAmount: 0,
        cessAmount: 0,
        totalTaxAmount: 9405,
        totalValue: 61655,
        reasonCode: 'DMG001',
        reasonDescription: 'Physical damage during transportation'
      }
    ],
    subtotal: 55000,
    totalDiscount: 2750,
    totalTaxableValue: 52250,
    cgstTotal: 4702.5,
    sgstTotal: 4702.5,
    igstTotal: 0,
    cessTotal: 0,
    totalTax: 9405,
    roundOff: 0,
    grandTotal: 61655,
    appliedAmount: 61655,
    balanceAmount: 0,
    notes: 'Credit note issued for damaged laptop unit. Replacement shipped separately.',
    eInvoice: {
      irn: 'CN1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j',
      ackNumber: 'CNACK123456789012',
      ackDate: '2024-02-05',
      signedQRCode: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkNOMTIzNDU2Nzg5MCIsInR5cCI6IkpXVCJ9...',
      status: 'Generated'
    },
    gstImpact: {
      originalGSTLiability: 47025,
      reversedGSTLiability: 9405,
      netGSTImpact: -9405
    },
    approvalWorkflow: {
      requiresApproval: true,
      approvedBy: 'Sales Manager',
      approvalDate: '2024-02-05',
      approvalNotes: 'Approved due to transit damage. Valid claim.',
      status: 'Approved'
    },
    createdDate: '2024-02-05',
    lastModified: '2024-02-06',
    createdBy: 'Admin'
  },
  {
    id: '2',
    creditNoteNumber: 'CN/2024/002',
    creditNoteDate: '2024-02-08',
    originalInvoiceNumber: 'INV/2024/002',
    originalInvoiceDate: '2024-01-31',
    reasonForCredit: 'Pricing Error',
    reasonDescription: 'Incorrect pricing applied - discount not given',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerGSTIN: '19FGHIJ5678K2L3',
    customerPAN: 'FGHIJ5678K',
    billingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    shippingAddress: '456 Export House, Marine Drive, Mumbai, MH - 400001',
    salesPerson: 'Priya Sharma',
    status: 'Generated',
    items: [
      {
        itemCode: 'SERV001',
        itemName: 'Software Development Services',
        description: 'Pricing correction for volume discount',
        hsnSacCode: '998314',
        quantity: 80,
        unit: 'HOURS',
        unitPrice: 2000,
        discount: 16000,
        discountType: 'amount',
        taxableValue: 144000,
        gstRate: 18,
        cgstAmount: 12960,
        sgstAmount: 12960,
        igstAmount: 0,
        cessAmount: 0,
        totalTaxAmount: 25920,
        totalValue: 169920,
        reasonCode: 'PRC001',
        reasonDescription: 'Volume discount not applied during billing'
      }
    ],
    subtotal: 160000,
    totalDiscount: 16000,
    totalTaxableValue: 144000,
    cgstTotal: 12960,
    sgstTotal: 12960,
    igstTotal: 0,
    cessTotal: 0,
    totalTax: 25920,
    roundOff: 0,
    grandTotal: 169920,
    appliedAmount: 0,
    balanceAmount: 169920,
    notes: 'Credit note for volume discount correction as per agreement.',
    gstImpact: {
      originalGSTLiability: 38880,
      reversedGSTLiability: 25920,
      netGSTImpact: -25920
    },
    approvalWorkflow: {
      requiresApproval: true,
      approvedBy: 'Finance Manager',
      approvalDate: '2024-02-08',
      approvalNotes: 'Valid pricing correction as per customer agreement.',
      status: 'Approved'
    },
    createdDate: '2024-02-08',
    lastModified: '2024-02-08',
    createdBy: 'Admin'
  },
  {
    id: '3',
    creditNoteNumber: 'CN/2024/003',
    creditNoteDate: '2024-02-10',
    originalInvoiceNumber: 'INV/2024/003',
    originalInvoiceDate: '2024-02-01',
    reasonForCredit: 'Return',
    reasonDescription: 'Customer returned 5 chairs - change in requirement',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerGSTIN: '24KLMNO9012P3Q4',
    customerPAN: 'KLMNO9012P',
    billingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    shippingAddress: '789 Commercial Complex, C.G. Road, Ahmedabad, GJ - 380009',
    salesPerson: 'Suresh Patel',
    status: 'Accepted',
    items: [
      {
        itemCode: 'ITEM002',
        itemName: 'Office Chair',
        description: 'Ergonomic office chair - returned units',
        hsnSacCode: '94013000',
        quantity: 5,
        unit: 'NOS',
        unitPrice: 8500,
        discount: 0,
        discountType: 'amount',
        taxableValue: 42500,
        gstRate: 18,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 7650, // Inter-state supply
        cessAmount: 0,
        totalTaxAmount: 7650,
        totalValue: 50150,
        reasonCode: 'RET001',
        reasonDescription: 'Customer requirement changed - no longer needed'
      }
    ],
    subtotal: 42500,
    totalDiscount: 0,
    totalTaxableValue: 42500,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 7650,
    cessTotal: 0,
    totalTax: 7650,
    roundOff: 0,
    grandTotal: 50150,
    appliedAmount: 0,
    balanceAmount: 50150,
    notes: 'Credit note for returned chairs. Items received back in good condition.',
    gstImpact: {
      originalGSTLiability: 38250,
      reversedGSTLiability: 7650,
      netGSTImpact: -7650
    },
    approvalWorkflow: {
      requiresApproval: false,
      status: 'Approved'
    },
    createdDate: '2024-02-10',
    lastModified: '2024-02-11',
    createdBy: 'Admin'
  }
];

export default function CreditNotes() {
  const [creditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [isAddingCreditNote, setIsAddingCreditNote] = useState(false);

  const filteredCreditNotes = creditNotes.filter(creditNote => {
    const matchesSearch = creditNote.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creditNote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creditNote.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || creditNote.status.toLowerCase() === filterStatus;
    const matchesReason = filterReason === 'all' || creditNote.reasonForCredit.toLowerCase().replace(/ /g, '') === filterReason;
    return matchesSearch && matchesStatus && matchesReason;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      case 'Generated':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Generated</Badge>;
      case 'Sent':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Sent</Badge>;
      case 'Accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case 'Applied':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Applied</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'Return':
        return <Badge className="bg-blue-100 text-blue-800">Return</Badge>;
      case 'Allowance':
        return <Badge className="bg-green-100 text-green-800">Allowance</Badge>;
      case 'Pricing Error':
        return <Badge className="bg-yellow-100 text-yellow-800">Pricing Error</Badge>;
      case 'Damaged Goods':
        return <Badge className="bg-red-100 text-red-800">Damaged Goods</Badge>;
      case 'Quality Issue':
        return <Badge className="bg-orange-100 text-orange-800">Quality Issue</Badge>;
      case 'Others':
        return <Badge className="bg-gray-100 text-gray-800">Others</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  const getApprovalBadge = (approval: any) => {
    if (!approval.requiresApproval) {
      return <Badge className="bg-gray-100 text-gray-800">No Approval Required</Badge>;
    }
    
    switch (approval.status) {
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{approval.status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Credit Notes - JusFinn</title>
        <meta name="description" content="Manage credit notes for returns, adjustments, and GST reversal with complete compliance tracking." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Credit Notes
          </h1>
          <p className="text-gray-600">Process returns, adjustments, and reversals with GST compliance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingCreditNote} onOpenChange={setIsAddingCreditNote}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Credit Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Credit Note</DialogTitle>
                <DialogDescription>
                  Issue a credit note for returns, adjustments, or corrections
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Credit note creation form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingCreditNote(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingCreditNote(false)}>
                  Create Credit Note
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
                placeholder="Search credit notes by number, customer name, or invoice number..."
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
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterReason} onValueChange={setFilterReason}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="allowance">Allowance</SelectItem>
                  <SelectItem value="pricingerror">Pricing Error</SelectItem>
                  <SelectItem value="damagedgoods">Damaged Goods</SelectItem>
                  <SelectItem value="qualityissue">Quality Issue</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Note Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Credit Notes</p>
                <p className="text-2xl font-bold text-blue-900">{creditNotes.length}</p>
              </div>
              <RotateCcw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Credit Amount</p>
                <p className="text-2xl font-bold text-red-900">
                  ₹{creditNotes.reduce((sum, cn) => sum + cn.grandTotal, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Applied Credits</p>
                <p className="text-2xl font-bold text-green-900">
                  {creditNotes.filter(cn => cn.status === 'Applied').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">GST Reversed</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₹{creditNotes.reduce((sum, cn) => sum + Math.abs(cn.gstImpact.netGSTImpact), 0).toLocaleString()}
                </p>
              </div>
              <Percent className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Credit Note Management
          </CardTitle>
          <CardDescription>
            Track credit notes for returns, adjustments, and GST reversals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit Note Details</TableHead>
                  <TableHead>Original Invoice</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Reason & Amount</TableHead>
                  <TableHead>GST Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreditNotes.map((creditNote) => (
                  <TableRow key={creditNote.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{creditNote.creditNoteNumber}</div>
                        <div className="text-sm text-gray-500">Date: {creditNote.creditNoteDate}</div>
                        <div className="text-sm text-gray-500">By: {creditNote.salesPerson}</div>
                        {getApprovalBadge(creditNote.approvalWorkflow)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-blue-600">{creditNote.originalInvoiceNumber}</div>
                        <div className="text-sm text-gray-500">Date: {creditNote.originalInvoiceDate}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ArrowLeft className="h-3 w-3 mr-1" />
                          Reference
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{creditNote.customerName}</div>
                        <div className="text-sm text-gray-500">{creditNote.customerCode}</div>
                        <div className="text-sm font-mono text-gray-500">{creditNote.customerGSTIN}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getReasonBadge(creditNote.reasonForCredit)}
                        <div className="font-medium text-red-600">₹{creditNote.grandTotal.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Applied: ₹{creditNote.appliedAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-600">
                          Balance: ₹{creditNote.balanceAmount.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-red-600">
                          Reversed: ₹{Math.abs(creditNote.gstImpact.netGSTImpact).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Original: ₹{creditNote.gstImpact.originalGSTLiability.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Impact: {creditNote.gstImpact.netGSTImpact < 0 ? '-' : '+'}₹{Math.abs(creditNote.gstImpact.netGSTImpact).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(creditNote.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCreditNote(creditNote)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>Credit Note {creditNote.creditNoteNumber}</SheetTitle>
                              <SheetDescription>
                                Complete credit note details with GST impact and approval workflow
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="items">Items</TabsTrigger>
                                  <TabsTrigger value="gst">GST Impact</TabsTrigger>
                                  <TabsTrigger value="approval">Approval</TabsTrigger>
                                  <TabsTrigger value="einvoice">E-Invoice</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Credit Note Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Credit Note Number</Label>
                                          <Input value={creditNote.creditNoteNumber} readOnly />
                                        </div>
                                        <div>
                                          <Label>Credit Note Date</Label>
                                          <Input value={creditNote.creditNoteDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Reason for Credit</Label>
                                          <div className="mt-2">
                                            {getReasonBadge(creditNote.reasonForCredit)}
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Reason Description</Label>
                                          <Textarea value={creditNote.reasonDescription} readOnly />
                                        </div>
                                        <div>
                                          <Label>Sales Person</Label>
                                          <Input value={creditNote.salesPerson} readOnly />
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <div className="mt-2">
                                            {getStatusBadge(creditNote.status)}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Original Invoice Reference</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Original Invoice Number</Label>
                                          <Input value={creditNote.originalInvoiceNumber} readOnly className="text-blue-600" />
                                        </div>
                                        <div>
                                          <Label>Original Invoice Date</Label>
                                          <Input value={creditNote.originalInvoiceDate} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Name</Label>
                                          <Input value={creditNote.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer GSTIN</Label>
                                          <Input value={creditNote.customerGSTIN} readOnly />
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
                                          <Input value={`₹${creditNote.subtotal.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Discount</Label>
                                          <Input value={`₹${creditNote.totalDiscount.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Tax</Label>
                                          <Input value={`₹${creditNote.totalTax.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Grand Total</Label>
                                          <Input value={`₹${creditNote.grandTotal.toLocaleString()}`} readOnly className="font-semibold text-red-600" />
                                        </div>
                                        <div>
                                          <Label>Applied Amount</Label>
                                          <Input value={`₹${creditNote.appliedAmount.toLocaleString()}`} readOnly className="text-green-600" />
                                        </div>
                                        <div>
                                          <Label>Balance Amount</Label>
                                          <Input value={`₹${creditNote.balanceAmount.toLocaleString()}`} readOnly className="text-orange-600" />
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="items" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Credit Note Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>HSN/SAC</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Rate</TableHead>
                                            <TableHead>Taxable Value</TableHead>
                                            <TableHead>GST</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Reason</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {creditNote.items.map((item, index) => (
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
                                              <TableCell>
                                                <div className="text-sm">
                                                  <div>CGST: ₹{item.cgstAmount.toLocaleString()}</div>
                                                  <div>SGST: ₹{item.sgstAmount.toLocaleString()}</div>
                                                  {item.igstAmount > 0 && <div>IGST: ₹{item.igstAmount.toLocaleString()}</div>}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-red-600">₹{item.totalValue.toLocaleString()}</TableCell>
                                              <TableCell>
                                                <div className="text-sm">
                                                  <div className="font-medium">{item.reasonCode}</div>
                                                  <div className="text-gray-500">{item.reasonDescription}</div>
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="gst" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">GST Impact Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <Label>Original GST Liability</Label>
                                          <Input 
                                            value={`₹${creditNote.gstImpact.originalGSTLiability.toLocaleString()}`} 
                                            readOnly 
                                            className="text-blue-600"
                                          />
                                        </div>
                                        <div>
                                          <Label>Reversed GST Liability</Label>
                                          <Input 
                                            value={`₹${creditNote.gstImpact.reversedGSTLiability.toLocaleString()}`} 
                                            readOnly 
                                            className="text-red-600"
                                          />
                                        </div>
                                        <div>
                                          <Label>Net GST Impact</Label>
                                          <Input 
                                            value={`₹${Math.abs(creditNote.gstImpact.netGSTImpact).toLocaleString()}`} 
                                            readOnly 
                                            className={creditNote.gstImpact.netGSTImpact < 0 ? 'text-red-600' : 'text-green-600'}
                                          />
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <h4 className="font-medium mb-3">GST Component Breakdown</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                          <div>
                                            <Label>CGST Reversed</Label>
                                            <Input value={`₹${creditNote.cgstTotal.toLocaleString()}`} readOnly />
                                          </div>
                                          <div>
                                            <Label>SGST Reversed</Label>
                                            <Input value={`₹${creditNote.sgstTotal.toLocaleString()}`} readOnly />
                                          </div>
                                          <div>
                                            <Label>IGST Reversed</Label>
                                            <Input value={`₹${creditNote.igstTotal.toLocaleString()}`} readOnly />
                                          </div>
                                          <div>
                                            <Label>Cess Reversed</Label>
                                            <Input value={`₹${creditNote.cessTotal.toLocaleString()}`} readOnly />
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="p-4 bg-red-50 rounded-lg">
                                        <h5 className="font-medium text-red-800 mb-2">Important Note</h5>
                                        <p className="text-sm text-red-700">
                                          This credit note will reduce your GST liability for the period. Ensure proper reporting in GSTR-1 
                                          and maintain supporting documents for audit purposes.
                                        </p>
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
                                          <div className="mt-2">
                                            <Badge className={creditNote.approvalWorkflow.requiresApproval ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                              {creditNote.approvalWorkflow.requiresApproval ? 'Yes' : 'No'}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Approval Status</Label>
                                          <div className="mt-2">
                                            {getApprovalBadge(creditNote.approvalWorkflow)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {creditNote.approvalWorkflow.approvedBy && (
                                        <>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label>Approved By</Label>
                                              <Input value={creditNote.approvalWorkflow.approvedBy} readOnly />
                                            </div>
                                            <div>
                                              <Label>Approval Date</Label>
                                              <Input value={creditNote.approvalWorkflow.approvalDate || ''} readOnly />
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <Label>Approval Notes</Label>
                                            <Textarea value={creditNote.approvalWorkflow.approvalNotes || ''} readOnly />
                                          </div>
                                        </>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="einvoice" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">E-Invoice Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {creditNote.eInvoice ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label>IRN (Invoice Reference Number)</Label>
                                            <Textarea value={creditNote.eInvoice.irn} readOnly className="font-mono text-sm" />
                                          </div>
                                          <div>
                                            <Label>Acknowledgment Number</Label>
                                            <Input value={creditNote.eInvoice.ackNumber} readOnly />
                                          </div>
                                          <div>
                                            <Label>Acknowledgment Date</Label>
                                            <Input value={creditNote.eInvoice.ackDate} readOnly />
                                          </div>
                                          <div>
                                            <Label>Status</Label>
                                            <div className="mt-2">
                                              <Badge className={creditNote.eInvoice.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                {creditNote.eInvoice.status}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className="md:col-span-2">
                                            <Label>Signed QR Code</Label>
                                            <Textarea 
                                              value={creditNote.eInvoice.signedQRCode} 
                                              readOnly 
                                              className="font-mono text-xs"
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center p-8">
                                          <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                          <p className="text-gray-500">E-Invoice not generated</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            E-Invoice for credit notes follows same rules as regular invoices
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