import { PrismaClient } from '@prisma/client';

// Core CRM Types
export type RecordType = 'ACCOUNT' | 'CONTACT' | 'LEAD' | 'DEAL';

export interface CrmRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityInput {
  subject: string;
  body?: string;
  relatedId: string;
  recordType: RecordType;
  dueDate?: Date;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE' | 'FOLLOW_UP' | 'RESEARCH';
}

export interface EnrichmentSignal {
  key: string;
  value: string;
  confidence: number;
}

export interface TranscriptInput {
  recordType: RecordType;
  recordId: string;
  text: string;
  source: string;
}

export interface AgentRunContext {
  agentId: string;
  capability: string;
  recordType?: RecordType;
  recordId?: string;
  userId?: string;
  orgId?: string;
  payload: any;
  result: any;
}

/**
 * CoreCRM - Internal CRM provider that operates on Prisma models
 * Provides abstracted CRUD operations and CRM-specific business logic
 */
export class CoreCRM {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Generic record retrieval by type and ID
   */
  async getRecord(type: RecordType, id: string): Promise<any | null> {
    try {
      switch (type) {
        case 'ACCOUNT':
          return await this.prisma.account.findUnique({
            where: { id },
            include: {
              contacts: true,
              deals: true,
              activities: true,
              enrichmentSignals: true,
            },
          });
        case 'CONTACT':
          return await this.prisma.crmContact.findUnique({
            where: { id },
            include: {
              account: true,
              deals: true,
              activities: true,
              enrichmentSignals: true,
            },
          });
        case 'LEAD':
          return await this.prisma.lead.findUnique({
            where: { id },
            include: {
              activities: true,
              enrichmentSignals: true,
            },
          });
        case 'DEAL':
          return await this.prisma.deal.findUnique({
            where: { id },
            include: {
              account: true,
              contact: true,
              activities: true,
              enrichmentSignals: true,
            },
          });
        default:
          throw new Error(`Unsupported record type: ${type}`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Generic record update by type and ID
   */
  async updateRecord(type: RecordType, id: string, fields: Record<string, any>): Promise<any> {
    try {
      switch (type) {
        case 'ACCOUNT':
          return await this.prisma.account.update({
            where: { id },
            data: fields,
          });
        case 'CONTACT':
          return await this.prisma.crmContact.update({
            where: { id },
            data: fields,
          });
        case 'LEAD':
          return await this.prisma.lead.update({
            where: { id },
            data: fields,
          });
        case 'DEAL':
          return await this.prisma.deal.update({
            where: { id },
            data: fields,
          });
        default:
          throw new Error(`Unsupported record type: ${type}`);
      }
    } catch (error) {
      console.error(`Error updating ${type} record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search across all record types
   */
  async search(query: string, limit: number = 20): Promise<any[]> {
    try {
      const results = [];

      // Search accounts
      const accounts = await this.prisma.account.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { domain: { contains: query } },
          ],
        },
        take: limit,
      });
      results.push(...accounts.map(a => ({ ...a, _type: 'ACCOUNT' })));

      // Search contacts
      const contacts = await this.prisma.crmContact.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { title: { contains: query } },
          ],
        },
        include: { account: true },
        take: limit,
      });
      results.push(...contacts.map(c => ({ ...c, _type: 'CONTACT' })));

      // Search leads
      const leads = await this.prisma.lead.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { company: { contains: query } },
          ],
        },
        take: limit,
      });
      results.push(...leads.map(l => ({ ...l, _type: 'LEAD' })));

      // Search deals
      const deals = await this.prisma.deal.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { nextStep: { contains: query } },
          ],
        },
        include: { account: true, contact: true },
        take: limit,
      });
      results.push(...deals.map(d => ({ ...d, _type: 'DEAL' })));

      return results.slice(0, limit);
    } catch (error) {
      console.error('Error searching records:', error);
      throw error;
    }
  }

  /**
   * Create an activity related to a record
   */
  async createActivity(input: ActivityInput): Promise<any> {
    try {
      return await this.prisma.crmActivity.create({
        data: {
          recordType: input.recordType,
          recordId: input.relatedId,
          type: input.type,
          subject: input.subject,
          body: input.body,
          dueDate: input.dueDate,
          createdBy: 'system', // Could be passed in context
        },
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  /**
   * Enroll a record in a sequence
   */
  async enrollInSequence(sequenceId: string, recordType: RecordType, recordId: string): Promise<any> {
    try {
      // Check if already enrolled
      const existing = await this.prisma.sequenceEnrollment.findFirst({
        where: {
          sequenceId,
          recordType,
          recordId,
          status: 'ACTIVE',
        },
      });

      if (existing) {
        throw new Error('Record is already enrolled in this sequence');
      }

      return await this.prisma.sequenceEnrollment.create({
        data: {
          sequenceId,
          recordType,
          recordId,
          status: 'ACTIVE',
        },
      });
    } catch (error) {
      console.error('Error enrolling in sequence:', error);
      throw error;
    }
  }

  /**
   * Store a transcript for a record
   */
  async storeTranscript(input: TranscriptInput): Promise<any> {
    try {
      return await this.prisma.transcript.create({
        data: {
          recordType: input.recordType,
          recordId: input.recordId,
          source: input.source,
          text: input.text,
        },
      });
    } catch (error) {
      console.error('Error storing transcript:', error);
      throw error;
    }
  }

  /**
   * Write enrichment signals to a record
   */
  async writeEnrichmentSignals(recordType: RecordType, recordId: string, signals: EnrichmentSignal[]): Promise<any[]> {
    try {
      const results = [];
      for (const signal of signals) {
        const result = await this.prisma.enrichmentSignal.create({
          data: {
            recordType,
            recordId,
            key: signal.key,
            value: signal.value,
            confidence: signal.confidence,
          },
        });
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Error writing enrichment signals:', error);
      throw error;
    }
  }

  /**
   * Audit an agent run
   */
  async auditAgentRun(context: AgentRunContext): Promise<any> {
    try {
      return await this.prisma.agentAuditLog.create({
        data: {
          agentId: context.agentId,
          capability: context.capability,
          recordType: context.recordType,
          recordId: context.recordId,
          userId: context.userId,
          orgId: context.orgId,
          payloadJson: JSON.stringify(context.payload),
          resultJson: JSON.stringify(context.result),
        },
      });
    } catch (error) {
      console.error('Error auditing agent run:', error);
      throw error;
    }
  }

  /**
   * Get recent agent audit logs for a record
   */
  async getAgentAuditLogs(recordType?: RecordType, recordId?: string, limit: number = 10): Promise<any[]> {
    try {
      const where: any = {};
      if (recordType && recordId) {
        where.recordType = recordType;
        where.recordId = recordId;
      }

      return await this.prisma.agentAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error fetching agent audit logs:', error);
      throw error;
    }
  }

  /**
   * Cleanup method
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default CoreCRM;