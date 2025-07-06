export class DomainError extends Error {
  constructor(
    message: string,
    public code: string = 'DOMAIN_ERROR'
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = 'AUTH_ERROR'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string = 'DATABASE_ERROR'
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleApiError(error: unknown) {
  // Handle Zod validation errors
  if (error instanceof Error && error.name === 'ZodError') {
    return { error: 'Invalid input data', code: 'VALIDATION_ERROR', status: 400 };
  }

  if (error instanceof AuthError) {
    return { error: error.message, code: error.code, status: 401 };
  }

  if (error instanceof DomainError) {
    return { error: error.message, code: error.code, status: 400 };
  }

  if (error instanceof DatabaseError) {
    return { error: error.message, code: error.code, status: 500 };
  }

  console.error('Unexpected error:', error);
  return { error: 'Internal server error', code: 'INTERNAL_ERROR', status: 500 };
}
