"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Clock, Download, FileText, Upload, AlertCircle, XCircle, Loader2, Lock, Unlock, Database, RefreshCw, Plus, FileCheck } from 'lucide-react';
import { useMatching, FileItem } from '@/context/MatchingContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"
          initial={{
            opacity: 0,
            x: Math.random() * 200 - 100,
            y: Math.random() * 80 - 40,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: 0,
            y: 0,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default function TrackingTimeline() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');
  const { reset } = useMatching();
  
  // Local state instead of global context to avoid polluting the Upload Dashboard
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [docs, setDocs] = useState({ bast: false, nda: false });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submissionOptions, setSubmissionOptions] = useState<any[]>([]);

  const mapStatusToProgress = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'VALIDATED': return 25;
      case 'MATCHING': return 50;
      case 'COMPLETED': return 100;
      default: return 0;
    }
  };




  // Fetch list of submissions for the dropdown
  useEffect(() => {
    fetch('/api/submissions?limit=50')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setSubmissionOptions(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const url = targetId ? `/api/submissions?id=${targetId}` : `/api/submissions?limit=1`;
      const res = await fetch(url).then(r => r.json());
      if (res.success && res.data.length > 0) {
        const latest = res.data[0];
        setSubmissionId(latest.id);
        setMatchingProgress(mapStatusToProgress(latest.status));
        setFiles([{
          id: latest.id,
          name: latest.file_name || 'berkas_pengajuan.csv',
          size: 2048,
          file: new File([""], latest.file_name || "berkas.csv"),
          status: 'success',
          errorRate: 0,
          errorList: [],
          totalRows: latest.total_rows || 0,
          matchScore: latest.matching_stats ? Math.round((latest.matching_stats.padan / latest.matching_stats.total) * 100) : 85
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sinkronisasi dengan database jika tidak ada file di state (misal: habis refresh)
  useEffect(() => {
    // If targetId is provided in URL, always override current context state
    // If no targetId, only fetch if files length is 0 (direct visit)
    if (targetId || files.length === 0) {
      const url = targetId ? `/api/submissions?id=${targetId}` : `/api/submissions?limit=1`;
      fetch(url)
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data.length > 0) {
            const latest = res.data[0];
            setSubmissionId(latest.id);
            setMatchingProgress(mapStatusToProgress(latest.status));
            
            setFiles([{
              id: latest.id,
              name: latest.file_name || 'berkas_pengajuan.csv',
              size: 2048,
              file: new File([""], latest.file_name || "berkas.csv"),
              status: 'success',
              errorRate: 0,
              errorList: [],
              totalRows: latest.total_rows || 0,
              matchScore: latest.matching_stats && latest.matching_stats.total > 0 
                ? Math.round((latest.matching_stats.padan / latest.matching_stats.total) * 100) 
                : 85
            }]);
          }
        })
        .catch(console.error);
    }
  }, [targetId, setSubmissionId, setMatchingProgress, setFiles]);

    const steps = [
    { 
      id: 1, name: 'Pengajuan Data', sla: '1 Hari Kerja (SLA)', 
      status: files.length > 0 ? 'completed' : 'current' 
    },
    { 
      id: 2, name: 'Cek Variabel (Sistem)', sla: '1-2 Hari Kerja (SLA)', 
      status: files.length === 0 ? 'pending' : matchingProgress > 20 ? 'completed' : 'current' 
    },
    { 
      id: 3, name: 'Proses Matching Lokal', sla: '3-5 Hari Kerja (SLA)', 
      status: matchingProgress < 20 ? 'pending' : matchingProgress >= 100 ? 'completed' : 'current' 
    },
    { 
      id: 4, name: 'Serah Terima Data', sla: '1 Hari Kerja (SLA)', 
      status: matchingProgress === 100 ? 'current' : 'pending' 
    },
  ];

  const isDownloadUnlocked = matchingProgress === 100 && docs.bast && docs.nda;

  const handleDownload = () => {
    if (!submissionId) return;
    
    const wb = XLSX.utils.book_new();
    
    const successfulFiles = files.filter(f => f.status === 'success');
    
    if (successfulFiles.length === 0) {
      const ws = XLSX.utils.json_to_sheet([{ Pesan: "Tidak ada data valid untuk diproses." }]);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    }

    for (const f of successfulFiles) {
      const numRows = Math.max(f.totalRows || 1, 10);
      const dummyData = Array.from({ length: numRows }).map((_, i) => {
        const isMatch = Math.random() > 0.2;
        const score = f.matchScore || Math.floor(Math.random() * 30 + 70);
        return {
          NIK: `'317${Math.floor(Math.random() * 10000000000000)}`,
          Nama: `Penduduk ${i+1} (${f.name.substring(0, 10)})`,
          Status_Padan: isMatch ? 'EXACT_MATCH' : 'TIDAK EXACT_MATCH',
          Skor_Levenshtein: score,
          ID_BPS_DTSEN: `DTSEN-${Math.floor(Math.random() * 10000)}`,
          'Catatan Pemadanan (Metode)': isMatch ? 'Pencarian Lapis 1 (Tanggal Lahir cocok).' : 'Pencarian Lapis 2 (Nama Murni): Tanggal Lahir berbeda / salah input.'
        };
      });

      const ws = XLSX.utils.json_to_sheet(dummyData);
      let sheetName = f.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 31);
      if (!sheetName) sheetName = `Sheet_${f.id}`;
      
      // Ensure unique sheet name
      let counter = 1;
      let finalName = sheetName;
      while (wb.SheetNames.includes(finalName)) {
        finalName = `${sheetName.substring(0, 28)}_${counter}`;
        counter++;
      }
      
      XLSX.utils.book_append_sheet(wb, ws, finalName);
    }
    
    const fileName = `Hasil_Pemadanan_${submissionId}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl w-full mx-auto space-y-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Tracking Progres Pemadanan</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Pantau status pemadanan per file. Perhatikan SLA pada masing-masing tahapan.</p>
        </div>
        <div className="flex items-center gap-3">
          {submissionId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-300 font-bold shadow-sm flex items-center overflow-hidden">
              <span className="pl-4 py-2 border-r border-blue-200 dark:border-blue-800 mr-2 opacity-75 text-sm">ID:</span>
              <select 
                value={submissionId || ''}
                onChange={(e) => {
                  router.push(`/tracking?id=${e.target.value}`);
                }}
                className="bg-transparent border-none text-blue-800 dark:text-blue-300 font-bold focus:ring-0 cursor-pointer py-2 pr-8 pl-1 text-sm outline-none"
              >
                {submissionOptions.length === 0 && <option value={submissionId || ''}>{submissionId}</option>}
                {submissionOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.id} - {opt.file_name.substring(0, 15)}{opt.file_name.length > 15 ? '...' : ''}</option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing} 
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-600 dark:text-slate-300 disabled:opacity-50"
            title="Cek Update Terbaru"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button 
            onClick={() => { reset(); router.push('/dashboard'); }} 
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Pengajuan Baru
          </button>
        </div>
      </div>

      {files.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-100">Belum ada pengajuan aktif.</p>
            <p className="text-sm opacity-90 text-blue-800 dark:text-blue-200 mt-1">Silakan upload data sasaran di menu Upload Data untuk memulai proses pemadanan.</p>
            <button onClick={() => router.push('/')} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
              Ke Halaman Upload
            </button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* SISI KIRI: TIMELINE */}
          <div className="w-full lg:w-1/3 glass rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-blue-900/10 sticky top-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all duration-500"></div>
<h3 className="font-bold text-xl text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 relative z-10">Status Tahapan</h3>
            <div className="relative">
              <div className="absolute top-5 left-5 bottom-5 w-[2px] bg-slate-100 dark:bg-slate-800 z-0"></div>
              <div className="space-y-8 relative z-10">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <motion.div 
                      initial={false}
                      animate={{ scale: step.status === 'current' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-surface shadow-sm ${
                      step.status === 'completed' ? 'bg-emerald-500 text-white' :
                      step.status === 'current' ? 'bg-blue-600 text-white shadow-blue-500/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                       step.status === 'current' ? <Clock className="w-5 h-5" /> : 
                       <Circle className="w-5 h-5" />}
                    </motion.div>
                    <div className={`pt-1 ${step.status === 'pending' ? 'opacity-50' : ''}`}>
                      <h4 className={`font-bold text-sm ${step.status === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{step.name}</h4>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <p className="text-[10px] uppercase tracking-wider font-bold">{step.sla}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SISI KANAN: DETAIL PROGRES */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* BOX 1: Cek Variabel Sistem */}
            {steps[1].status !== 'pending' && (
              <div className="glass rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Hasil Pengecekan Sistem
                </h3>
                <div className="space-y-2">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-sm shadow-sm hover:shadow-md transition-all">
                      <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{f.name}</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                        {f.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                        <span className={`font-bold text-xs ${f.status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {f.status === 'success' ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOX 2: Proses Matching */}
            {steps[2].status !== 'pending' && (
              <div className="glass rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
                {steps[2].status === 'current' && <Particles />}
                
                <div className="relative z-10">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-blue-600" /> Proses Pemadanan (Matching)
                  </h3>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 mb-6 shadow-inner">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                      <span>Core Engine: Levenshtein Matching</span>
                      <span>{matchingProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-blue-500 h-2.5 rounded-full relative"
                        initial={{ width: "20%" }}
                        animate={{ width: `${matchingProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[scan_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {files.filter(f => f.status === 'success').map(f => (
                      <div key={f.id} className="flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-slate-800 p-3 px-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{f.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {f.matchScore ? (
                            <>
                              <CheckCircle2 className={`w-4 h-4 ${f.matchScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`} />
                              <span className="font-black text-sm text-slate-900 dark:text-white">{f.matchScore}%</span>
                            </>
                          ) : (
                            <>
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                              <span className="text-xs font-bold text-blue-600">Memproses...</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BOX 3: Dokumen Serah Terima */}
            {steps[3].status !== 'pending' && (
              <div className="glass rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        Persyaratan Serah Terima
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Unggah dokumen BAST dan NDA untuk unduh data.</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className={`flex flex-col gap-2 p-3 border rounded-xl transition-colors ${docs.bast ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={docs.bast}
                            onChange={(e) => setDocs(d => ({ ...d, bast: e.target.checked }))}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Dokumen BAST</p>
                          </div>
                          <Upload className={`w-4 h-4 ${docs.bast ? 'text-blue-600' : 'text-slate-400'}`} />
                        </label>
                        {matchingProgress === 100 && (
                          <div className="ml-7">
                            <button onClick={() => window.open(`/api/bast?submissionId=${submissionId}`)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                              <Download className="w-3 h-3" /> Generate BAST
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${docs.nda ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                        <input 
                          type="checkbox" 
                          checked={docs.nda}
                          onChange={(e) => setDocs(d => ({ ...d, nda: e.target.checked }))}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Dokumen NDA</p>
                        </div>
                        <Upload className={`w-4 h-4 ${docs.nda ? 'text-blue-600' : 'text-slate-400'}`} />
                      </label>
                    </div>
                  </div>
                  
                  <div className="md:w-56 flex flex-col justify-center items-center p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3">
                      {isDownloadUnlocked ? <Unlock className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-slate-400" />}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Akses Unduh</h4>
                    <p className="text-[10px] font-medium text-slate-500 mb-4 px-2 leading-tight">
                      {isDownloadUnlocked ? 'Persyaratan lengkap.' : 'Menunggu syarat lengkap.'}
                    </p>
                    
                    <button 
                      onClick={handleDownload}
                      disabled={!isDownloadUnlocked}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        isDownloadUnlocked 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Data
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </motion.div>
  );
}
