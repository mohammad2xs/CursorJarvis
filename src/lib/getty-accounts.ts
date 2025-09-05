export interface GettyAccount {
  name: string
  tier: 1 | 2 | 3
  priority: number
  industry: string
  subsidiaries: string[]
  keyDepartments: string[]
  currentRevenue?: number
  growthPotential: 'High' | 'Medium' | 'Low'
  lastEngagement?: Date
  keyContacts?: string[]
  visualContentNeeds: string[]
  competitiveThreats: string[]
}

export const GETTY_ACCOUNTS: GettyAccount[] = [
  // Tier 1 (Top 15)
  {
    name: 'Boeing',
    tier: 1,
    priority: 1,
    industry: 'Aerospace & Defense',
    subsidiaries: ['Boeing Commercial Airplanes', 'Boeing Defense, Space & Security', 'Boeing Global Services'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'ESG', 'Safety'],
    growthPotential: 'High',
    visualContentNeeds: [
      'Aircraft manufacturing and assembly line imagery',
      'Leadership portraits and executive communications', 
      'Sustainability and green technology visuals',
      'Safety training and quality control content',
      'Space exploration and satellite imagery',
      'Employee diversity and inclusion photography'
    ],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Caterpillar Inc.',
    tier: 1,
    priority: 2,
    industry: 'Industrial',
    subsidiaries: ['CAT Financial', 'Solar Turbines', 'Progress Rail', 'Caterpillar Ventures'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Sales', 'Sustainability', 'Digital Transformation'],
    growthPotential: 'High',
    visualContentNeeds: [
      'Heavy machinery in action across industries',
      'Construction and mining site photography',
      'Technology and innovation imagery',
      'Sustainability and environmental impact visuals',
      'Customer success and case study photography',
      'Employee safety and training content'
    ],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Chevron',
    tier: 1,
    priority: 3,
    industry: 'Oil & Gas/Energy',
    subsidiaries: ['Chevron USA', 'Chevron Phillips Chemical', 'Chevron Technology Ventures', 'Chevron New Energies'],
    keyDepartments: ['Marketing', 'Communications', 'ESG', 'HR', 'Digital Innovation', 'Sustainability'],
    growthPotential: 'High',
    visualContentNeeds: [
      'Energy production and refining facility imagery',
      'Sustainability and environmental technology visuals',
      'Leadership and executive communications',
      'Community engagement and social impact photography',
      'Digital transformation and innovation content',
      'Safety and environmental stewardship imagery'
    ],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'ExxonMobil',
    tier: 1,
    priority: 4,
    industry: 'Oil & Gas/Energy',
    subsidiaries: ['ExxonMobil Chemical', 'ExxonMobil Upstream', 'ExxonMobil Downstream', 'ExxonMobil Low Carbon Solutions'],
    keyDepartments: ['Marketing', 'Communications', 'ESG', 'HR', 'Digital Innovation', 'Sustainability'],
    growthPotential: 'High',
    visualContentNeeds: [
      'Energy production and refining operations',
      'Carbon capture and storage technology',
      'Digital innovation and AI applications',
      'Environmental stewardship and sustainability',
      'Leadership and executive communications',
      'Global operations and community engagement'
    ],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Lockheed Martin',
    tier: 1,
    priority: 5,
    industry: 'Aerospace & Defense',
    subsidiaries: ['Lockheed Martin Aeronautics', 'Lockheed Martin Space', 'Lockheed Martin Missiles and Fire Control'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'Cybersecurity', 'Space Systems'],
    growthPotential: 'High',
    visualContentNeeds: [
      'Defense technology and military equipment',
      'Space systems and satellite imagery',
      'Cybersecurity and technology solutions',
      'Leadership and executive communications',
      'R&D and innovation laboratory content',
      'International partnerships and global operations'
    ],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Parker Hannifin',
    tier: 1,
    priority: 6,
    industry: 'Industrial',
    subsidiaries: ['Parker Aerospace', 'Parker Industrial', 'Parker Climate'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Motion control', 'Fluid power', 'Filtration', 'Leadership', 'Technology'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'RTX Corporation',
    tier: 1,
    priority: 7,
    industry: 'Aerospace & Defense',
    subsidiaries: ['Collins Aerospace', 'Pratt & Whitney', 'Raytheon'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Aerospace technology', 'Defense systems', 'Space exploration', 'Leadership', 'Innovation'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'San Diego Gas & Electric (SDG&E)',
    tier: 1,
    priority: 8,
    industry: 'Utilities',
    subsidiaries: ['SDG&E', 'SoCalGas'],
    keyDepartments: ['Marketing', 'Communications', 'ESG', 'HR', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Energy infrastructure', 'Sustainability', 'Technology', 'Leadership', 'Safety'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Sempra',
    tier: 1,
    priority: 9,
    industry: 'Utilities',
    subsidiaries: ['SDG&E', 'SoCalGas', 'Sempra Infrastructure'],
    keyDepartments: ['Marketing', 'Communications', 'ESG', 'HR', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Energy infrastructure', 'Sustainability', 'Technology', 'Leadership', 'Safety'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'University of Maryland Medical System (UMMS)',
    tier: 1,
    priority: 10,
    industry: 'Healthcare/MedSys',
    subsidiaries: ['UMMS', 'University of Maryland Medical Center'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Medical', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Healthcare', 'Medical technology', 'Patient care', 'Leadership', 'Innovation'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'IQVIA',
    tier: 1,
    priority: 11,
    industry: 'Healthcare/MedSys',
    subsidiaries: ['IQVIA', 'IQVIA Biotech', 'IQVIA Technologies'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Data Science', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Healthcare data', 'Technology', 'Research', 'Leadership', 'Innovation'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Infosys US, Inc.',
    tier: 1,
    priority: 12,
    industry: 'Tech/SaaS',
    subsidiaries: ['Infosys', 'Infosys Consulting', 'Infosys Technologies'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Technology', 'Digital transformation', 'Consulting', 'Leadership', 'Innovation'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Philips',
    tier: 1,
    priority: 13,
    industry: 'Healthcare/MedSys',
    subsidiaries: ['Philips Healthcare', 'Philips Lighting', 'Philips Consumer'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Medical', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Healthcare technology', 'Medical devices', 'Innovation', 'Leadership', 'Patient care'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Schneider Electric',
    tier: 1,
    priority: 14,
    industry: 'Industrial',
    subsidiaries: ['Schneider Electric', 'Schneider Electric Energy', 'Schneider Electric Automation'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Engineering', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Energy management', 'Automation', 'Sustainability', 'Leadership', 'Technology'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  },
  {
    name: 'Wahl Clipper Corporation',
    tier: 1,
    priority: 15,
    industry: 'Consumer/CPG',
    subsidiaries: ['Wahl Clipper', 'Wahl Professional', 'Wahl Consumer'],
    keyDepartments: ['Marketing', 'Communications', 'HR', 'Sales', 'Corporate'],
    growthPotential: 'High',
    visualContentNeeds: ['Consumer products', 'Professional tools', 'Lifestyle', 'Leadership', 'Innovation'],
    competitiveThreats: ['Shutterstock', 'Adobe Stock', 'iStock']
  }
]

export const GETTY_ACCOUNT_TIERS = {
  tier1: GETTY_ACCOUNTS.filter(account => account.tier === 1),
  tier2: GETTY_ACCOUNTS.filter(account => account.tier === 2),
  tier3: GETTY_ACCOUNTS.filter(account => account.tier === 3)
}

export const GETTY_INDUSTRIES = [
  'Aerospace & Defense',
  'Industrial', 
  'Oil & Gas/Energy',
  'Utilities',
  'Healthcare/MedSys',
  'Tech/SaaS',
  'Consumer/CPG'
]

export const GETTY_VISUAL_CONTENT_CATEGORIES = [
  'Aircraft imagery',
  'Heavy machinery',
  'Energy production',
  'Sustainability',
  'Technology',
  'Leadership',
  'Safety',
  'Manufacturing',
  'Construction',
  'Mining',
  'Healthcare',
  'Medical technology',
  'Patient care',
  'Innovation',
  'Digital transformation',
  'Consulting',
  'Energy management',
  'Automation',
  'Consumer products',
  'Professional tools',
  'Lifestyle'
]

export function getAccountByName(name: string): GettyAccount | undefined {
  return GETTY_ACCOUNTS.find(account => 
    account.name.toLowerCase().includes(name.toLowerCase()) ||
    account.subsidiaries.some(subsidiary => 
      subsidiary.toLowerCase().includes(name.toLowerCase())
    )
  )
}

export function getAccountsByTier(tier: 1 | 2 | 3): GettyAccount[] {
  return GETTY_ACCOUNTS.filter(account => account.tier === tier)
}

export function getAccountsByIndustry(industry: string): GettyAccount[] {
  return GETTY_ACCOUNTS.filter(account => account.industry === industry)
}

export function getHighPriorityAccounts(): GettyAccount[] {
  return GETTY_ACCOUNTS.filter(account => 
    account.tier === 1 && account.priority <= 10
  )
}
