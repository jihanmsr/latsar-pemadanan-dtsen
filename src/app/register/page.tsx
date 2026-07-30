"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Check, ChevronDown, Send } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm text-center max-w-md w-full border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-500 mb-6">
            Data registrasi instansi Anda telah kami terima. Tim PAKEWA akan melakukan verifikasi dokumen dan mengirimkan konfirmasi akun melalui email narahubung.
          </p>
          <Link href="/login" className="inline-block w-full py-3 bg-primary hover:bg-primary-dark text-white rounded font-semibold transition-colors">
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col xl:flex-row">
      
      {/* LEFT COLUMN - Illustration */}
      <div className="hidden xl:flex w-[400px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative flex-col items-center justify-end overflow-hidden p-8">
        <Link href="/login" className="absolute top-8 left-8 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali Ke Halaman Login
        </Link>
        
        {/* Placeholder for building illustration */}
        <div className="w-full relative aspect-[3/4] mt-24">
          <div className="absolute bottom-0 w-full h-[80%] bg-gradient-to-t from-slate-200 to-transparent dark:from-slate-800 rounded-t-3xl"></div>
          <div className="absolute bottom-0 w-[60%] h-[60%] left-[20%] bg-primary/20 rounded-t-xl"></div>
          <div className="absolute bottom-0 w-[40%] h-[90%] left-[10%] bg-slate-300 dark:bg-slate-700 rounded-t-xl border-t-8 border-r-8 border-primary"></div>
          <div className="absolute bottom-0 w-[35%] h-[50%] right-[10%] bg-slate-400 dark:bg-slate-600 rounded-t-xl"></div>
        </div>
      </div>

      {/* RIGHT COLUMN - Form */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center xl:hidden">
           <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="font-bold text-lg">PAKEWA<span className="text-primary">.</span></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-6">
                 <img src="/logo-pakewa.png" alt="Logo PAKEWA" className="h-10 w-auto object-contain" />
                 <div className="h-5 w-px bg-slate-300 dark:bg-slate-700"></div>
                 <div className="text-xs font-semibold text-slate-500">Modul Pemadanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">DTSEN</span></div>
               </div>

               <h1 className="text-xl font-bold text-slate-900 dark:text-white text-primary mb-1">
                 Pendaftaran Online
               </h1>
               <p className="text-sm text-slate-500">Lengkapi data di bawah ini untuk melakukan registrasi akun</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Form Instansi */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Pilih Kategori Pemohon<span className="text-red-500">*</span>:
                  </label>
                  <div className="relative">
                    <select required className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">-- pilih kategori instansi --</option>
                      <option value="kementerian">Kementerian / Lembaga</option>
                      <option value="provinsi">Pemerintah Provinsi</option>
                      <option value="kabkota">Pemerintah Kabupaten/Kota</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Pilih Nama Instansi<span className="text-red-500">*</span>:
                  </label>
                  <div className="relative">
                    <select required className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">-- pilih instansi --</option>
                      <option value="1">Dinas Sosial Prov. Jawa Tengah</option>
                      <option value="2">Bappeda Prov. Jawa Barat</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Email Narahubung (*.go.id)<span className="text-red-500">*</span>:
                  </label>
                  <input type="email" required placeholder="-- email narahubung --" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Nama Narahubung<span className="text-red-500">*</span>:
                  </label>
                  <input type="text" required placeholder="-- nama narahubung --" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    No Handphone<span className="text-red-500">*</span>:
                  </label>
                  <input type="tel" required placeholder="-- no handphone --" className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-1" />
                  <span className="text-[11px] text-slate-500 italic">Format: 08XX XXXX XXXX</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                    Lampiran<span className="text-red-500">*</span>:
                  </label>
                  <div className="flex">
                    <label className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Choose File
                      <input type="file" required accept=".pdf" className="hidden" />
                    </label>
                    <div className="flex-1 px-3 py-2.5 border-y border-r border-slate-300 dark:border-slate-700 rounded-r text-sm text-slate-500 bg-white dark:bg-slate-900 flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                      No file chosen
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 italic mt-1 block">Surat Pembuatan Akun (*.pdf) Maksimal 2 MB</span>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <div className="p-4 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded flex items-center justify-between mb-6 max-w-[300px]">
                     <div className="flex items-center gap-3">
                       <input type="checkbox" required className="w-6 h-6 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                       <span className="text-sm font-medium">I'm not a robot</span>
                     </div>
                     <div className="text-center flex flex-col items-center">
                       <img src="/recaptcha-logo.png" width="30" alt="reCaptcha" />
                       <span className="text-[9px] text-slate-500 mt-1">reCAPTCHA</span>
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-400 text-white font-semibold rounded shadow-sm transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    Kirim
                  </button>
                </div>

              </div>

              {/* Form Pengguna (Tabs) */}
              <div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-t-lg bg-slate-50 dark:bg-slate-900/50 flex">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setActiveTab(num)}
                      className={`flex-1 py-3 text-xs font-bold uppercase border-r border-slate-200 dark:border-slate-800 last:border-r-0 transition-colors ${
                        activeTab === num 
                        ? 'bg-white dark:bg-slate-900 border-t-2 border-t-primary text-primary' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-t-2 border-t-transparent'
                      }`}
                    >
                      Pengguna {num}{num <= 2 && <span className="text-red-500">*</span>}
                    </button>
                  ))}
                </div>
                
                <div className="border-x border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                        NIP/NIK:
                      </label>
                      <input type="text" placeholder="-- nik/nip --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                        Nama Unit Kerja:
                      </label>
                      <input type="text" placeholder="-- nama unit kerja --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                        Nama Lengkap:
                      </label>
                      <input type="text" placeholder="-- nama lengkap --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                        No Handphone:
                      </label>
                      <input type="tel" placeholder="-- no handphone --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-1" />
                      <span className="text-[10px] text-slate-500 italic block">Format: 08XX XXXX XXXX</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Email Pengguna (*.go.id):
                    </label>
                    <input type="email" placeholder="-- email pengguna --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                      Jabatan:
                    </label>
                    <input type="text" placeholder="-- jabatan --" required={activeTab <= 2} className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-1" />
                    <span className="text-[11px] text-slate-500 italic block max-w-sm">Contoh penulisan: Kepala Badan Perencanaan Pembangunan Daerah Provinsi Jawa Tengah</span>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900/50">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Keterangan:</span>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• <span className="font-semibold text-slate-700 dark:text-slate-300">Pengguna 1</span> dan <span className="font-semibold text-slate-700 dark:text-slate-300">Pengguna 2</span> wajib diisi.</li>
                    <li>• Field yang ditandai dengan <span className="text-red-500">*</span> wajib diisi.</li>
                  </ul>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
