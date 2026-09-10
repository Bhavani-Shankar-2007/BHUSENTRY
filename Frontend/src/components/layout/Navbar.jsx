import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/bhusentry-logo.png"
            alt="BHUSENTRY"
            className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              BHUSENTRY
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              AI-Powered Landslide Early Warning & Risk Monitoring
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-emerald-700 transition-colors">About System</a>
          <a href="#why-it-matters" className="hover:text-emerald-700 transition-colors">NER Importance</a>
          <a href="#features" className="hover:text-emerald-700 transition-colors">Key Capabilities</a>
          <a href="#ai-tech" className="hover:text-emerald-700 transition-colors">AI Technology</a>
        </nav>

        {/* Log In + Sign Up */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm">
              Sign Up
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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <a href="#about" className="block text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>About System</a>
          <a href="#why-it-matters" className="block text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>NER Importance</a>
          <a href="#features" className="block text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>Key Capabilities</a>
          <a href="#ai-tech" className="block text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>AI Technology</a>
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Log In
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};