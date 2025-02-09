import { getSessionAtSupabase, getUserAtSupabase } from '@/lib/supabase/requests/auth';

// @see https://qiita.com/megmogmog1965/items/37d7a4a3335f2758c861
export const getCurrentUser = async () => {
  let currentUser = null;
  const data = await getSessionAtSupabase();
  if (data.session !== null) {
    const { user } = await getUserAtSupabase();
    if (user !== null) {
      currentUser = user;
    } else {
      throw new Error('User not found');
    }
  }
  return currentUser;
};
