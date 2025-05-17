import { createPaymentUseCase } from '@/features/payment/application';

export async function POST(req: Request) {
  const { title, amount, paymentDate, billings, note, creator_id } = await req.json();
  await createPaymentUseCase({ title, amount, paymentDate, billings, note, creator_id });
  return new Response(null, { status: 201 });
}
