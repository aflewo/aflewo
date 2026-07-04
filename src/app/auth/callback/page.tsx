"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

/**
 * OAuth Callback Handler
 * Supabase redirects here after Google/GitHub OAuth completes.
 * 1. Exchanges the auth code for a session.
 * 2. Guarantees a profiles row exists (safety net if DB trigger is slow/absent).
 * 3. Redirects to the portal (or the original intended destination).
 */
function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Step 1: Exchange the OAuth code for a live session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(window.location.href);

      if (sessionError || !sessionData.session) {
        console.error("[auth/callback] Session error:", sessionError);
        router.replace(`/auth?error=${encodeURIComponent(sessionError?.message ?? "session-failed")}`);
        return;
      }

      const { user } = sessionData.session;

      // Step 2: Safety-net upsert — ensures the profiles row exists.
      // The DB trigger handles this in the normal path. This fires if the trigger
      // was absent, slow, or failed silently. ignoreDuplicates = true means if
      // the profile already exists, this is a guaranteed no-op.
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email ?? "",
          full_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            "AFLEWO Member",
          role: "applicant",
        },
        { onConflict: "id", ignoreDuplicates: true }
      );

      if (profileError) {
        // Non-fatal: log it, but don't block the user. The portal layout
        // will catch any remaining profile issues.
        console.error("[auth/callback] Profile upsert warning:", profileError);
      }

      // Step 3: Redirect to the intended destination
      const redirect = searchParams.get("redirect") || "/profile";
      router.replace(redirect);
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          Setting up your profile...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
