import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, completeSignupProfile, loading, isSupabaseConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('OFFICER');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle pre-filling user data and route protection
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const signupIntent = sessionStorage.getItem('bhusentry_signup_intent') === '1';

    // If profile is already complete and no explicit signup intent, head straight to dashboard
    if (user.profile_complete && !signupIntent) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (user.name && user.name !== 'User') {
      setFullName(user.name);
    }
    if (user.role === 'OFFICER' || user.role === 'ANALYST') {
      setSelectedRole(user.role);
    }
  }, [user, loading, navigate]);

  const isGoogleUser = user?.provider === 'google';
  const needsPassword = !isGoogleUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (needsPassword && (!password || password.length < 6)) {
      setError('Please create a password of at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await completeSignupProfile({
        fullName: fullName.trim(),
        role: selectedRole,
        password: password ? password.trim() : undefined,
      });

      if (result.success) {
        sessionStorage.removeItem('bhusentry_signup_intent');
        setSuccess('Profile setup complete! Redirecting to dashboard…');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        setError(result.message || 'Could not update profile.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while setting up your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Restoring session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <Link to="/" className="inline-block">
          <img src="/bhusentry-logo.png" alt="BHUSENTRY" className="w-16 h-16 mx-auto object-contain" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">Complete Your Profile</h1>
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          Signed in as <span className="font-semibold text-slate-700">{user.email}</span>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 relative z-10">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
            <span className="leading-snug">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Officer Rajesh Kumar"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white transition-all font-medium text-slate-700"
            >
              <option value="OFFICER">Officer (Emergency Responder)</option>
              <option value="ANALYST">Analyst (Data Scientist / Geologist)</option>
            </select>
          </div>

          {needsPassword ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password (Optional for Google Users)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank or set a password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving profile…' : <>Continue to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" /></>}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;