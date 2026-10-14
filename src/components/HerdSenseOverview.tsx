import React from 'react';
import { 
  ArrowRight, 
  Thermometer, 
  Activity, 
  Clock, 
  MapPin, 
  Radio, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Animal, formatTemp } from '../types';
import { HerdSenseHero } from './HerdSenseHero';

interface HerdSenseOverviewProps {
  animals: Animal[];
  onOpenMonitor: (filterStatus?: any) => void;
  onOpenPredictor: () => void;
  onSelectAnimal: (id: string) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onTriggerManualTick: () => void;
  tempUnit: 'C' | 'F';
}

export const HerdSenseOverview: React.FC<HerdSenseOverviewProps> = ({
  animals,
  onOpenMonitor,
  onOpenPredictor,
  onSelectAnimal,
  isSimulating,
  onToggleSimulation,
  onTriggerManualTick,
  tempUnit,
}) => {
  const marigold = animals.find((a) => a.name === 'Marigold') || animals[0];

  const totalCount = animals.length;
  const healthyCount = animals.filter((a) => a.status === 'NORMAL').length;
  const monitorCount = animals.filter((a) => a.status === 'MONITOR').length;
  const attentionCount = animals.filter((a) => a.status === 'ATTENTION').length;

  const flaggedAnimals = animals.filter((a) => a.status !== 'NORMAL');

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Exact Hero Section from Screenshot */}
      <HerdSenseHero
        onOpenMonitor={() => onOpenMonitor('All')}
        onOpenPredictor={onOpenPredictor}
        onInspectMarigold={() => onSelectAnimal(marigold.id)}
        marigoldAnimal={marigold}
        tempUnit={tempUnit}
      />

      {/* Live Biometric Telemetry Station Bar */}
      <div className="bg-white/85 rounded-3xl p-5 sm:p-6 border border-[#e5ded0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#234e38]/15 text-[#234e38] flex items-center justify-center font-bold">
            <Radio size={19} className={isSimulating ? 'animate-pulse text-[#234e38]' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#19241f] font-serif">
                Continuous IoT Collar Telemetry
              </h4>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isSimulating ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#efe8dc] text-[#556358]'
              }`}>
                {isSimulating ? '● Streaming Active' : 'Simulation Paused'}
              </span>
            </div>
            <p className="text-xs text-[#526056] mt-0.5">
              15 active collars transmitting core temperature, rumination, and accelerometry every 10s.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onTriggerManualTick}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-[#fbf9f4] hover:bg-[#efe8dc] text-[#19241f] text-xs font-semibold border border-[#dcd3c1] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Zap size={14} className="text-amber-600" />
            <span>Simulate Collar Ping</span>
          </button>
          <button
            onClick={onToggleSimulation}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isSimulating
                ? 'bg-[#1c2421] text-white hover:bg-black'
                : 'bg-[#234e38] text-white hover:bg-[#1b3d2b]'
            }`}
          >
            {isSimulating ? 'Pause Stream' : 'Start Auto-Stream'}
          </button>
        </div>
      </div>

      {/* Population Health Breakdown Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#617266]">
              REAL-TIME CENSUS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#19241f] font-serif">
              Current Herd Health Status
            </h2>
          </div>
          <button
            onClick={() => onOpenMonitor('All')}
            className="text-xs font-semibold text-[#234e38] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all {totalCount} animals in directory</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total */}
          <div
            onClick={() => onOpenMonitor('All')}
            className="bg-white/90 p-6 rounded-3xl border border-[#e5ded0] shadow-sm cursor-pointer hover:border-[#234e38]/50 hover:shadow-md transition-all group"
          >
            <p className="text-xs font-medium text-[#5a6a5f] uppercase tracking-wider mb-1">
              Total Monitored
            </p>
            <h3 className="text-4xl font-extrabold text-[#19241f] font-mono group-hover:text-[#234e38] transition-colors">
              {totalCount}
            </h3>
            <p className="text-xs text-[#708075] mt-2 flex items-center gap-1">
              <span>All collared cattle</span>
              <ArrowRight size={12} />
            </p>
          </div>

          {/* Healthy */}
          <div
            onClick={() => onOpenMonitor('NORMAL')}
            className="bg-white/90 p-6 rounded-3xl border border-[#bbf7d0] shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-[#166534] uppercase tracking-wider">
                Healthy (Normal)
              </p>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <h3 className="text-4xl font-extrabold text-[#166534] font-mono">
              {healthyCount}
            </h3>
            <p className="text-xs text-[#15803d] mt-2">
              Stable baseline physiology ({Math.round((healthyCount / totalCount) * 100)}%)
            </p>
          </div>

          {/* Monitoring */}
          <div
            onClick={() => onOpenMonitor('MONITOR')}
            className="bg-white/90 p-6 rounded-3xl border border-[#fde68a] shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-[#92400e] uppercase tracking-wider">
                Monitoring
              </p>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <h3 className="text-4xl font-extrabold text-[#b45309] font-mono">
              {monitorCount}
            </h3>
            <p className="text-xs text-[#92400e] mt-2">
              Minor temperature drift ({Math.round((monitorCount / totalCount) * 100)}%)
            </p>
          </div>

          {/* Attention */}
          <div
            onClick={() => onOpenMonitor('ATTENTION')}
            className="bg-white/90 p-6 rounded-3xl border border-[#fecaca] shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-[#991b1b] uppercase tracking-wider">
                Attention Required
              </p>
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            </div>
            <h3 className="text-4xl font-extrabold text-[#b91c1c] font-mono">
              {attentionCount}
            </h3>
            <p className="text-xs text-[#991b1b] mt-2">
              Immediate triage advisory ({Math.round((attentionCount / totalCount) * 100)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Flagged Early Detections Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-[#617266]">
              PRE-CLINICAL DETECTIONS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#19241f] font-serif">
              Flagged Animal Telemetry
            </h2>
          </div>
          <button
            onClick={() => onOpenMonitor('ATTENTION')}
            className="bg-[#234e38] text-white hover:bg-[#1b3d2b] px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Inspect Priority Cases</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flaggedAnimals.slice(0, 6).map((animal) => {
            const isAttention = animal.status === 'ATTENTION';
            return (
              <div
                key={animal.id}
                onClick={() => onSelectAnimal(animal.id)}
                className={`bg-white/90 p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${
                  isAttention ? 'border-rose-200' : 'border-amber-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-mono text-[#6c7b70]">
                        #{animal.id}
                      </span>
                      <h4 className="text-lg font-bold text-[#19241f] group-hover:text-[#234e38] transition-colors">
                        {animal.name}
                      </h4>
                      <p className="text-xs text-[#627167]">{animal.breed}</p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        isAttention
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {animal.predictedCondition || animal.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="bg-[#fbf9f4] p-3 rounded-2xl border border-[#ece4d4]">
                      <span className="text-[10px] uppercase font-bold text-[#627167] block mb-0.5">
                        Core Temp
                      </span>
                      <span className={`text-base font-bold font-mono ${
                        isAttention ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {formatTemp(animal.temp, tempUnit)}
                      </span>
                    </div>

                    <div className="bg-[#fbf9f4] p-3 rounded-2xl border border-[#ece4d4]">
                      <span className="text-[10px] uppercase font-bold text-[#627167] block mb-0.5">
                        Rumination
                      </span>
                      <span className="text-base font-bold font-mono text-[#19241f]">
                        {animal.rumination.toFixed(1)} h/d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f0ebd9] text-xs">
                  <span className="text-[#6c7b70] font-mono">{animal.pasture}</span>
                  <span className="text-[#234e38] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
