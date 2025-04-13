import { supabaseClient } from '@/lib/supabase/supabaseClient';

export class AuthRepository {
  supabaseClient = supabaseClient;

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    const { error } = await this.supabaseClient.auth.signOut();
    if (error) throw error;
  }

  async getSession() {
    const { data, error } = await this.supabaseClient.auth.getSession();
    if (error) throw error;
    return data;
  }

  async getUser() {
    const { data } = await this.supabaseClient.auth.getUser();
    return data;
  }

  async createUserProfile(authId: string, nickname: string) {
    const { data, error } = await this.supabaseClient
      .from('Users')
      .insert([{ auth_id: authId, nickname: nickname }]);

    if (error) throw error;
    return data;
  }
}
