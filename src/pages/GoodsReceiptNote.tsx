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
  Package, 
  Plus, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Truck,
  FileText,
  Calendar,
  ClipboardCheck,
  ShoppingCart,
  Receipt,
  Building2,
  User,
  MapPin,
  Search,
  XCircle,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GRNItem {
  id: string;
  po_item_id: string;
  item_description: string;
  hsn_code: string;
  ordered_quantity: number;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  unit: string;
  rate: number;
  quality_status: 'pending' | 'accepted' | 'rejected' | 'partial';
  quality_remarks?: string;
  inspection_date?: string;
  inspector_name?: string;
}

interface GoodsReceiptNote {
  id: string;
  grn_number: string;
  po_number: string;
  po_id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_gstin?: string;
  grn_date: string;
  delivery_challan_number: string;
  delivery_challan_date: string;
  vehicle_number?: string;
  transporter_name?: string;
  received_by: string;
  delivery_address: string;
  status: 'draft' | 'received' | 'quality_pending' | 'quality_approved' | 'quality_rejected' | 'completed';
  items: GRNItem[];
  total_ordered: number;
  total_received: number;
  total_accepted: number;
  total_rejected: number;
  remarks: string;
  created_by: string;
  created_date: string;
  last_modified: string;
  is_invoice_matched: boolean;
  matched_invoice_number?: string;
}

const GoodsReceiptNote = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grn");
  const [showGRNForm, setShowGRNForm] = useState(false);
  const [editingGRN, setEditingGRN] = useState<GoodsReceiptNote | null>(null);
  const [grns, setGrns] = useState<GoodsReceiptNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    quality_pending: 0,
    completed: 0,
    this_month: 0
  });

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadGRNs();
    loadStats();
  }, []);

  const loadGRNs = async () => {
    setLoading(true);
    // Mock data
    const mockGRNs: GoodsReceiptNote[] = [
      {
        id: "1",
        grn_number: "GRN/2024/001",
        po_number: "PO/2024/001",
        po_id: "1",
        vendor_id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        vendor_gstin: "06ABCPD1234E1Z5",
        grn_date: "2024-02-28",
        delivery_challan_number: "DC-001",
        delivery_challan_date: "2024-02-27",
        vehicle_number: "HR26-2024",
        transporter_name: "Express Logistics",
        received_by: "Warehouse Team",
        delivery_address: "Main Office, Sector 18, Gurugram",
        status: "completed",
        items: [
          {
            id: "1",
            po_item_id: "1",
            item_description: "Office Stationery Bundle",
            hsn_code: "4817",
            ordered_quantity: 10,
            received_quantity: 10,
            accepted_quantity: 9,
            rejected_quantity: 1,
            unit: "Set",
            rate: 500,
            quality_status: "partial",
            quality_remarks: "1 set damaged during transit",
            inspection_date: "2024-02-28",
            inspector_name: "Quality Team"
          }
        ],
        total_ordered: 10,
        total_received: 10,
        total_accepted: 9,
        total_rejected: 1,
        remarks: "Partial acceptance due to damage",
        created_by: "User 1",
        created_date: "2024-02-28",
        last_modified: "2024-02-28",
        is_invoice_matched: true,
        matched_invoice_number: "INV-001"
      },
      {
        id: "2",
        grn_number: "GRN/2024/002",
        po_number: "PO/2024/002",
        po_id: "2",
        vendor_id: "2",
        vendor_name: "XYZ Consultants",
        vendor_gstin: "07XYZPD5678F1Z8",
        grn_date: "2024-03-05",
        delivery_challan_number: "DC-002",
        delivery_challan_date: "2024-03-05",
        received_by: "IT Team",
        delivery_address: "Main Office, Sector 18, Gurugram",
        status: "quality_pending",
        items: [
          {
            id: "1",
            po_item_id: "1",
            item_description: "Software Licensing",
            hsn_code: "9954",
            ordered_quantity: 1,
            received_quantity: 1,
            accepted_quantity: 0,
            rejected_quantity: 0,
            unit: "License",
            rate: 50000,
            quality_status: "pending",
            quality_remarks: "Awaiting software validation"
          }
        ],
        total_ordered: 1,
        total_received: 1,
        total_accepted: 0,
        total_rejected: 0,
        remarks: "Software received, validation in progress",
        created_by: "User 2",
        created_date: "2024-03-05",
        last_modified: "2024-03-05",
        is_invoice_matched: false
      }
    ];
    setGrns(mockGRNs);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total: 18,
      quality_pending: 5,
      completed: 12,
      this_month: 8
    });
  };

  const handleCreateGRN = () => {
    setEditingGRN(null);
    setShowGRNForm(true);
  };

  const handleEditGRN = (grn: GoodsReceiptNote) => {
    setEditingGRN(grn);
    setShowGRNForm(true);
  };

  const handleDeleteGRN = (grnId: string) => {
    setGrns(prev => prev.filter(grn => grn.id !== grnId));
    toast({
      title: "✅ Success",
      description: "GRN deleted successfully.",
    });
  };

  const handleQualityApproval = (grnId: string, itemId: string, action: 'accept' | 'reject') => {
    setGrns(prev => prev.map(grn => {
      if (grn.id === grnId) {
        const updatedItems = grn.items.map(item => {
          if (item.id === itemId) {
            if (action === 'accept') {
              return {
                ...item,
                quality_status: 'accepted' as const,
                accepted_quantity: item.received_quantity,
                rejected_quantity: 0
              };
            } else {
              return {
                ...item,
                quality_status: 'rejected' as const,
                accepted_quantity: 0,
                rejected_quantity: item.received_quantity
              };
            }
          }
          return item;
        });
        
        const allApproved = updatedItems.every(item => item.quality_status !== 'pending');
        
        return {
          ...grn,
          items: updatedItems,
          status: allApproved ? 'quality_approved' : grn.status,
          total_accepted: updatedItems.reduce((sum, item) => sum + item.accepted_quantity, 0),
          total_rejected: updatedItems.reduce((sum, item) => sum + item.rejected_quantity, 0)
        };
      }
      return grn;
    }));
    
    toast({
      title: action === 'accept' ? "✅ Accepted" : "❌ Rejected",
      description: `Item ${action}ed successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'quality_pending': return 'bg-yellow-100 text-yellow-800';
      case 'quality_approved': return 'bg-green-100 text-green-800';
      case 'quality_rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGRNs = grns.filter(grn => {
    const matchesSearch = 
      grn.grn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || grn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Goods Receipt Note - JusFinn AI</title>
        <meta name="description" content="Manage goods receipt notes with three-way matching, quality control, and inventory tracking." />
        <meta name="keywords" content="goods receipt note, GRN, three-way matching, quality control, inventory management, purchase order matching" />
        <meta property="og:title" content="Goods Receipt Note - JusFinn AI" />
        <meta property="og:description" content="Comprehensive GRN management with quality control and purchase order matching." />
        <link rel="canonical" href="https://your-domain.com/goods-receipt-note" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goods Receipt Note</h1>
          <p className="text-gray-600 mt-2">
            Manage incoming goods with quality control and three-way matching
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateGRN}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create GRN
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GRNs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total goods received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Pending</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quality_pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting quality check
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Fully processed
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
              New receipts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grn">All GRNs</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="matching">Three-Way Matching</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="grn" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by GRN, PO number, or vendor..."
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
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="quality_pending">Quality Pending</SelectItem>
                      <SelectItem value="quality_approved">Quality Approved</SelectItem>
                      <SelectItem value="quality_rejected">Quality Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GRNs List */}
          <Card>
            <CardHeader>
              <CardTitle>Goods Receipt Notes</CardTitle>
              <CardDescription>
                Track all incoming goods and their quality status
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
                  {filteredGRNs.map((grn) => (
                    <div
                      key={grn.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{grn.grn_number}</h3>
                            <Badge className={getStatusColor(grn.status)}>
                              {grn.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {grn.is_invoice_matched && (
                              <Badge className="bg-blue-100 text-blue-800">
                                📋 Invoice Matched
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                <span>PO: {grn.po_number}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                <span>{grn.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Received: {new Date(grn.grn_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>DC: {grn.delivery_challan_number}</span>
                              </div>
                              {grn.vehicle_number && (
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  <span>Vehicle: {grn.vehicle_number}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>By: {grn.received_by}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-sm">
                                <strong>Ordered:</strong> {grn.total_ordered}
                              </div>
                              <div className="text-sm">
                                <strong>Received:</strong> {grn.total_received}
                              </div>
                              <div className="text-sm text-green-600">
                                <strong>Accepted:</strong> {grn.total_accepted}
                              </div>
                              {grn.total_rejected > 0 && (
                                <div className="text-sm text-red-600">
                                  <strong>Rejected:</strong> {grn.total_rejected}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* View GRN */}}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditGRN(grn)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteGRN(grn.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Items with Quality Status */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Items:</h4>
                        <div className="space-y-2">
                          {grn.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{item.item_description}</span>
                                <span className="text-gray-500 ml-2">HSN: {item.hsn_code}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getQualityStatusColor(item.quality_status)}>
                                  {item.quality_status.toUpperCase()}
                                </Badge>
                                {item.quality_status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQualityApproval(grn.id, item.id, 'accept')}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleQualityApproval(grn.id, item.id, 'reject')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Quality Control Dashboard
              </CardTitle>
              <CardDescription>
                Review and approve quality for received items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grns.filter(grn => grn.status === 'quality_pending').map((grn) => (
                  <div key={grn.id} className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{grn.grn_number}</h3>
                        <p className="text-sm text-gray-600">{grn.vendor_name}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Quality Pending</Badge>
                    </div>
                    <div className="space-y-2">
                      {grn.items.filter(item => item.quality_status === 'pending').map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                          <div>
                            <span className="font-medium">{item.item_description}</span>
                            <span className="text-sm text-gray-500 block">Qty: {item.received_quantity} {item.unit}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleQualityApproval(grn.id, item.id, 'accept')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQualityApproval(grn.id, item.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {grns.filter(grn => grn.status === 'quality_pending').length === 0 && (
                  <div className="text-center py-8">
                    <ClipboardCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No items pending quality approval</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Three-Way Matching
              </CardTitle>
              <CardDescription>
                Match Purchase Orders, GRNs, and Invoices for complete audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Three-way matching dashboard coming soon</p>
                <p className="text-sm text-gray-400 mt-2">
                  Automatic matching of PO → GRN → Invoice with discrepancy alerts
                </p>
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
                  Receipt Trends
                </CardTitle>
                <CardDescription>
                  Track goods receipt patterns and quality metrics
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
                  <ClipboardCheck className="w-5 h-5" />
                  Quality Metrics
                </CardTitle>
                <CardDescription>
                  Monitor quality acceptance rates and vendor performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ClipboardCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Quality analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* GRN Form Dialog - Placeholder */}
      <Dialog open={showGRNForm} onOpenChange={setShowGRNForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGRN ? 'Edit Goods Receipt Note' : 'Create New GRN'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">GRN form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include PO selection, item receipt, quality checks, and delivery details
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowGRNForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingGRN ? 'Update GRN' : 'Create GRN'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoodsReceiptNote; 