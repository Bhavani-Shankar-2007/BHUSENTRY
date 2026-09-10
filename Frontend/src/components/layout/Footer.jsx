import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/bhusentry-logo.png" alt="BHUSENTRY" className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
              <div>
                <span className="block font-extrabold text-white text-lg tracking-tight">BHUSENTRY</span>
                <span className="block text-xs text-slate-400">Nature talks. We listen.</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              AI-powered landslide early warning and risk monitoring for the North Eastern Region of India.
            </p>
            <div className="text-[11px] text-slate-500">
              * Monitoring platform for research and operational support. Always refer to NDMA / SDMA / IMD statutory advisories.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Monitored States</h4>
            <ul className="space-y-2 text-xs">
              <li>Sikkim & East Sikkim Belt</li>
              <li>Meghalaya & Sohra Escarpment</li>
              <li>Assam & Brahmaputra slopes</li>
              <li>Mizoram & Aizawl Ridges</li>
              <li>Arunachal, Nagaland, Manipur & Tripura</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Quick Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/map" className="hover:text-emerald-400 transition-colors">GIS Interactive Map</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Monitoring Dashboard</Link></li>
              <li><Link to="/predict" className="hover:text-emerald-400 transition-colors">AI Risk Prediction</Link></li>
              <li><Link to="/alerts" className="hover:text-emerald-400 transition-colors">Active Warning Bulletins</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Authority Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 BHUSENTRY. Built for North Eastern Region disaster resilience.</p>
          <span>Nature + Technology + AI + GIS</span>
        </div>
      </div>
    </footer>
  );
};