import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MatchingProvider } from "@/context/MatchingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingFeedback from "@/components/FloatingFeedback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAKEWA - Padanan Kesejahteraan Warga",
  description: "Aplikasi PAKEWA (Padanan Kesejahteraan Warga) untuk pemadanan data sosial ekonomi yang aman dan andal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
          <AuthProvider>
            <MatchingProvider>
              <ClientLayout>
                {children}
                <FloatingWhatsApp />
                <FloatingFeedback />
              </ClientLayout>
            </MatchingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

