"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Clock, ShieldCheck, Database, FolderArchive, Activity, Server, HardDrive, MapPin, FileDown, UploadCloud, Send, Table as TableIcon, Loader2, ChevronLeft, ChevronRight, Play, X, User } from 'lucide-react';
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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);


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
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Kota Palu</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Kab. Donggala</span>
              <span>60%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Kab. Sigi</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation & Submissions Table */}
      <div className="pt-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-max mb-6">
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'submissions' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Database className="w-4 h-4" /> Daftar Pengajuan Masuk
          </button>
          <button 
            onClick={() => setActiveTab('archives')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'archives' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <FolderArchive className="w-4 h-4" /> Arsip Dokumen Digital
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <FileDown className="w-4 h-4" /> Permintaan Missing NIK
          </button>
          {user?.role === 'BPS_ADMIN' && (
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'results' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <TableIcon className="w-4 h-4" /> Tabel Hasil Analisis
            </button>
          )}
        </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'submissions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">ID Pengajuan</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Instansi Pengirim</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Deskripsi Data</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Status Verifikasi</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8">Memuat data...</td></tr>
                  ) : submissions.map((sub) => (
                    <tr key={sub.id} onClick={() => setSelectedSubmission(sub)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-blue-600 dark:text-blue-400">REQ-{sub.id}</span>
                        <p className="text-xs text-slate-500 mt-1">{new Date(sub.created_at).toLocaleDateString('id-ID')}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {sub.user?.instansi || sub.user?.name}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700 dark:text-slate-300">{sub.file_name}</p>
                        <p className="text-xs text-slate-500 mt-1">{sub.total_rows?.toLocaleString() || 0} Records</p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" /> Menunggu Verifikasi
                          </span>
                        ) : sub.status === 'MATCHING' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 animate-pulse">
                            <Clock className="w-3 h-3 animate-spin" /> Memproses...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Terverifikasi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedSubmission(sub); }}
                            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4" /> Lihat Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'archives' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-blue-600" /> Rekapitulasi Dokumen Administratif
              </h3>
              <p className="text-sm text-slate-500 mt-1">Daftar tautan dokumen legal (MoU, NDA, BAST) dan Manifes dari setiap instansi yang telah mengajukan pemadanan.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">ID Referensi</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Instansi</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Jenis Dokumen</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Tanggal Arsip</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Tautan Unduh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockArchives.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                        {doc.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {doc.instansi}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          doc.type === 'BAST' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {doc.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a href={doc.url} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
                          <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-blue-600" /> Form Permintaan Kelengkapan Data (Missing NIK)
            </h3>
            <p className="text-sm text-slate-500 mb-6">Kirimkan format dokumen untuk dilengkapi oleh instansi daerah terkait daftar NIK yang belum ditemukan/valid dari hasil pra-validasi sebelumnya.</p>
            
            <div className="max-w-2xl bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Instansi Tujuan</label>
                <select className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-300">
                  <option value="">-- Pilih Instansi Daerah --</option>
                  <option value="palu">Dinas Sosial Kota Palu</option>
                  <option value="sigi">Dinas Sosial Kab. Sigi</option>
                  <option value="donggala">Dinas Sosial Kab. Donggala</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Unggah Format Template (Cth: Missing NIK.xlsx)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                   <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                   <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Klik atau drag file template format kemari</p>
                   <p className="text-xs text-slate-500 mt-1">Format didukung: .xlsx, .csv</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px] text-slate-700 dark:text-slate-300" placeholder="Mohon lengkapi NIK warga yang kosong sesuai format terlampir..."></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => toast.success('Permintaan kelengkapan data berhasil dikirim ke instansi terkait!')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Kirim Permintaan Ke Pemda
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && user?.role === 'BPS_ADMIN' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-blue-600" /> Data Hasil Analisis & Pemadanan
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pembacaan dinamis langsung dari file Excel master.</p>
              </div>
              
              <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { setExcelType('desil'); setExcelPage(1); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${excelType === 'desil' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Cek Desil All
                </button>
                <button
                  onClick={() => { setExcelType('v4'); setExcelPage(1); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${excelType === 'v4' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Pemadanan V4
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 relative">
              {excelLoading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
              
              {!excelData ? null : (
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-0">
                    <tr>
                      <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">No.</th>
                      {excelData.headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {excelData.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50 text-slate-400 text-[10px]">
                          {(excelPage - 1) * 50 + i + 1}
                        </td>
                        {excelData.headers.map((h, j) => (
                          <td key={j} className="px-4 py-2 border-r border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                            {row[h] !== null && row[h] !== undefined ? String(row[h]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {excelData.rows.length === 0 && (
                      <tr>
                        <td colSpan={excelData.headers.length + 1} className="px-4 py-12 text-center text-slate-500">
                          Data kosong atau tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {excelData && (
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                <span className="text-xs font-medium text-slate-500">
                  Menampilkan {(excelPage - 1) * 50 + 1}-{Math.min(excelPage * 50, excelData.total)} dari {excelData.total.toLocaleString('id-ID')} baris
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={excelPage <= 1}
                    onClick={() => setExcelPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={excelPage >= excelData.totalPages}
                    onClick={() => setExcelPage(p => Math.min(excelData.totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
      </div>

      {/* Slide-over Detail Sidebar */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Detail Pengajuan
                </h2>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Info Utama */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ID Tiket</p>
                    <div className="font-mono text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">REQ-{selectedSubmission.id}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pengirim</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <User className="w-4 h-4 text-slate-400" /> {selectedSubmission.user?.instansi || 'Instansi Daerah'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Clock className="w-4 h-4 text-slate-400" /> {new Date(selectedSubmission.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Berkas Data Sasaran</p>
                    <div className="text-sm font-bold text-slate-900 dark:text-white bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        {selectedSubmission.file_name}
                      </div>
                      <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 shadow-sm">{selectedSubmission.total_rows?.toLocaleString() || 0} Baris</span>
                    </div>
                  </div>
                </div>

                {/* Status SLA Timeline */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">SLA Timeline</h3>
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-slate-900">
                        <CheckCircle className="w-2 h-2 text-white" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Pengajuan Data</p>
                      <p className="text-xs text-slate-500">SLA: 1 Hari Kerja</p>
                    </div>
                    <div className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ${selectedSubmission.status !== 'PENDING' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}>
                        {selectedSubmission.status !== 'PENDING' ? <CheckCircle className="w-2 h-2 text-white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <p className={`text-sm font-bold ${selectedSubmission.status !== 'PENDING' ? 'text-slate-900 dark:text-white' : 'text-amber-600 dark:text-amber-400'}`}>Cek Variabel (Sistem)</p>
                      <p className="text-xs text-slate-500">SLA: 1-2 Hari Kerja</p>
                    </div>
                    <div className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ${['MATCHING', 'COMPLETED'].includes(selectedSubmission.status) ? (selectedSubmission.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse') : 'bg-slate-200 dark:bg-slate-700'}`}>
                        {selectedSubmission.status === 'COMPLETED' ? <CheckCircle className="w-2 h-2 text-white" /> : ['MATCHING'].includes(selectedSubmission.status) ? <div className="w-1.5 h-1.5 bg-white rounded-full"></div> : null}
                      </div>
                      <p className={`text-sm font-bold ${['MATCHING', 'COMPLETED'].includes(selectedSubmission.status) ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Proses Matching Lokal</p>
                      <p className="text-xs text-slate-500">SLA: 3-5 Hari Kerja</p>
                    </div>
                    <div className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ${selectedSubmission.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        {selectedSubmission.status === 'COMPLETED' && <CheckCircle className="w-2 h-2 text-white" />}
                      </div>
                      <p className={`text-sm font-bold ${selectedSubmission.status === 'COMPLETED' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Serah Terima Data</p>
                      <p className="text-xs text-slate-500">SLA: 1 Hari Kerja</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                {selectedSubmission.status === 'PENDING' && (
                  <button 
                    onClick={() => updateStatus(selectedSubmission.id, 'VALIDATED')}
                    disabled={processingId === selectedSubmission.id}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-5 h-5" /> Approve Cek Sistem
                  </button>
                )}
                {selectedSubmission.status === 'VALIDATED' && (
                  <button 
                    onClick={() => updateStatus(selectedSubmission.id, 'MATCHING')}
                    disabled={processingId === selectedSubmission.id}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-5 h-5" /> Mulai Matching Lokal
                  </button>
                )}
                {selectedSubmission.status === 'MATCHING' && (
                  <button 
                    onClick={() => updateStatus(selectedSubmission.id, 'COMPLETED')}
                    disabled={processingId === selectedSubmission.id}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" /> Selesaikan Pemadanan
                  </button>
                )}
                {selectedSubmission.status === 'COMPLETED' && (
                  <div className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold border border-emerald-200 dark:border-emerald-800 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> SLA Selesai (Menunggu BAST Pemda)
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
