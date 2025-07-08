import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/backend/domains/user/commands/login';
import { PrismaUserRepository } from '@/backend/infrastructure/database/repositories/PrismaUserRepository';
import { authLoginSchema } from '@/backend/utils/validation';
import { handleApiError } from '@/backend/utils/errors';
import { AuthLoginResponse, toUserResponse } from '@/backend/domains/user/entities/UserResponse';

/**
 * POST /api/v1/auth/login
 * @param request - The incoming Next.js request object.
 * @returns A JSON response containing the user data or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userRepository = new PrismaUserRepository();
    
    const body = await request.json();
    const validatedData = authLoginSchema.parse(body);
    const result = await login(validatedData, userRepository);

    const response: AuthLoginResponse = {
      user: toUserResponse(result.user),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.status }
    );
  }
}
