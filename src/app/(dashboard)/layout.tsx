"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types";
import Link from "next/link";
import SvgIcon from "@/components/ui/SvgIcon";

import { AuthContext } from "./AuthContext";

// ─── Dashboard Navigation ─────────────────────────────────────
const navItems = [
  { href: "/profile", icon: "home", label: "Home" },
  { href: "/profile/auditions", icon: "mic", label: "My Audition" },
  { href: "/profile/resources", icon: "music", label: "Resource Vault" },
  { href: "/profile/schedule", icon: "calendar", label: "Schedule" },
  { href: "/profile/attendance", icon: "check_circle", label: "My Attendance" },
];

const adminNavItems = [
  { href: "/admin", icon: "chart", label: "Overview" },
  { href: "/admin/auditions", icon: "user_check", label: "Auditions" },
  { href: "/admin/attendance", icon: "scan", label: "Check-In" },
  { href: "/admin/resources", icon: "upload", label: "Upload Resources" },
  { href: "/admin/gallery", icon: "image", label: "Gallery Manager" },
  { href: "/admin/members", icon: "people", label: "Members" },
];

// ─── Layout Component ─────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileData) {
        router.replace("/auth?error=profile-not-found");
        return;
      }

      setProfile(profileData as Profile);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  const isAdmin = profile && ["super_admin", "chapter_admin"].includes(profile.role);

  return (
    <AuthContext.Provider value={{ profile, loading, signOut }}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold font-black text-xs">A</span>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gold">AFLEWO</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wider">Member Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Member section */}
            <p className="text-[9px] text-white/20 uppercase tracking-widest font-black px-3 py-2">Member</p>
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}

            {/* Admin section */}
            {isAdmin && (
              <>
                <p className="text-[9px] text-gold/40 uppercase tracking-widest font-black px-3 py-2 mt-4 flex items-center gap-1">
                  <SvgIcon name="secure" size={10} /> Admin
                </p>
                {adminNavItems.map((item) => (
                  <NavLink key={item.href} {...item} isAdmin />
                ))}
              </>
            )}
          </nav>

          {/* Saem's Tunes Cross-sell */}
          <div className="p-4 border-t border-white/5">
            <a
              href={`https://saemstunes.com/auth-bridge?source=aflewo&role=${profile?.role}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-xl bg-gradient-to-br from-[#A67C00]/20 to-[#4a3400]/20 border border-gold/20 hover:border-gold/40 transition-all group"
            >
              <p className="text-[9px] text-gold/80 uppercase tracking-widest font-black">Partner Platform</p>
              <p className="text-white text-xs font-bold mt-1 group-hover:text-gold transition-colors">Saem&apos;s Tunes →</p>
              <p className="text-white/30 text-[10px] mt-0.5">Advance your worship skills</p>
            </a>
          </div>

          {/* Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/20 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: "0 0 0 2px hsl(20 20% 8%), 0 0 12px -4px hsla(42,92%,56%,0.4)" }}>
                <span className="text-gold text-xs font-black">
                  {profile?.full_name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">{profile?.full_name}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-widest truncate">{profile?.role?.replace("_", " ")}</p>
              </div>
              <button
                onClick={signOut}
                className="text-white/30 hover:text-white/60 transition-colors"
                title="Sign out"
              >
                <SvgIcon name="logout" size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar (mobile) */}
          <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SvgIcon name="menu" size={24} />
            </button>
            <span className="text-gold font-black text-xs uppercase tracking-widest">AFLEWO Portal</span>
            <div className="w-6" />
          </header>

          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

// ─── Nav Link Component ───────────────────────────────────────
function NavLink({
  href,
  icon,
  label,
  isAdmin = false,
}: {
  href: string;
  icon: any;
  label: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all group relative
        ${
          isActive
            ? isAdmin
              ? "bg-gold/10 text-gold border border-gold/15"
              : "bg-white/8 text-white border border-white/8"
            : isAdmin
            ? "text-gold/60 hover:text-gold hover:bg-gold/5"
            : "text-white/50 hover:text-white hover:bg-white/5"
        }`}
    >
      {isActive && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${
          isAdmin ? "bg-gold" : "bg-white"
        }`} />
      )}
      <SvgIcon name={icon} size={16} className={`shrink-0 transition-transform ${isActive ? "" : "group-hover:scale-110"}`} />
      {label}
    </Link>
  );
}
