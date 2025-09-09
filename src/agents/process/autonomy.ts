import { BaseAgent } from '../types';
import { AgentTaskContext, AgentResult } from '../types';
import { CoreCRM, RecordType } from '../../core/crm/CoreCRM';

/**
 * Process Autonomy Agent (Pipefy-style)
 * Executes goal-oriented SDR/RevOps workflows with guardrails
 */
class ProcessAutonomyAgent extends BaseAgent {
  constructor() {
    super(
      'process-autonomy',
      'Process Autonomy Agent',
      'Pipefy-style goal-oriented SDR and RevOps workflow automation with guardrails',
      ['process.autonomy'],
      '1.0.0'
    );
  }

  async execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const { payload, coreCRM } = context;
      const { goal, recordType, recordId, parameters = {} } = payload;

      if (!goal) {
        return this.createErrorResult('Goal is required for process autonomy');
      }

      console.log(`Executing autonomous process: ${goal}`);

      // Execute the specified workflow
      let result;
      switch (goal) {
        case 'qualify_lead':
          result = await this.executeLeadQualificationWorkflow(coreCRM, recordId, parameters);
          break;
        case 'nurture_prospect':
          result = await this.executeProspectNurtureWorkflow(coreCRM, recordType as RecordType, recordId, parameters);
          break;
        case 'deal_health_check':
          result = await this.executeDealHealthCheckWorkflow(coreCRM, recordId, parameters);
          break;
        case 'account_expansion':
          result = await this.executeAccountExpansionWorkflow(coreCRM, recordId, parameters);
          break;
        case 'renewal_preparation':
          result = await this.executeRenewalPreparationWorkflow(coreCRM, recordId, parameters);
          break;
        default:
          return this.createErrorResult(`Unknown workflow goal: ${goal}`);
      }

      // Audit the execution
      await this.auditExecution(
        { ...context, capability: 'process.autonomy', startTime },
        this.createSuccessResult(result)
      );

      return this.createSuccessResult(result, {
        duration: Date.now() - startTime,
      });

    } catch (error) {
      console.error('Error in process autonomy:', error);
      return this.createErrorResult(error, { duration: Date.now() - startTime });
    }
  }

  canHandle(capability: string, context: AgentTaskContext): boolean {
    return capability === 'process.autonomy' && !!context.payload?.goal;
  }

  /**
   * Lead Qualification Workflow
   * Validates, enriches, routes, and notifies
   */
  private async executeLeadQualificationWorkflow(
    coreCRM: CoreCRM, 
    leadId: string, 
    parameters: any
  ): Promise<any> {
    const workflow = {
      name: 'Lead Qualification',
      steps: [],
      guardrails: {
        maxEnrichmentCost: parameters.maxEnrichmentCost || 100,
        requireManagerApproval: parameters.requireManagerApproval || false,
        autoRouting: parameters.autoRouting !== false,
      },
    };

    const stepResults = [];

    try {
      // Step 1: Validate lead data
      console.log('Step 1: Validating lead data');
      const validationResult = await this.validateLeadData(coreCRM, leadId);
      stepResults.push({
        step: 'validation',
        status: validationResult.valid ? 'success' : 'warning',
        details: validationResult,
      });

      if (!validationResult.valid && validationResult.critical) {
        throw new Error(`Critical validation failure: ${validationResult.errors.join(', ')}`);
      }

      // Step 2: Enrich lead data (with cost guardrail)
      console.log('Step 2: Enriching lead data');
      const enrichmentResult = await this.enrichLeadWithGuardrails(
        coreCRM, 
        leadId, 
        workflow.guardrails.maxEnrichmentCost
      );
      stepResults.push({
        step: 'enrichment',
        status: 'success',
        details: enrichmentResult,
      });

      // Step 3: Score and qualify lead
      console.log('Step 3: Scoring and qualifying lead');
      const scoringResult = await this.scoreAndQualifyLead(coreCRM, leadId, enrichmentResult);
      stepResults.push({
        step: 'scoring',
        status: 'success',
        details: scoringResult,
      });

      // Step 4: Route lead (with approval guardrail)
      console.log('Step 4: Routing lead');
      const routingResult = await this.routeLeadWithApproval(
        coreCRM, 
        leadId, 
        scoringResult, 
        workflow.guardrails
      );
      stepResults.push({
        step: 'routing',
        status: 'success',
        details: routingResult,
      });

      // Step 5: Create follow-up activities
      console.log('Step 5: Creating follow-up activities');
      const activityResult = await this.createQualificationActivities(coreCRM, leadId, scoringResult);
      stepResults.push({
        step: 'activities',
        status: 'success',
        details: activityResult,
      });

      // Step 6: Send notifications
      console.log('Step 6: Sending notifications');
      const notificationResult = await this.sendQualificationNotifications(
        coreCRM, 
        leadId, 
        scoringResult, 
        routingResult
      );
      stepResults.push({
        step: 'notifications',
        status: 'success',
        details: notificationResult,
      });

      return {
        workflow,
        leadId,
        finalScore: scoringResult.score,
        qualification: scoringResult.qualification,
        assignedOwner: routingResult.assignedOwner,
        stepsExecuted: stepResults,
        summary: this.generateWorkflowSummary(stepResults),
        telemetry: this.generateTelemetry(stepResults),
      };

    } catch (error) {
      console.error('Workflow execution failed:', error);
      stepResults.push({
        step: 'error',
        status: 'failed',
        details: { error: error.message },
      });

      return {
        workflow,
        leadId,
        error: error.message,
        stepsExecuted: stepResults,
        telemetry: this.generateTelemetry(stepResults),
      };
    }
  }

  /**
   * Prospect Nurture Workflow
   */
  private async executeProspectNurtureWorkflow(
    coreCRM: CoreCRM,
    recordType: RecordType,
    recordId: string,
    parameters: any
  ): Promise<any> {
    const workflow = {
      name: 'Prospect Nurture',
      recordType,
      recordId,
      parameters,
    };

    // Get the record
    const record = await coreCRM.getRecord(recordType, recordId);
    if (!record) {
      throw new Error(`Record not found: ${recordType}:${recordId}`);
    }

    // Determine nurture strategy based on record characteristics
    const strategy = this.determineNurtureStrategy(record, recordType);

    // Execute nurture activities
    const activities = await this.executeNurtureActivities(coreCRM, recordType, recordId, strategy);

    return {
      workflow,
      strategy,
      activitiesCreated: activities.length,
      activities,
      nextReviewDate: this.calculateNextReviewDate(strategy),
    };
  }

  /**
   * Deal Health Check Workflow
   */
  private async executeDealHealthCheckWorkflow(
    coreCRM: CoreCRM,
    dealId: string,
    parameters: any
  ): Promise<any> {
    const deal = await coreCRM.getRecord('DEAL', dealId);
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    // Analyze deal health
    const healthAnalysis = this.analyzeDealHealth(deal);

    // Create recommendations
    const recommendations = this.generateDealRecommendations(healthAnalysis);

    // Update deal if needed
    if (healthAnalysis.riskScore !== deal.riskScore) {
      await coreCRM.updateRecord('DEAL', dealId, {
        riskScore: healthAnalysis.riskScore,
        nextStep: recommendations.nextStep,
      });
    }

    // Create activities for recommendations
    const activities = [];
    for (const rec of recommendations.actions) {
      const activity = await coreCRM.createActivity({
        subject: rec.title,
        body: rec.description,
        relatedId: dealId,
        recordType: 'DEAL',
        type: rec.type as any,
        dueDate: rec.dueDate,
      });
      activities.push(activity);
    }

    return {
      workflow: { name: 'Deal Health Check', dealId },
      healthScore: healthAnalysis.healthScore,
      riskScore: healthAnalysis.riskScore,
      riskFactors: healthAnalysis.riskFactors,
      recommendations,
      activitiesCreated: activities.length,
    };
  }

  /**
   * Account Expansion Workflow
   */
  private async executeAccountExpansionWorkflow(
    coreCRM: CoreCRM,
    accountId: string,
    parameters: any
  ): Promise<any> {
    const account = await coreCRM.getRecord('ACCOUNT', accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }

    // Analyze expansion opportunities
    const opportunities = this.identifyExpansionOpportunities(account);

    // Create expansion activities
    const activities = [];
    for (const opportunity of opportunities) {
      const activity = await coreCRM.createActivity({
        subject: `Expansion Opportunity: ${opportunity.title}`,
        body: opportunity.description,
        relatedId: accountId,
        recordType: 'ACCOUNT',
        type: 'TASK',
        dueDate: opportunity.dueDate,
      });
      activities.push(activity);
    }

    return {
      workflow: { name: 'Account Expansion', accountId },
      opportunities,
      activitiesCreated: activities.length,
      estimatedRevenue: opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0),
    };
  }

  /**
   * Renewal Preparation Workflow
   */
  private async executeRenewalPreparationWorkflow(
    coreCRM: CoreCRM,
    dealId: string,
    parameters: any
  ): Promise<any> {
    const deal = await coreCRM.getRecord('DEAL', dealId);
    if (!deal) {
      throw new Error(`Deal not found: ${dealId}`);
    }

    // Check if deal is eligible for renewal
    if (!deal.closeDate || new Date(deal.closeDate) > new Date()) {
      throw new Error('Deal is not eligible for renewal preparation');
    }

    // Prepare renewal checklist
    const checklist = this.generateRenewalChecklist(deal);

    // Create renewal preparation activities
    const activities = [];
    for (const item of checklist) {
      const activity = await coreCRM.createActivity({
        subject: `Renewal Prep: ${item.title}`,
        body: item.description,
        relatedId: dealId,
        recordType: 'DEAL',
        type: item.type as any,
        dueDate: item.dueDate,
      });
      activities.push(activity);
    }

    return {
      workflow: { name: 'Renewal Preparation', dealId },
      checklist,
      activitiesCreated: activities.length,
      renewalRiskScore: this.calculateRenewalRisk(deal),
    };
  }

  // Helper methods for workflow steps

  private async validateLeadData(coreCRM: CoreCRM, leadId: string): Promise<any> {
    const lead = await coreCRM.getRecord('LEAD', leadId);
    if (!lead) {
      return { valid: false, critical: true, errors: ['Lead not found'] };
    }

    const errors = [];
    const warnings = [];

    if (!lead.email) errors.push('Email is required');
    if (!lead.company) warnings.push('Company name is missing');
    if (!lead.firstName || !lead.lastName) warnings.push('Full name is incomplete');

    return {
      valid: errors.length === 0,
      critical: errors.length > 0,
      errors,
      warnings,
      score: Math.max(0, 100 - (errors.length * 30) - (warnings.length * 10)),
    };
  }

  private async enrichLeadWithGuardrails(
    coreCRM: CoreCRM, 
    leadId: string, 
    maxCost: number
  ): Promise<any> {
    // Simulate enrichment with cost tracking
    const enrichmentCost = Math.floor(Math.random() * 50) + 10;
    
    if (enrichmentCost > maxCost) {
      throw new Error(`Enrichment cost (${enrichmentCost}) exceeds limit (${maxCost})`);
    }

    // Simulate enrichment results
    const signals = [
      { key: 'job_title_verified', value: 'true', confidence: 0.9 },
      { key: 'company_size', value: '51-200', confidence: 0.8 },
      { key: 'industry', value: 'Technology', confidence: 0.95 },
    ];

    await coreCRM.writeEnrichmentSignals('LEAD', leadId, signals);

    return {
      signalsAdded: signals.length,
      cost: enrichmentCost,
      remainingBudget: maxCost - enrichmentCost,
    };
  }

  private async scoreAndQualifyLead(coreCRM: CoreCRM, leadId: string, enrichmentData: any): Promise<any> {
    const lead = await coreCRM.getRecord('LEAD', leadId);
    
    // Calculate lead score
    let score = 50; // Base score
    
    if (lead.email) score += 20;
    if (lead.company) score += 15;
    if (lead.phone) score += 10;
    
    // Bonus from enrichment
    score += enrichmentData.signalsAdded * 5;

    // Determine qualification
    let qualification = 'UNQUALIFIED';
    if (score >= 80) qualification = 'HOT';
    else if (score >= 60) qualification = 'WARM';
    else if (score >= 40) qualification = 'COLD';

    // Update lead
    await coreCRM.updateRecord('LEAD', leadId, {
      status: qualification === 'UNQUALIFIED' ? 'DISQUALIFIED' : 'QUALIFIED',
    });

    return { score, qualification, factors: ['Email present', 'Company identified'] };
  }

  private async routeLeadWithApproval(
    coreCRM: CoreCRM,
    leadId: string,
    scoringResult: any,
    guardrails: any
  ): Promise<any> {
    const assignedOwner = this.assignOwnerByScore(scoringResult.score);
    
    if (guardrails.requireManagerApproval && scoringResult.score > 80) {
      // Would normally create approval workflow
      console.log('High-value lead requires manager approval');
    }

    // Update lead owner
    await coreCRM.updateRecord('LEAD', leadId, { ownerId: assignedOwner });

    return { assignedOwner, approvalRequired: guardrails.requireManagerApproval };
  }

  private async createQualificationActivities(
    coreCRM: CoreCRM,
    leadId: string,
    scoringResult: any
  ): Promise<any[]> {
    const activities = [];

    // Always create a follow-up call
    const callActivity = await coreCRM.createActivity({
      subject: 'Qualified Lead Follow-up',
      body: `Follow up on qualified lead (Score: ${scoringResult.score})`,
      relatedId: leadId,
      recordType: 'LEAD',
      type: 'CALL',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    });
    activities.push(callActivity);

    // High-score leads get additional activities
    if (scoringResult.score > 70) {
      const researchActivity = await coreCRM.createActivity({
        subject: 'Account Research',
        body: 'Research company and key stakeholders before outreach',
        relatedId: leadId,
        recordType: 'LEAD',
        type: 'RESEARCH',
        dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      });
      activities.push(researchActivity);
    }

    return activities;
  }

  private async sendQualificationNotifications(
    coreCRM: CoreCRM,
    leadId: string,
    scoringResult: any,
    routingResult: any
  ): Promise<any> {
    // Simulate sending notifications
    const notifications = [
      {
        type: 'email',
        recipient: routingResult.assignedOwner,
        subject: `New Qualified Lead Assigned (Score: ${scoringResult.score})`,
      },
    ];

    if (scoringResult.score > 80) {
      notifications.push({
        type: 'slack',
        recipient: 'sales-team',
        subject: 'High-value lead qualified',
      });
    }

    return { notificationsSent: notifications.length, notifications };
  }

  // Additional helper methods...

  private determineNurtureStrategy(record: any, recordType: RecordType): any {
    return {
      type: 'educational',
      frequency: 'weekly',
      duration: '3 months',
      channels: ['email', 'linkedin'],
    };
  }

  private async executeNurtureActivities(
    coreCRM: CoreCRM,
    recordType: RecordType,
    recordId: string,
    strategy: any
  ): Promise<any[]> {
    return [
      await coreCRM.createActivity({
        subject: 'Send educational content',
        body: 'Share relevant industry insights',
        relatedId: recordId,
        recordType,
        type: 'EMAIL',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }),
    ];
  }

  private analyzeDealHealth(deal: any): any {
    let healthScore = 70; // Base score
    const riskFactors = [];

    if (!deal.nextStep) {
      healthScore -= 20;
      riskFactors.push('No clear next steps defined');
    }

    if (deal.riskScore && deal.riskScore > 0.7) {
      healthScore -= 30;
      riskFactors.push('High risk score detected');
    }

    return {
      healthScore: Math.max(0, healthScore),
      riskScore: deal.riskScore || 0.5,
      riskFactors,
    };
  }

  private generateDealRecommendations(healthAnalysis: any): any {
    return {
      nextStep: 'Schedule stakeholder alignment call',
      actions: [
        {
          title: 'Risk mitigation call',
          description: 'Address identified risk factors',
          type: 'CALL',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      ],
    };
  }

  private identifyExpansionOpportunities(account: any): any[] {
    return [
      {
        title: 'Additional user licenses',
        description: 'Explore additional user seat opportunities',
        estimatedValue: 50000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private generateRenewalChecklist(deal: any): any[] {
    return [
      {
        title: 'Review usage metrics',
        description: 'Analyze customer usage patterns',
        type: 'RESEARCH',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private calculateRenewalRisk(deal: any): number {
    return 0.3; // Simplified risk calculation
  }

  private assignOwnerByScore(score: number): string {
    if (score > 80) return 'senior-rep-001';
    if (score > 60) return 'mid-rep-001';
    return 'junior-rep-001';
  }

  private calculateNextReviewDate(strategy: any): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // One week
  }

  private generateWorkflowSummary(stepResults: any[]): string {
    const successful = stepResults.filter(s => s.status === 'success').length;
    const total = stepResults.length;
    return `Workflow completed: ${successful}/${total} steps successful`;
  }

  private generateTelemetry(stepResults: any[]): any {
    return {
      stepsExecuted: stepResults.length,
      executionTime: Date.now(),
      successRate: stepResults.filter(s => s.status === 'success').length / stepResults.length,
    };
  }
}

export default ProcessAutonomyAgent;