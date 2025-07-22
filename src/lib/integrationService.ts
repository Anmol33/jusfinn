// Integration Service for Cross-Module Data Flow
// Handles communication, workflow automation, and data synchronization across all Purchase & Expense modules

import {
  WorkflowReference,
  VendorIntegration,
  PurchaseOrderIntegration,
  GRNIntegration,
  BillIntegration,
  PaymentIntegration,
  ITCIntegration,
  TDSIntegration,
  LandedCostIntegration,
  CrossModuleAlert,
  DashboardMetrics,
  WorkflowAutomation,
  AutomationAction,
  IntegrationEvent,
  IntegrationResponse,
  CrossModuleSearch,
  AggregatedData
} from '@/types/integration';

class IntegrationService {
  private static instance: IntegrationService;
  private eventListeners: Map<string, Function[]> = new Map();
  private eventQueue: IntegrationEvent[] = [];
  private automationRules: WorkflowAutomation[] = [];
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  private initializeService(): void {
    // Start event processing
    this.processingInterval = setInterval(() => {
      this.processEventQueue();
    }, 1000);

    // Load automation rules
    this.loadAutomationRules();
  }

  // Event Management
  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public removeEventListener(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public emitEvent(event: IntegrationEvent): void {
    this.eventQueue.push(event);
    this.notifyListeners(event);
  }

  private notifyListeners(event: IntegrationEvent): void {
    const listeners = this.eventListeners.get(event.eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.processEvent(event);
        this.checkAutomationTriggers(event);
      }
    }
  }

  private processEvent(event: IntegrationEvent): void {
    // Mark event as processed
    event.processedBy.push('integration_service');

    // Update related records based on event type
    switch (event.eventType) {
      case 'create':
        this.handleCreateEvent(event);
        break;
      case 'update':
        this.handleUpdateEvent(event);
        break;
      case 'status_change':
        this.handleStatusChangeEvent(event);
        break;
    }
  }

  // Cross-Module Workflow Management
  public async createPurchaseOrderWorkflow(poData: any): Promise<IntegrationResponse<WorkflowReference[]>> {
    try {
      const workflow: WorkflowReference[] = [];
      
      // Create PO reference
      const poRef: WorkflowReference = {
        id: poData.id,
        type: 'purchase_order',
        number: poData.poNumber,
        status: poData.status,
        date: poData.poDate,
        amount: poData.finalAmount,
        childReferences: []
      };
      
      workflow.push(poRef);

      // Emit creation event
      this.emitEvent({
        id: `${Date.now()}_po_create`,
        eventType: 'create',
        sourceModule: 'purchase_orders',
        sourceRecordId: poData.id,
        sourceRecordType: 'purchase_order',
        eventData: poData,
        timestamp: new Date().toISOString(),
        processedBy: [],
        processingErrors: []
      });

      return {
        success: true,
        data: workflow,
        relatedRecords: [poRef]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async linkGRNToPO(grnData: any, poId: string): Promise<IntegrationResponse<WorkflowReference[]>> {
    try {
      // Update PO status
      await this.updatePurchaseOrderStatus(poId, 'partially_received', {
        grnGenerated: true,
        grnIds: [grnData.id]
      });

      // Create workflow link
      const grnRef: WorkflowReference = {
        id: grnData.id,
        type: 'grn',
        number: grnData.grnNumber,
        status: grnData.status,
        date: grnData.grnDate,
        amount: grnData.totalValue || 0,
        parentReferences: [{
          id: poId,
          type: 'purchase_order',
          number: grnData.poNumber,
          status: 'partially_received',
          date: '',
          amount: 0
        }]
      };

      // Emit linking event
      this.emitEvent({
        id: `${Date.now()}_grn_link`,
        eventType: 'create',
        sourceModule: 'goods_receipt_note',
        sourceRecordId: grnData.id,
        sourceRecordType: 'grn',
        eventData: { ...grnData, linkedPO: poId },
        timestamp: new Date().toISOString(),
        processedBy: [],
        processingErrors: []
      });

      return {
        success: true,
        data: [grnRef],
        relatedRecords: [grnRef]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async processThreeWayMatching(billData: any, poId?: string, grnId?: string): Promise<IntegrationResponse<any>> {
    try {
      const matchingResult = {
        matched: false,
        discrepancies: [],
        confidence: 0,
        details: {}
      };

      // Simulate three-way matching logic
      if (poId && grnId) {
        // In real implementation, fetch PO and GRN data and compare
        matchingResult.matched = true;
        matchingResult.confidence = 95;
        matchingResult.details = {
          poMatched: true,
          grnMatched: true,
          amountVariance: 0,
          quantityVariance: 0
        };
      }

      // Update bill with matching results
      await this.updateBillMatchingStatus(billData.id, matchingResult);

      // Generate ITC record if GST bill
      if (billData.totalCgst + billData.totalSgst + billData.totalIgst > 0) {
        await this.generateITCRecord(billData);
      }

      return {
        success: true,
        data: matchingResult
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async processPayment(paymentData: any, billIds: string[]): Promise<IntegrationResponse<any>> {
    try {
      const results = [];

      for (const billId of billIds) {
        // Update bill payment status
        await this.updateBillPaymentStatus(billId, paymentData.amount, paymentData.id);

        // Calculate TDS if applicable
        const tdsResult = await this.calculateAndDeductTDS(billId, paymentData);
        if (tdsResult.tdsDeducted > 0) {
          results.push(tdsResult);
        }

        // Update payables aging
        await this.updatePayablesAging(billId, paymentData);
      }

      // Emit payment event
      this.emitEvent({
        id: `${Date.now()}_payment_process`,
        eventType: 'create',
        sourceModule: 'payment_processing',
        sourceRecordId: paymentData.id,
        sourceRecordType: 'payment',
        eventData: { ...paymentData, billIds },
        timestamp: new Date().toISOString(),
        processedBy: [],
        processingErrors: []
      });

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Cross-Module Search and Aggregation
  public async searchAcrossModules(searchParams: CrossModuleSearch): Promise<IntegrationResponse<any[]>> {
    try {
      const results = [];

      // Search in each requested module
      for (const module of searchParams.modules) {
        const moduleResults = await this.searchInModule(module, searchParams);
        results.push(...moduleResults);
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async getAggregatedVendorData(vendorId: string): Promise<IntegrationResponse<AggregatedData>> {
    try {
      // Fetch data from all modules for this vendor
      const [
        vendor,
        purchaseOrders,
        grns,
        bills,
        payments,
        itcRecords,
        tdsRecords,
        landedCosts
      ] = await Promise.all([
        this.getVendorDetails(vendorId),
        this.getVendorPurchaseOrders(vendorId),
        this.getVendorGRNs(vendorId),
        this.getVendorBills(vendorId),
        this.getVendorPayments(vendorId),
        this.getVendorITCRecords(vendorId),
        this.getVendorTDSRecords(vendorId),
        this.getVendorLandedCosts(vendorId)
      ]);

      const aggregatedData: AggregatedData = {
        vendorId,
        vendorName: vendor?.companyName || '',
        purchaseOrders: purchaseOrders || [],
        grns: grns || [],
        bills: bills || [],
        payments: payments || [],
        itcRecords: itcRecords || [],
        tdsRecords: tdsRecords || [],
        landedCosts: landedCosts || [],
        totalSpend: bills?.reduce((sum, bill) => sum + bill.totalAmount, 0) || 0,
        totalOutstanding: bills?.reduce((sum, bill) => sum + bill.outstandingAmount, 0) || 0,
        totalTDS: tdsRecords?.reduce((sum, tds) => sum + tds.tdsAmount, 0) || 0,
        totalITC: itcRecords?.reduce((sum, itc) => sum + itc.itcClaimedAmount, 0) || 0
      };

      return {
        success: true,
        data: aggregatedData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Dashboard and Reporting
  public async getDashboardMetrics(): Promise<IntegrationResponse<DashboardMetrics>> {
    try {
      // Aggregate metrics from all modules
      const metrics: DashboardMetrics = {
        totalVendors: await this.getTotalVendors(),
        activeVendors: await this.getActiveVendors(),
        totalPOs: await this.getTotalPOs(),
        pendingPOs: await this.getPendingPOs(),
        totalGRNs: await this.getTotalGRNs(),
        pendingGRNs: await this.getPendingGRNs(),
        totalBills: await this.getTotalBills(),
        pendingBills: await this.getPendingBills(),
        totalPayments: await this.getTotalPayments(),
        outstandingPayables: await this.getOutstandingPayables(),
        totalTDS: await this.getTotalTDS(),
        totalITC: await this.getTotalITC(),
        msmeCompliance: await this.getMSMECompliance(),
        monthlyTrends: await this.getMonthlyTrends()
      };

      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Workflow Automation
  private async checkAutomationTriggers(event: IntegrationEvent): Promise<void> {
    const applicableRules = this.automationRules.filter(rule => 
      rule.isActive && rule.triggerModule === event.sourceModule
    );

    for (const rule of applicableRules) {
      if (this.evaluateCondition(rule.triggerCondition, event)) {
        await this.executeAutomationActions(rule.actions, event);
        rule.lastExecuted = new Date().toISOString();
        rule.executionCount++;
      }
    }
  }

  private evaluateCondition(condition: string, event: IntegrationEvent): boolean {
    // Simple condition evaluation - can be enhanced with a proper expression parser
    try {
      // Replace placeholders with actual values
      const evaluatedCondition = condition
        .replace(/\$\{event\.eventType\}/g, `"${event.eventType}"`)
        .replace(/\$\{event\.sourceRecordType\}/g, `"${event.sourceRecordType}"`);
      
      // Use eval for simple conditions (in production, use a proper expression parser)
      return eval(evaluatedCondition);
    } catch (error) {
      console.error('Condition evaluation error:', error);
      return false;
    }
  }

  private async executeAutomationActions(actions: AutomationAction[], event: IntegrationEvent): Promise<void> {
    const sortedActions = actions.sort((a, b) => a.order - b.order);

    for (const action of sortedActions) {
      try {
        switch (action.type) {
          case 'notification':
            await this.sendNotification(action.configuration, event);
            break;
          case 'status_update':
            await this.updateRecordStatus(action.configuration, event);
            break;
          case 'record_creation':
            await this.createRelatedRecord(action.configuration, event);
            break;
          case 'approval_request':
            await this.sendApprovalRequest(action.configuration, event);
            break;
        }
      } catch (error) {
        console.error(`Automation action error: ${action.type}`, error);
      }
    }
  }

  // Utility methods for automation actions
  private async sendNotification(config: Record<string, unknown>, event: IntegrationEvent): Promise<void> {
    // Implementation for sending notifications
    console.log('Sending notification:', config, event);
  }

  private async updateRecordStatus(config: Record<string, unknown>, event: IntegrationEvent): Promise<void> {
    // Implementation for updating record status
    console.log('Updating record status:', config, event);
  }

  private async createRelatedRecord(config: Record<string, unknown>, event: IntegrationEvent): Promise<void> {
    // Implementation for creating related records
    console.log('Creating related record:', config, event);
  }

  private async sendApprovalRequest(config: Record<string, unknown>, event: IntegrationEvent): Promise<void> {
    // Implementation for sending approval requests
    console.log('Sending approval request:', config, event);
  }

  // Helper methods (these would integrate with actual APIs in production)
  private async updatePurchaseOrderStatus(poId: string, status: string, updates: any): Promise<void> {
    // Mock implementation - would call actual API
    console.log(`Updating PO ${poId} status to ${status}`, updates);
  }

  private async updateBillMatchingStatus(billId: string, matchingResult: any): Promise<void> {
    console.log(`Updating bill ${billId} matching status`, matchingResult);
  }

  private async generateITCRecord(billData: any): Promise<void> {
    console.log('Generating ITC record for bill', billData.billNumber);
  }

  private async updateBillPaymentStatus(billId: string, amount: number, paymentId: string): Promise<void> {
    console.log(`Updating bill ${billId} payment status`, { amount, paymentId });
  }

  private async calculateAndDeductTDS(billId: string, paymentData: any): Promise<any> {
    // Mock TDS calculation
    return {
      tdsDeducted: paymentData.amount * 0.01, // 1% TDS
      tdsSection: '194C',
      certificateGenerated: true
    };
  }

  private async updatePayablesAging(billId: string, paymentData: any): Promise<void> {
    console.log(`Updating payables aging for bill ${billId}`, paymentData);
  }

  private async searchInModule(module: string, searchParams: CrossModuleSearch): Promise<any[]> {
    // Mock search implementation
    return [];
  }

  // Mock data fetching methods (these would be replaced with actual API calls)
  private async getVendorDetails(vendorId: string): Promise<VendorIntegration | null> {
    return null;
  }

  private async getVendorPurchaseOrders(vendorId: string): Promise<PurchaseOrderIntegration[]> {
    return [];
  }

  private async getVendorGRNs(vendorId: string): Promise<GRNIntegration[]> {
    return [];
  }

  private async getVendorBills(vendorId: string): Promise<BillIntegration[]> {
    return [];
  }

  private async getVendorPayments(vendorId: string): Promise<PaymentIntegration[]> {
    return [];
  }

  private async getVendorITCRecords(vendorId: string): Promise<ITCIntegration[]> {
    return [];
  }

  private async getVendorTDSRecords(vendorId: string): Promise<TDSIntegration[]> {
    return [];
  }

  private async getVendorLandedCosts(vendorId: string): Promise<LandedCostIntegration[]> {
    return [];
  }

  // Mock metric calculation methods
  private async getTotalVendors(): Promise<number> { return 0; }
  private async getActiveVendors(): Promise<number> { return 0; }
  private async getTotalPOs(): Promise<number> { return 0; }
  private async getPendingPOs(): Promise<number> { return 0; }
  private async getTotalGRNs(): Promise<number> { return 0; }
  private async getPendingGRNs(): Promise<number> { return 0; }
  private async getTotalBills(): Promise<number> { return 0; }
  private async getPendingBills(): Promise<number> { return 0; }
  private async getTotalPayments(): Promise<number> { return 0; }
  private async getOutstandingPayables(): Promise<number> { return 0; }
  private async getTotalTDS(): Promise<number> { return 0; }
  private async getTotalITC(): Promise<number> { return 0; }
  private async getMSMECompliance(): Promise<{ compliant: number; atRisk: number; violated: number; }> {
    return { compliant: 0, atRisk: 0, violated: 0 };
  }
  private async getMonthlyTrends(): Promise<any[]> { return []; }

  private loadAutomationRules(): void {
    // Load predefined automation rules
    this.automationRules = [
      {
        id: '1',
        name: 'Auto-approve low value POs',
        description: 'Automatically approve purchase orders under ₹10,000',
        triggerModule: 'purchase_orders',
        triggerCondition: '${event.eventType} === "create" && ${event.eventData.finalAmount} < 10000',
        actions: [
          {
            id: '1',
            type: 'status_update',
            targetModule: 'purchase_orders',
            configuration: { status: 'approved' },
            order: 1
          }
        ],
        isActive: true,
        createdDate: new Date().toISOString(),
        executionCount: 0
      }
    ];
  }

  // Event handler methods
  private handleCreateEvent(event: IntegrationEvent): void {
    console.log('Handling create event:', event);
  }

  private handleUpdateEvent(event: IntegrationEvent): void {
    console.log('Handling update event:', event);
  }

  private handleStatusChangeEvent(event: IntegrationEvent): void {
    console.log('Handling status change event:', event);
  }

  // Cleanup
  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.eventListeners.clear();
    this.eventQueue = [];
  }
}

// Export singleton instance
export const integrationService = IntegrationService.getInstance();
export default IntegrationService; 