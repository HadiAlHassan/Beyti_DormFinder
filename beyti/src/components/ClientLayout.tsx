"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import StudentLayout from "./StudentLayout/StudentLayout";
import LandLordLayout from "./LandLordLayout/LandLordLayout";
import { getCookie } from "@/utils/cookieUtils";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudentPage = pathname.startsWith("/student");
  const isLandlordPage = pathname.startsWith("/landlord");
  const hideHeaderFooter =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isHomePage = pathname === "/";
  const { token, role } = getCookie();
  const dashboardLink = role === "landlord" ? "/landlord/" : "/student/";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isStudentPage ? (
        <StudentLayout>{children}</StudentLayout>
      ) : isLandlordPage ? (
        <LandLordLayout>{children}</LandLordLayout>
      ) : hideHeaderFooter ? (
        <main className="flex flex-col min-h-screen">{children}</main>
      ) : isHomePage ? (
        <div className="relative min-h-screen flex flex-col">
          <Image
            src="/HomePageBackground.jpg"
            alt="Homepage background"
            fill
            priority
            className="object-cover object-center -z-10"
          />

          {/* 🔹 Navigation Bar */}
          <nav className="w-full z-50 bg-black bg-opacity-70 shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
              <Link href="/" className="text-2xl font-bold text-green-600">
                <Image
                  src="/logo/BeytiWhiteFlat.png"
                  width={150}
                  height={10}
                  alt="Beyti Logo"
                />
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-white hover:text-secondary">
                  Home
                </Link>
                <Link
                  href="/about-us"
                  className="text-white hover:text-secondary"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-secondary"
                >
                  Contact Us
                </Link>
              </div>
              {token ? (
                <Link
                  href={dashboardLink}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login/user-login"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* 🔹 Page Content */}
          <main className="flex-grow">{children}</main>

          {/* 🔹 Footer */}
          <footer className="bg-black bg-opacity-70 py-6 text-center mt-auto">
            <p className="text-white">
              © 2025 CombinatorialSolutions. All rights reserved.
            </p>
          </footer>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* 🔹 Navigation Bar */}
          <nav className="w-full z-50 bg-black bg-opacity-70 shadow-md py-4">
            <div className="container mx-auto flex justify-between items-center px-6">
              <Link href="/" className="text-2xl font-bold text-green-600">
                <Image
                  src="/logo/BeytiWhiteFlat.png"
                  width={150}
                  height={10}
                  alt="Beyti Logo"
                />
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-white hover:text-secondary">
                  Home
                </Link>
                <Link
                  href="/about-us"
                  className="text-white hover:text-secondary"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-secondary"
                >
                  Contact Us
                </Link>
              </div>
              {token ? (
                <Link
                  href={dashboardLink}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login/user-login"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* 🔹 Page Content */}
          <main className="flex-grow">{children}</main>

          {/* 🔹 Footer */}
          <footer className="bg-black bg-opacity-70 py-6 text-center mt-auto">
            <p className="text-white">
              © 2025 CombinatorialSolutions. All rights reserved.
            </p>
          </footer>
        </div>
      )}
    </ThemeProvider>
  );
}
