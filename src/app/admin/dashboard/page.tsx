"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, CheckCircle2, Clock, ShieldCheck, Database, FolderArchive, Activity, Server, HardDrive, MapPin, FileDown, UploadCloud, Send, Table as TableIcon, Loader2, ChevronLeft, ChevronRight, Play, X, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DashboardStats from '@/components/DashboardStats';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { toast } from 'sonner';

const mockArchives = [
  { id: 'DOC-112', instansi: 'Pemkot Palu', type: 'MoU & NDA', date: '01 Mei 2024', url: '#' },
  { id: 'DOC-112-BAST', instansi: 'Pemkot Palu', type: 'BAST', date: '02 Mei 2024', url: '#' },
  { id: 'DOC-455', instansi: 'Pemkab Donggala', type: 'MoU & NDA', date: '03 Mei 2024', url: '#' },
  { id: 'DOC-455-BAST', instansi: 'Pemkab Donggala', type: 'BAST', date: '05 Mei 2024', url: '#' },
  { id: 'DOC-889', instansi: 'Pemprov Sulteng', type: 'MoU & NDA', date: '10 Mei 2024', url: '#' },
];

const chartData = [
  { name: 'Jan', volume: 4000 },
  { name: 'Feb', volume: 3000 },
  { name: 'Mar', volume: 2000 },
  { name: 'Apr', volume: 2780 },
  { name: 'Mei', volume: 1890 },
  { name: 'Jun', volume: 2390 },
  { name: 'Jul', volume: 3490 },
];

const activityLogs = [
  { id: 1, time: '2 mnt lalu', text: 'Pemkot Palu mengunggah 1.254 data sasaran', status: 'upload' },
  { id: 2, time: '10 mnt lalu', text: 'Pra-Validasi selesai untuk Pemkab Sigi', status: 'valid' },
  { id: 3, time: '1 jam lalu', text: 'Admin menyetujui BAST Kota Palu', status: 'approve' },
  { id: 4, time: '2 jam lalu', text: 'Pemkab Donggala mengajukan MoU baru', status: 'upload' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'submissions' | 'archives' | 'requests' | 'results'>('submissions');
  const [mounted, setMounted] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [avgMatch, setAvgMatch] = useState(0);
  const [dynamicLogs, setDynamicLogs] = useState<any[]>([]);
  const [dynamicChartData, setDynamicChartData] = useState(chartData);
  const [dynamicRegions, setDynamicRegions] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [isSendingMissing, setIsSendingMissing] = useState(false);
  const [missingInstansi, setMissingInstansi] = useState("");


  // Excel Table States
  const [excelType, setExcelType] = useState<'desil' | 'v4'>('desil');
  const [excelData, setExcelData] = useState<{headers: string[], rows: any[], total: number, page: number, totalPages: number} | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelPage, setExcelPage] = useState(1);

  const fetchExcelData = async (type: 'desil' | 'v4', page: number) => {
    setExcelLoading(true);
    try {
      const res = await fetch(`/api/admin/excel-data?type=${type}&page=${page}&limit=50`);
      const json = await res.json();
      if (json.success) {
        setExcelData(json.data);
      } else {
        toast.error(json.message);
      }
    } catch (e) {
      toast.error('Gagal mengambil data Excel');
    } finally {
      setExcelLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'results' && user?.role === 'BPS_ADMIN') {
      fetchExcelData(excelType, excelPage);
    }
  }, [activeTab, excelType, excelPage, user]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions?limit=100');
      const json = await res.json();
      if (json.success) {
        setSubmissions(json.data);
        
        let total = 0;
        let matchScores = 0;
        let matchCount = 0;
        const logs: any[] = [];
        
        json.data.forEach((sub: any, i: number) => {
          total += sub.total_rows || 0;
          if (sub.matching_stats && sub.matching_stats.avg_score) {
            matchScores += sub.matching_stats.avg_score;
            matchCount++;
          }
          if (i < 5) {
            logs.push({
              id: sub.id,
              time: new Date(sub.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
              text: `${sub.user?.instansi || 'Instansi Daerah'} ${sub.status === 'PENDING' ? 'mengajukan' : 'berstatus ' + sub.status} ${sub.file_name}`,
              status: sub.status === 'PENDING' ? 'upload' : sub.status === 'COMPLETED' ? 'approve' : 'valid'
            });
          }
        });
        
        setTotalRecords(total);
        setAvgMatch(matchCount > 0 ? Math.round(matchScores / matchCount) : 0);
        setDynamicLogs(logs);

        // Update Chart Data: Add total to the last month (Jul -> Sep)
        const newChartData = [...chartData];
        newChartData[newChartData.length - 1] = {
          name: 'Sekarang', 
          volume: newChartData[newChartData.length - 1].volume + total
        };
        setDynamicChartData(newChartData);

        // Update Regions Data (Top 3)
        const regionMap = new Map<string, { totalSLA: number, count: number }>();
        json.data.forEach((sub: any) => {
          const instansi = sub.user?.instansi || 'Instansi Lain';
          let slaScore = 0;
          if (sub.status === 'PENDING') slaScore = 25;
          if (sub.status === 'VALIDATED') slaScore = 50;
          if (sub.status === 'MATCHING') slaScore = 75;
          if (sub.status === 'COMPLETED') slaScore = 100;
          
          if (!regionMap.has(instansi)) {
            regionMap.set(instansi, { totalSLA: 0, count: 0 });
          }
          const curr = regionMap.get(instansi)!;
          curr.totalSLA += slaScore;
          curr.count += 1;
        });

        const sortedRegions = Array.from(regionMap.entries())
          .map(([name, data]) => ({
            name,
            progress: Math.round(data.totalSLA / data.count)
          }))
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3);
        
        // Fallback if empty
        if (sortedRegions.length === 0) {
           sortedRegions.push({ name: 'Belum Ada Data', progress: 0 });
        }
        setDynamicRegions(sortedRegions);

        
        if (selectedSubmission) {
          const updated = json.data.find((s: any) => s.id === selectedSubmission.id);
          if (updated) setSelectedSubmission(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setProcessingId(id);
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      }).then(r => r.json());
      
      if (res.success) {
        fetchSubmissions();
        toast.success(`Status diubah ke ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui status');
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (user && (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) {
      router.push('/');
    } else if (user && (user.role === 'BPS_ADMIN' || user.role === 'BPS_PEGAWAI')) {
      fetchSubmissions();
    }
  }, [user, router]);

  const handleVerify = async (id: number) => {
    setVerifyingId(id);
    toast.info('Memulai verifikasi...');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Verifikasi Selesai: ${data.stats?.padan} EXACT_MATCH, ${data.stats?.anomali} PROBABLE_MATCH dari total ${data.stats?.totalDiproses} data.`);
        fetchSubmissions();
      } else {
        toast.error(data.message || 'Gagal memverifikasi');
      }
    } catch (e) {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setVerifyingId(null);
    }
  };

  if (!mounted || !user || (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. System Health Indicators */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <Server className="w-3.5 h-3.5 text-success" />
          API DTSEN: <span className="text-success ml-1">Connected (24ms)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <HardDrive className="w-3.5 h-3.5 text-amber-500" />
          Storage: <span className="text-amber-600 ml-1">72% Terpakai</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          Enkripsi Data: <span className="text-blue-600 ml-1">Aktif</span>
        </div>
      </div>

      <DashboardStats />

      {/* 2 & 3. Grid: Chart + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Traffic Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Tren Volume Pemadanan
              </h3>
              <p className="text-xs text-muted mt-1">Lalu lintas data sasaran masuk (YTD)</p>
            </div>
            <div className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-bold border border-blue-200 dark:border-blue-800 animate-pulse">
              Live
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--fallback-b1,rgba(255,255,255,0.9))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-1">Log Aktivitas</h3>
          <p className="text-xs text-muted mb-6">Real-time system feed</p>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2">
            {dynamicLogs.map((log) => (
              <div key={log.id} className="relative pl-6">
                <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${log.status === 'upload' ? 'bg-blue-500' : log.status === 'valid' ? 'bg-success' : 'bg-amber-500'}`}></div>
                <div className="absolute left-[3px] top-4 bottom-[-16px] w-[2px] bg-slate-200 dark:bg-slate-700"></div>
                <p className="text-sm font-semibold text-foreground leading-tight">{log.text}</p>
                <p className="text-xs text-muted mt-1">{log.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Regional Leaderboard */}
      <div className="glass rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-500" /> Progres Pemadanan Wilayah (Top 3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dynamicRegions.map((region, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>{region.name}</span>
                <span>{region.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-blue-500' : 'bg-blue-400'}`} 
                  style={{ width: `${region.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 4.5. Submissions Table Preview */}
      <div className="glass rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[400px]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Pratinjau Daftar Pengajuan Masuk
            </h3>
            <p className="text-xs text-muted mt-1">Status tiket pengajuan data dari instansi daerah</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 relative">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Loader2 className="w-8 h-8 mb-4 animate-spin" />
               <p>Memuat antrean...</p>
             </div>
          ) : submissions.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <FileText className="w-12 h-12 mb-4 opacity-50" />
               <p>Belum ada pengajuan masuk.</p>
             </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-0 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">ID Tiket</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">Instansi Pengirim</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">Berkas Data</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">Status Terkini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {submissions.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 font-bold font-mono">
                      {sub.id}
                    </td>
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                      {sub.user?.instansi || 'Instansi Daerah'}
                    </td>
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-4 h-4 text-blue-500" />
                        {sub.file_name}
                      </div>
                    </td>
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${sub.status === 'COMPLETED' ? 'bg-success/20 text-success-dark' : sub.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {sub.status === 'COMPLETED' ? 'SELESAI (PADAN)' : sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
          <div className="text-sm text-slate-500 font-medium">
            Menampilkan 5 pengajuan terbaru
          </div>
          <a href="/admin/submissions" className="text-xs font-bold text-blue-600 hover:underline">Kelola Semua Pengajuan ↗</a>
        </div>
      </div>

      {/* 5. Table Preview */}
      <div className="glass rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-blue-500" /> Pratinjau Data Hasil Analisis
            </h3>
            <p className="text-xs text-muted mt-1">Live data dari tabel matching_results</p>
          </div>
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => { setExcelType('desil'); setExcelPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${excelType === 'desil' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Cek Desil All
            </button>
            <button
              onClick={() => { setExcelType('v4'); setExcelPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${excelType === 'v4' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Pemadanan V4
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 relative">
          {excelLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          )}
          
          {!excelData ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <Database className="w-12 h-12 mb-4 opacity-50" />
               <p>Memuat data...</p>
             </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-0 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">No.</th>
                  {excelData.headers.map((h, i) => (
                    <th key={i} className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {excelData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-500 font-mono">
                      {(excelPage - 1) * 50 + i + 1}
                    </td>
                    {excelData.headers.map((h, j) => (
                      <td key={j} className="px-6 py-3 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                        {row[h] !== null && row[h] !== undefined ? (
                          h === 'Status Padan' ? (
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${row[h] === 'EXACT_MATCH' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {row[h]}
                            </span>
                          ) : (
                            String(row[h])
                          )
                        ) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                {excelData.rows.length === 0 && (
                  <tr>
                    <td colSpan={excelData.headers.length + 1} className="px-6 py-16 text-center text-slate-500 font-medium">
                      Data kosong atau tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {excelData && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
            <div className="text-sm text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-700 dark:text-slate-300">{(excelPage - 1) * 50 + 1}-{Math.min(excelPage * 50, excelData.total)}</strong> dari <strong className="text-slate-700 dark:text-slate-300">{excelData.total.toLocaleString('id-ID')}</strong> baris
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin/analysis" className="text-xs font-bold text-blue-600 hover:underline">Buka Layar Penuh ↗</a>
              <div className="flex gap-2">
                <button 
                  disabled={excelPage <= 1}
                  onClick={() => setExcelPage(p => Math.max(1, p - 1))}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button 
                  disabled={excelPage >= excelData.totalPages}
                  onClick={() => setExcelPage(p => Math.min(excelData.totalPages, p + 1))}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 disabled:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}