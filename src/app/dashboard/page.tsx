"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, CheckCircle2, Lock, FileDown, UploadCloud, Search, Calendar, User, ArrowRight, AlertTriangle, Download, Upload, Bot, MessageSquare, BookOpen } from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import DashboardStats from '@/components/DashboardStats';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardInstansi() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [latestSubmission, setLatestSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMascotMenuOpen, setIsMascotMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Fetch latest submission
    fetch('/api/submissions?limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setLatestSubmission(data.data[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER / GREETING SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-100 dark:border-slate-700/50 relative">
        {/* Light mode gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-100/80 via-blue-50/30 to-transparent dark:hidden pointer-events-none"></div>
        {/* Dark mode gradient overlay */}
        <div className="hidden dark:block absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-800/80 via-slate-800/40 to-transparent pointer-events-none"></div>
        {/* Dark mode glow overlay */}
        <div className="hidden dark:block absolute top-0 right-0 bottom-0 w-64 md:w-96 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.8)_0,transparent_70%)] rounded-r-3xl"></div>
        
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight mb-2">
            Selamat Datang, Pengelola Data Instansi
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
            Saya Asisten PAKEWA, siap membantu Anda memantau statistik pemadanan dan mengelola data sasaran instansi dengan cepat dan aman.
          </p>
        </div>

        <div className="hidden sm:block relative z-10 shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
            <svg 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full h-full drop-shadow-xl hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setIsMascotMenuOpen(!isMascotMenuOpen)}
            >
              <g transform="translate(100, 100)">
                <motion.line x1="0" y1="-50" x2="0" y2="-75" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                <motion.circle 
                  animate={{ fill: ["#ef4444", "#3b82f6", "#ef4444"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  cx="0" cy="-75" r="8" 
                />
                
                <rect x="-45" y="-50" width="90" height="70" rx="20" fill="#3b82f6" />
                <rect x="-35" y="-35" width="70" height="40" rx="10" fill="#0f172a" />
                
                <motion.circle 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                  cx="-15" cy="-15" r="6" fill="#60a5fa" 
                />
                <motion.circle 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                  cx="15" cy="-15" r="6" fill="#60a5fa" 
                />
                
                <motion.path 
                  animate={{ rotate: [0, -20, 0], originX: 0, originY: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  d="M -45 -10 Q -65 -10 -65 10" 
                  fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
                />
                <motion.path 
                  animate={{ rotate: [0, 20, 0], originX: 0, originY: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  d="M 45 -10 Q 65 -10 65 10" 
                  fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" 
                />
                
                <path d="M -25 20 L 25 20 L 35 50 L -35 50 Z" fill="#94a3b8" />
                
                <motion.circle 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  cx="-20" cy="50" r="8" fill="#cbd5e1" 
                />
                <motion.circle 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  cx="20" cy="50" r="8" fill="#cbd5e1" 
                />
              </g>
            </svg>

            {/* Mascot Menu Popup */}
            <AnimatePresence>
              {isMascotMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20, x: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20, x: -20 }}
                  className="absolute top-24 right-0 sm:right-auto sm:-left-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 w-52 flex flex-col gap-1 z-50"
                >
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-chatbot'));
                      setIsMascotMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Tanya AI PAKEWA</span>
                  </button>
                  
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMascotMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Live Chat WA</span>
                  </a>
                  
                  <a
                    href="/sop"
                    onClick={() => setIsMascotMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Buku Panduan</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/test-match" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm">
            <Search className="w-4 h-4" />
            Simulator PAKEWA
          </Link>
          <Link href="#upload-section" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
            <UploadCloud className="w-4 h-4" />
            Mulai Pengajuan Pemadanan
          </Link>
        </div>
        
      {/* DASHBOARD STATS */}
      <DashboardStats />

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Upload Area */}
        <div className="xl:col-span-2 space-y-6">
          <div id="upload-section" className="glass rounded-2xl p-6 border border-border shadow-sm flex flex-col">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-500" />
                  Area Unggah Data Sasaran
                </h2>
                <p className="text-xs text-slate-500 mt-1">Sistem akan melakukan pra-validasi cerdas setelah file diunggah.</p>
              </div>
            </div>
            <UploadForm />
          </div>
        </div>

        {/* Right Column: Info & Security */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-border shadow-sm bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Status Pra-Validasi
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-sm text-slate-500 animate-pulse text-center py-4">Memuat data...</div>
              ) : latestSubmission ? (
                <>
                  <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Berkas Terakhir:</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={latestSubmission.file_name}>{latestSubmission.file_name}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Baris:</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{latestSubmission.total_rows} Data Sasaran</span>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Status Padan:</span>
                    {(() => {
                      const stats = latestSubmission.matching_stats;
                      const isSuccess = stats?.padan === stats?.total && stats?.total > 0;
                      return (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isSuccess ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/40' : 'text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40'}`}>
                          {isSuccess ? '100% Sukses' : 'Campuran (Ada Typo & Gagal)'}
                        </span>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-500 text-center py-4 italic">Belum ada berkas</div>
              )}
            </div>
            
            <Link href="/tracking" className="mt-5 w-full flex justify-center items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              Lihat Detail Progres <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Document Requirements Panel */}
          <div className="glass rounded-2xl p-6 border border-blue-200 dark:border-blue-900/50 shadow-sm bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              Persyaratan Dokumen
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300/80 mb-4 font-medium leading-relaxed">
              Persiapkan dokumen administratif berikut untuk kelancaran proses serah terima data balikan:
            </p>
            <ul className="space-y-4 mb-5">
               <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Surat Permohonan / MoU</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">Diserahkan ke Admin BPS saat registrasi awal.</p>
                    </div>
                  </div>
                  <a href="/contoh-mou.pdf" target="_blank" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    <Download className="w-3.5 h-3.5" /> Unduh Contoh
                  </a>
               </li>
               <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Non-Disclosure Agreement (NDA)</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">Diunggah bersamaan dengan BAST di akhir proses.</p>
                    </div>
                  </div>
                  <a href="/template-nda.docx" target="_blank" className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    <Download className="w-3.5 h-3.5" /> Unduh Template
                  </a>
               </li>
               <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Berita Acara Serah Terima (BAST)</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">Otomatis digenerate oleh sistem di menu Tracking.</p>
                    </div>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg cursor-not-allowed">
                    Auto Generate
                  </span>
               </li>
            </ul>
            <Link href="/sop" className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 rounded-lg transition-colors text-xs font-bold">
               <FileText className="w-4 h-4" /> Baca SOP & Juknis Lengkap
            </Link>
          </div>

          <div className="glass rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Keamanan Sistem</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">TTE Tersertifikasi</div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">Dokumen BAST dilindungi segel digital BSrE BSSN.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Enkripsi End-to-End</div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-0.5">Seluruh lalu lintas pemadanan dienkripsi SSL/TLS 256-bit.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
