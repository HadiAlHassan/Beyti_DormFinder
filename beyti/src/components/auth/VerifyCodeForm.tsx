"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyCodeForm({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: (code: string) => void;
}) {
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    const res = await fetch("http://localhost:5000/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (res.ok) {
      toast("Code Verified", { description: "Proceed to reset password." });
      onSuccess(code);
    } else {
      toast("Invalid Code", { description: data.message });
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
      <Input
        type="text"
        maxLength={6}
        placeholder="6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button onClick={handleVerify} className="w-full mt-4">Verify Code</Button>
    </>
  );
}
