import { BaseAgent } from '../types';
import { AgentTaskContext, AgentResult } from '../types';
import { CoreCRM, RecordType } from '../../core/crm/CoreCRM';

/**
 * Conversation Insights Agent (Gong-style)
 * Analyzes transcripts to extract signals, predict deal risk, and suggest actions
 */
class ConversationInsightsAgent extends BaseAgent {
  constructor() {
    super(
      'conversation-insights',
      'Conversation Intelligence Agent',
      'Gong-style transcript analysis for conversation insights and deal prediction',
      ['conversation.insights', 'deal.predict'],
      '1.0.0'
    );
  }

  async execute(context: AgentTaskContext & { coreCRM: CoreCRM }): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      const { recordType, recordId, payload, coreCRM } = context;

      // Handle different input types
      let transcript: string;
      let targetRecordType: RecordType;
      let targetRecordId: string;

      if (payload.transcript) {
        // Direct transcript provided
        transcript = payload.transcript;
        targetRecordType = recordType || 'DEAL';
        targetRecordId = recordId || payload.relatedRecordId;
      } else if (recordType && recordId) {
        // Find transcript for the record
        const record = await coreCRM.getRecord(recordType, recordId);
        if (!record) {
          return this.createErrorResult(`Record not found: ${recordType}:${recordId}`);
        }

        // Get the most recent transcript
        const transcripts = record.transcripts || [];
        if (transcripts.length === 0) {
          return this.createErrorResult('No transcripts found for this record');
        }

        transcript = transcripts[transcripts.length - 1].text;
        targetRecordType = recordType;
        targetRecordId = recordId;
      } else {
        return this.createErrorResult('Either provide a transcript in payload or specify a record with transcripts');
      }

      console.log(`Analyzing conversation for ${targetRecordType}:${targetRecordId}`);

      // Store transcript if provided directly
      if (payload.transcript && targetRecordId) {
        await coreCRM.storeTranscript({
          recordType: targetRecordType,
          recordId: targetRecordId,
          text: transcript,
          source: payload.source || 'manual',
        });
      }

      // Analyze the transcript
      const analysis = await this.analyzeConversation(transcript);

      // Extract signals and write them
      const signals = analysis.signals.map(signal => ({
        key: signal.type,
        value: signal.description,
        confidence: signal.confidence,
      }));

      await coreCRM.writeEnrichmentSignals(targetRecordType, targetRecordId, signals);

      // Update deal if this is related to a deal
      if (targetRecordType === 'DEAL' || analysis.dealId) {
        const dealId = targetRecordType === 'DEAL' ? targetRecordId : analysis.dealId;
        if (dealId) {
          await this.updateDealFromInsights(coreCRM, dealId, analysis);
        }
      }

      // Create follow-up activities based on insights
      for (const action of analysis.suggestedActions) {
        await coreCRM.createActivity({
          subject: action.title,
          body: action.description,
          relatedId: targetRecordId,
          recordType: targetRecordType,
          type: action.type as any,
          dueDate: action.dueDate,
        });
      }

      const result = {
        conversationSummary: analysis.summary,
        keyInsights: analysis.insights,
        signals: analysis.signals,
        riskAssessment: analysis.riskAssessment,
        suggestedActions: analysis.suggestedActions,
        dealPredictions: analysis.dealPredictions,
      };

      // Audit the execution
      await this.auditExecution(
        { ...context, capability: 'conversation.insights', startTime },
        this.createSuccessResult(result)
      );

      return this.createSuccessResult(result, {
        duration: Date.now() - startTime,
        tokensUsed: analysis.tokensUsed,
        confidence: analysis.overallConfidence,
      });

    } catch (error) {
      console.error('Error in conversation analysis:', error);
      return this.createErrorResult(error, { duration: Date.now() - startTime });
    }
  }

  canHandle(capability: string, context: AgentTaskContext): boolean {
    const supported = ['conversation.insights', 'deal.predict'].includes(capability);
    
    // Can handle if we have a transcript in payload OR a record that might have transcripts
    const hasInput = context.payload?.transcript || (context.recordType && context.recordId);
    
    return supported && !!hasInput;
  }

  /**
   * Analyze conversation transcript using simulated AI analysis
   */
  private async analyzeConversation(transcript: string): Promise<{
    summary: string;
    insights: string[];
    signals: Array<{ type: string; description: string; confidence: number }>;
    riskAssessment: { score: number; factors: string[] };
    suggestedActions: Array<{ title: string; description: string; type: string; dueDate?: Date }>;
    dealPredictions: { closeRate: number; timeline: string; value: number };
    dealId?: string;
    overallConfidence: number;
    tokensUsed: number;
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const tokensUsed = Math.floor(transcript.length / 4) + Math.floor(Math.random() * 500);

    // Extract key phrases and sentiment (simulated)
    const insights = this.extractInsights(transcript);
    const signals = this.extractSignals(transcript);
    const riskAssessment = this.assessRisk(transcript, signals);
    const suggestedActions = this.generateActions(insights, signals, riskAssessment);
    const dealPredictions = this.predictDeal(transcript, signals, riskAssessment);

    return {
      summary: this.generateSummary(transcript, insights),
      insights,
      signals,
      riskAssessment,
      suggestedActions,
      dealPredictions,
      overallConfidence: 0.85,
      tokensUsed,
    };
  }

  private extractInsights(transcript: string): string[] {
    const insights = [];
    const lowerTranscript = transcript.toLowerCase();

    // Look for key conversation themes
    if (lowerTranscript.includes('budget') || lowerTranscript.includes('price')) {
      insights.push('Budget/pricing discussion identified');
    }
    if (lowerTranscript.includes('competitor') || lowerTranscript.includes('alternative')) {
      insights.push('Competitive evaluation mentioned');
    }
    if (lowerTranscript.includes('timeline') || lowerTranscript.includes('when')) {
      insights.push('Timeline discussion present');
    }
    if (lowerTranscript.includes('decision') || lowerTranscript.includes('approve')) {
      insights.push('Decision-making process discussed');
    }
    if (lowerTranscript.includes('team') || lowerTranscript.includes('stakeholder')) {
      insights.push('Team/stakeholder involvement identified');
    }

    return insights.length > 0 ? insights : ['Standard discovery conversation'];
  }

  private extractSignals(transcript: string): Array<{ type: string; description: string; confidence: number }> {
    const signals = [];
    const lowerTranscript = transcript.toLowerCase();

    // Positive signals
    if (lowerTranscript.includes('interested') || lowerTranscript.includes('excited')) {
      signals.push({
        type: 'positive_sentiment',
        description: 'Customer expressed interest or excitement',
        confidence: 0.8,
      });
    }

    if (lowerTranscript.includes('next step') || lowerTranscript.includes('follow up')) {
      signals.push({
        type: 'progression_intent',
        description: 'Customer willing to proceed to next steps',
        confidence: 0.9,
      });
    }

    // Negative signals
    if (lowerTranscript.includes('concern') || lowerTranscript.includes('worry')) {
      signals.push({
        type: 'objection',
        description: 'Customer raised concerns or objections',
        confidence: 0.85,
      });
    }

    if (lowerTranscript.includes('think about') || lowerTranscript.includes('consider')) {
      signals.push({
        type: 'hesitation',
        description: 'Customer needs more time to consider',
        confidence: 0.7,
      });
    }

    // Neutral/informational signals
    if (lowerTranscript.includes('requirement') || lowerTranscript.includes('need')) {
      signals.push({
        type: 'requirements_gathering',
        description: 'Requirements and needs discussed',
        confidence: 0.95,
      });
    }

    return signals;
  }

  private assessRisk(transcript: string, signals: any[]): { score: number; factors: string[] } {
    let riskScore = 0.5; // Base risk
    const factors = [];

    // Analyze signals for risk factors
    const negativeSignals = signals.filter(s => ['objection', 'hesitation'].includes(s.type));
    const positiveSignals = signals.filter(s => ['positive_sentiment', 'progression_intent'].includes(s.type));

    if (negativeSignals.length > positiveSignals.length) {
      riskScore += 0.3;
      factors.push('More negative than positive signals detected');
    }

    if (positiveSignals.length > 0) {
      riskScore -= 0.2;
      factors.push('Positive customer sentiment detected');
    }

    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('competitor')) {
      riskScore += 0.2;
      factors.push('Competitive threats mentioned');
    }

    if (lowerTranscript.includes('budget') && lowerTranscript.includes('tight')) {
      riskScore += 0.25;
      factors.push('Budget constraints indicated');
    }

    // Clamp between 0 and 1
    riskScore = Math.max(0, Math.min(1, riskScore));

    return { score: riskScore, factors };
  }

  private generateActions(
    insights: string[], 
    signals: any[], 
    riskAssessment: any
  ): Array<{ title: string; description: string; type: string; dueDate?: Date }> {
    const actions = [];

    // Always create a follow-up
    actions.push({
      title: 'Follow up on conversation',
      description: 'Send recap email and confirm next steps discussed',
      type: 'EMAIL',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    });

    // Risk-based actions
    if (riskAssessment.score > 0.7) {
      actions.push({
        title: 'Address customer concerns',
        description: 'Schedule call to address objections and concerns raised',
        type: 'CALL',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      });
    }

    // Signal-based actions
    const competitorSignals = signals.filter(s => s.description.toLowerCase().includes('competitor'));
    if (competitorSignals.length > 0) {
      actions.push({
        title: 'Prepare competitive positioning',
        description: 'Create competitive battle card for next interaction',
        type: 'TASK',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      });
    }

    return actions;
  }

  private predictDeal(transcript: string, signals: any[], riskAssessment: any): {
    closeRate: number;
    timeline: string;
    value: number;
  } {
    let closeRate = 0.5; // Base close rate
    
    // Adjust based on signals
    const positiveSignals = signals.filter(s => ['positive_sentiment', 'progression_intent'].includes(s.type));
    closeRate += positiveSignals.length * 0.15;
    
    // Adjust based on risk
    closeRate = Math.max(0.1, closeRate - (riskAssessment.score * 0.4));
    
    // Predict timeline based on conversation content
    const lowerTranscript = transcript.toLowerCase();
    let timeline = '3-6 months';
    
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('asap')) {
      timeline = '1-2 months';
    } else if (lowerTranscript.includes('next year') || lowerTranscript.includes('budget cycle')) {
      timeline = '6-12 months';
    }

    // Estimate deal value (simplified)
    const estimatedValue = Math.floor(Math.random() * 100000) + 10000;

    return {
      closeRate: Math.round(closeRate * 100) / 100,
      timeline,
      value: estimatedValue,
    };
  }

  private generateSummary(transcript: string, insights: string[]): string {
    return `Conversation analysis completed. Key themes: ${insights.join(', ')}. Transcript length: ${transcript.length} characters. Analysis confidence: High.`;
  }

  private async updateDealFromInsights(coreCRM: CoreCRM, dealId: string, analysis: any): Promise<void> {
    try {
      const updates: any = {
        riskScore: analysis.riskAssessment.score,
      };

      // Set next step based on top suggested action
      if (analysis.suggestedActions.length > 0) {
        updates.nextStep = analysis.suggestedActions[0].description;
      }

      await coreCRM.updateRecord('DEAL', dealId, updates);
    } catch (error) {
      console.error('Error updating deal from insights:', error);
    }
  }
}

export default ConversationInsightsAgent;