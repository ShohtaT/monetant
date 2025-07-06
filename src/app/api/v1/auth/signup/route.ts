import { NextRequest, NextResponse } from 'next/server';
import { authSignupSchema } from '@/backend/utils/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = authSignupSchema.parse(body);
    
    return NextResponse.json(
      { 
        message: 'Signup endpoint is working',
        validatedData 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 400 }
    );
  }
}