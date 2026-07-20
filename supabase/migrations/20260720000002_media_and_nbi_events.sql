-- ============================================================
--  AFLEWO MEDIA & NAIROBI 2026 EVENTS MIGRATION
-- ============================================================

-- 1. Create media_items table
CREATE TABLE IF NOT EXISTS public.media_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    category    VARCHAR(100),
    year        VARCHAR(4),
    image       TEXT NOT NULL,
    size        VARCHAR(10) CHECK (size IN ('large', 'medium', 'small')),
    type        VARCHAR(15) CHECK (type IN ('photo', 'video', 'documentary')),
    views       VARCHAR(10),
    chapter     VARCHAR(100),
    source      VARCHAR(10) DEFAULT 'local',
    video_url   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for media_items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone (even anonymous users) can view media items
CREATE POLICY "media_items_public_read"
    ON public.media_items FOR SELECT
    USING (true);

-- Insert/Update/Delete policy: Only authenticated admins can modify media items
CREATE POLICY "media_items_admin_all"
    ON public.media_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('super_admin', 'chapter_admin')
        )
    );

-- 2. Allow nullable starts_at to handle TBD dates
ALTER TABLE public.chapter_events ALTER COLUMN starts_at DROP NOT NULL;

-- 3. Seed Homepage Media Items
INSERT INTO public.media_items (title, category, year, image, size, type, views, chapter, source) VALUES
    ('The Altar of 15,000', 'Main Event', '2024', '/archival-1.jpg', 'large', 'video', '25K', 'Nairobi', 'local'),
    ('Night of Worship', 'Coastal Revival', '2016', '/archival-2.jpg', 'small', 'photo', '8K', 'Mombasa', 'local'),
    ('A Decade of Grace', 'Documentary', '2014', '/mission-1.jpg', 'medium', 'documentary', '50K', 'Continental', 'local'),
    ('Coast Revival', 'Historical', '2009', '/archival-2.jpg', 'small', 'photo', '5K', 'Mombasa', 'local')
ON CONFLICT DO NOTHING;

-- 4. Seed Nairobi 2026 Practice Schedule and Calendar
DO $$
DECLARE
    nbi_chapter_id UUID;
    system_user_id UUID;
BEGIN
    -- Fetch Nairobi chapter ID
    SELECT id INTO nbi_chapter_id FROM public.chapters WHERE slug = 'nairobi' LIMIT 1;
    
    -- Fetch a super admin profile ID to assign as created_by (or leave null if none exists)
    SELECT id INTO system_user_id FROM public.profiles WHERE role = 'super_admin' LIMIT 1;

    IF nbi_chapter_id IS NOT NULL THEN
        -- Insert Schedule Events
        INSERT INTO public.chapter_events (chapter_id, title, description, event_type, location, starts_at, ends_at, is_public, created_by) VALUES
            (nbi_chapter_id, 'Mission', 'Practice Schedule Event', 'outreach', 'LMC Karen', '2026-03-22 10:00:00+03', '2026-03-22 14:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Auditions (Day 1)', 'Open auditions for choir and band', 'audition', 'CITAM Valley Rd', '2026-04-12 14:00:00+03', '2026-04-12 18:00:00+03', TRUE, system_user_id),
            (nbi_chapter_id, 'Auditions (Day 2)', 'Open auditions for choir and band', 'audition', 'CITAM Valley Rd', '2026-04-19 14:00:00+03', '2026-04-19 18:00:00+03', TRUE, system_user_id),
            (nbi_chapter_id, 'Orientation & Small Groups', 'Welcome orientation for new members', 'other', 'Nairobi Baptist Church', '2026-05-03 14:00:00+03', '2026-05-03 17:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'First Commissioning', 'Member commissioning service', 'main_event', 'CITAM Valley Rd', '2026-05-10 14:00:00+03', '2026-05-10 17:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Small Group Leaders Training', 'Training session for group leaders', 'other', 'TBD', '2026-05-16 09:00:00+03', '2026-05-16 13:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '1st Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-05-24 14:00:00+03', '2026-05-24 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Mission (Hallel Worship)', 'Outreach service at Bride of Christ Chamber', 'outreach', 'Bride of Christ Chamber', '2026-05-27 18:00:00+03', '2026-05-27 21:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '2nd Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-06-07 14:00:00+03', '2026-06-07 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Mission', 'Practice Schedule Event', 'outreach', 'LMC Karen', '2026-06-21 10:00:00+03', '2026-06-21 13:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '3rd Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-06-21 14:00:00+03', '2026-06-21 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '4th Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-07-05 14:00:00+03', '2026-07-05 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '5th Practice', 'Weekly rehearsal', 'rehearsal', 'CITAM Valley Rd', '2026-07-19 14:00:00+03', '2026-07-19 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'BGV Auditions', 'Auditions for Backing Vocalists', 'audition', 'CITAM Valley Rd', '2026-08-01 09:00:00+03', '2026-08-01 15:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Alumni Connect', 'Networking event for former members', 'other', 'TBD', '2026-08-07 18:00:00+03', '2026-08-08 18:00:00+03', TRUE, system_user_id),
            (nbi_chapter_id, '6th Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-08-09 14:00:00+03', '2026-08-09 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '7th Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-08-23 14:00:00+03', '2026-08-23 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Fun Day', 'Social event for members', 'other', 'TBD', '2026-08-29 09:00:00+03', '2026-08-29 16:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '8th Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-09-06 14:00:00+03', '2026-09-06 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, '9th Practice', 'Weekly rehearsal', 'rehearsal', 'Nairobi Baptist Church', '2026-09-13 14:00:00+03', '2026-09-13 18:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Mission', 'Practice Schedule Event', 'outreach', 'LMC Karen', '2026-09-20 10:00:00+03', '2026-09-20 14:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Dress Rehearsal', 'Final full dress rehearsal', 'rehearsal', 'TBD', '2026-09-25 18:00:00+03', '2026-09-25 21:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Commissioning', 'Member commissioning service', 'main_event', 'Nairobi Baptist Church', '2026-09-27 14:00:00+03', '2026-09-27 17:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Set down', 'Post-event evaluation meeting', 'other', 'CITAM Valley Rd', '2026-10-18 14:00:00+03', '2026-10-18 17:00:00+03', FALSE, system_user_id),
            (nbi_chapter_id, 'Mission', 'Practice Schedule Event', 'outreach', 'LMC Karen', '2026-11-29 10:00:00+03', '2026-11-29 14:00:00+03', FALSE, system_user_id),
            -- Undated missions (starts_at is NULL, marked as non-public)
            (nbi_chapter_id, 'Mission (TBD)', 'Undated mission outreach', 'outreach', 'TBD', NULL, NULL, FALSE, system_user_id),
            (nbi_chapter_id, 'Mission (TBD)', 'Undated mission outreach', 'outreach', 'TBD', NULL, NULL, FALSE, system_user_id),
            (nbi_chapter_id, 'Mission (TBD)', 'Undated mission outreach', 'outreach', 'TBD', NULL, NULL, FALSE, system_user_id);
    END IF;
END $$;

-- 5. Enable real-time replication for events and media
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapter_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_items;
