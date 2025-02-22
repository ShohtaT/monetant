import { User } from '@/types/user';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { getUserByUserIdToSupabase } from '@/app/api/helper/userHelper';

/**
 * Retrieve Users
 *
 * @return data of User[]
 */
export async function getUsersList(): Promise<User[]> {
  const { data, error } = await supabaseClient.from('Users').select();
  if (error) throw error;

  return data ?? [];
}

/**
 * Retrieve User
 *
 * @param userId number
 * @return data of User
 */
export async function getUser(userId: number): Promise<User | null> {
  return await getUserByUserId(userId);
}

/**
 * Retrieve User
 *
 * @param userId number
 * @return data of User
 */
async function getUserByUserId(userId: number): Promise<User | null> {
  return await getUserByUserIdToSupabase(userId);
}
