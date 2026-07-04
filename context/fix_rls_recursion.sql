-- ============================================================
-- AFLEWO: FIX INFINITE RLS RECURSION
-- Run this entire script in your Supabase SQL Editor.
-- 
-- ROOT CAUSE: Policies on `profiles` and every other table
-- did a subquery INTO `profiles` to check the user role.
-- When postgres evaluates that subquery, it hits the RLS
-- policy again, causing infinite recursion → 500 errors.
--
-- FIX: Create a SECURITY DEFINER helper function that reads
-- the role from profiles while BYPASSING RLS entirely, then
-- rewrite every recursive policy to use that function.
-- ============================================================


-- ── STEP 1: Helper function (bypasses RLS — no recursion) ──

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_chapter_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT chapter_id FROM public.profiles WHERE id = auth.uid();
$$;


-- ── STEP 2: profiles policies ─────────────────────────────

DROP POLICY IF EXISTS profiles_super_admin_all       ON public.profiles;
DROP POLICY IF EXISTS profiles_chapter_admin_read    ON public.profiles;
DROP POLICY IF EXISTS profiles_self_read             ON public.profiles;
DROP POLICY IF EXISTS profiles_self_update           ON public.profiles;

-- Self read (no recursion — uses auth.uid() = id directly)
CREATE POLICY profiles_self_read ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Self update
CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Chapter admins read members of their chapter
CREATE POLICY profiles_chapter_admin_read ON public.profiles
  FOR SELECT USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin')
    AND (
      chapter_id = public.get_my_chapter_id()
      OR public.get_my_role() = 'super_admin'
    )
  );

-- Super admin full access
CREATE POLICY profiles_super_admin_all ON public.profiles
  USING (public.get_my_role() = 'super_admin');

-- INSERT for the auth callback safety-net upsert
-- (needed so new users can create their own profile row)
DROP POLICY IF EXISTS profiles_self_insert ON public.profiles;
CREATE POLICY profiles_self_insert ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ── STEP 3: chapters policies ─────────────────────────────

DROP POLICY IF EXISTS chapters_super_admin_write ON public.chapters;

CREATE POLICY chapters_super_admin_write ON public.chapters
  USING (public.get_my_role() = 'super_admin');


-- ── STEP 4: auditions policies ────────────────────────────

DROP POLICY IF EXISTS auditions_chapter_admin_manage ON public.auditions;

CREATE POLICY auditions_chapter_admin_manage ON public.auditions
  USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin')
    AND (
      chapter_id = public.get_my_chapter_id()
      OR public.get_my_role() = 'super_admin'
    )
  );


-- ── STEP 5: attendance policies ───────────────────────────

DROP POLICY IF EXISTS attendance_admin_manage ON public.attendance;

CREATE POLICY attendance_admin_manage ON public.attendance
  USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin', 'volunteer')
  );


-- ── STEP 6: chapter_events policies ──────────────────────

DROP POLICY IF EXISTS events_admin_manage  ON public.chapter_events;
DROP POLICY IF EXISTS events_member_read   ON public.chapter_events;

CREATE POLICY events_admin_manage ON public.chapter_events
  USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin')
    AND (
      chapter_id = public.get_my_chapter_id()
      OR public.get_my_role() = 'super_admin'
    )
  );

CREATE POLICY events_member_read ON public.chapter_events
  FOR SELECT USING (
    is_public = true
    OR (
      auth.uid() IS NOT NULL
      AND public.get_my_role() IN (
        'choir_member', 'band_member', 'chapter_admin', 'super_admin', 'volunteer'
      )
      AND chapter_id = public.get_my_chapter_id()
    )
  );


-- ── STEP 7: donation_ledger policies ─────────────────────

DROP POLICY IF EXISTS donations_super_admin_all ON public.donation_ledger;

CREATE POLICY donations_super_admin_all ON public.donation_ledger
  USING (public.get_my_role() = 'super_admin');


-- ── STEP 8: registrations policies ───────────────────────

DROP POLICY IF EXISTS registrations_admin_manage ON public.registrations;

CREATE POLICY registrations_admin_manage ON public.registrations
  USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin', 'volunteer')
  );


-- ── STEP 9: resources policies ────────────────────────────

DROP POLICY IF EXISTS resources_admin_manage ON public.resources;
DROP POLICY IF EXISTS resources_role_access  ON public.resources;

CREATE POLICY resources_admin_manage ON public.resources
  USING (
    public.get_my_role() IN ('chapter_admin', 'super_admin')
  );

CREATE POLICY resources_role_access ON public.resources
  FOR SELECT USING (
    is_active = true
    AND auth.uid() IS NOT NULL
    AND (
      public.get_my_role() = 'super_admin'
      OR (
        public.get_my_role() = 'chapter_admin'
        AND (chapter_id IS NULL OR chapter_id = public.get_my_chapter_id())
      )
      OR (
        public.get_my_role() IN ('choir_member', 'band_member')
        AND allowed_role IN ('choir_member', 'band_member', 'applicant')
      )
      OR (
        public.get_my_role() = 'applicant'
        AND allowed_role = 'applicant'
      )
    )
  );


-- ── STEP 10: system_audit_logs policies ──────────────────

DROP POLICY IF EXISTS audit_logs_chapter_admin_read ON public.system_audit_logs;
DROP POLICY IF EXISTS audit_logs_super_admin_read   ON public.system_audit_logs;

CREATE POLICY audit_logs_chapter_admin_read ON public.system_audit_logs
  FOR SELECT USING (
    public.get_my_role() = 'chapter_admin'
    AND performed_by = auth.uid()
  );

CREATE POLICY audit_logs_super_admin_read ON public.system_audit_logs
  FOR SELECT USING (public.get_my_role() = 'super_admin');


-- ── DONE: Force schema cache refresh ─────────────────────
NOTIFY pgrst, 'reload schema';
