const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo CRM data...');

  // Accounts
  const acme = await prisma.account.upsert({
    where: { id: 'acc_demo_acme' },
    update: {},
    create: {
      id: 'acc_demo_acme',
      name: 'Acme Corp',
      domain: 'acme.example',
      techStack: 'Next.js;Prisma;Postgres',
      employeesBand: '200-500',
      hqCountry: 'US',
    },
  });

  // Contacts
  const jane = await prisma.contact.upsert({
    where: { id: 'con_demo_jane' },
    update: {},
    create: {
      id: 'con_demo_jane',
      accountId: acme.id,
      firstName: 'Jane',
      lastName: 'Doe',
      title: 'VP Engineering',
      email: 'jane.doe@acme.example',
      phone: '+1-555-0100',
      ownerId: 'user_demo',
    },
  });

  // Leads
  const lead = await prisma.lead.upsert({
    where: { id: 'lead_demo_1' },
    update: {},
    create: {
      id: 'lead_demo_1',
      firstName: 'John',
      lastName: 'Smith',
      company: 'Acme Corp',
      email: 'john.smith@acme.example',
      phone: '+1-555-0101',
      status: 'New',
      ownerId: 'user_demo',
    },
  });

  // Deals
  const deal = await prisma.deal.upsert({
    where: { id: 'deal_demo_1' },
    update: {},
    create: {
      id: 'deal_demo_1',
      accountId: acme.id,
      name: 'Acme – Pilot',
      stage: 'Qualification',
      amount: 25000,
      nextStep: 'Intro call scheduled',
      riskScore: 0.3,
      ownerId: 'user_demo',
    },
  });

  // Activities (example follow-up task for the deal)
  await prisma.activity.upsert({
    where: { id: 'act_demo_1' },
    update: {},
    create: {
      id: 'act_demo_1',
      recordType: 'deal',
      recordId: deal.id,
      type: 'task',
      subject: 'Prepare ROI summary for Acme',
      body: 'Auto-generated task for demo',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdBy: 'system',
    },
  });

  console.log('Seed complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
