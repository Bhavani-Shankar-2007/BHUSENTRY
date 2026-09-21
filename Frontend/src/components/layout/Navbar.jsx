import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/bhusentry-logo.png"
            alt="BHUSENTRY"
            className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
              BHUSENTRY
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t('landing_subtitle', 'AI-Powered Landslide Early Warning & Risk Monitoring')}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#about" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors">{t('about_system', 'About System')}</a>
          <a href="#why-it-matters" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors">{t('ner_importance', 'NER Importance')}</a>
          <a href="#features" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors">{t('key_capabilities', 'Key Capabilities')}</a>
          <a href="#ai-tech" className="hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors">{t('ai_technology', 'AI Technology')}</a>
        </nav>

        {/* Log In + Sign Up */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageSwitcher />
          <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-1"></div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              {t('log_in', 'Log In')}
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm">
              {t('sign_up', 'Sign Up')}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 py-4 space-y-3">
          <a href="#about" className="block text-sm font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('about_system', 'About System')}</a>
          <a href="#why-it-matters" className="block text-sm font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('ner_importance', 'NER Importance')}</a>
          <a href="#features" className="block text-sm font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('key_capabilities', 'Key Capabilities')}</a>
          <a href="#ai-tech" className="block text-sm font-semibold text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(false)}>{t('ai_technology', 'AI Technology')}</a>
          <div className="py-2 border-y border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                {t('log_in', 'Log In')}
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                {t('sign_up', 'Sign Up')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};