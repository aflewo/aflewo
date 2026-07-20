-- ============================================================
--  AFLEWO STATIC TO DYNAMIC CONTENT MIGRATION
-- ============================================================

-- 1. Create ALUMNI table (if not fully implemented in foundation)
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    organization TEXT,
    bio TEXT,
    year_joined TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alumni_public_read" ON public.alumni FOR SELECT USING (true);

-- 2. Create STORIES / TESTIMONIES table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    desc_text TEXT NOT NULL,
    author TEXT NOT NULL,
    year TEXT,
    chapter TEXT,
    image_url TEXT,
    quote TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories_public_read" ON public.stories FOR SELECT USING (true);

-- 3. Create STEWARDS / LEADERSHIP table
CREATE TABLE IF NOT EXISTS public.stewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.stewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stewards_public_read" ON public.stewards FOR SELECT USING (true);

-- 4. Create PARTNERS table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners_public_read" ON public.partners FOR SELECT USING (true);

-- 5. Create AUDIO TRACKS table
CREATE TABLE IF NOT EXISTS public.audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    duration TEXT NOT NULL,
    category TEXT NOT NULL,
    audio_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audio_tracks_public_read" ON public.audio_tracks FOR SELECT USING (true);

-- 6. Update CHAPTERS table with UI metadata fields
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS highlight TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS upcoming_event TEXT,
ADD COLUMN IF NOT EXISTS event_date TEXT,
ADD COLUMN IF NOT EXISTS registration_open BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS venue_image TEXT,
ADD COLUMN IF NOT EXISTS has_prayer_circle BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_qr BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_size TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- 7. Seed Alumni Founders
INSERT INTO public.alumni (name, role, organization, image_url) VALUES
    ('Sing Africa', 'Founding Alumni', 'Daystar University', '/mission-1.jpg'),
    ('Hubert de Rogue Maura', 'Chairman', 'National Oversight', '/archival-1.jpg'),
    ('CITAM Karen', 'Host Partner', '2004 Inauguration', '/archival-2.jpg')
ON CONFLICT DO NOTHING;

-- 8. Seed Stories
INSERT INTO public.stories (slug, title, subtitle, desc_text, author, year, chapter, image_url, quote) VALUES
    ('altar-of-2004', 'The Altar of 2004', 'The night Africa answered', 'It began with a few graduates from Daystar University, members of the Sing Africa choir, carrying a single prayer: that the church of Africa would worship as one. There was no stadium, no budget, no guarantee — only a promise. On a cold October evening at CITAM Karen, something shifted in the atmosphere over Nairobi. That night became the foundation of a movement that would touch ten nations.', 'Sing Africa Alumni', '2004', 'Nairobi', '/archival-1.jpg', 'We didn''t have a stage — we had an altar.'),
    ('thousands-in-the-rain', 'Thousands in the Rain', 'October 3rd, 2025 — Grace for Wholeness', 'October 3rd, 2025. Winners'' Chapel International was at capacity — 15,000 worshippers filling every seat, aisle, and overflow space — despite a heavy downpour that began two hours before the gates opened. No one left. If anything, people pressed in harder. It wasn''t about the weather or the discomfort. It was about the undeniable sense that Heaven was hosting this gathering, and no storm could interrupt the appointment.', 'Nairobi Chapter, 2025', '2025', 'Nairobi', '/mission-1.jpg', 'The rain was His invitation to press in deeper.'),
    ('healing-in-kigali', 'Healing in Kigali', 'The year Rwanda sang again', 'In 2014, as Rwanda commemorated 20 years since the genocide, AFLEWO Kigali raised a sound of reconciliation. Men and women who had been on opposite sides of the worst chapter in their nation''s history stood side by side under the same roof, singing to the same God. Music didn''t fix everything — but it opened the door. It created space for tears, for dialogue, for the slow, sacred work of healing that politics alone could never accomplish.', 'Kigali Chapter Team', '2014', 'Rwanda', '/archival-2.jpg', 'When words failed Rwanda, worship spoke.'),
    ('mombasa-prayer-circle', 'The Circle That Never Closes', 'Every night since 2020', 'During the COVID-19 lockdowns of 2020, AFLEWO Mombasa faced the same crisis every chapter did: how do you hold a worship event when no one can gather? The answer was the Prayer Circle — a nightly Zoom call that started with 12 people and now draws intercessors from Mombasa, Malindi, Lamu, and even diaspora communities in the UK and Canada. Five years later, the circle still meets every night at 9 PM EAT. It has not missed a single night.', 'Mombasa Chapter Leadership', '2020 – Present', 'Mombasa', '/archival-1.jpg', 'The coastline prays while the city sleeps.')
ON CONFLICT DO NOTHING;

-- 9. Seed Stewards
INSERT INTO public.stewards (name, role, image_url, sort_order) VALUES
    ('Timothy Kaberia', 'Visionary & Founder', '/leaders/timothy.jpg', 1),
    ('Ruguru', 'Legacy Architect', '/leaders/ruguru.jpg', 2),
    ('Hubert Maura', 'Board Chair', '/leaders/hubert.jpg', 3)
ON CONFLICT DO NOTHING;

-- 10. Seed Partners
INSERT INTO public.partners (name, role, logo_url, sort_order) VALUES
    ('Daystar University', 'Founding Partner', '/brand/daystar.png', 1),
    ('CITAM', 'Spiritual Partner', '/brand/citam.png', 2),
    ('Winners Chapel', 'Host Partner', '/brand/winners.png', 3),
    ('KBC', 'Media Partner', '/brand/kbc.png', 4)
ON CONFLICT DO NOTHING;

-- 11. Seed Audio Tracks
INSERT INTO public.audio_tracks (title, artist, duration, category, sort_order) VALUES
    ('Worthy Is The Lamb', 'AFLEWO Live 2024', '8:45', 'Live', 1),
    ('One Africa (Anthem)', 'AFLEWO Collective', '5:20', 'Original', 2),
    ('Praise Him', 'AFLEWO Legacy 2008', '6:12', 'Classic', 3),
    ('Spirit of Unity', 'Worship Residency 2026', '4:30', 'Exp', 4)
ON CONFLICT DO NOTHING;

-- 12. Update Chapters with UI Meta
UPDATE public.chapters SET highlight = 'Latest: Grace for Wholeness (Oct 2025)', color = 'from-gold/20 to-gold/5', upcoming_event = 'April 10, 2026 — Pre-Launch Night', event_date = 'Apr 10, 2026', registration_open = true, venue_image = '/archival-1.jpg', has_qr = true, display_size = 'hero', external_link = 'https://forms.gle/aflewo-nairobi-2026' WHERE slug = 'nairobi';
UPDATE public.chapters SET highlight = 'Nightly Zoom Prayer Circle — 9 PM EAT', color = 'from-cyan-500/20 to-cyan-500/5', upcoming_event = 'Every Night — Prayer Circle via Zoom', venue_image = '/archival-2.jpg', has_prayer_circle = true, display_size = 'featured', external_link = 'https://zoom.us/j/aflewo-mombasa' WHERE slug = 'mombasa';
UPDATE public.chapters SET highlight = '2026 Season Registration Active', color = 'from-orange-500/20 to-orange-500/5', upcoming_event = 'Mar 02, 2026 — Season Rehearsals', event_date = 'Mar 02, 2026', registration_open = true, venue_image = '/mission-1.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-nakuru-2026' WHERE slug = 'nakuru';
UPDATE public.chapters SET highlight = '2026 Auditions — All Categories', color = 'from-purple-500/20 to-purple-500/5', upcoming_event = 'Auditions — Categories Open', registration_open = true, venue_image = '/archival-1.jpg', has_qr = true, display_size = 'standard', external_link = 'https://forms.gle/aflewo-eldoret-2026' WHERE slug = 'eldoret';
UPDATE public.chapters SET highlight = 'Regional gathering — May 2026', color = 'from-green-500/20 to-green-500/5', upcoming_event = 'May 15, 2026 — Regional Gathering', event_date = 'May 15, 2026', venue_image = '/archival-2.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-nyeri-2026' WHERE slug = 'nyeri';
UPDATE public.chapters SET highlight = 'Eastern Kenya worship hub', color = 'from-lime-500/20 to-lime-500/5', upcoming_event = 'TBA 2026', venue_image = '/mission-1.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-meru-2026' WHERE slug = 'meru';
UPDATE public.chapters SET highlight = 'Ukambani worship stronghold', color = 'from-rose-500/20 to-rose-500/5', upcoming_event = 'TBA 2026', venue_image = '/archival-1.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-machakos-2026' WHERE slug = 'machakos';
UPDATE public.chapters SET highlight = 'Lake Region & Western Kenya hub', color = 'from-blue-500/20 to-blue-500/5', upcoming_event = 'TBA 2026', venue_image = '/archival-2.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-kisumu-2026' WHERE slug = 'kisumu';
UPDATE public.chapters SET highlight = '4,000+ Participants', color = 'from-emerald/20 to-emerald/5', upcoming_event = 'Mar 21, 2026 — Tanzania Worship Night', event_date = 'Mar 21, 2026', venue_image = '/archival-2.jpg', display_size = 'featured', external_link = 'https://forms.gle/aflewo-tanzania-2026' WHERE slug = 'tanzania';
UPDATE public.chapters SET highlight = 'Reconciliation & Healing Worship', color = 'from-blue-500/20 to-blue-500/5', upcoming_event = 'Apr 07, 2026 — Annual Commemoration', event_date = 'Apr 07, 2026', venue_image = '/mission-1.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-rwanda-2026' WHERE slug = 'rwanda';
UPDATE public.chapters SET highlight = 'Uganda''s prophetic worship hub', color = 'from-yellow-500/20 to-yellow-500/5', upcoming_event = 'TBA 2026', venue_image = '/archival-1.jpg', display_size = 'standard', external_link = 'https://forms.gle/aflewo-kampala-2026' WHERE slug = 'kampala';

-- 13. Replicate all new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stewards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audio_tracks;
