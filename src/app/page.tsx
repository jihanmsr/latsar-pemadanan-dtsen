"use client";

import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle2, Lock, ArrowRight, UserPlus, FileDown, Database, X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FAQ from '@/components/FAQ';
import PublicNavbar from '@/components/PublicNavbar';
import JumpingMascot from '@/components/JumpingMascot';
import LandingStats from '@/components/LandingStats';
import LandingRegulations from '@/components/LandingRegulations';
import LandingWorkflow from '@/components/LandingWorkflow';

export default function PublicLandingPage() {
  const [mounted, setMounted] = useState(false);
  
  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX(-((y - centerY) / centerY) * 15);
    setRotateY(((x - centerX) / centerX) * 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

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
          
          {/* Pure CSS Grid Pattern - Clearly visible with Blue Tint */}
          <div 
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]" 
            style={{ 
              backgroundImage: 'linear-gradient(#3b82f6 1.5px, transparent 1.5px), linear-gradient(90deg, #3b82f6 1.5px, transparent 1.5px)', 
              backgroundSize: '48px 48px',
              maskImage: 'linear-gradient(to bottom, black 50%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent)'
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
            {/* Animated Blue Decorative Frame Line */}
            <motion.div 
              animate={{ 
                y: ["-2%", "2%", "-2%"],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-8 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400/30 via-blue-500/60 to-blue-600/30 dark:from-blue-500/50 dark:via-sky-400/80 dark:to-blue-600/30 rounded-r shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(59,130,246,0.8)]"
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.3] sm:leading-tight mb-4 sm:mb-6 tracking-tight">
              Padanan Kesejahteraan Warga <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 drop-shadow-sm inline-block mt-1 sm:mt-0">(PAKEWA)</span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-base mb-8 max-w-xl leading-relaxed font-medium">
              Sistem informasi yang dirancang khusus untuk membantu Pemerintah Daerah (Pemda) memvalidasi, menyinkronkan, dan memadankan data sasaran program dengan <strong className="text-slate-900 dark:text-white font-bold">Data Tunggal Sosial dan Ekonomi Nasional (DTSEN)</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
              <Link href="/register" className="inline-flex justify-center items-center gap-2 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]">
                <UserPlus className="w-5 h-5" />
                Daftar Instansi
              </Link>
              <Link href="/sop" className="px-6 py-3.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 font-bold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2">
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
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 relative hidden lg:flex justify-center mt-12 lg:mt-0"
            style={{ perspective: 1000 }}
          >
            {/* 3D Tilt Container */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
              className="relative w-full max-w-lg aspect-square cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
               {/* Background Glow */}
               <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse duration-3000"></div>
               
               {/* Futuristic Spinning Rings */}
               <div className="absolute inset-0 sm:inset-4 rounded-full border-[1.5px] border-blue-500/30 border-dashed animate-[spin_20s_linear_infinite] z-0 shadow-[0_0_30px_rgba(59,130,246,0.1)]"></div>
               <div className="absolute inset-8 sm:inset-12 rounded-full border-2 border-sky-400/20 border-dotted animate-[spin_15s_linear_infinite_reverse] z-0"></div>
               <div className="absolute inset-2 sm:inset-0 rounded-full border border-indigo-500/20 animate-[spin_25s_linear_infinite] z-0">
                 <div className="absolute -top-1 left-1/2 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_15px_3px_#60a5fa]"></div>
                 <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_2px_#34d399]"></div>
               </div>
               
               {/* Decorative dots pattern */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] [background-size:16px_16px] opacity-60 z-0 animate-pulse"></div>
               
               <div className="relative w-full h-full">
                 {/* Image 1 (Bottom/Left) - with floating effect */}
                 <div className="absolute bottom-0 left-0 w-[70%] h-[70%] rounded-2xl overflow-hidden border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] z-10 animate-float hover:z-30 transition-all duration-300 hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent z-20 pointer-events-none mix-blend-overlay"></div>
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
                 <div className="absolute top-4 right-0 w-[65%] h-[65%] rounded-2xl overflow-hidden border border-sky-400/20 shadow-[0_0_40px_rgba(56,189,248,0.15)] z-20 animate-float-delayed hover:z-30 transition-all duration-300 hover:scale-105">
                   <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/20 to-transparent z-20 pointer-events-none mix-blend-overlay"></div>
                   <Image 
                     src="/images/kantor2.jpg" 
                     alt="Aktivitas Pemadanan Data" 
                     fill 
                     sizes="(max-width: 768px) 100vw, 50vw"
                     priority
                     className="w-full h-full object-cover"
                   />
                 </div>

                 {/* Floating Glassmorphism Badge */}
                 <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 -right-4 sm:-right-8 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-white/50 dark:border-slate-700/50"
                 >
                   <div className="flex items-center gap-4">
                     <div className="relative">
                       <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 animate-pulse"></div>
                       <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 relative z-10 border border-emerald-200 dark:border-emerald-800/50">
                         <CheckCircle2 className="w-7 h-7" />
                       </div>
                     </div>
                     <div>
                       <div className="text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">Status Integrasi</div>
                       <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                         AKTIF <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <LandingStats />
      <LandingWorkflow />
      <LandingRegulations />

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
        <FAQ />
      </div>

      <div className="relative overflow-hidden mt-16 border-t border-slate-200 dark:border-slate-800">
        {/* CSS Grid Pattern - Fades out towards the top */}
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25] z-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1.5px, transparent 1.5px), linear-gradient(90deg, #3b82f6 1.5px, transparent 1.5px)', 
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to top, black 30%, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent)'
          }}
        />
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8 text-center relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sudah Memiliki Akun?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Masuk ke dalam dashboard instansi Anda untuk mulai memadankan data sasaran atau memantau progres pra-validasi dan persentase keberhasilan.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            Masuk ke Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      {/* Floating Elements */}
      <JumpingMascot />
    </div>
  );
}
