"use client";
import { useState } from "react";
import ForgotPasswordForm from "./ForgetPasswordForm";
import VerifyCodeForm from "./VerifyCodeForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ForgotPasswordWrapper() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-white to-emerald-800">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-800">Let's Reset Your Password</h1>
          <p className="text-gray-600 text-sm mt-2">
            We'll walk you through it step by step
          </p>
        </div>
      {step === 1 && (
        <ForgotPasswordForm onSuccess={(e) => { setEmail(e); setStep(2); }} />
      )}
      {step === 2 && (
        <VerifyCodeForm email={email} onSuccess={(c) => { setCode(c); setStep(3); }} />
      )}
      {step === 3 && <ResetPasswordForm email={email} code={code} />}
    </div>
    </div>
  );
}
