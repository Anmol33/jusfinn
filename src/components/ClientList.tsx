import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { clientApi } from '@/lib/clientApi';
import { Client, ClientStatus, ClientType } from '@/types/client';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  MoreHorizontal,
  FileText,
  Users,
  Activity
} from 'lucide-react';

interface ClientListProps {
  onEditClient?: (client: Client) => void;
  onViewClient?: (client: Client) => void;
  onCreateClient?: () => void;
  onDeleteClient?: () => void; // Add callback for deletion
  refreshKey?: number; // Add refresh mechanism
}

const ClientList: React.FC<ClientListProps> = ({ 
  onEditClient, 
  onViewClient, 
  onCreateClient,
  onDeleteClient,
  refreshKey = 0
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const { toast } = useToast();

  // Load clients when search query or filters change
  useEffect(() => {
    loadClients();
  }, [searchQuery, statusFilter, typeFilter, refreshKey]);

  const loadClients = async () => {
    try {
      console.log('🔍 ClientList - Loading clients...');
      console.log('🔗 ClientList - API Base URL:', import.meta.env.VITE_API_BASE_URL);
      console.log('🏁 ClientList - Environment mode:', import.meta.env.MODE);
      
      // Only show full loading for initial load (first time only)
      if (!hasInitiallyLoaded) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      
      let clientsData: Client[] = [];

      if (searchQuery) {
        console.log('🔍 Making search request for:', searchQuery);
        clientsData = await clientApi.searchClients(searchQuery);
      } else if (statusFilter !== 'all') {
        console.log('🔍 Making status filter request for:', statusFilter);
        clientsData = await clientApi.getClientsByStatus(statusFilter);
      } else {
        console.log('🔍 Making getClients request (no filters)');
        clientsData = await clientApi.getClients();
      }

      // Apply type filter if needed
      if (typeFilter !== 'all') {
        clientsData = clientsData.filter(client => client.client_type === typeFilter);
      }

      console.log('✅ ClientList - Successfully loaded clients:', clientsData.length);
      setClients(clientsData);
      setHasInitiallyLoaded(true);
    } catch (error) {
      console.error('❌ ClientList - Error loading clients:', error);
      console.error('❌ ClientList - Error details:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      toast({
        title: "❌ Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await clientApi.deleteClient(clientId);
      setClients(clients.filter(client => client.id !== clientId));
      toast({
        title: "✅ Client Deleted",
        description: "Client has been deleted successfully.",
      });
      onDeleteClient?.(); // Notify parent component
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ClientStatus.INACTIVE:
        return 'bg-red-100 text-red-800';
      case ClientStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ClientType) => {
    switch (type) {
      case ClientType.INDIVIDUAL:
        return <User className="w-4 h-4" />;
      case ClientType.BUSINESS:
      case ClientType.PARTNERSHIP:
      case ClientType.COMPANY:
        return <Building className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">Manage your client relationships</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searching && (
                  <div className="absolute right-3 top-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Client List ({clients.length})
            {searching && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first client using the "Add Client" button above'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          {getTypeIcon(client.client_type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{client.name}</div>
                          {client.company_name && (
                            <div className="text-sm text-gray-500">{client.company_name}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{client.client_type}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(client.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClient(client)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditClient?.(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Client</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {client.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClient(client.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
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
          )}
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  {getTypeIcon(selectedClient.client_type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                  {selectedClient.company_name && (
                    <p className="text-gray-600">{selectedClient.company_name}</p>
                  )}
                  <Badge className={getStatusColor(selectedClient.status)}>
                    {selectedClient.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="text-sm">
                      <p>{selectedClient.address.street}</p>
                      <p>{selectedClient.address.city}, {selectedClient.address.state}</p>
                      <p>{selectedClient.address.postal_code}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedClient.pan_number && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">PAN Number</h4>
                    <p className="text-sm text-gray-600">{selectedClient.pan_number}</p>
                  </div>
                )}
                {selectedClient.gst_number && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">GST Number</h4>
                    <p className="text-sm text-gray-600">{selectedClient.gst_number}</p>
                  </div>
                )}
                {selectedClient.aadhar_number && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Aadhar Number</h4>
                    <p className="text-sm text-gray-600">{selectedClient.aadhar_number}</p>
                  </div>
                )}
              </div>

              {selectedClient.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedClient.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowClientDetails(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onEditClient?.(selectedClient);
                    setShowClientDetails(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList; 