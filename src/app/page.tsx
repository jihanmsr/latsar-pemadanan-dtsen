"use client";

import { motion } from 'framer-motion';
import { Database, Zap, FileCheck, CheckCircle2 } from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import FAQ from '@/components/FAQ';
import DashboardStats from '@/components/DashboardStats';

const steps = [
  {
    icon: Database,
    title: "1. Unggah Data Kesejahteraan",
    desc: "K/L/D mengunggah data sasaran penerima manfaat dalam format CSV, Excel, atau pindai dokumen."
  },
  {
    icon: Zap,
    title: "2. Mesin Pemadanan Pintar",
    desc: "The Core Engine secara otomatis membersihkan NIK dan mencocokkannya dengan database induk (DTSEN)."
  },
  {
    icon: FileCheck,
    title: "3. Verifikasi & Anomali",
    desc: "Melihat hasil statistik secara real-time. Menemukan data anomali atau data ganda dengan cepat."
  },
  {
    icon: CheckCircle2,
    title: "4. Cetak BAST Resmi",
    desc: "Setelah 100% selesai, langsung unduh Berita Acara Serah Terima secara instan dan aman."
  }
];

export default function Home() {
  return (
    <div className="w-full h-full pb-16">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 sm:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10">
          <Database className="w-96 h-96" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Selamat Datang di PAKEWA<span className="text-blue-300">.</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl font-medium mb-8 max-w-2xl leading-relaxed">
            Padanan Kesejahteraan Warga. Platform terpadu untuk memverifikasi, 
            memadankan, dan menjaga akurasi data sosial ekonomi secara cerdas dan aman.
          </p>
        </motion.div>
      </div>

      {/* STORYBOARD SECTION */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Bagaimana PAKEWA Bekerja?</h2>
          <p className="text-slate-500 mt-2">Alur kerja pemadanan data dari hulu ke hilir</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-3">{step.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <DashboardStats />
      
      <div className="mt-8">
        <UploadForm />
      </div>

      <FAQ />
    </div>
  );
}
