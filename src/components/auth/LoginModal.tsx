"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, ArrowRight, X, CheckCircle, Phone } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsLogin(true);
        setIsRegistered(false);
        setError("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPhoneInvalid = !isLogin && phone.length > 0 && !phone.startsWith("0");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const bdFullPhoneRegex = /^01[1-9]\d{8}$/;

  const isLoginInputInvalid = () => {
    if (!isLogin || email.trim().length === 0) return false;
    const input = email.trim();
    const isNumeric = /^[+]?[\d]*$/.test(input.replace(/[\s-]/g, ""));

    if (isNumeric) {
      if (input.length > 2 && !input.startsWith("0")) return true;
      if (input.length === 11 && !bdFullPhoneRegex.test(input)) return true;
      if (input.length > 11) return true;
      return false;
    } else {
      if (input.includes("@") && !emailRegex.test(input)) return true;
      return false;
    }
  };

  const isEmailInvalid = !isLogin && email.trim().length > 0 && !emailRegex.test(email.trim());

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-gray-200", textColor: "text-gray-400", width: "w-0" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "w-1/3" };
    } else if (score <= 4) {
      return { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-600", width: "w-2/3" };
    } else {
      return { label: "Strong", color: "bg-green-500", textColor: "text-green-600", width: "w-full" };
    }
  };

  const strength = getPasswordStrength();

  const getLoginIcon = () => {
    const trimmedInput = email.trim();
    if (!trimmedInput) return <Mail size={15} />;
    const isPhoneNumber = /^[+]?[\d\s-]*$/.test(trimmedInput);
    return isPhoneNumber ? <Phone size={15} /> : <Mail size={15} />;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length <= 11) {
      setPhone(inputValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!phone.startsWith("0") || phone.length !== 11) {
        setError("Phone number must start with 0 and be exactly 11 digits long!");
        return;
      }
      if (isEmailInvalid) {
        setError("Please enter a valid email address format!");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long!");
        return;
      }
    }

    setLoading(true);

    if (isLogin) {
      // 🔐 Login Flow — real backend verification + NextAuth session creation
      try {
        let loginPayload = email.trim().toLowerCase();
        const cleanedPayload = loginPayload.replace(/[\s-]/g, "");
        const isNumeric = /^[+]?[\d]*$/.test(cleanedPayload);

        if (isNumeric) {
          if (cleanedPayload.startsWith("1") && cleanedPayload.length === 10) {
            setError("Please add 0 at the beginning of your phone number!");
            setLoading(false);
            return;
          }
          if (bdFullPhoneRegex.test(cleanedPayload)) {
            loginPayload = `${cleanedPayload}@onecarta.com`;
          } else if (cleanedPayload.length !== 11) {
            setError("Please enter a valid 11-digit mobile number!");
            setLoading(false);
            return;
          }
        } else {
          if (!emailRegex.test(loginPayload)) {
            setError("Please enter a valid email address format!");
            setLoading(false);
            return;
          }
        }

        const loginCheck = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginPayload, password }),
        });

        const userData = await loginCheck.json();

        if (!loginCheck.ok) {
          let backendError = userData.error || "Invalid credentials or password!";
          if (backendError.toLowerCase().includes("user found with this email")) {
            backendError = "No user found with this email or phone number.";
          }
          setError(backendError);
          setLoading(false);
          return;
        }

        // ✅ এখানেই আসল session তৈরি হচ্ছে — localStorage এর বদলে NextAuth credentials provider দিয়ে
        const result = await signIn("credentials", {
          userObject: JSON.stringify(userData),
          redirect: false,
        });

        if (result?.error) {
          setError("Session creation failed. Please try again.");
          setLoading(false);
          return;
        }

        setLoading(false);
        onClose();

        // Hard redirect — যাতে SessionProvider fresh session fetch করতে বাধ্য হয়
        setTimeout(() => { window.location.href = "/dashboard"; }, 100);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } else {
      // 📝 Registration Flow
      try {
        const cleanedPhone = phone.trim();
        const fullName = lastName.trim() ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim();
        const isEmailEmpty = !email.trim();
        const finalEmail = !isEmailEmpty ? email.trim().toLowerCase() : `${cleanedPhone}@onecarta.com`;

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            phone: cleanedPhone,
            email: finalEmail,
            password
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let backendError = data.error || "Registration failed!";
          if (isEmailEmpty && backendError.toLowerCase().includes("email")) {
            backendError = "This phone number is already registered!";
          }
          setError(backendError);
          setLoading(false);
          return;
        }

        setLoading(false);
        setIsRegistered(true);
      } catch (err) {
        setError("Something went wrong with the server. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">

        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
          <X size={18} />
        </button>

        {isRegistered ? (
          <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle size={56} className="animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Account Created!</h2>
            <p className="text-sm text-gray-500 mt-2 px-4">
              Your account has been successfully created. Please click below to sign in.
            </p>

            <div className="mt-8">
              <button
                onClick={() => {
                  setIsRegistered(false);
                  setIsLogin(true);
                  setPassword("");
                }}
                className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Sign In Now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-block mb-3">
                <img
                  src="/logo/logo2.png"
                  alt="onecarta logo"
                  className="h-9 w-auto object-contain mx-auto"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-800">{isLogin ? "Welcome Back!" : "Create your account"}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isLogin ? "Sign in to manage your orders & wishlist" : "Join us to experience fast checkout"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors">
                        <User size={15} />
                      </span>
                      <input
                        type="text"
                        id="firstName"
                        placeholder=" "
                        required={!isLogin}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
                      />
                      <label
                        htmlFor="firstName"
                        className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left
                        peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20
                        peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]"
                      >
                        First Name
                      </label>
                    </div>

                    <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors">
                        <User size={15} />
                      </span>
                      <input
                        type="text"
                        id="lastName"
                        placeholder=" "
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
                      />
                      <label
                        htmlFor="lastName"
                        className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left
                        peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20
                        peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]"
                      >
                        Last Name (Optional)
                      </label>
                    </div>
                  </div>

                  <div className={`relative group bg-white border ${isPhoneInvalid ? 'border-red-500 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#2c2769]'} rounded-xl transition-all`}>
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isPhoneInvalid ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2c2769]'} z-10 transition-colors`}>
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      placeholder=" "
                      required={!isLogin}
                      value={phone}
                      onChange={handlePhoneChange}
                      className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-9 top-1/2 -translate-y-1/2 text-xs bg-white px-1 pointer-events-none transition-all duration-200 origin-left z-20
                      ${isPhoneInvalid ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#2c2769] peer-focus:font-bold'}
                      peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px]
                      peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]`}
                    >
                      Phone Number
                    </label>
                  </div>
                </>
              )}

              <div className={`relative group bg-white border ${isLoginInputInvalid() || (isEmailInvalid && !isLogin) ? 'border-red-500 focus-within:border-red-500' : 'border-gray-200 focus-within:border-[#2c2769]'} rounded-xl transition-all`}>
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isLoginInputInvalid() || (isEmailInvalid && !isLogin) ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2c2769]'} z-10 transition-colors`}>
                  {isLogin ? getLoginIcon() : <Mail size={15} />}
                </span>
                <input
                  type="text"
                  id="email"
                  placeholder=" "
                  required={isLogin}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-9 top-1/2 -translate-y-1/2 text-xs bg-white px-1 pointer-events-none transition-all duration-200 origin-left z-20
                  ${isLoginInputInvalid() || (isEmailInvalid && !isLogin) ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-[#2c2769] peer-focus:font-bold'}
                  peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px]
                  peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]`}
                >
                  {isLogin ? "Email Address or Phone Number" : "Email Address (Optional)"}
                </label>
              </div>

              <div>
                <div className="relative group bg-white border border-gray-200 focus-within:border-[#2c2769] rounded-xl transition-all">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2c2769] z-10 transition-colors">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    id="password"
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full text-xs text-gray-800 pl-9 pr-3 py-3 bg-transparent focus:outline-none relative z-10"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-1 pointer-events-none transition-all duration-200 origin-left
                    peer-focus:-top-0.5 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-[#2c2769] peer-focus:font-bold z-20
                    peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[10px]"
                  >
                    Password
                  </label>
                </div>

                {!isLogin && password && (
                  <div className="mt-2 px-1 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-medium text-gray-400">Password strength:</span>
                      <span className={`text-[10px] font-bold ${strength.textColor} uppercase tracking-wider`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`} />
                    </div>
                  </div>
                )}
              </div>

              {isLogin && (
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#2c2769] hover:underline cursor-pointer">Forgot Password?</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c2769] hover:bg-[#1f1b4d] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                {!loading && <ArrowRight size={13} />}
              </button>
            </form>

            <p className="text-center text-[11px] text-gray-500 mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                type="button"
                className="font-bold text-[#2c2769] hover:underline ml-1"
              >
                {isLogin ? "Sign Up Now" : "Sign In here"}
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}