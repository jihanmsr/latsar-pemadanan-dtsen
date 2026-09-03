"use client";

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle2, XCircle, FileText, Loader2, ShieldCheck, AlertTriangle, Play, Plus, Trash2, Lock, ChevronDown, ChevronUp, Download } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useMatching, FileItem } from '@/context/MatchingContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { validateNIK } from '@/utils/validation';
import { generateManifest, ManifestMetadata } from '@/utils/manifest';
import ManifestModal from './ManifestModal';
import MoUUpload from './MoUUpload';

export default function UploadForm() {
  const { submissionId, setSubmissionId, files, addFile, removeFile, updateFile, reset } = useMatching();
  const router = useRouter();

  const [isValidating, setIsValidating] = useState(false);
  const [isMouChecked, setIsMouChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  useEffect(() => {
    if (submissionId && files.length > 0 && !showPrompt) {
      setShowPrompt(true);
    }
  }, []);

  const filterFiles = (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    Array.from(fileList).forEach(f => {
      if (f.name.endsWith('.docx') || f.name.endsWith('.txt')) {
        alert(`File ${f.name} ditolak. Sistem ini dikhususkan untuk format data terstruktur (.csv, .xlsx) atau citra KTP (OCR).`);
      } else {
        validFiles.push(f);
      }
    });
    return validFiles;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      filterFiles(e.target.files).forEach(f => addFile(f));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      filterFiles(e.dataTransfer.files).forEach(f => addFile(f));
    }
  };

  const startValidation = async () => {
    setIsValidating(true);
    const idleFiles = files.filter(f => f.status === 'idle');
    
    for (const f of idleFiles) {
      updateFile(f.id, { status: 'validating' });
      await validateSingleFile(f);
    }
    setIsValidating(false);
  };

  const validateTextContent = (text: string, sourceName: string, finish: any) => {
    const matches = text.match(/\b\d{16}\b/g) || [];
    let hasValidNik = false;
    let errors: string[] = [];
    
    if (matches.length === 0) {
       errors.push(`${sourceName}: Tidak ada NIK (16 digit angka) yang terdeteksi.`);
    } else {
       let validFound = false;
       for (const match of matches) {
          const validation = validateNIK(match, null, null);
          if (validation.isValid) {
             validFound = true; break;
          } else {
             errors.push(`${sourceName}: ${validation.reason} (${match})`);
          }
       }
       if (validFound) hasValidNik = true;
       else if (errors.length > 5) errors = errors.slice(0, 5);
    }
    
    finish(hasValidNik, errors, 1, ["Teks Diekstrak (OCR)"], [[text.substring(0, 200) + "..."]]);
  };

  const validateSingleFile = async (item: FileItem) => {
    return new Promise<void>((resolve) => {
      const file = item.file;
      
      const finish = (hasValidNik: boolean, errors: string[], rows: number, previewHeaders: string[], previewRows: any[][]) => {
        updateFile(item.id, {
          status: hasValidNik && errors.length <= Math.max(rows * 0.05, 1) ? 'success' : 'error',
          errorList: errors,
          errorRate: rows > 0 ? (errors.length / rows) * 100 : (hasValidNik ? 0 : 100),
          totalRows: rows,
          previewHeaders,
          previewRows
        });
        resolve();
      };

      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Mock PDF Extraction
        setTimeout(() => {
          const mockText = "DOKUMEN KARTU KELUARGA\nNIK: 3171015205900001\nNama: Jihan Maisaroh";
          validateTextContent(mockText, "Dokumen PDF (Simulasi Ekstraksi)", finish);
        }, 1200);
        return;
      }
      else if (file.type.startsWith('image/')) {
        import('tesseract.js').then((Tesseract) => {
          Tesseract.recognize(file, 'ind').then(({ data: { text } }) => {
            validateTextContent(text, "Gambar OCR", finish);
          }).catch(() => finish(false, ["Gagal memindai gambar OCR"], 0, [], []));
        }).catch(() => finish(false, ["Gagal memuat modul OCR"], 0, [], []));
      }
      else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 }) as any[][];
            
            if (json.length === 0) {
               finish(false, ["File Excel Kosong"], 0, [], []);
               return;
            }

            const rawHeaders = (json[0] || []).map(h => h ? h.toString() : '');
            const dataRows = json.slice(1).filter(r => r.length > 0);
            
            const genderIdx = rawHeaders.findIndex(h => h && h.toLowerCase().match(/jenis\s*kelamin|gender|jk|j\.k/));
            const dobIdx = rawHeaders.findIndex(h => h && h.toLowerCase().match(/tanggal\s*lahir|tgl\s*lahir|dob|tanggallahir/));

            let hasValidNik = false;
            let errors: string[] = [];
            
            dataRows.forEach((row, idx) => {
              const genderContext = genderIdx !== -1 ? row[genderIdx] : null;
              const dobContext = dobIdx !== -1 ? row[dobIdx] : null;

              let foundCandidate = false;
              let specificError = "";
              for (let j=0; j<row.length; j++) {
                if (row[j]) {
                   const val = row[j].toString().trim();
                   if (/^\d{16}$/.test(val)) {
                      const validation = validateNIK(val, genderContext, dobContext);
                      if (validation.isValid) {
                         hasValidNik = true; 
                         foundCandidate = true;
                         specificError = "";
                         break;
                      } else {
                         specificError = validation.reason || "NIK Tidak Valid";
                      }
                   }
                }
              }
              if (!foundCandidate) {
                 if (specificError) errors.push(`Baris ${idx+2}: ${specificError}`);
                 else errors.push(`Baris ${idx+2}: NIK tidak valid atau tidak ditemukan.`);
              }
            });

            const previewHeaders = rawHeaders;
            const previewRows = dataRows.slice(0, 5).map(row => rawHeaders.map((_, i) => row[i] || ''));

            finish(hasValidNik, errors, dataRows.length, previewHeaders, previewRows);
          } catch(e) {
            finish(false, ["Gagal membaca file Excel"], 0, [], []);
          }
        };
        reader.readAsArrayBuffer(file);
      }
      else {
        Papa.parse(file, {
          header: true, skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as Record<string, string>[];
            const rawHeaders = results.meta.fields || [];
            
            const genderKey = rawHeaders.find(h => h && h.toLowerCase().match(/jenis\s*kelamin|gender|jk|j\.k/));
            const dobKey = rawHeaders.find(h => h && h.toLowerCase().match(/tanggal\s*lahir|tgl\s*lahir|dob|tanggallahir/));

            let hasValidNik = false;
            let errors: string[] = [];
            
            data.forEach((row, idx) => {
              const genderContext = genderKey ? row[genderKey] : null;
              const dobContext = dobKey ? row[dobKey] : null;

              let foundCandidate = false;
              let specificError = "";
              for (const key of rawHeaders) {
                if (row[key]) {
                   const val = row[key].toString().trim();
                   if (/^\d{16}$/.test(val)) {
                      const validation = validateNIK(val, genderContext, dobContext);
                      if (validation.isValid) {
                         hasValidNik = true; 
                         foundCandidate = true;
                         specificError = "";
                         break;
                      } else {
                         specificError = validation.reason || "NIK Tidak Valid";
                      }
                   }
                }
              }
              if (!foundCandidate) {
                 if (specificError) errors.push(`Baris ${idx+2}: ${specificError}`);
                 else errors.push(`Baris ${idx+2}: NIK tidak valid atau tidak ditemukan.`);
              }
            });

            const previewHeaders = rawHeaders;
            const previewRows = data.slice(0, 5).map(row => rawHeaders.map(h => row[h] || ''));

            finish(hasValidNik, errors, data.length, previewHeaders, previewRows);
          },
          error: () => finish(false, ["Gagal membaca CSV"], 0, [], [])
        });
      }
    });
  };

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleContinue = async () => {
    try {
      setIsValidating(true);
      await new Promise(r => setTimeout(r, 1000));
      
      if (!submissionId) {
        setSubmissionId(`REQ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`);
      }
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error finalizing:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleResetSubmission = () => {
    reset();
    setShowPrompt(false);
  };

  const totalFiles = files.length;
  const processedFiles = files.filter(f => f.status === 'success' || f.status === 'error').length;
  const globalProgress = totalFiles === 0 ? 0 : Math.round((processedFiles / totalFiles) * 100);
  const idleFilesCount = files.filter(f => f.status === 'idle').length;
  const allSuccess = totalFiles > 0 && files.every(f => f.status === 'success');
  const hasErrors = files.some(f => f.status === 'error');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full flex flex-col space-y-6 relative pb-8"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Upload Data Pengajuan</h2>
        <p className="text-slate-600 dark:text-slate-400">Unggah satu atau beberapa file sekaligus. Sistem akan memvalidasi seluruh file dalam antrean.</p>
      </div>

      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-4 shadow-sm overflow-hidden"
          >
            <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 dark:text-blue-100">Pengajuan Aktif Ditemukan</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 mb-3">Anda memiliki pengajuan <strong>{submissionId}</strong> yang sedang berlangsung. Apakah Anda ingin menambahkan file ke pengajuan ini, atau membuat pengajuan baru?</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPrompt(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah File
                </button>
                <button onClick={handleResetSubmission} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold shadow-sm transition-colors">
                  Buat Pengajuan Baru
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MoUUpload onUploadSuccess={() => setIsMouChecked(true)} />

      <motion.div 
        whileHover={isMouChecked ? { scale: 1.02 } : {}}
        whileTap={isMouChecked ? { scale: 0.98 } : {}}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all relative overflow-hidden group ${
            isMouChecked 
              ? 'border-blue-300 dark:border-slate-600 bg-blue-50/40 dark:bg-slate-800/40 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-100/50 dark:hover:bg-slate-800/80 cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
              : 'border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/20 cursor-not-allowed opacity-70'
           }`}
           onClick={() => isMouChecked && fileInputRef.current?.click()}
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => { e.preventDefault(); if (isMouChecked) handleDrop(e); }}
      >
        {isMouChecked && (
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite]" />
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".csv, .xlsx, .xls, image/png, image/jpeg, image/jpg, application/pdf, .pdf"
        />
        <div className="flex flex-col items-center gap-5 relative z-10">
          <motion.div 
            animate={isMouChecked ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm ${isMouChecked ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-600' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            {isMouChecked ? <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400" /> : <Lock className="w-10 h-10 text-slate-400" />}
          </motion.div>
          <div>
            <p className={`text-xl font-black tracking-tight ${isMouChecked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              {isMouChecked ? 'Klik atau seret file ke sini' : 'Centang MoU untuk mengunggah file'}
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Format didukung: .csv, .xlsx, .pdf, .png, .jpg</p>
          </div>
        </div>
      </motion.div>

      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Daftar Antrean File ({files.length})
            </h3>
            {idleFilesCount > 0 && !isValidating && (
              <button onClick={startValidation} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                Mulai Validasi {idleFilesCount} File
              </button>
            )}
          </div>

          {(globalProgress > 0 || isValidating) && (
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Global Progress</span>
                <span>{globalProgress}% ({processedFiles}/{totalFiles})</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${globalProgress}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {files.map(f => {
              const isExpanded = expandedFileId === f.id;
              
              return (
                <div key={f.id} className={`border ${f.status === 'error' ? 'border-rose-200 dark:border-rose-900/50' : 'border-slate-200 dark:border-slate-700'} rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-shadow hover:shadow-sm`}>
                  {/* File Header (Clickable Accordion) */}
                  <div 
                    onClick={() => setExpandedFileId(isExpanded ? null : f.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      {f.status === 'validating' ? <Loader2 className="w-6 h-6 text-blue-600 animate-spin shrink-0" /> :
                       f.status === 'success' ? <CheckCircle2 className="w-6 h-6 text-success shrink-0" /> :
                       f.status === 'error' ? <XCircle className="w-6 h-6 text-rose-500 shrink-0" /> :
                       <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />}
                      
                      <div className="truncate">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{f.name}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {(f.size / 1024).toFixed(1)} KB
                          {f.status !== 'idle' && f.status !== 'validating' && (
                            <span className="ml-3 text-slate-400">| Total: {f.totalRows} Baris</span>
                          )}
                          {f.status === 'error' && <span className="text-rose-500 ml-3 font-bold">Error: {f.errorRate?.toFixed(1)}%</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} 
                        disabled={isValidating} 
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <div className="p-4 space-y-4">
                          
                          {/* Data Preview */}
                          {(f.status === 'success' || f.status === 'error') && f.previewRows && f.previewRows.length > 0 ? (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Data Preview (5 Baris Pertama)</h4>
                                

                              </div>

                              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                      {f.previewHeaders?.slice(0, 6).map((h, i) => (
                                        <th key={i} className="px-3 py-2 text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">{h || `Kolom ${i+1}`}</th>
                                      ))}
                                      {f.previewHeaders && f.previewHeaders.length > 6 && (
                                        <th className="px-3 py-2 text-slate-500 italic whitespace-nowrap">+{f.previewHeaders.length - 6} kolom lainnya</th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {f.previewRows.map((row, i) => (
                                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        {f.previewHeaders?.slice(0, 6).map((_, j) => (
                                          <td key={j} className="px-3 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {row[j]?.toString().substring(0, 50) || '-'}
                                          </td>
                                        ))}
                                        {f.previewHeaders && f.previewHeaders.length > 6 && (
                                          <td className="px-3 py-2 text-slate-400 italic">...</td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (f.status === 'idle' || f.status === 'validating') ? (
                            <p className="text-sm text-slate-500 italic text-center py-4">Data preview akan muncul setelah file selesai divalidasi.</p>
                          ) : null}

                          {/* Error Log Spesifik */}
                          {f.status === 'error' && f.errorList && f.errorList.length > 0 && (
                            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-lg p-4 mt-2">
                              <p className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Comprehensive Error Log:
                              </p>
                              <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                <ul className="list-disc pl-5 space-y-1">
                                  {f.errorList.slice(0, 100).map((err, i) => (
                                    <li key={i} className="text-xs text-rose-600 dark:text-rose-300 font-medium">{err}</li>
                                  ))}
                                  {f.errorList.length > 100 && (
                                    <li className="text-xs text-rose-500 font-bold italic mt-2">...dan {f.errorList.length - 100} error lainnya tidak ditampilkan.</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold flex items-center gap-2">
              {allSuccess ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <span className="text-success">Semua file lolos validasi.</span>
                </>
              ) : hasErrors ? (
                <>
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400">Harap perbaiki atau hapus file yang gagal.</span>
                </>
              ) : (
                <span className="text-slate-500">Menunggu validasi selesai...</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsManifestModalOpen(true)}
                disabled={!allSuccess || globalProgress < 100 || totalFiles === 0 || isValidating}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-md ${
                  allSuccess && globalProgress === 100 && totalFiles > 0
                    ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 hover:-translate-y-0.5'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <Download className="w-5 h-5" />
                Unduh Manifes Global
              </button>

              <button
                onClick={handleContinue}
                disabled={!allSuccess || totalFiles === 0 || isValidating}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold transition-all shadow-md ${
                  allSuccess && totalFiles > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                Lanjutkan Pengajuan
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <ManifestModal 
        isOpen={isManifestModalOpen} 
        onClose={() => setIsManifestModalOpen(false)} 
        onGenerate={(metadata) => generateManifest(files, metadata)} 
      />

      {/* Success Ticket Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="p-8 pb-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-900 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pengajuan Berhasil!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Data sasaran Anda telah masuk ke dalam antrean pemadanan sistem BPS. Berikut adalah kode tiket (resi) pengajuan Anda:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Kode Tiket</p>
                  <p className="text-xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-tight">{submissionId}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    reset();
                    // Just close modal and reset, staying on dashboard to see history
                  }}
                  className="px-4 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-r border-slate-100 dark:border-slate-800"
                >
                  Lihat Riwayat
                </button>
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.push('/tracking');
                  }}
                  className="px-4 py-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex justify-center items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Lacak Progres
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
