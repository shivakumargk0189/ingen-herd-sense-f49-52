import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  CheckCheck, 
  Search, 
  ExternalLink,
  ShieldAlert,
  Clock,
  Thermometer,
  Activity
} from 'lucide-react';
import { AlertLogItem, AnimalStatus } from '../types';

interface AlertsViewProps {
  alerts: AlertLogItem[];
  onInspectAnimal: (animalId: string) => void;
  onBackToHome: () => void;
  onToggleResolveAlert: (alertId: string) => void;
  onResolveAll: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onInspectAnimal,
  onBackToHome,
  onToggleResolveAlert,
  onResolveAll,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'unresolved' | 'resolved' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.animalId.includes(searchQuery) ||
      alert.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'unresolved') return !alert.resolved;
    if (filterMode === 'resolved') return alert.resolved;
    if (filterMode === 'critical') return alert.severity === 'ATTENTION' && !alert.resolved;
    return true;
  });

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === 'ATTENTION' && !a.resolved).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2dacf]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Alert Center
            </h2>
            {unresolvedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                {unresolvedCount} Active
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1 text-base md:text-lg">
            Comprehensive log of all health anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unresolvedCount > 0 && (
            <button
              onClick={onResolveAll}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCheck size={15} className="text-emerald-600" />
              <span>Acknowledge All</span>
            </button>
          )}
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 transition-all text-sm font-semibold flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>← Back</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterMode('unresolved')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'unresolved'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            Unresolved ({unresolvedCount})
          </button>
          <button
            onClick={() => setFilterMode('critical')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'critical'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-300'
            }`}
          >
            Critical Only ({criticalCount})
          </button>
          <button
            onClick={() => setFilterMode('resolved')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'resolved'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            Resolved Archive ({alerts.length - unresolvedCount})
          </button>
        </div>

        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anomalies..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Alerts Log List matching cloned site */}
      <div className="grid grid-cols-1 gap-4" id="alerts-log">
        {filteredAlerts.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center text-slate-500 space-y-2 border border-[#e2dacf]">
            <CheckCircle size={36} className="mx-auto text-emerald-600 mb-2 opacity-80" />
            <h4 className="text-slate-900 font-bold text-lg">No anomalies found</h4>
            <p className="text-xs">There are no active alerts matching your current query.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isAttention = alert.severity === 'ATTENTION';
            const isMonitor = alert.severity === 'MONITOR';
            const dotColor = isAttention ? 'bg-rose-500' : isMonitor ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div
                key={alert.id}
                className={`glass p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all border border-[#e2dacf] ${
                  alert.resolved ? 'opacity-60 bg-slate-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${dotColor} mt-1 flex-shrink-0 ${
                      isAttention && !alert.resolved ? 'animate-pulse' : ''
                    }`}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-slate-900 font-bold text-base">
                        Animal #{alert.animalId} ({alert.animalName})
                      </p>
                      <span className="text-xs text-slate-500 font-normal">
                        &middot; {alert.breed}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAttention
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isMonitor
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      {alert.resolved && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 pl-7 md:pl-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-500 block whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                    {alert.resolvedAt && (
                      <span className="text-[10px] text-emerald-600 block">
                        Cleared {alert.resolvedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleResolveAlert(alert.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                        alert.resolved
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {alert.resolved ? 'Reopen' : 'Clear'}
                    </button>

                    <button
                      onClick={() => onInspectAnimal(alert.animalId)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
