import { NextRequest, NextResponse } from 'next/server';
import { createPayment } from '@/backend/domains/payment/commands/createPayment';
import { PrismaPaymentRepository } from '@/backend/infrastructure/database/repositories/PrismaPaymentRepository';
import { PrismaDebtRelationRepository } from '@/backend/infrastructure/database/repositories/PrismaDebtRelationRepository';
import { PrismaUserRepository } from '@/backend/infrastructure/database/repositories/PrismaUserRepository';
import { createPaymentSchema } from '@/backend/utils/validation';
import { handleApiError } from '@/backend/utils/errors';
import {
  CreatePaymentResponse,
  toPaymentResponse,
  toDebtRelationResponse,
} from '@/backend/domains/payment/entities/PaymentResponse';
import { supabaseClient } from '@/backend/infrastructure/external/supabase';

/**
 * POST /api/v1/payments
 * @param request - The incoming Next.js request object.
 * @returns A JSON response containing the payment data or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get current user from Supabase session
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Find user by auth_id
    const userRepository = new PrismaUserRepository();
    const currentUser = await userRepository.findByAuthId(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const paymentRepository = new PrismaPaymentRepository();
    const debtRelationRepository = new PrismaDebtRelationRepository();

    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    const result = await createPayment(
      validatedData,
      currentUser.id,
      paymentRepository,
      debtRelationRepository,
      userRepository
    );

    const response: CreatePaymentResponse = {
      payment: toPaymentResponse(result.payment),
      debtRelations: result.debtRelations.map(toDebtRelationResponse),
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
