import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Building, 
  User, 
  Plus, 
  TrendingUp,
  Shield,
  Star,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  Crown,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import { Client } from "@/types/client";
import { clientApi } from "@/lib/clientApi";

const ClientManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("clients");
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    this_month: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Load statistics when component mounts or refreshKey changes
  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const dashboardStats = await clientApi.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      toast({
        title: "⚠️ Warning",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleFormSuccess = () => {
    setShowClientForm(false);
    setEditingClient(null);
    setRefreshKey(prev => prev + 1); // Trigger ClientList refresh and stats reload
    toast({
      title: "✅ Success",
      description: `Client ${editingClient ? 'updated' : 'created'} successfully.`,
    });
  };

  const handleFormCancel = () => {
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleDeleteClient = () => {
    setRefreshKey(prev => prev + 1); // Trigger ClientList refresh and stats reload
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Client Management - JusFinn AI</title>
        <meta name="description" content="Manage your CA clients efficiently with JusFinn AI. Track client status, compliance, and relationships in one centralized platform." />
        <meta name="keywords" content="client management, CA clients, practice management, client tracking, compliance management, JusFinn AI" />
        <meta property="og:title" content="Client Management - JusFinn AI" />
        <meta property="og:description" content="Manage your CA clients efficiently with JusFinn AI. Track client status, compliance, and relationships in one centralized platform." />
        <meta property="og:url" content="https://your-domain.com/client-management" />
        <link rel="canonical" href="https://your-domain.com/client-management" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your clients, track compliance, and monitor relationships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreateClient}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.total
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "Total registered clients"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.active
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "Currently active clients"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Clients</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.pending
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "Awaiting activation"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                stats.this_month
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "Loading..." : "New clients added"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">All Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <ClientList
            onCreateClient={handleCreateClient}
            onEditClient={handleEditClient}
            onViewClient={(client) => {
              // Handle view client - could navigate to client detail page
              console.log("View client:", client);
            }}
            onDeleteClient={handleDeleteClient}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Client Growth
                </CardTitle>
                <CardDescription>
                  Track how your client base is growing over time
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
                  <Shield className="w-5 h-5" />
                  Compliance Status
                </CardTitle>
                <CardDescription>
                  Monitor client compliance scores and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Compliance tracking coming soon</p>
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
                Client Management Settings
              </CardTitle>
              <CardDescription>
                Configure your client management preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Settings panel coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Form Dialog */}
      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            client={editingClient || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement; 