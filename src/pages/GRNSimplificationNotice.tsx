import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRNSimplificationNotice: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">GRN Process Simplified!</h1>
        <p className="text-lg text-muted-foreground">
          We've streamlined the Goods Receipt Note process for better efficiency
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            What's New?
          </CardTitle>
          <CardDescription>
            Based on user feedback, we've combined the GRN creation and workflow management into a single, intuitive interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold">Unified Interface</h3>
                <p className="text-sm text-muted-foreground">
                  Create GRNs and manage approvals all in one place
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Approve, reject, or view GRNs with one-click actions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold">Smart Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Get insights and quick stats at a glance
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold">Simplified Forms</h3>
                <p className="text-sm text-muted-foreground">
                  Quick GRN creation with essential fields only
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/goods-receipt-note">
          <Button size="lg" className="text-lg px-8">
            Go to Unified GRN
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            If you need assistance with the new interface, here are some quick tips:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Creating GRNs</h4>
              <p className="text-sm text-blue-700 mt-1">
                Use the "Create GRN" button for quick form-based creation
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Managing Approvals</h4>
              <p className="text-sm text-green-700 mt-1">
                View all pending approvals in the "All GRNs" tab with quick actions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GRNSimplificationNotice;