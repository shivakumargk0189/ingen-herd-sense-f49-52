import React from 'react';
import { Plus, Activity, Bell, Radio, Menu, X } from 'lucide-react';
import { ViewType, Animal } from '../types';

interface HerdSenseHeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenAddModal: () => void;
  unresolvedAlertCount: number;
  tempUnit: 'C' | 'F';
  onToggleTempUnit: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const HerdSenseHeader: React.FC<HerdSenseHeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAddModal,
  unresolvedAlertCount,
  tempUnit,
  onToggleTempUnit,
  isSimulating,
  onToggleSimulation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#fbf8f2]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#e8e1d2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo icon matching screenshot: dark green circle with vital wave */}
          <div className="w-9 h-9 rounded-full bg-[#234e38] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 text-[#fbf8f2]"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#19241f] font-serif">
            HerdSense
          </span>
        </div>

        {/* Desktop Navigation matching screenshot */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Overview button */}
          <button
            onClick={() => onNavigate('overview')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'overview'
                ? 'bg-[#1c2421] text-white shadow-sm'
                : 'text-[#48564c] hover:text-[#19241f] hover:bg-[#efe8dc]'
            }`}
          >
            Overview
          </button>

          {/* Herd monitor button */}
          <button
            onClick={() => onNavigate('monitor')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'monitor' || currentView === 'details'
                ? 'bg-[#1c2421] text-white shadow-sm'
                : 'text-[#48564c] hover:text-[#19241f] hover:bg-[#efe8dc]'
            }`}
          >
            Herd monitor
          </button>

          {/* Risk predictor button */}
          <button
            onClick={() => onNavigate('predictor')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'predictor'
                ? 'bg-[#1c2421] text-white shadow-sm'
                : 'text-[#48564c] hover:text-[#19241f] hover:bg-[#efe8dc]'
            }`}
          >
            Risk predictor
          </button>

          {/* Add animal button matching screenshot (+ Add animal dark green pill) */}
          <button
            onClick={onOpenAddModal}
            className="ml-2 bg-[#234e38] hover:bg-[#1b3d2b] text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add animal</span>
          </button>
        </nav>

        {/* Auxiliary Controls (Temp Unit, Alerts, Live IoT badge) */}
        <div className="flex items-center gap-2.5">
          {/* Temperature Unit Toggle */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#efe8dc] hover:bg-[#e4dcce] text-[#2d3b32] border border-[#ded5c5] transition-all"
            title="Toggle °C / °F"
          >
            {tempUnit === 'C' ? '°C' : '°F'}
          </button>

          {/* Alert Center Shortcut */}
          <button
            onClick={() => onNavigate('alerts')}
            className={`p-2 rounded-full border transition-all relative ${
              unresolvedAlertCount > 0
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-[#efe8dc] text-[#3e4d43] border-[#ded5c5]'
            }`}
            title="View Alerts"
          >
            <Bell size={16} />
            {unresolvedAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unresolvedAlertCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2d3b32] hover:bg-[#efe8dc] rounded-full"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#fbf8f2] border-b border-[#e8e1d2] space-y-2 animate-fade-in">
          <button
            onClick={() => {
              onNavigate('overview');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium ${
              currentView === 'overview' ? 'bg-[#1c2421] text-white' : 'text-[#48564c]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              onNavigate('monitor');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium ${
              currentView === 'monitor' ? 'bg-[#1c2421] text-white' : 'text-[#48564c]'
            }`}
          >
            Herd monitor
          </button>
          <button
            onClick={() => {
              onNavigate('predictor');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium ${
              currentView === 'predictor' ? 'bg-[#1c2421] text-white' : 'text-[#48564c]'
            }`}
          >
            Risk predictor
          </button>
          <button
            onClick={() => {
              onOpenAddModal();
              setMobileMenuOpen(false);
            }}
            className="w-full bg-[#234e38] text-white px-4 py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Add animal</span>
          </button>
        </div>
      )}
    </header>
  );
};
