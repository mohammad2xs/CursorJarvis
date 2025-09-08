import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Mock LinkedIn profiles data
    const profiles = [
      {
        id: 'profile-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        fullName: 'Sarah Johnson',
        headline: 'VP of Sales at Acme Corp | B2B Sales Expert | Revenue Growth Specialist',
        summary: 'Experienced sales leader with 10+ years in B2B sales, specializing in enterprise software solutions. Passionate about building high-performing sales teams and driving revenue growth.',
        location: 'San Francisco, CA',
        industry: 'Technology',
        currentPosition: {
          title: 'VP of Sales',
          company: 'Acme Corp',
          companySize: '201-500',
          companyIndustry: 'Software',
          startDate: '2022-01-01'
        },
        experience: [
          {
            title: 'VP of Sales',
            company: 'Acme Corp',
            duration: '2 years',
            description: 'Leading sales team of 25+ reps, driving $50M+ annual revenue'
          },
          {
            title: 'Sales Director',
            company: 'TechStart Inc',
            duration: '3 years',
            description: 'Managed enterprise sales team, achieved 150% quota attainment'
          }
        ],
        education: [
          {
            school: 'Stanford University',
            degree: 'MBA',
            field: 'Business Administration',
            year: '2015'
          }
        ],
        skills: ['Sales Management', 'B2B Sales', 'Enterprise Software', 'Revenue Growth', 'Team Leadership'],
        connections: 2500,
        profileUrl: 'https://linkedin.com/in/sarahjohnson',
        profileImage: 'https://via.placeholder.com/150',
        lastActivity: '2024-01-15T10:30:00Z',
        mutualConnections: 15,
        isPremium: true,
        isVerified: true,
        contactInfo: {
          email: 'sarah.johnson@acmecorp.com',
          website: 'https://acmecorp.com'
        },
        socialMedia: {
          twitter: 'https://twitter.com/sarahjohnson'
        },
        interests: ['Sales Technology', 'Leadership', 'B2B Marketing', 'Revenue Operations'],
        recentActivity: [
          {
            type: 'POST',
            content: 'Excited to share our Q4 results - 150% of quota achieved!',
            date: '2024-01-15T09:00:00Z',
            engagement: 45
          }
        ],
        salesNavigatorData: {
          isInSalesNavigator: true,
          savedSearches: ['Enterprise Software VPs', 'B2B Sales Leaders'],
          savedLists: ['Hot Prospects Q4', 'Enterprise Decision Makers'],
          notes: 'High-value prospect, interested in AI solutions',
          tags: ['enterprise', 'decision-maker', 'hot-lead'],
          lastViewed: '2024-01-15T10:30:00Z'
        }
      },
      {
        id: 'profile-2',
        firstName: 'Mike',
        lastName: 'Chen',
        fullName: 'Mike Chen',
        headline: 'CTO at TechStartup Inc | AI & Machine Learning Expert | Technology Innovation Leader',
        summary: 'Technology leader with 15+ years in software development and AI. Passionate about building scalable solutions and leading engineering teams.',
        location: 'Austin, TX',
        industry: 'Technology',
        currentPosition: {
          title: 'CTO',
          company: 'TechStartup Inc',
          companySize: '51-200',
          companyIndustry: 'Software',
          startDate: '2020-03-01'
        },
        experience: [
          {
            title: 'CTO',
            company: 'TechStartup Inc',
            duration: '4 years',
            description: 'Leading engineering team of 15+ developers, building AI-powered SaaS platform'
          },
          {
            title: 'Senior Engineering Manager',
            company: 'BigTech Corp',
            duration: '5 years',
            description: 'Managed multiple engineering teams, delivered enterprise solutions'
          }
        ],
        education: [
          {
            school: 'MIT',
            degree: 'MS',
            field: 'Computer Science',
            year: '2010'
          }
        ],
        skills: ['Artificial Intelligence', 'Machine Learning', 'Software Architecture', 'Team Leadership', 'Python'],
        connections: 1800,
        profileUrl: 'https://linkedin.com/in/mikechen',
        profileImage: 'https://via.placeholder.com/150',
        lastActivity: '2024-01-14T16:45:00Z',
        mutualConnections: 8,
        isPremium: false,
        isVerified: true,
        contactInfo: {
          email: 'mike.chen@techstartup.io',
          website: 'https://techstartup.io'
        },
        socialMedia: {},
        interests: ['Artificial Intelligence', 'Machine Learning', 'Software Development', 'Technology Innovation'],
        recentActivity: [
          {
            type: 'POST',
            content: 'Just launched our new AI feature - excited to see the impact!',
            date: '2024-01-14T14:30:00Z',
            engagement: 23
          }
        ],
        salesNavigatorData: {
          isInSalesNavigator: false,
          savedSearches: [],
          savedLists: [],
          notes: 'Technical decision maker, interested in AI solutions',
          tags: ['technical', 'startup', 'ai-expert'],
          lastViewed: '2024-01-14T16:45:00Z'
        }
      },
      {
        id: 'profile-3',
        firstName: 'Jennifer',
        lastName: 'Martinez',
        fullName: 'Jennifer Martinez',
        headline: 'Head of Revenue Operations at GrowthCorp | Revenue Intelligence | Sales Analytics Expert',
        summary: 'Revenue operations leader with 8+ years in sales operations and revenue intelligence. Expert in CRM optimization and sales analytics.',
        location: 'New York, NY',
        industry: 'Technology',
        currentPosition: {
          title: 'Head of Revenue Operations',
          company: 'GrowthCorp',
          companySize: '501-1000',
          companyIndustry: 'SaaS',
          startDate: '2021-06-01'
        },
        experience: [
          {
            title: 'Head of Revenue Operations',
            company: 'GrowthCorp',
            duration: '3 years',
            description: 'Leading revenue operations team, optimizing sales processes and analytics'
          },
          {
            title: 'Sales Operations Manager',
            company: 'ScaleUp Inc',
            duration: '4 years',
            description: 'Managed sales operations, implemented CRM and analytics tools'
          }
        ],
        education: [
          {
            school: 'Columbia University',
            degree: 'MBA',
            field: 'Business Administration',
            year: '2018'
          }
        ],
        skills: ['Revenue Operations', 'Sales Analytics', 'CRM Management', 'Data Analysis', 'Sales Process'],
        connections: 3200,
        profileUrl: 'https://linkedin.com/in/jennifermartinez',
        profileImage: 'https://via.placeholder.com/150',
        lastActivity: '2024-01-13T11:20:00Z',
        mutualConnections: 22,
        isPremium: true,
        isVerified: true,
        contactInfo: {
          email: 'jennifer.martinez@growthcorp.com',
          website: 'https://growthcorp.com'
        },
        socialMedia: {
          twitter: 'https://twitter.com/jennifermartinez'
        },
        interests: ['Revenue Operations', 'Sales Analytics', 'Data Science', 'Business Intelligence'],
        recentActivity: [
          {
            type: 'POST',
            content: 'Revenue operations best practices that every sales team should know',
            date: '2024-01-13T09:15:00Z',
            engagement: 67
          }
        ],
        salesNavigatorData: {
          isInSalesNavigator: true,
          savedSearches: ['Revenue Operations Leaders', 'Sales Analytics Experts'],
          savedLists: ['RevOps Decision Makers', 'Analytics Professionals'],
          notes: 'Revenue operations expert, interested in sales intelligence tools',
          tags: ['revops', 'analytics', 'decision-maker'],
          lastViewed: '2024-01-13T11:20:00Z'
        }
      }
    ]

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching LinkedIn profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn profiles' },
      { status: 500 }
    )
  }
}
