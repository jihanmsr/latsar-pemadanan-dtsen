"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type FileItem = {
  id: string;
  name: string;
  size: number;
  file: File;
  status: 'idle' | 'validating' | 'success' | 'error';
  errorRate: number;
  errorList: string[];
  totalRows: number;
  matchScore?: number;
  previewHeaders?: string[];
  previewRows?: any[][];
};

type MatchingState = {
  submissionId: string | null;
  files: FileItem[];
  matchingProgress: number; // 0 to 100 overall
  docs: { bast: boolean; nda: boolean };
  
  setSubmissionId: (id: string | null) => void;
  setFiles: (files: FileItem[] | ((prev: FileItem[]) => FileItem[])) => void;
  setMatchingProgress: (val: number | ((prev: number) => number)) => void;
  setDocs: (docs: { bast: boolean; nda: boolean } | ((prev: { bast: boolean; nda: boolean }) => { bast: boolean; nda: boolean })) => void;
  
  addFile: (file: File) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  removeFile: (id: string) => void;
  reset: () => void;
};

const MatchingContext = createContext<MatchingState | undefined>(undefined);

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [docs, setDocs] = useState({ bast: false, nda: false });

  const addFile = (file: File) => {
    setFiles(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        file,
        status: 'idle',
        errorRate: 0,
        errorList: [],
        totalRows: 0
      }
    ]);
  };

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const reset = () => {
    setSubmissionId(null);
    setFiles([]);
    setMatchingProgress(0);
    setDocs({ bast: false, nda: false });
  };

  return (
    <MatchingContext.Provider value={{
      submissionId, files, matchingProgress, docs,
      setSubmissionId, setFiles, setMatchingProgress, setDocs,
      addFile, updateFile, removeFile, reset
    }}>
      {children}
    </MatchingContext.Provider>
  );
}

export function useMatching() {
  const context = useContext(MatchingContext);
  if (context === undefined) {
    throw new Error('useMatching must be used within a MatchingProvider');
  }
  return context;
}
