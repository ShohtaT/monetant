import { NextRequest, NextResponse } from 'next/server';
import { authSignupSchema } from '@/backend/utils/validation';
import { handleApiError } from '@/backend/utils/errors';
import { supabaseClient } from '@/backend/infrastructure/external/supabase';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = authSignupSchema.parse(body);
    
    // Supabaseクライアントのテスト（実際の認証は行わない）
    const supabaseTest = supabaseClient ? 'Supabase client available' : 'Supabase client not available';
    
    return NextResponse.json(
      {
        message: 'Signup endpoint with Supabase is working',
        validatedData,
        supabaseTest
      },
      { status: 200 }
    );
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.status }
    );
  }
}
