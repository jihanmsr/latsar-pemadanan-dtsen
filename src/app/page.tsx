"use client";

import { motion } from 'framer-motion';
import { Database, Zap, FileCheck, CheckCircle2 } from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import FAQ from '@/components/FAQ';
import DashboardStats from '@/components/DashboardStats';
import SOPTimeline from '@/components/SOPTimeline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-full pb-16 animate-fade-in">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl transition-colors duration-500 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-200/50 dark:border-white/10">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-5 pointer-events-none">
          <Database className="w-96 h-96 text-primary" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight mb-4 tracking-tight drop-shadow-sm">
            Selamat Datang di PAKEWA<span className="text-primary">.</span>
          </h1>
          <p className="text-muted text-lg sm:text-xl font-medium mb-8 max-w-2xl leading-relaxed">
            Padanan Kesejahteraan Warga. Platform terpadu untuk memverifikasi, 
            memadankan, dan menjaga akurasi data sosial ekonomi secara cerdas dan aman.
          </p>
        </motion.div>
      </div>

      {/* STORYBOARD SECTION */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Standar Operasional Prosedur</h2>
          <p className="text-muted mt-3">Alur kerja pemadanan data dari hulu ke hilir</p>
        </div>
        <SOPTimeline />
      </div>

      <DashboardStats />
      
      <div className="mt-8">
        <UploadForm />
      </div>

      <FAQ />
    </div>
  );
}
