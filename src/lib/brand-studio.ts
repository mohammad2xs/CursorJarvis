import { BrandStudioContent } from '@/types'

export const brandStudioContent: BrandStudioContent = {
  valueFraming: {
    efficiency: [
      "Reduce creative production time by 40% with automated workflows",
      "Eliminate 80% of manual asset management tasks",
      "Cut approval cycles from weeks to days with streamlined review processes",
      "Deploy campaigns 3x faster with pre-approved templates and assets",
      "Reduce creative bottlenecks by 60% with self-service tools"
    ],
    reducedRisk: [
      "99.9% brand compliance with automated style guide enforcement",
      "Zero unauthorized asset usage with enterprise-grade permissions",
      "Complete audit trail for all creative decisions and approvals",
      "GDPR-compliant asset management with automatic rights tracking",
      "Eliminate brand inconsistency with centralized asset control"
    ],
    elevatedCreativity: [
      "Unlock 2M+ premium Getty Images assets for unlimited creative exploration",
      "AI-powered creative suggestions based on brand DNA and campaign goals",
      "Collaborative creative workflows that amplify team creativity",
      "Real-time creative feedback and iteration capabilities",
      "Access to exclusive content and trends before competitors"
    ]
  },
  approvedFigures: {
    customers: [
      "Fortune 500 companies trust Getty Images for their creative needs",
      "Over 1.5 million customers worldwide",
      "98% customer satisfaction rate",
      "Leading brands like Nike, Coca-Cola, and Microsoft rely on Getty Images",
      "Trusted by 90% of Fortune 100 companies"
    ],
    assets: [
      "2M+ premium images, videos, and audio assets",
      "500+ new assets added daily",
      "Exclusive content from 200,000+ contributors",
      "4K and 8K resolution options for all media types",
      "AI-generated content library with 100,000+ unique assets"
    ],
    partners: [
      "Strategic partnerships with Adobe, Canva, and Figma",
      "Integration with 50+ marketing and design platforms",
      "API access for enterprise customers",
      "White-label solutions for agencies and resellers",
      "Global distribution network in 200+ countries"
    ]
  },
  operatingPrinciples: [
    "Simplify complex creative workflows",
    "Make data-driven decisions based on performance metrics",
    "Maintain long-term orientation in all strategic decisions",
    "Prioritize customer success over short-term gains",
    "Foster innovation through collaborative partnerships"
  ]
}

export class BrandStudio {
  private content: BrandStudioContent

  constructor() {
    this.content = brandStudioContent
  }

  getValueFraming(category: keyof BrandStudioContent['valueFraming']): string[] {
    return this.content.valueFraming[category]
  }

  getApprovedFigures(category: keyof BrandStudioContent['approvedFigures']): string[] {
    return this.content.approvedFigures[category]
  }

  getOperatingPrinciples(): string[] {
    return this.content.operatingPrinciples
  }

  generateValueProposition(subIndustry: string, dealType: string): string {
    const efficiency = this.getValueFraming('efficiency')[0]
    const reducedRisk = this.getValueFraming('reducedRisk')[0]
    const elevatedCreativity = this.getValueFraming('elevatedCreativity')[0]

    return `For ${subIndustry} companies, Getty Images delivers ${efficiency.toLowerCase()}, ${reducedRisk.toLowerCase()}, and ${elevatedCreativity.toLowerCase()}. This combination is particularly valuable for ${dealType.toLowerCase()} opportunities where speed, compliance, and creative excellence drive competitive advantage.`
  }

  generateROIMessage(subIndustry: string): string {
    const roiMessages: Record<string, string> = {
      'Aerospace & Defense': 'In aerospace and defense, where compliance and precision are critical, Getty Images reduces creative production costs by 35% while ensuring 100% brand compliance. The ROI is typically 3:1 within the first year.',
      'Oil & Gas/Energy': 'Energy companies see 40% faster campaign deployment with Getty Images, crucial for time-sensitive market opportunities. The platform pays for itself in 6 months through reduced agency costs and faster time-to-market.',
      'Healthcare/MedSys': 'Healthcare organizations achieve 50% reduction in creative approval cycles while maintaining strict compliance standards. This translates to $2M+ in annual savings for large healthcare systems.',
      'Consumer/CPG': 'CPG brands accelerate product launches by 60% with Getty Images\' extensive lifestyle and product imagery. The platform enables rapid response to market trends and seasonal campaigns.',
      'Tech/SaaS': 'SaaS companies reduce creative production time by 45% while scaling content across multiple channels. The platform supports rapid iteration and A/B testing essential for digital marketing success.'
    }

    return roiMessages[subIndustry] || 'Getty Images delivers measurable ROI through reduced production costs, faster time-to-market, and improved creative quality across all industries.'
  }

  generateCompetitiveAdvantage(subIndustry: string): string {
    const advantages: Record<string, string> = {
      'Aerospace & Defense': 'Unlike generic stock photo sites, Getty Images provides specialized aerospace imagery, technical illustrations, and compliance-ready content that meets strict industry standards.',
      'Oil & Gas/Energy': 'Getty Images offers exclusive energy sector content including industrial photography, environmental imagery, and ESG-focused visuals that resonate with energy industry stakeholders.',
      'Healthcare/MedSys': 'Our healthcare content library includes medical imagery, patient care visuals, and regulatory-compliant assets that other platforms cannot provide due to licensing restrictions.',
      'Consumer/CPG': 'Getty Images provides lifestyle photography, product shots, and trend-driven content that helps CPG brands connect with consumers and stay ahead of market trends.',
      'Tech/SaaS': 'Our tech-focused content includes UI/UX imagery, data visualization, and innovation-themed visuals that help SaaS companies communicate complex concepts effectively.'
    }

    return advantages[subIndustry] || 'Getty Images provides industry-specific content and expertise that generic stock photo platforms cannot match.'
  }

  generateCaseStudyAngle(companyName: string, subIndustry: string): string {
    const caseStudyAngles: Record<string, string> = {
      'Aerospace & Defense': `How ${companyName} reduced creative production time by 40% while maintaining strict compliance standards, enabling faster response to RFP requirements and market opportunities.`,
      'Oil & Gas/Energy': `How ${companyName} leveraged Getty Images' ESG-focused content library to enhance their sustainability messaging and improve stakeholder engagement.`,
      'Healthcare/MedSys': `How ${companyName} streamlined their creative approval process by 50% while ensuring all content meets healthcare industry compliance requirements.`,
      'Consumer/CPG': `How ${companyName} accelerated their product launch timeline by 60% using Getty Images' extensive lifestyle and product photography library.`,
      'Tech/SaaS': `How ${companyName} scaled their content marketing efforts 3x while maintaining brand consistency across all digital channels.`
    }

    return caseStudyAngles[subIndustry] || `How ${companyName} transformed their creative operations with Getty Images, achieving measurable improvements in efficiency, quality, and brand consistency.`
  }

  generateDiscoveryQuestions(subIndustry: string): string[] {
    const questions: Record<string, string[]> = {
      'Aerospace & Defense': [
        'What are your biggest challenges in maintaining brand consistency across complex technical documentation?',
        'How long does it typically take to get creative assets approved for external communications?',
        'What compliance requirements do you need to consider when selecting creative assets?'
      ],
      'Oil & Gas/Energy': [
        'How are you currently communicating your ESG initiatives and sustainability efforts?',
        'What challenges do you face in creating content that resonates with both technical and non-technical audiences?',
        'How important is it to have access to industry-specific imagery for your marketing campaigns?'
      ],
      'Healthcare/MedSys': [
        'What are your current processes for ensuring all creative content meets healthcare compliance standards?',
        'How do you balance the need for engaging visuals with strict regulatory requirements?',
        'What challenges do you face in creating content that connects with patients and healthcare professionals?'
      ],
      'Consumer/CPG': [
        'How do you currently manage creative assets across multiple product lines and seasonal campaigns?',
        'What is your biggest challenge in keeping up with consumer trends and market demands?',
        'How important is it to have access to diverse, inclusive imagery for your brand?'
      ],
      'Tech/SaaS': [
        'How do you currently scale creative content across multiple marketing channels and campaigns?',
        'What challenges do you face in creating visuals that explain complex technical concepts?',
        'How important is it to have access to current, trend-driven imagery for your digital marketing?'
      ]
    }

    return questions[subIndustry] || [
      'What are your biggest challenges in creative production and asset management?',
      'How do you currently ensure brand consistency across all marketing materials?',
      'What would success look like for your creative operations?'
    ]
  }

  generateObjectionHandling(objection: string, subIndustry: string): string {
    const objectionHandlers: Record<string, Record<string, string>> = {
      'Aerospace & Defense': {
        'budget': 'Given the compliance requirements and technical complexity in aerospace, the cost of non-compliance far exceeds our platform investment. Most clients see 3:1 ROI within 12 months.',
        'integration': 'Our platform integrates seamlessly with existing aerospace workflows and compliance systems. We have specific experience with defense contractors and understand your unique requirements.',
        'security': 'We maintain the highest security standards with SOC 2 compliance and can provide the security documentation required for defense industry partnerships.'
      },
      'Oil & Gas/Energy': {
        'budget': 'Energy companies typically see 40% reduction in creative production costs, which pays for the platform in 6 months. The efficiency gains alone justify the investment.',
        'esg': 'Our ESG-focused content library helps energy companies communicate their sustainability efforts more effectively, which is crucial for stakeholder relations and regulatory compliance.',
        'industry': 'We have extensive experience with energy sector clients and understand the unique challenges of communicating complex technical concepts to diverse audiences.'
      },
      'Healthcare/MedSys': {
        'budget': 'Healthcare organizations save an average of $2M annually through reduced approval cycles and improved compliance. The platform pays for itself in 6 months.',
        'compliance': 'All our healthcare content is pre-screened for compliance requirements. We maintain detailed audit trails and can provide documentation for regulatory reviews.',
        'integration': 'We integrate with existing healthcare systems and workflows, ensuring minimal disruption to current processes while improving efficiency.'
      },
      'Consumer/CPG': {
        'budget': 'CPG brands see 60% faster campaign deployment, which is crucial for seasonal and trend-driven marketing. The speed advantage alone justifies the investment.',
        'content': 'Our extensive lifestyle and product photography library is specifically designed for CPG brands, with content that resonates with consumer audiences.',
        'scalability': 'The platform scales with your brand growth, supporting multiple product lines and seasonal campaigns without additional overhead.'
      },
      'Tech/SaaS': {
        'budget': 'SaaS companies typically see 45% reduction in creative production time, enabling faster iteration and A/B testing essential for digital marketing success.',
        'integration': 'We integrate with all major marketing platforms and design tools, ensuring seamless workflow integration for tech companies.',
        'innovation': 'Our AI-powered features and trend-driven content help tech companies stay ahead of the curve in digital marketing and brand communication.'
      }
    }

    return objectionHandlers[subIndustry]?.[objection.toLowerCase()] || 
           'Let me address that concern specifically. Based on your industry and requirements, here\'s how Getty Images can help...'
  }

  validateMessage(message: string): { isValid: boolean; suggestions: string[] } {
    const suggestions: string[] = []
    
    // Check for approved value framing
    const hasEfficiency = this.content.valueFraming.efficiency.some(framing => 
      message.toLowerCase().includes(framing.toLowerCase().split(' ')[0])
    )
    if (!hasEfficiency) {
      suggestions.push('Consider including efficiency benefits')
    }

    // Check for approved figures
    const hasApprovedFigures = this.content.approvedFigures.customers.some(figure => 
      message.toLowerCase().includes(figure.toLowerCase().split(' ')[0])
    )
    if (!hasApprovedFigures) {
      suggestions.push('Consider including customer success metrics')
    }

    // Check for operating principles alignment
    const hasLongTerm = message.toLowerCase().includes('long-term') || 
                       message.toLowerCase().includes('sustainable') ||
                       message.toLowerCase().includes('strategic')
    if (!hasLongTerm) {
      suggestions.push('Consider emphasizing long-term value and strategic benefits')
    }

    return {
      isValid: suggestions.length === 0,
      suggestions
    }
  }
}

export const brandStudio = new BrandStudio()
