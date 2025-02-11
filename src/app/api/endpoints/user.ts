import {User} from "@/types/user";
import {supabaseClient} from "@/lib/supabase/supabaseClient";

/**
 * Retrieve User
 *
 * @param userId number
 * @return data of User
 */
export async function getUser(userId: number): Promise<User | null> {
  const { data, error } = await supabaseClient
    .from('Users')
    .select()
    .eq('id', userId);
  if (error) throw error;
  
  return data[0] ?? null;
}
