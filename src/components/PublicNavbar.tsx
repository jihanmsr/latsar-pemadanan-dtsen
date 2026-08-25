"use client";

import { FileText, X, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function PublicNavbar() {
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo-pakewa.png"
              alt="Logo PAKEWA"
              width={36}
              height={36}
              className="object-contain group-hover:scale-105 transition-transform sm:w-10 sm:h-10"
            />
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white ml-1">PAKEWA<span className="text-blue-600">.</span></span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className={`relative text-sm font-bold transition-colors hidden sm:block ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'}`}>
              Beranda
              {pathname === '/' && (
                <div className="h-1 w-full bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-1 left-0"></div>
              )}
            </Link>
            <button onClick={() => setShowDocsModal(true)} className="text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors hidden md:block">
              Dokumen Persyaratan
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            <ThemeToggle />
            <Link href="/cek-status" className={`relative text-xs sm:text-sm font-bold transition-colors hidden sm:block ${pathname === '/cek-status' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400'}`}>
              Cek Status
              {pathname === '/cek-status' && (
                <div className="h-1 w-full bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-1 left-0"></div>
              )}
            </Link>
            <Link href="/login" className={`relative text-xs sm:text-sm font-bold transition-colors ${pathname === '/login' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400'}`}>
              Masuk
              {pathname === '/login' && (
                <div className="h-1 w-full bg-blue-600 dark:bg-blue-400 rounded-full absolute -bottom-1 left-0"></div>
              )}
            </Link>
            <Link href="/register" className={`text-xs sm:text-sm font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg transition-all hover:scale-105 whitespace-nowrap ${pathname === '/register' ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-blue-500/30' : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white'}`}>
              Daftar Instansi
            </Link>
          </div>
        </div>
      </nav>

      {/* MODAL DOKUMEN PERSYARATAN */}
      {mounted && createPortal(
        <AnimatePresence>
          {showDocsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                onClick={() => setShowDocsModal(false)}
              ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Dokumen Persyaratan</h3>
                    <p className="text-sm text-slate-500 mt-1">Unduh template referensi untuk kelengkapan administrasi.</p>
                  </div>
                </div>
                <button onClick={() => setShowDocsModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:scale-110">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950">
                <div className="space-y-3">
                  {[
                    { title: "Petunjuk Teknis (Juknis) / Panduan Penggunaan Layanan DTSEN", url: "/juknis-panduan-penggunaan-layanan-dtsen.pdf" },
                    { title: "Surat Pengajuan Permintaan Data", url: "https://dtsen.data.go.id/download/ad35cdb4-d79e-42d3-9819-2d337560ae12.pdf" },
                    { title: "Kerangka Acuan Kerja (KAK) Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/39aec116-0ff1-4159-8159-b2fec63e006c.pdf" },
                    { title: "Peraturan tentang Satu Data Indonesia", url: "https://dtsen.data.go.id/download/7e6fee67-3345-406f-ba52-eb06aa13390c.pdf" },
                    { title: "Surat Permohonan Pembuatan Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/a296857d-4c65-45a9-bf38-37070ebc3213.pdf" },
                    { title: "Penetapan Kelembagaan Pelaksana Pengelolaan dan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/6a1a5f74-1566-4f62-a7a9-bb6d67202122.pdf" },
                    { title: "Surat Permohonan Aktivasi Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/b1fab391-3c26-47cb-9bdf-161a91469c41.pdf" },
                    { title: "Surat Permohonan Perubahan Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/9815b64f-9818-4bb3-a797-ce4f1478a13f.pdf" }
                  ].map((doc, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 flex items-center justify-center shrink-0 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{doc.title}</span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white rounded-xl text-sm font-bold transition-all shrink-0">
                        <Download className="w-4 h-4" />
                        Unduh
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
