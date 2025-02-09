import { getSessionAtSupabase, getUserAtSupabase } from '@/lib/supabase/requests/auth';

// @see https://qiita.com/megmogmog1965/items/37d7a4a3335f2758c861
export const getCurrentUserUuid = async (): Promise<string | null> => {
  let uuid = null;
  const data = await getSessionAtSupabase();
  if (data.session !== null) {
    const { user } = await getUserAtSupabase();
    if (user !== null) {
      uuid = user.id;
    } else {
      throw new Error('User not found');
    }
  }
  return uuid;
};
