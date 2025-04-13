import { User } from '@/types/user';
import { supabaseClient } from '@/lib/supabase/supabaseClient';

export class UserRepository {
  supabaseClient = supabaseClient;

  async getUserById(userId: number): Promise<User | null> {
    const { data, error } = await this.supabaseClient
      .from('Users')
      .select()
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    return data ?? null;
  }

  async getUserByAuthId(authId: string): Promise<User | null> {
    const { data, error } = await this.supabaseClient
      .from('Users')
      .select()
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    return data ?? null;
  }

  async getUsersList(): Promise<User[]> {
    const { data, error } = await this.supabaseClient.from('Users').select();
    if (error) throw error;
    return data ?? [];
  }
}
