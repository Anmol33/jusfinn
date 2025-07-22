import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PurchaseExpenseApiService } from '@/lib/purchaseExpenseApi';

const TestBackendIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const runTests = async () => {
    setLoading(true);
    const results: any[] = [];

    // Test 1: Get Vendors
    try {
      console.log('🧪 Testing vendor API...');
      const vendors = await PurchaseExpenseApiService.getVendors(0, 5);
      results.push({
        test: 'Get Vendors',
        status: 'success',
        data: vendors,
        message: `Found ${vendors.length} vendors`
      });
    } catch (error) {
      results.push({
        test: 'Get Vendors',
        status: 'error',
        error: error,
        message: 'Failed to fetch vendors'
      });
    }

    // Test 2: Get Purchase Orders
    try {
      console.log('🧪 Testing purchase orders API...');
      const purchaseOrders = await PurchaseExpenseApiService.getPurchaseOrders();
      results.push({
        test: 'Get Purchase Orders',
        status: 'success',
        data: purchaseOrders,
        message: `Found ${purchaseOrders.length} purchase orders`
      });
    } catch (error) {
      results.push({
        test: 'Get Purchase Orders',
        status: 'error',
        error: error,
        message: 'Failed to fetch purchase orders'
      });
    }

    // Test 3: Get Expenses
    try {
      console.log('🧪 Testing expenses API...');
      const expenses = await PurchaseExpenseApiService.getExpenses();
      results.push({
        test: 'Get Expenses',
        status: 'success',
        data: expenses,
        message: `Found ${expenses.length} expenses`
      });
    } catch (error) {
      results.push({
        test: 'Get Expenses',
        status: 'error',
        error: error,
        message: 'Failed to fetch expenses'
      });
    }

    setTestResults(results);
    setLoading(false);

    // Show summary toast
    const successCount = results.filter(r => r.status === 'success').length;
    const totalTests = results.length;
    
    toast({
      title: "Integration Test Complete",
      description: `${successCount}/${totalTests} tests passed`,
      variant: successCount === totalTests ? "default" : "destructive",
    });
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Backend Integration Test
          </h1>
          <p className="text-gray-600 mt-2">
            Testing Purchase & Expense API connectivity
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              API Integration Tests
            </CardTitle>
            <CardDescription>
              Verifying backend connectivity and data flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Test Status:</span>
              <Button 
                onClick={runTests} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Re-run Tests'
                )}
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {result.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={result.status === 'success' ? 'default' : 'destructive'}
                    >
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {testResults.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Test Data Preview:</h3>
                <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                  {JSON.stringify(testResults.map(r => ({
                    test: r.test,
                    status: r.status,
                    dataCount: Array.isArray(r.data) ? r.data.length : 'N/A'
                  })), null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.reduce((sum, r) => 
                    sum + (Array.isArray(r.data) ? r.data.length : 0), 0
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestBackendIntegration; 