import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { MatchingProvider } from "@/context/MatchingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";



const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins",
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
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="h-full bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <AuthProvider>
            <MatchingProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </MatchingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

