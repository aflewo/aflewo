"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import gsap from "gsap";
import AppIcon from "@/components/ui/AppIcon";
import Link from "next/link";

type AuthMode = "login" | "register";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    privacyConsent: false,
  });

  // Check if already signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirect = searchParams.get("redirect") || "/portal";
        router.replace(redirect);
      }
    });
  }, [router, searchParams]);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".auth-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError(null);
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const redirect = searchParams.get("redirect") || "/portal";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Email + Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/portal";
    router.push(redirect);
  };

  // Email + Password register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacyConsent) {
      setError("Please accept the privacy policy to continue.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Account created! Check your email to verify before signing in.");
    setLoading(false);
  };

  const errorMap: Record<string, string> = {
    "Invalid login credentials": "Incorrect email or password.",
    "Email not confirmed": "Please verify your email first. Check your inbox.",
    "User already registered": "An account with this email already exists. Try signing in.",
  };

  const displayError = error ? (errorMap[error] || error) : null;
  const redirectError = searchParams.get("error");

  return (
    <main ref={containerRef} className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="auth-card w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <span className="text-gold font-black text-2xl">A</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest text-gold">AFLEWO</p>
            <p className="text-xs text-white/30">Africa Let&apos;s Worship</p>
          </div>
        </Link>

        {/* Card */}
        <div className="glass-card-elevated rounded-2xl p-8 space-y-6 border-white/5">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 gap-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  mode === m ? "bg-gold text-brown" : "text-white/40 hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Redirect error */}
          {redirectError === "profile-not-found" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold">
              <AppIcon name="warning" size={16} />
              Profile not set up yet. Sign in with Google to auto-create your profile.
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-xs font-bold">
              <AppIcon name="check_circle" size={16} />
              {success}
            </div>
          )}

          {/* Error */}
          {displayError && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <AppIcon name="error" size={16} />
              {displayError}
            </div>
          )}

          {/* Google OAuth — Primary */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-zinc-900 rounded-xl font-black text-sm hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email form */}
          <form
            onSubmit={mode === "login" ? handleEmailLogin : handleEmailRegister}
            className="space-y-4"
          >
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold">Full Name *</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Email *</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                placeholder="you@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gold">Password *</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none focus:border-gold/50 transition-colors"
                placeholder={mode === "register" ? "Min 8 characters" : "Your password"}
              />
            </div>

            {mode === "register" && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  name="privacyConsent"
                  type="checkbox"
                  checked={form.privacyConsent}
                  onChange={handleChange}
                  className="mt-0.5 accent-gold"
                />
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-gold hover:brightness-125">Privacy Policy</Link>
                  {" "}and consent to AFLEWO storing my information.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gold text-brown rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading
                ? <AppIcon name="autorenew" size={18} className="animate-spin" />
                : <AppIcon name={mode === "login" ? "login" : "person_add"} size={18} />
              }
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-white/20 mt-6">
          By signing in you agree to serve with excellence and honour.
        </p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-gold font-black text-2xl">A</span>
          </div>
          <p className="text-xs text-white/30 tracking-widest uppercase font-black">Loading...</p>
        </div>
      </main>
    }>
      <AuthContent />
    </Suspense>
  );
}
