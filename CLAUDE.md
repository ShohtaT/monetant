# CLAUDE.md - "monetant" Development Guidelines

## Project Overview

"monetant" is a group expense management application built with Domain-Driven Design (DDD) and CQRS patterns. The application handles user authentication, group management, payment tracking, and debt settlement.

## Architecture

### Backend Architecture (DDD + CQRS)

#### Domain Layer (`src/backend/domains/`)
- **Entities**: Business objects with identity and business rules
- **Commands**: Write operations that modify state
- **Queries**: Read operations that retrieve data
- **Repositories**: Interfaces for data access

#### Infrastructure Layer (`src/backend/infrastructure/`)
- **Database**: Prisma ORM with PostgreSQL
- **External Services**: Supabase authentication
- **Repository Implementations**: Concrete repository classes

#### API Layer (`src/app/api/`)
- Next.js API Routes following REST conventions
- Thin controllers that delegate to domain layer
- Standardized error handling and response formats

### Frontend Architecture

#### Feature-Based Structure (`src/frontend/features/`)
- Each feature has its own directory with:
  - `api.ts` - API client functions
  - `components/` - Feature-specific components
  - `validation.ts` - Form validation schemas

#### Shared Components (`src/frontend/shared/`)
- `ui/` - Reusable UI components
- `types/` - Common TypeScript types

#### Context (`src/frontend/context/`)
- `AuthContext.tsx` - Authentication state management with automatic redirects

## Technology Stack

### Backend
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Testing**: Vitest

### Frontend
- **Framework**: React 18
- **Forms**: react-hook-form + Zod resolvers
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Type Safety**: TypeScript

## Code Conventions

### TypeScript Naming
- **Database columns**: snake_case (PostgreSQL convention)
- **TypeScript properties**: camelCase
- **Example**: `auth_id` in database → `authId` in TypeScript

### API Conventions
- **Endpoints**: `/api/v1/{resource}`
- **HTTP Methods**: Standard REST (GET, POST, PUT, DELETE)
- **Request/Response**: JSON with consistent error format

### File Organization
```
src/
├── app/                    # Next.js App Router
│   ├── api/v1/            # API endpoints
│   └── {route}/page.tsx   # Application pages
├── backend/
│   ├── domains/           # DDD domain layer
│   │   └── {domain}/
│   │       ├── entities/  # Domain entities
│   │       ├── commands/  # Write operations
│   │       ├── queries/   # Read operations
│   │       └── repositories/ # Repository interfaces
│   ├── infrastructure/    # External dependencies
│   └── utils/            # Shared utilities
└── frontend/
    ├── features/         # Feature-specific code
    ├── shared/          # Reusable components
    └── context/         # Global state
```

## Development Patterns

### Domain Entity Pattern
```typescript
export class User {
  private constructor(
    public readonly id: number,
    public readonly authId: string,
    public readonly email: string,
    public readonly nickname: string,
    public readonly lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: CreateUserData): User {
    // Validation and business rules
    return new User(...);
  }
}
```

### Command Pattern
```typescript
export async function commandName(params: CommandParams): Promise<Result> {
  // 1. Validation
  // 2. Business logic
  // 3. External service calls (if needed)
  // 4. Database operations (with transactions)
  // 5. Return result
}
```

### Repository Pattern
```typescript
export interface UserRepository {
  create(user: CreateUserData): Promise<User>;
  findByAuthId(authId: string): Promise<User | null>;
  updateLastLogin(authId: string): Promise<void>;
}
```

### API Route Pattern
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    const result = await domainCommand(validatedData);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Authentication Flow

### User Registration
1. Frontend validation (Zod schema)
2. Email format and password strength validation
3. Supabase user creation
4. Database user record creation (transaction)
5. Automatic cleanup on failure

### User Login
1. Frontend validation
2. Supabase authentication
3. Database user lookup
4. Update last_login_at timestamp
5. Return user data

### Session Management
- AuthContext provides global authentication state
- Automatic redirects based on route protection
- Loading states prevent content flash
- API-based logout with Supabase fallback

## Database Schema

### Core Tables
- `users` - User profiles with Supabase auth integration
- `groups` - Expense sharing groups
- `group_users` - Group membership relationships
- `payments` - Expense records
- `debt_relations` - Individual debt tracking

### Key Fields
- `auth_id` - Links to Supabase user UUID
- `last_login_at` - Tracks user activity
- All tables have `created_at` and `updated_at` timestamps

## Testing Strategy

### Unit Tests
- Domain entities business logic
- Commands and queries
- Validation schemas
- Use Vitest for modern testing experience

### Test Structure
```typescript
describe('CommandName', () => {
  it('should handle success case', async () => {
    // Arrange, Act, Assert
  });

  it('should handle error case', async () => {
    // Test error scenarios
  });
});
```

## Error Handling

### Backend Errors
```typescript
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
  }
}
```

### Frontend Error Handling
- Form validation with react-hook-form
- API error display in user-friendly format
- Graceful degradation for network failures

## Security Guidelines

### Authentication
- Never store passwords directly
- Use Supabase for secure authentication
- Implement proper session validation
- Clean sensitive data from responses

### Data Validation
- Server-side validation for all inputs
- Use Zod for type-safe validation
- Sanitize user inputs
- Validate business rules in domain layer

## Development Commands

### Package Management
- Use **pnpm** for all package operations
- Follow scripts defined in `package.json`

### Database
```bash
pnpm db:migrate      # Apply migrations (prisma migrate dev)
pnpm db:reset        # Reset database (prisma migrate reset)
pnpm db:generate     # Generate client (prisma generate)
pnpm db:studio       # Open Prisma Studio
```

### Development
```bash
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
```

### Testing
```bash
pnpm vitest          # Run tests with Vitest
```

### Linting
```bash
pnpm lint            # ESLint check
pnpm lint-fix        # ESLint fix + Prettier format
```

## Key Principles

1. **Domain-First**: Business logic in domain layer
2. **Type Safety**: Comprehensive TypeScript usage
3. **Separation of Concerns**: Clear layer boundaries
4. **Transaction Safety**: Database consistency
5. **User Experience**: Smooth authentication flows
6. **Code Organization**: Feature-based structure
7. **Testing**: Comprehensive test coverage
8. **Error Handling**: Graceful error management

## Language Guidelines

### Documentation and Code
- **CLAUDE.md and technical documentation**: English
- **Code comments and variable names**: English
- **API documentation**: English

### User-Facing Content
- **Pull request titles and descriptions**: Japanese
- **Frontend UI text and messages**: Japanese
- **Error messages displayed to users**: Japanese
- **Form labels and placeholders**: Japanese

### Example
```typescript
// Good: English for code, Japanese for UI
const ErrorMessage = () => (
  <div className="text-red-500">
    メールアドレスまたはパスワードが正しくありません
  </div>
);
```

## Notes for Claude

- Always check existing patterns before implementing new features
- Follow the established naming conventions (snake_case DB, camelCase TS)
- Use transactions for multi-step operations
- Maintain separation between domain and infrastructure layers
- Test both success and error scenarios
- Update CLAUDE.md when adding new patterns or conventions
- **Use Japanese for pull requests and user-facing frontend content**