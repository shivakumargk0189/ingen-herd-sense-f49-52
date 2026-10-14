/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Animal, AnimalStatus, AlertLogItem, FarmSettings, ViewType } from './types';
import { INITIAL_ANIMALS, INITIAL_ALERTS, INITIAL_SETTINGS } from './data/initialAnimals';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AnimalsView } from './components/AnimalsView';
import { AnimalDetailsView } from './components/AnimalDetailsView';
import { AlertsView } from './components/AlertsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AddAnimalModal } from './components/AddAnimalModal';

export default function App() {
  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem('smart_livestock_animals');
    return saved ? JSON.parse(saved) : INITIAL_ANIMALS;
  });

  const [alerts, setAlerts] = useState<AlertLogItem[]>(() => {
    const saved = localStorage.getItem('smart_livestock_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [settings, setSettings] = useState<FarmSettings>(() => {
    const saved = localStorage.getItem('smart_livestock_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [filterStatusForAnimals, setFilterStatusForAnimals] = useState<AnimalStatus | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('smart_livestock_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('smart_livestock_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('smart_livestock_settings', JSON.stringify(settings));
  }, [settings]);

  // Gentle audio chime using Web Audio API
  const playAlertChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay restrictions fallback
    }
  }, []);

  // Sensor drift simulation
  const simulateSensorTick = useCallback(() => {
    setAnimals((prevAnimals) => {
      const indicesToUpdate = new Set<number>();
      const count = Math.min(prevAnimals.length, Math.floor(Math.random() * 3) + 1);
      while (indicesToUpdate.size < count) {
        indicesToUpdate.add(Math.floor(Math.random() * prevAnimals.length));
      }

      let generatedAlert: AlertLogItem | null = null;

      const updated = prevAnimals.map((animal, idx) => {
        if (!indicesToUpdate.has(idx)) return animal;

        const delta = Math.random() * 0.25 - 0.1;
        let newTemp = Math.max(100.2, Math.min(106.2, animal.temp + delta));
        newTemp = Number(newTemp.toFixed(1));

        let newStatus = animal.status;
        if (newTemp >= settings.tempThreshold) {
          newStatus = 'ATTENTION';
          const hasActiveAlert = alerts.some((a) => a.animalId === animal.id && !a.resolved);
          if (!hasActiveAlert && !generatedAlert) {
            generatedAlert = {
              id: `alert-${Date.now()}`,
              animalId: animal.id,
              animalName: animal.name,
              breed: animal.breed,
              severity: 'ATTENTION',
              type: 'TEMPERATURE',
              message: `Telemetry alert: Core temperature elevated to ${newTemp}°F (threshold: ${settings.tempThreshold}°F).`,
              timestamp: 'Just now',
              resolved: false,
            };
          }
        } else if (newTemp >= 102.0) {
          if (newStatus !== 'ATTENTION') newStatus = 'MONITOR';
        } else {
          if (newStatus !== 'ATTENTION') newStatus = 'NORMAL';
        }

        const hrDelta = Math.floor(Math.random() * 5 - 2);
        const newHr = Math.max(55, Math.min(110, animal.heartRate + hrDelta));
        const newHistory = [...animal.historyTemps.slice(1), newTemp];

        return {
          ...animal,
          temp: newTemp,
          status: newStatus,
          heartRate: newHr,
          historyTemps: newHistory,
          lastUpdate: 'Just now',
        };
      });

      if (generatedAlert) {
        setAlerts((prev) => [generatedAlert!, ...prev]);
        if (settings.audioAlerts) {
          playAlertChime();
        }
      }

      return updated;
    });
  }, [settings.tempThreshold, settings.audioAlerts, alerts, playAlertChime]);

  // Interval for live IoT simulation
  useEffect(() => {
    if (!isSimulating) return;
    const intervalTime = Math.max(3000, (settings.telemetryIntervalSeconds || 10) * 1000);
    const interval = setInterval(() => {
      simulateSensorTick();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, settings.telemetryIntervalSeconds, simulateSensorTick]);

  // Navigation handlers
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'details') {
      setSelectedAnimalId(null);
    }
  };

  const handleSelectAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    setCurrentView('details');
  };

  const handleNavigateToAnimalsWithFilter = (status: AnimalStatus | 'All' = 'All') => {
    setFilterStatusForAnimals(status);
    setCurrentView('animals');
    setSelectedAnimalId(null);
  };

  const handleToggleLayoutMode = () => {
    setSettings((prev) => ({
      ...prev,
      layoutMode: prev.layoutMode === 'sidebar' ? 'topnav' : 'sidebar',
    }));
  };

  // Animal management handlers
  const handleUpdateAnimalStatus = (animalId: string, newStatus: AnimalStatus) => {
    setAnimals((prev) =>
      prev.map((a) => (a.id === animalId ? { ...a, status: newStatus } : a))
    );
  };

  const handleAddVetNote = (animalId: string, noteText: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      author: settings.managerName || 'Veterinarian',
      text: noteText,
    };
    setAnimals((prev) =>
      prev.map((a) => (a.id === animalId ? { ...a, notes: [newNote, ...a.notes] } : a))
    );
  };

  const handleSimulateVitalsChange = (animalId: string, tempDelta: number) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id !== animalId) return a;
        const newTemp = Number(Math.max(100.0, Math.min(106.5, a.temp + tempDelta)).toFixed(1));
        let newStatus: AnimalStatus = a.status;
        if (newTemp >= settings.tempThreshold) newStatus = 'ATTENTION';
        else if (newTemp >= 102.0) newStatus = 'MONITOR';
        else newStatus = 'NORMAL';

        return {
          ...a,
          temp: newTemp,
          status: newStatus,
          historyTemps: [...a.historyTemps.slice(1), newTemp],
          lastUpdate: 'Just now',
        };
      })
    );
  };

  const handleAddNewAnimal = (newAnimal: Animal) => {
    setAnimals((prev) => [newAnimal, ...prev]);
  };

  // Alert management handlers
  const handleToggleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              resolved: !a.resolved,
              resolvedAt: !a.resolved ? 'Just now' : undefined,
            }
          : a
      )
    );
  };

  const handleResolveAllAlerts = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        resolved: true,
        resolvedAt: 'Just now',
      }))
    );
  };

  const unresolvedAlertCount = alerts.filter((a) => !a.resolved).length;
  const attentionCount = animals.filter((a) => a.status === 'ATTENTION').length;
  const healthyCount = animals.filter((a) => a.status === 'NORMAL').length;

  const selectedAnimal = animals.find((a) => a.id === selectedAnimalId) || animals[0];
  const isTopNav = settings.layoutMode === 'topnav';

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-slate-800">
      {/* Sidebar Navigation */}
      {(!isTopNav || isMobileNavOpen) && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          unresolvedAlertCount={unresolvedAlertCount}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
        />
      )}

      {/* Main Content Area */}
      <main className={`p-4 sm:p-6 md:p-10 min-h-screen ${isTopNav ? 'max-w-7xl mx-auto' : 'lg:ml-64'}`}>
        <Header
          currentView={currentView}
          selectedAnimal={currentView === 'details' ? selectedAnimal : null}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          healthyCount={healthyCount}
          attentionCount={attentionCount}
          isSimulating={isSimulating}
          layoutMode={settings.layoutMode}
          onToggleLayoutMode={handleToggleLayoutMode}
          onNavigate={handleNavigate}
          unresolvedAlertCount={unresolvedAlertCount}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Dynamic Views */}
        {(currentView === 'home' || currentView === 'overview') && (
          <DashboardView
            animals={animals}
            onSelectAnimal={handleSelectAnimal}
            onNavigateToAnimals={handleNavigateToAnimalsWithFilter}
            onNavigateToAlerts={() => handleNavigate('alerts')}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onTriggerManualTick={simulateSensorTick}
          />
        )}

        {(currentView === 'animals' || currentView === 'monitor') && (
          <AnimalsView
            animals={animals}
            onSelectAnimal={handleSelectAnimal}
            onBackToHome={() => handleNavigate('home')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            initialFilterStatus={filterStatusForAnimals}
            tempUnit={settings.tempUnit}
          />
        )}

        {currentView === 'details' && selectedAnimal && (
          <AnimalDetailsView
            animal={selectedAnimal}
            onBack={() => handleNavigate('animals')}
            onUpdateStatus={handleUpdateAnimalStatus}
            onAddVetNote={handleAddVetNote}
            onSimulateVitalsChange={handleSimulateVitalsChange}
            tempUnit={settings.tempUnit}
          />
        )}

        {currentView === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onInspectAnimal={handleSelectAnimal}
            onBackToHome={() => handleNavigate('home')}
            onToggleResolveAlert={handleToggleResolveAlert}
            onResolveAll={handleResolveAllAlerts}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            animals={animals}
            onBackToHome={() => handleNavigate('home')}
            onNavigateToAnimals={handleNavigateToAnimalsWithFilter}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            onBackToHome={() => handleNavigate('home')}
            onTestAlert={playAlertChime}
          />
        )}
      </main>

      {/* Add Animal Modal */}
      <AddAnimalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewAnimal}
        existingCount={animals.length}
      />
    </div>
  );
}
