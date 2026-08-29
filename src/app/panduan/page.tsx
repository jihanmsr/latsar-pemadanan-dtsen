"use client";

import { motion } from 'framer-motion';
import { Download, FileText, FileSignature, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PanduanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 pt-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Panduan & Templat PAKEWA
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Unduh templat dokumen administratif yang diperlukan untuk proses pemadanan data Kesejahteraan Sosial (DTSEN).
        </p>
      </div>

      {/* DAFTAR DOKUMEN RESMI */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Unduh Dokumen & Templat Resmi</h2>
            <p className="text-xs text-slate-500">File referensi dan format baku pemanfaatan DTSEN.</p>
          </div>
        </div>

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
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all group gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200">{doc.title}</span>
              </div>
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 self-end sm:self-center shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
