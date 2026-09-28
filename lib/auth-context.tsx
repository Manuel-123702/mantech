'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Profile, UserRole } from '@/lib/types';
import { initialData } from '@/lib/data-store';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, password?: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default realistic enterprise demo persona for immediate seamless access
const DEFAULT_USER: AuthUser = {
  id: 'usr_student_01',
  email: 'kamga.david@univ-yaounde1.cm',
  fullName: 'David Kamga',
  role: 'student',
  avatarUrl: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USER);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync profile when user changes or role switches
  const loadProfile = useCallback((role: UserRole) => {
    const existing = initialData.profiles.find((p) => p.role === role);
    if (existing) {
      setProfile(existing);
      setUser({
        id: existing.id,
        email: existing.email,
        fullName: existing.full_name,
        role: existing.role,
        avatarUrl: existing.avatar_url,
      });
    }
  }, []);

  useEffect(() => {
    loadProfile(DEFAULT_USER.role);
  }, [loadProfile]);

  const switchRole = useCallback((newRole: UserRole) => {
    loadProfile(newRole);
  }, [loadProfile]);

  const signIn = async (email: string, _password?: string) => {
    const matched = initialData.profiles.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );
    if (matched) {
      setProfile(matched);
      setUser({
        id: matched.id,
        email: matched.email,
        fullName: matched.full_name,
        role: matched.role,
        avatarUrl: matched.avatar_url,
      });
      return { error: null };
    }

    // Default to student if not found in preloaded profiles
    const newProfile: Profile = {
      id: `usr_${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      avatar_url: null,
      role: 'student',
      sub_role: null,
      phone: '+237 600 000 000',
      bio: 'Enthusiastic IT student on ManTech Nexus',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);
    setUser({
      id: newProfile.id,
      email: newProfile.email,
      fullName: newProfile.full_name,
      role: newProfile.role,
    });
    return { error: null };
  };

  const signUp = async (
    email: string,
    _password: string,
    fullName: string,
    role: UserRole
  ) => {
    const newProfile: Profile = {
      id: `usr_${Date.now()}`,
      email,
      full_name: fullName,
      avatar_url: null,
      role,
      sub_role: null,
      phone: null,
      bio: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);
    setUser({
      id: newProfile.id,
      email: newProfile.email,
      fullName: newProfile.full_name,
      role: newProfile.role,
    });
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      loadProfile(user.role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: user?.role ?? 'student',
        loading,
        switchRole,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
