import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { useAuth } from '../../context/AuthContext';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // Demo / mock mode checks
    if (!isSupabaseConfigured) {
      if (!user) {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Unauthenticated user -> redirect to Login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Real Auth User: check if profile completion is needed
    const signupIntent = sessionStorage.getItem('bhusentry_signup_intent') === '1';
    const profileIncomplete = user.profile_complete !== true;

    if (profileIncomplete || signupIntent) {
      if (location.pathname !== '/complete-profile') {
        navigate('/complete-profile', { replace: true });
      }
    }
  }, [user, loading, isSupabaseConfigured, navigate, location.pathname]);

  // Loading state while Supabase restores session or PKCE token exchange completes
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Verifying session…</p>
      </div>
    );
  }

  // Brief state while redirecting to profile setup
  if (
    isSupabaseConfigured &&
    user?.isRealAuth &&
    (user.profile_complete !== true || sessionStorage.getItem('bhusentry_signup_intent') === '1')
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Opening profile setup…</p>
      </div>
    );
  }

  // Unauthenticated fallback before redirect finishes
  if (!user && isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="px-4 sm:px-8 pt-4">
          <DisclaimerBanner />
        </div>

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;