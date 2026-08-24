"use client";

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, AlertCircle, Database } from 'lucide-react';

const mockDesilData = [
  { name: 'Desil 1', v2: 124000, v3: 135000 },
  { name: 'Desil 2', v2: 110000, v3: 105000 },
  { name: 'Desil 3', v2: 105000, v3: 98000 },
  { name: 'Desil 4', v2: 95000, v3: 99000 },
];

const mockTrendData = [
  { name: 'Jan', anomalies: 400 },
  { name: 'Feb', anomalies: 300 },
  { name: 'Mar', anomalies: 200 },
  { name: 'Apr', anomalies: 278 },
  { name: 'Mei', anomalies: 189 },
];

export default function ComparePage() {
  const { user } = useAuth();

  if (!user || (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Komparasi Data V2 vs V3</h2>
        <p className="text-muted">Analisis pergeseran statistik desil kesejahteraan dan rekapitulasi anomali data.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Total KPM V3</h3>
          </div>
          <div className="text-3xl font-black text-foreground">1,245,892</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-success-dark font-medium">
            <ArrowUpRight className="w-4 h-4" /> <span>+4.2% dari V2</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Anomali NIK (V3)</h3>
          </div>
          <div className="text-3xl font-black text-foreground">12,403</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-rose-500 font-medium">
            <ArrowDownRight className="w-4 h-4" /> <span>-15% dari V2</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm border border-border bg-gradient-to-br from-primary to-indigo-600 text-white border-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-blue-100">Graduasi PBI</h3>
          </div>
          <div className="text-3xl font-black">45,210</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-blue-100 font-medium">
            Keluarga keluar dari Desil 1-2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-6 text-foreground">Pergeseran Desil (V2 vs V3)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDesilData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor" className="text-muted text-xs" />
                <YAxis stroke="currentColor" className="text-muted text-xs" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px'}} />
                <Legend />
                <Bar dataKey="v2" name="Versi 2" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="v3" name="Versi 3" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2 */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-6 text-foreground">Tren Penyelesaian Anomali</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor" className="text-muted text-xs" />
                <YAxis stroke="currentColor" className="text-muted text-xs" />
                <Tooltip contentStyle={{backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px'}} />
                <Legend />
                <Line type="monotone" dataKey="anomalies" name="Jumlah Kasus" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--surface)' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
