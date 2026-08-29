"use client";

import { motion } from 'framer-motion';
import { FileSignature, UploadCloud, FileSearch, Database, FileCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SOPTimeline from '@/components/SOPTimeline';
import PublicNavbar from '@/components/PublicNavbar';

const steps = [
  {
    id: 1,
    title: "Cek MoU & Permohonan",
    description: "Instansi harus memiliki Nota Kesepahaman (MoU) atau Perjanjian Kerja Sama dengan BPS serta melampirkan surat permohonan resmi.",
    icon: <FileSignature className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 2,
    title: "Upload Data & Metadata",
    description: "Pengguna mengunggah dataset sasaran (CSV/Excel/Word/OCR) ke dalam portal beserta metadata terkait.",
    icon: <UploadCloud className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Pengecekan Manifes & Format",
    description: "Sistem melakukan validasi otomatis mendalam terhadap struktur data dan keabsahan NIK sesuai standar kependudukan.",
    icon: <FileSearch className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />,
    color: "from-cyan-500 to-teal-500"
  },
  {
    id: 4,
    title: "Probabilistic Matching",
    description: "Algoritma membandingkan dataset dengan master data DTSEN untuk menghasilkan skor kemiripan secara akurat.",
    icon: <Database className="w-8 h-8 text-teal-500 dark:text-teal-400" />,
    color: "from-teal-500 to-emerald-500"
  },
  {
    id: 5,
    title: "Serah Terima (BAST/NDA)",
    description: "Setelah proses selesai, pengguna melampirkan dokumen NDA dan BAST terenkripsi untuk mengunduh balikan data.",
    icon: <FileCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
    color: "from-emerald-500 to-green-500"
  }
];

export default function SopPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBackUrl = () => {
    if (!user) return "/login";
    return (user.role === 'BPS_ADMIN' || user.role === 'BPS_PEGAWAI') ? "/admin/dashboard" : "/";
  };

  const backUrl = getBackUrl();
  const isDashboard = user !== null;

  return (
    <div className={isDashboard ? "" : "min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950"}>
      
      {!isDashboard && (
        <PublicNavbar />
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className={`relative z-10 max-w-[1400px] mx-auto space-y-8 px-4 sm:px-6 ${isDashboard ? "py-8" : "pt-24 pb-16"}`}>
        
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm border border-blue-200 dark:border-blue-800">
            Panduan Resmi
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            Standar Operasional <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pemadanan Data</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Alur kerja yang aman, transparan, dan terstandarisasi untuk menjamin akurasi data sasaran kesejahteraan sosial dari hulu ke hilir.
          </p>
        </div>

        {/* Storyboard Layout */}
        <SOPTimeline />
      </div>
    </div>
  );
}
