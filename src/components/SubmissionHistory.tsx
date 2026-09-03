"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, FileText, CheckCircle2, Clock, AlertTriangle, FileCheck, RefreshCw, Eye, Download } from 'lucide-react';
import Link from 'next/link';

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/submissions?limit=10');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Menunggu</span>;
      case 'VALIDATED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 w-fit"><FileCheck className="w-3 h-3" /> Valid</span>;
      case 'MATCHING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 w-fit"><RefreshCw className="w-3 h-3 animate-spin" /> Proses</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      case 'FAILED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Gagal</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800/50 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Riwayat Pengajuan Data
          </h2>
          <p className="text-xs text-slate-500 mt-1">Daftar seluruh file pengajuan yang pernah Anda unggah beserta status terkininya.</p>
        </div>
        <button 
          onClick={fetchSubmissions}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">ID TIKET</th>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">TANGGAL</th>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">NAMA FILE</th>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">BARIS</th>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap">STATUS</th>
              <th className="px-4 py-3 text-slate-600 dark:text-slate-300 font-bold whitespace-nowrap text-right">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Memuat data...
                  </div>
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                  Belum ada riwayat pengajuan.
                </td>
              </tr>
            ) : (
              submissions.map((sub, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={sub.id} 
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">
                    {sub.id}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate" title={sub.file_name}>{sub.file_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                    {sub.total_rows?.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link href={`/tracking?id=${sub.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Lihat Progres">
                        <Eye className="w-4 h-4" />
                      </Link>
                      {sub.status === 'COMPLETED' && (
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Unduh Hasil & BAST">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
