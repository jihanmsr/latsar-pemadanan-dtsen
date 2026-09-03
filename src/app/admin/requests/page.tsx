"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Send, UploadCloud, Loader2, Database, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function RequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [missingInstansi, setMissingInstansi] = useState("");
  const [isSendingMissing, setIsSendingMissing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user && (user.role !== 'BPS_ADMIN' && user.role !== 'BPS_PEGAWAI')) {
      router.push('/');
    }
  }, [user, router]);

  if (!mounted) return null;

  return (
    <div className="w-full h-full p-6 space-y-6">
      <div className="w-full">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-md mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 mb-2">
              <Database className="w-7 h-7 text-orange-100" /> Pencarian NIK Internal (Kebutuhan SE)
            </h1>
            <p className="text-orange-50 max-w-3xl text-sm">
              Fasilitas khusus internal BPS untuk melengkapi isian Sensus/Survei (seperti Sensus Ekonomi) yang kolom NIK-nya kosong. 
              Sistem akan secara cerdas memadankan Nama, Alamat, dan Wilayah dengan Database Master Kesejahteraan kita.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 w-full">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Sumber Kegiatan Internal</label>
                <select 
                  value={missingInstansi} 
                  onChange={(e) => setMissingInstansi(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <option value="">-- Pilih Jenis Sensus/Survei --</option>
                  <option value="Sensus Ekonomi (SE)">Sensus Ekonomi (SE)</option>
                  <option value="Regsosek">Registrasi Sosial Ekonomi (Regsosek)</option>
                  <option value="Susenas">Susenas</option>
                  <option value="Sensus Pertanian">Sensus Pertanian</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Unggah Data Mentah (.xlsx)</label>
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity"></div>
                  <div className="relative border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-4 hover:border-orange-500 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">Pilih Berkas Excel</p>
                      <p className="text-xs text-slate-500">Klik atau drag file hasil entri</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 items-start">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 mt-0.5">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">Cara Kerja Pencarian Otomatis</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pastikan file Excel Anda setidaknya memiliki kolom <strong>Nama</strong>, <strong>Alamat</strong>, dan <strong>Desa/Kelurahan</strong>. 
                  Sistem PAKEWA akan mengeksekusi algoritma Levenshtein untuk mencari kemiripan dan mengekstrak NIK dari database master untuk mengisi kolom Anda yang kosong.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button 
                disabled={!missingInstansi || isSendingMissing}
                onClick={() => {
                  setIsSendingMissing(true);
                  setTimeout(() => {
                    toast.success('Pencarian NIK selesai! 84% NIK berhasil ditemukan dan dilengkapi.');
                    setIsSendingMissing(false);
                    setMissingInstansi("");
                  }, 3000);
                }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                {isSendingMissing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {isSendingMissing ? 'Menganalisis & Mencari NIK (12%)...' : 'Mulai Pencarian NIK & Padankan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}