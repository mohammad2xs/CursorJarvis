# Jarvis CRM - AI-First Sales Command Center

Jarvis is a standalone AI-first CRM + Sales Command Center designed to compress time from lead → meeting → qualified opp → close, while increasing quality touches/hour.

## 🎯 North Star & Guardrails

**North Star:** Compress time from lead → meeting → qualified opp → close, while increasing quality touches/hour.

**4 Optimization Loops:**
1. Signals → NBAs → Action → Outcome
2. Prospecting → Conversations → Meetings  
3. Meeting → Follow-up → Next Step
4. Brand → Engagement → Meetings

**Analyst-first:** Jarvis suggests with clear why + source; you approve/snooze/decline. Unlock autonomy only for proven "Golden Plays."

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **AI Integration:** Perplexity Pro API
- **UI Components:** Radix UI, Lucide React

### Core Modules
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

## 📊 Features

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

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

---

**Jarvis CRM v1.0** - AI-powered sales command center for modern AEs