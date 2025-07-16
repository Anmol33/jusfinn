import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, 
  Plus, 
  TrendingUp,
  Receipt,
  Calendar,
  Building2,
  User,
  FileText,
  Upload,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  HandCoins,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  PieChart,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  expense_number: string;
  date: string;
  vendor_id?: string;
  vendor_name: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  gst_amount: number;
  tds_section?: string;
  tds_rate: number;
  tds_amount: number;
  net_amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'cheque' | 'upi';
  payment_status: 'pending' | 'paid' | 'approved' | 'rejected';
  receipt_attached: boolean;
  receipt_url?: string;
  is_reimbursable: boolean;
  employee_id?: string;
  employee_name?: string;
  project_id?: string;
  project_name?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_date?: string;
  remarks?: string;
  created_by: string;
  created_date: string;
  last_modified: string;
}

const ExpenseManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("expenses");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_expenses: 0,
    this_month: 0,
    pending_approval: 0,
    total_amount: 0
  });

  // Expense Categories (Indian business context)
  const expenseCategories = [
    { value: "office_expenses", label: "Office Expenses" },
    { value: "travel", label: "Travel & Conveyance" },
    { value: "communication", label: "Communication & Internet" },
    { value: "utilities", label: "Utilities" },
    { value: "rent", label: "Rent & Property" },
    { value: "professional_fees", label: "Professional Fees" },
    { value: "legal_compliance", label: "Legal & Compliance" },
    { value: "software_licenses", label: "Software & Licenses" },
    { value: "marketing", label: "Marketing & Advertising" },
    { value: "entertainment", label: "Business Entertainment" },
    { value: "training", label: "Training & Development" },
    { value: "insurance", label: "Insurance" },
    { value: "repairs_maintenance", label: "Repairs & Maintenance" },
    { value: "fuel", label: "Fuel & Vehicle" },
    { value: "stationery", label: "Stationery & Supplies" },
    { value: "other", label: "Other Expenses" }
  ];

  // TDS Sections for expenses
  const tdsSections = [
    { value: "194A", label: "194A - Interest other than on Securities", rate: 10 },
    { value: "194C", label: "194C - Payments to Contractors", rate: 1 },
    { value: "194H", label: "194H - Commission or Brokerage", rate: 5 },
    { value: "194I", label: "194I - Rent", rate: 10 },
    { value: "194J", label: "194J - Professional/Technical Services", rate: 10 },
    { value: "194O", label: "194O - E-commerce Transactions", rate: 1 }
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadExpenses();
    loadStats();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    // Mock data
    const mockExpenses: Expense[] = [
      {
        id: "1",
        expense_number: "EXP/2024/001",
        date: "2024-02-15",
        vendor_id: "1",
        vendor_name: "City Office Supplies",
        category: "office_expenses",
        subcategory: "Stationery",
        description: "Office stationery and supplies",
        amount: 5000,
        gst_amount: 900,
        tds_section: "194C",
        tds_rate: 1,
        tds_amount: 50,
        net_amount: 4850,
        payment_method: "bank_transfer",
        payment_status: "paid",
        receipt_attached: true,
        receipt_url: "/receipts/exp-001.pdf",
        is_reimbursable: false,
        approval_status: "approved",
        approved_by: "Manager",
        approved_date: "2024-02-16",
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-02-16"
      },
      {
        id: "2",
        expense_number: "EXP/2024/002",
        date: "2024-02-20",
        vendor_name: "Uber India",
        category: "travel",
        subcategory: "Local Travel",
        description: "Client meeting travel",
        amount: 450,
        gst_amount: 81,
        tds_rate: 0,
        tds_amount: 0,
        net_amount: 450,
        payment_method: "credit_card",
        payment_status: "paid",
        receipt_attached: true,
        is_reimbursable: true,
        employee_id: "EMP001",
        employee_name: "John Doe",
        approval_status: "pending",
        created_by: "John Doe",
        created_date: "2024-02-20",
        last_modified: "2024-02-20"
      }
    ];
    setExpenses(mockExpenses);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total_expenses: 156,
      this_month: 28,
      pending_approval: 12,
      total_amount: 245000
    });
  };

  const handleCreateExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    toast({
      title: "✅ Success",
      description: "Expense deleted successfully.",
    });
  };

  const handleApproveExpense = (expenseId: string) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId 
        ? { 
            ...exp, 
            approval_status: "approved" as const, 
            approved_by: "Current User", 
            approved_date: new Date().toISOString().split('T')[0] 
          }
        : exp
    ));
    toast({
      title: "✅ Success",
      description: "Expense approved successfully.",
    });
  };

  const handleRejectExpense = (expenseId: string) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === expenseId 
        ? { ...exp, approval_status: "rejected" as const }
        : exp
    ));
    toast({
      title: "❌ Rejected",
      description: "Expense rejected.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = expenseCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.expense_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || expense.approval_status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Expense Management - JusFinn AI</title>
        <meta name="description" content="Manage business expenses with TDS compliance, receipt tracking, and approval workflows." />
        <meta name="keywords" content="expense management, business expenses, TDS compliance, receipt tracking, expense approval, expense categories" />
        <meta property="og:title" content="Expense Management - JusFinn AI" />
        <meta property="og:description" content="Comprehensive expense management with Indian tax compliance features." />
        <link rel="canonical" href="https://your-domain.com/expense-management" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-2">
            Track business expenses with TDS compliance and approval workflows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateExpense}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_expenses}</div>
            <p className="text-xs text-muted-foreground">
              All recorded expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.this_month}</div>
            <p className="text-xs text-muted-foreground">
              New expenses added
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_approval}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.total_amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total expense value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="expenses">All Expenses</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses by number, vendor, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>
                Track all business expenses with compliance details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{expense.expense_number}</h3>
                            <Badge className={getStatusColor(expense.approval_status)}>
                              {expense.approval_status.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(expense.payment_status)}>
                              {expense.payment_status.toUpperCase()}
                            </Badge>
                            {expense.is_reimbursable && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Reimbursable
                              </Badge>
                            )}
                            {expense.receipt_attached && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                📎 Receipt
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{expense.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{getCategoryLabel(expense.category)}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>Amount: ₹{expense.amount.toLocaleString()}</span>
                              </div>
                              {expense.tds_amount > 0 && (
                                <div className="flex items-center gap-2">
                                  <HandCoins className="w-4 h-4" />
                                  <span>TDS: ₹{expense.tds_amount} ({expense.tds_section})</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span>Net: ₹{expense.net_amount.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm">
                                <strong>Payment:</strong> {expense.payment_method.replace('_', ' ')}
                              </div>
                              {expense.employee_name && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>By: {expense.employee_name}</span>
                                </div>
                              )}
                              <div className="text-sm">
                                <strong>Description:</strong> {expense.description}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* View expense */}}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {expense.approval_status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveExpense(expense.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectExpense(expense.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Review and approve expense claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.filter(exp => exp.approval_status === 'pending').map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{expense.expense_number}</h3>
                        <p className="text-sm text-gray-600">{expense.vendor_name}</p>
                        <p className="text-sm font-medium">₹{expense.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{expense.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveExpense(expense.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectExpense(expense.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {expenses.filter(exp => exp.approval_status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No expenses pending approval</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Expense Categories
              </CardTitle>
              <CardDescription>
                Manage expense categories and subcategories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenseCategories.map((category) => (
                  <div key={category.value} className="border rounded-lg p-4">
                    <h3 className="font-medium">{category.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {expenses.filter(exp => exp.category === category.value).length} expenses
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Expense Trends
                </CardTitle>
                <CardDescription>
                  Track spending patterns and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandCoins className="w-5 h-5" />
                  TDS Summary
                </CardTitle>
                <CardDescription>
                  Monitor TDS deductions and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HandCoins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">TDS analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Expense Management Settings
              </CardTitle>
              <CardDescription>
                Configure expense policies and approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Approval limits, category rules, TDS defaults, receipt requirements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expense Form Dialog - Placeholder */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Expense form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include vendor selection, category assignment, TDS calculation, receipt upload
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowExpenseForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingExpense ? 'Update Expense' : 'Create Expense'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseManagement; 