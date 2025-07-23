import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  CalendarIcon, 
  Plus, 
  Trash2, 
  Package, 
  Truck, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Building, 
  FileText,
  Save,
  X,
  Loader2,
  Eye,
  Calculator
} from 'lucide-react';
import { format } from 'date-fns';

import { GRNApiService } from '@/lib/grnApi';
import type { GRNCreateRequest, GRNItemRequest, POForGRN, POItemForGRN } from '@/types/grn';

interface GRNFormProps {
  poId?: string;
  onSuccess?: (grnId: string) => void;
  onCancel?: () => void;
  editingGRN?: any; // For editing existing GRN
}

interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

const GRNForm: React.FC<GRNFormProps> = ({ poId, onSuccess, onCancel, editingGRN }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [poData, setPOData] = useState<POForGRN | null>(null);
  const [validation, setValidation] = useState<FormValidation>({ isValid: true, errors: {} });
  
  const [formData, setFormData] = useState<GRNCreateRequest>({
    po_id: poId || '',
    grn_date: format(new Date(), 'yyyy-MM-dd'),
    received_date: format(new Date(), 'yyyy-MM-dd'),
    delivery_note_number: '',
    vehicle_number: '',
    received_by: '',
    quality_check_required: false,
    items: [],
    notes: ''
  });

  // Enhanced form state for better UX
  const [formStats, setFormStats] = useState({
    totalItems: 0,
    totalReceivedValue: 0,
    totalAcceptedValue: 0,
    totalRejectedValue: 0,
    completionPercentage: 0
  });

  // Load PO data when poId changes
  useEffect(() => {
    if (poId) {
      loadPOData(poId);
    }
  }, [poId]);

  // Calculate form statistics
  useEffect(() => {
    const stats = {
      totalItems: formData.items.length,
      totalReceivedValue: formData.items.reduce((sum, item) => {
        const poItem = poData?.items.find(p => p.id === item.po_item_id);
        return sum + (item.received_quantity * (poItem?.unit_price || 0));
      }, 0),
      totalAcceptedValue: formData.items.reduce((sum, item) => {
        const poItem = poData?.items.find(p => p.id === item.po_item_id);
        return sum + (item.accepted_quantity * (poItem?.unit_price || 0));
      }, 0),
      totalRejectedValue: formData.items.reduce((sum, item) => {
        const poItem = poData?.items.find(p => p.id === item.po_item_id);
        return sum + (item.rejected_quantity * (poItem?.unit_price || 0));
      }, 0),
      completionPercentage: formData.items.length > 0 
        ? (formData.items.filter(item => item.received_quantity > 0).length / formData.items.length) * 100 
        : 0
    };
    setFormStats(stats);
  }, [formData.items, poData]);

  const loadPOData = async (poId: string) => {
    try {
      setLoading(true);
      const data = await GRNApiService.getPOItemsForGRN(poId);
      setPOData(data);
      
      // Initialize form items with PO data
      const items: GRNItemRequest[] = data.items.map(item => ({
        po_item_id: item.id,
        received_quantity: item.pending_quantity, // Default to pending quantity
        accepted_quantity: item.pending_quantity,
        rejected_quantity: 0,
        rejection_reason: '',
        batch_number: '',
        expiry_date: '',
        notes: ''
      }));
      
      setFormData(prev => ({
        ...prev,
        po_id: poId,
        items
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load Purchase Order data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = useCallback((): FormValidation => {
    const errors: Record<string, string> = {};

    if (!formData.po_id) {
      errors.po_id = 'Please select a Purchase Order';
    }

    if (!formData.received_by.trim()) {
      errors.received_by = 'Please specify who received the goods';
    }

    if (!formData.grn_date) {
      errors.grn_date = 'GRN date is required';
    }

    if (!formData.received_date) {
      errors.received_date = 'Received date is required';
    }

    if (formData.items.length === 0) {
      errors.items = 'Please add at least one item';
    }

    // Validate item quantities
    const invalidItems = formData.items.filter(item => 
      item.received_quantity <= 0 || 
      item.accepted_quantity + item.rejected_quantity !== item.received_quantity ||
      item.accepted_quantity < 0 ||
      item.rejected_quantity < 0
    );

    if (invalidItems.length > 0) {
      errors.quantities = 'Please ensure all items have valid quantities (Accepted + Rejected = Received)';
    }

    // Validate rejection reasons for rejected items
    const rejectedItemsWithoutReason = formData.items.filter(item => 
      item.rejected_quantity > 0 && !item.rejection_reason?.trim()
    );

    if (rejectedItemsWithoutReason.length > 0) {
      errors.rejection_reasons = 'Please provide rejection reasons for all rejected items';
    }

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = validateForm();
    setValidation(validationResult);

    if (!validationResult.isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      const grn = await GRNApiService.createGRNFromPO(formData.po_id, formData);
      
      toast({
        title: 'Success',
        description: `GRN ${grn.grn_number} created successfully`,
      });
      
      if (onSuccess) {
        onSuccess(grn.id);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create GRN',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateItemQuantity = (itemIndex: number, field: 'received_quantity' | 'accepted_quantity' | 'rejected_quantity', value: number) => {
    const newItems = [...formData.items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    
    // Auto-calculate accepted quantity when received quantity changes
    if (field === 'received_quantity') {
      const rejectedQty = newItems[itemIndex].rejected_quantity || 0;
      newItems[itemIndex].accepted_quantity = Math.max(0, value - rejectedQty);
    }
    
    // Auto-calculate accepted quantity when rejected quantity changes
    if (field === 'rejected_quantity') {
      const receivedQty = newItems[itemIndex].received_quantity || 0;
      newItems[itemIndex].accepted_quantity = Math.max(0, receivedQty - value);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const updateItemField = (itemIndex: number, field: keyof GRNItemRequest, value: string) => {
    const newItems = [...formData.items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Render summary cards
  const renderSummaryCards = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formStats.totalItems}</div>
            <Progress value={formStats.completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Value</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{formStats.totalReceivedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total received amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Value</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{formStats.totalAcceptedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Accepted amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Value</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{formStats.totalRejectedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Rejected amount</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Purchase Order data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {editingGRN ? 'Edit Goods Receipt Note' : 'Create Goods Receipt Note'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {poData ? `For Purchase Order: ${poData.po_number}` : 'Complete the form below to create a new GRN'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {formData.items.length > 0 && renderSummaryCards()}

      {/* PO Information */}
      {poData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Purchase Order Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">PO Number</Label>
                <p className="text-sm">{poData.po_number}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Vendor</Label>
                <p className="text-sm">{poData.vendor_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">PO Date</Label>
                <p className="text-sm">{new Date(poData.po_date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              GRN Details
            </CardTitle>
            <CardDescription>
              Enter the basic information for this goods receipt note
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grn_date">GRN Date *</Label>
                <Input
                  id="grn_date"
                  type="date"
                  value={formData.grn_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, grn_date: e.target.value }))}
                  className={validation.errors.grn_date ? 'border-red-500' : ''}
                />
                {validation.errors.grn_date && (
                  <p className="text-sm text-red-500">{validation.errors.grn_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="received_date">Received Date *</Label>
                <Input
                  id="received_date"
                  type="date"
                  value={formData.received_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, received_date: e.target.value }))}
                  className={validation.errors.received_date ? 'border-red-500' : ''}
                />
                {validation.errors.received_date && (
                  <p className="text-sm text-red-500">{validation.errors.received_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="received_by">Received By *</Label>
                <Input
                  id="received_by"
                  value={formData.received_by}
                  onChange={(e) => setFormData(prev => ({ ...prev, received_by: e.target.value }))}
                  placeholder="Name of person who received goods"
                  className={validation.errors.received_by ? 'border-red-500' : ''}
                />
                {validation.errors.received_by && (
                  <p className="text-sm text-red-500">{validation.errors.received_by}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_note_number">Delivery Note Number</Label>
                <Input
                  id="delivery_note_number"
                  value={formData.delivery_note_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_note_number: e.target.value }))}
                  placeholder="Delivery note reference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <div className="relative">
                  <Truck className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
                    placeholder="Vehicle registration number"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quality_check_required"
                  checked={formData.quality_check_required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, quality_check_required: !!checked }))}
                />
                <Label htmlFor="quality_check_required" className="flex items-center">
                  <ClipboardCheck className="mr-1 h-4 w-4" />
                  Quality Check Required
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Items Received
            </CardTitle>
            <CardDescription>
              Enter the quantities received and accepted for each item
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validation.errors.items && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{validation.errors.items}</p>
              </div>
            )}
            
            {validation.errors.quantities && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{validation.errors.quantities}</p>
              </div>
            )}

            {validation.errors.rejection_reasons && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{validation.errors.rejection_reasons}</p>
              </div>
            )}

            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Description</TableHead>
                    <TableHead>Ordered Qty</TableHead>
                    <TableHead>Pending Qty</TableHead>
                    <TableHead>Received Qty</TableHead>
                    <TableHead>Accepted Qty</TableHead>
                    <TableHead>Rejected Qty</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead>Batch/Lot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => {
                    const poItem = poData?.items.find(p => p.id === item.po_item_id);
                    if (!poItem) return null;

                    return (
                      <TableRow key={item.po_item_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{poItem.item_description}</p>
                            <p className="text-sm text-muted-foreground">
                              Unit: {poItem.unit} | Rate: ₹{poItem.unit_price}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{poItem.quantity}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                            {poItem.pending_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.received_quantity}
                            onChange={(e) => updateItemQuantity(index, 'received_quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            max={poItem.pending_quantity}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.accepted_quantity}
                            onChange={(e) => updateItemQuantity(index, 'accepted_quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            max={item.received_quantity}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rejected_quantity}
                            onChange={(e) => updateItemQuantity(index, 'rejected_quantity', parseFloat(e.target.value) || 0)}
                            min="0"
                            max={item.received_quantity}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.rejection_reason || ''}
                            onChange={(e) => updateItemField(index, 'rejection_reason', e.target.value)}
                            placeholder={item.rejected_quantity > 0 ? "Required" : "N/A"}
                            disabled={item.rejected_quantity === 0}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.batch_number || ''}
                            onChange={(e) => updateItemField(index, 'batch_number', e.target.value)}
                            placeholder="Batch/Lot"
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Add any additional comments or observations about the receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional notes about the goods receipt..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating GRN...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {editingGRN ? 'Update GRN' : 'Create GRN'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GRNForm;