import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Layers,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import { useRegion } from '../../context/RegionContext';
import { RiskBadge } from '../common/RiskBadge';
import { RegionScopeSelector } from '../common/RegionScopeSelector';

export const Topbar = ({ onToggleSidebar }) => {
  const { user, logout, switchRole, isDemoMode } = useAuth();
  const { alerts, activeAlertCount } = useAlerts();
  const { currentRegionMeta } = useRegion();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/locations?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeAlerts = alerts.filter((a) => a.status === 'Active');

  const avatarSrc =
    user?.avatar_url ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=14532D&color=fff`;

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeAlertCount > 0 ? (
          <div
            onClick={() => navigate('/alerts')}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span>{activeAlertCount} Critical Warnings ({currentRegionMeta.shortName})</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{currentRegionMeta.shortName}: Surveillance Active</span>
          </div>
        )}

        {/* Global Region Scope Switcher */}
        <div className="hidden xl:block">
          <RegionScopeSelector compact={true} />
        </div>
      </div>

      {/* Center search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations, East Sikkim, Sohra, Aizawl..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </form>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {activeAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">Disaster Alerts Feed</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                    {activeAlertCount} Active
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activeAlerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active critical landslide warnings at this time.
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/alerts');
                      }}
                      className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {alert.location_name}
                        </span>
                        <RiskBadge level={alert.risk_level} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {alert.created_time} • {alert.state}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo role switcher — only when Supabase is NOT configured */}
        {isDemoMode && (
          <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="px-2 font-medium text-slate-500">Role:</span>
            {['OFFICER', 'ADMIN', 'PUBLIC'].map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  user?.role === role
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={avatarSrc}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-emerald-600/30"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="text-[10px] font-semibold text-emerald-700">
                {user?.provider === 'google' ? 'Google account' : `${user?.role || 'OFFICER'} ROLE`}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {user?.badge || `${user?.role || 'User'} Access`}
                </div>
              </div>

              {isDemoMode && (
                <div className="px-4 py-2 border-b border-slate-100 xl:hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Switch Demo Role:
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {['OFFICER', 'ADMIN', 'PUBLIC'].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setShowProfileMenu(false);
                        }}
                        className={`text-[11px] py-1 rounded font-semibold ${
                          user?.role === role
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Monitoring Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Public Landing Page</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};