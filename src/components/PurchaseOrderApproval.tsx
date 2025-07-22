import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  Timer,
  FileText,
  ChevronRight,
  CheckCircle2,
  X,
  RotateCcw,
  Send,
  Eye,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for Approval Workflow
export interface ApprovalLevel {
  id: string;
  level: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped' | 'not_required';
  approver?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  approvedAt?: string;
  comments?: string;
  isRequired: boolean;
  isCurrent: boolean;
}

export interface ApprovalRule {
  id: string;
  ruleName: string;
  minAmount: number;
  maxAmount?: number;
  level1Required: boolean;
  level2Required: boolean;
  level3Required: boolean;
  financeRequired: boolean;
  level1Approvers: string[];
  level2Approvers: string[];
  level3Approvers: string[];
  financeApprovers: string[];
  autoApproveBelow: number;
  isActive: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  poId: string;
  currentLevel?: number;
  status: 'draft' | 'pending_approval' | 'level_1_approved' | 'level_2_approved' | 'level_3_approved' | 'final_approved' | 'rejected' | 'changes_requested';
  submittedAt?: string;
  submittedBy?: string;
  expectedApprovalDate?: string;
  isOverdue: boolean;
  escalationCount: number;
  levels: ApprovalLevel[];
  appliedRule?: ApprovalRule;
  history: ApprovalHistoryItem[];
}

export interface ApprovalHistoryItem {
  id: string;
  level: number;
  action: 'submit' | 'approve' | 'reject' | 'request_changes' | 'escalate';
  approver: {
    id: string;
    name: string;
    email: string;
  };
  actionDate: string;
  comments?: string;
  previousStatus: string;
  newStatus: string;
  poAmount: number;
}

export interface PendingApproval {
  poId: string;
  poNumber: string;
  vendorName: string;
  totalAmount: number;
  submittedAt: string;
  daysPending: number;
  isOverdue: boolean;
  currentLevel: number;
  nextApprover?: string;
}

interface PurchaseOrderApprovalProps {
  poId?: string;
  workflow?: ApprovalWorkflow;
  onWorkflowUpdate?: (workflow: ApprovalWorkflow) => void;
  mode?: 'view' | 'manage';
  currentUserId?: string;
}

export const PurchaseOrderApproval: React.FC<PurchaseOrderApprovalProps> = ({
  poId,
  workflow,
  onWorkflowUpdate,
  mode = 'view',
  currentUserId = 'current-user'
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('workflow');
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | 'request_changes' | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data for demonstration
  const sampleWorkflow: ApprovalWorkflow = {
    id: 'wf-001',
    poId: poId || 'po-001',
    currentLevel: 2,
    status: 'level_1_approved',
    submittedAt: '2024-01-15T10:30:00Z',
    submittedBy: 'John Doe',
    expectedApprovalDate: '2024-01-18T17:00:00Z',
    isOverdue: false,
    escalationCount: 0,
    levels: [
      {
        id: 'level-1',
        level: 1,
        name: 'Department Head Approval',
        status: 'approved',
        approver: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'Department Head'
        },
        approvedAt: '2024-01-15T14:30:00Z',
        comments: 'Approved for business necessity',
        isRequired: true,
        isCurrent: false
      },
      {
        id: 'level-2',
        level: 2,
        name: 'Finance Manager Approval',
        status: 'pending',
        approver: {
          id: 'user-2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          role: 'Finance Manager'
        },
        isRequired: true,
        isCurrent: true
      },
      {
        id: 'level-3',
        level: 3,
        name: 'CFO Approval',
        status: 'not_required',
        isRequired: false,
        isCurrent: false
      }
    ],
    appliedRule: {
      id: 'rule-1',
      ruleName: 'Standard Approval Rule',
      minAmount: 50000,
      maxAmount: 500000,
      level1Required: true,
      level2Required: true,
      level3Required: false,
      financeRequired: false,
      level1Approvers: ['user-1'],
      level2Approvers: ['user-2'],
      level3Approvers: [],
      financeApprovers: [],
      autoApproveBelow: 10000,
      isActive: true
    },
    history: [
      {
        id: 'hist-1',
        level: 0,
        action: 'submit',
        approver: {
          id: 'user-submitter',
          name: 'John Doe',
          email: 'john.doe@company.com'
        },
        actionDate: '2024-01-15T10:30:00Z',
        comments: 'Submitted for approval',
        previousStatus: 'draft',
        newStatus: 'pending_approval',
        poAmount: 125000
      },
      {
        id: 'hist-2',
        level: 1,
        action: 'approve',
        approver: {
          id: 'user-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com'
        },
        actionDate: '2024-01-15T14:30:00Z',
        comments: 'Approved for business necessity',
        previousStatus: 'pending_approval',
        newStatus: 'level_1_approved',
        poAmount: 125000
      }
    ]
  };

  const currentWorkflow = workflow || sampleWorkflow;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'changes_requested': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not_required': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'skipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'changes_requested': return <RotateCcw className="h-4 w-4" />;
      case 'not_required': return <X className="h-4 w-4 opacity-50" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = () => {
    const requiredLevels = currentWorkflow.levels.filter(level => level.isRequired);
    const completedLevels = requiredLevels.filter(level => level.status === 'approved');
    return requiredLevels.length > 0 ? (completedLevels.length / requiredLevels.length) * 100 : 0;
  };

  const canUserTakeAction = (level: ApprovalLevel) => {
    return level.isCurrent && 
           level.status === 'pending' && 
           level.approver?.id === currentUserId;
  };

  const handleApprovalAction = async (action: 'approve' | 'reject' | 'request_changes') => {
    if (!actionComments.trim() && action !== 'approve') {
      toast({
        title: "Comments Required",
        description: "Please provide comments for rejection or change requests",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update workflow state
      const updatedWorkflow = { ...currentWorkflow };
      const currentLevel = updatedWorkflow.levels.find(l => l.isCurrent);
      
      if (currentLevel) {
        currentLevel.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'pending';
        currentLevel.approvedAt = new Date().toISOString();
        currentLevel.comments = actionComments;
        currentLevel.isCurrent = false;

        // Move to next level if approved
        if (action === 'approve') {
          const nextLevel = updatedWorkflow.levels.find(l => 
            l.level > currentLevel.level && l.isRequired && l.status === 'pending'
          );
          if (nextLevel) {
            nextLevel.isCurrent = true;
            updatedWorkflow.status = `level_${currentLevel.level}_approved` as any;
          } else {
            updatedWorkflow.status = 'final_approved';
          }
        } else {
          updatedWorkflow.status = action === 'reject' ? 'rejected' : 'changes_requested';
        }

        // Add to history
        updatedWorkflow.history.push({
          id: `hist-${Date.now()}`,
          level: currentLevel.level,
          action,
          approver: {
            id: currentUserId,
            name: 'Current User',
            email: 'current@company.com'
          },
          actionDate: new Date().toISOString(),
          comments: actionComments,
          previousStatus: currentWorkflow.status,
          newStatus: updatedWorkflow.status,
          poAmount: 125000
        });
      }

      onWorkflowUpdate?.(updatedWorkflow);
      
      toast({
        title: "Success",
        description: `Purchase order ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent back for changes'} successfully`,
      });

      setShowActionDialog(false);
      setActionComments('');
      setPendingAction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process approval action",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysPending = (submittedAt: string) => {
    const submitted = new Date(submittedAt);
    const now = new Date();
    return Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Approval Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Approval Workflow Status
              </CardTitle>
              <CardDescription>
                Purchase Order: {currentWorkflow.poId} • 
                Submitted {getDaysPending(currentWorkflow.submittedAt || '')} days ago
              </CardDescription>
            </div>
            <Badge className={getStatusColor(currentWorkflow.status)}>
              {getStatusIcon(currentWorkflow.status)}
              <span className="ml-1 capitalize">
                {currentWorkflow.status.replace('_', ' ')}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {currentWorkflow.levels.filter(l => l.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {currentWorkflow.levels.filter(l => l.status === 'pending' && l.isRequired).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getDaysPending(currentWorkflow.submittedAt || '')}
                </div>
                <div className="text-sm text-gray-600">Days in Process</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {currentWorkflow.escalationCount}
                </div>
                <div className="text-sm text-gray-600">Escalations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Workflow */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Levels</CardTitle>
              <CardDescription>
                Track progress through each approval level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWorkflow.levels.map((level, index) => (
                  <div 
                    key={level.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      level.isCurrent 
                        ? 'border-blue-200 bg-blue-50' 
                        : level.status === 'approved'
                        ? 'border-green-200 bg-green-50'
                        : level.status === 'rejected'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          level.isCurrent ? 'bg-blue-100' : 
                          level.status === 'approved' ? 'bg-green-100' :
                          level.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {getStatusIcon(level.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{level.name}</h4>
                            <Badge 
                              variant="outline"
                              className={getStatusColor(level.status)}
                            >
                              {level.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {level.approver && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {level.approver.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{level.approver.name}</span>
                              <span>•</span>
                              <span>{level.approver.role}</span>
                            </div>
                          )}

                          {level.approvedAt && (
                            <div className="text-sm text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDate(level.approvedAt)}
                            </div>
                          )}

                          {level.comments && (
                            <div className="mt-2 p-2 bg-white rounded text-sm">
                              <MessageSquare className="h-3 w-3 inline mr-1" />
                              {level.comments}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {canUserTakeAction(level) && mode === 'manage' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setPendingAction('approve');
                              setShowActionDialog(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPendingAction('request_changes');
                              setShowActionDialog(true);
                            }}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Request Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPendingAction('reject');
                              setShowActionDialog(true);
                            }}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Level Connection Line */}
                    {index < currentWorkflow.levels.length - 1 && level.isRequired && (
                      <div className="flex justify-center mt-3">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
              <CardDescription>
                Complete timeline of all approval actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWorkflow.history.map((item, index) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${
                        item.action === 'approve' ? 'bg-green-100' :
                        item.action === 'reject' ? 'bg-red-100' :
                        item.action === 'submit' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {item.action === 'approve' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {item.action === 'reject' && <XCircle className="h-4 w-4 text-red-600" />}
                        {item.action === 'submit' && <Send className="h-4 w-4 text-blue-600" />}
                        {item.action === 'request_changes' && <RotateCcw className="h-4 w-4 text-orange-600" />}
                        {item.action === 'escalate' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {item.action.charAt(0).toUpperCase() + item.action.slice(1).replace('_', ' ')}
                            {item.level > 0 && ` - Level ${item.level}`}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <span>{item.approver.name}</span>
                            <span>•</span>
                            <span>{formatDate(item.actionDate)}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-gray-500">
                            {item.previousStatus} → {item.newStatus}
                          </div>
                          <div className="font-medium">
                            ₹{item.poAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {item.comments && (
                        <div className="mt-2 p-2 bg-white rounded text-sm">
                          {item.comments}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applied Approval Rule</CardTitle>
              <CardDescription>
                The approval rule currently governing this purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentWorkflow.appliedRule && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Rule Name</Label>
                      <div className="text-sm text-gray-600">
                        {currentWorkflow.appliedRule.ruleName}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Amount Range</Label>
                      <div className="text-sm text-gray-600">
                        ₹{currentWorkflow.appliedRule.minAmount.toLocaleString()} - 
                        {currentWorkflow.appliedRule.maxAmount 
                          ? `₹${currentWorkflow.appliedRule.maxAmount.toLocaleString()}`
                          : 'No Limit'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">
                        {currentWorkflow.appliedRule.level1Required ? '✓' : '✗'}
                      </div>
                      <div className="text-sm">Level 1</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">
                        {currentWorkflow.appliedRule.level2Required ? '✓' : '✗'}
                      </div>
                      <div className="text-sm">Level 2</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">
                        {currentWorkflow.appliedRule.level3Required ? '✓' : '✗'}
                      </div>
                      <div className="text-sm">Level 3</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold">
                        {currentWorkflow.appliedRule.financeRequired ? '✓' : '✗'}
                      </div>
                      <div className="text-sm">Finance</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Auto-Approve Below</Label>
                    <div className="text-sm text-gray-600">
                      ₹{currentWorkflow.appliedRule.autoApproveBelow.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === 'approve' && 'Approve Purchase Order'}
              {pendingAction === 'reject' && 'Reject Purchase Order'}
              {pendingAction === 'request_changes' && 'Request Changes'}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === 'approve' && 'Confirm your approval of this purchase order.'}
              {pendingAction === 'reject' && 'Please provide a reason for rejecting this purchase order.'}
              {pendingAction === 'request_changes' && 'Specify what changes are required for this purchase order.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">
                {pendingAction === 'approve' ? 'Comments (Optional)' : 'Comments (Required)'}
              </Label>
              <Textarea
                id="comments"
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                placeholder={
                  pendingAction === 'approve' ? 'Add any additional comments...' :
                  pendingAction === 'reject' ? 'Explain why this purchase order is being rejected...' :
                  'Specify what changes are needed...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleApprovalAction(pendingAction!)}
              disabled={loading || (!actionComments.trim() && pendingAction !== 'approve')}
              className={
                pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                pendingAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                'bg-orange-600 hover:bg-orange-700'
              }
            >
              {loading ? 'Processing...' : 
                pendingAction === 'approve' ? 'Approve' :
                pendingAction === 'reject' ? 'Reject' : 'Request Changes'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrderApproval;