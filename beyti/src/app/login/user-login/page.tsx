"use client"
import LoginForm from "@/components/UserAuthForm/LoginForm"
import Poster from "@/components/Login/Poster"
import { useEffect } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { redirect } from "next/navigation";
export default function UserLoginPage() {
  
  useEffect(() => {
      const token = getCookie("authToken");
      if (token) {
        redirect("/dashboard");
      }
    }, []);
    return (
      <main className="flex">
        <div className="w-1/2 flex justify-center items-center">
          <LoginForm />
        </div>
  
        <div className="w-1/2 flex h-screen">
          <Poster dynamicText="More than just a dorm - Find your perfect home away from home!" />
        </div>
      </main>
    );
  }