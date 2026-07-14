"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Activity, Clock } from 'lucide-react';

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
    <div className="h-40 flex items-center justify-center max-w-4xl mx-auto mb-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  if (!data) return null;

  const totalMatch = data.accuracy.padan;
  const totalNotMatch = data.accuracy.tidak_padan + data.accuracy.anomali;
  const totalAll = totalMatch + totalNotMatch || 1;
  const padanPercent = Math.round((totalMatch / totalAll) * 100);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      {/* Persentase Data Padan vs Tidak Padan */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-primary" />
          Status Pemadanan
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <div className="relative w-24 h-24 flex-shrink-0">
             <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90 drop-shadow-sm">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-success"
                  strokeDasharray={`${padanPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">{padanPercent}%</span>
              </div>
          </div>
          <div className="space-y-3 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Padan</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{totalMatch}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Gagal</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{totalNotMatch}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rata-rata Skor Kemiripan */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-500" />
          Rata-rata Kemiripan
        </h3>
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-end gap-2 mb-1">
             <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{Math.round(data.accuracy.rata_rata_skor)}</span>
             <span className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-1.5">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded w-fit mt-1">
            (1 - cost / maxLen) × 100%
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4">
             <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.round(data.accuracy.rata_rata_skor)}%` }}></div>
          </div>
        </div>
      </motion.div>

      {/* Status SLA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-500" />
          Status SLA
        </h3>
        <div className="flex flex-col justify-center h-full space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">ON-TRACK</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {data.sla.keterangan}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
