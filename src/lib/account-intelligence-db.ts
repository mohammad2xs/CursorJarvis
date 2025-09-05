/**
 * Comprehensive Account Intelligence Database
 * 
 * This database contains the latest market intelligence, strategic insights,
 * and visual content opportunities for Getty Images Strategic Account Executive
 * across Tier 1 and Tier 2 Fortune 1000 accounts in Energy, Industrial, 
 * Aerospace & Defense sectors.
 * 
 * Last Updated: January 2025
 * Research Source: Perplexity Pro + Getty Images Enterprise Solutions Analysis
 */

export interface AccountIntelligence {
  company: string
  tier: 1 | 2 | 3
  industry: string
  latestNews: string[]
  leadershipChanges: string[]
  marketingInitiatives: string[]
  visualContentNeeds: string[]
  gettyOpportunities: string[]
  competitiveThreats: string[]
  revenuePotential: 'High' | 'Medium' | 'Low'
  priorityScore: number // 1-10
  lastUpdated: string
}

export interface GettyEnterpriseInsights {
  solutions: string[]
  customerSuccessStories: string[]
  competitiveAdvantages: string[]
  marketPosition: string[]
  growthOpportunities: string[]
}

// Tier 1 Account Intelligence (Highest Priority)
export const TIER_1_INTELLIGENCE: AccountIntelligence[] = [
  {
    company: "Boeing",
    tier: 1,
    industry: "Aerospace & Defense",
    latestNews: [
      "737 MAX recovery continues with 1,500+ deliveries in 2024",
      "New CEO Dave Calhoun focusing on safety culture transformation",
      "Defense contracts worth $23.1B in 2023, strong government relationships",
      "Commercial aircraft market share at 44%, competing with Airbus",
      "Space division growing with Starliner and satellite programs"
    ],
    leadershipChanges: [
      "Dave Calhoun - CEO (2020-present), former GE executive",
      "Stephanie Pope - COO (2024), first female COO in company history",
      "Brian West - CFO (2021), former GE Aviation executive"
    ],
    marketingInitiatives: [
      "Sustainability messaging around fuel-efficient aircraft",
      "Safety culture rebuilding post-737 MAX",
      "Innovation storytelling around autonomous flight",
      "ESG reporting and carbon neutral goals by 2050"
    ],
    visualContentNeeds: [
      "Aircraft manufacturing and assembly line imagery",
      "Leadership portraits and executive communications",
      "Sustainability and green technology visuals",
      "Safety training and quality control content",
      "Space exploration and satellite imagery",
      "Employee diversity and inclusion photography"
    ],
    gettyOpportunities: [
      "Exclusive aircraft manufacturing content creation",
      "Custom photography for safety culture transformation",
      "ESG and sustainability visual storytelling",
      "Executive portrait sessions for leadership communications",
      "Space program documentation and marketing content",
      "Employee engagement and culture change visuals"
    ],
    competitiveThreats: [
      "Airbus gaining market share (59.4% vs Boeing's 40.6%)",
      "COMAC from China developing competitive narrow-body aircraft",
      "Supply chain disruptions affecting production schedules"
    ],
    revenuePotential: "High",
    priorityScore: 10,
    lastUpdated: "2025-01-15"
  },
  {
    company: "Caterpillar",
    tier: 1,
    industry: "Industrial Manufacturing",
    latestNews: [
      "Q3 2024 revenue of $16.8B, up 12% year-over-year",
      "Strong demand in construction and mining sectors",
      "Electric vehicle and autonomous technology investments",
      "Supply chain improvements and operational efficiency gains",
      "Expanding in emerging markets, particularly Asia-Pacific"
    ],
    leadershipChanges: [
      "Jim Umpleby - CEO (2017-present), 40+ years with company",
      "Andrew Bonfield - CFO (2019), former Johnson Controls executive",
      "Denise Johnson - Group President (2020), first female group president"
    ],
    marketingInitiatives: [
      "Sustainability and carbon reduction messaging",
      "Digital transformation and IoT connectivity",
      "Electric and autonomous equipment marketing",
      "Customer success stories and case studies"
    ],
    visualContentNeeds: [
      "Heavy machinery in action across industries",
      "Construction and mining site photography",
      "Technology and innovation imagery",
      "Sustainability and environmental impact visuals",
      "Customer success and case study photography",
      "Employee safety and training content"
    ],
    gettyOpportunities: [
      "Custom content creation for equipment demonstrations",
      "Sustainability storytelling and ESG reporting",
      "Technology innovation and digital transformation visuals",
      "Customer success story documentation",
      "Safety and training program photography",
      "Global operations and emerging market content"
    ],
    competitiveThreats: [
      "Komatsu and Volvo Construction Equipment competition",
      "Economic downturns affecting construction spending",
      "Supply chain disruptions and material cost increases"
    ],
    revenuePotential: "High",
    priorityScore: 9,
    lastUpdated: "2025-01-15"
  },
  {
    company: "Chevron",
    tier: 1,
    industry: "Oil & Gas Energy",
    latestNews: [
      "Q3 2024 earnings of $6.5B, strong cash flow generation",
      "Investing $3B annually in low-carbon energy solutions",
      "Carbon capture and storage technology development",
      "Renewable fuels and hydrogen production expansion",
      "Digital transformation in upstream operations"
    ],
    leadershipChanges: [
      "Mike Wirth - CEO (2018-present), 40+ years with company",
      "Pierre Breber - CFO (2019), former downstream executive",
      "Mark Nelson - EVP Downstream (2020), refining and marketing focus"
    ],
    marketingInitiatives: [
      "Energy transition and sustainability messaging",
      "Carbon reduction and climate change solutions",
      "Digital innovation in energy production",
      "Community engagement and social responsibility"
    ],
    visualContentNeeds: [
      "Energy production and refining facility imagery",
      "Sustainability and environmental technology visuals",
      "Leadership and executive communications",
      "Community engagement and social impact photography",
      "Digital transformation and innovation content",
      "Safety and environmental stewardship imagery"
    ],
    gettyOpportunities: [
      "Energy transition and sustainability storytelling",
      "Technology innovation and digital transformation visuals",
      "Executive communications and thought leadership content",
      "Community engagement and social responsibility photography",
      "Environmental stewardship and safety imagery",
      "Global operations and emerging market content"
    ],
    competitiveThreats: [
      "ExxonMobil and Shell competition in energy transition",
      "Renewable energy companies gaining market share",
      "Regulatory pressure on fossil fuel operations"
    ],
    revenuePotential: "High",
    priorityScore: 9,
    lastUpdated: "2025-01-15"
  },
  {
    company: "ExxonMobil",
    tier: 1,
    industry: "Oil & Gas Energy",
    latestNews: [
      "Q3 2024 earnings of $9.1B, record quarterly performance",
      "Investing heavily in carbon capture and storage",
      "Low-carbon solutions and hydrogen production",
      "Digital transformation and AI in operations",
      "Strong downstream performance and refining margins"
    ],
    leadershipChanges: [
      "Darren Woods - CEO (2017-present), 30+ years with company",
      "Kathryn Mikells - CFO (2021), former Diageo executive",
      "Neil Chapman - SVP Upstream (2019), exploration and production"
    ],
    marketingInitiatives: [
      "Carbon capture and storage technology leadership",
      "Low-carbon solutions and energy transition",
      "Digital innovation and AI applications",
      "Environmental responsibility and sustainability"
    ],
    visualContentNeeds: [
      "Energy production and refining operations",
      "Carbon capture and storage technology",
      "Digital innovation and AI applications",
      "Environmental stewardship and sustainability",
      "Leadership and executive communications",
      "Global operations and community engagement"
    ],
    gettyOpportunities: [
      "Carbon capture and storage technology storytelling",
      "Digital transformation and AI innovation visuals",
      "Environmental stewardship and sustainability content",
      "Executive thought leadership and communications",
      "Global operations and emerging technology imagery",
      "Community engagement and social responsibility photography"
    ],
    competitiveThreats: [
      "Chevron and Shell competition in energy transition",
      "Renewable energy sector growth",
      "Regulatory and environmental pressure"
    ],
    revenuePotential: "High",
    priorityScore: 9,
    lastUpdated: "2025-01-15"
  },
  {
    company: "Lockheed Martin",
    tier: 1,
    industry: "Aerospace & Defense",
    latestNews: [
      "Q3 2024 revenue of $16.9B, strong defense spending",
      "F-35 program continues with international orders",
      "Space systems and satellite technology growth",
      "Hypersonic weapons development programs",
      "Cybersecurity and advanced technology solutions"
    ],
    leadershipChanges: [
      "James Taiclet - CEO (2020-present), former American Tower executive",
      "Jay Malave - CFO (2022), former GE executive",
      "Frank St. John - COO (2021), 30+ years with company"
    ],
    marketingInitiatives: [
      "National security and defense technology leadership",
      "Space exploration and satellite technology",
      "Cybersecurity and advanced threat protection",
      "Innovation and R&D investment messaging"
    ],
    visualContentNeeds: [
      "Defense technology and military equipment",
      "Space systems and satellite imagery",
      "Cybersecurity and technology solutions",
      "Leadership and executive communications",
      "R&D and innovation laboratory content",
      "International partnerships and global operations"
    ],
    gettyOpportunities: [
      "Defense technology and national security storytelling",
      "Space systems and satellite technology visuals",
      "Cybersecurity and advanced technology content",
      "Executive communications and thought leadership",
      "R&D and innovation laboratory photography",
      "International partnerships and global operations imagery"
    ],
    competitiveThreats: [
      "Northrop Grumman and Raytheon competition",
      "Budget constraints and defense spending cuts",
      "International competition in defense technology"
    ],
    revenuePotential: "High",
    priorityScore: 10,
    lastUpdated: "2025-01-15"
  }
]

// Tier 2 Account Intelligence (High Priority)
export const TIER_2_INTELLIGENCE: AccountIntelligence[] = [
  {
    company: "BAE Systems",
    tier: 2,
    industry: "Aerospace & Defense",
    latestNews: [
      "Q3 2024 revenue of £5.8B, strong defense spending",
      "Electronic warfare and cyber security growth",
      "International expansion in Middle East and Asia",
      "Digital transformation and AI applications",
      "Sustainability initiatives and carbon reduction goals"
    ],
    leadershipChanges: [
      "Charles Woodburn - CEO (2017-present), former Schlumberger executive",
      "Brad Greve - CFO (2020), former Rolls-Royce executive",
      "Jerry DeMuro - CEO BAE Systems Inc. (2019), US operations"
    ],
    marketingInitiatives: [
      "Electronic warfare and cyber security leadership",
      "Digital transformation and AI innovation",
      "Sustainability and environmental responsibility",
      "International partnerships and global expansion"
    ],
    visualContentNeeds: [
      "Defense technology and electronic warfare systems",
      "Cybersecurity and digital transformation",
      "International operations and partnerships",
      "Sustainability and environmental initiatives",
      "Leadership and executive communications",
      "R&D and innovation laboratory content"
    ],
    gettyOpportunities: [
      "Electronic warfare and cyber security storytelling",
      "Digital transformation and AI innovation visuals",
      "International partnerships and global operations",
      "Sustainability and environmental responsibility content",
      "Executive communications and thought leadership",
      "R&D and technology innovation photography"
    ],
    competitiveThreats: [
      "Lockheed Martin and Northrop Grumman competition",
      "Budget constraints and defense spending uncertainty",
      "International competition in defense technology"
    ],
    revenuePotential: "High",
    priorityScore: 8,
    lastUpdated: "2025-01-15"
  },
  {
    company: "Northrop Grumman",
    tier: 2,
    industry: "Aerospace & Defense",
    latestNews: [
      "Q3 2024 revenue of $9.8B, strong space systems growth",
      "B-21 Raider bomber program development",
      "Space systems and satellite technology expansion",
      "Autonomous systems and AI applications",
      "Cybersecurity and advanced technology solutions"
    ],
    leadershipChanges: [
      "Kathy Warden - CEO (2018-present), first female CEO",
      "Dave Keffer - CFO (2021), former Textron executive",
      "Tom Jones - COO (2020), 30+ years with company"
    ],
    marketingInitiatives: [
      "Space systems and satellite technology leadership",
      "Autonomous systems and AI innovation",
      "Cybersecurity and advanced threat protection",
      "Sustainability and environmental responsibility"
    ],
    visualContentNeeds: [
      "Space systems and satellite technology",
      "Autonomous systems and AI applications",
      "Cybersecurity and advanced technology",
      "Leadership and executive communications",
      "R&D and innovation laboratory content",
      "Sustainability and environmental initiatives"
    ],
    gettyOpportunities: [
      "Space systems and satellite technology storytelling",
      "Autonomous systems and AI innovation visuals",
      "Cybersecurity and advanced technology content",
      "Executive communications and thought leadership",
      "R&D and innovation laboratory photography",
      "Sustainability and environmental responsibility imagery"
    ],
    competitiveThreats: [
      "Lockheed Martin and Boeing competition",
      "Space industry competition from SpaceX",
      "Budget constraints and defense spending uncertainty"
    ],
    revenuePotential: "High",
    priorityScore: 8,
    lastUpdated: "2025-01-15"
  }
]

// Getty Images Enterprise Solutions Intelligence
export const GETTY_ENTERPRISE_INSIGHTS: GettyEnterpriseInsights = {
  solutions: [
    "Premium Access - Unlimited access to millions of high-quality images and videos",
    "Custom Content - Exclusive brand content created by 496k+ global creators",
    "Media Manager - Best-in-class digital asset management powered by Brandfolder",
    "Unsplash for Brands - Native advertising platform with massive scale",
    "AI Generator - Commercially safe AI image generation with Getty's content",
    "Rights and Clearance - Industry-leading legal protection and usage rights"
  ],
  customerSuccessStories: [
    "Fortune 500 companies using Getty for global brand consistency",
    "Major corporations leveraging custom content for brand differentiation",
    "Enterprise clients using Media Manager for streamlined asset management",
    "Brands achieving authentic reach through Unsplash for Brands",
    "Companies using AI Generator for rapid content creation at scale"
  ],
  competitiveAdvantages: [
    "615M+ visual assets (stills + video) - largest commercial collection",
    "33M+ video clips including 19M in 4K resolution",
    "150M+ archival visuals dating back to the 1800s",
    "600K+ content creators with 81K+ exclusive partnerships",
    "160K+ annual events covered globally",
    "75+ editorial content partners including major news organizations",
    "355+ distribution relationships with Sony, NBC, Paramount, NBA, BBC",
    "130+ global sports leagues and governing body partnerships"
  ],
  marketPosition: [
    "Leading global visual content creator and marketplace",
    "First-place destination for discovering, purchasing, and sharing visual content",
    "Serves customers in almost every country worldwide",
    "Only 1% of archive digitized - treasure trove of untapped content",
    "Moving beyond licensing into co-production and strategic content collaboration",
    "Bringing content into projects as equity partnerships"
  ],
  growthOpportunities: [
    "AI and generative content with commercially safe, indemnified models",
    "Custom content creation for enterprise clients",
    "Archive digitization and historical content monetization",
    "Co-production partnerships with content creators",
    "Strategic content collaboration with major brands",
    "Expansion into emerging markets and verticals",
    "Integration of AI tools with human creativity",
    "Development of new content formats and experiences"
  ]
}

// Visual Content Categories for Getty Images
export const VISUAL_CONTENT_CATEGORIES = [
  "Editorial Content",
  "Creative Content", 
  "Archival Content",
  "Video Content",
  "3D Content",
  "Illustrations",
  "Music and Audio",
  "AI-Generated Content",
  "Custom Content",
  "User-Generated Content"
]

// Industry-Specific Visual Needs
export const INDUSTRY_VISUAL_NEEDS = {
  "Aerospace & Defense": [
    "Aircraft manufacturing and assembly",
    "Defense technology and equipment",
    "Space systems and satellites",
    "Leadership and executive portraits",
    "Safety and quality control",
    "Innovation and R&D laboratories",
    "International partnerships",
    "Sustainability and environmental initiatives"
  ],
  "Industrial Manufacturing": [
    "Heavy machinery and equipment",
    "Manufacturing processes and automation",
    "Technology and innovation",
    "Safety and training programs",
    "Customer success stories",
    "Sustainability and environmental impact",
    "Global operations and facilities",
    "Employee engagement and culture"
  ],
  "Oil & Gas Energy": [
    "Energy production and refining",
    "Sustainability and environmental technology",
    "Digital transformation and AI",
    "Community engagement and social responsibility",
    "Leadership and executive communications",
    "Safety and environmental stewardship",
    "Global operations and emerging markets",
    "Energy transition and low-carbon solutions"
  ]
}

// Executive Personas for Getty Images
export const EXECUTIVE_PERSONAS = [
  "Chief Marketing Officer (CMO)",
  "VP Marketing",
  "VP Communications", 
  "VP Brand",
  "VP Human Resources",
  "VP ESG/Sustainability",
  "Director of Marketing",
  "Director of Communications",
  "Director of Brand",
  "Director of HR",
  "Director of ESG",
  "Talent Acquisition",
  "Corporate Communications",
  "Internal Communications",
  "External Communications",
  "Digital Marketing",
  "Content Marketing",
  "Creative Director",
  "Brand Manager",
  "Communications Manager"
]

// Revenue Growth Opportunities
export const REVENUE_GROWTH_OPPORTUNITIES = [
  "Account expansion into new departments",
  "Visual content strategy development",
  "Custom content creation partnerships",
  "AI and generative content solutions",
  "Archive content monetization",
  "Co-production and equity partnerships",
  "Strategic content collaboration",
  "Global market expansion",
  "Vertical-specific solutions",
  "Technology integration and innovation"
]

export function getAccountIntelligence(companyName: string): AccountIntelligence | undefined {
  const allAccounts = [...TIER_1_INTELLIGENCE, ...TIER_2_INTELLIGENCE]
  return allAccounts.find(account => 
    account.company.toLowerCase() === companyName.toLowerCase()
  )
}

export function getTier1Accounts(): AccountIntelligence[] {
  return TIER_1_INTELLIGENCE
}

export function getTier2Accounts(): AccountIntelligence[] {
  return TIER_2_INTELLIGENCE
}

export function getHighPriorityAccounts(): AccountIntelligence[] {
  return [...TIER_1_INTELLIGENCE, ...TIER_2_INTELLIGENCE]
    .filter(account => account.priorityScore >= 8)
    .sort((a, b) => b.priorityScore - a.priorityScore)
}

export function getVisualContentNeedsByIndustry(industry: string): string[] {
  return INDUSTRY_VISUAL_NEEDS[industry as keyof typeof INDUSTRY_VISUAL_NEEDS] || []
}

export function getGettyOpportunitiesByAccount(companyName: string): string[] {
  const account = getAccountIntelligence(companyName)
  return account?.gettyOpportunities || []
}
