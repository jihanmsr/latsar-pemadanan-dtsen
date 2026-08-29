"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chatbot from "./Chatbot";
import FloatingWhatsApp from "./FloatingWhatsApp";
import FloatingFeedback from "./FloatingFeedback";
import JumpingMascot from "./JumpingMascot";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/cek-status" || pathname === "/laporan-testing" || pathname === "/panduan" || pathname === "/tracking" || pathname === "/sop";

  // 1. Render public pages immediately without blocking on authentication loading
  if (isPublicPage) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
        {/* Floating buttons for public pages */}
        <JumpingMascot />
        <FloatingWhatsApp />
        <Chatbot />
      </>
    );
  }

  // 2. Only private/protected pages wait for authentication check
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted font-bold animate-pulse uppercase tracking-widest text-xs">Menyiapkan Akses Aman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster position="top-right" richColors theme="system" />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div key={pathname} className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
      {/* Floating buttons for authenticated pages */}
      <FloatingFeedback />
      <Chatbot />
    </div>
  );
}
