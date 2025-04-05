"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      toast("Error", { description: "Passwords do not match." });
      return;
    }

    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword, role}),
    });

    const data = await res.json();
    if (res.ok) {
      toast("Success", { description: "Password updated!" });
      setTimeout(() => window.location.href = "/login", 1500);
    } else {
      toast("Failed", { description: data.message });
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Set New Password</h2>
      <Input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mt-2"
      />
      <Button onClick={handleReset} className="w-full mt-4">Reset Password</Button>
    </>
  );
}
