import React, { useState, useEffect, useCallback } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Building,
  Globe,
  Calendar,
  Download,
  Star,
  BarChart3,
  RefreshCw,
  Shield,
  IndianRupee,
  Building2,
  Landmark,
  FileText,
  Eye
} from 'lucide-react';
// Backend API Integration
import { VendorApiService, type Vendor as ApiVendor, type VendorCreateRequest } from '@/lib/vendor.api';

// Updated interfaces to match the new 37-column backend schema
interface Vendor {
  id: string;
  vendor_code: string;
  business_name: string;
  legal_name?: string;
  gstin?: string;
  pan?: string;
  
  // --- Critical Compliance Fields ---
  is_msme: boolean;
  udyam_registration_number?: string;
  
  // Contact Information
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // --- Payment & Terms ---
  credit_limit: number;
  credit_days: number;
  payment_terms: string;
  
  // --- Critical Banking Fields ---
  bank_account_number?: string;
  bank_ifsc_code?: string;
  bank_account_holder_name?: string;
  
  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_id?: number;
  pincode?: string;
  country?: string;
  
  // --- Critical Tax & Accounting Fields ---
  tds_applicable: boolean;
  default_tds_section?: string;
  default_expense_ledger_id?: string;
  
  // Business Metrics
  vendor_rating?: number;
  total_purchases: number;
  outstanding_amount: number;
  last_transaction_date?: string;
  
  // Status and Audit
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Form data interface that matches the VendorCreateRequest
interface VendorFormData {
  vendorCode: string;
  businessName: string;
  legalName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  panNumber: string;
  gstin: string;
  
  // --- Critical Compliance Fields ---
  isMsme: boolean;
  udyamRegistration: string;
  
  // --- Payment & Terms ---
  creditLimit: string;
  creditDays: string;
  paymentTerms: string;
  
  // --- Critical Banking Fields ---
  bankAccountNumber: string;
  bankIfscCode: string;
  bankAccountHolderName: string;
  
  // --- Critical Tax & Accounting Fields ---
  tdsApplicable: boolean;
  defaultTdsSection: string;
  defaultExpenseLedgerId: string;
  
  // Status
  isActive: boolean;
  notes: string;
}

interface VendorStats {
  total: number;
  active: number;
  msme: number;
  thisMonth: number;
  totalPurchaseValue: number;
  averageRating: number;
  complianceScore: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

const VendorMaster = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [msmeFilter, setMsmeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [stats, setStats] = useState<VendorStats>({
    total: 0,
    active: 0,
    msme: 0,
    thisMonth: 0,
    totalPurchaseValue: 0,
    averageRating: 0,
    complianceScore: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  });

  // Form state with all new schema fields
  const [formData, setFormData] = useState<VendorFormData>({
    vendorCode: '',
    businessName: '',
    legalName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    panNumber: '',
    gstin: '',
    
    // --- Critical Compliance Fields ---
    isMsme: false,
    udyamRegistration: '',
    
    // --- Payment & Terms ---
    creditLimit: '',
    creditDays: '30',
    paymentTerms: 'NET_30',
    
    // --- Critical Banking Fields ---
    bankAccountNumber: '',
    bankIfscCode: '',
    bankAccountHolderName: '',
    
    // --- Critical Tax & Accounting Fields ---
    tdsApplicable: false,
    defaultTdsSection: '',
    defaultExpenseLedgerId: '',
    
    // Status
    isActive: true,
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<VendorFormData>>({});

  // TDS Sections for Indian compliance
  const tdsSections = [
    { value: "194A", label: "194A - Interest other than on Securities", rate: "10%" },
    { value: "194C", label: "194C - Payments to Contractors", rate: "1-2%" },
    { value: "194G", label: "194G - Commission, Brokerage etc.", rate: "5%" },
    { value: "194H", label: "194H - Commission or Brokerage", rate: "5%" },
    { value: "194I", label: "194I - Rent", rate: "10%" },
    { value: "194J", label: "194J - Professional/Technical Services", rate: "10%" },
    { value: "194O", label: "194O - E-commerce Transactions", rate: "1%" },
    { value: "194Q", label: "194Q - Purchase of Goods", rate: "0.1%" }
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", 
    "Ladakh"
  ];

  const paymentTermsOptions = [
    { value: "IMMEDIATE", label: "Immediate Payment", days: 0 },
    { value: "NET_15", label: "Net 15 Days", days: 15 },
    { value: "NET_30", label: "Net 30 Days", days: 30 },
    { value: "NET_45", label: "Net 45 Days", days: 45 },
    { value: "NET_60", label: "Net 60 Days", days: 60 },
    { value: "NET_90", label: "Net 90 Days", days: 90 }
  ];

  // Validation functions
  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGSTIN = (gstin: string) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validateIFSC = (ifsc: string) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: Partial<VendorFormData> = {};

    if (!formData.vendorCode.trim()) {
      errors.vendorCode = 'Vendor code is required';
    }

    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    }

    if (formData.panNumber && !validatePAN(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    if (formData.gstin && !validateGSTIN(formData.gstin)) {
      errors.gstin = 'Invalid GSTIN format';
    }

    if (formData.bankIfscCode && !validateIFSC(formData.bankIfscCode)) {
      errors.bankIfscCode = 'Invalid IFSC format (e.g., SBIN0000123)';
    }

    if (formData.creditLimit && isNaN(parseFloat(formData.creditLimit))) {
      errors.creditLimit = 'Credit limit must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Data loading and management functions
  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const vendorData = await VendorApiService.getVendors();
      setVendors(vendorData);
      
      // Calculate stats
      const newStats: VendorStats = {
        total: vendorData.length,
        active: vendorData.filter(v => v.is_active).length,
        msme: vendorData.filter(v => v.is_msme).length,
        thisMonth: vendorData.filter(v => {
          const createdDate = new Date(v.created_at);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && 
                 createdDate.getFullYear() === now.getFullYear();
        }).length,
        totalPurchaseValue: vendorData.reduce((sum, v) => sum + v.total_purchases, 0),
        averageRating: vendorData.reduce((sum, v) => sum + (v.vendor_rating || 0), 0) / vendorData.length || 0,
        complianceScore: 85, // Mock compliance score
        riskDistribution: {
          low: Math.floor(vendorData.length * 0.6),
          medium: Math.floor(vendorData.length * 0.3),
          high: Math.floor(vendorData.length * 0.1)
        }
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter and search functions
  const applyFilters = useCallback(() => {
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(vendor => 
        statusFilter === "active" ? vendor.is_active : !vendor.is_active
      );
    }

    // MSME filter
    if (msmeFilter !== "all") {
      filtered = filtered.filter(vendor => 
        msmeFilter === "registered" ? vendor.is_msme : !vendor.is_msme
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(vendor => (vendor.vendor_rating || 0) >= minRating);
    }

    setFilteredVendors(filtered);
  }, [vendors, searchTerm, statusFilter, msmeFilter, ratingFilter]);

  // Form management functions
  const resetForm = () => {
    setFormData({
      vendorCode: '',
      businessName: '',
      legalName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      panNumber: '',
      gstin: '',
      isMsme: false,
      udyamRegistration: '',
      creditLimit: '',
      creditDays: '30',
      paymentTerms: 'NET_30',
      bankAccountNumber: '',
      bankIfscCode: '',
      bankAccountHolderName: '',
      tdsApplicable: false,
      defaultTdsSection: '',
      defaultExpenseLedgerId: '',
      isActive: true,
      notes: ''
    });
    setFormErrors({});
  };

  const handleCreateVendor = () => {
    resetForm();
    setEditingVendor(null);
    // Generate vendor code
    const nextCode = `VEN${String(vendors.length + 1).padStart(3, '0')}`;
    setFormData(prev => ({ ...prev, vendorCode: nextCode }));
    setShowVendorForm(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setFormData({
      vendorCode: vendor.vendor_code,
      businessName: vendor.business_name,
      legalName: vendor.legal_name || '',
      contactPerson: vendor.contact_person || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      website: vendor.website || '',
      addressLine1: vendor.address_line1 || '',
      addressLine2: vendor.address_line2 || '',
      city: vendor.city || '',
      state: getStateName(vendor.state_id),
      pincode: vendor.pincode || '',
      country: vendor.country || 'India',
      panNumber: vendor.pan || '',
      gstin: vendor.gstin || '',
      isMsme: vendor.is_msme,
      udyamRegistration: vendor.udyam_registration_number || '',
      creditLimit: vendor.credit_limit?.toString() || '',
      creditDays: vendor.credit_days?.toString() || '30',
      paymentTerms: vendor.payment_terms || 'NET_30',
      bankAccountNumber: vendor.bank_account_number || '',
      bankIfscCode: vendor.bank_ifsc_code || '',
      bankAccountHolderName: vendor.bank_account_holder_name || '',
      tdsApplicable: vendor.tds_applicable,
      defaultTdsSection: vendor.default_tds_section || '',
      defaultExpenseLedgerId: vendor.default_expense_ledger_id || '',
      isActive: vendor.is_active,
      notes: ''
    });
    setEditingVendor(vendor);
    setFormErrors({});
    setShowVendorForm(true);
  };

  const handleSubmitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Prepare vendor data for backend API - matching VendorCreateRequest schema
      const vendorApiData: VendorCreateRequest = {
        vendor_code: formData.vendorCode,
        business_name: formData.businessName,
        legal_name: formData.legalName || null,
        gstin: formData.gstin || null,
        pan: formData.panNumber || null,
        
        // --- Critical Compliance Fields ---
        is_msme: formData.isMsme,
        udyam_registration_number: formData.udyamRegistration || null,
        
        // Contact Information
        contact_person: formData.contactPerson || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        
        // --- Payment & Terms ---
        credit_limit: formData.creditLimit ? parseFloat(formData.creditLimit) : 0.0,
        credit_days: parseInt(formData.creditDays) || 30,
        payment_terms: formData.paymentTerms,
        
        // --- Critical Banking Fields ---
        bank_account_number: formData.bankAccountNumber || null,
        bank_ifsc_code: formData.bankIfscCode || null,
        bank_account_holder_name: formData.bankAccountHolderName || null,
        
        // Address
        address: {
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2 || null,
          city: formData.city,
          state_id: getStateId(formData.state),
          pincode: formData.pincode,
          country: formData.country
        },
        
        // --- Critical Tax & Accounting Fields ---
        tds_applicable: formData.tdsApplicable,
        default_tds_section: formData.defaultTdsSection || null,
        default_expense_ledger_id: formData.defaultExpenseLedgerId || null
      };

      console.log('Sending vendor data to backend:', vendorApiData);

      let savedVendor;
      if (editingVendor) {
        // Update existing vendor via backend API
        savedVendor = await VendorApiService.updateVendor(editingVendor.id, vendorApiData);
        toast({
          title: "Success",
          description: "Vendor updated successfully",
        });
      } else {
        // Create new vendor via backend API
        savedVendor = await VendorApiService.createVendor(vendorApiData);
        toast({
          title: "Success",
          description: "Vendor created successfully",
        });
      }

      // Reload vendors from backend to ensure UI is in sync
      await loadVendors();
      
      setShowVendorForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Error",
        description: `Failed to save vendor: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to convert state name to state ID (simplified mapping)
  const getStateId = (stateName: string): number => {
    const stateMap: Record<string, number> = {
      'Andhra Pradesh': 1, 'Arunachal Pradesh': 2, 'Assam': 3, 'Bihar': 4, 'Chhattisgarh': 5,
      'Goa': 6, 'Gujarat': 7, 'Haryana': 8, 'Himachal Pradesh': 9, 'Jharkhand': 10,
      'Karnataka': 11, 'Kerala': 12, 'Madhya Pradesh': 13, 'Maharashtra': 14, 'Manipur': 15,
      'Meghalaya': 16, 'Mizoram': 17, 'Nagaland': 18, 'Odisha': 19, 'Punjab': 20,
      'Rajasthan': 21, 'Sikkim': 22, 'Tamil Nadu': 23, 'Telangana': 24, 'Tripura': 25,
      'Uttar Pradesh': 26, 'Uttarakhand': 27, 'West Bengal': 28, 'Delhi': 29, 
      'Jammu and Kashmir': 30, 'Ladakh': 31
    };
    return stateMap[stateName] || 8; // Default to Haryana if not found
  };

  // Helper function to convert state ID to state name
  const getStateName = (stateId?: number): string => {
    const stateArray = [
      '', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 
      'Jammu and Kashmir', 'Ladakh'
    ];
    return stateArray[stateId || 0] || 'Haryana';
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await VendorApiService.deleteVendor(vendorId);
      await loadVendors();
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: `Failed to delete vendor: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Effects
  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Vendor Master - JusFinn</title>
        <meta name="description" content="Comprehensive vendor management with compliance tracking" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Master
            </h1>
            <p className="text-gray-600 mt-1">
              Complete vendor lifecycle management with compliance tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("analytics")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              onClick={handleCreateVendor}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Vendors</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats.active} active
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">MSME Vendors</p>
                  <p className="text-2xl font-bold text-green-900">{stats.msme}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.total > 0 ? ((stats.msme / stats.total) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Purchase Value</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {formatCurrency(stats.totalPurchaseValue)}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    This financial year
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(stats.averageRating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Vendor List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search Vendors</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by name, code, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="msme-filter">MSME Status</Label>
                    <Select value={msmeFilter} onValueChange={setMsmeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All MSME</SelectItem>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="not_registered">Not Registered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating-filter">Min Rating</Label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                        <SelectItem value="1">1+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadVendors}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Checkbox
                              checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedVendors(filteredVendors.map(v => v.id));
                                } else {
                                  setSelectedVendors([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Vendor Code</TableHead>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Contact Person</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>MSME</TableHead>
                          <TableHead>TDS</TableHead>
                          <TableHead>Credit Limit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedVendors.includes(vendor.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedVendors(prev => [...prev, vendor.id]);
                                  } else {
                                    setSelectedVendors(prev => prev.filter(id => id !== vendor.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{vendor.vendor_code}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{vendor.business_name}</div>
                              {vendor.legal_name && vendor.legal_name !== vendor.business_name && (
                                <div className="text-sm text-gray-500">{vendor.legal_name}</div>
                              )}
                            </TableCell>
                            <TableCell>{vendor.contact_person || '-'}</TableCell>
                            <TableCell>
                              {vendor.email ? (
                                <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                                  {vendor.email}
                                </a>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              {vendor.phone ? (
                                <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline">
                                  {vendor.phone}
                                </a>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={vendor.is_msme ? "default" : "secondary"}>
                                {vendor.is_msme ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={vendor.tds_applicable ? "default" : "secondary"}>
                                {vendor.tds_applicable ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(vendor.credit_limit)}</TableCell>
                            <TableCell>
                              <Badge variant={vendor.is_active ? "default" : "secondary"}>
                                {vendor.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditVendor(vendor)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVendor(vendor);
                                    setShowVendorDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {vendor.business_name}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteVendor(vendor.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Analytics</CardTitle>
                <CardDescription>Comprehensive vendor performance and compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>Monitor vendor compliance with regulatory requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Compliance dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Vendor Form Dialog */}
      <Dialog open={showVendorForm} onOpenChange={setShowVendorForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
            </DialogTitle>
            <DialogDescription>
              Enter vendor information including banking and compliance details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitVendor} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendorCode">Vendor Code *</Label>
                    <Input
                      id="vendorCode"
                      value={formData.vendorCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendorCode: e.target.value }))}
                      placeholder="VEN001"
                      className={formErrors.vendorCode ? "border-red-500" : ""}
                    />
                    {formErrors.vendorCode && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.vendorCode}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="ABC Enterprises"
                      className={formErrors.businessName ? "border-red-500" : ""}
                    />
                    {formErrors.businessName && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.businessName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="legalName">Legal Name</Label>
                    <Input
                      id="legalName"
                      value={formData.legalName}
                      onChange={(e) => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                      placeholder="ABC Enterprises Private Limited"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="John Doe"
                      className={formErrors.contactPerson ? "border-red-500" : ""}
                    />
                    {formErrors.contactPerson && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@abc.com"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.abc.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label>Active Vendor</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                      placeholder="123 Main Street"
                      className={formErrors.addressLine1 ? "border-red-500" : ""}
                    />
                    {formErrors.addressLine1 && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.addressLine1}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                      placeholder="Near XYZ Building"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Mumbai"
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger className={formErrors.state ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.state && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="400001"
                      className={formErrors.pincode ? "border-red-500" : ""}
                    />
                    {formErrors.pincode && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="India"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="banking" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Landmark className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Banking Information</h3>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                    <Input
                      id="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                      placeholder="123456789012"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bankIfscCode">IFSC Code</Label>
                    <Input
                      id="bankIfscCode"
                      value={formData.bankIfscCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankIfscCode: e.target.value.toUpperCase() }))}
                      placeholder="SBIN0000123"
                      className={formErrors.bankIfscCode ? "border-red-500" : ""}
                    />
                    {formErrors.bankIfscCode && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.bankIfscCode}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bankAccountHolderName">Account Holder Name</Label>
                    <Input
                      id="bankAccountHolderName"
                      value={formData.bankAccountHolderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccountHolderName: e.target.value }))}
                      placeholder="ABC Enterprises Private Limited"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Separator className="my-4" />
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Payment Terms</h3>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                    <Input
                      id="creditLimit"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
                      placeholder="100000"
                      type="number"
                      min="0"
                      className={formErrors.creditLimit ? "border-red-500" : ""}
                    />
                    {formErrors.creditLimit && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.creditLimit}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select 
                      value={formData.paymentTerms} 
                      onValueChange={(value) => {
                        const selectedTerm = paymentTermsOptions.find(term => term.value === value);
                        setFormData(prev => ({ 
                          ...prev, 
                          paymentTerms: value,
                          creditDays: selectedTerm?.days.toString() || '30'
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTermsOptions.map((term) => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Compliance Information</h3>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                      placeholder="ABCDE1234F"
                      className={formErrors.panNumber ? "border-red-500" : ""}
                    />
                    {formErrors.panNumber && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.panNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                      placeholder="27ABCDE1234F1Z5"
                      className={formErrors.gstin ? "border-red-500" : ""}
                    />
                    {formErrors.gstin && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.gstin}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isMsme}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMsme: checked }))}
                    />
                    <Label>MSME Registered</Label>
                  </div>

                  {formData.isMsme && (
                    <div>
                      <Label htmlFor="udyamRegistration">Udyam Registration Number</Label>
                      <Input
                        id="udyamRegistration"
                        value={formData.udyamRegistration}
                        onChange={(e) => setFormData(prev => ({ ...prev, udyamRegistration: e.target.value }))}
                        placeholder="UDYAM-XX-00-0000000"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <Separator className="my-4" />
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">Tax & Accounting</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.tdsApplicable}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tdsApplicable: checked }))}
                    />
                    <Label>TDS Applicable</Label>
                  </div>

                  {formData.tdsApplicable && (
                    <div>
                      <Label htmlFor="defaultTdsSection">Default TDS Section</Label>
                      <Select 
                        value={formData.defaultTdsSection} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, defaultTdsSection: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select TDS Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {tdsSections.map((section) => (
                            <SelectItem key={section.value} value={section.value}>
                              {section.label} ({section.rate})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="defaultExpenseLedgerId">Default Expense Ledger ID</Label>
                    <Input
                      id="defaultExpenseLedgerId"
                      value={formData.defaultExpenseLedgerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultExpenseLedgerId: e.target.value }))}
                      placeholder="EXP001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about the vendor..."
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVendorForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {editingVendor ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingVendor ? 'Update Vendor' : 'Create Vendor'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vendor Details Dialog */}
      <Dialog open={showVendorDetails} onOpenChange={setShowVendorDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedVendor?.business_name}
            </DialogTitle>
            <DialogDescription>
              Complete vendor profile and details
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Vendor Code</Label>
                      <p className="font-medium">{selectedVendor.vendor_code}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Legal Name</Label>
                      <p className="font-medium">{selectedVendor.legal_name || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Contact Person</Label>
                      <p className="font-medium">{selectedVendor.contact_person || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Website</Label>
                      <p className="font-medium">{selectedVendor.website || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Contact Information</Label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedVendor.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedVendor.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {selectedVendor.address_line1 && selectedVendor.city ? 
                            `${selectedVendor.address_line1}, ${selectedVendor.city}, ${getStateName(selectedVendor.state_id)} - ${selectedVendor.pincode}` : 
                            'Address not available'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">PAN Number</Label>
                      <p className="font-medium">{selectedVendor.pan || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">GSTIN</Label>
                      <p className="font-medium">{selectedVendor.gstin || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">MSME Status</Label>
                      <Badge variant={selectedVendor.is_msme ? "default" : "secondary"}>
                        {selectedVendor.is_msme ? "MSME Registered" : "Not MSME"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Udyam Registration</Label>
                      <p className="font-medium">{selectedVendor.udyam_registration_number || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Credit Limit</Label>
                      <p className="font-medium">{formatCurrency(selectedVendor.credit_limit)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Payment Terms</Label>
                      <p className="font-medium">{selectedVendor.payment_terms} ({selectedVendor.credit_days} days)</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Total Purchases</Label>
                      <p className="font-medium">{formatCurrency(selectedVendor.total_purchases)}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Outstanding Amount</Label>
                      <p className="font-medium">{formatCurrency(selectedVendor.outstanding_amount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banking Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Banking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Account Number</Label>
                      <p className="font-medium">{selectedVendor.bank_account_number || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">IFSC Code</Label>
                      <p className="font-medium">{selectedVendor.bank_ifsc_code || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-gray-500">Account Holder Name</Label>
                      <p className="font-medium">{selectedVendor.bank_account_holder_name || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">TDS Applicable</Label>
                      <Badge variant={selectedVendor.tds_applicable ? "default" : "secondary"}>
                        {selectedVendor.tds_applicable ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Default TDS Section</Label>
                      <p className="font-medium">{selectedVendor.default_tds_section || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Default Expense Ledger</Label>
                      <p className="font-medium">{selectedVendor.default_expense_ledger_id || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Vendor Rating</Label>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{selectedVendor.vendor_rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowVendorDetails(false);
                    handleEditVendor(selectedVendor);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Vendor
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowVendorDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorMaster;