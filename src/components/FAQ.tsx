"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "Apa itu DTSEN?",
    a: (
      <>
        Sesuai dengan amanat <strong className="text-primary dark:text-primary-light">Instruksi Presiden No. 4 Tahun 2025</strong> tentang Data Tunggal Sosial dan Ekonomi Nasional (DTSEN), diperlukan pengelolaan data tunggal sosial dan ekonomi nasional terintegrasi yang akurat guna mencapai tujuan pembangunan yang terukur dan berkelanjutan. Hal ini menjadi dasar kebijakan, perencanaan, dan evaluasi pembangunan yang efektif.
      </>
    )
  },
  {
    q: "Apa landasan hukum berbagipakai DTSEN?",
    a: (
      <>
        <strong className="text-primary dark:text-primary-light">Peraturan Menteri PPN/Kepala Bappenas Nomor 7 Tahun 2025</strong> tentang Pedoman Berbagipakai Data Tunggal Sosial dan Ekonomi Nasional. Peraturan ini mengatur secara detail persyaratan permohonan DTSEN, referensi dokumen yang dibutuhkan, serta kewajiban dan wewenang pemohon maupun penerima DTSEN.
      </>
    )
  },
  {
    q: "Bagaimana alur lengkap permohonan DTSEN?",
    a: (
      <ol className="list-decimal pl-4 space-y-1 mt-2">
        <li>Pembuatan Akun (dengan Surat Permohonan Pembuatan Akun)</li>
        <li>Login menggunakan akun yang telah disetujui</li>
        <li>Mengunggah dokumen permohonan sesuai Level DTSEN:
          <ul className="list-[circle] pl-5 mt-1 space-y-1 text-slate-500 dark:text-slate-400">
            <li>Surat Pengajuan Permintaan DTSEN</li>
            <li>Formulir Pernyataan Keamanan dan Pemanfaatan DTSEN</li>
            <li>Kerangka Acuan Kerja (KAK) Pemanfaatan DTSEN</li>
          </ul>
        </li>
        <li>Verifikasi Teknis & Substansi</li>
        <li>Persetujuan Koordinator & Penandatanganan BAST</li>
        <li>Penyiapan Data, Penjaminan Mutu, dan Pengiriman Data</li>
      </ol>
    )
  },
  {
    q: "Ke mana saya bisa koordinasi lebih lanjut?",
    a: (
      <>
        Untuk koordinasi lebih lanjut, kami menyediakan Layanan DTSEN melalui portal <a href="https://dtsen.data.go.id" className="text-blue-600 hover:underline">dtsen.data.go.id</a>, email <a href="mailto:sdi@bappenas.go.id" className="font-medium text-slate-700 dark:text-slate-300">sdi@bappenas.go.id</a>, atau hotline <strong>+62 821-2019-4130</strong>.
      </>
    )
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Tanya Jawab (FAQ)</h3>
        <p className="text-slate-500 dark:text-slate-400">Punya pertanyaan seputar DTSEN dan PAKEWA? Temukan jawabannya di sini.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            initial={false}
            animate={{ backgroundColor: openIndex === index ? "rgba(248, 250, 252, 1)" : "rgba(255, 255, 255, 1)" }}
            className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${openIndex === index ? 'border-primary/20 dark:border-primary/30 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}
          >
            <button 
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <span className={`font-bold text-lg ${openIndex === index ? 'text-primary dark:text-primary-light' : 'text-slate-900 dark:text-slate-200'}`}>
                {faq.q}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${openIndex === index ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400">
                    <div className="text-sm leading-relaxed">{faq.a}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
