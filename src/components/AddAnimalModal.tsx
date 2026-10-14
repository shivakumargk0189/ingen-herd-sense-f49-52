import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Animal, AnimalStatus, ActivityLevel } from '../types';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newAnimal: Animal) => void;
  existingCount: number;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCount,
}) => {
  const nextId = String(existingCount + 1).padStart(3, '0');

  const [id, setId] = useState(`KB-${nextId}`);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('Holstein Friesian');
  const [category, setCategory] = useState<'Dairy' | 'Beef' | 'Breeding' | 'Calf'>('Dairy');
  const [temp, setTemp] = useState('101.4');
  const [activity, setActivity] = useState<ActivityLevel>('High');
  const [pasture, setPasture] = useState('North Pasture 3');
  const [age, setAge] = useState('3.0 yrs');
  const [weightKg, setWeightKg] = useState('640');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTemp = parseFloat(temp) || 101.4;
    let status: AnimalStatus = 'NORMAL';
    if (parsedTemp >= 103.5 || activity === 'Very Low') {
      status = 'ATTENTION';
    } else if (parsedTemp >= 102.0 || activity === 'Low') {
      status = 'MONITOR';
    }

    const animal: Animal = {
      id: id.trim() || `KB-${nextId}`,
      name: name.trim(),
      breed,
      category,
      temp: parsedTemp,
      activity,
      status,
      heartRate: status === 'ATTENTION' ? 88 : status === 'MONITOR' ? 76 : 68,
      rumination: status === 'ATTENTION' ? 4.5 : status === 'MONITOR' ? 6.8 : 8.5,
      sensorBattery: 100,
      collarId: `COLLAR-${breed.slice(0, 2).toUpperCase()}-${id}`,
      pasture,
      age,
      weightKg: parseInt(weightKg, 10) || 600,
      historyTemps: Array(12).fill(parsedTemp),
      historyActivity: Array(12).fill(activity === 'High' ? 90 : activity === 'Normal' ? 75 : 45),
      notes: [
        {
          id: `note-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          author: 'INGEN Registrar',
          text: 'Enrolled in continuous IoT disease-prevention telemetry.',
        },
      ],
      lastUpdate: 'Just now',
    };

    onAdd(animal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fbf8f2] border border-[#dcd4c3] rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e0d0]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Register Livestock into INGEN
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Link collar telemetry tag and begin automated early illness detection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#526056] hover:text-[#19241f] rounded-full hover:bg-[#efe8dc]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Collar Tag ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-4 py-2.5 text-[#19241f] font-mono text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Animal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Marigold"
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-4 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Breed</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-3 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              >
                <option value="Holstein Friesian">Holstein Friesian</option>
                <option value="Jersey">Jersey</option>
                <option value="Angus">Angus</option>
                <option value="Hereford">Hereford</option>
                <option value="Guernsey">Guernsey</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-3 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              >
                <option value="Dairy">Dairy</option>
                <option value="Beef">Beef</option>
                <option value="Breeding">Breeding</option>
                <option value="Calf">Calf</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Initial Temp (°F)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-4 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Locomotion Activity</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as any)}
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-3 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              >
                <option value="High">High (Vigorous)</option>
                <option value="Normal">Normal (Pasture Grazing)</option>
                <option value="Low">Low (Sluggish)</option>
                <option value="Very Low">Very Low (Recumbent)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Pasture Location</label>
              <input
                type="text"
                value={pasture}
                onChange={(e) => setPasture(e.target.value)}
                placeholder="e.g. North Pasture 3"
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-4 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#526257] mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-white border border-[#dcd3c1] rounded-full px-4 py-2.5 text-[#19241f] text-sm focus:ring-2 focus:ring-[#234e38] outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Enroll Animal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
