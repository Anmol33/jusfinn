import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VendorApiService } from '@/lib/vendor.api';
import { PurchaseOrderApiService } from '@/lib/purchaseOrder.api';
import { GRNApiService } from '@/lib/grn.api';

interface TestResults {
  vendors?: any[];
  purchaseOrders?: any[];
  grns?: any[];
}

const TestBackendIntegration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);

  const testVendorAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing Vendor API...');
      const vendors = await VendorApiService.getVendors(0, 5);
      console.log('Vendors:', vendors);
      setResults({ vendors });
      
      toast({
        title: "Success",
        description: `Loaded ${vendors.length} vendors successfully`,
      });
    } catch (error) {
      console.error('Vendor API test failed:', error);
      toast({
        title: "Error",
        description: "Failed to test Vendor API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testPurchaseOrderAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing Purchase Order API...');
      const purchaseOrders = await PurchaseOrderApiService.getPurchaseOrders();
      console.log('Purchase Orders:', purchaseOrders);
      setResults({ purchaseOrders });
      
      toast({
        title: "Success",
        description: `Loaded ${purchaseOrders.length} purchase orders successfully`,
      });
    } catch (error) {
      console.error('Purchase Order API test failed:', error);
      toast({
        title: "Error",
        description: "Failed to test Purchase Order API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testGRNAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing GRN API...');
      const grns = await GRNApiService.getGRNs();
      console.log('GRNs:', grns);
      setResults({ grns });
      
      toast({
        title: "Success",
        description: `Loaded ${grns.length} GRNs successfully`,
      });
    } catch (error) {
      console.error('GRN API test failed:', error);
      toast({
        title: "Error",
        description: "Failed to test GRN API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                onClick={testVendorAPI} 
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

            {results && (
              <div className="space-y-3">
                <div 
                  key="vendor-test"
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Get Vendors</div>
                      <div className="text-sm text-gray-600">
                        {results.vendors ? `Loaded ${results.vendors.length} vendors` : 'Failed to load vendors'}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={results.vendors ? 'default' : 'destructive'}
                  >
                    {results.vendors ? 'Success' : 'Error'}
                  </Badge>
                </div>

                <div 
                  key="purchase-order-test"
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Get Purchase Orders</div>
                      <div className="text-sm text-gray-600">
                        {results.purchaseOrders ? `Loaded ${results.purchaseOrders.length} purchase orders` : 'Failed to load purchase orders'}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={results.purchaseOrders ? 'default' : 'destructive'}
                  >
                    {results.purchaseOrders ? 'Success' : 'Error'}
                  </Badge>
                </div>

                <div 
                  key="grn-test"
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Get GRNs</div>
                      <div className="text-sm text-gray-600">
                        {results.grns ? `Loaded ${results.grns.length} GRNs` : 'Failed to load GRNs'}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={results.grns ? 'default' : 'destructive'}
                  >
                    {results.grns ? 'Success' : 'Error'}
                  </Badge>
                </div>
              </div>
            )}

            {results && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Test Data Preview:</h3>
                <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                  {JSON.stringify(results, null, 2)}
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
                  {results?.vendors?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Vendors</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results?.purchaseOrders?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Purchase Orders</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {results?.grns?.length || 0}
                </div>
                <div className="text-sm text-gray-600">GRNs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestBackendIntegration; 