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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Zap,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Eye,
  Settings,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Activity,
  Target,
  Calendar,
  Users,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Workflow,
  GitBranch,
  Timer,
  Robot,
  Cpu,
  Network,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkflowAutomation, AutomationAction, NotificationTemplate, IntegrationEvent } from "@/types/integration";
import { integrationService } from "@/lib/integrationService";

interface WorkflowRule extends WorkflowAutomation {
  lastExecutionResult?: string;
  averageExecutionTime?: number;
  successRate?: number;
}

interface ExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  eventData: Record<string, unknown>;
  executionTime: string;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  result: string;
  errors?: string[];
}

const WorkflowAutomationPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rules');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [automationRules, setAutomationRules] = useState<WorkflowRule[]>([]);
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([]);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [ruleFormData, setRuleFormData] = useState({
    name: '',
    description: '',
    triggerModule: '',
    triggerCondition: '',
    actions: [] as AutomationAction[],
    isActive: true
  });

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    type: 'email' as 'email' | 'sms' | 'system' | 'whatsapp',
    subject: '',
    content: '',
    variables: [] as string[],
    isActive: true
  });

  // Load data
  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockRules: WorkflowRule[] = [
        {
          id: '1',
          name: 'Auto-approve low value POs',
          description: 'Automatically approve purchase orders under ₹10,000',
          triggerModule: 'purchase_orders',
          triggerCondition: 'event.eventType === "create" && event.eventData.finalAmount < 10000',
          actions: [
            {
              id: '1',
              type: 'status_update',
              targetModule: 'purchase_orders',
              configuration: { status: 'approved' },
              order: 1
            },
            {
              id: '2',
              type: 'notification',
              targetModule: 'notifications',
              configuration: { template: 'po_auto_approved', recipients: ['finance_team'] },
              order: 2
            }
          ],
          isActive: true,
          createdDate: '2024-01-15',
          executionCount: 45,
          lastExecuted: '2024-02-20T10:30:00Z',
          lastExecutionResult: 'success',
          averageExecutionTime: 150,
          successRate: 98.5
        },
        {
          id: '2',
          name: 'MSME Payment Alert',
          description: 'Send alerts for MSME payments due within 3 days',
          triggerModule: 'payables_aging',
          triggerCondition: 'event.eventData.msme_days_remaining <= 3 && event.eventData.vendor_type === "msme"',
          actions: [
            {
              id: '3',
              type: 'notification',
              targetModule: 'notifications',
              configuration: { 
                template: 'msme_payment_due', 
                recipients: ['accounts_payable', 'compliance_team'],
                urgency: 'high'
              },
              order: 1
            }
          ],
          isActive: true,
          createdDate: '2024-01-20',
          executionCount: 23,
          lastExecuted: '2024-02-21T14:15:00Z',
          lastExecutionResult: 'success',
          averageExecutionTime: 95,
          successRate: 100
        },
        {
          id: '3',
          name: 'Three-way matching discrepancy alert',
          description: 'Alert when three-way matching confidence is below 85%',
          triggerModule: 'purchase_bills',
          triggerCondition: 'event.eventData.matchingScore < 85',
          actions: [
            {
              id: '4',
              type: 'approval_request',
              targetModule: 'approvals',
              configuration: { 
                approver: 'finance_manager', 
                reason: 'Low matching confidence',
                escalation_hours: 24
              },
              order: 1
            }
          ],
          isActive: true,
          createdDate: '2024-02-01',
          executionCount: 8,
          lastExecuted: '2024-02-19T09:45:00Z',
          lastExecutionResult: 'success',
          averageExecutionTime: 200,
          successRate: 87.5
        }
      ];

      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'PO Auto Approved',
          type: 'email',
          subject: 'Purchase Order {{poNumber}} Auto-Approved',
          content: 'Purchase Order {{poNumber}} for vendor {{vendorName}} has been automatically approved for amount {{amount}}.',
          variables: ['poNumber', 'vendorName', 'amount'],
          isActive: true
        },
        {
          id: '2',
          name: 'MSME Payment Due',
          type: 'email',
          subject: 'URGENT: MSME Payment Due - {{vendorName}}',
          content: 'MSME vendor {{vendorName}} payment of {{amount}} is due in {{daysRemaining}} days. Please process immediately to maintain compliance.',
          variables: ['vendorName', 'amount', 'daysRemaining'],
          isActive: true
        }
      ];

      const mockLogs: ExecutionLog[] = [
        {
          id: '1',
          ruleId: '1',
          ruleName: 'Auto-approve low value POs',
          eventData: { poNumber: 'PO/2024/123', amount: 8500 },
          executionTime: '2024-02-21T10:30:00Z',
          duration: 145,
          status: 'success',
          result: 'PO auto-approved and notification sent'
        },
        {
          id: '2',
          ruleId: '2',
          ruleName: 'MSME Payment Alert',
          eventData: { vendorName: 'ABC MSME Suppliers', amount: 45000, daysRemaining: 2 },
          executionTime: '2024-02-21T14:15:00Z',
          duration: 89,
          status: 'success',
          result: 'Alert sent to accounts team'
        }
      ];

      setAutomationRules(mockRules);
      setNotificationTemplates(mockTemplates);
      setExecutionLogs(mockLogs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load automation data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setRuleFormData({
      name: '',
      description: '',
      triggerModule: '',
      triggerCondition: '',
      actions: [],
      isActive: true
    });
    setEditingRule(null);
    setShowRuleForm(true);
  };

  const handleEditRule = (rule: WorkflowRule) => {
    setRuleFormData({
      name: rule.name,
      description: rule.description,
      triggerModule: rule.triggerModule,
      triggerCondition: rule.triggerCondition,
      actions: rule.actions,
      isActive: rule.isActive
    });
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const handleSaveRule = async () => {
    try {
      const ruleData: WorkflowRule = {
        id: editingRule?.id || `${Date.now()}`,
        name: ruleFormData.name,
        description: ruleFormData.description,
        triggerModule: ruleFormData.triggerModule,
        triggerCondition: ruleFormData.triggerCondition,
        actions: ruleFormData.actions,
        isActive: ruleFormData.isActive,
        createdDate: editingRule?.createdDate || new Date().toISOString(),
        executionCount: editingRule?.executionCount || 0,
        lastExecuted: editingRule?.lastExecuted,
        successRate: editingRule?.successRate || 100
      };

      if (editingRule) {
        setAutomationRules(prev => prev.map(rule => rule.id === editingRule.id ? ruleData : rule));
        toast({
          title: 'Success',
          description: 'Automation rule updated successfully',
        });
      } else {
        setAutomationRules(prev => [...prev, ruleData]);
        toast({
          title: 'Success',
          description: 'Automation rule created successfully',
        });
      }

      setShowRuleForm(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save automation rule',
        variant: 'destructive',
      });
    }
  };

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      setAutomationRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive } : rule
      ));
      
      toast({
        title: 'Success',
        description: `Automation rule ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rule status',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (ms: number): string => {
    return `${ms}ms`;
  };

  const modules = [
    'vendor_master',
    'purchase_orders',
    'goods_receipt_note',
    'purchase_bills',
    'expense_management',
    'tds_compliance',
    'itc_management',
    'payables_aging',
    'landed_cost_accounting'
  ];

  const actionTypes = [
    { value: 'notification', label: 'Send Notification' },
    { value: 'status_update', label: 'Update Status' },
    { value: 'record_creation', label: 'Create Record' },
    { value: 'approval_request', label: 'Request Approval' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Workflow Automation - JusFinn</title>
        <meta name="description" content="Manage workflow automation across Purchase & Expense modules" />
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflow Automation
            </h1>
            <p className="text-gray-600 mt-1">
              Configure and monitor automated workflows across all modules
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={loadAutomationData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleCreateRule}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Rule
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Active Rules</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {automationRules.filter(rule => rule.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Executions Today</p>
                  <p className="text-2xl font-bold text-green-900">
                    {executionLogs.filter(log => 
                      new Date(log.executionTime).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(automationRules.reduce((sum, rule) => sum + (rule.successRate || 0), 0) / automationRules.length || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg Response Time</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {Math.round(automationRules.reduce((sum, rule) => sum + (rule.averageExecutionTime || 0), 0) / automationRules.length || 0)}ms
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Timer className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rules">Automation Rules</TabsTrigger>
            <TabsTrigger value="templates">Notification Templates</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search automation rules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rules List */}
            <div className="grid grid-cols-1 gap-4">
              {automationRules
                .filter(rule => 
                  rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  rule.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((rule) => (
                <Card key={rule.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          />
                          <Badge 
                            variant={rule.isActive ? "default" : "secondary"}
                            className={rule.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{rule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Module: {rule.triggerModule}</p>
                            <p className="text-gray-600">Actions: {rule.actions.length}</p>
                          </div>
                          <div>
                            <p className="font-medium">Executions: {rule.executionCount}</p>
                            <p className="text-gray-600">Success Rate: {rule.successRate}%</p>
                          </div>
                          <div>
                            <p className="font-medium">Avg Time: {formatDuration(rule.averageExecutionTime || 0)}</p>
                            <p className="text-gray-600">
                              Last Run: {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Status: {rule.lastExecutionResult || 'Pending'}</p>
                            <p className="text-gray-600">Created: {new Date(rule.createdDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Executions
                </CardTitle>
                <CardDescription>
                  Monitor automation rule execution history and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Execution Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executionLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{log.ruleName}</div>
                            <div className="text-sm text-gray-500">
                              Rule ID: {log.ruleId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{new Date(log.executionTime).toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {formatDuration(log.duration)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className={
                              log.status === 'success' ? 'text-green-600' :
                              log.status === 'failed' ? 'text-red-600' :
                              'text-yellow-600'
                            }>
                              {log.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={log.result}>
                            {log.result}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Execution Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Execution Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end justify-between">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex flex-col items-center">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          style={{ 
                            height: `${60 + index * 20}px`, 
                            width: '24px',
                            marginBottom: '8px'
                          }}
                        />
                        <span className="text-xs text-gray-600">{day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">+23%</div>
                    <div className="text-sm text-gray-600">vs last week</div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Success Rate by Module
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.slice(0, 5).map((module, index) => {
                      const rate = 95 - index * 3;
                      return (
                        <div key={module} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {module.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress value={rate} className="w-20" />
                            <span className="text-sm font-medium w-12">{rate}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rule Form Dialog */}
        <Dialog open={showRuleForm} onOpenChange={setShowRuleForm}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruleName">Rule Name *</Label>
                  <Input
                    id="ruleName"
                    value={ruleFormData.name}
                    onChange={(e) => setRuleFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="triggerModule">Trigger Module *</Label>
                  <Select 
                    value={ruleFormData.triggerModule} 
                    onValueChange={(value) => setRuleFormData(prev => ({ ...prev, triggerModule: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem key={module} value={module}>
                          {module.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={ruleFormData.description}
                  onChange={(e) => setRuleFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this rule does"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="condition">Trigger Condition *</Label>
                <Textarea
                  id="condition"
                  value={ruleFormData.triggerCondition}
                  onChange={(e) => setRuleFormData(prev => ({ ...prev, triggerCondition: e.target.value }))}
                  placeholder="event.eventType === 'create' && event.eventData.amount > 10000"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use JavaScript expressions with event object
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowRuleForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRule} className="bg-blue-600 hover:bg-blue-700">
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkflowAutomationPage; 