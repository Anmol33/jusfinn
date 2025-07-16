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
  Truck, 
  Plus, 
  TrendingUp,
  Package,
  Anchor,
  Wrench,
  Calculator,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  Calendar,
  IndianRupee,
  Building2,
  Search,
  Filter,
  Upload,
  PieChart,
  BarChart3,
  Boxes,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandedCostComponent {
  id: string;
  cost_type: 'freight' | 'customs_duty' | 'insurance' | 'handling' | 'installation' | 'certification' | 'warehousing' | 'other';
  description: string;
  amount: number;
  vendor_name?: string;
  vendor_gstin?: string;
  invoice_number?: string;
  invoice_date?: string;
  gst_amount: number;
  total_amount: number;
  allocation_method: 'value' | 'weight' | 'quantity' | 'manual';
  currency: string;
  exchange_rate?: number;
  remarks?: string;
}

interface LandedCostRecord {
  id: string;
  lc_number: string;
  purchase_order_id?: string;
  po_number?: string;
  grn_id?: string;
  grn_number?: string;
  vendor_name: string;
  shipment_date: string;
  arrival_date: string;
  port_of_origin?: string;
  port_of_destination?: string;
  shipment_value: number;
  total_landed_cost: number;
  landed_cost_percentage: number;
  status: 'draft' | 'calculated' | 'allocated' | 'completed';
  components: LandedCostComponent[];
  items: LandedCostItem[];
  created_by: string;
  created_date: string;
  last_modified: string;
}

interface LandedCostItem {
  id: string;
  item_description: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  allocated_landed_cost: number;
  final_unit_cost: number;
  final_total_cost: number;
  allocation_basis: number;
  allocation_percentage: number;
}

interface CostAllocation {
  cost_component_id: string;
  item_id: string;
  allocated_amount: number;
  allocation_percentage: number;
  basis_value: number;
}

const LandedCostAccounting = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("records");
  const [showLCForm, setShowLCForm] = useState(false);
  const [editingLC, setEditingLC] = useState<LandedCostRecord | null>(null);
  const [landedCostRecords, setLandedCostRecords] = useState<LandedCostRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total_records: 0,
    total_landed_cost: 0,
    avg_lc_percentage: 0,
    pending_allocation: 0,
    this_month: 0,
    cost_savings: 0
  });

  // Cost types and their typical percentages
  const costTypes = [
    { value: "freight", label: "Freight & Transportation", icon: Truck, typical: "2-8%" },
    { value: "customs_duty", label: "Customs Duty", icon: Anchor, typical: "0-15%" },
    { value: "insurance", label: "Insurance", icon: Package, typical: "0.5-2%" },
    { value: "handling", label: "Port/Handling Charges", icon: Boxes, typical: "1-3%" },
    { value: "installation", label: "Installation & Setup", icon: Wrench, typical: "3-10%" },
    { value: "certification", label: "Certification & Testing", icon: FileText, typical: "1-5%" },
    { value: "warehousing", label: "Warehousing & Storage", icon: Building2, typical: "1-4%" },
    { value: "other", label: "Other Charges", icon: Calculator, typical: "Variable" }
  ];

  // Allocation methods
  const allocationMethods = [
    { value: "value", label: "By Value", description: "Allocate based on item value proportion" },
    { value: "weight", label: "By Weight", description: "Allocate based on item weight proportion" },
    { value: "quantity", label: "By Quantity", description: "Allocate based on item quantity proportion" },
    { value: "manual", label: "Manual", description: "Manual allocation by user" }
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadLandedCostData();
    loadStats();
  }, []);

  const loadLandedCostData = async () => {
    setLoading(true);
    
    // Mock Landed Cost Records
    const mockRecords: LandedCostRecord[] = [
      {
        id: "1",
        lc_number: "LC/2024/001",
        purchase_order_id: "1",
        po_number: "PO/2024/001",
        grn_id: "1",
        grn_number: "GRN/2024/001",
        vendor_name: "ABC Suppliers Pvt Ltd",
        shipment_date: "2024-02-15",
        arrival_date: "2024-02-28",
        port_of_origin: "Shanghai Port",
        port_of_destination: "JNPT Mumbai",
        shipment_value: 1000000,
        total_landed_cost: 150000,
        landed_cost_percentage: 15,
        status: "completed",
        components: [
          {
            id: "1",
            cost_type: "freight",
            description: "Sea freight charges",
            amount: 80000,
            vendor_name: "Express Logistics",
            vendor_gstin: "27FREIGHT123Z1",
            invoice_number: "FRT-001",
            invoice_date: "2024-02-20",
            gst_amount: 14400,
            total_amount: 94400,
            allocation_method: "value",
            currency: "INR"
          },
          {
            id: "2",
            cost_type: "customs_duty",
            description: "Import duty and customs charges",
            amount: 50000,
            vendor_name: "Customs Department",
            invoice_number: "CD-001",
            invoice_date: "2024-02-25",
            gst_amount: 9000,
            total_amount: 59000,
            allocation_method: "value",
            currency: "INR"
          },
          {
            id: "3",
            cost_type: "installation",
            description: "Equipment installation and setup",
            amount: 20000,
            vendor_name: "Tech Install Services",
            vendor_gstin: "06TECH5678E1Z2",
            invoice_number: "TIS-001",
            invoice_date: "2024-03-01",
            gst_amount: 3600,
            total_amount: 23600,
            allocation_method: "quantity",
            currency: "INR"
          }
        ],
        items: [
          {
            id: "1",
            item_description: "Manufacturing Equipment Unit A",
            hsn_code: "8479",
            quantity: 2,
            unit: "Unit",
            unit_cost: 300000,
            total_cost: 600000,
            allocated_landed_cost: 90000,
            final_unit_cost: 345000,
            final_total_cost: 690000,
            allocation_basis: 600000,
            allocation_percentage: 60
          },
          {
            id: "2",
            item_description: "Manufacturing Equipment Unit B",
            hsn_code: "8479",
            quantity: 1,
            unit: "Unit",
            unit_cost: 400000,
            total_cost: 400000,
            allocated_landed_cost: 60000,
            final_unit_cost: 460000,
            final_total_cost: 460000,
            allocation_basis: 400000,
            allocation_percentage: 40
          }
        ],
        created_by: "User 1",
        created_date: "2024-02-15",
        last_modified: "2024-03-01"
      },
      {
        id: "2",
        lc_number: "LC/2024/002",
        vendor_name: "XYZ International",
        shipment_date: "2024-03-05",
        arrival_date: "2024-03-20",
        port_of_origin: "Hamburg Port",
        port_of_destination: "Chennai Port",
        shipment_value: 750000,
        total_landed_cost: 95000,
        landed_cost_percentage: 12.67,
        status: "calculated",
        components: [
          {
            id: "1",
            cost_type: "freight",
            description: "Air freight charges",
            amount: 60000,
            vendor_name: "Air Cargo Express",
            gst_amount: 10800,
            total_amount: 70800,
            allocation_method: "weight",
            currency: "INR"
          },
          {
            id: "2",
            cost_type: "insurance",
            description: "Marine insurance",
            amount: 15000,
            vendor_name: "Marine Insurance Co",
            gst_amount: 2700,
            total_amount: 17700,
            allocation_method: "value",
            currency: "INR"
          },
          {
            id: "3",
            cost_type: "handling",
            description: "Port handling charges",
            amount: 20000,
            vendor_name: "Port Authority",
            gst_amount: 3600,
            total_amount: 23600,
            allocation_method: "quantity",
            currency: "INR"
          }
        ],
        items: [
          {
            id: "1",
            item_description: "Precision Tools Set",
            hsn_code: "8206",
            quantity: 50,
            unit: "Set",
            unit_cost: 15000,
            total_cost: 750000,
            allocated_landed_cost: 95000,
            final_unit_cost: 16900,
            final_total_cost: 845000,
            allocation_basis: 750000,
            allocation_percentage: 100
          }
        ],
        created_by: "User 2",
        created_date: "2024-03-05",
        last_modified: "2024-03-05"
      }
    ];

    setLandedCostRecords(mockRecords);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total_records: 25,
      total_landed_cost: 3250000,
      avg_lc_percentage: 14.2,
      pending_allocation: 8,
      this_month: 12,
      cost_savings: 185000
    });
  };

  const handleCreateLC = () => {
    setEditingLC(null);
    setShowLCForm(true);
  };

  const handleEditLC = (record: LandedCostRecord) => {
    setEditingLC(record);
    setShowLCForm(true);
  };

  const handleDeleteLC = (recordId: string) => {
    setLandedCostRecords(prev => prev.filter(record => record.id !== recordId));
    toast({
      title: "✅ Success",
      description: "Landed cost record deleted successfully.",
    });
  };

  const handleAllocateCosts = (recordId: string) => {
    setLandedCostRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "allocated" as const }
        : record
    ));
    toast({
      title: "🔄 Costs Allocated",
      description: "Landed costs allocated to inventory items successfully.",
    });
  };

  const handleCompleteLandedCost = (recordId: string) => {
    setLandedCostRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "completed" as const }
        : record
    ));
    toast({
      title: "✅ Completed",
      description: "Landed cost accounting completed and posted to inventory.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'calculated': return 'bg-blue-100 text-blue-800';
      case 'allocated': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostTypeIcon = (costType: string) => {
    const type = costTypes.find(t => t.value === costType);
    return type ? type.icon : Calculator;
  };

  const getCostTypeLabel = (costType: string) => {
    const type = costTypes.find(t => t.value === costType);
    return type ? type.label : costType;
  };

  const filteredRecords = landedCostRecords.filter(record => {
    const matchesSearch = 
      record.lc_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.po_number && record.po_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Landed Cost Accounting - JusFinn AI</title>
        <meta name="description" content="Manage landed costs including freight, customs, installation costs with accurate inventory valuation." />
        <meta name="keywords" content="landed cost accounting, freight costs, customs duty, inventory valuation, cost allocation, import costs" />
        <meta property="og:title" content="Landed Cost Accounting - JusFinn AI" />
        <meta property="og:description" content="Complete landed cost management for accurate inventory valuation and costing." />
        <link rel="canonical" href="https://your-domain.com/landed-cost-accounting" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Landed Cost Accounting</h1>
          <p className="text-gray-600 mt-2">
            Track additional costs like freight, customs, and installation for accurate inventory valuation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateLC}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Landed Cost
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_records}</div>
            <p className="text-xs text-muted-foreground">
              LC calculations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total LC Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.total_landed_cost/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Additional costs
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg LC %</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_lc_percentage}%</div>
            <p className="text-xs text-muted-foreground">
              Of invoice value
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_allocation}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting allocation
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
              New calculations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.cost_savings/1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Optimized costs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="records">LC Records</TabsTrigger>
          <TabsTrigger value="components">Cost Components</TabsTrigger>
          <TabsTrigger value="allocation">Cost Allocation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by LC number, vendor name, or PO number..."
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
                      <SelectItem value="calculated">Calculated</SelectItem>
                      <SelectItem value="allocated">Allocated</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Landed Cost Records */}
          <Card>
            <CardHeader>
              <CardTitle>Landed Cost Records</CardTitle>
              <CardDescription>
                Track all landed cost calculations and allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{record.lc_number}</h3>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {record.landed_cost_percentage.toFixed(1)}% LC
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{record.vendor_name}</span>
                            </div>
                            {record.po_number && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>PO: {record.po_number}</span>
                              </div>
                            )}
                            {record.grn_number && (
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                <span>GRN: {record.grn_number}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Shipped: {new Date(record.shipment_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Arrived: {new Date(record.arrival_date).toLocaleDateString()}</span>
                            </div>
                            {record.port_of_origin && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{record.port_of_origin} → {record.port_of_destination}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm">
                              <strong>Shipment Value:</strong> ₹{record.shipment_value.toLocaleString()}
                            </div>
                            <div className="text-sm">
                              <strong>Landed Cost:</strong> ₹{record.total_landed_cost.toLocaleString()}
                            </div>
                            <div className="text-sm">
                              <strong>Components:</strong> {record.components.length}
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm">
                              <strong>Items:</strong> {record.items.length}
                            </div>
                            <div className="text-sm">
                              <strong>Created:</strong> {new Date(record.created_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm">
                              <strong>By:</strong> {record.created_by}
                            </div>
                          </div>
                        </div>

                        {/* Cost Components Preview */}
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Cost Components:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.components.map((component) => {
                              const IconComponent = getCostTypeIcon(component.cost_type);
                              return (
                                <Badge key={component.id} variant="outline" className="flex items-center gap-1">
                                  <IconComponent className="w-3 h-3" />
                                  <span>{getCostTypeLabel(component.cost_type)}: ₹{component.total_amount.toLocaleString()}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* View record */}}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditLC(record)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {record.status === 'calculated' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAllocateCosts(record.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Calculator className="w-4 h-4" />
                          </Button>
                        )}
                        {record.status === 'allocated' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteLandedCost(record.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Package className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLC(record.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Cost Components Library
              </CardTitle>
              <CardDescription>
                Manage different types of landed cost components and their typical rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {costTypes.map((costType) => {
                  const IconComponent = costType.icon;
                  const componentUsage = landedCostRecords.flatMap(r => r.components).filter(c => c.cost_type === costType.value);
                  const avgAmount = componentUsage.length > 0 
                    ? componentUsage.reduce((sum, c) => sum + c.amount, 0) / componentUsage.length 
                    : 0;
                  
                  return (
                    <div key={costType.value} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{costType.label}</h3>
                          <p className="text-sm text-gray-500">Typical: {costType.typical}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Usage Count</p>
                          <p className="font-medium">{componentUsage.length} times</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Amount</p>
                          <p className="font-medium">₹{avgAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Cost Allocation Methods
              </CardTitle>
              <CardDescription>
                Configure how landed costs are allocated to inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocationMethods.map((method) => (
                  <div key={method.value} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{method.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                      </div>
                      <Badge variant="outline">
                        {landedCostRecords.flatMap(r => r.components).filter(c => c.allocation_method === method.value).length} uses
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Sample Allocation Calculation</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Item A (Value: ₹600,000 - 60%)</span>
                      <span>LC Allocation: ₹90,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Item B (Value: ₹400,000 - 40%)</span>
                      <span>LC Allocation: ₹60,000</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total Landed Cost</span>
                      <span>₹150,000</span>
                    </div>
                  </div>
                </div>
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
                  Cost Trends
                </CardTitle>
                <CardDescription>
                  Track landed cost patterns and optimization opportunities
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
                  <PieChart className="w-5 h-5" />
                  Component Analysis
                </CardTitle>
                <CardDescription>
                  Analyze cost component distribution and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Component analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Landed Cost Reports
              </CardTitle>
              <CardDescription>
                Generate comprehensive landed cost reports for analysis and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="w-8 h-8 mb-2" />
                  <span>LC Summary Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <PieChart className="w-8 h-8 mb-2" />
                  <span>Component Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Package className="w-8 h-8 mb-2" />
                  <span>Inventory Valuation</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <span>Cost Optimization</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Landed Cost Form Dialog - Placeholder */}
      <Dialog open={showLCForm} onOpenChange={setShowLCForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLC ? 'Edit Landed Cost Record' : 'Create New Landed Cost Record'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="text-center py-8">
              <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Landed cost form coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Will include shipment details, cost components, allocation methods, and item mapping
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowLCForm(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {editingLC ? 'Update Record' : 'Create Record'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandedCostAccounting; 