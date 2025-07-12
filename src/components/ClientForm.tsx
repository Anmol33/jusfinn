import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { clientApi } from '@/lib/clientApi';
import { Client, ClientCreateRequest, ClientUpdateRequest, ClientType, ClientStatus } from '@/types/client';
import { Building, User, MapPin, FileText, Phone, Mail, CreditCard, X, Check } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company_name: z.string().optional(),
  client_type: z.enum(['individual', 'business', 'partnership', 'company']),
  pan_number: z.string()
    .min(1, 'PAN number is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN number must be in format: ABCPD1234E')
    .transform(val => val.toUpperCase()),
  gst_number: z.string().optional(),
  aadhar_number: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().default('India'),
  }),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company_name: client?.company_name || '',
      client_type: client?.client_type || ClientType.INDIVIDUAL,
      pan_number: client?.pan_number || '',
      gst_number: client?.gst_number || '',
      aadhar_number: client?.aadhar_number || '',
      address: {
        street: client?.address?.street || '',
        city: client?.address?.city || '',
        state: client?.address?.state || '',
        postal_code: client?.address?.postal_code || '',
        country: client?.address?.country || 'India',
      },
      status: client?.status || ClientStatus.ACTIVE,
      notes: client?.notes || '',
    },
  });

  const clientType = watch('client_type');

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      if (client) {
        // Update existing client
        await clientApi.updateClient(client.id, data as ClientUpdateRequest);
        toast({
          title: "✅ Client Updated",
          description: "Client information has been updated successfully.",
        });
      } else {
        // Create new client
        await clientApi.createClient(data as ClientCreateRequest);
        toast({
          title: "✅ Client Created",
          description: "New client has been added successfully.",
        });
      }
      onSuccess?.();
    } catch (error: any) {
      let errorMessage = `Failed to ${client ? 'update' : 'create'} client. Please try again.`;
      
      // Handle specific error messages
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          <p className="text-gray-600 mt-1">
            {client ? 'Update client information' : 'Enter client details to get started'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={client?.status === 'active' ? 'default' : 'secondary'}>
            {client?.status || 'New'}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter email address"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+91-9876543210"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="client_type">Client Type *</Label>
                <Select
                  value={clientType}
                  onValueChange={(value) => setValue('client_type', value as ClientType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClientType.INDIVIDUAL}>Individual</SelectItem>
                    <SelectItem value={ClientType.BUSINESS}>Business</SelectItem>
                    <SelectItem value={ClientType.PARTNERSHIP}>Partnership</SelectItem>
                    <SelectItem value={ClientType.COMPANY}>Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {clientType !== ClientType.INDIVIDUAL && (
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company_name"
                    {...register('company_name')}
                    placeholder="Enter company name"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {client && (
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as ClientStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ClientStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ClientStatus.INACTIVE}>Inactive</SelectItem>
                    <SelectItem value={ClientStatus.PENDING}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pan_number">PAN Number *</Label>
                <Input
                  id="pan_number"
                  {...register('pan_number')}
                  placeholder="ABCPD1234E"
                  className={`uppercase ${errors.pan_number ? 'border-red-500' : ''}`}
                />
                {errors.pan_number && (
                  <p className="text-sm text-red-500 mt-1">{errors.pan_number.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  {...register('gst_number')}
                  placeholder="27ABCPD1234E1Z5"
                  className="uppercase"
                />
              </div>

              <div>
                <Label htmlFor="aadhar_number">Aadhar Number</Label>
                <Input
                  id="aadhar_number"
                  {...register('aadhar_number')}
                  placeholder="1234 5678 9012"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address.street">Street Address *</Label>
              <Input
                id="address.street"
                {...register('address.street')}
                placeholder="Enter street address"
                className={errors.address?.street ? 'border-red-500' : ''}
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address.city">City *</Label>
                <Input
                  id="address.city"
                  {...register('address.city')}
                  placeholder="Enter city"
                  className={errors.address?.city ? 'border-red-500' : ''}
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address.state">State *</Label>
                <Input
                  id="address.state"
                  {...register('address.state')}
                  placeholder="Enter state"
                  className={errors.address?.state ? 'border-red-500' : ''}
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address.postal_code">Postal Code *</Label>
                <Input
                  id="address.postal_code"
                  {...register('address.postal_code')}
                  placeholder="Enter postal code"
                  className={errors.address?.postal_code ? 'border-red-500' : ''}
                />
                {errors.address?.postal_code && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.postal_code.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes about the client..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                {client ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {client ? 'Update Client' : 'Create Client'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm; 