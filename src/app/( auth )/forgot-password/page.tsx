"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle } from "lucide-react";

type Step = "identifier" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setResetToken(data.resetToken);
      setStep("password");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, resetToken, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <img src="/logo/logo2.png" alt="onecarta logo" className="h-9 w-auto object-contain mx-auto" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            {step === "identifier" && "Forgot Password?"}
            {step === "otp" && "Check Your Inbox"}
            {step === "password" && "Set New Password"}
            {step === "done" && "All Set!"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {step === "identifier" && "Enter your account email or phone to receive a reset code"}
            {step === "otp" && `We sent a 6-digit code to ${identifier}`}
            {step === "password" && "Choose a strong new password for your account"}
            {step === "done" && "Your password has been reset successfully"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {step === "identifier" && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors"><Mail size={15} /></span>
              <input
                type="text" id="identifier" placeholder=" " required value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
              />
              <label htmlFor="identifier" className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]">
                Email Address or Phone Number
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors"><KeyRound size={15} /></span>
              <input
                type="text" id="otp" inputMode="numeric" placeholder=" " required value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10 tracking-[0.3em] font-bold"
              />
              <label htmlFor="otp" className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]">
                6-Digit Code
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
              {!loading && <ArrowRight size={13} />}
            </button>

            <p className="text-center text-[11px] text-gray-500">
              Didn't get the code?{" "}
              <button type="button" onClick={handleResend} disabled={loading} className="font-bold text-[#2c2769] hover:underline ml-1 cursor-pointer disabled:opacity-50">
                Resend
              </button>
            </p>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors"><Lock size={15} /></span>
              <input
                type="password" id="newPassword" placeholder=" " required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
              />
              <label htmlFor="newPassword" className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]">
                New Password
              </label>
            </div>

            <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors"><Lock size={15} /></span>
              <input
                type="password" id="confirmPassword" placeholder=" " required minLength={6} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
              />
              <label htmlFor="confirmPassword" className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20 peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]">
                Confirm New Password
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Reset Password"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle size={56} className="animate-bounce" />
            </div>
            <p className="text-sm text-gray-500 mt-2 px-4">Your password has been reset. You can now sign in with your new password.</p>
            <div className="mt-8">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Back to Home <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step !== "done" && (
          <p className="text-center text-[11px] text-gray-500 mt-6">
            Remember your password?{" "}
            <button onClick={() => router.push("/")} type="button" className="font-bold text-[#2c2769] hover:underline ml-1">
              Sign In here
            </button>
          </p>
        )}

      </div>
    </div>
  );
}