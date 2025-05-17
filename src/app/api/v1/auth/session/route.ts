// src/app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  );
  
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
  
  return new Response(JSON.stringify({ session }), { status: 200 });
}
