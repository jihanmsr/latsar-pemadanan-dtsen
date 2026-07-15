"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Clock, ShieldCheck, Database, FolderArchive } from 'lucide-react';
import DashboardStats from '@/components/DashboardStats';

import { toast } from 'sonner';

const mockArchives = [
  { id: 'DOC-112', instansi: 'Pemkot Palu', type: 'MoU & NDA', date: '01 Mei 2024', url: '#' },
  { id: 'DOC-112-BAST', instansi: 'Pemkot Palu', type: 'BAST', date: '02 Mei 2024', url: '#' },
  { id: 'DOC-455', instansi: 'Pemkab Donggala', type: 'MoU & NDA', date: '03 Mei 2024', url: '#' },
  { id: 'DOC-455-BAST', instansi: 'Pemkab Donggala', type: 'BAST', date: '05 Mei 2024', url: '#' },
  { id: 'DOC-889', instansi: 'Pemprov Sulteng', type: 'MoU & NDA', date: '10 Mei 2024', url: '#' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'submissions' | 'archives'>('submissions');
  const [mounted, setMounted] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const json = await res.json();
      if (json.success) {
        setSubmissions(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (user && user.role !== 'BPS_ADMIN') {
      router.push('/');
    } else if (user && user.role === 'BPS_ADMIN') {
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
        toast.success(`Verifikasi Selesai: ${data.valid_rows} dari ${data.total_rows} data valid.`);
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

  if (!mounted || !user || user.role !== 'BPS_ADMIN') return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Dashboard Admin BPS</h2>
          <p className="text-slate-600 dark:text-slate-400">Pusat kendali verifikasi pengajuan dan arsip digital pemadanan data.</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
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
        </div>
      </div>

      <DashboardStats />

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
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
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
                          <button className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Lihat Detail">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Unduh Manifes BPS">
                            <Download className="w-4 h-4" />
                          </button>
                          {sub.status === 'PENDING' && (
                            <button 
                              onClick={() => handleVerify(sub.id)}
                              disabled={verifyingId === sub.id}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> 
                              {verifyingId === sub.id ? 'Memproses...' : 'Verifikasi'}
                            </button>
                          )}
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
      </motion.div>
    </div>
  );
}
