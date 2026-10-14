import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Thermometer, 
  Archive, 
  Volume2, 
  Radio, 
  Building, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { FarmSettings } from '../types';

interface SettingsViewProps {
  settings: FarmSettings;
  onUpdateSettings: (newSettings: FarmSettings) => void;
  onBackToHome: () => void;
  onTestAlert: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onBackToHome,
  onTestAlert,
}) => {
  const [tempThreshold, setTempThreshold] = useState(settings.tempThreshold.toString());
  const [farmName, setFarmName] = useState(settings.farmName);
  const [managerName, setManagerName] = useState(settings.managerName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const parsedTemp = parseFloat(tempThreshold) || 103.5;
    onUpdateSettings({
      ...settings,
      tempThreshold: parsedTemp,
      farmName,
      managerName,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults: FarmSettings = {
      tempThreshold: 103.5,
      heartRateThreshold: 85,
      pushNotifications: true,
      audioAlerts: false,
      autoArchive: false,
      archiveDays: 30,
      telemetrySimulation: true,
      telemetryIntervalSeconds: 10,
      farmName: 'Green Valley Smart Ranch',
      managerName: 'Chief Herdsman Dave',
      layoutMode: 'sidebar',
      tempUnit: 'C',
    };
    setTempThreshold('103.5');
    setFarmName('Green Valley Smart Ranch');
    setManagerName('Chief Herdsman Dave');
    onUpdateSettings(defaults);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            System Settings
          </h2>
          <p className="text-slate-600 mt-1 text-base md:text-lg">
            Configure monitoring thresholds, IoT gateway, and user preferences.
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

      {/* Main Settings List */}
      <div className="space-y-5">
        {/* Push Notifications (from clone) */}
        <div className="glass p-6 rounded-3xl flex items-center justify-between border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Push Notifications</h4>
              <p className="text-sm text-slate-600">Get instant alerts on your phone & mobile dashboard</p>
            </div>
          </div>

          <div
            onClick={() => onUpdateSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
            className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors ${
              settings.pushNotifications ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                settings.pushNotifications ? 'right-1' : 'left-1'
              }`}
            />
          </div>
        </div>

        {/* Temperature Threshold (from clone) */}
        <div className="glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
              <Thermometer size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Temperature Threshold</h4>
              <p className="text-sm text-slate-600">Flag animal as "ATTENTION" when temp exceeds this value</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <input
              type="text"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-right w-28 font-mono font-bold text-base outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <span className="text-slate-600 text-sm font-semibold">°F</span>
          </div>
        </div>

        {/* Auto-Archive Logs (from clone) */}
        <div className="glass p-6 rounded-3xl flex items-center justify-between border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
              <Archive size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Auto-Archive Logs</h4>
              <p className="text-sm text-slate-600">Clean up cleared alert records every 30 days</p>
            </div>
          </div>

          <div
            onClick={() => onUpdateSettings({ ...settings, autoArchive: !settings.autoArchive })}
            className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors ${
              settings.autoArchive ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                settings.autoArchive ? 'right-1' : 'left-1'
              }`}
            />
          </div>
        </div>

        {/* Sound / Audio Alerts */}
        <div className="glass p-6 rounded-3xl flex items-center justify-between border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
              <Volume2 size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Audible Alarm Ping</h4>
              <p className="text-sm text-slate-600">Play chime when sensor detects critical hyperthermia (&gt;103.5°F)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTestAlert}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm cursor-pointer"
            >
              Test Beep
            </button>
            <div
              onClick={() => onUpdateSettings({ ...settings, audioAlerts: !settings.audioAlerts })}
              className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors ${
                settings.audioAlerts ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                  settings.audioAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Telemetry Stream Sampling Interval */}
        <div className="glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
              <Radio size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Telemetry Sampling Speed</h4>
              <p className="text-sm text-slate-600">IoT collar packet frequency for live streaming simulation</p>
            </div>
          </div>

          <select
            value={settings.telemetryIntervalSeconds}
            onChange={(e) =>
              onUpdateSettings({
                ...settings,
                telemetryIntervalSeconds: parseInt(e.target.value, 10),
              })
            }
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 text-sm outline-none cursor-pointer"
          >
            <option value="5">Fast (Every 5 seconds)</option>
            <option value="10">Normal (Every 10 seconds)</option>
            <option value="30">Standard (Every 30 seconds)</option>
            <option value="60">Conservative (Every 60 seconds)</option>
          </select>
        </div>

        {/* Farm & Gateway Metadata */}
        <div className="glass p-6 rounded-3xl space-y-4 border border-[#e2dacf] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700">
              <Building size={20} />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-base">Farm & Station Profile</h4>
              <p className="text-xs text-slate-500">Ranch identifier and chief herdsman contact.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Ranch / Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Chief Herdsman / Manager</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button & Reset */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-300 shadow-sm cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-fade-in">
              <Check size={14} /> Settings Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
