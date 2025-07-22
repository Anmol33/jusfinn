import React from 'react';
import { Helmet } from 'react-helmet-async';
import ApprovalDashboard from '@/components/ApprovalDashboard';

const ApprovalDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Approval Dashboard - Jusfinn</title>
        <meta 
          name="description" 
          content="Manage and track purchase order approvals, view pending approvals, and monitor approval workflows in Jusfinn." 
        />
      </Helmet>
      
      <ApprovalDashboard currentUserId="current-user" userRole="manager" />
    </div>
  );
};

export default ApprovalDashboardPage;