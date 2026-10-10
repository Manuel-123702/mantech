'use client';

import * as React from 'react';
import { useUser, useAuth as useClerkAuth, useSession } from '@clerk/nextjs';

export type AuthRoleCore = 'intern' | 'company' | 'university' | 'admin';

export type AuthRole =
  AuthRoleCore;

export interface AuthUser {
  id: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  avatar?: string | null;
  clerkId?: string;
  role?: AuthRole;
  universityId?: string | null;
}

export interface AuthProfile {
  id?: string;
  full_name?: string;
  fullName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role?: AuthRole;
  userId?: string;
  universityId?: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  userId: string | null;
  role: AuthRole;
  profile: AuthProfile | null;
  isLoaded: boolean;
  loading: boolean;
  isSignedIn: boolean | undefined;
  /** Dashboards the server has confirmed this role may open. */
  dashboards: string[];
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

function normalizeRole(input: any): AuthRole {
  if (!input) return 'intern';
  const r = String(input).toLowerCase();
  switch (r) {
    case 'admin':
      return 'admin';
    case 'company':
    case 'employer':
    case 'recruiter':
      return 'company';
    case 'university':
    case 'school':
      return 'university';
    case 'intern':
    case 'student':
    case 'candidate':
    default:
      return 'intern';
  }
}

export function useAuth(): UseAuthReturn {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { userId, signOut: clerkSignOut } = useClerkAuth();
  const { isLoaded: sessionLoaded } = useSession();

  // The server is the source of truth for roles (an admin is recognised by the
  // ADMIN_EMAILS allowlist, which lives server-side). Clerk metadata alone
  // cannot answer that, so we ask /api/me and fall back to metadata if it fails.
  const [serverRole, setServerRole] = React.useState<AuthRole | null>(null);
  const [serverDashboards, setServerDashboards] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isSignedIn || !userId) {
      setServerRole(null);
      setServerDashboards([]);
      return;
    }
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.role) return;
        const mapped = normalizeRole(data.role);
        setServerRole(mapped);
        setServerDashboards(Array.isArray(data.dashboards) ? data.dashboards : []);
      })
      .catch(() => {
        // Offline or 401 — keep the Clerk-derived role.
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, userId]);

  const isLoaded = userLoaded && sessionLoaded;

  const metadataRole: AuthRole = React.useMemo(() => {
    if (!user?.publicMetadata) return 'intern';
    return normalizeRole((user.publicMetadata as any)?.role);
  }, [user?.publicMetadata]);

  // Server wins; metadata is only a provisional fallback.
  const role: AuthRole = serverRole ?? metadataRole;

  const authUser: AuthUser | null = React.useMemo(() => {
    if (!user) return null;
    const full = `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined;
    const meta = (user.publicMetadata as any) || {};
    return {
      id: userId || user.id,
      clerkId: user.id,
      full_name: full,
      fullName: full,
      email: user.primaryEmailAddress?.emailAddress || undefined,
      avatar: user.imageUrl || null,
      role,
      universityId: meta.universityId ?? null,
    };
  }, [user, userId, role]);

  const profile: AuthProfile | null = React.useMemo(() => {
    if (!user) return null;
    const full = `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined;
    const meta = (user.publicMetadata as any) || {};
    return {
      id: userId || undefined,
      userId: userId || undefined,
      full_name: full,
      fullName: full,
      first_name: user.firstName || undefined,
      last_name: user.lastName || undefined,
      email: user.primaryEmailAddress?.emailAddress || undefined,
      phone: user.primaryPhoneNumber?.phoneNumber || null,
      bio: null,
      avatar_url: user.imageUrl || null,
      role,
      universityId: meta.universityId ?? null,
    };
  }, [user, userId, role]);

  const signOut = React.useCallback(async () => {
    try {
      await clerkSignOut();
    } catch (e) {
      // ignore
    }
  }, [clerkSignOut]);

  return {
    user: authUser,
    userId: userId ?? null,
    role,
    profile,
    isLoaded,
    loading: !isLoaded,
    isSignedIn,
    dashboards: serverDashboards,
    isAdmin: role === 'admin',
    signOut,
  };
}
