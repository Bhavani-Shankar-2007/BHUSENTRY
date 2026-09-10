import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const ProfilePage = () => {
  const { user, updateProfile, isSupabaseConfigured } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('OFFICER');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setRole(user.role || 'OFFICER');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        fullName: fullName.trim(),
        password: password || undefined,
        role,
      });
      if (result.success) {
        setMessage(result.message);
        setPassword('');
        setConfirm('');
      } else {
        setError(result.message || 'Update failed.');
      }
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc =
    user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || user?.email || 'U')}&background=14532D&color=fff&size=128`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your display name, security, and account details.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={avatarSrc}
            alt=""
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600/20"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="text-base font-bold text-slate-900">{user?.name || 'Your profile'}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5 capitalize">
              Signed in with {user?.provider || 'email'}
              {isSupabaseConfigured ? ' · Supabase' : ' · Demo'}
            </p>
          </div>
        </div>

        {message && (
          <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Display name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none appearance-none bg-white"
              >
                <option value="OFFICER">Officer</option>
                <option value="ANALYST">Analyst</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-800 mb-1">Set password</p>
            <p className="text-xs text-slate-500 mb-3">
              {user?.provider === 'google'
                ? 'Optional: add a password so you can also sign in with email later.'
                : 'Leave blank to keep your current password.'}
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                  autoComplete="new-password"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto gap-2" disabled={loading}>
            <Save className="w-4 h-4" />
            {loading ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;