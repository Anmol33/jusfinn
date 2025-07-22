import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Building2, CreditCard, ArrowUpDown, TrendingUp, DollarSign, Clock,
  FileText, CheckCircle, AlertCircle, Plus, Search, Filter, Download,
  Eye, Edit, Trash2, Upload, RefreshCw, Calendar, Calculator
} from 'lucide-react';

// Types
interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: string;
  currency: string;
  current_balance: number;
  overdraft_limit: number;
  is_active: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: string;
  payment_number: string;
  payment_type: string;
  payment_date: string;
  payment_method: string;
  gross_amount: number;
  tds_amount: number;
  net_amount: number;
  payment_status: string;
  approval_status: string;
  created_at: string;
}

interface BankTransaction {
  id: string;
  transaction_date: string;
  description: string;
  reference_number: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  transaction_type: string;
  reconciliation_status: string;
  created_at: string;
}

interface DashboardSummary {
  total_bank_balance: number;
  pending_approvals: {
    count: number;
    amount: number;
  };
  current_month_payments: {
    count: number;
    amount: number;
  };
  unreconciled_transactions: number;
}

const BankManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showReconciliationDialog, setShowReconciliationDialog] = useState(false);
  
  // Form states
  const [accountForm, setAccountForm] = useState({
    account_name: '',
    account_number: '',
    ifsc_code: '',
    bank_name: '',
    branch_name: '',
    account_type: 'current',
    currency: 'INR',
    opening_balance: 0,
    overdraft_limit: 0,
    is_primary: false
  });

  const [paymentForm, setPaymentForm] = useState({
    payment_type: 'vendor_payment',
    reference_id: '',
    reference_type: 'purchase_bill',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'rtgs',
    bank_account_id: '',
    gross_amount: 0,
    tds_amount: 0,
    other_deductions: 0,
    notes: ''
  });

  const [reconciliationForm, setReconciliationForm] = useState({
    bank_account_id: '',
    reconciliation_date: new Date().toISOString().split('T')[0],
    statement_balance: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'accounts') {
      loadBankAccounts();
    } else if (activeTab === 'payments') {
      loadPayments();
    } else if (activeTab === 'transactions') {
      loadTransactions();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/dashboard/summary');
      if (response.ok) {
        const data = await response.json();
        setDashboardSummary(data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Load transactions for the first account if available
      if (accounts.length > 0) {
        const response = await fetch(`/api/bank/transactions?bank_account_id=${accounts[0].id}`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm)
      });

      if (response.ok) {
        setShowAccountForm(false);
        setAccountForm({
          account_name: '',
          account_number: '',
          ifsc_code: '',
          bank_name: '',
          branch_name: '',
          account_type: 'current',
          currency: 'INR',
          opening_balance: 0,
          overdraft_limit: 0,
          is_primary: false
        });
        loadBankAccounts();
      }
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/payments?created_by=current_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });

      if (response.ok) {
        setShowPaymentForm(false);
        setPaymentForm({
          payment_type: 'vendor_payment',
          reference_id: '',
          reference_type: 'purchase_bill',
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: 'rtgs',
          bank_account_id: '',
          gross_amount: 0,
          tds_amount: 0,
          other_deductions: 0,
          notes: ''
        });
        loadPayments();
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReconciliation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bank/reconciliation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: new URLSearchParams({
          bank_account_id: reconciliationForm.bank_account_id,
          reconciliation_date: reconciliationForm.reconciliation_date,
          statement_balance: reconciliationForm.statement_balance.toString(),
          reconciled_by: 'current_user'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setShowReconciliationDialog(false);
        alert(`Reconciliation started. ${result.reconciled_transactions} transactions matched automatically.`);
      }
    } catch (error) {
      console.error('Error starting reconciliation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': case 'processed': case 'reconciled':
        return 'bg-green-100 text-green-800';
      case 'pending': case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected': case 'failed': case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Management</h1>
          <p className="text-gray-600 mt-1">Manage bank accounts, payments, and reconciliation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Bank Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bank Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.total_bank_balance)}</div>
                    <p className="text-xs text-muted-foreground">Across all active accounts</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pending Approvals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardSummary.pending_approvals.count}</div>
                    <p className="text-xs text-muted-foreground">{formatCurrency(dashboardSummary.pending_approvals.amount)} total</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Current Month Payments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardSummary.current_month_payments.count}</div>
                    <p className="text-xs text-muted-foreground">{formatCurrency(dashboardSummary.current_month_payments.amount)} processed</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Unreconciled Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unreconciled</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardSummary.unreconciled_transactions}</div>
                    <p className="text-xs text-muted-foreground">Transactions need attention</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dialog open={showAccountForm} onOpenChange={setShowAccountForm}>
                  <DialogTrigger asChild>
                    <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Building2 className="w-6 h-6" />
                      <span>Add Bank Account</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Bank Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="account_name">Account Name</Label>
                          <Input
                            id="account_name"
                            value={accountForm.account_name}
                            onChange={(e) => setAccountForm({ ...accountForm, account_name: e.target.value })}
                            placeholder="Current Account"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account_number">Account Number</Label>
                          <Input
                            id="account_number"
                            value={accountForm.account_number}
                            onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                            placeholder="1234567890"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bank_name">Bank Name</Label>
                          <Input
                            id="bank_name"
                            value={accountForm.bank_name}
                            onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                            placeholder="HDFC Bank"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ifsc_code">IFSC Code</Label>
                          <Input
                            id="ifsc_code"
                            value={accountForm.ifsc_code}
                            onChange={(e) => setAccountForm({ ...accountForm, ifsc_code: e.target.value })}
                            placeholder="HDFC0000123"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="branch_name">Branch Name</Label>
                        <Input
                          id="branch_name"
                          value={accountForm.branch_name}
                          onChange={(e) => setAccountForm({ ...accountForm, branch_name: e.target.value })}
                          placeholder="Mumbai Main Branch"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="account_type">Account Type</Label>
                          <Select value={accountForm.account_type} onValueChange={(value) => setAccountForm({ ...accountForm, account_type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="current">Current</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="overdraft">Overdraft</SelectItem>
                              <SelectItem value="cash_credit">Cash Credit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="opening_balance">Opening Balance</Label>
                          <Input
                            id="opening_balance"
                            type="number"
                            value={accountForm.opening_balance}
                            onChange={(e) => setAccountForm({ ...accountForm, opening_balance: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_primary"
                          checked={accountForm.is_primary}
                          onChange={(e) => setAccountForm({ ...accountForm, is_primary: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="is_primary">Set as primary account</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowAccountForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateAccount} disabled={loading}>
                          {loading ? 'Creating...' : 'Create Account'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
                  <DialogTrigger asChild>
                    <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                      <CreditCard className="w-6 h-6" />
                      <span>Create Payment</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="payment_type">Payment Type</Label>
                          <Select value={paymentForm.payment_type} onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vendor_payment">Vendor Payment</SelectItem>
                              <SelectItem value="employee_reimbursement">Employee Reimbursement</SelectItem>
                              <SelectItem value="tax_payment">Tax Payment</SelectItem>
                              <SelectItem value="advance_payment">Advance Payment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="payment_method">Payment Method</Label>
                          <Select value={paymentForm.payment_method} onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rtgs">RTGS</SelectItem>
                              <SelectItem value="neft">NEFT</SelectItem>
                              <SelectItem value="imps">IMPS</SelectItem>
                              <SelectItem value="cheque">Cheque</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="reference_id">Reference ID</Label>
                        <Input
                          id="reference_id"
                          value={paymentForm.reference_id}
                          onChange={(e) => setPaymentForm({ ...paymentForm, reference_id: e.target.value })}
                          placeholder="PB-2024-001"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gross_amount">Gross Amount</Label>
                          <Input
                            id="gross_amount"
                            type="number"
                            value={paymentForm.gross_amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, gross_amount: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tds_amount">TDS Amount</Label>
                          <Input
                            id="tds_amount"
                            type="number"
                            value={paymentForm.tds_amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, tds_amount: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="payment_date">Payment Date</Label>
                        <Input
                          id="payment_date"
                          type="date"
                          value={paymentForm.payment_date}
                          onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePayment} disabled={loading}>
                          {loading ? 'Creating...' : 'Create Payment'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showReconciliationDialog} onOpenChange={setShowReconciliationDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                      <Calculator className="w-6 h-6" />
                      <span>Start Reconciliation</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Start Bank Reconciliation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bank_account_select">Bank Account</Label>
                        <Select value={reconciliationForm.bank_account_id} onValueChange={(value) => setReconciliationForm({ ...reconciliationForm, bank_account_id: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.account_name} - {account.account_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="reconciliation_date">Reconciliation Date</Label>
                        <Input
                          id="reconciliation_date"
                          type="date"
                          value={reconciliationForm.reconciliation_date}
                          onChange={(e) => setReconciliationForm({ ...reconciliationForm, reconciliation_date: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="statement_balance">Bank Statement Balance</Label>
                        <Input
                          id="statement_balance"
                          type="number"
                          value={reconciliationForm.statement_balance}
                          onChange={(e) => setReconciliationForm({ ...reconciliationForm, statement_balance: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowReconciliationDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleStartReconciliation} disabled={loading}>
                          {loading ? 'Starting...' : 'Start Reconciliation'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bank Accounts</h2>
            <Button onClick={() => setShowAccountForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`${account.is_primary ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{account.account_name}</CardTitle>
                      <div className="flex gap-2">
                        {account.is_primary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                        <Badge 
                          variant={account.is_active ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {account.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-mono text-sm">{account.account_number}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Bank & Branch</p>
                      <p className="text-sm">{account.bank_name}</p>
                      <p className="text-xs text-gray-500">{account.branch_name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(account.current_balance)}
                      </p>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>IFSC: {account.ifsc_code}</span>
                        <span>{account.account_type.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Payments</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setShowPaymentForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Payment
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.payment_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.payment_type.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.net_amount)}
                          </div>
                          {payment.tds_amount > 0 && (
                            <div className="text-xs text-gray-500">
                              TDS: {formatCurrency(payment.tds_amount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {payment.payment_method.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <Badge className={getStatusColor(payment.payment_status)}>
                              {payment.payment_status}
                            </Badge>
                            <Badge className={getStatusColor(payment.approval_status)}>
                              {payment.approval_status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.payment_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bank Transactions</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {transaction.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.reference_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {transaction.debit_amount > 0 ? formatCurrency(transaction.debit_amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {transaction.credit_amount > 0 ? formatCurrency(transaction.credit_amount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(transaction.reconciliation_status)}>
                            {transaction.reconciliation_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reconciliation Tab */}
        <TabsContent value="reconciliation" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bank Reconciliation</h2>
            <Button onClick={() => setShowReconciliationDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Start Reconciliation
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reconciliation Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Reconciled</span>
                  <span className="text-sm font-medium">2024-01-15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Matched Transactions</span>
                  <span className="text-sm font-medium text-green-600">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unmatched Transactions</span>
                  <span className="text-sm font-medium text-red-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difference Amount</span>
                  <span className="text-sm font-medium text-yellow-600">{formatCurrency(5000)}</span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reconciliation Progress</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Unmatched Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Unmatched Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">TXN{item}234567890</p>
                        <p className="text-xs text-gray-500">Jan 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(25000)}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Match
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reconciliations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reconciliations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matched
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unmatched
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Jan 15, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          HDFC Current Account
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          156
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          12
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                          {formatCurrency(5000)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Partial
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankManagement; 