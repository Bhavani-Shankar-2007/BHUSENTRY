import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Check,
  FileText,
  MapPin
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RiskBadge } from '../components/common/RiskBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { MOCK_SMS_LOG, MOCK_SUBSCRIBERS } from '../services/mockData';
import { MessageSquare, Phone, BellRing, XCircle } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { useRegion } from '../context/RegionContext';
import { RegionScopeSelector } from '../components/common/RegionScopeSelector';
import { RISK_LEVELS } from '../data/mockLocations';

export const AlertsPage = () => {
  const { alerts, activeAlertCount, acknowledgeAlert, resolveAlert } = useAlerts();
  const { activeRegion, currentRegionMeta } = useRegion();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All Levels');
  const [activeModalAlert, setActiveModalAlert] = useState(null);
  const [smsLog, setSmsLog] = useState(MOCK_SMS_LOG);
  const [subscribers, setSubscribers] = useState(MOCK_SUBSCRIBERS);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [triggerConfirm, setTriggerConfirm] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    // Check regional match
    if (activeRegion !== 'ALL_INDIA') {
      const alertState = (alert.state || '').trim().toLowerCase();
      const targetStates = currentRegionMeta.states || [];
      if (!targetStates.some((s) => s.toLowerCase() === alertState)) {
        return false;
      }
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      alert.location_name.toLowerCase().includes(q) ||
      alert.state.toLowerCase().includes(q) ||
      alert.alert_type.toLowerCase().includes(q) ||
      alert.id.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === 'All' ||
      alert.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesRisk =
      selectedRisk === 'All Levels' ||
      alert.risk_level.toUpperCase() === selectedRisk.toUpperCase();

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Disaster Early Warning & Alert Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {currentRegionMeta.shortName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time hazard notifications dispatched when slope threshold or precipitation limits are breached across {currentRegionMeta.name}.
          </p>
        </div>
      </div>

      {/* Dynamic Regional Scope Selector */}
      <RegionScopeSelector />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search alert ID, location, or warning type..."
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Status: Active Only</option>
              <option value="Acknowledged">Status: Acknowledged</option>
              <option value="Resolved">Status: Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RISK_LEVELS.map((risk) => (
                <option key={risk} value={risk}>
                  {risk === 'All Levels' ? 'All Risk Levels' : `${risk} Risk`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Monitored Station</th>
                <th className="py-3 px-4">Severity Tier</th>
                <th className="py-3 px-4">Hazard Description</th>
                <th className="py-3 px-4">Issued Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No alerts match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {alert.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{alert.location_name}</div>
                      <div className="text-xs text-slate-500">{alert.district}, {alert.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={alert.risk_level} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-800">{alert.alert_type}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {alert.message}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {alert.created_time}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          alert.status === 'Active'
                            ? 'bg-red-100 text-red-800 animate-pulse'
                            : alert.status === 'Acknowledged'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveModalAlert(alert)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {alert.status === 'Active' && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}

                        {alert.status !== 'Resolved' && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>


      {/* SMS Notification Log (MSG91 simulation) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <h2 className="font-bold text-slate-900">SMS Notification Log</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">MSG91 Sim</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">ID</th>
                <th className="px-4 py-2.5 text-left font-semibold">Recipient</th>
                <th className="px-4 py-2.5 text-left font-semibold">Message</th>
                <th className="px-4 py-2.5 text-left font-semibold">Status</th>
                <th className="px-4 py-2.5 text-left font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsLog.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{s.id}</td>
                  <td className="px-4 py-2.5 text-slate-800">{s.to}</td>
                  <td className="px-4 py-2.5 text-slate-600 max-w-xs truncate">{s.message}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.status === "Delivered" ? "text-emerald-700" : "text-red-600"}`}>
                      {s.status === "Delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{s.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriber Management + Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Phone Subscribers</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <li key={sub.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-500">{sub.phone} · {sub.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSubscribers((prev) =>
                      prev.map((s) => (s.id === sub.id ? { ...s, active: !s.active } : s))
                    )
                  }
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    sub.active
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {sub.active ? "Active" : "Paused"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BellRing className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-slate-900">Emergency Broadcast</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Dispatch a simulated emergency SMS to all active subscribers via MSG91 mock gateway.
            </p>
          </div>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setShowTriggerModal(true)}
          >
            Trigger Emergency Alert
          </Button>
        </div>
      </div>

      {/* Trigger Emergency Alert Confirmation Modal */}
      <Modal
        isOpen={showTriggerModal}
        onClose={() => { setShowTriggerModal(false); setTriggerConfirm(false); }}
        title="Confirm Emergency Alert"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This will send a high-priority SMS to <b>{subscribers.filter((s) => s.active).length}</b> active
            subscribers. This is a simulation only (MSG91 mock).
          </p>
          {!triggerConfirm ? (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowTriggerModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setTriggerConfirm(true);
                  const newEntry = {
                    id: `SMS-${String(smsLog.length + 1).padStart(3, "0")}`,
                    to: "ALL ACTIVE",
                    message: "EMERGENCY: Landslide risk critical. Follow local evacuation orders. - NER Disaster Control",
                    status: "Delivered",
                    provider: "MSG91",
                    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
                  };
                  setSmsLog((prev) => [newEntry, ...prev]);
                }}
              >
                Confirm & Send
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-emerald-800">Emergency alert dispatched (simulated).</p>
              <Button className="mt-4" size="sm" onClick={() => { setShowTriggerModal(false); setTriggerConfirm(false); }}>
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Alert Details Modal */}
      <Modal
        isOpen={!!activeModalAlert}
        onClose={() => setActiveModalAlert(null)}
        title={activeModalAlert ? `Alert Directive: ${activeModalAlert.id}` : 'Alert Details'}
      >
        {activeModalAlert && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RiskBadge level={activeModalAlert.risk_level} size="md" />
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeModalAlert.status === 'Active'
                    ? 'bg-red-100 text-red-800'
                    : activeModalAlert.status === 'Acknowledged'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {activeModalAlert.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {activeModalAlert.alert_type}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {activeModalAlert.location_name}, {activeModalAlert.district} (
                  {activeModalAlert.state})
                </span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Telemetry Summary:</span>
              {activeModalAlert.message}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs leading-relaxed text-amber-900">
              <span className="font-bold text-amber-950 block mb-1">
                SOP Recommended Action:
              </span>
              {activeModalAlert.recommended_action ||
                'Alert district emergency cells, establish convoy checkposts, and prepare earth-moving equipment.'}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {activeModalAlert.status === 'Active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    acknowledgeAlert(activeModalAlert.id);
                    setActiveModalAlert({ ...activeModalAlert, status: 'Acknowledged' });
                  }}
                >
                  Mark Acknowledged
                </Button>
              )}
              {activeModalAlert.status !== 'Resolved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    resolveAlert(activeModalAlert.id);
                    setActiveModalAlert({ ...activeModalAlert, status: 'Resolved' });
                  }}
                >
                  Resolve Alert
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
