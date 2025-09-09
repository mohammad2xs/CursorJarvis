import { BaseAgent } from '../types';
import { AgentTaskContext, AgentResult } from '../types';
import { CoreCRM, RecordType, EnrichmentSignal } from '../../core/crm/CoreCRM';

/**
 * Waterfall Enrichment Agent (Clay-style)
 * Simulates a provider waterfall for data enrichment and account research
 */
class WaterfallEnrichmentAgent extends BaseAgent {
  constructor() {
    super(
      'enrichment-waterfall',
      'Waterfall Enrichment Agent',
      'Clay-style waterfall enrichment and account research using multiple data sources',
      ['enrichment.waterfall', 'research.account'],
      '1.0.0'
    );
  }

  async execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const { recordType, recordId, payload, coreCRM } = context;

      if (!recordType || !recordId) {
        return this.createErrorResult('Record type and ID are required for enrichment');
      }

      // Fetch the record
      const record = await coreCRM.getRecord(recordType, recordId);
      if (!record) {
        return this.createErrorResult(`Record not found: ${recordType}:${recordId}`);
      }

      console.log(`Starting waterfall enrichment for ${recordType}:${recordId}`);

      // Simulate enrichment waterfall
      const enrichmentResults = await this.performWaterfallEnrichment(record, recordType);

      // Write enrichment signals to the database
      const signals = await coreCRM.writeEnrichmentSignals(
        recordType,
        recordId,
        enrichmentResults.signals
      );

      // Update record fields if we have new data
      if (enrichmentResults.updates && Object.keys(enrichmentResults.updates).length > 0) {
        await coreCRM.updateRecord(recordType, recordId, enrichmentResults.updates);
      }

      // Create a follow-up activity
      await coreCRM.createActivity({
        subject: 'Automated Enrichment Completed',
        body: `Enriched record with ${signals.length} new data points: ${enrichmentResults.signals.map(s => s.key).join(', ')}`,
        relatedId: recordId,
        recordType,
        type: 'RESEARCH',
      });

      const result = {
        enrichmentSummary: {
          signalsAdded: signals.length,
          fieldsUpdated: Object.keys(enrichmentResults.updates || {}).length,
          confidence: enrichmentResults.overallConfidence,
          sources: enrichmentResults.sources,
        },
        signals: enrichmentResults.signals,
        updates: enrichmentResults.updates,
      };

      // Audit the execution
      await this.auditExecution(
        { ...context, capability: 'enrichment.waterfall', startTime },
        this.createSuccessResult(result)
      );

      return this.createSuccessResult(result, {
        duration: Date.now() - startTime,
        tokensUsed: enrichmentResults.tokensUsed,
        confidence: enrichmentResults.overallConfidence,
      });

    } catch (error) {
      console.error('Error in waterfall enrichment:', error);
      return this.createErrorResult(error instanceof Error ? error : new Error('Unknown error'), { duration: Date.now() - startTime });
    }
  }

  canHandle(capability: string, context: AgentTaskContext): boolean {
    const supported = ['enrichment.waterfall', 'research.account'].includes(capability);
    const hasRequiredFields = context.recordType && context.recordId;
    
    return supported && !!hasRequiredFields;
  }

  /**
   * Simulate a waterfall enrichment process
   */
  private async performWaterfallEnrichment(record: any, recordType: RecordType): Promise<{
    signals: EnrichmentSignal[];
    updates: Record<string, any>;
    overallConfidence: number;
    sources: string[];
    tokensUsed: number;
  }> {
    const signals: EnrichmentSignal[] = [];
    const updates: Record<string, any> = {};
    const sources: string[] = [];
    let totalConfidence = 0;
    let tokensUsed = 0;

    // Simulate different enrichment providers
    const providers = [
      { name: 'clearbit', weight: 0.9 },
      { name: 'zoominfo', weight: 0.85 },
      { name: 'apollo', weight: 0.8 },
      { name: 'linkedin', weight: 0.95 },
      { name: 'company_website', weight: 0.7 },
    ];

    for (const provider of providers) {
      try {
        const providerResults = await this.simulateProviderEnrichment(record, recordType, provider);
        
        signals.push(...providerResults.signals);
        Object.assign(updates, providerResults.updates);
        sources.push(provider.name);
        totalConfidence += provider.weight;
        tokensUsed += providerResults.tokensUsed;

        // Simulate some delay
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
      }
    }

    return {
      signals,
      updates,
      overallConfidence: sources.length > 0 ? totalConfidence / sources.length : 0,
      sources,
      tokensUsed,
    };
  }

  /**
   * Simulate enrichment from a specific provider
   */
  private async simulateProviderEnrichment(
    record: any, 
    recordType: RecordType, 
    provider: { name: string; weight: number }
  ): Promise<{
    signals: EnrichmentSignal[];
    updates: Record<string, any>;
    tokensUsed: number;
  }> {
    const signals: EnrichmentSignal[] = [];
    const updates: Record<string, any> = {};
    let tokensUsed = Math.floor(Math.random() * 500) + 100; // Simulate token usage

    // Generate mock enrichment data based on record type and provider
    switch (recordType) {
      case 'ACCOUNT':
        if (provider.name === 'clearbit') {
          signals.push({
            key: 'employee_count',
            value: `${Math.floor(Math.random() * 10000) + 10}`,
            confidence: provider.weight,
          });
          signals.push({
            key: 'annual_revenue',
            value: `$${Math.floor(Math.random() * 100)}M`,
            confidence: provider.weight,
          });
          updates.employeesBand = this.getEmployeeBand(parseInt(signals[0].value));
        }

        if (provider.name === 'zoominfo') {
          signals.push({
            key: 'technographics',
            value: JSON.stringify(['Salesforce', 'HubSpot', 'AWS', 'Microsoft Office']),
            confidence: provider.weight,
          });
          updates.techStack = ['Salesforce', 'HubSpot', 'AWS', 'Microsoft Office'];
        }

        if (provider.name === 'linkedin') {
          signals.push({
            key: 'recent_news',
            value: 'Company announced new funding round of $50M',
            confidence: provider.weight,
          });
          signals.push({
            key: 'key_executives',
            value: JSON.stringify([
              { name: 'John Smith', title: 'CEO' },
              { name: 'Jane Doe', title: 'CTO' }
            ]),
            confidence: provider.weight,
          });
        }
        break;

      case 'CONTACT':
        if (provider.name === 'apollo') {
          signals.push({
            key: 'social_profiles',
            value: JSON.stringify({
              linkedin: 'https://linkedin.com/in/sample',
              twitter: '@sample'
            }),
            confidence: provider.weight,
          });
        }

        if (provider.name === 'clearbit') {
          signals.push({
            key: 'job_history',
            value: JSON.stringify([
              { company: 'Previous Corp', title: 'Manager', duration: '2020-2022' }
            ]),
            confidence: provider.weight,
          });
        }
        break;

      case 'LEAD':
        signals.push({
          key: 'lead_score',
          value: `${Math.floor(Math.random() * 100)}`,
          confidence: provider.weight,
        });
        signals.push({
          key: 'intent_signals',
          value: JSON.stringify(['researching competitors', 'budget approved']),
          confidence: provider.weight,
        });
        break;
    }

    return { signals, updates, tokensUsed };
  }

  private getEmployeeBand(count: number): string {
    if (count <= 10) return '1-10';
    if (count <= 50) return '11-50';
    if (count <= 200) return '51-200';
    if (count <= 500) return '201-500';
    if (count <= 1000) return '501-1000';
    return '1000+';
  }
}

export default WaterfallEnrichmentAgent;