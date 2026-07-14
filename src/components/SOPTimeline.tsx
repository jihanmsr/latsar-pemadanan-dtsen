"use client";

import { motion } from 'framer-motion';
import { FileSignature, UploadCloud, FileSearch, Database, FileCheck } from 'lucide-react';

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

export default function SOPTimeline() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Storyboard Layout */}
      <div className="relative mt-8 z-10">
        
        {/* Horizontal Line (Desktop - 5 columns) */}
        <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500 z-0 rounded-full opacity-60" />

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group flex flex-col items-center text-center"
            >
              {/* Decorative gradient blob */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${step.color} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              {/* Step Number Badge */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${step.color} flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg transform group-hover:scale-110 transition-transform relative z-10`}>
                {step.id}
              </div>

              {/* Icon */}
              <div className="p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm relative z-10">
                {step.icon}
              </div>

              <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mb-3 relative z-10 leading-tight">
                {step.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm relative z-10">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
