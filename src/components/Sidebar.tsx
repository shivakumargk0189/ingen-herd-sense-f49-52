import React from 'react';
import { 
  Home, 
  Layers, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Radio, 
  X,
  PlusCircle,
  Activity
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  unresolvedAlertCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAddModal: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  unresolvedAlertCount,
  isOpenMobile,
  onCloseMobile,
  onOpenAddModal,
  isSimulating,
  onToggleSimulation
}) => {
  const navItems = [
    { id: 'home' as ViewType, label: 'Dashboard', icon: Home },
    { id: 'animals' as ViewType, label: 'Animals', icon: Layers },
    { id: 'alerts' as ViewType, label: 'Alerts', icon: AlertTriangle, badge: unresolvedAlertCount },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#111827] border-r border-slate-800 p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Close button */}
          <div className="flex items-center justify-between mb-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => {
                onNavigate('home');
                onCloseMobile();
              }}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105 tracking-wider">
                IN
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">INGEN</h1>
                <p className="text-[11px] text-slate-400 font-medium">Biometric Telemetry</p>
              </div>
            </div>

            <button 
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Add Livestock Button with original PlusCircle icon */}
          <div className="mb-6">
            <button
              onClick={() => {
                onOpenAddModal();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-sm font-semibold transition-all group shadow-sm cursor-pointer"
            >
              <PlusCircle size={17} className="transition-transform group-hover:rotate-90" />
              <span>Register Animal</span>
            </button>
          </div>

          {/* Nav links with original Lucide icons */}
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'animals' && currentView === 'details');
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm group cursor-pointer ${
                      isActive
                        ? 'nav-active'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent size={19} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive ? 'bg-white text-indigo-700' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom IoT Telemetry Station Status */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSimulating ? 'bg-emerald-400' : 'bg-slate-500'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isSimulating ? 'bg-emerald-500' : 'bg-slate-600'
                  }`} />
                </span>
                <span className="text-xs font-semibold text-white">LoRa Gateway</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">915 MHz</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Telemetry:</span>
              <button
                onClick={onToggleSimulation}
                className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                  isSimulating 
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isSimulating ? 'LIVE STREAM' : 'PAUSED'}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium">
            INGEN v2.4 • Livestock Telemetry Hub
          </div>
        </div>
      </aside>
    </>
  );
};
