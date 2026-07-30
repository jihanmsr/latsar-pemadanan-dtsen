"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chatbot from "./Chatbot";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register" || (pathname === "/sop" && !user);

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

  if (isPublicPage) {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
      </>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Toaster position="top-right" richColors theme="system" />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
