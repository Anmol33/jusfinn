import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppLayout from "./components/Layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Import all pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ClientManagement from './pages/ClientManagement';
import DataIngestion from './pages/DataIngestion';
import Reconciliation from './pages/Reconciliation';
import NoticeResponse from './pages/NoticeResponse';
import DigitalSignature from './pages/DigitalSignature';
import ClientPortal from './pages/ClientPortal';
import DocumentCenter from './pages/DocumentCenter';
import TaskScheduler from './pages/TaskScheduler';
import WorkflowManager from './pages/WorkflowManager';
import TaxReturns from './pages/TaxReturns';
import PracticeOS from './pages/PracticeOS';
import ComplianceEngine from './pages/ComplianceEngine';
import AuditCommandCentre from './pages/AuditCommandCentre';
import AIAdvisorySuite from './pages/AIAdvisorySuite';
import NotFound from './pages/NotFound';
import TodaysPriorities from './pages/TodaysPriorities';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import SignIn from './pages/SignIn';
import AuthCallback from './pages/AuthCallback';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/client-management" element={
                <ProtectedRoute>
                  <ClientManagement />
                </ProtectedRoute>
              } />
              <Route path="/data-ingestion" element={
                <ProtectedRoute>
                  <DataIngestion />
                </ProtectedRoute>
              } />
              <Route path="/reconciliation" element={
                <ProtectedRoute>
                  <Reconciliation />
                </ProtectedRoute>
              } />
              <Route path="/notice-response" element={
                <ProtectedRoute>
                  <NoticeResponse />
                </ProtectedRoute>
              } />
              <Route path="/digital-signature" element={
                <ProtectedRoute>
                  <DigitalSignature />
                </ProtectedRoute>
              } />
              <Route path="/client-portal" element={
                <ProtectedRoute>
                  <ClientPortal />
                </ProtectedRoute>
              } />
              <Route path="/document-center" element={
                <ProtectedRoute>
                  <DocumentCenter />
                </ProtectedRoute>
              } />
              <Route path="/task-scheduler" element={
                <ProtectedRoute>
                  <TaskScheduler />
                </ProtectedRoute>
              } />
              <Route path="/workflow-manager" element={
                <ProtectedRoute>
                  <WorkflowManager />
                </ProtectedRoute>
              } />
              <Route path="/tax-returns" element={
                <ProtectedRoute>
                  <TaxReturns />
                </ProtectedRoute>
              } />
              <Route path="/practice-os" element={<PracticeOS />} />
              <Route path="/compliance-engine" element={
                <ProtectedRoute>
                  <ComplianceEngine />
                </ProtectedRoute>
              } />
              <Route path="/audit-command-centre" element={
                <ProtectedRoute>
                  <AuditCommandCentre />
                </ProtectedRoute>
              } />
              <Route path="/ai-advisory-suite" element={
                <ProtectedRoute>
                  <AIAdvisorySuite />
                </ProtectedRoute>
              } />
              <Route path="/priorities" element={
                <ProtectedRoute>
                  <TodaysPriorities />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
