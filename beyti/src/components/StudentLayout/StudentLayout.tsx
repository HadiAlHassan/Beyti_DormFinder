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
import { Home, Book, User, LogOut, Search } from "lucide-react"; // Icons
import ProtectedLayout from "../ProtectLayout";
import { UserProvider } from "@/context/UserContext";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <ProtectedLayout allowedRole="student" redirectTo="/">
    <UserProvider>
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
                href="/student/dashboard"
                className="flex items-center p-3 hover:bg-gray-100"
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/student/bookings"
                className="flex items-center p-3 hover:bg-gray-100"
              >
                <Book className="mr-2 h-5 w-5" />
                My Bookings
              </Link>
              <Link
                href="/student/explore"
                className="flex items-center p-3 hover:bg-gray-100"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Dorms
              </Link>
              <Link
                href="/student/profile"
                className="flex items-center p-3 hover:bg-gray-100"
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Link>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
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
        <main className="flex-grow w-full p-6 md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
    </UserProvider>
  </ProtectedLayout>
  );
}
