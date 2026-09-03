"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileText, CheckCircle, CheckCircle2, Clock, MapPin, X, User, TableIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (user && (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) {
      router.push('/');
    } else if (user && (user.role === 'BPS_ADMIN' || user.role === 'BPS_PEGAWAI')) {
      fetchSubmissions();
    }
  }, [user, router]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions?limit=100');
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    toast.info(`Memproses perubahan status...`);
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchSubmissions();
        toast.success(`Status berhasil diubah ke ${newStatus}`);
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Gagal memperbarui status');
    } finally {
      setProcessingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 space-y-8 font-sans pb-32">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" /> Daftar Pengajuan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Lihat seluruh data sasaran yang masuk dan pantau tahapan pemadanan secara utuh.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Belum ada pengajuan masuk.</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">ID Tiket</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Instansi Pengirim</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Waktu Masuk</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">File Data Sasaran</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Status Tahapan</th>
                  <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map((sub: any) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedSubmission(sub)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                      REQ-{sub.id.substring(0,6)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {sub.user?.instansi || 'Instansi Daerah'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{sub.file_name}</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{sub.total_rows} baris</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        sub.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        sub.status === 'VALIDATED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        sub.status === 'MATCHING' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        sub.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {sub.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {sub.status !== 'PENDING' && <CheckCircle className="w-3.5 h-3.5" />}
                        {sub.status === 'PENDING' ? 'Menunggu Review' : sub.status === 'VALIDATED' ? 'Pengecekan Variabel' : sub.status === 'MATCHING' ? 'Proses Padan Lokal' : sub.status === 'COMPLETED' ? 'Selesai (Menunggu BAST)' : sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedSubmission(sub); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slide-over Sidebar Detail Pengajuan */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={() => setSelectedSubmission(null)}
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Detail Pengajuan
                </h2>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
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
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dokumen yang Diunggah (Lengkap)</p>
                    
                    <div className="space-y-3">
                      {/* MoU */}
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">MoU Pemadanan.pdf</p>
                            <p className="text-xs text-slate-500">Telah ditandatangani Kepala Dinas</p>
                          </div>
                        </div>
                        <button onClick={() => toast.info('Preview Dokumen MoU Pemadanan dibuka')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Lihat</button>
                      </div>

                      {/* Manifest */}
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Manifes_Data_Sistem.pdf</p>
                            <p className="text-xs text-slate-500">Log metadata sistem</p>
                          </div>
                        </div>
                        <button onClick={() => toast.info('Preview Dokumen Manifes Sistem dibuka')} className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Lihat</button>
                      </div>

                      {/* Data Sasaran */}
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                              <Database className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedSubmission.file_name}</p>
                              <p className="text-xs text-slate-500">Data Sasaran Terstruktur</p>
                            </div>
                          </div>
                          <span className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 font-bold shadow-sm">{selectedSubmission.total_rows?.toLocaleString() || 0} Baris</span>
                        </div>
                        <button 
                          onClick={() => setShowDataPreview(true)}
                          className="w-full py-2 bg-white hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/50 text-blue-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-800 shadow-sm"
                        >
                          <TableIcon className="w-4 h-4" /> Lihat Pratinjau Data Sasaran
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">SLA Timeline</h3>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        ['PENDING','VALIDATED','MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-200 border-slate-300'
                      }`}>
                        {['PENDING','VALIDATED','MATCHING','COMPLETED'].includes(selectedSubmission.status) ? <CheckCircle className="w-2 h-2 text-white" /> : <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <h4 className={`text-sm font-bold ${['PENDING','VALIDATED','MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Pengajuan Data</h4>
                      <p className="text-xs text-slate-500">SLA: 1 Hari Kerja</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        ['VALIDATED','MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'bg-emerald-500 border-emerald-500' : selectedSubmission.status === 'PENDING' ? 'bg-white border-amber-500' : 'bg-slate-200 border-slate-300'
                      }`}>
                        {selectedSubmission.status !== 'PENDING' ? <CheckCircle className="w-2 h-2 text-white" /> : <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-auto mt-[1px]"></div>}
                      </div>
                      <h4 className={`text-sm font-bold ${['VALIDATED','MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'text-slate-900 dark:text-white' : selectedSubmission.status === 'PENDING' ? 'text-amber-600' : 'text-slate-400'}`}>Cek Variabel (Sistem)</h4>
                      <p className="text-xs text-slate-500">SLA: 1-2 Hari Kerja</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        ['MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'bg-emerald-500 border-emerald-500' : selectedSubmission.status === 'VALIDATED' ? 'bg-white border-blue-500' : 'bg-slate-200 border-slate-300'
                      }`}>
                        {selectedSubmission.status === 'COMPLETED' ? <CheckCircle className="w-2 h-2 text-white" /> : ['MATCHING', 'VALIDATED'].includes(selectedSubmission.status) ? <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-[1px]"></div> : null}
                      </div>
                      <h4 className={`text-sm font-bold ${['MATCHING','COMPLETED'].includes(selectedSubmission.status) ? 'text-slate-900 dark:text-white' : selectedSubmission.status === 'VALIDATED' ? 'text-blue-600' : 'text-slate-400'}`}>Proses Matching Lokal</h4>
                      <p className="text-xs text-slate-500">SLA: 3-5 Hari Kerja</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        selectedSubmission.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500' : selectedSubmission.status === 'MATCHING' ? 'bg-white border-purple-500' : 'bg-slate-200 border-slate-300'
                      }`}>
                        {selectedSubmission.status === 'COMPLETED' && <CheckCircle className="w-2 h-2 text-white" />}
                      </div>
                      <h4 className={`text-sm font-bold ${selectedSubmission.status === 'COMPLETED' ? 'text-emerald-600' : selectedSubmission.status === 'MATCHING' ? 'text-purple-600' : 'text-slate-400'}`}>Serah Terima Data</h4>
                      <p className="text-xs text-slate-500">SLA: 1 Hari Kerja</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                {selectedSubmission.status === 'PENDING' && (
                  <button 
                    disabled={processingId === selectedSubmission.id}
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'VALIDATED')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve Cek Sistem
                  </button>
                )}
                {selectedSubmission.status === 'VALIDATED' && (
                  <button 
                    disabled={processingId === selectedSubmission.id}
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'MATCHING')}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Database className="w-5 h-5" /> Mulai Matching
                  </button>
                )}
                {selectedSubmission.status === 'MATCHING' && (
                  <button 
                    disabled={processingId === selectedSubmission.id}
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'COMPLETED')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Selesaikan Pemadanan
                  </button>
                )}
                {selectedSubmission.status === 'COMPLETED' && (
                  <div className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 font-bold rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> SLA Selesai (Menunggu BAST Pemda)
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Preview Data */}
      <AnimatePresence>
        {showDataPreview && selectedSubmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowDataPreview(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" /> Pratinjau Data Sasaran
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">File: {selectedSubmission.file_name} • {selectedSubmission.total_rows?.toLocaleString()} Baris</p>
                </div>
                <button 
                  onClick={() => setShowDataPreview(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-0 bg-white dark:bg-slate-900">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">No.</th>
                      <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">NIK Sasaran</th>
                      <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Nama Lengkap</th>
                      <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Alamat</th>
                      <th className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Desa/Kelurahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-3 text-slate-500">{i + 1}</td>
                        <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400">7201{Math.floor(100000000000 + Math.random() * 90000000000)}</td>
                        <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Warga Sasaran {i + 1}</td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-400">Jl. Pahlawan No. {Math.floor(Math.random() * 100)}</td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-400">Balaroa</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
                <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
                  <Database className="w-3 h-3" /> Menampilkan 15 baris pertama sebagai pratinjau (Preview).
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}