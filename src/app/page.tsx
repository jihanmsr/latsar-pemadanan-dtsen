"use client";

import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle2, Lock, ArrowRight, UserPlus, FileDown, Database, X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FAQ from '@/components/FAQ';
import PublicNavbar from '@/components/PublicNavbar';
import LandingStats from '@/components/LandingStats';
import LandingRegulations from '@/components/LandingRegulations';
import LandingWorkflow from '@/components/LandingWorkflow';

export default function PublicLandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-screen animate-fade-in bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      <PublicNavbar />

      {/* HERO SECTION */}
      <div className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800">
        
        {/* Background decorations for Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Animated Glowing Orbs (Pure Blue/Sky) */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full bg-blue-500/30 blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-sky-400/20 blur-[120px]"
          />
          
          {/* Login Page Grid Pattern - Clearly visible with Blue Tint */}
          <div 
            className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.12] dark:opacity-20 invert dark:invert-0" 
            style={{ 
              filter: 'invert(30%) sepia(100%) saturate(300%) hue-rotate(190deg) brightness(95%) contrast(100%)',
              maskImage: 'linear-gradient(to bottom, black 50%, transparent)' 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-slate-950" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Blue Decorative Frame Line */}
            <div className="absolute -left-4 sm:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-sky-400/10 to-transparent rounded-r"></div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-6 shadow-sm">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider">MODUL PEMADANAN RESMI</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
              Padanan Kesejahteraan Warga <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 drop-shadow-sm">(PAKEWA)</span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-base mb-8 max-w-xl leading-relaxed font-medium">
              Sistem informasi yang dirancang khusus untuk membantu Instansi Pusat dan Pemerintah Daerah (K/L/D) memvalidasi, menyinkronkan, dan memadankan data sasaran program dengan <strong className="text-slate-900 dark:text-white font-bold">Data Tunggal Sosial dan Ekonomi Nasional (DTSEN)</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register" className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]">
                <UserPlus className="w-5 h-5" />
                Daftar Instansi
              </Link>
              <Link href="/sop" className="px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
                <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Panduan Sistem
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sinkronisasi NIK Otomatis
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Terintegrasi DTSEN
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                100% Aman & Tersertifikasi
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">KEAMANAN PORTAL:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-[10px] font-black text-slate-800 dark:text-slate-200">TTE Tersertifikasi</div>
                    <div className="text-[9px] font-bold text-slate-500">BSrE - BSSN</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-[10px] font-black text-slate-800 dark:text-slate-200">HTTPS Terenkripsi</div>
                    <div className="text-[9px] font-bold text-slate-500">SSL/TLS Secured</div>
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
            {/* Image Collage */}
            <div className="relative w-full max-w-lg aspect-square">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse duration-3000"></div>
               
               {/* Decorative dots pattern */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] [background-size:16px_16px] opacity-60 z-0"></div>
               
               <div className="relative w-full h-full">
                 {/* Image 1 (Bottom/Left) - with floating effect */}
                 <div className="absolute bottom-0 left-0 w-[70%] h-[70%] rounded-2xl overflow-hidden border-8 border-white dark:border-slate-950 shadow-2xl z-10 animate-float hover:z-30 transition-all duration-300 hover:scale-105">
                   <Image 
                     src="/images/kantor1.jpg" 
                     alt="Kantor Pemerintahan" 
                     fill 
                     sizes="(max-width: 768px) 100vw, 50vw"
                     priority
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>
                 </div>
                 
                 {/* Image 2 (Top/Right) - with delayed floating effect */}
                 <div className="absolute top-4 right-0 w-[65%] h-[65%] rounded-2xl overflow-hidden border-8 border-white dark:border-slate-950 shadow-2xl z-20 animate-float-delayed hover:z-30 transition-all duration-300 hover:scale-105">
                   <Image 
                     src="/images/kantor2.jpg" 
                     alt="Aktivitas Pemadanan Data" 
                     fill 
                     sizes="(max-width: 768px) 100vw, 50vw"
                     priority
                     className="object-cover"
                   />
                 </div>

                 {/* Floating Glassmorphism Badge */}
                 <div className="absolute bottom-20 -right-8 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 animate-float-fast">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                       <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Status Sistem</div>
                       <div className="text-sm font-black text-slate-900 dark:text-white">Terintegrasi Aktif</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>

      <LandingStats />
      <LandingWorkflow />
      <LandingRegulations />

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
        <FAQ />
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8 text-center border-t border-slate-200 dark:border-slate-800 mt-16 pt-16">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sudah Memiliki Akun?</h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">Masuk ke dalam dashboard instansi Anda untuk mulai memadankan data sasaran atau memantau progres pra-validasi dan persentase keberhasilan.</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
          Masuk ke Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}
