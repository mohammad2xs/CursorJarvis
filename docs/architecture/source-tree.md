# CursorJarvis Source Tree Structure

## Overview
This document provides a comprehensive overview of the CursorJarvis project structure, explaining the organization of files, directories, and their purposes.

## Root Directory Structure

```
CursorJarvis/
├── .bmad-core/                 # BMAD-METHOD framework
├── .cursor/                    # Cursor IDE configuration
├── chrome-extension/           # Chrome extension source
├── deploy/                     # Deployment artifacts
├── docs/                       # Project documentation
├── external/                   # External resources and subagents
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
├── src/                        # Main application source code
├── web-bundles/                # BMAD web agent bundles
├── .env.local                  # Environment variables
├── .gitignore                  # Git ignore rules
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Node.js dependencies
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```

## Source Code Structure (`src/`)

```
src/
├── app/                        # Next.js App Router
│   ├── analytics/              # Analytics dashboard
│   ├── api/                    # API routes
│   ├── brand/                  # Brand studio page
│   ├── deals/                  # Deal management
│   ├── enhanced-jarvis/        # Enhanced Jarvis features
│   ├── getty-accounts/         # Getty accounts management
│   ├── leads/                  # Lead management
│   ├── meetings/               # Meeting management
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── dashboard/              # Dashboard components
│   ├── layout/                 # Layout components
│   ├── shared/                 # Shared components
│   └── ui/                     # UI component library
├── lib/                        # Utility libraries
└── types/                      # TypeScript type definitions
```

## API Routes Structure (`src/app/api/`)

```
api/
├── auto-subagents/             # Auto-subagent orchestration
├── digest/                     # Weekly digest generation
├── enhanced-jarvis/            # Enhanced Jarvis features
│   ├── call-recording/         # Call recording processing
│   ├── dashboard/              # Dashboard data
│   ├── real-time-coaching/     # Real-time coaching
│   └── revenue-tracking/       # Revenue attribution
├── leads/                      # Lead management
│   ├── [id]/                   # Individual lead operations
│   ├── export/                 # Lead export
│   └── import/                 # Lead import
├── meetings/                   # Meeting management
│   ├── [id]/                   # Individual meeting operations
│   ├── brief/                  # Meeting brief generation
│   └── recap/                  # Meeting recap generation
├── nbas/                       # Next Best Actions
│   └── [id]/                   # Individual NBA operations
├── perplexity/                 # Perplexity AI integration
├── rules/                      # Golden Play rules
│   ├── promote/                # Rule promotion
│   └── retire/                 # Rule retirement
└── subagents/                  # Subagent management
    └── [agent]/                # Individual subagent operations
```

## Components Structure (`src/components/`)

```
components/
├── dashboard/                  # Dashboard-specific components
│   ├── brand-studio.tsx        # Brand studio interface
│   ├── deal-os.tsx             # Deal management interface
│   ├── enhanced-jarvis-dashboard.tsx  # Enhanced Jarvis dashboard
│   ├── getty-accounts.tsx      # Getty accounts interface
│   ├── leads-inbox.tsx         # Leads management interface
│   ├── meeting-os.tsx          # Meeting management interface
│   ├── my-work.tsx             # Personal work interface
│   └── weekly-digest.tsx       # Weekly digest interface
├── layout/                     # Layout components
│   ├── header.tsx              # Application header
│   └── sidebar.tsx             # Navigation sidebar
├── shared/                     # Shared components
│   ├── action-button.tsx       # Reusable action buttons
│   ├── data-table.tsx          # Data table component
│   ├── error-boundary.tsx      # Error boundary component
│   └── loading-state.tsx       # Loading state component
└── ui/                         # Base UI components
    ├── badge.tsx               # Badge component
    ├── button.tsx              # Button component
    ├── card.tsx                # Card component
    ├── checkbox.tsx            # Checkbox component
    ├── input.tsx               # Input component
    ├── progress.tsx            # Progress component
    ├── select.tsx              # Select component
    ├── tabs.tsx                # Tabs component
    └── textarea.tsx            # Textarea component
```

## Library Structure (`src/lib/`)

```
lib/
├── account-intelligence-db.ts  # Account intelligence database
├── api-handler.ts              # API request handler
├── auto-subagents.ts           # Auto-subagent orchestration
├── base-service.ts             # Base service class
├── brand-studio.ts             # Brand studio functionality
├── cache-manager.ts            # Caching system
├── constants.ts                # Application constants
├── context-fetcher.ts          # Company context fetching
├── conversation-intelligence.ts # Conversation analysis
├── db.ts                       # Database connection
├── enhanced-cursor-jarvis.ts   # Enhanced Jarvis service
├── getty-accounts.ts           # Getty accounts management
├── nba-brain.ts                # NBA generation and scoring
├── openai.ts                   # OpenAI integration
├── perplexity.ts               # Perplexity AI integration
├── proactive-insights.ts       # Proactive insights generation
├── query-optimizer.ts          # Database query optimization
├── revenue-intelligence.ts     # Revenue intelligence
├── subagents-client.ts         # Subagent client
├── subagents.ts                # Subagent management
├── utils.ts                    # Utility functions
└── voice-analysis.ts           # Voice analysis service
```

## Chrome Extension Structure (`chrome-extension/`)

```
chrome-extension/
├── icons/                      # Extension icons
│   ├── icon16.png              # 16x16 icon
│   ├── icon32.png              # 32x32 icon
│   ├── icon48.png              # 48x48 icon
│   ├── icon128.png             # 128x128 icon
│   └── README.md               # Icons documentation
├── background.js               # Background service worker
├── content.css                 # Content script styles
├── content.js                  # Content script
├── deploy.sh                   # Deployment script
├── manifest.json               # Extension manifest
├── popup.css                   # Popup styles
├── popup.html                  # Popup HTML
├── popup.js                    # Popup functionality
├── sidebar.css                 # Sidebar styles
├── sidebar.html                # Sidebar HTML
├── sidebar-inject.js           # Sidebar injection script
├── sidebar.js                  # Sidebar functionality
└── USAGE_GUIDE.md              # Usage documentation
```

## Database Structure (`prisma/`)

```
prisma/
└── schema.prisma               # Database schema definition
```

## Documentation Structure (`docs/`)

```
docs/
├── architecture/               # Technical architecture
│   ├── coding-standards.md     # Coding standards
│   ├── source-tree.md          # Source tree documentation
│   └── tech-stack.md           # Technology stack
├── qa/                         # Quality assurance
├── stories/                    # User stories
├── project-brief.md            # Project brief
└── README.md                   # Main documentation
```

## External Resources (`external/`)

```
external/
└── Subagents-collection/       # Specialized AI subagents
    ├── accessibility-specialist.md
    ├── ai-engineer.md
    ├── api-documentor.md
    ├── backend-architect.md
    ├── code-reviewer.md
    ├── frontend-developer.md
    ├── performance-engineer.md
    ├── sales-executive.md
    └── ... (additional subagents)
```

## BMAD Framework Structure (`.bmad-core/`)

```
.bmad-core/
├── agent-teams/                # Agent team configurations
├── agents/                     # Individual agent definitions
├── checklists/                 # Quality checklists
├── core-config.yaml            # Core configuration
├── data/                       # Knowledge base
├── tasks/                      # Task definitions
├── templates/                  # Document templates
├── workflows/                  # Workflow definitions
└── user-guide.md               # BMAD user guide
```

## Configuration Files

### Root Level Configuration
- **`package.json`** - Node.js dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.ts`** - Next.js configuration
- **`eslint.config.mjs`** - ESLint linting rules
- **`postcss.config.mjs`** - PostCSS configuration
- **`.gitignore`** - Git ignore patterns

### Environment Configuration
- **`.env.local`** - Local environment variables
- **`.env.example`** - Environment variables template

## File Naming Conventions

### React Components
- **PascalCase** - Component files (e.g., `BrandStudio.tsx`)
- **kebab-case** - Page files (e.g., `enhanced-jarvis/page.tsx`)

### API Routes
- **kebab-case** - Route files (e.g., `call-recording/route.ts`)
- **Dynamic routes** - Square brackets (e.g., `[id]/route.ts`)

### Utility Files
- **kebab-case** - Library files (e.g., `api-handler.ts`)
- **camelCase** - Function names and variables

### Configuration Files
- **kebab-case** - Config files (e.g., `next.config.ts`)
- **dot-prefix** - Hidden files (e.g., `.env.local`)

## Import/Export Patterns

### Component Exports
```typescript
// Named export with display name
const ComponentName = memo(() => {
  // Component logic
})

ComponentName.displayName = 'ComponentName'
export { ComponentName }
```

### Library Exports
```typescript
// Default export for main functionality
export default ClassName

// Named exports for utilities
export { utilityFunction, constant }
```

### API Route Exports
```typescript
// Named exports for HTTP methods
export async function GET(request: NextRequest) {
  // Handler logic
}

export async function POST(request: NextRequest) {
  // Handler logic
}
```

## Directory Responsibilities

### `src/app/`
- **Pages and API routes** - Next.js App Router structure
- **Layout components** - Application-wide layouts
- **Route-specific logic** - Page-specific functionality

### `src/components/`
- **Reusable components** - Shared across the application
- **UI components** - Base design system components
- **Dashboard components** - Feature-specific components

### `src/lib/`
- **Business logic** - Core application functionality
- **Utilities** - Helper functions and services
- **External integrations** - Third-party service integrations

### `src/types/`
- **Type definitions** - TypeScript type definitions
- **Interface definitions** - Data structure interfaces
- **Enum definitions** - Application constants

## Best Practices

### File Organization
1. **Group by feature** - Related files in the same directory
2. **Separate concerns** - UI, logic, and data in different layers
3. **Consistent naming** - Follow established conventions
4. **Logical hierarchy** - Clear parent-child relationships

### Import Organization
1. **External libraries first** - Third-party imports
2. **Internal modules second** - Application imports
3. **Relative imports last** - Local file imports
4. **Alphabetical order** - Within each group

### Component Structure
1. **Props interface first** - Define component props
2. **Component definition** - Main component logic
3. **Helper functions** - Utility functions
4. **Export statement** - Component export

## Conclusion

This source tree structure provides a clear organization for the CursorJarvis project, making it easy to navigate, maintain, and extend. The structure follows modern React/Next.js best practices and supports the project's scalability requirements.

---

**Last Updated:** September 6, 2024  
**Version:** 1.0  
**Next Review:** October 6, 2024
