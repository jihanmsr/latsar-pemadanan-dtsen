"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Berapa lama proses pemadanan data (SLA)?",
    a: "Sesuai Standar Layanan (SLA), proses pemadanan memakan waktu 1 hingga 5 hari kerja tergantung dari antrean dan volume data yang diunggah."
  },
  {
    q: "Format file apa saja yang didukung?",
    a: "Saat ini sistem menerima format CSV, Excel (.xlsx, .xls), serta gambar tangkapan layar atau KTP (.png, .jpg) yang akan dibaca menggunakan OCR."
  },
  {
    q: "Mengapa tombol unduh saya terkunci?",
    a: "Tombol unduh hanya terbuka jika status The Core Engine telah mencapai 100% dan Anda telah mengunggah serta mencentang persetujuan dokumen BAST & NDA."
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
              <div className="px-6 pb-4 pt-1 text-slate-600 bg-slate-50 border-t border-slate-100">
                <p className="mt-2 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
