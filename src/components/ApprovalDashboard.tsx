import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Filter,
  Search,
  Eye,
  MoreHorizontal,
  Download,
  RefreshCw,
  Bell,
  Timer,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PurchaseOrderApproval, type PendingApproval, type ApprovalWorkflow } from './PurchaseOrderApproval';
import { approvalApiService } from '@/lib/approvalApi';

interface ApprovalDashboardStats {
  totalPending: number;
  overdueApprovals: number;
  approvedToday: number;
  avgApprovalTime: number;
  pendingValue: number;
  approvedValue: number;
  rejectionRate: number;
  escalationRate: number;
}

interface ApprovalFilter {
  status: string;
  priority: string;
  amountRange: string;
  department: string;
  assignedTo: string;
  dateRange: string;
}

interface ApprovalDashboardProps {
  currentUserId?: string;
  userRole?: string;
}

export const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({
  currentUserId = 'current-user',
  userRole = 'manager'
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data
  const [stats, setStats] = useState<ApprovalDashboardStats>({
    totalPending: 12,
    overdueApprovals: 3,
    approvedToday: 8,
    avgApprovalTime: 2.5,
    pendingValue: 2500000,
    approvedValue: 1800000,
    rejectionRate: 5.2,
    escalationRate: 2.1
  });

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      poId: 'po-001',
      poNumber: 'PO/2024/01/0001',
      vendorName: 'Tech Solutions Pvt Ltd',
      totalAmount: 125000,
      submittedAt: '2024-01-15T10:30:00Z',
      daysPending: 3,
      isOverdue: false,
      currentLevel: 2,
      nextApprover: 'Michael Chen'
    },
    {
      poId: 'po-002',
      poNumber: 'PO/2024/01/0002',
      vendorName: 'Office Supplies Co',
      totalAmount: 45000,
      submittedAt: '2024-01-10T14:20:00Z',
      daysPending: 8,
      isOverdue: true,
      currentLevel: 1,
      nextApprover: 'Sarah Johnson'
    },
    {
      poId: 'po-003',
      poNumber: 'PO/2024/01/0003',
      vendorName: 'Industrial Equipment Ltd',
      totalAmount: 350000,
      submittedAt: '2024-01-16T09:15:00Z',
      daysPending: 2,
      isOverdue: false,
      currentLevel: 3,
      nextApprover: 'David Wilson'
    }
  ]);

  const [recentApprovals, setRecentApprovals] = useState([
    {
      id: 'approval-1',
      poNumber: 'PO/2024/01/0004',
      vendorName: 'Software Systems Inc',
      amount: 75000,
      action: 'approved',
      approver: 'John Smith',
      actionDate: '2024-01-18T15:30:00Z',
      level: 2
    },
    {
      id: 'approval-2',
      poNumber: 'PO/2024/01/0005',
      vendorName: 'Marketing Agency Co',
      amount: 30000,
      action: 'rejected',
      approver: 'Lisa Brown',
      actionDate: '2024-01-18T11:45:00Z',
      level: 1,
      comments: 'Budget not approved for this quarter'
    }
  ]);

  const [filters, setFilters] = useState<ApprovalFilter>({
    status: 'all',
    priority: 'all',
    amountRange: 'all',
    department: 'all',
    assignedTo: 'all',
    dateRange: 'all'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysPending = (submittedAt: string) => {
    const submitted = new Date(submittedAt);
    const now = new Date();
    return Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (daysPending: number, isOverdue: boolean) => {
    if (isOverdue) return 'bg-red-100 text-red-800';
    if (daysPending >= 5) return 'bg-orange-100 text-orange-800';
    if (daysPending >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'changes_requested': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Data Refreshed",
        description: "Approval dashboard has been updated with latest data",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'escalate', selectedIds: string[]) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Bulk Action Completed",
        description: `${selectedIds.length} purchase orders ${action}d successfully`,
      });

      // Update local state
      if (action === 'approve') {
        setPendingApprovals(prev => prev.filter(pa => !selectedIds.includes(pa.poId)));
        setStats(prev => ({
          ...prev,
          totalPending: prev.totalPending - selectedIds.length,
          approvedToday: prev.approvedToday + selectedIds.length
        }));
      }
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Some actions may not have been completed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvData = pendingApprovals.map(pa => ({
      'PO Number': pa.poNumber,
      'Vendor': pa.vendorName,
      'Amount': pa.totalAmount,
      'Days Pending': pa.daysPending,
      'Current Level': pa.currentLevel,
      'Next Approver': pa.nextApprover,
      'Overdue': pa.isOverdue ? 'Yes' : 'No'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-approvals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Export Completed",
      description: "Pending approvals data has been exported to CSV",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track purchase order approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{stats.totalPending}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.overdueApprovals} overdue
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">{stats.approvedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                +15% from yesterday
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Value</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingValue)}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {((stats.pendingValue / (stats.pendingValue + stats.approvedValue)) * 100).toFixed(1)}% of total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Approval Time</p>
                <p className="text-2xl font-bold">{stats.avgApprovalTime}d</p>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                -0.5d improvement
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by PO number, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.amountRange} onValueChange={(value) => setFilters(prev => ({ ...prev, amountRange: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Amount Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="0-50000">₹0 - ₹50K</SelectItem>
                <SelectItem value="50000-200000">₹50K - ₹2L</SelectItem>
                <SelectItem value="200000-500000">₹2L - ₹5L</SelectItem>
                <SelectItem value="500000+">₹5L+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.assignedTo} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvers</SelectItem>
                <SelectItem value="me">Assigned to Me</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="michael">Michael Chen</SelectItem>
                <SelectItem value="david">David Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({stats.totalPending})
          </TabsTrigger>
          <TabsTrigger value="recent">
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>
                    Purchase orders waiting for your approval
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-1" />
                    Bulk Assign
                  </Button>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Bulk Approve
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Days Pending</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Next Approver</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.poId}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {approval.poNumber}
                      </TableCell>
                      <TableCell>{approval.vendorName}</TableCell>
                      <TableCell>{formatCurrency(approval.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{approval.daysPending} days</span>
                          {approval.isOverdue && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Level {approval.currentLevel}</Badge>
                      </TableCell>
                      <TableCell>{approval.nextApprover}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(approval.daysPending, approval.isOverdue)}>
                          {approval.isOverdue ? 'Overdue' : 
                           approval.daysPending >= 5 ? 'High' : 
                           approval.daysPending >= 3 ? 'Medium' : 'Low'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedApproval(approval);
                              setShowApprovalDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Activity</CardTitle>
              <CardDescription>
                Latest approval actions taken across all purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        approval.action === 'approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {approval.action === 'approved' ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> :
                          <XCircle className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <div className="font-medium">{approval.poNumber}</div>
                        <div className="text-sm text-gray-600">
                          {approval.vendorName} • {formatCurrency(approval.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {approval.action === 'approved' ? 'Approved' : 'Rejected'} by {approval.approver} • Level {approval.level}
                        </div>
                        {approval.comments && (
                          <div className="text-sm text-gray-500 mt-1 italic">
                            "{approval.comments}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getActionColor(approval.action)}>
                        {approval.action}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(approval.actionDate)}
                      </div>
                    </div>
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
                <CardTitle>Approval Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Approval Time</span>
                    <span className="font-bold">{stats.avgApprovalTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rejection Rate</span>
                    <span className="font-bold">{stats.rejectionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Escalation Rate</span>
                    <span className="font-bold">{stats.escalationRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On-time Approval Rate</span>
                    <span className="font-bold">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Volume</CardTitle>
                <CardDescription>This month vs last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-bold">156 approvals</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month</span>
                    <span className="font-bold">142 approvals</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Growth</span>
                    <span className="font-bold">+9.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Settings</CardTitle>
              <CardDescription>
                Configure approval rules and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Approval Rules
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Approvers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Details Dialog */}
      <Dialog open={showApprovalDetails} onOpenChange={setShowApprovalDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Approval Details</DialogTitle>
            <DialogDescription>
              {selectedApproval?.poNumber} - {selectedApproval?.vendorName}
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <PurchaseOrderApproval
              poId={selectedApproval.poId}
              mode="manage"
              currentUserId={currentUserId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalDashboard;