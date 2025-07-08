import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppLayout from "./components/Layout/AppLayout";

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-management" element={<ClientManagement />} />
              <Route path="/data-ingestion" element={<DataIngestion />} />
              <Route path="/reconciliation" element={<Reconciliation />} />
              <Route path="/notice-response" element={<NoticeResponse />} />
              <Route path="/digital-signature" element={<DigitalSignature />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/document-center" element={<DocumentCenter />} />
              <Route path="/task-scheduler" element={<TaskScheduler />} />
              <Route path="/workflow-manager" element={<WorkflowManager />} />
              <Route path="/tax-returns" element={<TaxReturns />} />
              <Route path="/practice-os" element={<PracticeOS />} />
              <Route path="/compliance-engine" element={<ComplianceEngine />} />
              <Route path="/audit-command-centre" element={<AuditCommandCentre />} />
              <Route path="/ai-advisory-suite" element={<AIAdvisorySuite />} />
              <Route path="/priorities" element={<TodaysPriorities />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
