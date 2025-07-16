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
  UserCheck, 
  Building2, 
  Plus, 
  TrendingUp,
  Shield,
  Star,
  Activity,
  UserX,
  AlertCircle,
  Crown,
  Briefcase,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  HandCoins,
  FileText,
  Calendar,
  IndianRupee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  id: string;
  vendor_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pan_number: string;
  gstin?: string;
  msme_status: 'registered' | 'not_registered' | 'pending';
  udyam_registration?: string;
  tds_section: string;
  vendor_type: 'supplier' | 'service_provider' | 'contractor' | 'freelancer';
  payment_terms: number; // days
  credit_limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const VendorMaster = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("vendors");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    msme: 0,
    this_month: 0
  });

  // TDS Sections for Indian compliance
  const tdsSections = [
    { value: "194A", label: "194A - Interest other than on Securities" },
    { value: "194B", label: "194B - Winnings from Lottery/Crossword Puzzle" },
    { value: "194C", label: "194C - Payments to Contractors" },
    { value: "194E", label: "194E - Payments to Non-Resident Sportsmen" },
    { value: "194F", label: "194F - Payments on account of repurchase" },
    { value: "194G", label: "194G - Commission, Brokerage etc." },
    { value: "194H", label: "194H - Commission or Brokerage" },
    { value: "194I", label: "194I - Rent" },
    { value: "194J", label: "194J - Professional/Technical Services" },
    { value: "194K", label: "194K - Income from Units" },
    { value: "194LA", label: "194LA - Compensation for Compulsory Land Acquisition" },
    { value: "194M", label: "194M - Payments to Contractors/Sub-contractors" },
    { value: "194N", label: "194N - Cash Withdrawal" },
    { value: "194O", label: "194O - E-commerce Transactions" },
    { value: "194Q", label: "194Q - Purchase of Goods" },
    { value: "194S", label: "194S - Crypto Currency" }
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", 
    "Ladakh", "Lakshadweep", "Puducherry", "Andaman and Nicobar Islands", "Chandigarh", 
    "Dadra and Nagar Haveli and Daman and Diu"
  ];

  // Mock data - In real app, this would come from API
  useEffect(() => {
    loadVendors();
    loadStats();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    // Mock data
    const mockVendors: Vendor[] = [
      {
        id: "1",
        vendor_name: "ABC Suppliers Pvt Ltd",
        contact_person: "Rajesh Kumar",
        email: "rajesh@abcsuppliers.com",
        phone: "+91 9876543210",
        address: "123 Industrial Area, Sector 18",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122015",
        pan_number: "ABCPD1234E",
        gstin: "06ABCPD1234E1Z5",
        msme_status: "registered",
        udyam_registration: "UDYAM-HR-03-0012345",
        tds_section: "194C",
        vendor_type: "supplier",
        payment_terms: 30,
        credit_limit: 500000,
        is_active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15"
      },
      {
        id: "2",
        vendor_name: "XYZ Consultants",
        contact_person: "Priya Sharma",
        email: "priya@xyzconsultants.com",
        phone: "+91 9123456789",
        address: "45 Commercial Complex, CP",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        pan_number: "XYZPD5678F",
        gstin: "07XYZPD5678F1Z8",
        msme_status: "not_registered",
        tds_section: "194J",
        vendor_type: "service_provider",
        payment_terms: 15,
        is_active: true,
        created_at: "2024-02-01",
        updated_at: "2024-02-01"
      }
    ];
    setVendors(mockVendors);
    setLoading(false);
  };

  const loadStats = async () => {
    // Mock stats
    setStats({
      total: 45,
      active: 42,
      msme: 18,
      this_month: 7
    });
  };

  const handleCreateVendor = () => {
    setEditingVendor(null);
    setShowVendorForm(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowVendorForm(true);
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
    toast({
      title: "✅ Success",
      description: "Vendor deleted successfully.",
    });
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.pan_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Vendor Master - JusFinn AI</title>
        <meta name="description" content="Manage your vendor database with complete Indian compliance features including PAN, GSTIN, MSME status, and TDS sections." />
        <meta name="keywords" content="vendor management, supplier management, MSME compliance, TDS sections, PAN validation, GSTIN, vendor master" />
        <meta property="og:title" content="Vendor Master - JusFinn AI" />
        <meta property="og:description" content="Comprehensive vendor management with Indian compliance features." />
        <link rel="canonical" href="https://your-domain.com/vendor-master" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Master</h1>
          <p className="text-gray-600 mt-2">
            Manage vendors with complete Indian compliance including MSME, TDS, and GST requirements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateVendor}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total registered vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active vendors
            </p>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MSME Vendors</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.msme}</div>
            <p className="text-xs text-muted-foreground">
              MSME registered vendors
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
              New vendors added
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendors">All Vendors</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors by name, PAN, or contact person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Vendor Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="service_provider">Service Provider</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="MSME Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="registered">MSME Registered</SelectItem>
                      <SelectItem value="not_registered">Not Registered</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendors List */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>
                Complete vendor database with compliance tracking
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
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{vendor.vendor_name}</h3>
                            <Badge variant={vendor.is_active ? "default" : "secondary"}>
                              {vendor.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge 
                              variant={vendor.msme_status === "registered" ? "default" : "outline"}
                              className={vendor.msme_status === "registered" ? "bg-green-100 text-green-800" : ""}
                            >
                              {vendor.msme_status === "registered" ? "MSME" : "Non-MSME"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                <span>{vendor.contact_person}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{vendor.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{vendor.phone}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span>PAN: {vendor.pan_number}</span>
                              </div>
                              {vendor.gstin && (
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  <span>GSTIN: {vendor.gstin}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <HandCoins className="w-4 h-4" />
                                <span>TDS: {vendor.tds_section}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{vendor.city}, {vendor.state}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Payment: {vendor.payment_terms} days</span>
                              </div>
                              {vendor.credit_limit && (
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="w-4 h-4" />
                                  <span>Credit: ₹{vendor.credit_limit.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVendor(vendor.id)}
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

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  MSME Compliance
                </CardTitle>
                <CardDescription>
                  Track MSME vendor compliance and payment terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">MSME compliance dashboard coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">45-day payment rule tracking</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HandCoins className="w-5 h-5" />
                  TDS Compliance
                </CardTitle>
                <CardDescription>
                  Monitor TDS section assignments and rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HandCoins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">TDS compliance tracking coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Auto-calculation and validation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Vendor Growth
                </CardTitle>
                <CardDescription>
                  Track vendor registration and activation trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Payment Analytics
                </CardTitle>
                <CardDescription>
                  Monitor payment patterns and outstanding amounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <IndianRupee className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Payment analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Vendor Management Settings
              </CardTitle>
              <CardDescription>
                Configure vendor management preferences and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Default TDS sections, payment terms, approval workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Form Dialog */}
      <VendorFormDialog 
        open={showVendorForm}
        onOpenChange={setShowVendorForm}
        vendor={editingVendor}
        tdsSections={tdsSections}
        indianStates={indianStates}
        onSuccess={() => {
          setShowVendorForm(false);
          setEditingVendor(null);
          loadVendors();
          toast({
            title: "✅ Success",
            description: `Vendor ${editingVendor ? 'updated' : 'created'} successfully.`,
          });
        }}
        onCancel={() => {
          setShowVendorForm(false);
          setEditingVendor(null);
        }}
      />
    </div>
  );
};

// Vendor Form Dialog Component
interface VendorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor | null;
  tdsSections: Array<{ value: string; label: string }>;
  indianStates: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const VendorFormDialog = ({ 
  open, 
  onOpenChange, 
  vendor, 
  tdsSections, 
  indianStates, 
  onSuccess, 
  onCancel 
}: VendorFormDialogProps) => {
  const [formData, setFormData] = useState({
    vendor_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pan_number: "",
    gstin: "",
    msme_status: "not_registered" as const,
    udyam_registration: "",
    tds_section: "",
    vendor_type: "supplier" as const,
    payment_terms: 30,
    credit_limit: "",
    is_active: true
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_name: vendor.vendor_name,
        contact_person: vendor.contact_person,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode,
        pan_number: vendor.pan_number,
        gstin: vendor.gstin || "",
        msme_status: vendor.msme_status,
        udyam_registration: vendor.udyam_registration || "",
        tds_section: vendor.tds_section,
        vendor_type: vendor.vendor_type,
        payment_terms: vendor.payment_terms,
        credit_limit: vendor.credit_limit?.toString() || "",
        is_active: vendor.is_active
      });
    } else {
      // Reset form for new vendor
      setFormData({
        vendor_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        pan_number: "",
        gstin: "",
        msme_status: "not_registered",
        udyam_registration: "",
        tds_section: "",
        vendor_type: "supplier",
        payment_terms: 30,
        credit_limit: "",
        is_active: true
      });
    }
  }, [vendor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would make API call
    onSuccess();
  };

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGSTIN = (gstin: string) => {
    if (!gstin) return true; // Optional field
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_name">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData({...formData, vendor_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tax & Compliance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Tax & Compliance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pan_number">PAN Number *</Label>
                <Input
                  id="pan_number"
                  value={formData.pan_number}
                  onChange={(e) => setFormData({...formData, pan_number: e.target.value.toUpperCase()})}
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  placeholder="ABCPD1234E"
                  required
                />
                {formData.pan_number && !validatePAN(formData.pan_number) && (
                  <p className="text-sm text-red-600">Invalid PAN format</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  value={formData.gstin}
                  onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
                  pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}"
                  placeholder="06ABCPD1234E1Z5"
                />
                {formData.gstin && !validateGSTIN(formData.gstin) && (
                  <p className="text-sm text-red-600">Invalid GSTIN format</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="msme_status">MSME Status</Label>
                <Select value={formData.msme_status} onValueChange={(value: any) => setFormData({...formData, msme_status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_registered">Not Registered</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="udyam_registration">Udyam Registration</Label>
                <Input
                  id="udyam_registration"
                  value={formData.udyam_registration}
                  onChange={(e) => setFormData({...formData, udyam_registration: e.target.value})}
                  placeholder="UDYAM-HR-03-0012345"
                  disabled={formData.msme_status !== "registered"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tds_section">TDS Section *</Label>
                <Select value={formData.tds_section} onValueChange={(value) => setFormData({...formData, tds_section: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select TDS Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {tdsSections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor_type">Vendor Type *</Label>
                <Select value={formData.vendor_type} onValueChange={(value: any) => setFormData({...formData, vendor_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Payment Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_terms">Payment Terms (Days) *</Label>
                <Input
                  id="payment_terms"
                  type="number"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({...formData, payment_terms: parseInt(e.target.value) || 0})}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_limit">Credit Limit (₹)</Label>
                <Input
                  id="credit_limit"
                  type="number"
                  value={formData.credit_limit}
                  onChange={(e) => setFormData({...formData, credit_limit: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Vendor</Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {vendor ? 'Update Vendor' : 'Create Vendor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorMaster; 