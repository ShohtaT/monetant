'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabaseClient } from '@/backend/infrastructure/external/supabase';
import type { User } from '@supabase/supabase-js';
import Loading from "@/frontend/shared/ui/Loading";
import { logout as logoutApi } from '@/frontend/features/logout/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Pages that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup'];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      
      if (!user && !isPublicRoute) {
        // User is not authenticated and trying to access a protected route
        router.push('/login');
      } else if (user && isPublicRoute) {
        // User is authenticated but on a public route (login/signup)
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    try {
      await logoutApi();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: force logout even if API call fails
      await supabaseClient.auth.signOut();
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Don't render children until authentication check is complete and redirects are handled
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  
  // If user is not authenticated and trying to access protected route, show loading
  if (!user && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading/>
      </div>
    );
  }
  
  // If user is authenticated and on a public route, show loading during redirect
  if (user && isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading/>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
