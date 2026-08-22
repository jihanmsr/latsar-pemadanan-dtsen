"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, FileCheck2, Loader2, CheckCircle2, XCircle, Search, FileText } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AdminRegistrationsPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (!confirm(`Anda yakin ingin ${action === "approve" ? "MENYETUJUI" : "MENOLAK"} permohonan ini?`)) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchRegistrations();
      } else {
        alert(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server.");
    } finally {
      setProcessingId(null);
    }
  };

  if (user?.role !== "bps" && user?.role !== "admin") {
    return <div className="p-8 text-center">Akses Ditolak. Halaman ini hanya untuk Admin BPS.</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                Verifikasi Instansi
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Kelola pengajuan pendaftaran akun instansi (K/L/D) baru.
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
                          <a 
                            href={reg.surat_permohonan_path} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors text-xs font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Lihat PDF
                          </a>
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
                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                              DITOLAK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {reg.status === "PENDING" && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleAction(reg.id, "reject")}
                                disabled={processingId === reg.id}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Tolak"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleAction(reg.id, "approve")}
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

        </div>
      </main>
    </div>
  );
}
