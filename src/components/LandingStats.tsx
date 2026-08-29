"use client";

import { Building2, Map, MapPin, Database, Layers, CalendarSync } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingStats() {
  const stats = [
    { icon: Building2, value: "1", label: "Pemda Terdaftar", color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-900/30" },
    { icon: Map, value: "1", label: "Jumlah Provinsi", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { icon: MapPin, value: "13", label: "Jumlah Kab/Kota", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { icon: Database, value: "138", label: "Variabel Data", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: Layers, value: "3", label: "Tema Data", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { icon: CalendarSync, value: "2026", label: "Update Terkini", color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/30" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants as any}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center flex items-center justify-center gap-2 text-sm font-medium text-slate-500"
        >
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          Data diperbarui secara berkala dari basis data DTSEN
        </motion.div>
      </div>
    </div>
  );
}
