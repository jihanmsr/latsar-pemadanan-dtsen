import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoUUploadProps {
  onUploadSuccess: () => void;
  title?: string;
  description?: string;
  accept?: string;
}

export default function MoUUpload({ onUploadSuccess, title = "Dokumen Kelengkapan", description = "Sesuai SOP, unggah file kelengkapan.", accept = ".pdf,.docx,.jpg,.png,.zip,.rar" }: MoUUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsError(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setIsError(false);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      
      // Simulate error conditions
      if (file.size > 10 * 1024 * 1024) {
        setIsError(true);
        setErrorMessage("Ukuran file terlalu besar. Maksimal 10 MB.");
        return;
      }
      
      const fileNameLower = file.name.toLowerCase();
      if (fileNameLower.includes('error') || fileNameLower.includes('gagal') || fileNameLower.includes('virus')) {
        setIsError(true);
        setErrorMessage("Sistem menolak file: Format tidak sesuai atau koneksi terputus.");
        return;
      }
      
      setIsSuccess(true);
      onUploadSuccess();
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
      </div>

      {!isSuccess && !isError ? (
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept={accept} 
              onChange={handleFileChange}
            />
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            {file ? (
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{file.name}</p>
            ) : (
              <p className="text-sm text-slate-500">Klik untuk memilih file dokumen MoU</p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors ${
              !file || isUploading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isUploading ? (
              <>Mengunggah...</>
            ) : (
              <>Unggah Dokumen</>
            )}
          </button>
        </div>
      ) : isError ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-300">Gagal Mengunggah Dokumen</p>
              <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsError(false); setFile(null); }}
            className="text-xs text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline font-medium"
          >
            Coba Lagi
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-bold text-green-800 dark:text-green-300">Dokumen Kelengkapan Berhasil Diunggah</p>
              <p className="text-xs text-green-600 dark:text-green-400">{file?.name}</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsSuccess(false); setFile(null); }}
            className="text-xs text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 underline font-medium"
          >
            Ganti File
          </button>

        </motion.div>
      )}
    </div>
  );
}
