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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      {step === 1 && (
        <ForgotPasswordForm onSuccess={(e) => { setEmail(e); setStep(2); }} />
      )}
      {step === 2 && (
        <VerifyCodeForm email={email} onSuccess={(c) => { setCode(c); setStep(3); }} />
      )}
      {step === 3 && <ResetPasswordForm email={email} code={code} />}
    </div>
  );
}
