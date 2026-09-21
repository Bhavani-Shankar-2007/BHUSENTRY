import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Map,
  Cpu,
  Bell,
  BarChart3,
  Users,
  Globe,
  X
} from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activeAlertCount } = useAlerts();
  const { user } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { label: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('map'), path: '/map', icon: Map, badge: 'GIS' },
    { label: '3D Simulation', path: '/simulation', icon: Globe, badge: 'NEW' },
    { label: t('locations'), path: '/locations', icon: MapPin },
    { label: t('predict'), path: '/predict', icon: Cpu, badge: 'AI' },
    {
      label: t('alerts'),
      path: '/alerts',
      icon: Bell,
      counter: activeAlertCount > 0 ? activeAlertCount : null,
      counterColor: 'bg-red-500'
    },
    { label: t('analytics'), path: '/analytics', icon: BarChart3 },
    ...(user?.role === 'ADMIN'
      ? [{ label: 'Admin & Users', path: '/admin', icon: Users }]
      : [])
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[72px] flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img
              src="/bhusentry-logo.png"
              alt="BHUSENTRY"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight truncate">
                BHUSENTRY
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Landslide Early Warning
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status pill */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Telemetry Feed
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              Online
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monitoring Console
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.counter != null && (
                      <span
                        className={`text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white ${item.counterColor || 'bg-red-500'}`}
                      >
                        {item.counter}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            {user?.avatar || user?.avatar_url ? (
              <img
                src={user.avatar || user.avatar_url}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                {(user?.name || 'U').charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {user?.badge || user?.role || 'Operator'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};