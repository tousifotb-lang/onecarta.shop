"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    const verifyRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      throw new Error(verifyData.error || "Login failed");
    }

    const result = await signIn("credentials", {
      userObject: JSON.stringify(verifyData),
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Session creation failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await performLogin(email, password);
      } else {
        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const registerData = await registerRes.json();

        if (!registerRes.ok) {
          throw new Error(registerData.error || "Registration failed");
        }

        await performLogin(email, password);
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-sm transition-all">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl font-extrabold tracking-tight text-[#1a1a2e]">
              one<span style={{ color: "#2c2769" }}>carta</span>
              <span className="text-xs align-super text-gray-400">TM</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            {isLogin ? "Welcome Back!" : "Create your account"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin ? "Sign in to manage your orders & wishlist" : "Join us to experience fast checkout"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative flex items-center bg-gray-50 border border-gray-100 focus-within:border-[#2c2769] focus-within:bg-white rounded-xl overflow-hidden transition-all">
              <span className="pl-4 text-gray-400"><User size={16} /></span>
              <input
                type="text" placeholder="Full Name" required value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm text-gray-800 px-3 py-3 bg-transparent focus:outline-none"
              />
            </div>
          )}

          <div className="relative flex items-center bg-gray-50 border border-gray-100 focus-within:border-[#2c2769] focus-within:bg-white rounded-xl overflow-hidden transition-all">
            <span className="pl-4 text-gray-400"><Mail size={16} /></span>
            <input
              type="email" placeholder="Email Address" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm text-gray-800 px-3 py-3 bg-transparent focus:outline-none"
            />
          </div>

          <div className="relative flex items-center bg-gray-50 border border-gray-100 focus-within:border-[#2c2769] focus-within:bg-white rounded-xl overflow-hidden transition-all">
            <span className="pl-4 text-gray-400"><Lock size={16} /></span>
            <input
              type="password" placeholder="Password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm text-gray-800 px-3 py-3 bg-transparent focus:outline-none"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs font-semibold text-[#2c2769] hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            type="button"
            className="font-bold text-[#2c2769] hover:underline ml-1"
          >
            {isLogin ? "Sign Up Now" : "Sign In here"}
          </button>
        </p>

      </div>
    </div>
  );
}