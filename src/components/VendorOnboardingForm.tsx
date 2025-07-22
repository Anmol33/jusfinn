import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, CreditCard, MapPin, FileText, Shield, Banknote } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VendorOnboardingFormProps {
  onSubmit?: (data: VendorFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<VendorFormData>;
}

interface VendorFormData {
  // Basic Information
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
  address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state_id: number;
    pincode: string;
    country: string;
  };
  
  // --- Critical Tax & Accounting Fields ---
  tds_applicable: boolean;
  default_tds_section?: string;
  default_expense_ledger_id?: string;
}

const PAYMENT_TERMS_OPTIONS = [
  { value: 'IMMEDIATE', label: 'Immediate' },
  { value: 'NET_15', label: 'Net 15 Days' },
  { value: 'NET_30', label: 'Net 30 Days' },
  { value: 'NET_45', label: 'Net 45 Days' },
  { value: 'NET_60', label: 'Net 60 Days' },
  { value: 'NET_90', label: 'Net 90 Days' }
];

const TDS_SECTIONS = [
  { value: '194A', label: '194A - Interest' },
  { value: '194C', label: '194C - Contractors' },
  { value: '194H', label: '194H - Commission/Brokerage' },
  { value: '194I', label: '194I - Rent' },
  { value: '194J', label: '194J - Professional Services' },
  { value: '194O', label: '194O - E-commerce' }
];

// Mock states data - in real app, this would come from API
const INDIAN_STATES = [
  { id: 1, name: 'Maharashtra', code: 'MH' },
  { id: 2, name: 'Karnataka', code: 'KA' },
  { id: 3, name: 'Gujarat', code: 'GJ' },
  { id: 4, name: 'Tamil Nadu', code: 'TN' },
  { id: 5, name: 'Delhi', code: 'DL' }
];

export default function VendorOnboardingForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: VendorOnboardingFormProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    vendor_code: '',
    business_name: '',
    legal_name: '',
    gstin: '',
    pan: '',
    is_msme: false,
    udyam_registration_number: '',
    contact_person: '',
    phone: '',
    email: '',
    website: '',
    credit_limit: 0,
    credit_days: 30,
    payment_terms: 'NET_30',
    bank_account_number: '',
    bank_ifsc_code: '',
    bank_account_holder_name: '',
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      state_id: 1,
      pincode: '',
      country: 'India'
    },
    tds_applicable: true,
    default_tds_section: '194J',
    default_expense_ledger_id: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.vendor_code.trim()) newErrors.vendor_code = 'Vendor code is required';
    if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
    if (!formData.address.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!formData.address.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.pincode.trim()) newErrors.pincode = 'Pincode is required';

    // PAN validation (if provided)
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCPD1234E)';
    }

    // GSTIN validation (if provided)
    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format';
    }

    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // IFSC validation (if provided)
    if (formData.bank_ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc_code)) {
      newErrors.bank_ifsc_code = 'Invalid IFSC code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    onSubmit?.(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAddress = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Vendor Onboarding
          </CardTitle>
          <CardDescription>
            Complete vendor registration with compliance and banking details
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="tax">Tax & Accounting</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vendor_code">Vendor Code *</Label>
                    <Input
                      id="vendor_code"
                      value={formData.vendor_code}
                      onChange={(e) => updateFormData('vendor_code', e.target.value)}
                      placeholder="VEN001"
                      className={errors.vendor_code ? 'border-red-500' : ''}
                    />
                    {errors.vendor_code && <p className="text-red-500 text-sm">{errors.vendor_code}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => updateFormData('business_name', e.target.value)}
                      placeholder="ABC Private Limited"
                      className={errors.business_name ? 'border-red-500' : ''}
                    />
                    {errors.business_name && <p className="text-red-500 text-sm">{errors.business_name}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="legal_name">Legal Name</Label>
                    <Input
                      id="legal_name"
                      value={formData.legal_name || ''}
                      onChange={(e) => updateFormData('legal_name', e.target.value)}
                      placeholder="Legal entity name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      value={formData.pan || ''}
                      onChange={(e) => updateFormData('pan', e.target.value.toUpperCase())}
                      placeholder="ABCPD1234E"
                      maxLength={10}
                      className={errors.pan ? 'border-red-500' : ''}
                    />
                    {errors.pan && <p className="text-red-500 text-sm">{errors.pan}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person || ''}
                      onChange={(e) => updateFormData('contact_person', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="john@company.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <Separator />
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  <h3 className="font-semibold">Address Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="address_line1">Address Line 1 *</Label>
                    <Input
                      id="address_line1"
                      value={formData.address.address_line1}
                      onChange={(e) => updateAddress('address_line1', e.target.value)}
                      placeholder="Street address"
                      className={errors.address_line1 ? 'border-red-500' : ''}
                    />
                    {errors.address_line1 && <p className="text-red-500 text-sm">{errors.address_line1}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      value={formData.address.address_line2 || ''}
                      onChange={(e) => updateAddress('address_line2', e.target.value)}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                      placeholder="Mumbai"
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(value) => updateAddress('state_id', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.address.pincode}
                      onChange={(e) => updateAddress('pincode', e.target.value)}
                      placeholder="400001"
                      maxLength={6}
                      className={errors.pincode ? 'border-red-500' : ''}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4" />
                  <h3 className="font-semibold">Compliance Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin || ''}
                      onChange={(e) => updateFormData('gstin', e.target.value.toUpperCase())}
                      placeholder="27ABCPD1234E1Z5"
                      maxLength={15}
                      className={errors.gstin ? 'border-red-500' : ''}
                    />
                    {errors.gstin && <p className="text-red-500 text-sm">{errors.gstin}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_msme"
                      checked={formData.is_msme}
                      onCheckedChange={(checked) => updateFormData('is_msme', checked)}
                    />
                    <Label htmlFor="is_msme" className="flex items-center gap-2">
                      <Badge variant={formData.is_msme ? 'default' : 'secondary'}>
                        {formData.is_msme ? 'MSME Registered' : 'Not MSME'}
                      </Badge>
                    </Label>
                  </div>
                </div>

                {formData.is_msme && (
                  <div>
                    <Label htmlFor="udyam_registration_number">Udyam Registration Number</Label>
                    <Input
                      id="udyam_registration_number"
                      value={formData.udyam_registration_number || ''}
                      onChange={(e) => updateFormData('udyam_registration_number', e.target.value)}
                      placeholder="UDYAM-MH-06-0123456"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credit_limit">Credit Limit (₹)</Label>
                    <Input
                      id="credit_limit"
                      type="number"
                      value={formData.credit_limit}
                      onChange={(e) => updateFormData('credit_limit', parseFloat(e.target.value) || 0)}
                      placeholder="100000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="credit_days">Credit Days</Label>
                    <Input
                      id="credit_days"
                      type="number"
                      value={formData.credit_days}
                      onChange={(e) => updateFormData('credit_days', parseInt(e.target.value) || 30)}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Select onValueChange={(value) => updateFormData('payment_terms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TERMS_OPTIONS.map((term) => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              {/* Banking Tab */}
              <TabsContent value="banking" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4" />
                  <h3 className="font-semibold">Banking Information</h3>
                </div>

                <div>
                  <Label htmlFor="bank_account_holder_name">Account Holder Name</Label>
                  <Input
                    id="bank_account_holder_name"
                    value={formData.bank_account_holder_name || ''}
                    onChange={(e) => updateFormData('bank_account_holder_name', e.target.value)}
                    placeholder="ABC Private Limited"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_account_number">Bank Account Number</Label>
                    <Input
                      id="bank_account_number"
                      value={formData.bank_account_number || ''}
                      onChange={(e) => updateFormData('bank_account_number', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bank_ifsc_code">IFSC Code</Label>
                    <Input
                      id="bank_ifsc_code"
                      value={formData.bank_ifsc_code || ''}
                      onChange={(e) => updateFormData('bank_ifsc_code', e.target.value.toUpperCase())}
                      placeholder="SBIN0001234"
                      maxLength={11}
                      className={errors.bank_ifsc_code ? 'border-red-500' : ''}
                    />
                    {errors.bank_ifsc_code && <p className="text-red-500 text-sm">{errors.bank_ifsc_code}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* Tax & Accounting Tab */}
              <TabsContent value="tax" className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-semibold">Tax & Accounting</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="tds_applicable"
                    checked={formData.tds_applicable}
                    onCheckedChange={(checked) => updateFormData('tds_applicable', checked)}
                  />
                  <Label htmlFor="tds_applicable">TDS Applicable</Label>
                </div>

                {formData.tds_applicable && (
                  <div>
                    <Label htmlFor="default_tds_section">Default TDS Section</Label>
                    <Select onValueChange={(value) => updateFormData('default_tds_section', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TDS section" />
                      </SelectTrigger>
                      <SelectContent>
                        {TDS_SECTIONS.map((section) => (
                          <SelectItem key={section.value} value={section.value}>
                            {section.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="default_expense_ledger_id">Default Expense Ledger</Label>
                  <Input
                    id="default_expense_ledger_id"
                    value={formData.default_expense_ledger_id || ''}
                    onChange={(e) => updateFormData('default_expense_ledger_id', e.target.value)}
                    placeholder="Expense ledger ID"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {activeTab !== 'basic' && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const tabs = ['basic', 'compliance', 'banking', 'tax'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                  >
                    Previous
                  </Button>
                )}
                
                {activeTab !== 'tax' ? (
                  <Button 
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'compliance', 'banking', 'tax'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit">
                    Save Vendor
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}