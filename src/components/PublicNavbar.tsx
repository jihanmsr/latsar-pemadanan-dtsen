"use client";

import { FileText, X, Download } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';

export default function PublicNavbar() {
  const [showDocsModal, setShowDocsModal] = useState(false);

  return (
    <>
      <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-pakewa.png" alt="Logo PAKEWA" className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">PAKEWA<span className="text-primary">.</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Beranda
            </Link>
            <button onClick={() => setShowDocsModal(true)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors hidden sm:block">
              Dokumen Persyaratan
            </button>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors">
              Daftar Akun
            </Link>
          </div>
        </div>
      </nav>

      {/* MODAL DOKUMEN PERSYARATAN */}
      {showDocsModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setShowDocsModal(false)}
          ></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dokumen Persyaratan</h3>
                  <p className="text-sm text-slate-500">Unduh template dokumen yang diperlukan untuk permohonan</p>
                </div>
              </div>
              <button onClick={() => setShowDocsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {[
                  { title: "Surat Pengajuan Permintaan Data", url: "https://dtsen.data.go.id/download/ad35cdb4-d79e-42d3-9819-2d337560ae12.pdf" },
                  { title: "Kerangka Acuan Kerja (KAK) Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/39aec116-0ff1-4159-8159-b2fec63e006c.pdf" },
                  { title: "Peraturan tentang Satu Data Indonesia", url: "https://dtsen.data.go.id/download/7e6fee67-3345-406f-ba52-eb06aa13390c.pdf" },
                  { title: "Surat Permohonan Pembuatan Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/a296857d-4c65-45a9-bf38-37070ebc3213.pdf" },
                  { title: "Penetapan Kelembagaan Pelaksana Pengelolaan dan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/6a1a5f74-1566-4f62-a7a9-bb6d67202122.pdf" },
                  { title: "Surat Permohonan Aktivasi Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/b1fab391-3c26-47cb-9bdf-161a91469c41.pdf" },
                  { title: "Surat Permohonan Perubahan Akun Layanan Pemanfaatan DTSEN", url: "https://dtsen.data.go.id/download/9815b64f-9818-4bb3-a797-ce4f1478a13f.pdf" }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{doc.title}</span>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors shrink-0">
                      <Download className="w-4 h-4" />
                      Unduh
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
              <button onClick={() => setShowDocsModal(false)} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold shadow-sm transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
