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
import { Home, Building, ClipboardList, User, LogOut } from "lucide-react"; // Icons
import ProtectedLayout from "../ProtectLayout";


export default function LandLordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <ProtectedLayout allowedRole="landlord" redirectTo="/">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* 🔹 Sidebar Section */}
          <Sidebar className="w-64 shrink-0 border-r border-gray-200">
            <SidebarHeader>
              <h2 className="text-lg font-semibold">Landlord</h2>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <Link
                  href={`/landlord/dashboard`}
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/landlord/properties"
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <Building className="mr-2 h-5 w-5" />
                  My Properties
                </Link>
                <Link
                  href="/landlord/bookings"
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Manage Bookings
                </Link>
                <Link
                  href="/landlord/profile"
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <Link
                href="/"
                className="flex items-center p-3 hover:bg-gray-100"
              >
                <Home className="mr-2 h-5 w-5" />
                Home Page
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
    </ProtectedLayout>
  );
}
