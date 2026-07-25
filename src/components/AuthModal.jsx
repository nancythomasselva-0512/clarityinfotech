"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, CheckCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import ClarityNetworkGlobe from "./ClarityNetworkGlobe";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 text-left font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A0E39]/80 backdrop-blur-md cursor-pointer"
        />

        {/* Split-Screen Auth Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 z-10 grid md:grid-cols-12 min-h-[560px]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-navy flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* LEFT PANEL: Light Gray/Off-White (#F7F8FA) with Clarity 3D Network Globe */}
          <div className="md:col-span-6 bg-[#F7F8FA] border-b md:border-b-0 md:border-r border-gray-200/60 p-6 sm:p-8 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Top Label with Indigo Bullet */}
            <div className="w-full flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1E2B7F] animate-pulse" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#1E2B7F]">
                CLARITY ACCESSIBILITY NETWORK
              </span>
            </div>

            {/* Self-Contained ClarityNetworkGlobe Component */}
            <div className="my-auto py-4 flex items-center justify-center w-full">
              <ClarityNetworkGlobe size={340} />
            </div>

            {/* Bottom Caption */}
            <div className="w-full text-center">
              <h4 className="text-xl font-bold text-[#1E2B7F] mb-1 font-sans">
                Inclusive AI Infrastructure
              </h4>
              <p className="text-xs text-[#1E2B7F]/65 leading-relaxed max-w-xs mx-auto font-sans">
                Connecting global nodes with real-time intelligence.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Enterprise Auth Form */}
          <div className="md:col-span-6 bg-white p-7 sm:p-10 flex flex-col justify-between">
            {submitted ? (
              <div className="my-auto flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2 font-sans">
                  {mode === "login" ? "Welcome Back!" : "Account Created!"}
                </h3>
                <p className="text-sm text-navy/60 max-w-xs font-sans">
                  {mode === "login"
                    ? "Authenticating session with Clarity network..."
                    : "Your account is ready. Redirecting to portal dashboard..."}
                </p>
              </div>
            ) : (
              <>
                {/* Header & Mode Tabs */}
                <div>
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full w-max mb-6">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        mode === "login"
                          ? "bg-white text-[#1E2B7F] shadow-sm"
                          : "text-navy/60 hover:text-navy"
                      }`}
                    >
                      Log In
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        mode === "signup"
                          ? "bg-white text-[#1E2B7F] shadow-sm"
                          : "text-navy/60 hover:text-navy"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-navy mb-1 font-sans">
                    {mode === "login" ? "Log in to Clarity" : "Join Clarity InfoTech"}
                  </h3>
                  <p className="text-xs text-navy/55 leading-relaxed mb-5 font-sans">
                    {mode === "login"
                      ? "Enter your enterprise credentials to access your portal."
                      : "Create your free account to access cloud consulting & AI tools."}
                  </p>

                  {/* Sign in with Google Button */}
                  <button
                    type="button"
                    onClick={() => alert("Google Sign-In initialized.")}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-navy font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer mb-4"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  {/* OR Divider Line */}
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="border-t border-gray-200 w-full" />
                    <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-navy/40 absolute">
                      or
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3.5">
                    {mode === "signup" && (
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                        <input
                          type="text"
                          name="user_fullname"
                          autoComplete="off"
                          placeholder="Enter Full Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#F7F8FA] border border-gray-200 px-4 py-3 pl-11 rounded-xl text-xs sm:text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-[#2C5FD9] transition-colors font-sans"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                      <input
                        type="email"
                        name="user_email_address"
                        autoComplete="off"
                        placeholder="Enter Mail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F7F8FA] border border-gray-200 px-4 py-3 pl-11 rounded-xl text-xs sm:text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-[#2C5FD9] transition-colors font-sans"
                      />
                    </div>

                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="user_account_password"
                        autoComplete="new-password"
                        placeholder="Enter Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#F7F8FA] border border-gray-200 px-4 py-3 pl-11 pr-11 rounded-xl text-xs sm:text-sm text-navy placeholder-navy/40 focus:outline-none focus:border-[#2C5FD9] transition-colors font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70 transition-colors p-1 rounded-md cursor-pointer border-none bg-transparent"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={0}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {mode === "login" && (
                      <div className="flex items-center justify-between text-xs my-1 font-sans">
                        <label className="flex items-center gap-2 text-navy/60 cursor-pointer">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#2C5FD9] cursor-pointer" />
                          Remember me
                        </label>
                        <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#2C5FD9] font-semibold hover:underline">
                          Forgot password?
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#1E2B7F] hover:bg-[#2C5FD9] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm mt-2 cursor-pointer"
                    >
                      <span>{mode === "login" ? "Log In to Account" : "Create Free Account"}</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </div>

                {/* Footer Security Badge */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-navy/50 font-sans mt-4">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#2C5FD9]" /> 256-bit Enterprise Security
                  </span>
                  <span>v2.4.0</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
