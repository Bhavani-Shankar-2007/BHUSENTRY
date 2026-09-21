import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Cpu,
  BarChart3,
  BellRing,
  ArrowRight,
  Layers,
  Compass,
  Droplets,
  CloudLightning,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* BHUSENTRY LOGO */}
            <div className="flex justify-center">
              <img
                src="/bhusentry-logo.png"
                alt="BHUSENTRY"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
              <span>{t('landing_badge_1', 'BHUSENTRY Early Warning Platform')}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-emerald-700 dark:text-emerald-400">{t('landing_badge_2', 'North Eastern Region')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {t('landing_h1_1', 'AI-Powered Landslide Risk Monitoring &')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532D] via-emerald-600 to-[#0284C7] dark:from-emerald-400 dark:to-sky-400">
                {t('landing_h1_2', 'Early Warning System')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t('landing_desc', 'Monitor environmental conditions, analyze potential landslide risks, and visualize critical locations across the North Eastern Region of India with predictive intelligence.')}
            </p>

                       <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/map" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0284C7] text-white text-sm font-semibold shadow-md shadow-sky-700/20 hover:bg-sky-700 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <Compass className="w-5 h-5" />
                  {t('explore_risk_map', 'Explore Risk Map')}
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#14532D] dark:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-900/25 hover:bg-emerald-900 dark:hover:bg-emerald-800 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {t('get_started', 'Get Started')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {t('already_have_access', 'Already have access?')} {' '}
              <Link to="/login" className="text-emerald-700 dark:text-emerald-500 font-semibold hover:underline">
                {t('log_in_console', 'Log in to the monitoring console')}
              </Link>
            </p>
            <div className="pt-4 max-w-xl mx-auto">
              <DisclaimerBanner />
            </div>
          </div>

          <div className="mt-14 max-w-4xl mx-auto bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#14532D] dark:text-emerald-500">8 States</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Full NER Coverage</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0284C7] dark:text-sky-500">12+ Stations</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Telemetry Sensor Hubs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500">&lt; 15 Mins</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Rapid Warning Latency</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500">4 Tiers</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">LOW to VERY HIGH</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section id="why-it-matters" className="py-16 bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('why_matters_h2', 'Why Landslide Monitoring Matters in NER')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t('why_matters_desc', 'The North Eastern Region represents one of the most ecologically fragile and geologically active mountainous zones in the world.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                <CloudLightning className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{t('torrential_monsoon', 'Torrential Monsoon & Cloudbursts')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('torrential_desc', 'Extreme rainfall saturates fragile slopes within hours, triggering debris flows along highways and hill settlements.')}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{t('steep_terrain', 'Steep Terrain & Weak Geology')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('steep_desc', 'High slope angles combined with weathered rock and soil layers create conditions primed for slope failure.')}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{t('lives_roads', 'Lives, Roads & Livelihoods')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('lives_desc', 'Early detection protects communities, critical corridors like NH-10, and emergency response logistics across the region.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About BHUSENTRY */}
      <section id="about" className="py-16 bg-[#F8FAFC] dark:bg-black border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-500 text-xs font-bold uppercase tracking-wider">
                <img src="/bhusentry-logo.png" alt="" className="w-6 h-6 object-contain" />
                {t('about_bhusentry', 'About BHUSENTRY')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('nature_talks', 'Nature talks. We listen.')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('bhusentry_desc', 'BHUSENTRY is an AI-powered landslide early warning and risk monitoring system built for the North Eastern Region. It fuses rainfall, slope, soil moisture, and vegetation indicators with geospatial intelligence to surface risk before disaster strikes.')}
              </p>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  {t('feature_1', 'Real-time station telemetry across 8 NER states')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  {t('feature_2', 'GIS map with satellite, elevation, and heatmap layers')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  {t('feature_3', 'AI risk scores with clear LOW to CRITICAL labels')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                  {t('feature_4', 'Alert workflow with SMS notification simulation')}
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                <RiskBadge level="LOW" size="sm" />
                <RiskBadge level="MODERATE" size="sm" />
                <RiskBadge level="HIGH" size="sm" />
                <RiskBadge level="VERY HIGH" size="sm" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('env_sensors', 'Environmental Sensors')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('env_sensors_desc', 'Rainfall · Soil moisture · Slope · NDVI')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('geo_intel', 'Geospatial Intelligence')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('geo_intel_desc', 'Live GIS · Station coordinates · Hazard radii')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('ai_risk_engine', 'AI Risk Engine')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('ai_risk_desc', 'Weighted scoring · Explainable outputs')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('alert_dispatch', 'Alert Dispatch')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('alert_dispatch_desc', 'Bulletins · SMS log · Subscriber lists')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('key_capabilities', 'Key Capabilities')}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {t('key_capabilities_desc', 'Everything officers need to monitor, predict, and act on landslide risk across NER.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'GIS Risk Map', desc: 'Interactive map with OSM, satellite, OpenTopo elevation, and NASA GIBS daily earth observation overlays.' },
              { icon: Cpu, title: 'AI Risk Prediction', desc: 'Simulate risk scores from rainfall, slope, soil moisture, and vegetation inputs with clear explanations.' },
              { icon: BellRing, title: 'Alert Console', desc: 'Track active warnings, acknowledge/resolve events, and simulate emergency SMS broadcasts.' },
              { icon: BarChart3, title: 'Analytics', desc: 'State-wise risk distribution, rainfall trends, and historical monsoon incident patterns.' },
              { icon: Sparkles, title: 'Risk Explainer', desc: 'Chat-style AI assistant that explains why a location scored HIGH or CRITICAL.' },
              { icon: Layers, title: 'Multi-layer Telemetry', desc: 'Station detail pages with elevation, geology, land cover, and historical events.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-[#111] hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{t(`feat_${i}_title`, f.title)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t(`feat_${i}_desc`, f.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI pipeline */}
      <section id="ai-tech" className="py-16 bg-[#F8FAFC] dark:bg-black border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('ai_tech_pipeline', 'AI Technology Pipeline')}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{t('ai_tech_desc', 'From raw sensors to actionable early warning in four phases.')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-500">{t('phase', 'PHASE')} 01</div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('data_ingestion', 'Data Ingestion')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('data_ingestion_desc', 'Rainfall, slope angle, soil moisture, NDVI, and station coordinates feed the monitoring pipeline.')}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-500">{t('phase', 'PHASE')} 02</div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('ai_scoring', 'AI Scoring')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('ai_scoring_desc', 'Weighted model combines environmental factors into a 0.00–1.00 risk index for each location.')}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500">{t('phase', 'PHASE')} 03</div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('risk_class', 'Risk Classification')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('risk_class_desc', 'Zones are labeled LOW, MODERATE, HIGH, or CRITICAL with high-contrast badges — never color alone.')}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-mono font-bold text-red-600 dark:text-red-500">{t('phase', 'PHASE')} 04</div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('disaster_warning', 'Disaster Early Warning')}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('disaster_warning_desc', 'Bulletins reach district emergency cells for proactive road closures and community guidance.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F172A] dark:bg-[#050505] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20">
            <img src="/bhusentry-logo.png" alt="BHUSENTRY" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('cta_ready', 'Ready to Explore the BHUSENTRY Monitoring Console?')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {t('cta_desc', 'Explore live interactive GIS maps, predictive AI simulations, and active disaster alerts across the North Eastern Region.')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/dashboard">
              <Button variant="green" size="lg">
                {t('enter_dashboard', 'Enter Monitoring Dashboard')}
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg" className="text-white border-slate-600 hover:bg-slate-800">
                {t('open_gis_map', 'Open GIS Map')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;