import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  DollarSign, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalRule {
  id: string;
  ruleName: string;
  description?: string;
  minAmount: number;
  maxAmount?: number;
  level1Required: boolean;
  level2Required: boolean;
  level3Required: boolean;
  financeRequired: boolean;
  level1Approvers: ApprovalUser[];
  level2Approvers: ApprovalUser[];
  level3Approvers: ApprovalUser[];
  financeApprovers: ApprovalUser[];
  autoApproveBelow: number;
  escalationDays: number;
  isActive: boolean;
  priority: number;
  departments: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ApprovalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

interface ApprovalRuleFormData {
  ruleName: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  level1Required: boolean;
  level2Required: boolean;
  level3Required: boolean;
  financeRequired: boolean;
  level1Approvers: string[];
  level2Approvers: string[];
  level3Approvers: string[];
  financeApprovers: string[];
  autoApproveBelow: string;
  escalationDays: string;
  departments: string[];
  priority: string;
}

interface ApprovalRulesManagerProps {
  onRuleUpdate?: (rule: ApprovalRule) => void;
}

export const ApprovalRulesManager: React.FC<ApprovalRulesManagerProps> = ({
  onRuleUpdate
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rules');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Sample data
  const [approvalUsers] = useState<ApprovalUser[]>([
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Department Head',
      department: 'Operations',
      isActive: true
    },
    {
      id: 'user-2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Finance Manager',
      department: 'Finance',
      isActive: true
    },
    {
      id: 'user-3',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'CFO',
      department: 'Finance',
      isActive: true
    },
    {
      id: 'user-4',
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      role: 'IT Manager',
      department: 'IT',
      isActive: true
    }
  ]);

  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([
    {
      id: 'rule-1',
      ruleName: 'Standard Approval Rule',
      description: 'Default approval rule for most purchase orders',
      minAmount: 50000,
      maxAmount: 500000,
      level1Required: true,
      level2Required: true,
      level3Required: false,
      financeRequired: false,
      level1Approvers: [approvalUsers[0]],
      level2Approvers: [approvalUsers[1]],
      level3Approvers: [],
      financeApprovers: [],
      autoApproveBelow: 10000,
      escalationDays: 3,
      isActive: true,
      priority: 1,
      departments: ['Operations', 'IT', 'Marketing'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      createdBy: 'Admin'
    },
    {
      id: 'rule-2',
      ruleName: 'High Value Approval',
      description: 'Approval rule for high-value purchase orders',
      minAmount: 500000,
      level1Required: true,
      level2Required: true,
      level3Required: true,
      financeRequired: true,
      level1Approvers: [approvalUsers[0]],
      level2Approvers: [approvalUsers[1]],
      level3Approvers: [approvalUsers[2]],
      financeApprovers: [approvalUsers[1], approvalUsers[2]],
      autoApproveBelow: 0,
      escalationDays: 2,
      isActive: true,
      priority: 2,
      departments: ['All'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
      createdBy: 'Admin'
    }
  ]);

  const [formData, setFormData] = useState<ApprovalRuleFormData>({
    ruleName: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    level1Required: true,
    level2Required: false,
    level3Required: false,
    financeRequired: false,
    level1Approvers: [],
    level2Approvers: [],
    level3Approvers: [],
    financeApprovers: [],
    autoApproveBelow: '',
    escalationDays: '3',
    departments: [],
    priority: '1'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const departments = [
    'Operations', 'IT', 'Finance', 'HR', 'Marketing', 'Sales', 
    'Production', 'Quality', 'Maintenance', 'Admin', 'R&D'
  ];

  const resetForm = () => {
    setFormData({
      ruleName: '',
      description: '',
      minAmount: '',
      maxAmount: '',
      level1Required: true,
      level2Required: false,
      level3Required: false,
      financeRequired: false,
      level1Approvers: [],
      level2Approvers: [],
      level3Approvers: [],
      financeApprovers: [],
      autoApproveBelow: '',
      escalationDays: '3',
      departments: [],
      priority: '1'
    });
    setFormErrors({});
  };

  const handleCreateRule = () => {
    resetForm();
    setEditingRule(null);
    setShowRuleForm(true);
  };

  const handleEditRule = (rule: ApprovalRule) => {
    setFormData({
      ruleName: rule.ruleName,
      description: rule.description || '',
      minAmount: rule.minAmount.toString(),
      maxAmount: rule.maxAmount?.toString() || '',
      level1Required: rule.level1Required,
      level2Required: rule.level2Required,
      level3Required: rule.level3Required,
      financeRequired: rule.financeRequired,
      level1Approvers: rule.level1Approvers.map(u => u.id),
      level2Approvers: rule.level2Approvers.map(u => u.id),
      level3Approvers: rule.level3Approvers.map(u => u.id),
      financeApprovers: rule.financeApprovers.map(u => u.id),
      autoApproveBelow: rule.autoApproveBelow.toString(),
      escalationDays: rule.escalationDays.toString(),
      departments: rule.departments,
      priority: rule.priority.toString()
    });
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const handleDuplicateRule = (rule: ApprovalRule) => {
    setFormData({
      ruleName: `${rule.ruleName} (Copy)`,
      description: rule.description || '',
      minAmount: rule.minAmount.toString(),
      maxAmount: rule.maxAmount?.toString() || '',
      level1Required: rule.level1Required,
      level2Required: rule.level2Required,
      level3Required: rule.level3Required,
      financeRequired: rule.financeRequired,
      level1Approvers: rule.level1Approvers.map(u => u.id),
      level2Approvers: rule.level2Approvers.map(u => u.id),
      level3Approvers: rule.level3Approvers.map(u => u.id),
      financeApprovers: rule.financeApprovers.map(u => u.id),
      autoApproveBelow: rule.autoApproveBelow.toString(),
      escalationDays: rule.escalationDays.toString(),
      departments: rule.departments,
      priority: (rule.priority + 1).toString()
    });
    setEditingRule(null);
    setShowRuleForm(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.ruleName.trim()) {
      errors.ruleName = 'Rule name is required';
    }

    if (!formData.minAmount || isNaN(Number(formData.minAmount)) || Number(formData.minAmount) < 0) {
      errors.minAmount = 'Valid minimum amount is required';
    }

    if (formData.maxAmount && (isNaN(Number(formData.maxAmount)) || Number(formData.maxAmount) <= Number(formData.minAmount))) {
      errors.maxAmount = 'Maximum amount must be greater than minimum amount';
    }

    if (!formData.escalationDays || isNaN(Number(formData.escalationDays)) || Number(formData.escalationDays) < 1) {
      errors.escalationDays = 'Valid escalation days is required';
    }

    if (formData.level1Required && formData.level1Approvers.length === 0) {
      errors.level1Approvers = 'Level 1 approvers are required when level 1 is enabled';
    }

    if (formData.level2Required && formData.level2Approvers.length === 0) {
      errors.level2Approvers = 'Level 2 approvers are required when level 2 is enabled';
    }

    if (formData.level3Required && formData.level3Approvers.length === 0) {
      errors.level3Approvers = 'Level 3 approvers are required when level 3 is enabled';
    }

    if (formData.financeRequired && formData.financeApprovers.length === 0) {
      errors.financeApprovers = 'Finance approvers are required when finance approval is enabled';
    }

    if (formData.departments.length === 0) {
      errors.departments = 'At least one department must be selected';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const getUsersByIds = (ids: string[]) => 
        ids.map(id => approvalUsers.find(u => u.id === id)!).filter(Boolean);

      const ruleData: ApprovalRule = {
        id: editingRule?.id || `rule-${Date.now()}`,
        ruleName: formData.ruleName,
        description: formData.description,
        minAmount: Number(formData.minAmount),
        maxAmount: formData.maxAmount ? Number(formData.maxAmount) : undefined,
        level1Required: formData.level1Required,
        level2Required: formData.level2Required,
        level3Required: formData.level3Required,
        financeRequired: formData.financeRequired,
        level1Approvers: getUsersByIds(formData.level1Approvers),
        level2Approvers: getUsersByIds(formData.level2Approvers),
        level3Approvers: getUsersByIds(formData.level3Approvers),
        financeApprovers: getUsersByIds(formData.financeApprovers),
        autoApproveBelow: Number(formData.autoApproveBelow) || 0,
        escalationDays: Number(formData.escalationDays),
        isActive: true,
        priority: Number(formData.priority),
        departments: formData.departments,
        createdAt: editingRule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: editingRule?.createdBy || 'Current User'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingRule) {
        setApprovalRules(prev => prev.map(rule => 
          rule.id === editingRule.id ? ruleData : rule
        ));
        toast({
          title: "Rule Updated",
          description: "Approval rule has been updated successfully",
        });
      } else {
        setApprovalRules(prev => [...prev, ruleData]);
        toast({
          title: "Rule Created",
          description: "New approval rule has been created successfully",
        });
      }

      onRuleUpdate?.(ruleData);
      setShowRuleForm(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save approval rule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setApprovalRules(prev => prev.filter(rule => rule.id !== ruleId));
      setDeleteConfirm(null);
      
      toast({
        title: "Rule Deleted",
        description: "Approval rule has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete approval rule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      setApprovalRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive, updatedAt: new Date().toISOString() } : rule
      ));
      
      toast({
        title: isActive ? "Rule Activated" : "Rule Deactivated",
        description: `Approval rule has been ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Rules Management</h1>
          <p className="text-muted-foreground">
            Configure and manage purchase order approval workflows
          </p>
        </div>
        <Button onClick={handleCreateRule}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Rules ({approvalRules.length})</TabsTrigger>
          <TabsTrigger value="approvers">Approvers ({approvalUsers.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Rules</CardTitle>
              <CardDescription>
                Manage approval rules that govern purchase order workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Amount Range</TableHead>
                    <TableHead>Levels Required</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.ruleName}</div>
                          {rule.description && (
                            <div className="text-sm text-gray-500">{rule.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatCurrency(rule.minAmount)} - 
                          {rule.maxAmount ? formatCurrency(rule.maxAmount) : 'No Limit'}
                        </div>
                        {rule.autoApproveBelow > 0 && (
                          <div className="text-xs text-green-600">
                            Auto-approve below {formatCurrency(rule.autoApproveBelow)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.level1Required && <Badge variant="outline" className="text-xs">L1</Badge>}
                          {rule.level2Required && <Badge variant="outline" className="text-xs">L2</Badge>}
                          {rule.level3Required && <Badge variant="outline" className="text-xs">L3</Badge>}
                          {rule.financeRequired && <Badge variant="outline" className="text-xs">Finance</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rule.departments.includes('All') ? 'All Departments' : 
                           rule.departments.length > 2 ? 
                           `${rule.departments.slice(0, 2).join(', ')} +${rule.departments.length - 2}` :
                           rule.departments.join(', ')
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                          />
                          <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditRule(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDuplicateRule(rule)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setDeleteConfirm(rule.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Users</CardTitle>
              <CardDescription>
                Manage users who can approve purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Configure global approval workflow settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Escalation Period</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Maximum Approval Levels</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 levels</SelectItem>
                      <SelectItem value="3">3 levels</SelectItem>
                      <SelectItem value="4">4 levels</SelectItem>
                      <SelectItem value="5">5 levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications">Send email notifications for pending approvals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-escalation" defaultChecked />
                  <Label htmlFor="auto-escalation">Enable automatic escalation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="parallel-approval" />
                  <Label htmlFor="parallel-approval">Allow parallel approvals at same level</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rule Form Dialog */}
      <Dialog open={showRuleForm} onOpenChange={setShowRuleForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure the approval workflow for purchase orders
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleName">Rule Name *</Label>
                <Input
                  id="ruleName"
                  value={formData.ruleName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ruleName: e.target.value }))}
                  placeholder="Enter rule name"
                />
                {formErrors.ruleName && (
                  <div className="text-sm text-red-600 mt-1">{formErrors.ruleName}</div>
                )}
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Highest)</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5 (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe when this rule should be applied"
                rows={2}
              />
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="minAmount">Minimum Amount *</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                  placeholder="0"
                />
                {formErrors.minAmount && (
                  <div className="text-sm text-red-600 mt-1">{formErrors.minAmount}</div>
                )}
              </div>
              <div>
                <Label htmlFor="maxAmount">Maximum Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: e.target.value }))}
                  placeholder="No limit"
                />
                {formErrors.maxAmount && (
                  <div className="text-sm text-red-600 mt-1">{formErrors.maxAmount}</div>
                )}
              </div>
              <div>
                <Label htmlFor="autoApproveBelow">Auto-approve Below</Label>
                <Input
                  id="autoApproveBelow"
                  type="number"
                  value={formData.autoApproveBelow}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoApproveBelow: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Approval Levels */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Approval Levels</h3>
              
              {/* Level 1 */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.level1Required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, level1Required: checked }))}
                  />
                  <Label className="font-medium">Level 1 Approval Required</Label>
                </div>
                
                {formData.level1Required && (
                  <div>
                    <Label>Level 1 Approvers</Label>
                    <Select 
                      value={formData.level1Approvers[0] || ''} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        level1Approvers: value ? [value] : [] 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.level1Approvers && (
                      <div className="text-sm text-red-600 mt-1">{formErrors.level1Approvers}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Level 2 */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.level2Required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, level2Required: checked }))}
                  />
                  <Label className="font-medium">Level 2 Approval Required</Label>
                </div>
                
                {formData.level2Required && (
                  <div>
                    <Label>Level 2 Approvers</Label>
                    <Select 
                      value={formData.level2Approvers[0] || ''} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        level2Approvers: value ? [value] : [] 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.level2Approvers && (
                      <div className="text-sm text-red-600 mt-1">{formErrors.level2Approvers}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Level 3 */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.level3Required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, level3Required: checked }))}
                  />
                  <Label className="font-medium">Level 3 Approval Required</Label>
                </div>
                
                {formData.level3Required && (
                  <div>
                    <Label>Level 3 Approvers</Label>
                    <Select 
                      value={formData.level3Approvers[0] || ''} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        level3Approvers: value ? [value] : [] 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.level3Approvers && (
                      <div className="text-sm text-red-600 mt-1">{formErrors.level3Approvers}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Finance */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.financeRequired}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, financeRequired: checked }))}
                  />
                  <Label className="font-medium">Finance Approval Required</Label>
                </div>
                
                {formData.financeRequired && (
                  <div>
                    <Label>Finance Approvers</Label>
                    <Select 
                      value={formData.financeApprovers[0] || ''} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        financeApprovers: value ? [value] : [] 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvalUsers.filter(user => user.department === 'Finance').map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.financeApprovers && (
                      <div className="text-sm text-red-600 mt-1">{formErrors.financeApprovers}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Other Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="escalationDays">Escalation Days *</Label>
                <Input
                  id="escalationDays"
                  type="number"
                  value={formData.escalationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, escalationDays: e.target.value }))}
                  placeholder="3"
                />
                {formErrors.escalationDays && (
                  <div className="text-sm text-red-600 mt-1">{formErrors.escalationDays}</div>
                )}
              </div>
              <div>
                <Label>Applicable Departments *</Label>
                <Select 
                  value={formData.departments[0] || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    departments: value === 'All' ? ['All'] : [value] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.departments && (
                  <div className="text-sm text-red-600 mt-1">{formErrors.departments}</div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRuleForm(false)}>
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingRule ? 'Update Rule' : 'Create Rule'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Approval Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this approval rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDeleteRule(deleteConfirm)}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalRulesManager;