import { BaseAgent } from '../types';
import { AgentTaskContext, AgentResult } from '../types';
import { CoreCRM, RecordType } from '../../core/crm/CoreCRM';

/**
 * Sequence Orchestrator Agent (Outreach-style)
 * Creates and manages multi-channel sales sequences
 */
class SequenceOrchestratorAgent extends BaseAgent {
  constructor() {
    super(
      'sequence-orchestrator',
      'Sales Sequence Orchestrator',
      'Outreach-style multi-channel sequence orchestration for sales execution',
      ['sequence.orchestrate'],
      '1.0.0'
    );
  }

  async execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const { payload, coreCRM } = context;
      const action = payload.action || 'create';

      let result;
      switch (action) {
        case 'create':
          result = await this.createSequence(coreCRM, payload);
          break;
        case 'enroll':
          result = await this.enrollInSequence(coreCRM, payload);
          break;
        case 'analyze':
          result = await this.analyzeSequencePerformance(coreCRM, payload);
          break;
        default:
          return this.createErrorResult(`Unknown action: ${action}`);
      }

      // Audit the execution
      await this.auditExecution(
        { ...context, capability: 'sequence.orchestrate', startTime },
        this.createSuccessResult(result)
      );

      return this.createSuccessResult(result, {
        duration: Date.now() - startTime,
      });

    } catch (error) {
      console.error('Error in sequence orchestration:', error);
      return this.createErrorResult(error instanceof Error ? error : new Error('Unknown error'), { duration: Date.now() - startTime });
    }
  }

  canHandle(capability: string, context: AgentTaskContext): boolean {
    return capability === 'sequence.orchestrate' && !!context.payload;
  }

  /**
   * Create a new multi-channel sequence
   */
  private async createSequence(coreCRM: CoreCRM, payload: any): Promise<any> {
    const {
      name,
      profile,
      template = 'default',
      customSteps,
    } = payload;

    if (!name || !profile) {
      throw new Error('Sequence name and target profile are required');
    }

    console.log(`Creating sequence: ${name} for profile: ${profile}`);

    // Create the sequence
    const sequence = await this.createSequenceInDatabase(coreCRM, name, profile);

    // Generate sequence steps based on template or custom steps
    const steps = customSteps || this.generateSequenceSteps(template, profile);

    // Create sequence steps
    const createdSteps = [];
    for (const step of steps) {
      const createdStep = await this.createSequenceStep(coreCRM, sequence.id, step);
      createdSteps.push(createdStep);
    }

    // Create an activity to log sequence creation
    await coreCRM.createActivity({
      subject: 'Sales Sequence Created',
      body: `Created multi-channel sequence "${name}" with ${steps.length} steps for ${profile} profile`,
      relatedId: sequence.id,
      recordType: 'ACCOUNT', // Default to account, could be more specific
      type: 'TASK',
    });

    return {
      sequence: {
        ...sequence,
        steps: createdSteps,
      },
      summary: {
        totalSteps: steps.length,
        channels: this.getChannelsFromSteps(steps),
        duration: this.getSequenceDuration(steps),
        template,
      },
    };
  }

  /**
   * Enroll a record in a sequence
   */
  private async enrollInSequence(coreCRM: CoreCRM, payload: any): Promise<any> {
    const {
      sequenceId,
      recordType,
      recordId,
    } = payload;

    if (!sequenceId || !recordType || !recordId) {
      throw new Error('Sequence ID, record type, and record ID are required for enrollment');
    }

    console.log(`Enrolling ${recordType}:${recordId} in sequence ${sequenceId}`);

    // Get the record to ensure it exists
    const record = await coreCRM.getRecord(recordType as RecordType, recordId);
    if (!record) {
      throw new Error(`Record not found: ${recordType}:${recordId}`);
    }

    // Enroll in sequence
    const enrollment = await coreCRM.enrollInSequence(sequenceId, recordType as RecordType, recordId);

    // Create activity for enrollment
    await coreCRM.createActivity({
      subject: 'Enrolled in Sales Sequence',
      body: `${recordType} enrolled in automated sales sequence`,
      relatedId: recordId,
      recordType: recordType as RecordType,
      type: 'TASK',
    });

    // Get sequence details
    const sequence = await this.getSequenceWithSteps(coreCRM, sequenceId);

    return {
      enrollment,
      sequence,
      nextActions: this.getNextActions(sequence, 0), // Day 0 actions
    };
  }

  /**
   * Analyze sequence performance
   */
  private async analyzeSequencePerformance(coreCRM: CoreCRM, payload: any): Promise<any> {
    const { sequenceId } = payload;

    if (!sequenceId) {
      throw new Error('Sequence ID is required for analysis');
    }

    console.log(`Analyzing performance for sequence ${sequenceId}`);

    // Get sequence with enrollments (simplified - would need more complex queries in real implementation)
    const sequence = await this.getSequenceWithSteps(coreCRM, sequenceId);
    const enrollments = await this.getSequenceEnrollments(coreCRM, sequenceId);

    // Calculate performance metrics
    const metrics = this.calculateSequenceMetrics(enrollments);
    const insights = this.generateSequenceInsights(sequence, enrollments, metrics);

    return {
      sequence,
      metrics,
      insights,
      recommendations: this.generateSequenceRecommendations(metrics, insights),
    };
  }

  /**
   * Generate sequence steps based on template
   */
  private generateSequenceSteps(template: string, profile: string): any[] {
    const templates = {
      default: this.getDefaultSequenceSteps(),
      aggressive: this.getAggressiveSequenceSteps(),
      nurture: this.getNurtureSequenceSteps(),
      executive: this.getExecutiveSequenceSteps(),
    };

    const baseSteps = templates[template as keyof typeof templates] || templates.default;

    // Customize based on profile
    return this.customizeStepsForProfile(baseSteps, profile);
  }

  private getDefaultSequenceSteps(): any[] {
    return [
      { dayOffset: 0, channel: 'EMAIL', templateKey: 'intro_email', scriptKey: 'intro_script' },
      { dayOffset: 3, channel: 'LINKEDIN', templateKey: 'linkedin_connection', scriptKey: null },
      { dayOffset: 7, channel: 'EMAIL', templateKey: 'follow_up_email', scriptKey: 'follow_up_script' },
      { dayOffset: 10, channel: 'PHONE', templateKey: 'cold_call', scriptKey: 'cold_call_script' },
      { dayOffset: 14, channel: 'EMAIL', templateKey: 'value_prop_email', scriptKey: 'value_prop_script' },
      { dayOffset: 21, channel: 'LINKEDIN', templateKey: 'linkedin_message', scriptKey: null },
      { dayOffset: 28, channel: 'EMAIL', templateKey: 'final_email', scriptKey: 'breakup_script' },
    ];
  }

  private getAggressiveSequenceSteps(): any[] {
    return [
      { dayOffset: 0, channel: 'EMAIL', templateKey: 'intro_email', scriptKey: 'intro_script' },
      { dayOffset: 1, channel: 'PHONE', templateKey: 'cold_call', scriptKey: 'cold_call_script' },
      { dayOffset: 3, channel: 'LINKEDIN', templateKey: 'linkedin_connection', scriptKey: null },
      { dayOffset: 5, channel: 'EMAIL', templateKey: 'follow_up_email', scriptKey: 'follow_up_script' },
      { dayOffset: 7, channel: 'PHONE', templateKey: 'cold_call', scriptKey: 'follow_up_call_script' },
      { dayOffset: 10, channel: 'EMAIL', templateKey: 'value_prop_email', scriptKey: 'value_prop_script' },
      { dayOffset: 14, channel: 'PHONE', templateKey: 'cold_call', scriptKey: 'final_call_script' },
    ];
  }

  private getNurtureSequenceSteps(): any[] {
    return [
      { dayOffset: 0, channel: 'EMAIL', templateKey: 'intro_email', scriptKey: 'intro_script' },
      { dayOffset: 7, channel: 'EMAIL', templateKey: 'educational_content', scriptKey: null },
      { dayOffset: 14, channel: 'LINKEDIN', templateKey: 'linkedin_connection', scriptKey: null },
      { dayOffset: 21, channel: 'EMAIL', templateKey: 'case_study_email', scriptKey: null },
      { dayOffset: 35, channel: 'EMAIL', templateKey: 'industry_insights', scriptKey: null },
      { dayOffset: 49, channel: 'PHONE', templateKey: 'soft_call', scriptKey: 'nurture_call_script' },
      { dayOffset: 63, channel: 'EMAIL', templateKey: 'check_in_email', scriptKey: null },
    ];
  }

  private getExecutiveSequenceSteps(): any[] {
    return [
      { dayOffset: 0, channel: 'EMAIL', templateKey: 'executive_intro', scriptKey: 'executive_script' },
      { dayOffset: 5, channel: 'LINKEDIN', templateKey: 'executive_linkedin', scriptKey: null },
      { dayOffset: 14, channel: 'EMAIL', templateKey: 'strategic_insights', scriptKey: null },
      { dayOffset: 21, channel: 'PHONE', templateKey: 'executive_call', scriptKey: 'executive_call_script' },
      { dayOffset: 35, channel: 'EMAIL', templateKey: 'roi_calculation', scriptKey: null },
    ];
  }

  private customizeStepsForProfile(steps: any[], profile: string): any[] {
    // Customize templates and timing based on profile
    const profileKeywords = profile.toLowerCase();
    
    return steps.map(step => {
      if (profileKeywords.includes('enterprise') && step.channel === 'EMAIL') {
        step.templateKey = `enterprise_${step.templateKey}`;
      }
      if (profileKeywords.includes('smb') && step.dayOffset > 14) {
        step.dayOffset = Math.floor(step.dayOffset * 0.7); // Faster pace for SMB
      }
      return step;
    });
  }

  private async createSequenceInDatabase(coreCRM: CoreCRM, name: string, profile: string): Promise<any> {
    // Note: This would use Prisma to create the sequence
    // For now, simulating the database call
    return {
      id: `seq_${Date.now()}`,
      name,
      profile,
      createdBy: 'system',
      createdAt: new Date(),
    };
  }

  private async createSequenceStep(coreCRM: CoreCRM, sequenceId: string, step: any): Promise<any> {
    // Note: This would use Prisma to create the sequence step
    return {
      id: `step_${Date.now()}_${Math.random()}`,
      sequenceId,
      ...step,
    };
  }

  private async getSequenceWithSteps(coreCRM: CoreCRM, sequenceId: string): Promise<any> {
    // Simplified - would fetch from database
    return {
      id: sequenceId,
      name: 'Sample Sequence',
      profile: 'Enterprise Decision Makers',
      steps: this.getDefaultSequenceSteps(),
    };
  }

  private async getSequenceEnrollments(coreCRM: CoreCRM, sequenceId: string): Promise<any[]> {
    // Simplified - would fetch from database
    return [
      { id: '1', status: 'ACTIVE', startedAt: new Date(), recordType: 'LEAD' },
      { id: '2', status: 'COMPLETED', startedAt: new Date(), recordType: 'CONTACT' },
    ];
  }

  private getChannelsFromSteps(steps: any[]): string[] {
    return [...new Set(steps.map(step => step.channel))];
  }

  private getSequenceDuration(steps: any[]): number {
    return Math.max(...steps.map(step => step.dayOffset));
  }

  private getNextActions(sequence: any, currentDay: number): any[] {
    return sequence.steps
      .filter((step: any) => step.dayOffset >= currentDay && step.dayOffset <= currentDay + 7)
      .map((step: any) => ({
        day: step.dayOffset,
        channel: step.channel,
        action: `Execute ${step.channel.toLowerCase()} outreach using ${step.templateKey}`,
        templateKey: step.templateKey,
        scriptKey: step.scriptKey,
      }));
  }

  private calculateSequenceMetrics(enrollments: any[]): any {
    const total = enrollments.length;
    const active = enrollments.filter(e => e.status === 'ACTIVE').length;
    const completed = enrollments.filter(e => e.status === 'COMPLETED').length;
    const cancelled = enrollments.filter(e => e.status === 'CANCELLED').length;

    return {
      totalEnrollments: total,
      activeEnrollments: active,
      completionRate: total > 0 ? completed / total : 0,
      cancellationRate: total > 0 ? cancelled / total : 0,
      averageDuration: 21, // Simplified
    };
  }

  private generateSequenceInsights(sequence: any, enrollments: any[], metrics: any): string[] {
    const insights = [];

    if (metrics.completionRate > 0.8) {
      insights.push('High completion rate indicates good sequence engagement');
    } else if (metrics.completionRate < 0.5) {
      insights.push('Low completion rate suggests sequence may be too aggressive');
    }

    if (metrics.cancellationRate > 0.3) {
      insights.push('High cancellation rate indicates potential content or timing issues');
    }

    return insights;
  }

  private generateSequenceRecommendations(metrics: any, insights: string[]): string[] {
    const recommendations = [];

    if (metrics.completionRate < 0.6) {
      recommendations.push('Consider reducing sequence frequency or improving content quality');
    }

    if (metrics.cancellationRate > 0.2) {
      recommendations.push('Review and optimize email content and call scripts');
    }

    recommendations.push('Test A/B variations of high-performing steps');

    return recommendations;
  }
}

export default SequenceOrchestratorAgent;