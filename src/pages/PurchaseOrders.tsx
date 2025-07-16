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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShoppingCart, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  FileText,
  Calendar,
  IndianRupee,
  User,
  Building2,
  Package,
  Truck,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrderItem {
  id: string;
  item_description: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  rate: number;
  discount_percent: number;
  taxable_amount: number;
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  total_amount: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;
  vendor_gstin?: string;
  po_date: string;
  expected_delivery_date: string;
  delivery_address: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'completed' | 'cancelled';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_date?: string;
  terms_and_conditions: string;
  payment_terms: string;
  delivery_terms: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  total_discount: number;
  total_cgst: number;
  total_sgst: number;
  total_igst: number;
  total_amount: number;
  created_by: string;
  created_date: string;
  last_modified: string;
}

const PurchaseOrders = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [showPOForm, setShowPOForm] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending_approval: 0,
    approved: 0,
    this_month: 0
  });

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadPurchaseOrders();
    loadStats();
  }, []);

  const loadPurchaseOrders = async () => {
    setLoading(true);
    // Mock data
    const mockPOs: PurchaseOrder[] = [
      {
        id: "1",
        po_number: "PO/2024/001",
        vendor_id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_gstin: "06ABCPD1234E1Z5",
        po_date: "2024-02-15",
        expected_delivery_date: "2024-02-28",
        delivery_address: "Main Office, Sector 18, Gurugram",
        status: "approved",
        approval_status: "approved",
        approved_by: "Manager",
        approved_date: "2024-02-16",
        terms_and_conditions: "Standard terms apply",
        payment_terms: "30 days from delivery",
        delivery_terms: "FOB Destination",
        items: [
          {
            id: "1",
            item_description: "Office Stationery Bundle",
            hsn_code: "4817",
            quantity: 10,
            unit: "Set",
            rate: 500,
            discount_percent: 10,
            taxable_amount: 4500,
            cgst_rate: 9,
            sgst_rate: 9,
            igst_rate: 0,
            total_amount: 5310
          }
        ],
        subtotal: 4500,
        total_discount: 500,
        total_cgst: 405,
        total_sgst: 405,
        total_igst: 0,
        total_amount: 5310,
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-02-16"
      },
      {
        id: "2",
        po_number: "PO/2024/002",
        vendor_id: "2",
        vendor_name: "XYZ Consultants",
        vendor_gstin: "07XYZPD5678F1Z8",
        po_date: "2024-02-20",
        expected_delivery_date: "2024-03-05",
        delivery_address: "Main Office, Sector 18, Gurugram",
        status: "pending_approval",
        approval_status: "pending",
        terms_and_conditions: "As per agreement",
        payment_terms: "15 days from delivery",
        delivery_terms: "FOB Origin",
        items: [
          {
            id: "1",
            item_description: "Software Licensing",
            hsn_code: "9954",
            quantity: 1,
            unit: "License",
            rate: 50000,
            discount_percent: 0,
            taxable_amount: 50000,
            cgst_rate: 9,
            sgst_rate: 9,
            igst_rate: 0,
            total_amount: 59000
          }
        ],
        subtotal: 50000,
        total_discount: 0,
        total_cgst: 4500,
        total_sgst: 4500,
        total_igst: 0,
        total_amount: 59000,
        created_by: "User 2",
        created_date: "2024-02-20",
        last_modified: "2024-02-20"
      }
    ];
    setPurchaseOrders(mockPOs);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total: 25,
      pending_approval: 8,
      approved: 15,
      this_month: 12
    });
  };

  const handleCreatePO = () => {
    setEditingPO(null);
    setShowPOForm(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO(po);
    setShowPOForm(true);
  };

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === poId 
        ? { ...po, status: "approved", approval_status: "approved", approved_by: "Current User", approved_date: new Date().toISOString().split('T')[0] }
        : po
    ));
    toast({
      title: "✅ Success",
      description: "Purchase order approved successfully.",
    });
  };

  const handleRejectPO = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === poId 
        ? { ...po, approval_status: "rejected" }
        : po
    ));
    toast({
      title: "❌ Rejected",
      description: "Purchase order rejected.",
    });
  };

  const handleDeletePO = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
    toast({
      title: "✅ Success",
      description: "Purchase order deleted successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'partially_received': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Purchase Orders - JusFinn AI</title>
        <meta name="description" content="Manage purchase orders with approval workflows, vendor integration, and GST compliance features." />
        <meta name="keywords" content="purchase orders, procurement, vendor management, approval workflow, GST compliance, purchase management" />
        <meta property="og:title" content="Purchase Orders - JusFinn AI" />
        <meta property="og:description" content="Streamlined purchase order management with approval workflows and compliance." />
        <link rel="canonical" href="https://your-domain.com/purchase-orders" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage procurement with approval workflows and vendor integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreatePO}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total purchase orders
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
            <CardTitle className="text-sm font-medium">Approved POs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Approved orders
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.this_month}</div>
            <p className="text-xs text-muted-foreground">
              New POs created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by PO number or vendor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="partially_received">Partially Received</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage all purchase orders and track their status
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
                  {filteredPOs.map((po) => (
                    <div
                      key={po.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{po.po_number}</h3>
                            <Badge className={getStatusColor(po.status)}>
                              {po.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {po.approval_status === 'approved' && (
                              <Badge className="bg-green-100 text-green-800">
                                ✓ Approved
                              </Badge>
                            )}
                            {po.approval_status === 'pending' && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                ⏳ Pending Approval
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{po.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Date: {new Date(po.po_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                <span>Expected: {new Date(po.expected_delivery_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                <span>Amount: ₹{po.total_amount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                <span>Items: {po.items.length}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Created by: {po.created_by}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm">
                                <strong>Payment Terms:</strong> {po.payment_terms}
                              </div>
                              <div className="text-sm">
                                <strong>Delivery Terms:</strong> {po.delivery_terms}
                              </div>
                              {po.approved_by && (
                                <div className="text-sm text-green-600">
                                  <strong>Approved by:</strong> {po.approved_by}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* View PO */}}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPO(po)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Download PO */}}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {po.approval_status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePO(po.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectPO(po.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePO(po.id)}
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
                Review and approve pending purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.filter(po => po.approval_status === 'pending').map((po) => (
                  <div key={po.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{po.po_number}</h3>
                        <p className="text-sm text-gray-600">{po.vendor_name}</p>
                        <p className="text-sm font-medium">₹{po.total_amount.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePO(po.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectPO(po.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {purchaseOrders.filter(po => po.approval_status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  PO Trends
                </CardTitle>
                <CardDescription>
                  Track purchase order trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Spending Analysis
                </CardTitle>
                <CardDescription>
                  Monitor spending patterns and vendor performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Spending analytics coming soon</p>
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
                Purchase Order Settings
              </CardTitle>
              <CardDescription>
                Configure purchase order workflows and approval rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Approval limits, workflows, default terms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Order Form Dialog - Placeholder */}
      <Dialog open={showPOForm} onOpenChange={setShowPOForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPO ? 'Edit Purchase Order' : 'Create New Purchase Order'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Purchase Order form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include vendor selection, item details, GST calculation, and approval workflow
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPOForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingPO ? 'Update PO' : 'Create PO'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders; 