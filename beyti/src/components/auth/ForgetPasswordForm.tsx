"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ForgotPasswordForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [lau_email, setEmail] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lau_email }),
    });

    const data = await res.json();
    if (res.ok) {
      toast("Code sent!", { description: "Check your inbox." });
      onSuccess(lau_email);
    } else {
      toast("Error", { description: data.message });
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      <Input
        type="email"
        placeholder="Enter your email"
        value={lau_email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleSubmit} className="w-full mt-4">Send Code</Button>
    </>
  );
}
