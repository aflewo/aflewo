"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";
import LightRays from "@/components/LightRays";

type AuthMode = "login" | "register";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [lastLoginMethod, setLastLoginMethod] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMethod = localStorage.getItem("lastLoginMethod");
    if (lastMethod) {
      setLastLoginMethod(lastMethod);
      setMode("login");
    } else {
      setMode("register");
    }
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    privacyConsent: false,
  });

  // Guard: distinguish fully-signed-in vs. mid-signed-in (session exists, profile missing).
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        const redirect = searchParams.get("redirect") || "/profile";
        router.replace(redirect);
        return;
      }

      // Mid signed-in — create profile then advance
      setLoading(true);
      await supabase.from("profiles").upsert(
        {
          id: session.user.id,
          email: session.user.email ?? "",
          full_name:
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            "AFLEWO Member",
          role: "applicant",
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
      setLoading(false);
      const redirect = searchParams.get("redirect") || "/profile";
      router.replace(redirect);
    });
  }, [router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError(null);
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    localStorage.setItem("lastLoginMethod", "google");
    setLoading(true);
    const redirect = searchParams.get("redirect") || "/profile";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  // GitHub OAuth
  const handleGitHubSignIn = async () => {
    localStorage.setItem("lastLoginMethod", "github");
    setLoading(true);
    const redirect = searchParams.get("redirect") || "/profile";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  // Email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("lastLoginMethod", "email");
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(searchParams.get("redirect") || "/profile");
  };

  // Email register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacyConsent) { setError("Please accept the privacy policy to continue."); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
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
    <main
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% -20%, #1a1008 0%, #0b0906 60%)" }}
    >
      {/* ── Background atmosphere ─────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#f0b93a"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="opacity-60"
        />
        {/* Bottom reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">

        {/* ── Logo ─────────────────────────────────────── */}
        <Link href="/" className="flex flex-col items-center gap-4 mb-10 group">
          <div className="relative">
            {/* Neumorphic ring */}
            <div className="absolute inset-[-6px] rounded-[28px] opacity-40"
              style={{
                background: "transparent",
                boxShadow: "6px 6px 16px #06040240, -6px -6px 16px #2a180a40",
              }}
            />
            <div className="w-20 h-20 rounded-[22px] overflow-hidden relative border border-white/10 group-hover:border-gold/30 transition-colors"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <Image
                src="/logo.png"
                alt="AFLEWO Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-gold">AFLEWO</p>
            <p className="text-[10px] text-white/30 tracking-wider">Africa Let&apos;s Worship</p>
          </div>
        </Link>

        {/* ── Glass Card ───────────────────────────────── */}
        <div
          className="rounded-[28px] overflow-hidden border border-white/8"
          style={{
            background: "rgba(21, 16, 10, 0.80)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.5) inset",
          }}
        >
          {/* ── Mode toggle ── */}
          <div className="relative flex p-1.5 border-b border-white/5 rounded-t-[28px]"
            style={{ background: "rgba(0,0,0,0.3)" }}>
            {/* Sliding Pill */}
            <div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[14px] pointer-events-none z-0"
              style={{
                background: "linear-gradient(135deg, #f0b93a 0%, #c2572e 100%)",
                boxShadow: "0 4px 16px rgba(240,185,58,0.3)",
                left: mode === "login" ? "6px" : "calc(50%)",
                transition: "left 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
              }}
            />
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className={`relative z-10 flex-1 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  mode === m
                    ? "text-brown"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="p-7 space-y-5">
            {/* Redirect / error banners */}
            {redirectError === "profile-not-found" && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold"
                style={{ background: "rgba(240,185,58,0.08)", borderColor: "rgba(240,185,58,0.2)", color: "#f0b93a" }}>
                <SvgIcon name="warning" size={16} className="opacity-80" />
                Profile not set up yet. Sign in to auto-create your profile.
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold text-emerald-400"
                style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
                <SvgIcon name="check_circle" size={16} className="opacity-80" />
                {success}
              </div>
            )}
            {displayError && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
                <SvgIcon name="error_circle" size={16} className="opacity-80" />
                {displayError}
              </div>
            )}

            {/* ── OAuth Buttons ── */}
            <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto">
              {/* Google */}
              <button
                id="auth-google-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-2.5 py-3.5 px-3 rounded-[16px] font-bold text-sm transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {lastLoginMethod === "google" && mode === "login" && (
                  <span className="absolute -top-2.5 right-1.5 bg-gold text-brown text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-gold/50">Last Used</span>
                )}
                <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub */}
              <button
                id="auth-github-btn"
                onClick={handleGitHubSignIn}
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-2.5 py-3.5 px-3 rounded-[16px] font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {lastLoginMethod === "github" && mode === "login" && (
                  <span className="absolute -top-2.5 right-1.5 bg-gold text-brown text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-gold/50">Last Used</span>
                )}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* ── Email form ── */}
            <form
              onSubmit={mode === "login" ? handleEmailLogin : handleEmailRegister}
              className="space-y-3"
            >
              {mode === "register" && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gold/70 mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    id="auth-fullname"
                    name="fullName"
                    type="text"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-[14px] py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(240,185,58,0.4)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gold/70 mb-1.5 block">
                  Email
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full rounded-[14px] py-3.5 px-4 text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(240,185,58,0.4)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gold/70 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={form.password}
                    onChange={handleChange}
                    placeholder={mode === "register" ? "Min 8 characters" : "Your password"}
                    className="w-full rounded-[14px] py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/20 outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(240,185,58,0.4)"; e.target.style.background = "rgba(255,255,255,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                  <SvgIcon name={showPassword ? "eye_off" : "eye"} size={18} className="opacity-50" />
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <input
                    name="privacyConsent"
                    type="checkbox"
                    checked={form.privacyConsent}
                    onChange={handleChange}
                    className="mt-0.5 accent-gold"
                  />
                  <span className="text-[11px] text-white/35 group-hover:text-white/55 transition-colors leading-relaxed">
                    I agree to the{" "}
                    <Link href="/privacy" className="text-gold hover:brightness-125 underline underline-offset-2">
                      Privacy Policy
                    </Link>{" "}
                    and consent to AFLEWO storing my information.
                  </span>
                </label>
              )}

              {/* Submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="relative w-full py-4 rounded-[16px] font-black text-[11px] uppercase tracking-[0.2em] text-brown flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-2"
                style={{
                  background: "linear-gradient(135deg, #f0b93a 0%, #d9821f 60%, #c2572e 100%)",
                  boxShadow: "0 4px 24px rgba(240,185,58,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                {lastLoginMethod === "email" && mode === "login" && (
                  <span className="absolute -top-2.5 right-4 bg-white/95 text-brown text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 border border-white/50">Last Used</span>
                )}
                {loading
                  ? <><SvgIcon name="spinner" size={17} className="animate-spin opacity-70" /> Please wait...</>
                  : <><SvgIcon name={mode === "login" ? "sign_in" : "person_add"} size={17} className="opacity-80" />{mode === "login" ? "Sign In" : "Create Account"}</>
                }
              </button>
            </form>

            {/* Passkey hint (subtle, for returning users only) */}
            <div className="pt-1 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/20 font-medium">
                Returning member?{" "}
                <span className="text-white/30">
                  Passkey login available in your profile after first sign-in.
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/15 mt-6 px-4">
          By signing in you agree to serve with excellence and honour.
        </p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-[18px] overflow-hidden relative border border-white/10 animate-pulse">
            <Image src="/logo.png" alt="AFLEWO" fill className="object-contain p-2" />
          </div>
          <p className="text-[10px] text-white/30 tracking-widest uppercase font-black">Loading...</p>
        </div>
      </main>
    }>
      <AuthContent />
    </Suspense>
  );
}
