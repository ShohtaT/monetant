import { supabaseClient } from "@/backend/infrastructure/external/supabase";

export async function GET() {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
  
  return new Response(JSON.stringify({ session }), { status: 200 });
}
