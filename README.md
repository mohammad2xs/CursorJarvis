# CursorJarvis - AI-First CRM with Autonomous Agents

CursorJarvis is a standalone AI-first CRM that replaces Salesforce/HubSpot integrations with an internal CRM core and multi-agent orchestration layer. It delivers Clay-style enrichment, Gong-style conversation intelligence, Outreach-style sales execution, and Pipefy-style process autonomy.

## 🎯 North Star & Value Proposition

**North Star:** Compress time from lead → meeting → qualified opp → close, while increasing quality touches/hour through AI-first automation.

### 4 Strategic Pillars

1. **Data Intelligence (Clay-style)**: Waterfall enrichment + account research
2. **Conversation Intelligence (Gong-style)**: Transcript → signals → risk → actions  
3. **Sales Execution (Outreach-style)**: Multi-channel sequence orchestration
4. **Process Autonomy (Pipefy-style)**: Goal-oriented SDR/RevOps workflows with guardrails

**Analyst-first Approach:** AI suggests with clear reasoning and sources; humans approve/snooze/decline. Unlock autonomy only for proven "Golden Plays."

## 🤖 AI Agent Architecture

CursorJarvis implements a pluggable multi-agent system that automates CRM workflows:

### Core Components
- **Agent Registry**: Discovery and registration system for AI agents
- **Agent Supervisor**: Routing and execution management  
- **CoreCRM**: Internal data access layer (no external CRM dependencies)
- **Agent API**: HTTP endpoints for agent execution (`/api/agents/run`)

### Built-in Agents

#### 1. Waterfall Enrichment Agent
- **Capabilities**: `enrichment.waterfall`, `research.account`
- **Function**: Clay-style data enrichment using provider waterfall
- **Features**: Cost tracking, confidence scoring, automatic field updates

#### 2. Conversation Insights Agent  
- **Capabilities**: `conversation.insights`, `deal.predict`
- **Function**: Gong-style transcript analysis and deal prediction
- **Features**: Sentiment analysis, objection detection, risk scoring, follow-up automation

#### 3. Sequence Orchestrator Agent
- **Capabilities**: `sequence.orchestrate`
- **Function**: Outreach-style multi-channel sequence automation
- **Features**: Template management, enrollment tracking, performance analytics

#### 4. Process Autonomy Agent
- **Capabilities**: `process.autonomy`  
- **Function**: Pipefy-style workflow automation with guardrails
- **Features**: Lead qualification, deal health checks, account expansion, renewal prep

### Agent Testing Console
Access `/agents` to interactively test agents, view execution history, and debug responses.

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL with standalone CRM models
- **AI Integration:** Multi-agent orchestration system
- **UI Components:** Radix UI, Lucide React

### CRM Data Models
- **Account, Contact, Lead, Deal**: Core CRM entities
- **Activity, Transcript, EnrichmentSignal**: Agent-generated data
- **Sequence, SequenceStep**: Multi-channel automation
- **AgentAuditLog**: Comprehensive execution tracking

### Legacy Modules (Existing)
- **NBA Brain:** AI-powered Next Best Actions with scoring system
- **Perplexity Integration:** Deep research and account intelligence
- **Brand Studio:** Getty-approved messaging and proof points  
- **Meeting OS:** Calendly integration with AI brief generation
- **Deal OS:** Pipeline management with risk radar and playbooks
- **Learning Loop:** Weekly digest with Golden Play promotion/retirement

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Perplexity Pro API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd jarvis-crm
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/jarvis_crm"
PERPLEXITY_API_KEY="your_perplexity_api_key_here"
CALENDLY_WEBHOOK_SECRET="your_calendly_webhook_secret_here"
PHANTOMBUSTER_API_KEY="your_phantombuster_api_key_here"
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server
```bash
npm run dev
```

6. Access the AI Agent Console
Navigate to `http://localhost:3000/agents` to test and debug AI agents.

## 🤖 Using AI Agents

### Execute Agents via API

```bash
# Enrich an account with waterfall providers
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "enrichment.waterfall",
    "context": {
      "recordType": "ACCOUNT", 
      "recordId": "account_123",
      "payload": {"maxCost": 100}
    }
  }'

# Analyze conversation transcript
curl -X POST http://localhost:3000/api/agents/run \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "conversation.insights",
    "context": {
      "recordType": "DEAL",
      "recordId": "deal_123", 
      "payload": {
        "transcript": "Customer conversation...",
        "source": "zoom"
      }
    }
  }'
```

### Available Capabilities
- `enrichment.waterfall`: Clay-style data enrichment
- `conversation.insights`: Gong-style transcript analysis  
- `sequence.orchestrate`: Outreach-style sequence automation
- `process.autonomy`: Pipefy-style workflow automation

See [Agent Architecture docs](docs/ARCHITECTURE-AGENTS.md) for detailed usage.

## 📊 Features

### AI Agent Automation
- **Data Intelligence**: Waterfall enrichment with cost optimization and confidence scoring
- **Conversation Intelligence**: Transcript analysis, sentiment detection, and deal risk prediction
- **Sales Execution**: Multi-channel sequence automation with performance tracking
- **Process Autonomy**: Goal-oriented workflows with approval guardrails and SLA management

### Agent Testing Console (`/agents`)
- Interactive agent execution with real-time results
- Execution history and performance monitoring
- Agent discovery and capability mapping
- JSON payload testing and debugging

### My Work Dashboard
- Top 5 Next Best Actions with AI rationale
- Due/Overdue tasks with one-tap completion
- Spotlight accounts with momentum tracking

### Leads Inbox
- CSV import/export with deduplication
- AI-powered lead ranking by fit and activity
- Bulk actions for outreach campaigns

### Meeting OS
- Calendly webhook integration
- AI-generated meeting briefs with Perplexity insights
- Automated recap generation and follow-up tasks

### Deal OS
- Pipeline visualization with stage tracking
- Risk radar for stalled opportunities
- Deal-type playbooks and Mutual Action Plans

### Brand Studio
- Getty-approved value messaging
- Industry-specific content generation
- Message validation against brand guidelines

### Analytics & Learning
- Weekly digest with performance insights
- Golden Play promotion/retirement system
- Perplexity wins tracking

## 🔧 Configuration

### Sub-Industry Clusters
- Aerospace & Defense
- Oil & Gas/Energy
- Healthcare/MedSys
- Consumer/CPG
- Tech/SaaS

### Deal Types
- NEW_LOGO: First-time customers
- RENEWAL: Existing customer renewals
- UPSELL: Expansion within existing accounts
- STRATEGIC: High-value partnership opportunities

### NBA Play Types
- PRE_MEETING: Meeting preparation and briefs
- POST_MEETING: Follow-up and recap actions
- NEW_LEAD: Initial outreach and connection
- VP_CMO_NO_TOUCH: Executive engagement
- OPP_IDLE: Re-engagement for stalled deals
- ENGAGEMENT_DETECTED: Response to activity
- PERPLEXITY_NEWS: News-driven outreach
- PERPLEXITY_HIRE: New hire congratulations

## 🤖 AI Integration

### Perplexity Pro Usage
- **Daily Account Pulse:** 7am refresh for Strategic accounts
- **Pre-meeting Briefs:** T-24h automated research
- **Weekly Trend Scans:** Friday industry analysis
- **Negotiation Intelligence:** On-demand procurement insights
- **Brand Studio Enrichment:** LinkedIn topic research

### NBA Brain Scoring
- **Recency (0-20):** How recent the trigger
- **Engagement (0-20):** Recent activity level
- **Potential (0-20):** Account priority level
- **Momentum (0-20):** Recent signals count
- **Triggers (0-20):** Specific event importance

## 📈 Metrics & KPIs

### Daily Metrics
- NBAs accepted/snoozed/declined
- Touches completed
- Brand actions taken

### Weekly Metrics
- Replies received
- Meetings scheduled
- Opportunity stage moves
- Idle days reduction

### Monthly Metrics
- Time-to-first-meeting
- Qualified pipeline added
- Win rate by segment

## 🔒 Security & Compliance

- ToS-safe: No headless scraping
- Input sources: Sales Navigator CSV, PhantomBuster webhooks, Calendly Pro, Perplexity Pro
- Data retention: 7-day TTL for Perplexity cache (24h for Strategic accounts)
- Audit trail: All suggestions include source links and capture dates

## 🛠️ Development

### Database Schema
The Prisma schema includes models for:
- Companies (with sub-industry, region, tags)
- Contacts (with roles and engagement data)
- Opportunities (with deal types and stages)
- Activities (call logs, emails, meetings)
- Tasks (action items and follow-ups)
- Meetings (with Calendly integration)
- Notes (meeting notes and research)
- Account Signals (Perplexity research results)
- NBAs (Next Best Actions with scoring)
- Golden Plays (promoted high-performing rules)

### API Routes
- `/api/nbas` - NBA management
- `/api/leads` - Lead import/export/processing  
- `/api/meetings` - Meeting management and briefs
- `/api/perplexity` - AI research integration
- `/api/digest` - Weekly digest generation
- `/api/rules` - Golden Play promotion/retirement
- `/api/agents/run` - AI agent execution endpoint

### Agent Architecture
- Multi-agent orchestration system with registry and supervisor
- Built-in agents for enrichment, conversation analysis, sequences, and workflows
- Extensible framework for custom agents and external integrations
- Comprehensive audit logging and performance monitoring

## 📚 Documentation

- [AI Agent Architecture](docs/ARCHITECTURE-AGENTS.md) - Detailed agent system documentation
- [CRM Mapping & Improvement Plan](docs/IMPROVEMENT-PLAN-CRM-MAPPING.md) - Strategic roadmap and competitive positioning
- [Production Deployment Guide](PRODUCTION_DEPLOYMENT_GUIDE.md) - Infrastructure and deployment instructions

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

---

**Jarvis CRM v1.0** - AI-powered sales command center for modern AEs