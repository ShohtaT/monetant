import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/backend/domains/user/commands/signup';
import { PrismaUserRepository } from '@/backend/infrastructure/database/repositories/PrismaUserRepository';
import { authSignupSchema } from '@/backend/utils/validation';
import { handleApiError } from '@/backend/utils/errors';
import { AuthSignupResponse, toUserResponse } from '@/backend/domains/user/entities/UserResponse';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userRepository = new PrismaUserRepository();
    
    const body = await request.json();
    const validatedData = authSignupSchema.parse(body);
    const result = await signup(validatedData, userRepository);

    const response: AuthSignupResponse = {
      user: toUserResponse(result.user),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.status }
    );
  }
}
