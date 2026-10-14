import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Thermometer, 
  Activity, 
  Battery, 
  MapPin, 
  Clock, 
  Send,
  Stethoscope,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Animal, AnimalStatus } from '../types';
import { SmoothLineChart } from './Charts';

interface AnimalDetailsViewProps {
  animal: Animal;
  onBack: () => void;
  onUpdateStatus: (animalId: string, status: AnimalStatus) => void;
  onAddVetNote: (animalId: string, noteText: string) => void;
  onSimulateVitalsChange: (animalId: string, tempDelta: number) => void;
  tempUnit?: 'C' | 'F';
}

export const AnimalDetailsView: React.FC<AnimalDetailsViewProps> = ({
  animal,
  onBack,
  onUpdateStatus,
  onAddVetNote,
  onSimulateVitalsChange,
}) => {
  const [chartTimeframe, setChartTimeframe] = useState<'annual' | 'monthly' | '24h'>('annual');
  const [newNoteText, setNewNoteText] = useState('');

  const getAIAnalysis = () => {
    if (animal.status === 'ATTENTION') {
      return `The animal is showing a temperature trend ${(animal.temp - 101.5).toFixed(1)}°F above its individual baseline. Combined with ${animal.activity} activity, this suggests a potential early-stage infection.`;
    }
    if (animal.status === 'MONITOR') {
      return `Slight deviation in resting patterns observed. Temperature is slightly higher than average.`;
    }
    return `All physiological parameters are stable.`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddVetNote(animal.id, newNoteText.trim());
    setNewNoteText('');
  };

  const isAttention = animal.status === 'ATTENTION';
  const isMonitor = animal.status === 'MONITOR';

  // Labels for the charts
  const annualLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  const dailyLabels = ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', 'Now'];

  const chartLabels = chartTimeframe === 'annual' ? annualLabels : chartTimeframe === 'monthly' ? monthlyLabels : dailyLabels;
  const chartValues = animal.historyTemps;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2dacf]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" id="detail-title">
              Animal Details - #{animal.id} ({animal.name})
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAttention
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 status-glow-red'
                  : isMonitor
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 status-glow-yellow'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300 status-glow-green'
              }`}
            >
              {animal.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {animal.breed} &middot; {animal.category} &middot; Collar: <span className="font-mono text-slate-700 font-semibold">{animal.collarId}</span> &middot; Age: {animal.age} &middot; Weight: {animal.weightKg} kg
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-semibold flex items-center gap-2 self-start sm:self-auto border border-slate-300 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>← Back</span>
        </button>
      </div>

      {/* Main Grid: Left Column Vitals & AI, Right Column Charts & Vet Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Vitals */}
          <div className="glass p-6 rounded-3xl border border-[#e2dacf] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" />
                <span>Current Vitals</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {animal.lastUpdate}
              </span>
            </div>

            <div className="space-y-3">
              {/* Temperature */}
              <div className="flex justify-between items-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isAttention ? 'bg-rose-100 text-rose-700' : isMonitor ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Thermometer size={18} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">Temperature</span>
                    <span className="text-[10px] text-slate-400">Baseline 101.5°F</span>
                  </div>
                </div>
                <span className={`text-2xl font-bold font-mono ${
                  isAttention ? 'text-rose-600' : isMonitor ? 'text-amber-600' : 'text-emerald-600'
                }`} id="cur-temp">
                  {animal.temp.toFixed(1)}°F
                </span>
              </div>

              {/* Heart Rate */}
              <div className="flex justify-between items-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                    <Heart size={18} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">Heart Rate</span>
                    <span className="text-[10px] text-slate-400">Normal 60-80</span>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {animal.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
                </span>
              </div>

              {/* Activity */}
              <div className="flex justify-between items-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">Activity</span>
                    <span className="text-[10px] text-slate-400">24h sensor</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-900" id="cur-activity">
                  {animal.activity}
                </span>
              </div>

              {/* Rumination */}
              <div className="flex justify-between items-center p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block font-medium">Rumination</span>
                    <span className="text-[10px] text-slate-400">Target 7-9 h/d</span>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {animal.rumination.toFixed(1)} <span className="text-xs font-normal text-slate-500">h/d</span>
                </span>
              </div>
            </div>

            {/* Hardware & Location Info */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 flex justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-indigo-600" /> {animal.pasture}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Battery size={13} className="text-emerald-600" /> {animal.sensorBattery}% Battery
              </span>
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="glass p-6 rounded-3xl border-t-4 border-indigo-600 border border-[#e2dacf] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Sparkles size={16} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Analysis</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed" id="ai-analysis">
              {getAIAnalysis()}
            </p>

            {/* Quick Status Override / Action */}
            <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Update Status:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onUpdateStatus(animal.id, 'NORMAL')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    animal.status === 'NORMAL'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  Healthy
                </button>
                <button
                  onClick={() => onUpdateStatus(animal.id, 'MONITOR')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    animal.status === 'MONITOR'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  Monitor
                </button>
                <button
                  onClick={() => onUpdateStatus(animal.id, 'ATTENTION')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    animal.status === 'ATTENTION'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  Attention
                </button>
              </div>

              {/* Simulation tweak buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => onSimulateVitalsChange(animal.id, -0.8)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-300 cursor-pointer"
                >
                  -0.8°F (Recover)
                </button>
                <button
                  onClick={() => onSimulateVitalsChange(animal.id, 0.8)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-300 cursor-pointer"
                >
                  +0.8°F (Fever Spike)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Trend Chart Card */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-[#e2dacf] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Annual Health Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continuous sensor readings against baseline (101.5°F).
                </p>
              </div>

              {/* Timeframe buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setChartTimeframe('annual')}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    chartTimeframe === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  Annual
                </button>
                <button
                  onClick={() => setChartTimeframe('monthly')}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    chartTimeframe === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="pt-2">
              <SmoothLineChart
                data={chartValues}
                labels={chartLabels}
                baseline={101.5}
                lineColor="#4f46e5"
                fillColor="rgba(79, 70, 229, 0.12)"
                valueSuffix="°F"
                height={260}
              />
            </div>
          </div>

          {/* Clinical Notes & History */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-[#e2dacf] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700">
                <Stethoscope size={18} />
                <h3 className="text-lg font-bold text-slate-900">Veterinary Clinical Notes</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {animal.notes.length} Record{animal.notes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log veterinary observation or medication..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {animal.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700">{note.author}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{note.date}</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
