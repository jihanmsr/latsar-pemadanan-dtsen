"use client";

import { motion } from 'framer-motion';
import { Shield, FileText, CheckCircle2, Lock, FileDown, UploadCloud, Search, Calendar, User, ArrowRight } from 'lucide-react';
import UploadForm from '@/components/UploadForm';
import DashboardStats from '@/components/DashboardStats';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardInstansi() {
  const [mounted, setMounted] = useState(false);
  
  // Use a fixed date format or simple string initially to avoid hydration mismatch, then update
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 animate-fade-in">
      
      {/* HEADER / GREETING SECTION */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8 px-6 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Selamat Datang, Operator Instansi
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Pantau statistik pemadanan dan kelola data sasaran instansi Anda.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/test-match" className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" />
              Simulator PAKEWA
            </Link>
            <Link href="#upload-section" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm">
              <UploadCloud className="w-4 h-4" />
              Unggah Data Baru
            </Link>
          </div>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 -mt-6 relative z-10">
        <DashboardStats />
      </div>

      {/* MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Area */}
        <div className="xl:col-span-2 space-y-6">
          <div id="upload-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
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
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Status Pra-Validasi
            </h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Berkas Terakhir:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Dinsos_Palu_2025.csv</span>
              </div>
              <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Baris:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">1.254 Data</span>
              </div>
              <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Status Padan:</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">85% Sukses</span>
              </div>
            </div>
            
            <Link href="/dashboard/tracking" className="mt-5 w-full flex justify-center items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              Lihat Detail Progres <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Keamanan Sistem</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
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
