"use client";

import { motion } from 'framer-motion';
import { FileSignature, UploadCloud, FileSearch, Database, FileCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      
      {/* Public Header */}
      <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white">
            PAKEWA<span className="text-blue-600 dark:text-blue-400">.</span>
          </span>
        </div>
        <Link 
          href="/login" 
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Masuk Portal
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto space-y-16 pt-32 pb-24 px-4 sm:px-6">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm tracking-widest uppercase mb-6 shadow-sm border border-blue-200 dark:border-blue-800">
            Panduan Resmi
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Standar Operasional <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pemadanan Data</span>
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Alur kerja yang aman, transparan, dan terstandarisasi untuk menjamin akurasi data sasaran kesejahteraan sosial dari hulu ke hilir.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-24">
          {/* Animated vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 sm:-translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500 via-teal-500 to-green-500 opacity-20 dark:opacity-40" />
          
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 sm:-translate-x-1/2 rounded-full overflow-hidden">
             <motion.div
               initial={{ height: 0 }}
               whileInView={{ height: '100%' }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 3, ease: "easeInOut" }}
               className="w-full bg-gradient-to-b from-indigo-500 via-teal-500 to-green-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
             />
          </div>

          <div className="space-y-16 sm:space-y-32 relative">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
                  className={`flex flex-col sm:flex-row items-center gap-8 sm:gap-16 ${isEven ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Connector Node */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center z-10 shadow-xl group">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${step.color} flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform`}>
                      {step.id}
                    </div>
                  </div>

                  <div className={`flex-1 w-full pl-20 sm:pl-0 sm:w-1/2 ${isEven ? 'sm:text-left' : 'sm:text-right'}`}>
                    <div className={`glass p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group`}>
                      
                      {/* Decorative gradient blob */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${step.color} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                      
                      <div className={`flex flex-col ${isEven ? 'items-start' : 'items-start sm:items-end'} gap-5 mb-4 relative z-10`}>
                        <div className={`p-4 glass rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium relative z-10 text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
