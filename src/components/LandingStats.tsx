import { Building2, Map, MapPin, Database, Layers, CalendarSync } from 'lucide-react';

export default function LandingStats() {
  const stats = [
    { icon: Building2, value: "5", label: "Jumlah K/L", color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-900/30" },
    { icon: Map, value: "24", label: "Jumlah Provinsi", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { icon: MapPin, value: "192", label: "Jumlah Kab/Kota", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { icon: Database, value: "93", label: "Variabel Data", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Layers, value: "2", label: "Tema Data", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { icon: CalendarSync, value: "2026", label: "Update Terkini", color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/30" }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          Data diperbarui secara berkala dari basis data DTSEN
        </div>
      </div>
    </div>
  );
}
