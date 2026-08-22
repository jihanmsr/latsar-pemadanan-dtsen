"use client";

import { motion } from 'framer-motion';
import { FileSignature, DatabaseZap, ServerCog, MailCheck } from 'lucide-react';

const steps = [
  {
    icon: FileSignature,
    title: "Pengajuan & Penyerahan Data",
    desc: "Pemerintah Daerah (K/L/D) mengajukan surat permohonan pemadanan ke BPS beserta dokumen kerja sama dan data sasaran.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: DatabaseZap,
    title: "Eksplorasi & Verifikasi",
    desc: "Tim BPS melakukan pengecekan referensi, validasi variabel NIK, dan kesesuaian format metadata.",
    color: "from-indigo-500 to-violet-500"
  },
  {
    icon: ServerCog,
    title: "Pemrosesan & Pemadanan",
    desc: "Pemadanan individu secara deterministik (NIK), validasi data kependudukan, serta pemeringkatan kesejahteraan menggunakan DTSEN.",
    color: "from-violet-500 to-fuchsia-500"
  },
  {
    icon: MailCheck,
    title: "Pengiriman Data Balikan",
    desc: "BPS mengirimkan data hasil padanan balikan beserta manifes, Berita Acara Serah Terima (BAST), dan NDA.",
    color: "from-fuchsia-500 to-rose-500"
  }
];

export default function SOPTimeline() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as any,
        stiffness: 300,
        damping: 24,
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full mb-16">
      <div className="relative mt-8 z-10">
        
        {/* Horizontal Line for Desktop with Moving Animation */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 rounded-full"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, idx) => (
            <motion.div variants={itemVariants} key={idx} className="relative group">
              
              {/* Timeline Node Desktop */}
              <div className="hidden lg:flex absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-xl items-center justify-center z-10 transition-transform group-hover:scale-110">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm`}>
                  {idx + 1}
                </div>
              </div>

              {/* Content Box */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 lg:mt-20 h-full flex flex-col items-center text-center">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mb-5 shadow-lg`}
                >
                  <step.icon className="w-7 h-7" />
                </motion.div>
                <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 dark:text-slate-300 font-bold text-sm flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
