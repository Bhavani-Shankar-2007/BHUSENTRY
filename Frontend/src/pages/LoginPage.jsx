import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const {
    login,
    loginWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    isSupabaseConfigured,
    authError,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState('email'); // 'email' | 'otp'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1. Email + Password Sign In
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      sessionStorage.removeItem('bhusentry_signup_intent');
      const result = await login(email.trim(), password);
      if (result?.success) {
        const target = result.user?.profile_complete ? '/dashboard' : '/complete-profile';
        navigate(target, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Sign-In (Existing user)
  const handleGoogleSignIn = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      await loginWithGoogle(false);
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed.');
      setIsLoading(false);
    }
  };

  // 3. Google Sign-Up (New user flow)
  const handleGoogleSignUp = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      await loginWithGoogle(true);
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-up failed.');
      setIsLoading(false);
    }
  };

  // 4. Send Email OTP (Sign Up Step 1)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendEmailOtp(email.trim());
      if (result.success) {
        setSuccessMessage(result.message);
        setSignupStep('otp');
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Verify Email OTP (Sign Up Step 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!otp.trim() || otp.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit numeric code sent to your email.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyEmailOtp(email.trim(), otp.trim());
      if (result.success) {
        setSuccessMessage('Email verified successfully!');
        navigate('/complete-profile', { replace: true });
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex flex-col items-center gap-3 group">
          <img
            src="/bhusentry-logo.png"
            alt="BHUSENTRY"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">BHUSENTRY</h2>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              AI-Powered Landslide Early Warning Gateway
            </p>
          </div>
        </Link>
      </div>

      {/* Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-xl space-y-6">

          {/* Mode Switcher Tabs */}
          {signupStep === 'email' && (
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setSignupStep('email');
                  clearMessages();
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignupStep('email');
                  clearMessages();
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error & Success Messages */}
          {(errorMessage || authError) && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span className="leading-snug">{errorMessage || authError}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fadeIn">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {mode === 'login' && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@bhusentry.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                      autoComplete="current-password"
                      required
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

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-emerald-700 font-medium hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full py-2.5 rounded-xl font-semibold tracking-wide text-sm" disabled={isLoading}>
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all disabled:opacity-60 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {/* MODE: SIGN UP - Step 1: Email Input */}
          {mode === 'signup' && signupStep === 'email' && (
            <>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Enter your email address. We will send a <strong>6-digit verification code</strong> to set up your account.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full py-2.5 rounded-xl font-semibold tracking-wide text-sm" disabled={isLoading}>
                  {isLoading ? 'Sending code…' : 'Send verification code'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-all disabled:opacity-60 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {/* MODE: SIGN UP - Step 2: OTP Verification */}
          {mode === 'signup' && signupStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setSignupStep('email');
                  clearMessages();
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to email
              </button>

              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Check your inbox</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm tracking-widest font-mono text-center focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-2.5 rounded-xl font-semibold tracking-wide text-sm" disabled={isLoading || otp.length < 6}>
                {isLoading ? 'Verifying…' : 'Verify & Continue'}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSendOtp}
                  className="text-xs text-emerald-700 font-semibold hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {!isSupabaseConfigured && (
            <p className="text-[11px] text-center text-amber-800 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
              Demo mode active. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env for real authentication.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 font-medium">BHUSENTRY • Nature talks. We listen.</p>
      </div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default LoginPage;