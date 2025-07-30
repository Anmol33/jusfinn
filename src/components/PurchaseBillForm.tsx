import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, FileText, Calculator, Building2, Upload, Paperclip, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// API Services
import { PurchaseOrderApiService, PurchaseOrder } from '@/lib/purchaseOrder.api';
import { VendorApiService, Vendor } from '@/lib/vendor.api';
import { 
  PurchaseBillCreateRequest, 
  PurchaseBillItem, 
  PurchaseBillStatus,
  PurchaseBill 
} from '@/lib/purchaseBill.api';

// =====================================================
// INTERFACES
// =====================================================

interface BillFormData {
  po_id: string;
  bill_number: string;
  vendor_bill_number: string;  // Vendor's invoice number
  vendor_bill_date: string;    // Date on vendor invoice
  bill_date: string;
  due_date: string;
  items: PurchaseBillItem[];
  notes: string;
  attachments: string[];
  status: PurchaseBillStatus;
}

interface AttachmentFile {
  file: File;
  type: 'INVOICE' | 'SUPPORTING';
  preview?: string;
}

interface PurchaseBillFormProps {
  editingBill?: PurchaseBill | null;
  onSubmit: (billData: PurchaseBillCreateRequest) => Promise<void>;
  onCancel: () => void;
}

// =====================================================
// PURCHASE BILL FORM COMPONENT
// =====================================================

const PurchaseBillForm: React.FC<PurchaseBillFormProps> = ({
  editingBill,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  
  // State Management
  const [formData, setFormData] = useState<BillFormData>({
    po_id: '',
    bill_number: '',
    vendor_bill_number: '',
    vendor_bill_date: new Date().toISOString().split('T')[0],
    bill_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    items: [],
    notes: '',
    attachments: [],
    status: PurchaseBillStatus.DRAFT
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  
  // Attachment handling
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>([]);
  const [primaryInvoice, setPrimaryInvoice] = useState<File | null>(null);

  // =====================================================
  // ATTACHMENT HANDLING
  // =====================================================

  const handlePrimaryInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setPrimaryInvoice(file);
      
      // Auto-populate vendor bill number from filename if not set
      if (!formData.vendor_bill_number) {
        const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setFormData(prev => ({ ...prev, vendor_bill_number: filename }));
      }
      
      toast({
        title: "Invoice uploaded",
        description: `Uploaded ${file.name}`,
        variant: "default"
      });
    }
  };

  const handleSupportingDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return;
      }
      
      const newAttachment: AttachmentFile = {
        file,
        type: 'SUPPORTING'
      };
      
      setAttachmentFiles(prev => [...prev, newAttachment]);
    });
    
    toast({
      title: "Documents uploaded",
      description: `Added ${files.length} supporting document(s)`,
      variant: "default"
    });
  };

  const removeAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removePrimaryInvoice = () => {
    setPrimaryInvoice(null);
  };

  // =====================================================
  // BILL NUMBER GENERATION
  // =====================================================

  const generateBillNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    return `BILL-${year}-${timestamp}`;
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadInitialData();
    if (editingBill) {
      populateFormForEdit();
    } else {
      // Auto-generate bill number for new bills
      setFormData(prev => ({ ...prev, bill_number: generateBillNumber() }));
    }
  }, [editingBill]);

  const loadInitialData = async () => {
    try {
      const [poResponse, vendorResponse] = await Promise.all([
        PurchaseOrderApiService.getPurchaseOrders(),
        VendorApiService.getVendors()
      ]);
      
      // Filter approved POs that can have bills created
      const approvedPOs = poResponse.filter((po: PurchaseOrder) => 
        po.status === 'approved' || po.status === 'partially_received' || po.status === 'received'
      );
      
      setPurchaseOrders(approvedPOs);
      setVendors(vendorResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load purchase orders and vendors",
        variant: "destructive"
      });
    }
  };

  const populateFormForEdit = () => {
    if (!editingBill) return;
    
    setFormData({
      po_id: editingBill.po_id || '',
      bill_number: editingBill.bill_number,
      vendor_bill_number: '', // Will need to add this field to API response
      vendor_bill_date: editingBill.bill_date.split('T')[0],
      bill_date: editingBill.bill_date.split('T')[0],
      due_date: editingBill.due_date.split('T')[0],
      items: editingBill.items,
      notes: editingBill.notes || '',
      attachments: editingBill.attachments || [],
      status: editingBill.status
    });

    if (editingBill.po_id) {
      const po = purchaseOrders.find(p => p.id === editingBill.po_id);
      setSelectedPO(po || null);
    } else {
      setManualEntry(true);
    }
  };

  // =====================================================
  // PO SELECTION LOGIC
  // =====================================================

  const handlePOSelection = async (poId: string) => {
    if (!poId || poId === 'manual') {
      setManualEntry(true);
      setSelectedPO(null);
      setFormData(prev => ({ ...prev, po_id: '', items: [] }));
      return;
    }

    setManualEntry(false);
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    setSelectedPO(po);
    setFormData(prev => ({ ...prev, po_id: poId }));

    // Auto-populate items from PO
    try {
      setLoading(true);
      
      // Get detailed PO with items if not already loaded
      const poItems = po.items || [];
      if (!poItems.length) {
        // If PO doesn't have items loaded, fetch them
        // This would depend on your API structure
        console.log('PO items not loaded, may need separate API call');
      }

      const billItems: PurchaseBillItem[] = poItems.map(item => ({
        po_item_id: item.id,
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        hsn_code: item.hsn_code || '00000000', // Default HSN, should be updated
        cgst_rate: 9, // Default rates, should be configurable
        sgst_rate: 9,
        igst_rate: 0,
        taxable_amount: item.quantity * item.unit_price,
        cgst_amount: 0, // Will be calculated
        sgst_amount: 0, // Will be calculated
        igst_amount: 0, // Will be calculated
        total_price: 0, // Will be calculated
        notes: ''
      }));

      // Calculate taxes for each item
      const calculatedItems = billItems.map(calculateItemTax);
      
      setFormData(prev => ({ 
        ...prev, 
        items: calculatedItems,
        vendor_bill_number: `INV-${po.po_number || Date.now()}` // Suggest invoice number
      }));

      toast({
        title: "Success",
        description: `Auto-populated ${calculatedItems.length} items from PO ${po.po_number}`,
        variant: "default"
      });

    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to load PO items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TAX CALCULATIONS
  // =====================================================

  const calculateItemTax = (item: PurchaseBillItem): PurchaseBillItem => {
    const taxableAmount = item.quantity * item.unit_price;
    const cgstAmount = (taxableAmount * item.cgst_rate) / 100;
    const sgstAmount = (taxableAmount * item.sgst_rate) / 100;
    const igstAmount = (taxableAmount * item.igst_rate) / 100;
    const totalPrice = taxableAmount + cgstAmount + sgstAmount + igstAmount;

    return {
      ...item,
      taxable_amount: taxableAmount,
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      igst_amount: igstAmount,
      total_price: totalPrice
    };
  };

  const updateItemField = (index: number, field: keyof PurchaseBillItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate taxes if quantity, rate, or tax rates change
    if (['quantity', 'unit_price', 'cgst_rate', 'sgst_rate', 'igst_rate'].includes(field)) {
      updatedItems[index] = calculateItemTax(updatedItems[index]);
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addNewItem = () => {
    const newItem: PurchaseBillItem = {
      po_item_id: `manual-${Date.now()}`,
      item_description: '',
      quantity: 1,
      unit_price: 0,
      hsn_code: '',
      cgst_rate: 9,
      sgst_rate: 9,
      igst_rate: 0,
      taxable_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: 0,
      total_price: 0,
      notes: ''
    };

    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // =====================================================
  // FORM SUBMISSION
  // =====================================================

  const calculateTotals = () => {
    const totals = formData.items.reduce((acc, item) => ({
      taxableAmount: acc.taxableAmount + item.taxable_amount,
      totalCgst: acc.totalCgst + item.cgst_amount,
      totalSgst: acc.totalSgst + item.sgst_amount,
      totalIgst: acc.totalIgst + item.igst_amount,
      grandTotal: acc.grandTotal + item.total_price
    }), {
      taxableAmount: 0,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      grandTotal: 0
    });

    return totals;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!manualEntry && !formData.po_id) {
      errors.push("Please select a Purchase Order or enable manual entry");
    }
    
    if (!formData.bill_number.trim()) {
      errors.push("Internal bill number is required");
    }
    
    if (!formData.vendor_bill_number.trim()) {
      errors.push("Vendor invoice number is required");
    }
    
    if (!formData.vendor_bill_date) {
      errors.push("Vendor invoice date is required");
    }
    
    if (!formData.bill_date) {
      errors.push("Bill date is required");
    }
    
    if (!formData.due_date) {
      errors.push("Due date is required");
    }
    
    if (formData.items.length === 0) {
      errors.push("At least one item is required");
    }
    
    if (!primaryInvoice && !editingBill) {
      errors.push("Primary invoice attachment is required");
    }
    
    formData.items.forEach((item, index) => {
      if (!item.item_description.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (!item.hsn_code.trim()) {
        errors.push(`Item ${index + 1}: HSN code is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unit_price < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
    });
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Handle file uploads first (in real implementation, upload to cloud storage)
    const attachmentUrls: string[] = [];
    
    if (primaryInvoice) {
      // In real implementation: upload to S3/Azure/GCS and get URL
      attachmentUrls.push(`/uploads/invoices/${primaryInvoice.name}`);
    }
    
    attachmentFiles.forEach(attachment => {
      // In real implementation: upload to S3/Azure/GCS and get URL
      attachmentUrls.push(`/uploads/supporting/${attachment.file.name}`);
    });

    const billData: PurchaseBillCreateRequest = {
      po_id: formData.po_id,
      bill_number: formData.bill_number,
      bill_date: formData.bill_date,
      due_date: formData.due_date,
      items: formData.items,
      notes: formData.notes,
      attachments: attachmentUrls,
      status: formData.status
    };

    try {
      setLoading(true);
      await onSubmit(billData);
    } catch (error) {
      // Error handling done in parent component
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingBill ? 'Edit Purchase Bill' : 'Create Purchase Bill'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* PO Selection or Manual Entry Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="manual-entry"
              checked={manualEntry}
              onCheckedChange={setManualEntry}
            />
            <Label htmlFor="manual-entry">Manual Entry (without PO)</Label>
          </div>

          {/* Purchase Order Selection */}
          {!manualEntry && (
            <div className="space-y-2">
              <Label htmlFor="po-select">Purchase Order *</Label>
              <Select value={formData.po_id} onValueChange={handlePOSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Purchase Order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((po) => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.po_number} - {po.vendor_name} - ₹{po.total_amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPO && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Vendor: {selectedPO.vendor_name}</span>
                  </div>
                  <div>PO Amount: ₹{selectedPO.total_amount.toLocaleString()}</div>
                  <div>Status: {selectedPO.status}</div>
                </div>
              )}
            </div>
          )}

          {/* Bill Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bill-number">Internal Bill Number *</Label>
              <Input
                id="bill-number"
                value={formData.bill_number}
                onChange={(e) => setFormData(prev => ({ ...prev, bill_number: e.target.value }))}
                placeholder="Auto-generated"
                disabled={!editingBill} // Read-only for new bills
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Auto-generated for tracking</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-bill-number">Vendor Invoice Number *</Label>
              <Input
                id="vendor-bill-number"
                value={formData.vendor_bill_number}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_bill_number: e.target.value }))}
                placeholder="Enter vendor's invoice number"
              />
              <p className="text-xs text-gray-500">From vendor's invoice</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-bill-date">Vendor Invoice Date *</Label>
              <Input
                id="vendor-bill-date"
                type="date"
                value={formData.vendor_bill_date}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_bill_date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bill-date">Bill Processing Date *</Label>
              <Input
                id="bill-date"
                type="date"
                value={formData.bill_date}
                onChange={(e) => setFormData(prev => ({ ...prev, bill_date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date *</Label>
              <Input
                id="due-date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice & Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Invoice & Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Invoice Upload */}
          <div className="space-y-2">
            <Label htmlFor="primary-invoice">Primary Invoice * (PDF/Image)</Label>
            {primaryInvoice ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{primaryInvoice.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(primaryInvoice.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePrimaryInvoice}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="primary-invoice"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handlePrimaryInvoiceUpload}
                  className="hidden"
                />
                <label htmlFor="primary-invoice" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Supporting Documents */}
          <div className="space-y-2">
            <Label>Supporting Documents (Optional)</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('supporting-docs')?.click()}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supporting Document
            </Button>
            <input
              type="file"
              id="supporting-docs"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.csv"
              onChange={handleSupportingDocsUpload}
              className="hidden"
            />
          </div>

          {/* Attachment Preview */}
          {attachmentFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="space-y-2">
                {attachmentFiles.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{attachment.file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachment.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bill Items</span>
            <Button onClick={addNewItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {manualEntry ? 'Click "Add Item" to start adding items manually' : 'Select a Purchase Order to auto-populate items'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">Description *</TableHead>
                    <TableHead className="w-[100px]">HSN Code *</TableHead>
                    <TableHead className="w-[80px]">Qty *</TableHead>
                    <TableHead className="w-[100px]">Rate *</TableHead>
                    <TableHead className="w-[120px]">Taxable Amt</TableHead>
                    <TableHead className="w-[70px]">CGST %</TableHead>
                    <TableHead className="w-[70px]">SGST %</TableHead>
                    <TableHead className="w-[70px]">IGST %</TableHead>
                    <TableHead className="w-[120px]">Total</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.item_description}
                          onChange={(e) => updateItemField(index, 'item_description', e.target.value)}
                          placeholder="Item description"
                          className="min-w-[240px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.hsn_code}
                          onChange={(e) => updateItemField(index, 'hsn_code', e.target.value)}
                          placeholder="HSN Code"
                          className="w-[90px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItemField(index, 'quantity', Number(e.target.value))}
                          className="w-[70px]"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItemField(index, 'unit_price', Number(e.target.value))}
                          className="w-[90px]"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">₹{item.taxable_amount.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.cgst_rate}
                          onChange={(e) => updateItemField(index, 'cgst_rate', Number(e.target.value))}
                          className="w-[60px]"
                          min="0"
                          max="100"
                          step="0.25"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.sgst_rate}
                          onChange={(e) => updateItemField(index, 'sgst_rate', Number(e.target.value))}
                          className="w-[60px]"
                          min="0"
                          max="100"
                          step="0.25"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.igst_rate}
                          onChange={(e) => updateItemField(index, 'igst_rate', Number(e.target.value))}
                          className="w-[60px]"
                          min="0"
                          max="100"
                          step="0.25"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-bold text-green-600">₹{item.total_price.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totals */}
      {formData.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Bill Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Taxable Amount</div>
                <div className="text-lg font-medium">₹{totals.taxableAmount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total CGST</div>
                <div className="text-lg font-medium">₹{totals.totalCgst.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total SGST</div>
                <div className="text-lg font-medium">₹{totals.totalSgst.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-bold">Grand Total</div>
                <div className="text-xl font-bold text-green-600">₹{totals.grandTotal.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setFormData(prev => ({ ...prev, status: PurchaseBillStatus.DRAFT }));
            handleSubmit();
          }}
          disabled={loading}
          variant="outline"
        >
          Save as Draft
        </Button>
        <Button
          onClick={() => {
            setFormData(prev => ({ ...prev, status: PurchaseBillStatus.SUBMITTED }));
            handleSubmit();
          }}
          disabled={loading}
        >
          Submit Bill
        </Button>
      </div>
    </div>
  );
};

export default PurchaseBillForm; 