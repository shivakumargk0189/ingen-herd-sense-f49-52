import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  Activity, 
  ArrowRight,
  Info,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { Animal, formatTemp } from '../types';

interface RiskPredictorViewProps {
  animals: Animal[];
  onInspectAnimal: (animalId: string) => void;
  tempUnit: 'C' | 'F';
}

export const RiskPredictorView: React.FC<RiskPredictorViewProps> = ({
  animals,
  onInspectAnimal,
  tempUnit,
}) => {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(animals[0]?.id || 'KB-0417');
  const [tempCelsius, setTempCelsius] = useState<number>(40.2);
  const [ruminationHours, setRuminationHours] = useState<number>(4.4);
  const [activityDeviation, setActivityDeviation] = useState<number>(-45); // percentage

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];

  // Predictive algorithm simulation
  const calcRisk = () => {
    // Normal bovine temp is ~38.6°C (101.5°F).
    // Above 39.5°C is fever.
    const tempFeverScore = Math.max(0, Math.min(100, (tempCelsius - 38.6) * 65));
    const ruminationDropScore = Math.max(0, Math.min(100, (8.5 - ruminationHours) * 20));
    const activityDropScore = Math.abs(activityDeviation);

    const mastitisRisk = Math.min(99, Math.max(12, Math.round(tempFeverScore * 0.55 + ruminationDropScore * 0.45)));
    const brdRisk = Math.min(96, Math.max(8, Math.round(tempFeverScore * 0.6 + activityDropScore * 0.35)));
    const saraRisk = Math.min(90, Math.max(5, Math.round(ruminationDropScore * 0.75 + (tempCelsius < 39.0 ? 20 : 5))));

    return { mastitisRisk, brdRisk, saraRisk };
  };

  const { mastitisRisk, brdRisk, saraRisk } = calcRisk();

  const handleSelectAnimal = (id: string) => {
    setSelectedAnimalId(id);
    const target = animals.find((a) => a.id === id);
    if (target) {
      const c = ((target.temp - 32) * 5) / 9;
      setTempCelsius(Number(c.toFixed(1)));
      setRuminationHours(target.rumination);
      setActivityDeviation(target.activity === 'Very Low' ? -60 : target.activity === 'Low' ? -35 : 0);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto py-6">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#59695d] font-mono font-medium mb-1">
          PREDICTIVE EPIDEMIOLOGY MODEL &middot; HERDSENSE v3.2
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#19241f] font-serif">
          Early Disease Risk Predictor
        </h2>
        <p className="text-sm sm:text-base text-[#4a584f] mt-1 max-w-2xl">
          Machine learning neural models analyze multi-channel collar data to compute clinical onset probability up to 48 hours prior to visible fever presentation.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Biometric Telemetry Input Controls */}
        <div className="lg:col-span-6 bg-white/85 rounded-3xl p-6 sm:p-8 border border-[#e5ded0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#eadeca]">
            <h3 className="text-lg font-bold text-[#19241f] font-serif">
              Collar Biometrics Input
            </h3>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#efe8dc] text-[#334238]">
              Live ML Sandbox
            </span>
          </div>

          {/* Quick Animal Select */}
          <div>
            <label className="block text-xs font-semibold text-[#526257] uppercase tracking-wider mb-2">
              Select Livestock Profile
            </label>
            <select
              value={selectedAnimalId}
              onChange={(e) => handleSelectAnimal(e.target.value)}
              className="w-full bg-[#fbf9f4] border border-[#dcd4c3] rounded-2xl px-4 py-3 text-sm font-medium text-[#19241f] outline-none focus:ring-2 focus:ring-[#234e38]"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} - {a.name} ({a.breed}) &middot; Status: {a.status}
                </option>
              ))}
            </select>
          </div>

          {/* Slider 1: Core Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[#19241f] flex items-center gap-1.5">
                <Thermometer size={16} className="text-[#dc2626]" />
                Core Temperature
              </span>
              <span className="font-mono font-bold text-[#19241f] text-base">
                {tempCelsius.toFixed(1)}°C{' '}
                <span className="text-xs text-[#707e74] font-normal">
                  ({((tempCelsius * 9) / 5 + 32).toFixed(1)}°F)
                </span>
              </span>
            </div>
            <input
              type="range"
              min="37.5"
              max="41.5"
              step="0.1"
              value={tempCelsius}
              onChange={(e) => setTempCelsius(parseFloat(e.target.value))}
              className="w-full accent-[#234e38] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#707e74] font-mono">
              <span>37.5°C (Hypo)</span>
              <span className="text-[#234e38] font-bold">38.6°C (Nominal Base)</span>
              <span className="text-rose-600 font-bold">40.0°C+ (Acute Fever)</span>
            </div>
          </div>

          {/* Slider 2: Rumination Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[#19241f] flex items-center gap-1.5">
                <Clock size={16} className="text-[#2563eb]" />
                Rumination Rate
              </span>
              <span className="font-mono font-bold text-[#19241f] text-base">
                {ruminationHours.toFixed(1)} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="2.0"
              max="10.5"
              step="0.1"
              value={ruminationHours}
              onChange={(e) => setRuminationHours(parseFloat(e.target.value))}
              className="w-full accent-[#234e38] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#707e74] font-mono">
              <span className="text-rose-600">2.0 h/d (Suppressed)</span>
              <span className="text-[#234e38]">7.5 - 9.0 h/d (Healthy Cud)</span>
              <span>10.5 h/d</span>
            </div>
          </div>

          {/* Slider 3: Locomotion / Activity Index */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[#19241f] flex items-center gap-1.5">
                <Activity size={16} className="text-[#059669]" />
                Locomotion Anomaly Index
              </span>
              <span className="font-mono font-bold text-[#19241f] text-base">
                {activityDeviation > 0 ? `+${activityDeviation}%` : `${activityDeviation}%`}
              </span>
            </div>
            <input
              type="range"
              min="-75"
              max="75"
              step="5"
              value={activityDeviation}
              onChange={(e) => setActivityDeviation(parseInt(e.target.value, 10))}
              className="w-full accent-[#234e38] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#707e74] font-mono">
              <span>-75% (Lethargy)</span>
              <span>0% (Baseline)</span>
              <span>+75% (Estrus Restlessness)</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setTempCelsius(40.2);
                setRuminationHours(4.4);
                setActivityDeviation(-45);
              }}
              className="text-xs font-semibold text-[#234e38] hover:underline"
            >
              Reset to Marigold's Pre-Symptom Pattern (40.2°C, 4.4 h/d)
            </button>
          </div>
        </div>

        {/* Right Column: Predictive Disease Risk Assessment */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white/85 rounded-3xl p-6 sm:p-8 border border-[#e5ded0] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#eadeca]">
              <h3 className="text-lg font-bold text-[#19241f] font-serif">
                Predicted Pathologies
              </h3>
              <span className="text-xs text-[#526257]">Confidence: 98.4%</span>
            </div>

            {/* Risk Bar 1: Mastitis */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-[#19241f] block">
                    Acute Mastitis (Udder Infection)
                  </span>
                  <span className="text-xs text-[#707e74]">
                    Correlated with hyperthermia & rumination drop
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    mastitisRisk >= 75
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : mastitisRisk >= 40
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {mastitisRisk}% Probability
                </span>
              </div>
              <div className="h-3 w-full bg-[#efe8dc] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    mastitisRisk >= 75 ? 'bg-rose-600' : mastitisRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${mastitisRisk}%` }}
                />
              </div>
            </div>

            {/* Risk Bar 2: Bovine Respiratory Disease */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-[#19241f] block">
                    Bovine Respiratory Disease (BRD)
                  </span>
                  <span className="text-xs text-[#707e74]">
                    Elevated respiration & recumbency index
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    brdRisk >= 75
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : brdRisk >= 40
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {brdRisk}% Probability
                </span>
              </div>
              <div className="h-3 w-full bg-[#efe8dc] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    brdRisk >= 75 ? 'bg-rose-600' : brdRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${brdRisk}%` }}
                />
              </div>
            </div>

            {/* Risk Bar 3: Subacute Ruminal Acidosis */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-[#19241f] block">
                    Subacute Ruminal Acidosis (SARA)
                  </span>
                  <span className="text-xs text-[#707e74]">
                    Digestive pH irregularity from curtailed cudding
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                    saraRisk >= 75
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : saraRisk >= 40
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {saraRisk}% Probability
                </span>
              </div>
              <div className="h-3 w-full bg-[#efe8dc] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    saraRisk >= 75 ? 'bg-rose-600' : saraRisk >= 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${saraRisk}%` }}
                />
              </div>
            </div>

            {/* Actionable Veterinary Protocol */}
            <div className="p-4 bg-[#fbf9f4] rounded-2xl border border-[#e5dec9] space-y-2">
              <div className="flex items-center gap-2 text-[#234e38] font-bold text-xs uppercase tracking-wider">
                <Stethoscope size={15} />
                <span>Recommended Early Intervention</span>
              </div>
              <p className="text-xs text-[#48564c] leading-relaxed">
                {mastitisRisk >= 70 ? (
                  <>
                    <strong>Early Quarantine & Culture:</strong> Flagged 48h before outward udder swelling. Administer non-steroidal anti-inflammatory (NSAID) and extract California Mastitis Test (CMT) sample before milking parlor contamination.
                  </>
                ) : (
                  <>
                    <strong>Monitor Cud Rate:</strong> Biomarkers remain within acceptable physiological margins. Continue automated 15-minute LoRa packet telemetry.
                  </>
                )}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onInspectAnimal(selectedAnimal.id)}
                className="w-full bg-[#234e38] hover:bg-[#1b3d2b] text-white py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Inspect #{selectedAnimal.id} Full Telemetry</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
