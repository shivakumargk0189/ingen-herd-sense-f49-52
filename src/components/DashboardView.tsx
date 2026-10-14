import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Thermometer, 
  Heart, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ShieldCheck,
  Radio,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Animal, AnimalStatus } from '../types';
import pastureHeroImg from '../assets/images/pasture_hero.jpg';
import iotCollarImg from '../assets/images/iot_collar_sensor_1791980664876.jpg';
import farmerTabletImg from '../assets/images/farmer_barn_tablet_1791980693341.jpg';
import herdsensePastureImg from '../assets/images/herdsense_cows_pasture_1791978546744.jpg';

interface DashboardViewProps {
  animals: Animal[];
  onSelectAnimal: (id: string) => void;
  onNavigateToAnimals: (filterStatus?: AnimalStatus | 'All') => void;
  onNavigateToAlerts: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onTriggerManualTick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  animals,
  onSelectAnimal,
  onNavigateToAnimals,
  onNavigateToAlerts,
  isSimulating,
  onToggleSimulation,
  onTriggerManualTick,
}) => {
  const totalCount = animals.length;
  const healthyCount = animals.filter((a) => a.status === 'NORMAL').length;
  const monitorCount = animals.filter((a) => a.status === 'MONITOR').length;
  const attentionCount = animals.filter((a) => a.status === 'ATTENTION').length;

  const statusPriority: Record<AnimalStatus, number> = {
    ATTENTION: 1,
    MONITOR: 2,
    NORMAL: 3,
  };

  const sortedAnimals = [...animals].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );

  // Featured animal for floating telemetry card
  const featuredAnimal = animals.find((a) => a.status === 'ATTENTION') || animals[0];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* ======================================================== */}
      {/* 1. HERO TEMPLATE WITH BACKGROUND IMAGE & INFORMATION     */}
      {/* ======================================================== */}
      <section className="relative rounded-[32px] overflow-hidden border border-[#e2dacf] shadow-xl bg-[#fdfbf7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10 relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#234e38]/10 text-[#234e38] text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#234e38] animate-pulse"></span>
              INGEN • IOT &amp; MACHINE LEARNING • ANIMAL WELFARE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#19241f] leading-[1.08] font-serif">
              Catch disease{' '}
              <span className="italic font-serif font-normal text-[#234e38]">
                before
              </span>{' '}
              the herd shows it.
            </h1>

            <p className="text-base sm:text-lg text-[#4a584f] leading-relaxed max-w-xl font-normal">
              INGEN smart biometric collars collect livestock health data around the clock. Machine
              learning detects subclinical anomalies before visible illness occurs, so ranchers
              can treat an individual animal early instead of managing an outbreak later.
            </p>

            {/* Action Buttons using previous original icons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigateToAnimals('All')}
                className="bg-[#234e38] hover:bg-[#1b3d2b] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md shadow-[#234e38]/20 flex items-center gap-2 group cursor-pointer"
              >
                <span>Open the herd monitor</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={onNavigateToAlerts}
                className="bg-white/90 hover:bg-[#efe8dc] text-[#19241f] border border-[#d6cec0] px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <AlertTriangle size={16} className="text-amber-600" />
                <span>View Alert Center ({attentionCount} urgent)</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Pasture Background Image & Floating Telemetry Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-[#e5ded0] group">
              <img
                src={pastureHeroImg}
                alt="INGEN herd grazing in lush pasture"
                className="w-full h-[320px] sm:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Pasture Zone A • Telemetry Online</span>
              </div>
            </div>

            {/* Interactive Floating Telemetry Card */}
            {featuredAnimal && (
              <div
                onClick={() => onSelectAnimal(featuredAnimal.id)}
                className="absolute -bottom-5 left-3 sm:left-5 right-3 sm:right-auto sm:w-[310px] bg-[#fdfbf7]/95 backdrop-blur-md rounded-2xl p-4 border border-[#e8e0d0] shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#6c7b70] block">
                      {featuredAnimal.collarId}
                    </span>
                    <h3 className="text-base font-bold text-[#19241f] group-hover:text-[#234e38] transition-colors">
                      {featuredAnimal.name} (#{featuredAnimal.id})
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      featuredAnimal.status === 'ATTENTION'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : featuredAnimal.status === 'MONITOR'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {featuredAnimal.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#eee7da]">
                  <div className="flex items-center gap-1.5">
                    <Thermometer size={14} className="text-rose-600" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Temperature</span>
                      <span className="font-bold text-slate-800">{featuredAnimal.temp.toFixed(1)}°F</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={14} className="text-[#234e38]" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rumination</span>
                      <span className="font-bold text-slate-800">{featuredAnimal.rumination}h / day</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span className="text-slate-500">{featuredAnimal.breed}</span>
                  <span className="text-[#234e38] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. KPI STATS CARDS (ORIGINAL ICONS & METRICS)            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Population */}
        <div
          onClick={() => onNavigateToAnimals('All')}
          className="glass p-6 rounded-3xl cursor-pointer hover:border-slate-400 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Total Population</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
              Herd
            </span>
          </div>
          <h3 className="text-5xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">
            {totalCount}
          </h3>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
            <span>Browse directory</span>
            <ArrowRight size={13} />
          </p>
        </div>

        {/* Healthy */}
        <div
          onClick={() => onNavigateToAnimals('NORMAL')}
          className="glass p-6 rounded-3xl border-l-4 border-emerald-500 status-glow-green cursor-pointer hover:bg-emerald-50/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Healthy</p>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <h3 className="text-5xl font-extrabold text-emerald-600 tracking-tight group-hover:scale-105 transition-transform origin-left">
            {healthyCount}
          </h3>
          <p className="text-xs text-emerald-700 mt-3 flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>Stable physiology</span>
            <span className="text-[10px] text-slate-500 ml-auto">
              {totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0}%
            </span>
          </p>
        </div>

        {/* Monitoring */}
        <div
          onClick={() => onNavigateToAnimals('MONITOR')}
          className="glass p-6 rounded-3xl border-l-4 border-amber-500 status-glow-yellow cursor-pointer hover:bg-amber-50/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Monitoring</p>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <h3 className="text-5xl font-extrabold text-amber-600 tracking-tight group-hover:scale-105 transition-transform origin-left">
            {monitorCount}
          </h3>
          <p className="text-xs text-amber-700 mt-3 flex items-center gap-1">
            <Activity size={13} />
            <span>Subtle temperature drift</span>
            <span className="text-[10px] text-slate-500 ml-auto">
              {totalCount > 0 ? Math.round((monitorCount / totalCount) * 100) : 0}%
            </span>
          </p>
        </div>

        {/* Attention */}
        <div
          onClick={() => onNavigateToAnimals('ATTENTION')}
          className="glass p-6 rounded-3xl border-l-4 border-rose-500 status-glow-red cursor-pointer hover:bg-rose-50/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Attention</p>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
          </div>
          <h3 className="text-5xl font-extrabold text-rose-600 tracking-tight group-hover:scale-105 transition-transform origin-left">
            {attentionCount}
          </h3>
          <p className="text-xs text-rose-700 mt-3 flex items-center gap-1">
            <AlertTriangle size={13} />
            <span>Immediate vet review</span>
            <span className="text-[10px] text-slate-500 ml-auto">
              {totalCount > 0 ? Math.round((attentionCount / totalCount) * 100) : 0}%
            </span>
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LIVE LORAWAN IOT SIMULATOR QUICK BAR                  */}
      {/* ======================================================== */}
      <div className="glass p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#d6cec0] bg-white/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#234e38]/15 border border-[#234e38]/30 flex items-center justify-center text-[#234e38] font-bold">
            <Radio size={20} className={isSimulating ? 'animate-pulse text-emerald-600' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 font-serif">Live LoRaWAN Telemetry Feed</h4>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isSimulating ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {isSimulating ? 'Streaming Active' : 'Simulation Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Collar sensors transmit core temperature, rumination hours, and accelerometry metrics in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onTriggerManualTick}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Zap size={14} className="text-amber-600" />
            <span>Simulate Collar Ping</span>
          </button>
          <button
            onClick={onToggleSimulation}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md cursor-pointer ${
              isSimulating
                ? 'bg-[#19241f] hover:bg-black text-white'
                : 'bg-[#234e38] hover:bg-[#1b3d2b] text-white shadow-[#234e38]/25'
            }`}
          >
            {isSimulating ? 'Pause Stream' : 'Auto-Stream'}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TEMPLATES & BACKGROUND IMAGES INFORMATION SHOWCASE    */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#19241f] tracking-tight font-serif">
              INGEN Technology &amp; Field Templates
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Integrated IoT architecture, machine learning prediction, and farm operations.
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-[#526056] bg-white px-3 py-1 rounded-full border border-[#e2dacf]">
            Firmware v2.4 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Template 1: Continuous IoT Collar Hardware */}
          <div className="rounded-3xl overflow-hidden border border-[#e2dacf] bg-white shadow-md flex flex-col group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <img
                src={iotCollarImg}
                alt="INGEN IoT Collar Sensor hardware"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-[#234e38] px-2 py-0.5 rounded-full">
                  Hardware Template
                </span>
                <h4 className="text-base font-bold mt-1">Biometric Collar Telemetry</h4>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Solar-assisted sub-dermal thermistors calibrated to 0.1°F accuracy. 
                Built-in 3-axis accelerometer captures rumination chewing cycles, resting time, and estrus spikes across a 10-mile LoRaWAN range.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">915 MHz • 3-Yr Battery</span>
                <button
                  onClick={() => onNavigateToAnimals('All')}
                  className="text-[#234e38] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Collar Status</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Template 2: Predictive Anomaly & Risk Engine */}
          <div className="rounded-3xl overflow-hidden border border-[#e2dacf] bg-white shadow-md flex flex-col group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <img
                src={farmerTabletImg}
                alt="Veterinarian inspecting predictive risk on tablet"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-indigo-600 px-2 py-0.5 rounded-full">
                  Diagnostic Template
                </span>
                <h4 className="text-base font-bold mt-1">Predictive Risk Engine</h4>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Machine learning algorithms compare continuous thermal telemetry against circadian baselines.
                Detects early markers of bovine respiratory disease (BRD) and subclinical mastitis 24–48 hours before physical symptoms appear.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">Neural Anomaly Net</span>
                <button
                  onClick={onNavigateToAlerts}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Active Risks</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Template 3: Pasture & Herd Health Operations */}
          <div className="rounded-3xl overflow-hidden border border-[#e2dacf] bg-white shadow-md flex flex-col group hover:shadow-xl transition-all">
            <div className="relative h-48 overflow-hidden">
              <img
                src={herdsensePastureImg}
                alt="Cattle grazing in green pastures with geo-zones"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-wider bg-amber-600 px-2 py-0.5 rounded-full">
                  Pasture Template
                </span>
                <h4 className="text-base font-bold mt-1">Herd &amp; Pasture Management</h4>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic pasture zone telemetry across North Pasture, South Meadow, and Barn 3.
                Correlates ambient temperature humidity index (THI) with milk yield records and digital veterinary case journals.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">3 Geofence Zones</span>
                <button
                  onClick={() => onNavigateToAnimals('All')}
                  className="text-amber-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Explore Zones</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CRITICAL ALERTS HEADER & LIVESTOCK TELEMETRY CARDS    */}
      {/* ======================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 font-serif">
              <span>Critical Alerts &amp; Telemetry Feed</span>
              {attentionCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  {attentionCount} Urgent
                </span>
              )}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Prioritized by physiological anomaly severity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAlerts}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-all border border-slate-300 shadow-sm cursor-pointer"
            >
              Alert Center Log
            </button>
            <button
              onClick={() => onNavigateToAnimals('All')}
              className="px-5 py-2 rounded-full bg-[#234e38] hover:bg-[#1b3d2b] text-white text-sm font-semibold transition-all shadow-md shadow-[#234e38]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Animals</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAnimals.map((animal) => {
            const isAttention = animal.status === 'ATTENTION';
            const isMonitor = animal.status === 'MONITOR';

            const glowClass = isAttention
              ? 'status-glow-red'
              : isMonitor
              ? 'status-glow-yellow'
              : 'status-glow-green';

            return (
              <div
                key={animal.id}
                onClick={() => onSelectAnimal(animal.id)}
                className="glass p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer border border-[#e2dacf] hover:border-[#234e38]"
              >
                {/* Status indicator bar on the right edge */}
                <div
                  className={`absolute top-0 right-0 w-2.5 h-full ${
                    isAttention ? 'bg-rose-500' : isMonitor ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />

                {/* Top card row */}
                <div className="flex justify-between items-start mb-6 pr-3">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#234e38] transition-colors font-serif">
                      #{animal.id} {animal.name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">{animal.breed}</p>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                      <MapPin size={12} className="text-slate-400" /> {animal.pasture}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${glowClass} ${
                      isAttention
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : isMonitor
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {animal.status}
                  </span>
                </div>

                {/* 2-column vitals: Temp & Activity */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold flex items-center gap-1">
                      <Thermometer size={12} className="text-rose-500" /> Temperature
                    </p>
                    <p
                      className={`text-xl font-extrabold ${
                        isAttention
                          ? 'text-rose-600'
                          : isMonitor
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {animal.temp.toFixed(1)}°F
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {animal.temp > 101.5 ? `+${(animal.temp - 101.5).toFixed(1)}°F vs base` : 'Nominal base'}
                    </p>
                  </div>

                  <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold flex items-center gap-1">
                      <Activity size={12} className="text-indigo-500" /> Activity
                    </p>
                    <p
                      className={`text-xl font-extrabold ${
                        isAttention
                          ? 'text-rose-600'
                          : isMonitor
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {animal.activity}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {animal.rumination}h rumination
                    </p>
                  </div>
                </div>

                {/* Bottom inspect link */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">{animal.collarId}</span>
                  <span className="text-[#234e38] group-hover:text-black font-bold flex items-center gap-1">
                    <span>Inspect Vitals</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
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
