export type AnimalStatus = 'NORMAL' | 'MONITOR' | 'ATTENTION';
export type ActivityLevel = 'High' | 'Normal' | 'Low' | 'Very Low';

export interface VetNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface Animal {
  id: string;
  name: string;
  breed: string;
  category: 'Dairy' | 'Beef' | 'Breeding' | 'Calf';
  temp: number; // Stored in Fahrenheit as baseline (e.g. 104.4)
  activity: ActivityLevel;
  status: AnimalStatus;
  heartRate: number; // bpm
  rumination: number; // hrs/day
  sensorBattery: number; // percentage
  collarId: string;
  pasture: string;
  age: string;
  weightKg: number;
  historyTemps: number[]; // 12 data points
  historyActivity: number[]; // 12 points
  notes: VetNote[];
  lastUpdate: string;
  predictedCondition?: string; // e.g. "Mastitis 99%"
}

export interface AlertLogItem {
  id: string;
  animalId: string;
  animalName: string;
  breed: string;
  severity: AnimalStatus;
  type: 'TEMPERATURE' | 'ACTIVITY' | 'RUMINATION' | 'BATTERY';
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface FarmSettings {
  tempThreshold: number;
  heartRateThreshold: number;
  pushNotifications: boolean;
  audioAlerts: boolean;
  autoArchive: boolean;
  archiveDays: number;
  telemetrySimulation: boolean;
  telemetryIntervalSeconds: number;
  farmName: string;
  managerName: string;
  layoutMode: 'sidebar' | 'topnav';
  tempUnit: 'C' | 'F';
}

export type ViewType = 'overview' | 'monitor' | 'predictor' | 'details' | 'alerts' | 'settings' | 'home' | 'animals' | 'analytics';

export function formatTemp(tempF: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'C') {
    const c = ((tempF - 32) * 5) / 9;
    return `${c.toFixed(1)}°C`;
  }
  return `${tempF.toFixed(1)}°F`;
}
