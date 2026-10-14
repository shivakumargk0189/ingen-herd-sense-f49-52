import React from 'react';
import { ArrowLeft, TrendingUp, Activity, Thermometer, ShieldCheck, PieChart, Sparkles } from 'lucide-react';
import { Animal } from '../types';
import { DonutChart, SmoothLineChart, StatusBarChart } from './Charts';

interface AnalyticsViewProps {
  animals: Animal[];
  onBackToHome: () => void;
  onNavigateToAnimals: (filterStatus?: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  animals,
  onBackToHome,
  onNavigateToAnimals,
}) => {
  const healthyCount = animals.filter((a) => a.status === 'NORMAL').length;
  const monitorCount = animals.filter((a) => a.status === 'MONITOR').length;
  const attentionCount = animals.filter((a) => a.status === 'ATTENTION').length;

  const distributionData = [
    { label: 'Healthy', value: healthyCount, color: '#10b981' },
    { label: 'Monitoring', value: monitorCount, color: '#f59e0b' },
    { label: 'Attention', value: attentionCount, color: '#ef4444' },
  ];

  // Farm monthly average data matching the Netlify clone
  const monthlyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyAvgTemps = [101.2, 101.4, 101.1, 101.8, 101.6, 101.3, 102.1, 101.7, 102.5, 102.8, 101.4, 101.1];

  // Activity breakdown data
  const activityData = [
    { label: 'High Activity (Grazing/Vigorous)', count: animals.filter((a) => a.activity === 'High').length, color: '#10b981' },
    { label: 'Normal Activity (Resting/Ruminating)', count: animals.filter((a) => a.activity === 'Normal').length, color: '#0284c7' },
    { label: 'Low Activity (Reduced Mobility)', count: animals.filter((a) => a.activity === 'Low').length, color: '#d97706' },
    { label: 'Very Low (Lethargic/Recumbent)', count: animals.filter((a) => a.activity === 'Very Low').length, color: '#dc2626' },
  ];

  const currentHerdAvgTemp = animals.length > 0 
    ? (animals.reduce((acc, a) => acc + a.temp, 0) / animals.length).toFixed(2)
    : '101.5';

  const healthScore = Math.max(
    0,
    Math.round(((healthyCount * 1.0 + monitorCount * 0.5 + attentionCount * 0.0) / (animals.length || 1)) * 100)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Farm Analytics
          </h2>
          <p className="text-slate-600 mt-1 text-base md:text-lg">
            Long-term population health trends, seasonal variance, and herd telemetry.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-semibold flex items-center gap-2 self-start sm:self-auto border border-slate-300 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Top 3 Analytical Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-5 rounded-3xl border border-[#e2dacf]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Herd Health Score</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {healthScore >= 80 ? 'Optimal' : healthScore >= 60 ? 'Moderate' : 'Risk'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold text-slate-900">{healthScore}</h3>
            <span className="text-slate-500 font-semibold text-sm">/ 100</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {healthyCount} animals in ideal physiological status
          </p>
        </div>

        <div className="glass p-5 rounded-3xl border border-[#e2dacf]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Current Herd Avg Temp</span>
            <Thermometer size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold text-indigo-600">{currentHerdAvgTemp}°F</h3>
            <span className="text-slate-500 text-xs">base: 101.5°F</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            +{(Number(currentHerdAvgTemp) - 101.5).toFixed(2)}°F variance across population
          </p>
        </div>

        <div className="glass p-5 rounded-3xl border border-[#e2dacf]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-slate-500">Avg Rumination Rate</span>
            <Activity size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold text-blue-600">
              {(animals.reduce((acc, a) => acc + a.rumination, 0) / (animals.length || 1)).toFixed(1)}
            </h3>
            <span className="text-slate-500 font-semibold text-sm">hrs / day</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Target healthy baseline: 7.0 - 9.0 hrs/day
          </p>
        </div>
      </div>

      {/* Main 2-column Grid matching cloned site */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Population Health Distribution */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-[#e2dacf] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Population Health Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Herd breakdown by current physiological status.</p>
            </div>
            <button
              onClick={() => onNavigateToAnimals()}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View List →
            </button>
          </div>

          <div className="py-4">
            <DonutChart data={distributionData} size={220} />
          </div>
        </div>

        {/* Avg Temperature Trend */}
        <div className="glass p-6 md:p-8 rounded-3xl border border-[#e2dacf] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Avg Temperature Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly rolling average farm temp across 12 months.</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Annual View
            </span>
          </div>

          <div className="pt-2">
            <SmoothLineChart
              data={monthlyAvgTemps}
              labels={monthlyMonths}
              baseline={101.5}
              lineColor="#4f46e5"
              fillColor="rgba(79, 70, 229, 0.12)"
              valueSuffix="°F"
              height={230}
            />
          </div>
        </div>
      </div>

      {/* Secondary Analytical Section: Activity Breakdown & Smart Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Breakdown */}
        <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-[#e2dacf] shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Locomotion & Activity Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Herd pedometric activity detected by 3-axis collar accelerometers.</p>
          <StatusBarChart data={activityData} />
        </div>

        {/* AI Bio-intelligence Summary */}
        <div className="glass p-6 md:p-8 rounded-3xl border-l-4 border-indigo-600 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles size={20} />
              <h4 className="text-base font-bold text-slate-900">Veterinary Bio-Advisory</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {attentionCount > 0 ? (
                <>
                  <strong className="text-rose-600 block mb-1">Attention Alert:</strong>
                  {attentionCount} animals present with core temperatures exceeding 103.2°F. Herd health models suggest immediate temperature checks for pen #1 and #3 to preclude respiratory spread.
                </>
              ) : (
                <>
                  <strong className="text-emerald-700 block mb-1">Normal Herd State:</strong>
                  Zero animals currently exhibit acute febrile spikes. Sustained rumination averages indicate optimal feed digestibility across all pasture zones.
                </>
              )}
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900 block mb-0.5">Seasonal Weather Advisory</span>
              Summer peak elevated herd temperature baseline by +1.1°F. Consider barn ventilation activation during afternoons.
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 text-[11px] text-slate-500">
            Algorithmic model: DairyBio v4.1 &middot; Updated real-time
          </div>
        </div>
      </div>
    </div>
  );
};
