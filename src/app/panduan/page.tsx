"use client";

import { motion } from 'framer-motion';
import { Download, FileText, FileSignature, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function PanduanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 space-y-12 pb-16 pt-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Panduan & Templat PAKEWA
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Unduh templat dokumen administratif yang diperlukan untuk proses pemadanan data Kesejahteraan Sosial (DTSEN).
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col h-full"
        >
          <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl w-fit mb-4">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Templat Manifes Data</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">
            Gunakan templat ini untuk mendefinisikan struktur data, metadata variabel, dan spesifikasi set data yang akan dipadankan.
          </p>
          <a
            href="http://s.bps.go.id/templat_padan_dtsen_daerah"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
          >
            <Download className="w-4 h-4" /> Unduh Manifes
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col h-full"
        >
          <div className="p-3 bg-purple-50 dark:bg-slate-800 rounded-xl w-fit mb-4">
            <FileSignature className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Templat MoU & NDA</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 flex-1">
            Format baku untuk Nota Kesepahaman (MoU) dan Non-Disclosure Agreement (NDA) keamanan data BPS.
          </p>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-colors">
            <Download className="w-4 h-4" /> Unduh Dokumen Legal
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col h-full md:col-span-2"
        >
          <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-xl w-fit mb-4">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Buku Saku Panduan</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Panduan lengkap mengenai tata cara pemadanan, standardisasi variabel NIK, dan alur aplikasi.
          </p>
          <div className="flex gap-4">
            <Link href="/workflow" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors">
              Lihat SOP Online <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-colors">
              <Download className="w-4 h-4" /> Unduh PDF
            </button>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
