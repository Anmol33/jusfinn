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
  Timer, 
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
  TrendingDown,
  Users,
  Bell,
  Send,
  MessageSquare,
  Activity,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface AgingBucket {
  range: string;
  amount: number;
  invoiceCount: number;
  percentage: number;
}

interface ReceivableRecord {
  id: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGSTIN: string;
  customerRating: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'High Risk';
  paymentTerms: string;
  creditLimit: number;
  totalOutstanding: number;
  overdueAmount: number;
  currentAmount: number;
  agingBuckets: {
    current: number;          // 0-30 days
    bucket1: number;          // 31-60 days
    bucket2: number;          // 61-90 days
    bucket3: number;          // 91-120 days
    bucket4: number;          // 120+ days
  };
  invoices: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    balanceAmount: number;
    daysOverdue: number;
    status: 'Current' | 'Overdue' | 'Critical';
  }[];
  paymentHistory: {
    averagePaymentDays: number;
    onTimePaymentPercent: number;
    lastPaymentDate: string;
    lastPaymentAmount: number;
    totalPaymentsReceived: number;
  };
  followUpHistory: {
    lastContactDate?: string;
    nextFollowUpDate?: string;
    contactAttempts: number;
    preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp' | 'All';
    notes: string;
    assignedTo: string;
  };
  reminders: {
    autoRemindersEnabled: boolean;
    lastReminderSent?: string;
    reminderFrequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
    escalationLevel: 'Level 1' | 'Level 2' | 'Level 3' | 'Legal';
  };
  riskAssessment: {
    riskScore: number;
    riskFactors: string[];
    creditWorthiness: 'High' | 'Medium' | 'Low';
    recommendedAction: string;
  };
  createdDate: string;
  lastModified: string;
}

// Mock data for receivables
const mockReceivables: ReceivableRecord[] = [
  {
    id: '1',
    customerCode: 'CUST001',
    customerName: 'Tech Solutions Pvt Ltd',
    customerEmail: 'rahul@techsolutions.com',
    customerPhone: '+91-9876543210',
    customerGSTIN: '27ABCDE1234F1Z5',
    customerRating: 'Excellent',
    paymentTerms: '30 days net',
    creditLimit: 500000,
    totalOutstanding: 0,
    overdueAmount: 0,
    currentAmount: 0,
    agingBuckets: {
      current: 0,
      bucket1: 0,
      bucket2: 0,
      bucket3: 0,
      bucket4: 0
    },
    invoices: [],
    paymentHistory: {
      averagePaymentDays: 28,
      onTimePaymentPercent: 95,
      lastPaymentDate: '2024-02-05',
      lastPaymentAmount: 308275,
      totalPaymentsReceived: 25
    },
    followUpHistory: {
      lastContactDate: '2024-02-01',
      nextFollowUpDate: '',
      contactAttempts: 1,
      preferredContactMethod: 'Email',
      notes: 'Excellent payment track record. No follow-up required.',
      assignedTo: 'Amit Kumar'
    },
    reminders: {
      autoRemindersEnabled: true,
      reminderFrequency: 'Weekly',
      escalationLevel: 'Level 1'
    },
    riskAssessment: {
      riskScore: 15,
      riskFactors: [],
      creditWorthiness: 'High',
      recommendedAction: 'Continue current credit terms'
    },
    createdDate: '2023-06-15',
    lastModified: '2024-02-05'
  },
  {
    id: '2',
    customerCode: 'CUST002',
    customerName: 'Global Exports Ltd',
    customerEmail: 'priya@globalexports.com',
    customerPhone: '+91-9123456789',
    customerGSTIN: '19FGHIJ5678K2L3',
    customerRating: 'Good',
    paymentTerms: '45 days net',
    creditLimit: 1000000,
    totalOutstanding: 127440,
    overdueAmount: 0,
    currentAmount: 127440,
    agingBuckets: {
      current: 127440,
      bucket1: 0,
      bucket2: 0,
      bucket3: 0,
      bucket4: 0
    },
    invoices: [
      {
        invoiceNumber: 'INV/2024/002',
        invoiceDate: '2024-01-31',
        dueDate: '2024-03-15',
        amount: 254880,
        balanceAmount: 127440,
        daysOverdue: 0,
        status: 'Current'
      }
    ],
    paymentHistory: {
      averagePaymentDays: 42,
      onTimePaymentPercent: 88,
      lastPaymentDate: '2024-02-08',
      lastPaymentAmount: 127440,
      totalPaymentsReceived: 18
    },
    followUpHistory: {
      lastContactDate: '2024-02-06',
      nextFollowUpDate: '2024-03-10',
      contactAttempts: 1,
      preferredContactMethod: 'Email',
      notes: 'Balance payment due on project completion',
      assignedTo: 'Priya Sharma'
    },
    reminders: {
      autoRemindersEnabled: true,
      reminderFrequency: 'Bi-weekly',
      escalationLevel: 'Level 1'
    },
    riskAssessment: {
      riskScore: 25,
      riskFactors: ['Project-based payment'],
      creditWorthiness: 'High',
      recommendedAction: 'Monitor payment on due date'
    },
    createdDate: '2023-04-10',
    lastModified: '2024-02-08'
  },
  {
    id: '3',
    customerCode: 'CUST003',
    customerName: 'Retail Chain Pvt Ltd',
    customerEmail: 'amit@retailchain.com',
    customerPhone: '+91-9898765432',
    customerGSTIN: '24KLMNO9012P3Q4',
    customerRating: 'Poor',
    paymentTerms: '15 days net',
    creditLimit: 2000000,
    totalOutstanding: 250750,
    overdueAmount: 250750,
    currentAmount: 0,
    agingBuckets: {
      current: 0,
      bucket1: 0,
      bucket2: 250750,
      bucket3: 0,
      bucket4: 0
    },
    invoices: [
      {
        invoiceNumber: 'INV/2024/003',
        invoiceDate: '2024-02-01',
        dueDate: '2024-02-16',
        amount: 250750,
        balanceAmount: 250750,
        daysOverdue: 15,
        status: 'Critical'
      }
    ],
    paymentHistory: {
      averagePaymentDays: 65,
      onTimePaymentPercent: 45,
      lastPaymentDate: '2023-12-15',
      lastPaymentAmount: 180000,
      totalPaymentsReceived: 8
    },
    followUpHistory: {
      lastContactDate: '2024-02-25',
      nextFollowUpDate: '2024-03-01',
      contactAttempts: 5,
      preferredContactMethod: 'Phone',
      notes: 'Customer cited cash flow issues. Promised payment by month end.',
      assignedTo: 'Suresh Patel'
    },
    reminders: {
      autoRemindersEnabled: true,
      lastReminderSent: '2024-02-28',
      reminderFrequency: 'Daily',
      escalationLevel: 'Level 3'
    },
    riskAssessment: {
      riskScore: 75,
      riskFactors: ['Poor payment history', 'Frequent delays', 'Cash flow issues'],
      creditWorthiness: 'Low',
      recommendedAction: 'Consider credit hold and legal action'
    },
    createdDate: '2023-01-20',
    lastModified: '2024-02-28'
  }
];

export default function ReceivablesAging() {
  const [receivables] = useState<ReceivableRecord[]>(mockReceivables);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedReceivable, setSelectedReceivable] = useState<ReceivableRecord | null>(null);
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  const filteredReceivables = receivables.filter(receivable => {
    const matchesSearch = receivable.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receivable.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || receivable.customerRating.toLowerCase().replace(/ /g, '') === filterRating;
    const matchesRisk = filterRisk === 'all' || receivable.riskAssessment.creditWorthiness.toLowerCase() === filterRisk;
    return matchesSearch && matchesRating && matchesRisk;
  });

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'Good':
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'Average':
        return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
      case 'Poor':
        return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      case 'High Risk':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      default:
        return <Badge variant="outline">{rating}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getEscalationBadge = (level: string) => {
    switch (level) {
      case 'Level 1':
        return <Badge className="bg-gray-100 text-gray-800">Level 1</Badge>;
      case 'Level 2':
        return <Badge className="bg-yellow-100 text-yellow-800">Level 2</Badge>;
      case 'Level 3':
        return <Badge className="bg-orange-100 text-orange-800">Level 3</Badge>;
      case 'Legal':
        return <Badge className="bg-red-100 text-red-800">Legal</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'Current':
        return <Badge className="bg-green-100 text-green-800">Current</Badge>;
      case 'Overdue':
        return <Badge className="bg-yellow-100 text-yellow-800">Overdue</Badge>;
      case 'Critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateAgingSummary = () => {
    const summary = {
      total: 0,
      current: 0,
      bucket1: 0,
      bucket2: 0,
      bucket3: 0,
      bucket4: 0
    };

    receivables.forEach(receivable => {
      summary.total += receivable.totalOutstanding;
      summary.current += receivable.agingBuckets.current;
      summary.bucket1 += receivable.agingBuckets.bucket1;
      summary.bucket2 += receivable.agingBuckets.bucket2;
      summary.bucket3 += receivable.agingBuckets.bucket3;
      summary.bucket4 += receivable.agingBuckets.bucket4;
    });

    return summary;
  };

  const agingSummary = calculateAgingSummary();

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 to-white min-h-screen">
      <Helmet>
        <title>Receivables Aging - JusFinn</title>
        <meta name="description" content="Analyze accounts receivable aging with automated follow-up tracking and customer payment behavior." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Receivables Aging
          </h1>
          <p className="text-gray-600">Monitor outstanding receivables with automated follow-up and risk assessment</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isAddingFollowUp} onOpenChange={setIsAddingFollowUp}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Follow-up
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Follow-up Activity</DialogTitle>
                <DialogDescription>
                  Record follow-up activities and schedule next contact
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">Follow-up activity form would be implemented here...</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingFollowUp(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingFollowUp(false)}>
                  Save Follow-up
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
                placeholder="Search customers by name or customer code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="highrisk">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aging Summary */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Total Outstanding</p>
              <p className="text-xl font-bold text-blue-900">₹{agingSummary.total.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Current (0-30)</p>
              <p className="text-xl font-bold text-green-900">₹{agingSummary.current.toLocaleString()}</p>
              <p className="text-xs text-green-600">
                {agingSummary.total > 0 ? ((agingSummary.current / agingSummary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-yellow-600 font-medium">31-60 Days</p>
              <p className="text-xl font-bold text-yellow-900">₹{agingSummary.bucket1.toLocaleString()}</p>
              <p className="text-xs text-yellow-600">
                {agingSummary.total > 0 ? ((agingSummary.bucket1 / agingSummary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium">61-90 Days</p>
              <p className="text-xl font-bold text-orange-900">₹{agingSummary.bucket2.toLocaleString()}</p>
              <p className="text-xs text-orange-600">
                {agingSummary.total > 0 ? ((agingSummary.bucket2 / agingSummary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium">91-120 Days</p>
              <p className="text-xl font-bold text-red-900">₹{agingSummary.bucket3.toLocaleString()}</p>
              <p className="text-xs text-red-600">
                {agingSummary.total > 0 ? ((agingSummary.bucket3 / agingSummary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium">120+ Days</p>
              <p className="text-xl font-bold text-red-900">₹{agingSummary.bucket4.toLocaleString()}</p>
              <p className="text-xs text-red-600">
                {agingSummary.total > 0 ? ((agingSummary.bucket4 / agingSummary.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receivables List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Receivables Aging Analysis
          </CardTitle>
          <CardDescription>
            Track outstanding receivables with aging analysis and automated follow-up management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Outstanding Amount</TableHead>
                  <TableHead>Aging Breakdown</TableHead>
                  <TableHead>Payment Behavior</TableHead>
                  <TableHead>Follow-up Status</TableHead>
                  <TableHead>Risk Assessment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.map((receivable) => (
                  <TableRow key={receivable.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{receivable.customerName}</div>
                        <div className="text-sm text-gray-500">{receivable.customerCode}</div>
                        <div className="text-sm font-mono text-gray-500">{receivable.customerGSTIN}</div>
                        {getRatingBadge(receivable.customerRating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">₹{receivable.totalOutstanding.toLocaleString()}</div>
                        {receivable.overdueAmount > 0 && (
                          <div className="text-sm text-red-600">
                            Overdue: ₹{receivable.overdueAmount.toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Credit: ₹{receivable.creditLimit.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <Progress 
                            value={(receivable.totalOutstanding / receivable.creditLimit) * 100} 
                            className="h-1"
                          />
                          <span className="text-xs text-gray-500">
                            {((receivable.totalOutstanding / receivable.creditLimit) * 100).toFixed(1)}% utilized
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {receivable.agingBuckets.current > 0 && (
                          <div className="text-sm text-green-600">
                            Current: ₹{receivable.agingBuckets.current.toLocaleString()}
                          </div>
                        )}
                        {receivable.agingBuckets.bucket1 > 0 && (
                          <div className="text-sm text-yellow-600">
                            31-60: ₹{receivable.agingBuckets.bucket1.toLocaleString()}
                          </div>
                        )}
                        {receivable.agingBuckets.bucket2 > 0 && (
                          <div className="text-sm text-orange-600">
                            61-90: ₹{receivable.agingBuckets.bucket2.toLocaleString()}
                          </div>
                        )}
                        {receivable.agingBuckets.bucket3 > 0 && (
                          <div className="text-sm text-red-600">
                            91-120: ₹{receivable.agingBuckets.bucket3.toLocaleString()}
                          </div>
                        )}
                        {receivable.agingBuckets.bucket4 > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            120+: ₹{receivable.agingBuckets.bucket4.toLocaleString()}
                          </div>
                        )}
                        {receivable.totalOutstanding === 0 && (
                          <div className="text-sm text-gray-500">No outstanding amount</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Avg Days: {receivable.paymentHistory.averagePaymentDays}
                        </div>
                        <div className="text-sm">
                          On-time: {receivable.paymentHistory.onTimePaymentPercent}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Last Payment: {receivable.paymentHistory.lastPaymentDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          Amount: ₹{receivable.paymentHistory.lastPaymentAmount.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {receivable.followUpHistory.nextFollowUpDate ? (
                          <>
                            <div className="text-sm">
                              Next: {receivable.followUpHistory.nextFollowUpDate}
                            </div>
                            <div className="text-sm text-gray-500">
                              Attempts: {receivable.followUpHistory.contactAttempts}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">No follow-up scheduled</div>
                        )}
                        <div className="text-sm text-gray-500">
                          Assigned: {receivable.followUpHistory.assignedTo}
                        </div>
                        {getEscalationBadge(receivable.reminders.escalationLevel)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Score: {receivable.riskAssessment.riskScore}/100
                        </div>
                        {getRiskBadge(receivable.riskAssessment.creditWorthiness)}
                        {receivable.riskAssessment.riskFactors.length > 0 && (
                          <div className="text-xs text-red-600">
                            {receivable.riskAssessment.riskFactors.length} risk factor(s)
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
                              onClick={() => setSelectedReceivable(receivable)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[900px] sm:max-w-none">
                            <SheetHeader>
                              <SheetTitle>{receivable.customerName}</SheetTitle>
                              <SheetDescription>
                                Complete receivables analysis with aging details and follow-up history
                              </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                              <Tabs defaultValue="aging" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="aging">Aging</TabsTrigger>
                                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                                  <TabsTrigger value="payment">Payment History</TabsTrigger>
                                  <TabsTrigger value="followup">Follow-up</TabsTrigger>
                                  <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="aging" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Customer Overview</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Customer Name</Label>
                                          <Input value={receivable.customerName} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Code</Label>
                                          <Input value={receivable.customerCode} readOnly />
                                        </div>
                                        <div>
                                          <Label>GSTIN</Label>
                                          <Input value={receivable.customerGSTIN} readOnly />
                                        </div>
                                        <div>
                                          <Label>Payment Terms</Label>
                                          <Input value={receivable.paymentTerms} readOnly />
                                        </div>
                                        <div>
                                          <Label>Customer Rating</Label>
                                          <div className="mt-2">
                                            {getRatingBadge(receivable.customerRating)}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Outstanding Summary</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Total Outstanding</Label>
                                          <Input value={`₹${receivable.totalOutstanding.toLocaleString()}`} readOnly className="font-semibold" />
                                        </div>
                                        <div>
                                          <Label>Overdue Amount</Label>
                                          <Input 
                                            value={`₹${receivable.overdueAmount.toLocaleString()}`} 
                                            readOnly 
                                            className={receivable.overdueAmount > 0 ? 'text-red-600' : ''}
                                          />
                                        </div>
                                        <div>
                                          <Label>Credit Limit</Label>
                                          <Input value={`₹${receivable.creditLimit.toLocaleString()}`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Credit Utilization</Label>
                                          <div className="mt-2">
                                            <Progress 
                                              value={(receivable.totalOutstanding / receivable.creditLimit) * 100} 
                                              className="h-3"
                                            />
                                            <div className="text-sm text-gray-500 mt-1">
                                              {((receivable.totalOutstanding / receivable.creditLimit) * 100).toFixed(1)}% utilized
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Aging Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                          <p className="text-sm text-green-600 font-medium">Current (0-30)</p>
                                          <p className="text-xl font-bold text-green-800">
                                            ₹{receivable.agingBuckets.current.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                          <p className="text-sm text-yellow-600 font-medium">31-60 Days</p>
                                          <p className="text-xl font-bold text-yellow-800">
                                            ₹{receivable.agingBuckets.bucket1.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                          <p className="text-sm text-orange-600 font-medium">61-90 Days</p>
                                          <p className="text-xl font-bold text-orange-800">
                                            ₹{receivable.agingBuckets.bucket2.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                          <p className="text-sm text-red-600 font-medium">91-120 Days</p>
                                          <p className="text-xl font-bold text-red-800">
                                            ₹{receivable.agingBuckets.bucket3.toLocaleString()}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                          <p className="text-sm text-red-600 font-medium">120+ Days</p>
                                          <p className="text-xl font-bold text-red-800">
                                            ₹{receivable.agingBuckets.bucket4.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="invoices" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Outstanding Invoices</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {receivable.invoices.length > 0 ? (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Invoice Number</TableHead>
                                              <TableHead>Invoice Date</TableHead>
                                              <TableHead>Due Date</TableHead>
                                              <TableHead>Amount</TableHead>
                                              <TableHead>Balance</TableHead>
                                              <TableHead>Days Overdue</TableHead>
                                              <TableHead>Status</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {receivable.invoices.map((invoice, index) => (
                                              <TableRow key={index}>
                                                <TableCell className="font-medium text-blue-600">
                                                  {invoice.invoiceNumber}
                                                </TableCell>
                                                <TableCell>{invoice.invoiceDate}</TableCell>
                                                <TableCell>{invoice.dueDate}</TableCell>
                                                <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                                                <TableCell>₹{invoice.balanceAmount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                  {invoice.daysOverdue > 0 ? (
                                                    <span className="text-red-600">{invoice.daysOverdue} days</span>
                                                  ) : (
                                                    <span className="text-green-600">Current</span>
                                                  )}
                                                </TableCell>
                                                <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <div className="text-center p-8">
                                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                          <p className="text-gray-500">No outstanding invoices</p>
                                          <p className="text-sm text-gray-400 mt-2">
                                            All invoices have been paid
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="payment" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Payment Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <Label>Average Payment Days</Label>
                                          <Input value={receivable.paymentHistory.averagePaymentDays} readOnly />
                                        </div>
                                        <div>
                                          <Label>On-time Payment %</Label>
                                          <Input value={`${receivable.paymentHistory.onTimePaymentPercent}%`} readOnly />
                                        </div>
                                        <div>
                                          <Label>Total Payments</Label>
                                          <Input value={receivable.paymentHistory.totalPaymentsReceived} readOnly />
                                        </div>
                                        <div>
                                          <Label>Last Payment Amount</Label>
                                          <Input value={`₹${receivable.paymentHistory.lastPaymentAmount.toLocaleString()}`} readOnly />
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Last Payment Date</Label>
                                        <Input value={receivable.paymentHistory.lastPaymentDate} readOnly />
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                          <p className="text-sm text-green-600">Payment Reliability</p>
                                          <p className="text-lg font-bold text-green-800">
                                            {receivable.paymentHistory.onTimePaymentPercent > 80 ? 'Excellent' :
                                             receivable.paymentHistory.onTimePaymentPercent > 60 ? 'Good' :
                                             receivable.paymentHistory.onTimePaymentPercent > 40 ? 'Average' : 'Poor'}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                          <p className="text-sm text-blue-600">Payment Speed</p>
                                          <p className="text-lg font-bold text-blue-800">
                                            {receivable.paymentHistory.averagePaymentDays <= 30 ? 'Fast' :
                                             receivable.paymentHistory.averagePaymentDays <= 45 ? 'Normal' :
                                             receivable.paymentHistory.averagePaymentDays <= 60 ? 'Slow' : 'Very Slow'}
                                          </p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                          <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                          <p className="text-sm text-purple-600">Payment Frequency</p>
                                          <p className="text-lg font-bold text-purple-800">
                                            {receivable.paymentHistory.totalPaymentsReceived > 20 ? 'High' :
                                             receivable.paymentHistory.totalPaymentsReceived > 10 ? 'Medium' : 'Low'}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="followup" className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Follow-up Status</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Assigned To</Label>
                                          <Input value={receivable.followUpHistory.assignedTo} readOnly />
                                        </div>
                                        <div>
                                          <Label>Last Contact Date</Label>
                                          <Input value={receivable.followUpHistory.lastContactDate || 'No contact yet'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Next Follow-up Date</Label>
                                          <Input value={receivable.followUpHistory.nextFollowUpDate || 'Not scheduled'} readOnly />
                                        </div>
                                        <div>
                                          <Label>Contact Attempts</Label>
                                          <Input value={receivable.followUpHistory.contactAttempts} readOnly />
                                        </div>
                                        <div>
                                          <Label>Preferred Contact Method</Label>
                                          <Input value={receivable.followUpHistory.preferredContactMethod} readOnly />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Reminder Settings</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <Label>Auto Reminders</Label>
                                          <div className="mt-2">
                                            <Badge className={receivable.reminders.autoRemindersEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                              {receivable.reminders.autoRemindersEnabled ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Reminder Frequency</Label>
                                          <Input value={receivable.reminders.reminderFrequency} readOnly />
                                        </div>
                                        <div>
                                          <Label>Escalation Level</Label>
                                          <div className="mt-2">
                                            {getEscalationBadge(receivable.reminders.escalationLevel)}
                                          </div>
                                        </div>
                                        {receivable.reminders.lastReminderSent && (
                                          <div>
                                            <Label>Last Reminder Sent</Label>
                                            <Input value={receivable.reminders.lastReminderSent} readOnly />
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Follow-up Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Textarea 
                                        value={receivable.followUpHistory.notes} 
                                        readOnly 
                                        rows={4}
                                      />
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="risk" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Risk Assessment</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <Label>Risk Score</Label>
                                          <div className="mt-2">
                                            <Progress value={receivable.riskAssessment.riskScore} className="h-3" />
                                            <div className="text-sm text-gray-500 mt-1">
                                              {receivable.riskAssessment.riskScore}/100
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Credit Worthiness</Label>
                                          <div className="mt-2">
                                            {getRiskBadge(receivable.riskAssessment.creditWorthiness)}
                                          </div>
                                        </div>
                                        <div>
                                          <Label>Risk Factors</Label>
                                          <div className="mt-2">
                                            <Badge className="bg-red-100 text-red-800">
                                              {receivable.riskAssessment.riskFactors.length} Factor(s)
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <Separator />
                                      
                                      <div>
                                        <Label>Risk Factors</Label>
                                        <div className="mt-2 space-y-2">
                                          {receivable.riskAssessment.riskFactors.length > 0 ? (
                                            receivable.riskAssessment.riskFactors.map((factor, index) => (
                                              <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm text-red-700">{factor}</span>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                                              <CheckCircle className="h-4 w-4 text-green-600" />
                                              <span className="text-sm text-green-700">No risk factors identified</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <Label>Recommended Action</Label>
                                        <Textarea 
                                          value={receivable.riskAssessment.recommendedAction} 
                                          readOnly 
                                          rows={3}
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
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