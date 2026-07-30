"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Apa itu DTSEN?",
    a: (
      <>
        Sesuai dengan amanat <strong>Instruksi Presiden No. 4 Tahun 2025</strong> tentang Data Tunggal Sosial dan Ekonomi Nasional (DTSEN), diperlukan pengelolaan data tunggal sosial dan ekonomi nasional terintegrasi yang akurat guna mencapai tujuan pembangunan yang terukur dan berkelanjutan. Hal ini menjadi dasar kebijakan, perencanaan, dan evaluasi pembangunan yang efektif, dalam rangka mendukung keterpaduan program pembangunan nasional serta sinergi antar kementerian, lembaga, dan pemerintah daerah.
      </>
    )
  },
  {
    q: "Apa landasan hukum berbagipakai DTSEN?",
    a: (
      <>
        <strong>Peraturan Menteri PPN/Kepala Bappenas Nomor 7 Tahun 2025</strong> tentang Pedoman Berbagipakai Data Tunggal Sosial dan Ekonomi Nasional. Peraturan ini mengatur secara detail persyaratan permohonan DTSEN, referensi dokumen yang dibutuhkan, serta kewajiban dan wewenang pemohon maupun penerima DTSEN.
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
          <ul className="list-[circle] pl-5 mt-1 space-y-1 text-slate-500">
            <li>Surat Pengajuan Permintaan DTSEN</li>
            <li>Formulir Pernyataan Keamanan dan Pemanfaatan DTSEN</li>
            <li>Kerangka Acuan Kerja (KAK) Pemanfaatan DTSEN</li>
            <li>SK Pelaksana Pengelolaan Pemanfaatan DTSEN</li>
            <li>Regulasi Penyelenggaraan SDI dan/atau Keputusan BUMN</li>
          </ul>
        </li>
        <li>Verifikasi Teknis</li>
        <li>Verifikasi Substansi</li>
        <li>Persetujuan Koordinator</li>
        <li>Penandatanganan BAST</li>
        <li>Penyiapan Data, Penjaminan Mutu, dan Pengiriman Data</li>
        <li>Pemanfaatan Data dan Pelaporan</li>
      </ol>
    )
  },
  {
    q: "Ke mana saya bisa koordinasi lebih lanjut?",
    a: (
      <>
        Untuk koordinasi lebih lanjut, kami menyediakan Layanan DTSEN melalui portal <a href="https://dtsen.data.go.id" className="text-blue-600 hover:underline">dtsen.data.go.id</a>, email <a href="mailto:sdi@bappenas.go.id" className="font-medium text-slate-700">sdi@bappenas.go.id</a>, atau hotline <strong>+62 821-2019-4130</strong>.
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
    <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Tanya Jawab (FAQ)</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-sm">
            <button 
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 flex items-center justify-between bg-surface hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold text-slate-900 text-left">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-1 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <div className="mt-2 text-sm leading-relaxed">{faq.a}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
