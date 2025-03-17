"use client"
import { useEffect } from "react";
import SignupForm from "@/components/UserAuthForm/SignupForm";
import Poster from "@/components/Login/Poster";
import {getCookie} from "@/utils/cookieUtils"
import { redirect } from "next/navigation";

export default function UserSignupPage() {
  useEffect(() => {
    const token = getCookie("authToken");
    if (token) {
      redirect("/dashboard");
    }
  }, []);

  return (
    <main className="flex gap-5">
      <div className="w-1/2 flex h-screen">
        <Poster dynamicText="Please enter your personal info as stated in your legal documents" />
      </div>
      <div className="w-1/2 flex justify-center items-center relative m-5">
        <SignupForm />
      </div>
    </main>
  );
}
