"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Clock, CheckCircle2, XCircle, Building2, Calendar, FileText, ArrowLeft } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';
import Link from 'next/link';

type StatusData = {
  id: string;
  nama_instansi: string;
  kategori_instansi: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  alasan_penolakan: string | null;
  created_at: string;
};

export default function CekStatusPage() {
  const [ticketId, setTicketId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/cek-status?id=${encodeURIComponent(ticketId.trim())}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Tiket tidak ditemukan. Pastikan ID Tiket sudah benar.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          border: 'border-amber-200 dark:border-amber-800',
          icon: <Clock className="w-8 h-8" />,
          title: 'Menunggu Verifikasi',
          desc: 'Pengajuan Anda sedang dalam antrean untuk diverifikasi oleh tim kami.'
        };
      case 'APPROVED':
        return {
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-8 h-8" />,
          title: 'Disetujui',
          desc: 'Pengajuan disetujui. Akun dan instruksi selanjutnya telah dikirim ke email narahubung.'
        };
      case 'REJECTED':
        return {
          color: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-rose-100 dark:bg-rose-900/30',
          border: 'border-rose-200 dark:border-rose-800',
          icon: <XCircle className="w-8 h-8" />,
          title: 'Ditolak',
          desc: 'Pengajuan ditolak. Silakan lihat alasan penolakan di bawah ini.'
        };
      default:
        return {
          color: 'text-slate-600 dark:text-slate-400',
          bg: 'bg-slate-100 dark:bg-slate-800',
          border: 'border-slate-200 dark:border-slate-700',
          icon: <FileText className="w-8 h-8" />,
          title: 'Status Tidak Diketahui',
          desc: 'Terdapat kesalahan dalam membaca status.'
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      <div className="flex-1 flex flex-col items-center pt-10 px-4 pb-20">
        
        <div className="w-full max-w-2xl mb-8 flex items-center gap-2">
          <Link href="/" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cek Status Pengajuan</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Lacak proses verifikasi akun instansi Anda menggunakan Nomor Tiket.</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Masukkan Nomor Tiket (Contoh: 550e8400-e29b-41d4-a716-446655440000)"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !ticketId.trim()}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek Status'}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium flex items-start gap-3"
            >
              <XCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 space-y-6"
            >
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              
              {/* Status Card */}
              {(() => {
                const display = getStatusDisplay(result.status);
                return (
                  <div className={`p-6 rounded-2xl border ${display.bg} ${display.border} flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left`}>
                    <div className={`p-3 rounded-full bg-white dark:bg-slate-950 shadow-sm ${display.color}`}>
                      {display.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-black mb-1 ${display.color}`}>{display.title}</h3>
                      <p className={`text-sm font-medium opacity-80 ${display.color}`}>{display.desc}</p>
                      
                      {result.status === 'REJECTED' && result.alasan_penolakan && (
                        <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-rose-200/50 dark:border-rose-800/50 text-left">
                          <p className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">Catatan Evaluasi:</p>
                          <p className="text-sm text-rose-900 dark:text-rose-200">{result.alasan_penolakan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Instansi</p>
                    <p className="font-bold text-slate-900 dark:text-white">{result.nama_instansi}</p>
                    <p className="text-sm font-medium text-slate-500">{result.kategori_instansi}</p>
                  </div>
                </div>
                
                <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Tanggal Pengajuan</p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {new Date(result.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm font-medium text-slate-500">
                      {new Date(result.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit', minute: '2-digit'
                      })} WIB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
