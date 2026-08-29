"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check, ChevronDown, Send, ShieldCheck, FileCheck, Info } from 'lucide-react';
import PublicNavbar from '@/components/PublicNavbar';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [kategori, setKategori] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length > 0) {
      if (val.startsWith('0')) {
        val = val.substring(0, 13);
        let formatted = '';
        if (val.length > 4) {
          formatted += val.substring(0, 4) + ' ';
          if (val.length > 8) {
            formatted += val.substring(4, 8) + ' ' + val.substring(8);
          } else {
            formatted += val.substring(4);
          }
        } else {
          formatted = val;
        }
        e.target.value = formatted;
      } else {
        e.target.value = val;
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setRequestId(data.requestId);
        setSubmitted(true);
      } else {
        alert(data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      alert('Gagal terhubung ke server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Pendaftaran Berhasil!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
              Data registrasi instansi Anda telah kami terima. Tim PAKEWA akan melakukan verifikasi dokumen dan mengirimkan konfirmasi akun.
            </p>

            {requestId && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-8 text-left">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nomor Tiket (Request ID)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-200 break-all">
                    {requestId}
                  </code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(requestId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-lg transition-colors shrink-0 flex items-center justify-center w-10 h-10"
                    title="Copy ID"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  *Simpan ID ini untuk mengecek status pendaftaran Anda.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/cek-status" className="flex-1 inline-flex items-center justify-center py-3.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-all shadow-sm">
                Cek Status
              </Link>
              <Link href="/login" className="flex-1 inline-flex items-center justify-center py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg">
                Halaman Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const fillDummyData = () => {
    setKategori('bps_kabkota');
    setFormData({
      kategoriPemohon: 'bps_kabkota',
      namaInstansi: 'BPS Kota Palu',
      emailNarahubung: 'jihanmaisaroh@bps.go.id',
      namaNarahubung: 'Budi Santoso',
      noHandphone: '0812 3456 7890',
      user1_nip_nik: '19980101 202401 2 001',
      user1_nama_unit_kerja: 'Biro Perencanaan',
      user1_nama_lengkap: 'Jihan Maisaroh',
      user1_no_hp: '0812 3456 7891',
      user1_email: 'jihanmaisaroh@bps.go.id',
      user1_jabatan: 'Pranata Komputer',
      user2_nip_nik: '19870808 199801 1 002',
      user2_nama_unit_kerja: 'Pusat Data dan Informasi',
      user2_nama_lengkap: 'Catur Pri',
      user2_no_hp: '0812 3456 7892',
      user2_email: 'catur.pri@bps.go.id',
      user2_jabatan: 'Kepala Bidang Infrastruktur',
      user3_nip_nik: '',
      user3_nama_unit_kerja: '',
      user3_nama_lengkap: '',
      user3_no_hp: '',
      user3_email: '',
      user3_jabatan: '',
      user4_nip_nik: '',
      user4_nama_unit_kerja: '',
      user4_nama_lengkap: '',
      user4_no_hp: '',
      user4_email: '',
      user4_jabatan: '',
    });
    setFileName("Surat_Permohonan_BPS_Palu.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      <div className="flex-1 flex flex-col xl:flex-row">

        {/* LEFT COLUMN - Information / Branding */}
        <div className="hidden xl:flex w-[400px] xl:w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-16 flex-col justify-between relative overflow-hidden shrink-0">
          <Link href="/login" className="absolute top-8 left-8 text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]"
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'linear-gradient(to bottom, black 40%, transparent)'
              }}
            />
          </div>

          <div className="mt-20 max-w-xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">
            <div className="mb-12">
              <div>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                  Modul Pemadanan DTSEN
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                Pendaftaran Instansi Baru
              </h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
                <p>
                  Lengkapi formulir pendaftaran untuk mengajukan akun instansi. Pastikan Anda telah menyiapkan dokumen <strong>Surat Pengajuan Permintaan Data</strong> dan dokumen legal lainnya.
                </p>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-12 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-medium">Tim kami akan memverifikasi permohonan Anda dalam waktu maksimal 2x24 Jam kerja.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Form */}
        <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-950 h-full max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center xl:hidden sticky top-0 z-10">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <div className="font-black text-lg text-slate-900 dark:text-white tracking-tight">PAKEWA<span className="text-blue-600">.</span></div>
          </div>

          <div className="flex-1 p-6 md:p-12 lg:p-16">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10 xl:hidden">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Pendaftaran Online
                </h1>
                <p className="text-sm text-slate-500 font-medium">Lengkapi data di bawah ini untuk melakukan registrasi akun</p>
              </div>





              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Form Instansi */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">1</span>
                      Data Instansi & Narahubung
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Pilih Kategori Pemohon<span className="text-rose-500">*</span>:
                        </label>
                        <div className="relative">
                          <select 
                            name="kategoriPemohon" 
                            required 
                            value={formData.kategoriPemohon || kategori} 
                            onChange={(e) => {
                              setKategori(e.target.value);
                              handleInputChange('kategoriPemohon', e.target.value);
                            }} 
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm appearance-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer"
                          >
                            <option value="">-- pilih kategori instansi --</option>
                            <option value="kementerian">Kementerian / Lembaga</option>
                            <option value="provinsi">Pemerintah Provinsi</option>
                            <option value="kabkota">Pemerintah Kabupaten/Kota</option>
                            <option value="bps_kabkota">BPS Kabupaten/Kota (Sulteng)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Pilih Nama Instansi<span className="text-rose-500">*</span>:
                        </label>
                        <div className="relative">
                          <input 
                            list="instansi-list"
                            name="namaInstansi" 
                            required 
                            value={formData.namaInstansi || ''}
                            onChange={(e) => handleInputChange('namaInstansi', e.target.value)}
                            placeholder="Ketik atau pilih instansi..." 
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                          />
                          <datalist id="instansi-list">
                            {kategori === 'bps_kabkota' ? (
                              <>
                                <option value="BPS Kabupaten Banggai" />
                                <option value="BPS Kabupaten Banggai Kepulauan" />
                                <option value="BPS Kabupaten Banggai Laut" />
                                <option value="BPS Kabupaten Buol" />
                                <option value="BPS Kabupaten Donggala" />
                                <option value="BPS Kabupaten Morowali" />
                                <option value="BPS Kabupaten Morowali Utara" />
                                <option value="BPS Kabupaten Parigi Moutong" />
                                <option value="BPS Kabupaten Poso" />
                                <option value="BPS Kabupaten Sigi" />
                                <option value="BPS Kabupaten Tojo Una-Una" />
                                <option value="BPS Kabupaten Tolitoli" />
                                <option value="BPS Kota Palu" />
                              </>
                            ) : (
                              <>
                                <option value="Badan Kepegawaian Daerah" />
                                <option value="Badan Kesatuan Bangsa" />
                                <option value="Badan Penanggulangan Bencana Daerah" />
                                <option value="Badan Pendapatan Daerah" />
                                <option value="Badan Riset Dan Inovasi Daerah" />
                                <option value="Badan Pengelolaan Keuangan Dan Aset Daerah" />
                                <option value="Badan Pengembangan Sumber Daya Manusia" />
                                <option value="Badan Penghubung Provinsi" />
                                <option value="Badan Perencanaan Pembangunan Daerah" />
                                <option value="Dinas Binamarga Dan Penataan Ruang" />
                                <option value="Dinas Cipta Karya Dan Sumberdaya Air" />
                                <option value="Dinas Energi Dan Sumber Daya Mineral" />
                                <option value="Dinas Kebudayaan" />
                                <option value="Dinas Kehutanan" />
                                <option value="Dinas Kelautan Dan Perikanan" />
                                <option value="Dinas Kependudukan Dan Pencatatan Sipil" />
                                <option value="Dinas Kesehatan" />
                                <option value="Dinas Komunikasi, Informatika, Persandian Dan Statistik" />
                                <option value="Dinas Koperasi, Usaha Kecil Dan Menengah" />
                                <option value="Dinas Lingkungan Hidup" />
                                <option value="Dinas Pangan" />
                                <option value="Dinas Pariwisata" />
                                <option value="Dinas Pemberdayaan Masyarakat Dan Desa" />
                                <option value="Dinas Pemberdayaan Perempuan Dan Perlindungan Anak" />
                                <option value="Dinas Pemuda Dan Olahraga" />
                                <option value="Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu" />
                                <option value="Dinas Pendidikan" />
                                <option value="Dinas Pengendalian Penduduk Dan Keluarga Berencana" />
                                <option value="Dinas Perhubungan" />
                                <option value="Dinas Perindustrian Dan Perdagangan" />
                                <option value="Dinas Perkebunan Dan Peternakan" />
                                <option value="Dinas Perpustakaan Dan Kearsipan" />
                                <option value="Dinas Perumahan, Kawasan Pemukiman Dan Pertanahan" />
                                <option value="Dinas Sosial" />
                                <option value="Dinas Tanaman Pangan Dan Holtikultura" />
                                <option value="Dinas Tenaga Kerja Dan Transmigrasi" />
                                <option value="Inspektorat Daerah" />
                                <option value="RSUD Madani" />
                                <option value="RSUD Undata" />
                                <option value="Satuan Polisi Pamong Praja" />
                                <option value="Sekretariat Daerah / Biro Pimpinan Daerah" />
                                <option value="Sekretariat Dewan Perwakilan Rakyat" />
                              </>
                            )}
                          </datalist>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Email Narahubung (*.go.id)<span className="text-rose-500">*</span>:
                        </label>
                        <input 
                          name="emailNarahubung" 
                          type="email" 
                          required 
                          pattern=".*\.go\.id$" 
                          title="Gunakan email resmi pemerintahan berakhiran .go.id" 
                          placeholder="admin@instansi.go.id" 
                          value={formData.emailNarahubung || ''}
                          onChange={(e) => handleInputChange('emailNarahubung', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Nama Narahubung<span className="text-rose-500">*</span>:
                        </label>
                        <input 
                          name="namaNarahubung" 
                          type="text" 
                          required 
                          placeholder="Nama Lengkap" 
                          value={formData.namaNarahubung || ''}
                          onChange={(e) => handleInputChange('namaNarahubung', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          No Handphone<span className="text-rose-500">*</span>:
                        </label>
                        <input 
                          name="noHandphone" 
                          type="tel" 
                          required 
                          placeholder="08XX XXXX XXXX" 
                          maxLength={15} 
                          value={formData.noHandphone || ''}
                          onChange={(e) => handlePhoneChange('noHandphone', e)} 
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" 
                        />
                        <span className="text-xs text-slate-500 font-medium">Format: 08XX XXXX XXXX</span>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                          Lampiran Pengajuan Akun<span className="text-rose-500">*</span>:
                        </label>
                        <div className="relative group">
                          <input name="lampiran" type="file" required={!fileName} accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className={`w-full px-4 py-3 border rounded-xl text-sm flex items-center justify-between transition-colors ${fileName ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover:border-blue-500'}`}>
                            <span className={`font-medium flex items-center gap-2 truncate pr-4 ${fileName ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`}>
                              <FileCheck className="w-4 h-4 shrink-0" /> 
                              {fileName ? fileName : 'Pilih File PDF'}
                            </span>
                            <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md shrink-0">
                              {fileName ? 'Ganti File' : 'Pilih File'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">Surat Pembuatan Akun (*.pdf) Maksimal 2 MB</span>
                      </div>

                      <div className="pt-4">
                        <div className="w-full border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between bg-white dark:bg-slate-900 shadow-sm">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" required className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Saya bukan robot</span>
                          </label>
                          <div className="flex flex-col items-center gap-1">
                            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="30" alt="reCAPTCHA" className="opacity-90 hover:opacity-100 transition-opacity" />
                            <span className="text-[9px] text-slate-400 font-medium">reCAPTCHA</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Memproses Pengajuan...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Kirim Pengajuan Pendaftaran
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Data Pengguna */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-start sm:items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs shrink-0 mt-0.5 sm:mt-0">2</span>
                    <span className="leading-tight">
                      Data Pengguna Layanan{' '}
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        (Minimal 2)
                        <div className="relative group inline-block">
                          <Info className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
                          <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 whitespace-normal font-normal">
                            <div className="absolute -top-1 left-2 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                            <p className="font-bold mb-1">Kenapa wajib 2 orang?</p>
                            <p className="text-slate-300 font-medium leading-relaxed">Untuk mitigasi risiko (backup) jika salah satu berhalangan, serta pemisahan peran antara Penanggung Jawab dan Operator Teknis.</p>
                          </div>
                        </div>
                      </span>
                    </span>
                  </h3>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
                      {[1, 2, 3, 4].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 min-w-[90px] py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                          User {tab} {tab <= 2 && <span className="text-rose-500">*</span>}
                        </button>
                      ))}
                    </div>

                    {/* Form Content (Dynamic) */}
                    <div className="p-6 sm:p-8 relative">
                      {[1, 2, 3, 4].map((tab) => (
                        <div key={tab} className={`${activeTab === tab ? 'block animate-fade-in' : 'hidden'}`}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                NIP/NIK:
                              </label>
                              <input 
                                name={`user${tab}_nip_nik`} 
                                type="text" 
                                required={tab <= 2} 
                                placeholder="16 digit NIK atau NIP" 
                                value={formData[`user${tab}_nip_nik`] || ''}
                                onChange={(e) => handleInputChange(`user${tab}_nip_nik`, e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                Nama Unit Kerja:
                              </label>
                              <input 
                                name={`user${tab}_nama_unit_kerja`} 
                                type="text" 
                                required={tab <= 2} 
                                placeholder="Biro / Bagian" 
                                value={formData[`user${tab}_nama_unit_kerja`] || ''}
                                onChange={(e) => handleInputChange(`user${tab}_nama_unit_kerja`, e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                Nama Lengkap:
                              </label>
                              <input 
                                name={`user${tab}_nama_lengkap`} 
                                type="text" 
                                required={tab <= 2} 
                                placeholder="Nama Lengkap dengan Gelar" 
                                value={formData[`user${tab}_nama_lengkap`] || ''}
                                onChange={(e) => handleInputChange(`user${tab}_nama_lengkap`, e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                                No Handphone:
                              </label>
                              <input 
                                name={`user${tab}_no_hp`} 
                                type="tel" 
                                required={tab <= 2} 
                                placeholder="08XX XXXX XXXX" 
                                maxLength={15} 
                                value={formData[`user${tab}_no_hp`] || ''}
                                onChange={(e) => handlePhoneChange(`user${tab}_no_hp`, e)} 
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" 
                              />
                              <span className="text-[10px] text-slate-500 font-medium">Format: 08XX XXXX XXXX</span>
                            </div>
                          </div>
                          <div className="mb-5">
                            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                              Email Pengguna (*.go.id):
                            </label>
                            <input 
                              name={`user${tab}_email`} 
                              type="email" 
                              required={tab <= 2} 
                              pattern=".*\.go\.id$" 
                              title="Gunakan email resmi pemerintahan berakhiran .go.id" 
                              placeholder="user@instansi.go.id" 
                              value={formData[`user${tab}_email`] || ''}
                              onChange={(e) => handleInputChange(`user${tab}_email`, e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                              Jabatan:
                            </label>
                            <input 
                              name={`user${tab}_jabatan`} 
                              type="text" 
                              required={tab <= 2} 
                              placeholder="Nama Jabatan Lengkap" 
                              value={formData[`user${tab}_jabatan`] || ''}
                              onChange={(e) => handleInputChange(`user${tab}_jabatan`, e.target.value)}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium mb-1.5" 
                            />
                            <span className="text-[10px] text-slate-500 font-medium leading-relaxed block">Contoh: Kepala Badan Perencanaan Pembangunan Daerah Prov. Jateng</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-6 rounded-2xl">
                    <h4 className="font-black text-blue-900 dark:text-blue-400 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Penting:
                    </h4>
                    <ul className="text-sm font-medium text-blue-800 dark:text-blue-300 space-y-2">
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Data <strong>User 1</strong> dan <strong>User 2</strong> wajib diisi sebagai syarat permohonan.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Field yang ditandai dengan bintang (<span className="text-rose-500">*</span>) wajib diisi.</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </form>

              <div className="flex justify-end mt-10">
                <button type="button" onClick={fillDummyData} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors opacity-50 hover:opacity-100">
                  Isi Data Dummy (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
