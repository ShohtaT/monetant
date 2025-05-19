import {getPaymentDetailUseCase} from "@/features/payment/application";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const paymentId = Number(params.id);
  if (!paymentId) return new Response(JSON.stringify({ error: 'Payment ID is required' }), { status: 400 });

  const detail = await getPaymentDetailUseCase(paymentId);
  if (!detail) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(detail), { status: 200 });
}
