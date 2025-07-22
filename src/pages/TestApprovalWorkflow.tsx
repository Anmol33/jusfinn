import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PurchaseExpenseApiService } from '@/lib/purchaseExpenseApi';

const TestApprovalWorkflow = () => {
  const { toast } = useToast();
  const [testPoId, setTestPoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const addTestResult = (result: any) => {
    setTestResults(prev => [...prev, { ...result, timestamp: new Date().toISOString() }]);
  };

  const testSubmitForApproval = async () => {
    if (!testPoId) {
      toast({
        title: 'Error',
        description: 'Please enter a Purchase Order ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await PurchaseExpenseApiService.submitPurchaseOrderForApproval(testPoId);
      
      addTestResult({
        action: 'Submit for Approval',
        success: true,
        response,
        error: null
      });

      toast({
        title: 'Success',
        description: 'PO submitted for approval successfully',
      });
    } catch (error: any) {
      addTestResult({
        action: 'Submit for Approval',
        success: false,
        response: null,
        error: error.message
      });

      toast({
        title: 'Error',
        description: `Failed to submit: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testApprovalAction = async (action: 'approve' | 'reject' | 'request_changes') => {
    if (!testPoId) {
      toast({
        title: 'Error',
        description: 'Please enter a Purchase Order ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await PurchaseExpenseApiService.processPurchaseOrderApproval(
        testPoId, 
        action, 
        `Test ${action} action`
      );
      
      addTestResult({
        action: `Approval Action: ${action}`,
        success: true,
        response,
        error: null
      });

      toast({
        title: 'Success',
        description: `PO ${action} processed successfully`,
      });
    } catch (error: any) {
      addTestResult({
        action: `Approval Action: ${action}`,
        success: false,
        response: null,
        error: error.message
      });

      toast({
        title: 'Error',
        description: `Failed to ${action}: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testOperationalStatusUpdate = async (status: string) => {
    if (!testPoId) {
      toast({
        title: 'Error',
        description: 'Please enter a Purchase Order ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await PurchaseExpenseApiService.updatePurchaseOrderOperationalStatus(
        testPoId, 
        status
      );
      
      addTestResult({
        action: `Update Operational Status: ${status}`,
        success: true,
        response,
        error: null
      });

      toast({
        title: 'Success',
        description: `Operational status updated to ${status}`,
      });
    } catch (error: any) {
      addTestResult({
        action: `Update Operational Status: ${status}`,
        success: false,
        response: null,
        error: error.message
      });

      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Approval Workflow Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Purchase Order ID
                </label>
                <Input
                  value={testPoId}
                  onChange={(e) => setTestPoId(e.target.value)}
                  placeholder="Enter PO ID to test..."
                />
              </div>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Button
                onClick={testSubmitForApproval}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit for Approval
              </Button>
              
              <Button
                onClick={() => testApprovalAction('approve')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              
              <Button
                onClick={() => testApprovalAction('reject')}
                disabled={loading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Reject
              </Button>
              
              <Button
                onClick={() => testApprovalAction('request_changes')}
                disabled={loading}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Request Changes
              </Button>
              
              <Button
                onClick={() => testOperationalStatusUpdate('IN_PROGRESS')}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Mark In Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'SUCCESS' : 'ERROR'}
                        </Badge>
                        <span className="font-medium">{result.action}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {result.success && result.response && (
                      <div className="bg-green-50 p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {!result.success && result.error && (
                      <div className="bg-red-50 p-3 rounded text-sm text-red-700">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestApprovalWorkflow;