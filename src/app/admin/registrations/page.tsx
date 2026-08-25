"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, FileCheck2, Loader2, CheckCircle2, XCircle, Search, FileText, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRegistrationsPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    id: string;
    instansiName: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = async () => {
    if (!actionModal) return;
    const { id, type } = actionModal;
    const reason = type === "reject" ? rejectReason : undefined;
    
    setProcessingId(id);
    setActionModal(null);
    setRejectReason("");
    
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: type, reason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchRegistrations();
      } else {
        toast.error(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal terhubung ke server.");
    } finally {
      setProcessingId(null);
    }
  };

  if ((user?.role !== 'BPS_ADMIN')) {
    return <div className="p-8 text-center">Akses Ditolak. Halaman ini hanya untuk Admin BPS.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                Verifikasi Instansi
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Kelola pengajuan pendaftaran akun instansi (Pemda) baru.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Instansi</th>
                    <th className="px-6 py-4">Narahubung</th>
                    <th className="px-6 py-4">Dokumen</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                        Memuat data pendaftaran...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        Belum ada pengajuan pendaftaran.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {new Date(reg.created_at).toLocaleDateString("id-ID", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white mb-0.5">{reg.nama_instansi}</div>
                          <div className="text-xs text-slate-500 uppercase">{reg.kategori_instansi}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-800 dark:text-slate-200">{reg.nama_narahubung}</div>
                          <div className="text-xs text-slate-500">{reg.no_hp_narahubung}</div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedPdfUrl(reg.surat_permohonan_path)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors text-xs font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Lihat PDF
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {reg.status === "PENDING" && (
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              PENDING
                            </span>
                          )}
                          {reg.status === "APPROVED" && (
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              DISETUJUI
                            </span>
                          )}
                          {reg.status === "REJECTED" && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                DITOLAK
                              </span>
                              {reg.alasan_penolakan && (
                                <span className="text-[10px] text-rose-500 max-w-[150px] truncate" title={reg.alasan_penolakan}>
                                  Alasan: {reg.alasan_penolakan}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {reg.status === "PENDING" && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setActionModal({ isOpen: true, type: "reject", id: reg.id, instansiName: reg.nama_instansi })}
                                disabled={processingId === reg.id}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Tolak"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setActionModal({ isOpen: true, type: "approve", id: reg.id, instansiName: reg.nama_instansi })}
                                disabled={processingId === reg.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                              >
                                {processingId === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Setujui
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {selectedPdfUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPdfUrl(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ height: '85vh' }}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Pratinjau Dokumen
                </h3>
                <button 
                  onClick={() => setSelectedPdfUrl(null)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 p-2 sm:p-4">
                <iframe 
                  src={selectedPdfUrl} 
                  className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Modal (Approve / Reject) */}
      <AnimatePresence>
        {actionModal && actionModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActionModal(null);
                setRejectReason("");
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${actionModal.type === 'approve' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-500'}`}>
                  {actionModal.type === 'approve' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {actionModal.type === 'approve' ? 'Setujui Pendaftaran' : 'Tolak Pendaftaran'}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Instansi: {actionModal.instansiName}</p>
                </div>
              </div>
              
              <div className="mb-6">
                {actionModal.type === 'approve' ? (
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Apakah Anda yakin ingin <strong>MENYETUJUI</strong> pendaftaran akun untuk instansi ini? Pemohon akan dapat langsung login dan memadankan data.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Silakan masukkan alasan penolakan. Alasan ini akan mempermudah instansi terkait untuk memperbaiki dokumen pendaftaran.
                    </p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Surat permohonan kurang tanda tangan kepala dinas..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none h-24"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setActionModal(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 font-bold text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={executeAction}
                  disabled={actionModal.type === 'reject' && !rejectReason.trim()}
                  className={`px-4 py-2 font-bold text-sm text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    actionModal.type === 'approve' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionModal.type === 'approve' ? 'Ya, Setujui' : 'Tolak Pendaftaran'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
