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
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
  MapPin,
  Ship,
  Plane,
  Globe,
  Target,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Percent,
  Weight,
  Hash
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
  shipment_method: 'sea' | 'air' | 'road' | 'rail';
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
  weight?: number;
  unit_cost: number;
  total_cost: number;
  allocated_landed_cost: number;
  final_unit_cost: number;
  final_total_cost: number;
  allocation_basis: number;
  allocation_percentage: number;
  customs_duty_rate?: number;
  customs_duty_amount?: number;
}

interface CostAllocation {
  cost_component_id: string;
  item_id: string;
  allocated_amount: number;
  allocation_percentage: number;
  basis_value: number;
}

interface FormData {
  lc_number: string;
  po_number: string;
  grn_number: string;
  vendor_name: string;
  shipment_date: string;
  arrival_date: string;
  port_of_origin: string;
  port_of_destination: string;
  shipment_method: string;
  shipment_value: string;
  remarks: string;
}

interface ComponentFormData {
  cost_type: string;
  description: string;
  amount: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  gst_amount: string;
  allocation_method: string;
  currency: string;
  exchange_rate: string;
  remarks: string;
}

const LandedCostAccounting = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("records");
  const [showLCForm, setShowLCForm] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingLC, setEditingLC] = useState<LandedCostRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LandedCostRecord | null>(null);
  const [landedCostRecords, setLandedCostRecords] = useState<LandedCostRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    lc_number: '',
    po_number: '',
    grn_number: '',
    vendor_name: '',
    shipment_date: '',
    arrival_date: '',
    port_of_origin: '',
    port_of_destination: '',
    shipment_method: '',
    shipment_value: '',
    remarks: ''
  });
  const [componentFormData, setComponentFormData] = useState<ComponentFormData>({
    cost_type: '',
    description: '',
    amount: '',
    vendor_name: '',
    invoice_number: '',
    invoice_date: '',
    gst_amount: '',
    allocation_method: 'value',
    currency: 'INR',
    exchange_rate: '1',
    remarks: ''
  });
  const [stats, setStats] = useState({
    total_records: 0,
    total_landed_cost: 0,
    avg_lc_percentage: 0,
    pending_allocation: 0,
    this_month: 0,
    cost_savings: 0,
    international_shipments: 0,
    domestic_shipments: 0
  });

  // Cost types and their typical percentages
  const costTypes = [
    { value: "freight", label: "Freight & Transportation", icon: Truck, typical: "2-8%", color: "bg-blue-100 text-blue-800" },
    { value: "customs_duty", label: "Customs Duty", icon: Anchor, typical: "0-15%", color: "bg-orange-100 text-orange-800" },
    { value: "insurance", label: "Insurance", icon: Package, typical: "0.5-2%", color: "bg-green-100 text-green-800" },
    { value: "handling", label: "Port/Handling Charges", icon: Boxes, typical: "1-3%", color: "bg-purple-100 text-purple-800" },
    { value: "installation", label: "Installation & Setup", icon: Wrench, typical: "3-10%", color: "bg-yellow-100 text-yellow-800" },
    { value: "certification", label: "Certification & Testing", icon: FileText, typical: "1-5%", color: "bg-indigo-100 text-indigo-800" },
    { value: "warehousing", label: "Warehousing & Storage", icon: Building2, typical: "1-4%", color: "bg-pink-100 text-pink-800" },
    { value: "other", label: "Other Charges", icon: Calculator, typical: "Variable", color: "bg-gray-100 text-gray-800" }
  ];

  // Allocation methods
  const allocationMethods = [
    { value: "value", label: "By Value", icon: IndianRupee, description: "Allocate based on item value proportion" },
    { value: "weight", label: "By Weight", icon: Weight, description: "Allocate based on item weight proportion" },
    { value: "quantity", label: "By Quantity", icon: Hash, description: "Allocate based on item quantity proportion" },
    { value: "manual", label: "Manual", icon: Edit, description: "Manual allocation by user" }
  ];

  // Shipment methods
  const shipmentMethods = [
    { value: "sea", label: "Sea Freight", icon: Ship, description: "Ocean/Sea transportation" },
    { value: "air", label: "Air Freight", icon: Plane, description: "Air transportation" },
    { value: "road", label: "Road Transport", icon: Truck, description: "Road/Highway transportation" },
    { value: "rail", label: "Rail Transport", icon: Building2, description: "Railway transportation" }
  ];

  // Mock data generation
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    // Mock Landed Cost Records with realistic data
    const mockRecords: LandedCostRecord[] = [
      {
        id: "LC001",
        lc_number: "LC/2024/001",
        purchase_order_id: "PO001",
        po_number: "PO/2024/10001",
        grn_id: "GRN001",
        grn_number: "GRN/2024/00123",
        vendor_name: "Global Tech Suppliers Ltd",
        shipment_date: "2024-09-15",
        arrival_date: "2024-10-20",
        port_of_origin: "Shanghai, China",
        port_of_destination: "JNPT, Mumbai",
        shipment_method: "sea",
        shipment_value: 5000000,
        total_landed_cost: 5750000,
        landed_cost_percentage: 15.0,
        status: "completed",
        components: [
          {
            id: "C001",
            cost_type: "freight",
            description: "Sea freight charges from Shanghai to Mumbai",
            amount: 450000,
            vendor_name: "Ocean Express Logistics",
            vendor_gstin: "27AABCO1234E1Z5",
            invoice_number: "OEL/2024/5678",
            invoice_date: "2024-09-20",
            gst_amount: 81000,
            total_amount: 531000,
            allocation_method: "value",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Container shipping charges"
          },
          {
            id: "C002",
            cost_type: "customs_duty",
            description: "Import customs duty and clearance",
            amount: 180000,
            vendor_name: "Customs Authority",
            invoice_number: "CD/2024/9876",
            invoice_date: "2024-10-18",
            gst_amount: 0,
            total_amount: 180000,
            allocation_method: "value",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Basic customs duty @ 10%"
          },
          {
            id: "C003",
            cost_type: "insurance",
            description: "Marine cargo insurance",
            amount: 25000,
            vendor_name: "Marine Insurance Co",
            vendor_gstin: "27AABMI7890F2G6",
            invoice_number: "MIC/2024/1111",
            invoice_date: "2024-09-16",
            gst_amount: 4500,
            total_amount: 29500,
            allocation_method: "value",
            currency: "INR",
            exchange_rate: 1,
            remarks: "0.5% of shipment value"
          },
          {
            id: "C004",
            cost_type: "handling",
            description: "Port handling and documentation",
            amount: 75000,
            vendor_name: "JNPT Operations",
            vendor_gstin: "27AABJN2345G3H7",
            invoice_number: "JNP/2024/2222",
            invoice_date: "2024-10-20",
            gst_amount: 13500,
            total_amount: 88500,
            allocation_method: "value",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Port charges and documentation"
          }
        ],
        items: [
          {
            id: "I001",
            item_description: "Electronic Sensors - Model A123",
            hsn_code: "8542",
            quantity: 1000,
            unit: "PCS",
            weight: 500,
            unit_cost: 2500,
            total_cost: 2500000,
            allocated_landed_cost: 375000,
            final_unit_cost: 2875,
            final_total_cost: 2875000,
            allocation_basis: 2500000,
            allocation_percentage: 50.0,
            customs_duty_rate: 10,
            customs_duty_amount: 90000
          },
          {
            id: "I002",
            item_description: "Microcontrollers - Model B456",
            hsn_code: "8542",
            quantity: 500,
            unit: "PCS",
            weight: 250,
            unit_cost: 5000,
            total_cost: 2500000,
            allocated_landed_cost: 375000,
            final_unit_cost: 5750,
            final_total_cost: 2875000,
            allocation_basis: 2500000,
            allocation_percentage: 50.0,
            customs_duty_rate: 10,
            customs_duty_amount: 90000
          }
        ],
        created_by: "Rajesh Kumar",
        created_date: "2024-09-15",
        last_modified: "2024-10-25"
      },
      {
        id: "LC002",
        lc_number: "LC/2024/002",
        purchase_order_id: "PO002",
        po_number: "PO/2024/10002",
        grn_id: "GRN002",
        grn_number: "GRN/2024/00124",
        vendor_name: "European Machinery Corp",
        shipment_date: "2024-10-01",
        arrival_date: "2024-10-15",
        port_of_origin: "Hamburg, Germany",
        port_of_destination: "Chennai Port",
        shipment_method: "air",
        shipment_value: 3200000,
        total_landed_cost: 3520000,
        landed_cost_percentage: 10.0,
        status: "allocated",
        components: [
          {
            id: "C005",
            cost_type: "freight",
            description: "Air freight charges from Hamburg to Chennai",
            amount: 250000,
            vendor_name: "Sky Cargo Express",
            vendor_gstin: "33AABSC4567H4I8",
            invoice_number: "SCE/2024/3333",
            invoice_date: "2024-10-02",
            gst_amount: 45000,
            total_amount: 295000,
            allocation_method: "weight",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Express air freight service"
          },
          {
            id: "C006",
            cost_type: "insurance",
            description: "Air cargo insurance",
            amount: 16000,
            vendor_name: "Aviation Insurance Ltd",
            vendor_gstin: "33AABAI8901I5J9",
            invoice_number: "AIL/2024/4444",
            invoice_date: "2024-10-01",
            gst_amount: 2880,
            total_amount: 18880,
            allocation_method: "value",
            currency: "INR",
            exchange_rate: 1,
            remarks: "0.5% air cargo insurance"
          }
        ],
        items: [
          {
            id: "I003",
            item_description: "Precision Machinery Parts",
            hsn_code: "8466",
            quantity: 100,
            unit: "SET",
            weight: 800,
            unit_cost: 32000,
            total_cost: 3200000,
            allocated_landed_cost: 320000,
            final_unit_cost: 35200,
            final_total_cost: 3520000,
            allocation_basis: 3200000,
            allocation_percentage: 100.0,
            customs_duty_rate: 7.5,
            customs_duty_amount: 54000
          }
        ],
        created_by: "Priya Sharma",
        created_date: "2024-10-01",
        last_modified: "2024-10-28"
      },
      {
        id: "LC003",
        lc_number: "LC/2024/003",
        purchase_order_id: "PO003",
        po_number: "PO/2024/10003",
        vendor_name: "Domestic Steel Industries",
        shipment_date: "2024-10-20",
        arrival_date: "2024-10-22",
        port_of_origin: "Jamshedpur, India",
        port_of_destination: "Bangalore, India",
        shipment_method: "road",
        shipment_value: 1500000,
        total_landed_cost: 1575000,
        landed_cost_percentage: 5.0,
        status: "calculated",
        components: [
          {
            id: "C007",
            cost_type: "freight",
            description: "Road transportation charges",
            amount: 60000,
            vendor_name: "Highway Logistics",
            vendor_gstin: "20AABHL5678J6K0",
            invoice_number: "HL/2024/5555",
            invoice_date: "2024-10-21",
            gst_amount: 10800,
            total_amount: 70800,
            allocation_method: "weight",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Truck transportation charges"
          },
          {
            id: "C008",
            cost_type: "handling",
            description: "Loading and unloading charges",
            amount: 12000,
            vendor_name: "Material Handling Services",
            vendor_gstin: "29AABMH9012K7L1",
            invoice_number: "MHS/2024/6666",
            invoice_date: "2024-10-22",
            gst_amount: 2160,
            total_amount: 14160,
            allocation_method: "quantity",
            currency: "INR",
            exchange_rate: 1,
            remarks: "Loading/unloading at both ends"
          }
        ],
        items: [
          {
            id: "I004",
            item_description: "Steel Sheets - Grade 304",
            hsn_code: "7219",
            quantity: 500,
            unit: "MT",
            weight: 500000,
            unit_cost: 3000,
            total_cost: 1500000,
            allocated_landed_cost: 75000,
            final_unit_cost: 3150,
            final_total_cost: 1575000,
            allocation_basis: 1500000,
            allocation_percentage: 100.0,
            customs_duty_rate: 0,
            customs_duty_amount: 0
          }
        ],
        created_by: "Amit Singh",
        created_date: "2024-10-20",
        last_modified: "2024-10-30"
      },
      {
        id: "LC004",
        lc_number: "LC/2024/004",
        purchase_order_id: "PO004",
        po_number: "PO/2024/10004",
        vendor_name: "Chemical Solutions Inc",
        shipment_date: "2024-10-25",
        arrival_date: "2024-11-01",
        port_of_origin: "Singapore",
        port_of_destination: "Kandla Port",
        shipment_method: "sea",
        shipment_value: 2800000,
        total_landed_cost: 0,
        landed_cost_percentage: 0,
        status: "draft",
        components: [],
        items: [
          {
            id: "I005",
            item_description: "Industrial Chemicals - Type X",
            hsn_code: "3824",
            quantity: 1000,
            unit: "KG",
            weight: 1000,
            unit_cost: 2800,
            total_cost: 2800000,
            allocated_landed_cost: 0,
            final_unit_cost: 2800,
            final_total_cost: 2800000,
            allocation_basis: 2800000,
            allocation_percentage: 100.0,
            customs_duty_rate: 12,
            customs_duty_amount: 0
          }
        ],
        created_by: "Neha Gupta",
        created_date: "2024-10-25",
        last_modified: "2024-10-25"
      }
    ];

    setLandedCostRecords(mockRecords);

    // Calculate stats
    const totalRecords = mockRecords.length;
    const totalLandedCost = mockRecords.reduce((sum, record) => sum + record.total_landed_cost, 0);
    const avgLCPercentage = mockRecords.length > 0 
      ? mockRecords.reduce((sum, record) => sum + record.landed_cost_percentage, 0) / mockRecords.length 
      : 0;
    const pendingAllocation = mockRecords.filter(record => record.status === 'draft' || record.status === 'calculated').length;
    const thisMonth = mockRecords.filter(record => {
      const recordDate = new Date(record.created_date);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;
    const internationalShipments = mockRecords.filter(record => 
      record.port_of_origin && !record.port_of_origin.includes('India')
    ).length;
    const domesticShipments = mockRecords.filter(record => 
      !record.port_of_origin || record.port_of_origin.includes('India')
    ).length;

    setStats({
      total_records: totalRecords,
      total_landed_cost: totalLandedCost,
      avg_lc_percentage: avgLCPercentage,
      pending_allocation: pendingAllocation,
      this_month: thisMonth,
      cost_savings: 125000,
      international_shipments: internationalShipments,
      domestic_shipments: domesticShipments
    });
  };

  const filteredRecords = landedCostRecords.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.lc_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.po_number && record.po_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesMethod = methodFilter === "all" || record.shipment_method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleAddLC = () => {
    setEditingLC(null);
    setFormData({
      lc_number: '',
      po_number: '',
      grn_number: '',
      vendor_name: '',
      shipment_date: '',
      arrival_date: '',
      port_of_origin: '',
      port_of_destination: '',
      shipment_method: '',
      shipment_value: '',
      remarks: ''
    });
    setShowLCForm(true);
  };

  const handleEditLC = (record: LandedCostRecord) => {
    setEditingLC(record);
    setFormData({
      lc_number: record.lc_number,
      po_number: record.po_number || '',
      grn_number: record.grn_number || '',
      vendor_name: record.vendor_name,
      shipment_date: record.shipment_date,
      arrival_date: record.arrival_date,
      port_of_origin: record.port_of_origin || '',
      port_of_destination: record.port_of_destination || '',
      shipment_method: record.shipment_method,
      shipment_value: record.shipment_value.toString(),
      remarks: ''
    });
    setShowLCForm(true);
  };

  const handleSaveLC = () => {
    if (!formData.lc_number || !formData.vendor_name || !formData.shipment_value) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRecord: LandedCostRecord = {
      id: editingLC ? editingLC.id : `LC${String(landedCostRecords.length + 1).padStart(3, '0')}`,
      lc_number: formData.lc_number,
      po_number: formData.po_number,
      grn_number: formData.grn_number,
      vendor_name: formData.vendor_name,
      shipment_date: formData.shipment_date,
      arrival_date: formData.arrival_date,
      port_of_origin: formData.port_of_origin,
      port_of_destination: formData.port_of_destination,
      shipment_method: formData.shipment_method as 'sea' | 'air' | 'road' | 'rail',
      shipment_value: parseFloat(formData.shipment_value),
      total_landed_cost: editingLC ? editingLC.total_landed_cost : parseFloat(formData.shipment_value),
      landed_cost_percentage: 0,
      status: 'draft',
      components: editingLC ? editingLC.components : [],
      items: editingLC ? editingLC.items : [],
      created_by: editingLC ? editingLC.created_by : "Current User",
      created_date: editingLC ? editingLC.created_date : new Date().toISOString().split('T')[0],
      last_modified: new Date().toISOString().split('T')[0]
    };

    if (editingLC) {
      setLandedCostRecords(prev => prev.map(record => 
        record.id === editingLC.id ? newRecord : record
      ));
      toast({
        title: "Success",
        description: "Landed cost record updated successfully",
      });
    } else {
      setLandedCostRecords(prev => [...prev, newRecord]);
      toast({
        title: "Success",
        description: "Landed cost record created successfully",
      });
    }

    setShowLCForm(false);
    setEditingLC(null);
  };

  const handleCalculateLC = (recordId: string) => {
    setLandedCostRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        const totalComponentCost = record.components.reduce((sum, comp) => sum + comp.total_amount, 0);
        const totalLandedCost = record.shipment_value + totalComponentCost;
        const landedCostPercentage = record.shipment_value > 0 
          ? ((totalComponentCost / record.shipment_value) * 100) 
          : 0;

        // Calculate allocation for items based on value proportion
        const updatedItems = record.items.map(item => {
          const allocationPercentage = (item.total_cost / record.shipment_value) * 100;
          const allocatedLandedCost = (totalComponentCost * allocationPercentage) / 100;
          const finalUnitCost = item.unit_cost + (allocatedLandedCost / item.quantity);
          const finalTotalCost = item.total_cost + allocatedLandedCost;

          return {
            ...item,
            allocation_percentage: allocationPercentage,
            allocated_landed_cost: allocatedLandedCost,
            final_unit_cost: finalUnitCost,
            final_total_cost: finalTotalCost
          };
        });

        return {
          ...record,
          total_landed_cost: totalLandedCost,
          landed_cost_percentage: landedCostPercentage,
          status: 'calculated' as const,
          items: updatedItems,
          last_modified: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    }));

    toast({
      title: "Success",
      description: "Landed cost calculated and allocated successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", text: "Draft" },
      calculated: { color: "bg-blue-100 text-blue-800", text: "Calculated" },
      allocated: { color: "bg-yellow-100 text-yellow-800", text: "Allocated" },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getShipmentMethodBadge = (method: string) => {
    const methodConfig = {
      sea: { color: "bg-blue-100 text-blue-800", icon: Ship, text: "Sea" },
      air: { color: "bg-purple-100 text-purple-800", icon: Plane, text: "Air" },
      road: { color: "bg-green-100 text-green-800", icon: Truck, text: "Road" },
      rail: { color: "bg-orange-100 text-orange-800", icon: Building2, text: "Rail" }
    };
    
    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.road;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Landed Cost Accounting - JusFinn</title>
        <meta name="description" content="Comprehensive landed cost calculation with multiple allocation methods" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Landed Cost Accounting
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive landed cost calculation with multiple allocation methods
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleAddLC}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New LC Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total LC Value</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.total_landed_cost)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg LC %</p>
                  <p className="text-2xl font-bold text-green-900">{stats.avg_lc_percentage.toFixed(1)}%</p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Percent className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">International</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.international_shipments}</p>
                </div>
                <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.pending_allocation}</p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">LC Records</TabsTrigger>
          <TabsTrigger value="allocation">Cost Allocation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Landed Cost Records
                  </CardTitle>
                  <CardDescription>
                    Manage shipment landed costs with comprehensive tracking
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by LC number, vendor, or PO..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
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
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="sea">Sea Freight</SelectItem>
                    <SelectItem value="air">Air Freight</SelectItem>
                    <SelectItem value="road">Road Transport</SelectItem>
                    <SelectItem value="rail">Rail Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* LC Records Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LC Details</TableHead>
                      <TableHead>Shipment Info</TableHead>
                      <TableHead>Financial Summary</TableHead>
                      <TableHead>Status & Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.lc_number}</p>
                            <p className="text-sm text-gray-500">{record.vendor_name}</p>
                            {record.po_number && (
                              <p className="text-sm text-blue-600">PO: {record.po_number}</p>
                            )}
                            {record.grn_number && (
                              <p className="text-sm text-green-600">GRN: {record.grn_number}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getShipmentMethodBadge(record.shipment_method)}
                            {record.port_of_origin && (
                              <p className="text-sm text-gray-600">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {record.port_of_origin}
                              </p>
                            )}
                            {record.port_of_destination && (
                              <p className="text-sm text-gray-600">
                                <ArrowRight className="w-3 h-3 inline mr-1" />
                                {record.port_of_destination}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(record.shipment_date).toLocaleDateString()} - {new Date(record.arrival_date).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Shipment: {formatCurrency(record.shipment_value)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total LC: {formatCurrency(record.total_landed_cost)}
                            </p>
                            <p className="text-sm text-purple-600">
                              LC %: {record.landed_cost_percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {record.components.length} cost components
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getStatusBadge(record.status)}
                            <Progress 
                              value={
                                record.status === 'draft' ? 25 :
                                record.status === 'calculated' ? 50 :
                                record.status === 'allocated' ? 75 : 100
                              } 
                              className="h-2" 
                            />
                            <p className="text-xs text-gray-500">
                              {record.items.length} items
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLC(record)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {(record.status === 'draft' || record.status === 'calculated') && record.components.length > 0 && (
                              <Button
                                size="sm"
                                onClick={() => handleCalculateLC(record.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Calculator className="w-4 h-4 mr-1" />
                                Calculate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocation Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Allocation Methods
                </CardTitle>
                <CardDescription>
                  Different methods for allocating landed costs to inventory items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocationMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <Card key={method.value} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold">{method.label}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {landedCostRecords.filter(r => 
                                r.components.some(c => c.allocation_method === method.value)
                              ).length} records
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cost Components */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Components
                </CardTitle>
                <CardDescription>
                  Breakdown of landed cost components with typical ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costTypes.map((costType) => {
                    const Icon = costType.icon;
                    const totalUsage = landedCostRecords.reduce((sum, record) => 
                      sum + record.components.filter(c => c.cost_type === costType.value).length, 0
                    );
                    
                    return (
                      <div key={costType.value} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-sm">{costType.label}</p>
                            <p className="text-xs text-gray-500">Typical: {costType.typical}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={costType.color}>
                            {totalUsage} uses
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Allocation Calculation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Sample Cost Allocation Calculation
              </CardTitle>
              <CardDescription>
                Example showing how landed costs are allocated across inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Shipment LC/2024/001 - Global Tech Suppliers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shipment Value:</span>
                        <span className="font-medium">₹50,00,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Freight Charges:</span>
                        <span>₹5,31,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customs Duty:</span>
                        <span>₹1,80,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>₹29,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Port Handling:</span>
                        <span>₹88,500</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-medium">
                        <span>Total Landed Cost:</span>
                        <span>₹57,50,000</span>
                      </div>
                      <div className="flex justify-between text-purple-600">
                        <span>LC Percentage:</span>
                        <span>15.0%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Item Allocation (By Value)</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Electronic Sensors (50%)</span>
                          <span>₹3,75,000</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ₹2,500 → ₹2,875 per unit
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Microcontrollers (50%)</span>
                          <span>₹3,75,000</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ₹5,000 → ₹5,750 per unit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Landed Cost Trends
                </CardTitle>
                <CardDescription>
                  Monthly landed cost patterns and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart representation */}
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end justify-between">
                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                      <div key={month} className="flex flex-col items-center">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ 
                            height: `${80 + index * 30}px`, 
                            width: '32px',
                            marginBottom: '8px'
                          }}
                        />
                        <span className="text-xs text-gray-600">{month}</span>
                        <span className="text-xs text-purple-600 font-medium">
                          {(8 + index * 2).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average LC Percentage by Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Component Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cost Component Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of cost components across all shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pie chart representation */}
                  <div className="h-40 w-40 mx-auto relative">
                    <div className="w-full h-full rounded-full border-8 border-blue-500 border-t-green-500 border-r-orange-500 border-b-purple-500 border-l-yellow-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatCurrency(750000)}</p>
                        <p className="text-xs text-gray-500">Total LC</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Component breakdown */}
                  <div className="space-y-2">
                    {[
                      { name: "Freight", amount: 450000, color: "bg-blue-500", percentage: 60 },
                      { name: "Customs Duty", amount: 180000, color: "bg-green-500", percentage: 24 },
                      { name: "Handling", amount: 75000, color: "bg-orange-500", percentage: 10 },
                      { name: "Insurance", amount: 25000, color: "bg-purple-500", percentage: 3.3 },
                      { name: "Others", amount: 20000, color: "bg-yellow-500", percentage: 2.7 }
                    ].map((component) => (
                      <div key={component.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${component.color}`} />
                          <span className="text-sm">{component.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(component.amount)}</p>
                          <p className="text-xs text-gray-500">{component.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipment Methods Analysis
                </CardTitle>
                <CardDescription>
                  Cost efficiency by shipment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipmentMethods.map((method) => {
                    const Icon = method.icon;
                    const methodRecords = landedCostRecords.filter(r => r.shipment_method === method.value);
                    const avgLCPercent = methodRecords.length > 0 
                      ? methodRecords.reduce((sum, r) => sum + r.landed_cost_percentage, 0) / methodRecords.length 
                      : 0;
                    
                    return (
                      <div key={method.value} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-sm">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{avgLCPercent.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">{methodRecords.length} shipments</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cost Optimization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Cost Optimization Insights
                </CardTitle>
                <CardDescription>
                  Opportunities for cost reduction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Optimization Achieved</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Consolidated shipments reduced average LC from 18% to 15%
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      Savings: {formatCurrency(stats.cost_savings)}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <p className="text-sm text-gray-700">
                          Consider sea freight for non-urgent shipments to reduce costs by 40-60%
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <p className="text-sm text-gray-700">
                          Consolidate multiple orders to achieve better freight rates
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <p className="text-sm text-gray-700">
                          Negotiate annual contracts with logistics providers for volume discounts
                        </p>
                      </div>
                    </div>
                  </div>
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
                Generate comprehensive reports for analysis and compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Calculator className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">LC Summary Report</div>
                    <div className="text-xs text-gray-500">Comprehensive cost breakdown</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <PieChart className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">Component Analysis</div>
                    <div className="text-xs text-gray-500">Cost component distribution</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Package className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">Inventory Valuation</div>
                    <div className="text-xs text-gray-500">True cost inventory report</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <TrendingUp className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">Cost Optimization</div>
                    <div className="text-xs text-gray-500">Savings opportunities</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Globe className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">International Trade</div>
                    <div className="text-xs text-gray-500">Import/Export analysis</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <Target className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-medium">Allocation Report</div>
                    <div className="text-xs text-gray-500">Method comparison</div>
                  </div>
                </Button>
              </div>
              
              {/* Report Filters */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">Report Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="last_month">Last Month</SelectItem>
                        <SelectItem value="this_quarter">This Quarter</SelectItem>
                        <SelectItem value="this_year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Shipment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All methods" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="sea">Sea Freight</SelectItem>
                        <SelectItem value="air">Air Freight</SelectItem>
                        <SelectItem value="road">Road Transport</SelectItem>
                        <SelectItem value="rail">Rail Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All vendors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vendors</SelectItem>
                        <SelectItem value="global_tech">Global Tech Suppliers</SelectItem>
                        <SelectItem value="european_machinery">European Machinery Corp</SelectItem>
                        <SelectItem value="domestic_steel">Domestic Steel Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Export Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="PDF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Export</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Landed Cost Form Dialog */}
      <Dialog open={showLCForm} onOpenChange={setShowLCForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLC ? 'Edit Landed Cost Record' : 'Create New Landed Cost Record'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <Label htmlFor="lc_number">LC Number *</Label>
                <Input
                  id="lc_number"
                  value={formData.lc_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, lc_number: e.target.value }))}
                  placeholder="LC/2024/001"
                />
              </div>
              
              <div>
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))}
                  placeholder="Vendor Name"
                />
              </div>
              
              <div>
                <Label htmlFor="po_number">Purchase Order</Label>
                <Input
                  id="po_number"
                  value={formData.po_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, po_number: e.target.value }))}
                  placeholder="PO/2024/001"
                />
              </div>
              
              <div>
                <Label htmlFor="grn_number">GRN Number</Label>
                <Input
                  id="grn_number"
                  value={formData.grn_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, grn_number: e.target.value }))}
                  placeholder="GRN/2024/001"
                />
              </div>
              
              <div>
                <Label htmlFor="shipment_value">Shipment Value *</Label>
                <Input
                  id="shipment_value"
                  type="number"
                  value={formData.shipment_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, shipment_value: e.target.value }))}
                  placeholder="5000000"
                />
              </div>
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Shipment Details</h3>
              
              <div>
                <Label htmlFor="shipment_method">Shipment Method *</Label>
                <Select 
                  value={formData.shipment_method} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shipment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipmentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="port_of_origin">Port of Origin</Label>
                <Input
                  id="port_of_origin"
                  value={formData.port_of_origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, port_of_origin: e.target.value }))}
                  placeholder="Shanghai, China"
                />
              </div>
              
              <div>
                <Label htmlFor="port_of_destination">Port of Destination</Label>
                <Input
                  id="port_of_destination"
                  value={formData.port_of_destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, port_of_destination: e.target.value }))}
                  placeholder="JNPT, Mumbai"
                />
              </div>
              
              <div>
                <Label htmlFor="shipment_date">Shipment Date *</Label>
                <Input
                  id="shipment_date"
                  type="date"
                  value={formData.shipment_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, shipment_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="arrival_date">Arrival Date *</Label>
                <Input
                  id="arrival_date"
                  type="date"
                  value={formData.arrival_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, arrival_date: e.target.value }))}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-4 md:col-span-2">
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Additional notes about the shipment..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button variant="outline" onClick={() => setShowLCForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLC} className="bg-blue-600 hover:bg-blue-700">
              {editingLC ? 'Update Record' : 'Create Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default LandedCostAccounting; 