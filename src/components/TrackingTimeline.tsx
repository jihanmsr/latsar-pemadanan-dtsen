"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Clock, FileCheck, Lock, Unlock, Download, Upload, AlertCircle, FileText, Loader2, XCircle } from 'lucide-react';
import { useMatching, FileItem } from '@/context/MatchingContext';
import { useRouter } from 'next/navigation';
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
  const { submissionId, files, matchingProgress, setMatchingProgress, docs, setDocs, updateFile } = useMatching();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto trigger process if files exist and not started yet
  useEffect(() => {
    if (files.length === 0) return;
    const allValidated = files.every(f => f.status === 'success' || f.status === 'error');
    if (allValidated && matchingProgress === 0 && !isProcessing) {
      runSequentialApis();
    }
  }, [files, matchingProgress, isProcessing]);

  const runSequentialApis = async () => {
    setIsProcessing(true);
    
    // Simulate delay for system check
    await new Promise(r => setTimeout(r, 1000));
    setMatchingProgress(20);

    // Process matching per file
    const successfulFiles = files.filter(f => f.status === 'success');
    for (let i = 0; i < successfulFiles.length; i++) {
      const f = successfulFiles[i];
      // Simulate Levenshtein processing
      await new Promise(r => setTimeout(r, 1500));
      const matchScore = Math.floor(Math.random() * (95 - 60 + 1) + 60); // Random 60-95%
      updateFile(f.id, { matchScore });
      
      const newProgress = 20 + Math.floor(((i + 1) / successfulFiles.length) * 80);
      setMatchingProgress(newProgress);
    }
    
    setMatchingProgress(100);
  };

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
          NIK: `317${Math.floor(Math.random() * 10000000000000)}`,
          Nama: `Penduduk ${i+1} (${f.name.substring(0, 10)})`,
          Status_Padan: isMatch ? 'EXACT_MATCH' : 'TIDAK EXACT_MATCH',
          Skor_Levenshtein: score,
          ID_BPS_DTSEN: `DTSEN-${Math.floor(Math.random() * 10000)}`
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
      className="max-w-4xl mx-auto space-y-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Tracking Progres Pemadanan</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Pantau status pemadanan per file. Perhatikan SLA pada masing-masing tahapan.</p>
        </div>
        {submissionId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl text-blue-800 dark:text-blue-300 font-bold shadow-sm whitespace-nowrap">
            ID: {submissionId}
          </div>
        )}
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
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 -z-0 hidden sm:block"></div>
            
            <div className="space-y-8 relative z-10">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
                  <div className="flex items-center sm:items-start gap-4 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-surface ${
                      step.status === 'completed' ? 'bg-success text-white' :
                      step.status === 'current' ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                       step.status === 'current' ? <Clock className="w-6 h-6 animate-pulse" /> : 
                       <Circle className="w-6 h-6" />}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 sm:hidden mt-2 absolute left-6 -z-10"></div>
                    )}
                  </div>
                  
                  <div className={`pt-2 flex-1 ${step.status === 'pending' ? 'opacity-50' : ''} relative`}>
                    <h3 className={`font-bold text-lg ${step.status === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {step.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mt-1 font-bold text-slate-500 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="uppercase text-xs tracking-wider">{step.sla}</span>
                    </div>
                    
                    {/* Visualisasi per file di tahap Cek Variabel */}
                    {step.id === 2 && step.status !== 'pending' && (
                      <div className="mt-4 space-y-2">
                         {files.map(f => (
                           <div key={f.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                              <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{f.name}</span>
                              <div className="flex items-center gap-2">
                                {f.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                                <span className={`font-bold ${f.status === 'success' ? 'text-success' : 'text-rose-500'}`}>
                                  {f.status === 'success' ? 'Valid' : 'Invalid'}
                                </span>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}

                    {step.id === 3 && step.status !== 'pending' && (
                      <div className="mt-4 space-y-4 relative">
                        <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                          <span>The Core Engine: Levenshtein Matching</span>
                          <span>{matchingProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <motion.div 
                            className="bg-blue-600 h-2.5 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] relative"
                            initial={{ width: "20%" }}
                            animate={{ width: `${matchingProgress}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            <div className="absolute inset-0 bg-white/20 w-full animate-[scan_2s_linear_infinite]" />
                          </motion.div>
                        </div>
                        
                        <div className="space-y-2 mt-4 relative z-10">
                          {files.filter(f => f.status === 'success').map(f => (
                            <div key={f.id} className="flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300 truncate max-w-[150px] sm:max-w-[200px]">{f.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {f.matchScore ? (
                                  <>
                                    <CheckCircle2 className={`w-4 h-4 ${f.matchScore >= 70 ? 'text-success' : 'text-amber-500'}`} />
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{f.matchScore}%</span>
                                    {f.matchScore < 70 && (
                                      <button className="ml-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold shadow-sm transition-colors flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Review
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    <span className="text-sm font-bold text-blue-600">Proses...</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {step.status === 'current' && <Particles />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Dokumen Persyaratan Serah Terima
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Unggah dokumen BAST dan NDA yang telah ditandatangani untuk membuka akses unduh data balikan.</p>
              </div>
              
              <div className="space-y-3">
                <div className={`flex flex-col gap-2 p-4 border rounded-lg transition-colors ${docs.bast ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={docs.bast}
                      onChange={(e) => setDocs(d => ({ ...d, bast: e.target.checked }))}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">Dokumen BAST (Berita Acara Serah Terima)</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Format PDF terenkripsi</p>
                    </div>
                    <Upload className={`w-5 h-5 ${docs.bast ? 'text-blue-600' : 'text-slate-400'}`} />
                  </label>
                  {matchingProgress === 100 && (
                    <div className="ml-8">
                      <button onClick={() => window.open(`/api/bast?submissionId=${submissionId}`)} className="text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                        <Download className="w-4 h-4" /> Generate & Download BAST
                      </button>
                    </div>
                  )}
                </div>
                
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${docs.nda ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input 
                    type="checkbox" 
                    checked={docs.nda}
                    onChange={(e) => setDocs(d => ({ ...d, nda: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">Dokumen NDA (Non-Disclosure Agreement)</p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Format PDF terenkripsi</p>
                  </div>
                  <Upload className={`w-5 h-5 ${docs.nda ? 'text-blue-600' : 'text-slate-400'}`} />
                </label>
              </div>
            </div>
            
            <div className="flex-1 md:max-w-xs flex flex-col justify-center items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 text-slate-400">
                {isDownloadUnlocked ? <Unlock className="w-8 h-8 text-success" /> : <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Akses Unduh Data</h4>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
                {isDownloadUnlocked 
                  ? 'Persyaratan lengkap. Data balikan tersedia untuk diunduh.' 
                  : matchingProgress < 100 
                    ? 'Terkunci. Menunggu proses matching selesai.' 
                    : 'Terkunci. Harap lengkapi dokumen BAST dan NDA.'}
              </p>
              
              <button 
                onClick={handleDownload}
                disabled={!isDownloadUnlocked}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all shadow-sm ${
                  isDownloadUnlocked 
                    ? 'bg-success hover:bg-success-dark text-white shadow-md hover:-translate-y-0.5' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-5 h-5" />
                Unduh Real Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
