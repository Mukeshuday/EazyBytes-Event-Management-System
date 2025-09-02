import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

// ✅ Load Google Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EasyBytes",
  description: "Events & Bookings App",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#111827", // dark navbar gray
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <Navbar />
        <main className="max-w-4xl mx-auto mt-6 p-4">{children}</main>

        {/* ✅ Toast container available globally */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
