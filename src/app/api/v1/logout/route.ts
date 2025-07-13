import { NextResponse } from 'next/server';
import { logout } from '@/backend/domains/user/commands/logout';
import { handleApiError } from '@/backend/utils/errors';

/**
 * POST /api/v1/logout
 * @returns A JSON response indicating logout success or an error message.
 */
export async function POST(): Promise<NextResponse> {
  try {
    await logout();

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.status }
    );
  }
}
