import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USERS } from '../data/mockUsers';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext();

const mapSupabaseUser = (sbUser) => {
  if (!sbUser) return null;
  const meta = sbUser.user_metadata || {};
  const app = sbUser.app_metadata || {};
  const provider =
    app.provider || meta.provider || (app.providers && app.providers[0]) || 'email';

  const name =
    meta.full_name ||
    meta.name ||
    meta.preferred_username ||
    meta.user_name ||
    (sbUser.email ? sbUser.email.split('@')[0] : null) ||
    'User';

  const role = meta.role || 'OFFICER';
  const avatar_url = meta.avatar_url || meta.picture || meta.avatar || null;
  const profile_complete = meta.profile_complete === true;

  return {
    id: sbUser.id,
    name,
    email: sbUser.email || '',
    role,
    department: meta.department || 'Emergency Response Unit',
    status: 'Active',
    badge: profile_complete
      ? `${role} Operator`
      : provider === 'google'
        ? 'Google Account'
        : `${role} Operator`,
    avatar_url,
    provider,
    isRealAuth: true,
    profile_complete,
    email_confirmed: !!sbUser.email_confirmed_at,
    rawUser: sbUser,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (isSupabaseConfigured) return null;
    try {
      const saved = localStorage.getItem('ner_user');
      return saved ? JSON.parse(saved) : DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user state with localStorage in demo mode
  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (user) {
        localStorage.setItem('ner_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('ner_user');
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Clean leftover demo keys if using Supabase
    try {
      const saved = localStorage.getItem('ner_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed?.isRealAuth) {
          localStorage.removeItem('ner_user');
          localStorage.removeItem('ner_auth_token');
        }
      }
    } catch {
      localStorage.removeItem('ner_user');
    }

    let isMounted = true;

    // Fetch current session & subscribe to auth changes
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ? mapSupabaseUser(session.user) : null);
        }
      } catch (err) {
        console.error('[BHUSENTRY Auth] Get session error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        localStorage.removeItem('ner_user');
        localStorage.removeItem('ner_auth_token');
        sessionStorage.removeItem('bhusentry_signup_intent');
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 1. Email + Password Sign In
  const login = useCallback(async (email, password, chosenRole = 'OFFICER') => {
    setAuthError(null);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const msg = error.message || 'Sign in failed';
        let customMsg = msg;
        if (/email not confirmed/i.test(msg)) {
          customMsg = 'Please verify your email first.';
        } else if (/invalid login credentials/i.test(msg)) {
          customMsg = 'Invalid email or password.';
        }
        setAuthError(customMsg);
        return { success: false, message: customMsg };
      }

      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
        return { success: true, user: mapSupabaseUser(data.user) };
      }
      return { success: true };
    }

    // Demo Mode fallback
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.role === chosenRole
    );
    const loggedUser = matched || {
      id: 99,
      name: email.split('@')[0] || 'Demo User',
      email,
      role: chosenRole,
      department: 'Emergency Response Unit',
      status: 'Active',
      badge: `${chosenRole} Operator`,
      isRealAuth: false,
      profile_complete: true,
    };
    setUser(loggedUser);
    localStorage.setItem('ner_auth_token', 'mock_jwt_token_bhusentry');
    return { success: true, user: loggedUser };
  }, []);

  // Standard email/password signup
  const signUp = useCallback(async (email, password, fullName = '', role = 'OFFICER') => {
    setAuthError(null);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName, role, profile_complete: false },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        const msg = error.message || 'Sign up failed';
        if (/already registered|already been registered|user already/i.test(msg)) {
          return {
            success: false,
            message: 'This email is already registered. Switch to Sign In.',
            code: 'already_registered',
          };
        }
        setAuthError(msg);
        return { success: false, message: msg };
      }

      const identities = data?.user?.identities || [];
      if (data?.user && identities.length === 0) {
        return {
          success: false,
          message: 'This email is already registered. Please Sign In instead.',
          code: 'already_registered',
        };
      }

      if (data?.session) {
        setUser(mapSupabaseUser(data.user));
        return { success: true, message: 'Account created.', session: true };
      }

      return {
        success: true,
        message: 'Account created. Please check your email to verify.',
        session: false,
        needsEmailConfirm: true,
      };
    }

    const newUser = {
      id: Date.now(),
      name: fullName || email.split('@')[0],
      email,
      role,
      department: 'Emergency Response Unit',
      status: 'Active',
      badge: `${role} Operator`,
      isRealAuth: false,
      profile_complete: true,
    };
    setUser(newUser);
    localStorage.setItem('ner_auth_token', 'mock_jwt_token_bhusentry');
    return { success: true, message: 'Account created (demo mode).', session: true };
  }, []);

  // 2 & 3. Google Sign-In / Google Sign-Up
  const loginWithGoogle = useCallback(async (isSignup = false) => {
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
      return false;
    }

    try {
      // Clear legacy storage
      localStorage.removeItem('ner_user');
      localStorage.removeItem('ner_auth_token');

      // Set signup intent flag if user clicked "Continue with Google" on Sign Up tab
      if (isSignup) {
        sessionStorage.setItem('bhusentry_signup_intent', '1');
      } else {
        sessionStorage.removeItem('bhusentry_signup_intent');
      }

      const redirectTo = `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { access_type: 'online', prompt: 'select_account' },
        },
      });

      if (error) {
        setAuthError(error.message || 'Google sign-in failed');
        return false;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
      return true;
    } catch (err) {
      setAuthError(err.message || 'Google sign-in failed');
      return false;
    }
  }, []);

  // 4. Email OTP Sign-Up (Send Code)
  const sendEmailOtp = useCallback(async (email) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'Supabase is required for email verification. Add keys to .env.',
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/complete-profile`,
      },
    });

    if (error) {
      setAuthError(error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Verification code sent! Check your inbox for your 6-digit code.',
    };
  }, []);

  // 4. Email OTP Sign-Up (Verify Code)
  const verifyEmailOtp = useCallback(async (email, token) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is required.' };
    }

    const emailClean = email.trim().toLowerCase();
    const tokenClean = token.trim();

    // Try 'email' type first, fallback to 'signup'
    let { data, error } = await supabase.auth.verifyOtp({
      email: emailClean,
      token: tokenClean,
      type: 'email',
    });

    if (error) {
      ({ data, error } = await supabase.auth.verifyOtp({
        email: emailClean,
        token: tokenClean,
        type: 'signup',
      }));
    }

    if (error) {
      setAuthError(error.message);
      return {
        success: false,
        message: `${error.message} — Ensure Supabase email template includes {{ .Token }}.`,
      };
    }

    if (data?.user) {
      const mapped = mapSupabaseUser(data.user);
      setUser(mapped);
      sessionStorage.setItem('bhusentry_signup_intent', '1');
      return { success: true, message: 'Email verified successfully.', user: mapped };
    }

    return { success: false, message: 'Verification failed. Could not obtain session.' };
  }, []);

  // 5. Complete Profile Page submission
  const completeSignupProfile = useCallback(async ({ fullName, role, password }) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      if (user) {
        const updated = {
          ...user,
          name: fullName || user.name,
          role: role || user.role,
          badge: `${role || user.role} Operator`,
          profile_complete: true,
        };
        setUser(updated);
        sessionStorage.removeItem('bhusentry_signup_intent');
        return { success: true, message: 'Profile completed (demo mode).' };
      }
      return { success: false, message: 'No authenticated user found.' };
    }

    const payload = {
      data: {
        full_name: fullName,
        role: role || 'OFFICER',
        profile_complete: true,
      },
    };

    if (password && password.length >= 6) {
      payload.password = password;
    }

    const { data, error } = await supabase.auth.updateUser(payload);
    if (error) {
      setAuthError(error.message);
      return { success: false, message: error.message };
    }

    if (data?.user) {
      const mapped = mapSupabaseUser(data.user);
      setUser(mapped);
      sessionStorage.removeItem('bhusentry_signup_intent');
      return { success: true, message: 'Account setup complete.', user: mapped };
    }

    return { success: false, message: 'Profile update failed.' };
  }, [user]);

  // Update existing profile details
  const updateProfile = useCallback(async ({ fullName, password, role }) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      if (fullName || role) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: fullName || prev.name,
                role: role || prev.role,
                badge: `${role || prev.role} Operator`,
              }
            : prev
        );
      }
      return { success: true, message: 'Profile updated (demo mode).' };
    }

    const payload = { data: {} };
    if (fullName) payload.data.full_name = fullName;
    if (role) payload.data.role = role;
    if (password && password.length >= 6) payload.password = password;

    const { data, error } = await supabase.auth.updateUser(payload);
    if (error) {
      setAuthError(error.message);
      return { success: false, message: error.message };
    }

    if (data?.user) {
      const mapped = mapSupabaseUser(data.user);
      setUser(mapped);
      return { success: true, message: 'Profile saved successfully.', user: mapped };
    }

    return { success: false, message: 'Update failed.' };
  }, []);

  const switchRole = useCallback((newRole) => {
    if (isSupabaseConfigured) return;
    const matched = DEMO_USERS.find((u) => u.role === newRole);
    if (matched) setUser(matched);
    else setUser((prev) => (prev ? { ...prev, role: newRole, badge: `${newRole} Role` } : null));
  }, []);

  // Sign out
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('[BHUSENTRY Auth] Supabase signOut error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('ner_auth_token');
    localStorage.removeItem('ner_user');
    sessionStorage.removeItem('bhusentry_signup_intent');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signUp,
        loginWithGoogle,
        logout,
        switchRole,
        updateProfile,
        sendEmailOtp,
        verifyEmailOtp,
        completeSignupProfile,
        isAuthenticated: !!user,
        loading,
        authError,
        isSupabaseConfigured,
        isDemoMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);