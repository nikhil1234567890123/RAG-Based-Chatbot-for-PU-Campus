import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowIncomplete?: boolean;
  allowGuest?: boolean;
}

export default function ProtectedRoute({
  children,
  allowIncomplete = false,
  allowGuest = false,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Fast 1.5s timeout safeguard
        const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
          setTimeout(() => resolve({ data: { user: null } }), 1500)
        );

        // 1. Fast initial session check from local storage/memory
        const sessionRes = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]) as any;

        let currentUser = sessionRes?.data?.session?.user ?? null;

        if (!currentUser && !allowGuest) {
          // If no session found locally and guest access is NOT allowed, try server check with timeout
          const userRes = await Promise.race([
            supabase.auth.getUser(),
            timeoutPromise
          ]) as any;
          currentUser = userRes?.data?.user ?? null;
        }

        if (!isMounted) return;
        setUser(currentUser);

        if (!currentUser) {
          setLoading(false);
          return;
        }

        // 2. Fetch profile with 1.5s timeout safeguard
        const email = currentUser.email;
        const profileTimeout = new Promise<{ data: null }>((resolve) =>
          setTimeout(() => resolve({ data: null }), 1500)
        );

        try {
          const profilePromise = supabase
            .from("profiles")
            .select("full_name, department, batch, course, semester_year, program_type")
            .eq("id", currentUser.id)
            .maybeSingle();

          const profileRes = await Promise.race([
            profilePromise,
            profileTimeout
          ]) as any;

          if (!isMounted) return;

          const profile = profileRes?.data ?? null;

          const isComplete = !!(
            profile &&
            profile.full_name &&
            profile.department &&
            profile.batch &&
            profile.course &&
            profile.semester_year &&
            profile.program_type
          );

          setProfileComplete(isComplete);

          if (email) {
            localStorage.setItem("user_id", email);
            localStorage.setItem("user_email", email);
          }
          if (profile) {
            if (profile.full_name) localStorage.setItem("user_name", profile.full_name);
            if (profile.department) localStorage.setItem("user_department", profile.department);
            if (profile.batch) localStorage.setItem("user_batch", profile.batch);
          }
        } catch (err) {
          console.error("Profile check error in ProtectedRoute:", err);
          const hasLocalName = !!localStorage.getItem("user_name");
          setProfileComplete(hasLocalName);
        }
      } catch (err) {
        console.error("Authentication error in ProtectedRoute:", err);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowGuest]);

  if (loading) {
    return <LoadingSpinner message="Verifying Institutional Credentials..." subtext="Checking Panjab University student authorization" />;
  }

  // If user is not logged in:
  // - If allowGuest is true -> allow rendering children (ChatPage in Guest mode)
  // - If allowGuest is false -> redirect to /login
  if (!user && !allowGuest) return <Navigate to="/login" replace />;

  // User profile incomplete and route doesn't allow incomplete profiles -> redirect to profile completion
  if (user && !profileComplete && !allowIncomplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
}


