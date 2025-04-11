"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, Book, User, LogOut, Compass } from "lucide-react";
import ProtectedLayout from "../ProtectLayout";
import { UserProvider } from "@/context/UserContext";
import { DormDataProvider } from "@/context/DormContext";
import { ApartmentProvider } from "@/context/ApartmentsContext";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRole="student" redirectTo="/">
      <UserProvider>
      <DormDataProvider>
      <ApartmentProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {/* 🔹 Sidebar Section */}
            <Sidebar className="w-64 shrink-0 border-r border-gray-200">
              <SidebarHeader>
                <h2 className="text-lg font-semibold">Student Dashboard</h2>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <Link
                    href="/student/home"
                    className="flex items-center p-3 hover:bg-gray-100"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Home
                  </Link>

                  <Link
                    href="/student/explore"
                    className="flex items-center p-3 hover:bg-gray-100"
                  >
                    <Compass className="mr-2 h-5 w-5" />
                    Explore Dorms
                  </Link>

                  <Link
                    href="/student/roomate"
                    className="flex items-center p-3 hover:bg-gray-100"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Find a Roommate
                  </Link>

                  <Link
                    href="/student/bookings"
                    className="flex items-center p-3 hover:bg-gray-100"
                  >
                    <Book className="mr-2 h-5 w-5" />
                    My Bookings
                  </Link>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <Link
                  href="/"
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Main Page
                </Link>

                <Link
                  href="/student/profile"
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>

                <Link
                  href="/logout"
                  className="flex items-center p-3 text-red-500 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Link>
              </SidebarFooter>
            </Sidebar>

            {/* 🔹 Main Content Section */}
            <main className="flex-grow w-full p-6 md:p-6">{children}</main>
          </div>
        </SidebarProvider>
      </ApartmentProvider>
      </DormDataProvider>
      </UserProvider>
    </ProtectedLayout>
  );
}
