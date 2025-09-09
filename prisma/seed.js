/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  const company = await db.company.upsert({
    where: { name: 'Boeing' },
    update: {},
    create: {
      name: 'Boeing',
      website: 'https://www.example.com',
      subIndustry: 'Aerospace & Defense',
      region: 'North America',
      tags: ['ESG', 'Safety', 'Innovation', 'TEST_SEED'],
      contacts: {
        create: [
          {
            firstName: 'Avery',
            lastName: 'Cole',
            email: 'avery.cole@example.com',
            title: 'CMO',
            role: 'Chief Marketing Officer',
            linkedinUrl: 'https://www.linkedin.com/in/example',
          },
        ],
      },
    },
  })

  const opp = await db.opportunity.create({
    data: {
      name: 'Enterprise Visual Content Program',
      dealType: 'NEW_LOGO',
      stage: 'DISCOVER',
      value: 250000,
      probability: 20,
      companyId: company.id,
    },
  })

  const meetingTime = new Date(Date.now() + 60 * 60 * 1000)
  await db.meeting.create({
    data: {
      title: 'Discovery with CMO',
      type: 'DISCOVERY',
      status: 'SCHEDULED',
      scheduledAt: meetingTime,
      duration: 45,
      meetingUrl: 'https://meet.example.com/abc',
      notes: 'Initial discovery; align on priorities',
      companyId: company.id,
      opportunityId: opp.id,
    },
  })

  console.log('Seed complete:', { companyId: company.id, opportunityId: opp.id })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

