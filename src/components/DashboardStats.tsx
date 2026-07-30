"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Activity, Clock, ShieldCheck, Database, Users } from 'lucide-react';

export default function DashboardStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analysis')
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-40 flex items-center justify-center w-full mb-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  if (!data) return null;

  const totalMatch = data.accuracy.padan;
  const totalNotMatch = data.accuracy.tidak_padan + data.accuracy.anomali;
  const totalAll = totalMatch + totalNotMatch || 1;
  const padanPercent = Math.round((totalMatch / totalAll) * 100);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-4">
        {/* Mock DTSEN-like stats */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
            <div className="text-xs font-semibold text-slate-500">Aman & Rahasia</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAll}</div>
            <div className="text-xs font-semibold text-slate-500">Total Record</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <PieChart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{padanPercent}%</div>
            <div className="text-xs font-semibold text-slate-500">Tingkat Padan</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{Math.round(data.accuracy.rata_rata_skor)}%</div>
            <div className="text-xs font-semibold text-slate-500">Skor Kemiripan</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalMatch}</div>
            <div className="text-xs font-semibold text-slate-500">Keluarga Valid</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-primary">
             <Clock className="w-6 h-6" />
          </div>
          <div>
             <div className="text-2xl font-black text-slate-900 dark:text-white">ON</div>
             <div className="text-xs font-semibold text-slate-500">Status SLA</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <div className="w-2 h-2 rounded-full bg-success"></div>
        Data diperbarui secara berkala dari basis data DTSEN
      </div>
    </div>
  );
}
