import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beyti - Find Your Perfect Dorm",
  description: "Affordable, convenient, and tailored for students.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
          {/* Div for Background Image */}
          <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: "url('HomePageBackground.png')" }} // Change this path to your actual image
          >

            {/* Nav Bar */}
            
            <nav className="sticky top-0 left-0 w-full z-50 bg-black bg-opacity-70 shadow-md py-4">
              <div className="container mx-auto flex justify-between items-center px-6">
                <Link href="/" className="text-2xl font-bold text-green-600">
                 <Image src="/logo/BeytiWhiteFlat.png" width={150} height={10} alt="Beyti Logo"></Image>
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link href="/" className="text-white hover:text-secondary">
                    Home
                  </Link>
                  <Link href="/about-us" className="text-white hover:text-secondary">
                    About Us
                  </Link>
                  <Link href="/rate-us" className="text-white hover:text-secondary">
                    Rate Us
                  </Link>
                  <Link href="/contact" className="text-white hover:text-secondary">
                    Contact
                  </Link>
                </div>
                <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
                  Login / Sign up
                </Link>
              </div>
            </nav>

            {/* 🔹 PAGE CONTENT */}
            <main className="flex flex-col min-h-screen">
              {children}
            </main>

          {/* 🔹 FOOTER (Outside Background Image Wrapper) */}
          <footer className="bg-black bg-opacity-70 py-6 text-center">
            <p className="text-white">© 2025 CombinatorialSolutions. All rights reserved.</p>
          </footer>
          </div>


          
        </ThemeProvider>
      </body>
    </html>
  );
}
