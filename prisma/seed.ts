import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CRM data...');

  // Create test accounts
  const account1 = await prisma.account.create({
    data: {
      name: 'TechCorp Industries',
      domain: 'techcorp.com',
      techStack: ['Salesforce', 'AWS', 'React'],
      employeesBand: '201-500',
      hqCountry: 'United States',
    },
  });

  const account2 = await prisma.account.create({
    data: {
      name: 'Global Solutions Ltd',
      domain: 'globalsolutions.co.uk',
      techStack: ['HubSpot', 'Microsoft Azure', 'Angular'],
      employeesBand: '51-200',
      hqCountry: 'United Kingdom',
    },
  });

  console.log(`✅ Created ${[account1, account2].length} accounts`);

  // Create test contacts
  const contact1 = await prisma.crmContact.create({
    data: {
      accountId: account1.id,
      firstName: 'John',
      lastName: 'Smith',
      title: 'VP of Engineering',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0123',
      ownerId: 'rep_001',
    },
  });

  const contact2 = await prisma.crmContact.create({
    data: {
      accountId: account2.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      title: 'CTO',
      email: 'sarah.j@globalsolutions.co.uk',
      phone: '+44-20-7946-0958',
      ownerId: 'rep_002',
    },
  });

  console.log(`✅ Created ${[contact1, contact2].length} contacts`);

  // Create test leads
  const lead1 = await prisma.lead.create({
    data: {
      firstName: 'Mike',
      lastName: 'Wilson',
      company: 'StartupXYZ',
      email: 'mike@startupxyz.com',
      phone: '+1-555-0456',
      status: 'NEW',
      ownerId: 'rep_001',
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      firstName: 'Emily',
      lastName: 'Brown',
      company: 'Innovation Labs',
      email: 'emily.brown@innovationlabs.com',
      status: 'QUALIFIED',
      ownerId: 'rep_002',
    },
  });

  console.log(`✅ Created ${[lead1, lead2].length} leads`);

  // Create test deals
  const deal1 = await prisma.deal.create({
    data: {
      accountId: account1.id,
      contactId: contact1.id,
      name: 'TechCorp Enterprise Deal',
      stage: 'QUALIFICATION',
      amount: 150000,
      closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      nextStep: 'Schedule technical demo',
      riskScore: 0.3,
      ownerId: 'rep_001',
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      accountId: account2.id,
      contactId: contact2.id,
      name: 'Global Solutions Platform',
      stage: 'PROPOSAL',
      amount: 75000,
      closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      nextStep: 'Present final proposal to board',
      riskScore: 0.6,
      ownerId: 'rep_002',
    },
  });

  console.log(`✅ Created ${[deal1, deal2].length} deals`);

  // Create sample sequences
  const sequence1 = await prisma.sequence.create({
    data: {
      name: 'Enterprise Outreach Sequence',
      profile: 'Enterprise Decision Makers - VP/C-Level',
      createdBy: 'system',
    },
  });

  // Create sequence steps
  const sequenceSteps = [
    { dayOffset: 0, channel: 'EMAIL', templateKey: 'enterprise_intro', scriptKey: 'intro_script' },
    { dayOffset: 3, channel: 'LINKEDIN', templateKey: 'linkedin_connection', scriptKey: null },
    { dayOffset: 7, channel: 'EMAIL', templateKey: 'follow_up_email', scriptKey: 'follow_up_script' },
    { dayOffset: 14, channel: 'PHONE', templateKey: 'executive_call', scriptKey: 'executive_call_script' },
  ];

  for (const step of sequenceSteps) {
    await prisma.sequenceStep.create({
      data: {
        sequenceId: sequence1.id,
        ...step,
      },
    });
  }

  console.log(`✅ Created sequence with ${sequenceSteps.length} steps`);

  // Create sample enrichment signals
  await prisma.enrichmentSignal.createMany({
    data: [
      {
        recordType: 'ACCOUNT',
        recordId: account1.id,
        key: 'technographics',
        value: JSON.stringify(['Salesforce', 'AWS', 'React', 'PostgreSQL']),
        confidence: 0.95,
      },
      {
        recordType: 'ACCOUNT',
        recordId: account1.id,
        key: 'recent_funding',
        value: 'Series B - $25M raised 6 months ago',
        confidence: 0.85,
      },
      {
        recordType: 'CONTACT',
        recordId: contact1.id,
        key: 'job_change',
        value: 'Promoted to VP of Engineering 3 months ago',
        confidence: 0.9,
      },
    ],
  });

  console.log('✅ Created enrichment signals');

  // Create sample activities
  await prisma.crmActivity.createMany({
    data: [
      {
        recordType: 'DEAL',
        recordId: deal1.id,
        type: 'CALL',
        subject: 'Discovery call completed',
        body: 'Discussed technical requirements and timeline. Customer confirmed budget and decision timeline.',
        createdBy: 'rep_001',
      },
      {
        recordType: 'ACCOUNT',
        recordId: account2.id,
        type: 'EMAIL',
        subject: 'Sent proposal follow-up',
        body: 'Followed up on the proposal sent last week. Waiting for feedback from their technical team.',
        createdBy: 'rep_002',
      },
    ],
  });

  console.log('✅ Created sample activities');

  // Create sample transcripts
  await prisma.transcript.createMany({
    data: [
      {
        recordType: 'DEAL',
        recordId: deal1.id,
        source: 'zoom',
        text: 'Customer: We are very interested in your solution and have budget approved for this quarter. Our main concern is the integration timeline. Rep: I understand your concerns about integration. We typically see implementations complete within 4-6 weeks with our dedicated onboarding team.',
      },
      {
        recordType: 'DEAL',
        recordId: deal2.id,
        source: 'phone',
        text: 'Customer: We are evaluating multiple vendors and need to make a decision by month end. The board wants to see ROI projections. Rep: I can prepare a detailed ROI analysis based on your specific metrics. What are your key success indicators?',
      },
    ],
  });

  console.log('✅ Created sample transcripts');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Accounts: ${[account1, account2].length}`);
  console.log(`   Contacts: ${[contact1, contact2].length}`);
  console.log(`   Leads: ${[lead1, lead2].length}`);
  console.log(`   Deals: ${[deal1, deal2].length}`);
  console.log(`   Sequences: 1 (with ${sequenceSteps.length} steps)`);
  console.log(`   Enrichment Signals: 3`);
  console.log(`   Activities: 2`);
  console.log(`   Transcripts: 2`);
  console.log('\n🚀 You can now test the AI agents with this data!');
  console.log(`   Account IDs: ${account1.id}, ${account2.id}`);
  console.log(`   Contact IDs: ${contact1.id}, ${contact2.id}`);
  console.log(`   Lead IDs: ${lead1.id}, ${lead2.id}`);
  console.log(`   Deal IDs: ${deal1.id}, ${deal2.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });