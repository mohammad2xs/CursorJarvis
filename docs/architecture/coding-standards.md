# CursorJarvis Coding Standards

## Overview
This document defines the coding standards and best practices for the CursorJarvis project, ensuring consistency, maintainability, and quality across the codebase.

## General Principles

### Code Quality
- **Readability First** - Code should be self-documenting and easy to understand
- **Consistency** - Follow established patterns and conventions
- **Simplicity** - Prefer simple solutions over complex ones
- **Performance** - Consider performance implications of code decisions

### Documentation
- **JSDoc Comments** - All public functions and classes must have JSDoc comments
- **README Files** - Each major component should have a README
- **Inline Comments** - Complex logic should be explained with comments
- **Type Definitions** - Use TypeScript types for better code clarity

## TypeScript Standards

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string
  name: string
  email: string
}

// Use types for unions and computed types
type Status = 'pending' | 'approved' | 'rejected'
type UserWithStatus = User & { status: Status }
```

### Naming Conventions
- **PascalCase** - Classes, interfaces, types, enums
- **camelCase** - Variables, functions, methods
- **SCREAMING_SNAKE_CASE** - Constants
- **kebab-case** - File names and URLs

### File Organization
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── shared/         # Shared components
│   └── dashboard/      # Dashboard-specific components
├── lib/                # Utility functions and services
├── types/              # TypeScript type definitions
└── app/                # Next.js app directory
```

## React/Next.js Standards

### Component Structure
```typescript
// Component file structure
import React, { useState, useEffect, memo } from 'react'
import { ComponentProps } from '@/types'

interface Props {
  // Props definition
}

const ComponentName = memo(({ prop1, prop2 }: Props) => {
  // Hooks
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [])
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
})

ComponentName.displayName = 'ComponentName'
export { ComponentName }
```

### Hooks Usage
- **Custom Hooks** - Extract reusable logic into custom hooks
- **Dependency Arrays** - Always include all dependencies in useEffect
- **Memoization** - Use useMemo and useCallback for expensive operations
- **State Management** - Prefer local state, use global state sparingly

### Performance Optimization
- **React.memo** - Wrap components that receive stable props
- **useMemo** - Memoize expensive calculations
- **useCallback** - Memoize event handlers passed to child components
- **Lazy Loading** - Use dynamic imports for code splitting

## API Standards

### Route Handlers
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { APIHandler } from '@/lib/api-handler'

export async function GET(request: NextRequest) {
  return APIHandler.handleRequest(async () => {
    // Handler logic
    return data
  }, 'Error message')
}
```

### Error Handling
- **Consistent Error Responses** - Use APIHandler for standardized error responses
- **Proper HTTP Status Codes** - Use appropriate status codes
- **Error Logging** - Log errors with context
- **User-Friendly Messages** - Provide clear error messages

### Validation
- **Input Validation** - Validate all inputs using APIHandler.validateRequiredParams
- **Type Safety** - Use TypeScript for compile-time type checking
- **Runtime Validation** - Validate data at runtime when needed

## Database Standards

### Prisma Usage
```typescript
// Use transactions for related operations
const result = await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData })
  const profile = await tx.profile.create({ data: profileData })
  return { user, profile }
})

// Use include for related data
const user = await db.user.findUnique({
  where: { id },
  include: { profile: true, posts: true }
})
```

### Query Optimization
- **Select Specific Fields** - Only select needed fields
- **Use Indexes** - Ensure proper database indexes
- **Batch Operations** - Use batch operations when possible
- **Connection Pooling** - Use connection pooling for better performance

## Testing Standards

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName prop1="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Integration Tests
- **API Endpoints** - Test API endpoints with real data
- **Database Operations** - Test database operations
- **Component Integration** - Test component interactions

### Test Coverage
- **Minimum 80%** - Aim for 80% code coverage
- **Critical Paths** - 100% coverage for critical business logic
- **Edge Cases** - Test edge cases and error conditions

## Security Standards

### Input Sanitization
- **Validate All Inputs** - Never trust user input
- **Sanitize Data** - Sanitize data before processing
- **Use Parameterized Queries** - Prevent SQL injection

### Authentication & Authorization
- **JWT Tokens** - Use JWT for authentication
- **Role-Based Access** - Implement proper authorization
- **Session Management** - Secure session handling

### Data Protection
- **Encryption** - Encrypt sensitive data
- **Environment Variables** - Use environment variables for secrets
- **HTTPS Only** - Use HTTPS in production

## Performance Standards

### Bundle Size
- **Code Splitting** - Use dynamic imports for large components
- **Tree Shaking** - Remove unused code
- **Asset Optimization** - Optimize images and assets

### Runtime Performance
- **Lazy Loading** - Load components and data on demand
- **Caching** - Implement appropriate caching strategies
- **Database Optimization** - Optimize database queries

## Git Standards

### Commit Messages
```
type(scope): description

feat(api): add user authentication endpoint
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
```

### Branch Naming
- **feature/description** - New features
- **bugfix/description** - Bug fixes
- **hotfix/description** - Critical fixes
- **refactor/description** - Code refactoring

### Pull Request Process
1. **Create Feature Branch** - From main branch
2. **Write Tests** - Include tests for new functionality
3. **Update Documentation** - Update relevant documentation
4. **Code Review** - Request review from team members
5. **Merge** - Merge after approval and CI passes

## Code Review Checklist

### Before Submitting
- [ ] Code follows naming conventions
- [ ] Functions have JSDoc comments
- [ ] Tests are written and passing
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

### During Review
- [ ] Code is readable and maintainable
- [ ] Logic is correct and efficient
- [ ] Security considerations addressed
- [ ] Tests cover the functionality
- [ ] Documentation is updated

## Tools and Configuration

### ESLint Configuration
```javascript
module.exports = {
  extends: ['next/core-web-vitals', '@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Conclusion

These coding standards ensure that the CursorJarvis codebase remains maintainable, scalable, and of high quality. All team members should follow these standards and contribute to their improvement over time.

---

**Last Updated:** September 6, 2024  
**Version:** 1.0  
**Next Review:** October 6, 2024
