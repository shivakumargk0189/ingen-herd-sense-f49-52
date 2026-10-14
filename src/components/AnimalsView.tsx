import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Plus, 
  Download, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  MapPin,
  Heart,
  Thermometer,
  Activity as ActivityIcon
} from 'lucide-react';
import { Animal, AnimalStatus } from '../types';

interface AnimalsViewProps {
  animals: Animal[];
  onSelectAnimal: (id: string) => void;
  onBackToHome: () => void;
  onOpenAddModal: () => void;
  initialFilterStatus?: AnimalStatus | 'All';
  tempUnit?: 'C' | 'F';
}

export const AnimalsView: React.FC<AnimalsViewProps> = ({
  animals,
  onSelectAnimal,
  onBackToHome,
  onOpenAddModal,
  initialFilterStatus = 'All',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus);
  const [breedFilter, setBreedFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'temp' | 'status'>('id');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const breeds = useMemo(() => {
    const list = Array.from(new Set(animals.map((a) => a.breed)));
    return ['All', ...list];
  }, [animals]);

  const filteredAnimals = useMemo(() => {
    return animals
      .filter((a) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          a.id.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.breed.toLowerCase().includes(query) ||
          a.collarId.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
        const matchesBreed = breedFilter === 'All' || a.breed === breedFilter;

        return matchesSearch && matchesStatus && matchesBreed;
      })
      .sort((a, b) => {
        if (sortBy === 'id') return a.id.localeCompare(b.id);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'temp') return b.temp - a.temp;
        if (sortBy === 'status') {
          const priority: Record<AnimalStatus, number> = { ATTENTION: 1, MONITOR: 2, NORMAL: 3 };
          return priority[a.status] - priority[b.status];
        }
        return 0;
      });
  }, [animals, searchTerm, statusFilter, breedFilter, sortBy]);

  const handleExportCSV = () => {
    const headers = 'ID,Name,Breed,Category,Temperature_F,Activity,Status,HeartRate_BPM,Rumination_Hrs,Collar_ID,Pasture\n';
    const rows = filteredAnimals
      .map(
        (a) =>
          `"${a.id}","${a.name}","${a.breed}","${a.category}",${a.temp},"${a.activity}","${a.status}",${a.heartRate},${a.rumination},"${a.collarId}","${a.pasture}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ingen_livestock_records_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with back button matching cloned site */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Livestock Directory
          </h2>
          <p className="text-slate-600 mt-1 text-base md:text-lg">
            Manage your animal population records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Livestock</span>
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-sm font-semibold flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>← Back</span>
          </button>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              id="animalSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID or Name..."
              className="bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 w-full focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter matching cloned site */}
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="NORMAL">Healthy</option>
            <option value="MONITOR">Monitoring</option>
            <option value="ATTENTION">Attention</option>
          </select>

          {/* Breed Filter */}
          <select
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer shadow-sm"
          >
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Breeds' : b}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer shadow-sm"
          >
            <option value="id">Sort: ID</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="temp">Sort: Temperature</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>

        {/* View toggle & CSV Export */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="bg-white p-1 rounded-xl flex items-center border border-slate-300 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Cards View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Download CSV"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table View matching cloned site */}
      {viewMode === 'table' ? (
        <div className="glass rounded-3xl overflow-hidden border border-[#e2dacf] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-100/80 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-5 font-semibold">Animal ID</th>
                  <th className="p-5 font-semibold">Name & Breed</th>
                  <th className="p-5 font-semibold">Temp</th>
                  <th className="p-5 font-semibold">Activity</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody id="animals-table-body" className="divide-y divide-slate-200">
                {filteredAnimals.map((animal) => {
                  const statusColor =
                    animal.status === 'NORMAL'
                      ? 'emerald'
                      : animal.status === 'MONITOR'
                      ? 'amber'
                      : 'rose';

                  return (
                    <tr
                      key={animal.id}
                      onClick={() => onSelectAnimal(animal.id)}
                      className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                    >
                      <td className="p-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                        #{animal.id}
                      </td>
                      <td className="p-5 text-slate-700 font-medium">
                        {animal.name}
                        <span className="text-xs text-slate-400 ml-2 font-normal">
                          {animal.breed}
                        </span>
                      </td>
                      <td className={`p-5 font-bold text-sm text-${statusColor}-600`}>
                        {animal.temp}°F
                      </td>
                      <td className="p-5 text-slate-600 text-sm font-medium">
                        {animal.activity}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            statusColor === 'emerald'
                              ? 'bg-emerald-100 text-emerald-800'
                              : statusColor === 'amber'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {animal.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAnimal(animal.id);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-sm inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                        >
                          <span>View</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => {
            const statusColor =
              animal.status === 'NORMAL'
                ? 'emerald'
                : animal.status === 'MONITOR'
                ? 'amber'
                : 'rose';

            return (
              <div
                key={animal.id}
                onClick={() => onSelectAnimal(animal.id)}
                className="glass p-6 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer border border-[#e2dacf]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600">
                      #{animal.id} {animal.name}
                    </h4>
                    <p className="text-sm text-slate-500">{animal.breed}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                      <MapPin size={12} /> {animal.pasture}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      statusColor === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : statusColor === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {animal.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Temperature</p>
                    <p className="text-lg font-bold text-slate-900">{animal.temp}°F</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Activity</p>
                    <p className="text-lg font-bold text-slate-900">{animal.activity}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Heart Rate</p>
                    <p className="text-lg font-bold text-slate-900">{animal.heartRate} bpm</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Rumination</p>
                    <p className="text-lg font-bold text-slate-900">{animal.rumination} h/d</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 font-mono">{animal.collarId}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
