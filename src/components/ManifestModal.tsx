"use client";

import { useState } from 'react';
import { X, FileText, Download, Calendar, Hash, Building2, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ManifestMetadata } from '@/utils/manifest';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (metadata: ManifestMetadata) => void;
}

export default function ManifestModal({ isOpen, onClose, onGenerate }: ManifestModalProps) {
  const [metadata, setMetadata] = useState<ManifestMetadata>({
    nomorSurat: '',
    tanggalSurat: '',
    perihalSurat: '',
    namaInstansi: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(metadata);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Metadata Manifes
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-4">
              {/* Nama Instansi */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  Nama Instansi / OPD
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dinas Kesehatan Provinsi Jawa Timur"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                  value={metadata.namaInstansi}
                  onChange={(e) => setMetadata({ ...metadata, namaInstansi: e.target.value })}
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Sesuai dengan nama OPD atau instansi yang terdaftar.</p>
              </div>

              {/* Nomor Surat */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-500" />
                  Nomor Surat Permintaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 000.1.2/345/432.1/2026"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                  value={metadata.nomorSurat}
                  onChange={(e) => setMetadata({ ...metadata, nomorSurat: e.target.value })}
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Nomor registrasi dari Surat Permohonan resmi/MoU.</p>
              </div>

              {/* Tanggal & Perihal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                    value={metadata.tanggalSurat}
                    onChange={(e) => setMetadata({ ...metadata, tanggalSurat: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Tanggal penerbitan Surat Permohonan.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-blue-500" />
                    Perihal
                  </label>
                  <input
                    type="text"
                    placeholder="Permohonan Pemadanan..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                    value={metadata.perihalSurat}
                    onChange={(e) => setMetadata({ ...metadata, perihalSurat: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Tujuan atau perihal pengajuan pemadanan data.</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              * Data ini akan otomatis dimasukkan ke dalam blok SPESIFIKASI pada file Manifes Excel.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate & Unduh
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
