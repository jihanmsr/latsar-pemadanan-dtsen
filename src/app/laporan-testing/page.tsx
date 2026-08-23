"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, Settings, CheckCircle2, FileText, ChevronDown, ChevronRight, Layers } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

const roleData = [
  {
    id: "pemda",
    label: "Role Pemda",
    icon: <UserCheck className="w-5 h-5" />,
    modules: [
      {
        moduleName: "Modul 1: Pendaftaran Instansi Baru",
        tests: [
          { id: "PUB-01", name: "Registrasi Sukses", desc: "Isi form lengkap dengan NIK 16 digit dan file BAST.", expect: "Sistem mencatat data ke antrean (PENDING).", status: "PASS" },
          { id: "PUB-02", name: "Validasi NIK Salah", desc: "Ketik NIK kurang dari 16 digit.", expect: "Pendaftaran ditolak dengan pesan error.", status: "PASS" },
        ]
      },
      {
        moduleName: "Modul 6: Antarmuka Pengguna & Keamanan",
        tests: [
          { id: "PUB-03", name: "Pencegahan Akses URL (Guest)", desc: "Paksa masuk URL /admin tanpa login.", expect: "Otomatis dialihkan (redirect) ke halaman login.", status: "PASS" },
          { id: "PUB-04", name: "Transisi Tema Gelap (Dark Mode)", desc: "Klik ikon bulan di navbar.", expect: "Warna berubah gelap, teks putih sangat kontras dan jelas.", status: "PASS" },
        ]
      }
    ]
  },
  {
    id: "internalbps",
    label: "Role Internal BPS",
    icon: <FileText className="w-5 h-5" />,
    modules: [
      {
        moduleName: "Modul 1 & 2: Otorisasi & Hak Akses",
        tests: [
          { id: "PMD-01", name: "Login Akun Tertahan (PENDING)", desc: "Login dengan akun yang belum disetujui Admin.", expect: "Login ditolak, muncul peringatan tertahan.", status: "PASS" },
          { id: "PMD-02", name: "Keamanan Lintas Role (RBAC)", desc: "Ketik URL /admin saat sedang login sebagai Pemda.", expect: "Sistem memblokir dan mengembalikan ke beranda Pemda.", status: "PASS" },
        ]
      },
      {
        moduleName: "Modul 4: Validasi Format File Excel",
        tests: [
          { id: "PMD-03", name: "Pengecekan Format Ekstensi", desc: "Upload file JPG/PDF ke sistem pemadanan.", expect: "Sistem menolak tegas, hanya menerima file XLSX/CSV.", status: "PASS" },
          { id: "PMD-04", name: "Pengecekan Template Kolom", desc: "Upload Excel tanpa judul kolom 'NIK'.", expect: "Ditolak, sistem mendeteksi ketidaksesuaian template.", status: "PASS" },
          { id: "PMD-05", name: "Parsing File Data Kotor", desc: "Upload Excel dengan banyak baris kosong di tengah data.", expect: "Sistem otomatis membersihkan (mengabaikan baris kosong).", status: "PASS" },
        ]
      }
    ]
  },
  {
    id: "admin",
    label: "Role Admin",
    icon: <Settings className="w-5 h-5" />,
    modules: [
      {
        moduleName: "Modul 3: Verifikasi Pendaftaran",
        tests: [
          { id: "ADM-01", name: "Persetujuan Pendaftar (Approve)", desc: "Klik Setujui pada pendaftar baru.", expect: "Status menjadi APPROVED, akun instansi otomatis aktif.", status: "PASS" },
          { id: "ADM-02", name: "Penolakan Pendaftar (Reject)", desc: "Klik Tolak dan berikan alasan logis.", expect: "Status menjadi REJECTED, alasan tercatat permanen.", status: "PASS" },
        ]
      },
      {
        moduleName: "Modul 4: Engine Pemadanan Data & Stress Test",
        tests: [
          { id: "ADM-03", name: "Akurasi Algoritma Levenshtein", desc: "Upload NIK yang typo/meleset 1 angka.", expect: "Engine mendeteksi kemiripan akurat sebesar ~93%.", status: "PASS" },
          { id: "ADM-04", name: "Pengujian Skala Masif (Stress Test)", desc: "Upload paksa 10.000+ baris data NIK sekaligus.", expect: "Server stabil, proses berjalan asinkronus (latar belakang).", status: "PASS" },
        ]
      },
      {
        moduleName: "Modul 5: Keamanan Chatbot AI (Gemini)",
        tests: [
          { id: "ADM-05", name: "Pembatasan Konteks AI (Prompt Guard)", desc: "Uji coba tanya resep masakan atau politik ke AI.", expect: "AI menolak menjawab dan tetap fokus pada topik BPS.", status: "PASS" },
        ]
      }
    ]
  }
];

// Reusable Accordion Component
const ModuleAccordion = ({ moduleData, index }: { moduleData: any, index: number }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-blue-50 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{moduleData.moduleName}</h2>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4 border-t border-slate-100 dark:border-slate-800">
              {moduleData.tests.map((test: any) => (
                <div key={test.id} className="relative pl-6 py-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded tracking-wide">
                          {test.id}
                        </span>
                        <h3 className="text-[1.05rem] font-bold text-slate-900 dark:text-white">
                          {test.name}
                        </h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Langkah Uji</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{test.desc}</p>
                        </div>
                        <div>
                          <p className="text-[0.7rem] font-bold text-blue-500 uppercase tracking-wider mb-1">Ekspektasi</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{test.expect}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 mt-2 md:mt-0">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">PASS</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LaporanTestingPage() {
  const [activeTab, setActiveTab] = useState("publik");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <PublicNavbar />
      
      <div className="relative pt-32 pb-20 px-6 sm:px-12 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Laporan Pengujian Modul
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Struktur pengujian hierarkis berdasarkan hak akses (<span className="font-semibold text-blue-600 dark:text-blue-400">Role</span>) dan fungsi sistem PAKEWA.
          </p>
        </motion.div>

        {/* Custom Role Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          {roleData.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 ${
                activeTab === role.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>

        {/* Dynamic Accordion Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {roleData.find(r => r.id === activeTab)?.modules.map((mod, i) => (
            <ModuleAccordion key={i} moduleData={mod} index={i} />
          ))}
        </motion.div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-6 py-3 rounded-full text-sm font-semibold border border-emerald-200 dark:border-emerald-800/30">
            ✅ 100% SUCCESS — Sistem Siap Deployment
          </div>
        </motion.div>
      </div>
    </div>
  );
}
