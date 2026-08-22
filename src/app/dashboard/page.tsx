"use client";

import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle2, Lock, FileDown, UploadCloud, Search } from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import FAQ from '@/components/FAQ';
import DashboardStats from '@/components/DashboardStats';
import SOPTimeline from '@/components/SOPTimeline';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-full pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 relative">
      
      {/* Background decorations for Instansi Dashboard (Red Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-rose-600/30 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]"
        />
      </div>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden mb-16 pt-12 pb-20 px-4 sm:px-8">
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-6 border border-rose-200 dark:border-rose-800">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard Instansi Daerah</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Dashboard Pemadanan <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">PAKEWA &times; DTSEN</span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl leading-relaxed">
              Modul PAKEWA memfasilitasi K/L/D untuk melakukan pra-validasi dan sinkronisasi data kesejahteraan sosial secara cerdas sebelum diintegrasikan secara penuh dengan basis data DTSEN.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link href="#upload-section" className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <UploadCloud className="w-5 h-5" />
                Mulai Padankan Data
              </Link>
              <Link href="/dashboard/test-match" className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors flex items-center gap-2">
                <Search className="w-5 h-5" />
                Simulator PAKEWA
              </Link>
              <Link href="/sop" className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Panduan Sistem
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Inpres No. 4 Tahun 2025
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Permen PPN No. 7 Tahun 2025
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Terintegrasi Satu Data Indonesia
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">KEAMANAN PORTAL:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">TTE Tersertifikasi</div>
                    <div className="text-[9px] text-slate-500">BSrE - BSSN</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
                  <Lock className="w-4 h-4 text-success" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">HTTPS Terenkripsi</div>
                    <div className="text-[9px] text-slate-500">SSL/TLS Secured</div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            {/* Placeholder for illustration */}
            <div className="relative w-full max-w-md aspect-square bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center border-8 border-white dark:border-slate-950 shadow-2xl">
               <FileText className="w-32 h-32 text-slate-300 dark:text-slate-700" />
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full mix-blend-multiply"></div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="border-t border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
          <DashboardStats />
        </div>
      </div>

      {/* STORYBOARD SECTION */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Standar Operasional Prosedur</h2>
          <p className="text-slate-500 mt-3">Alur kerja pemadanan data dari hulu ke hilir</p>
        </div>
        <SOPTimeline />
      </div>
      
      <div id="upload-section" className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
        <UploadForm />
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
        <FAQ />
      </div>
    </div>
  );
}
