"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chatbot from "./Chatbot";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAuth();
  const isPublicPage = pathname === "/login" || pathname === "/sop";

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Menyiapkan Akses Aman...</p>
        </div>
      </div>
    );
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
