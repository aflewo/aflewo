import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { events } from "@/lib/events";

// ─── Whitelisted routing config ──────────────────────────────────────────────
const SITE_ROUTES = [
    { path: "/", name: "Home", description: "Main landing page" },
    { path: "/about", name: "About", description: "Vision, history, leadership" },
    { path: "/media", name: "Media", description: "Worship archive, recordings, videos" },
    { path: "/testimonies", name: "Testimonies", description: "Community stories" },
    { path: "/join", name: "Join", description: "Audition registration, choir, band, media team, usher, security, dance" },
    { path: "/stories", name: "Stories", description: "Echo testimonies" },
    { path: "/alumni", name: "Alumni", description: "Past members and alumni network" },
    { path: "/chapters", name: "Chapters detail", description: "Detailed chapter information" },
    { path: "/auth", name: "Sign In / Register", description: "Authentication portal" },
    { path: "/profile", name: "Profile", description: "User dashboard and settings" }
];

// ─── AFLEWO Site Knowledge Base ───────────────────────────────────────────────
function getSiteMapContext() {
    const eventsContext = events.map(e => `- ${e.title}: ${e.startTime} — ${e.location} (${e.description})`).join("\n");

    return `
AFLEWO (Africa Let's Worship) — Site Knowledge Base

IDENTITY:
- Full name: Africa Let's Worship (AFLEWO)
- Founded: 2004
- Type: Continental interdenominational worship movement
- Mission: Stirring up hope in Jesus through a united African voice
- Tagline: "One God. One People. One Africa."
- The 7 Pillars: Hope, Unity, Music, Prayer, Word, Leadership, Excellence

CHAPTERS (8 total):
- Nairobi, Kenya — flagship chapter, main annual event at Winners' Chapel International
- Nakuru, Kenya — Founded 2013 (initially a 1,000-voice choir), Deliverance Church base, active rehearsals
- Nyeri, Kenya — Founded 2010 at PCEA Nyamachaki, now draws over 2,000 people. Mt. Kenya region.
- Meru, Kenya — Founded 2012 (first event at Gikumene High School), active community.
- Mombasa, Kenya — Founded 2009 at Elim Sanctuary in Makupa, now draws over 5,000 people annually. Zoom-based nightly prayer circle.
- Eldoret, Kenya — Regional hub, highly active community with 12,000+ followers.
- Tanzania — CCC Upanga Church, Dar es Salaam
- Rwanda — Christian Life Assembly, Kigali (reconciliation focus)

SITE PAGES & PATHS:
${SITE_ROUTES.map(r => `- ${r.name}: ${r.path} (${r.description})`).join("\n")}

NAVIGATION SECTIONS (home page scroll):
- #hero — landing video section, main headline
- #about — vision and history
- #chapters — all 8 chapters
- #events — event calendar
- #media — archive preview
- #stories — echo testimonies
- #join — connect / join CTA

EVENTS (Live DB synced):
${eventsContext}

DONATIONS & FINANCIAL SUPPORT:
- Official Paybill: M-Changa Paybill 891300, Account: AFLEWONBI
- IMPORTANT: This is the ONLY verified donation channel. Never provide any other numbers.

HOW TO JOIN:
- Audition categories: Choir, Band, Media, Ushering, Security, Dancing
- Visit /join to register for auditions
- Requirements vary by chapter and category
- Must be a committed Christian with a heart for worship

CONTACT:
- Website: aflewo.org
- Social: YouTube @aflewo, Instagram @aflewo, Facebook @aflewo

NAVIGATION COMMANDS (you can navigate for the user):
- navigate_to: push the user to a page path
- scroll_to: scroll the current page to a named section anchor

RESPONSE GUIDELINES:
- Only answer from information in this knowledge base or retrieved context.
- If unsure or topic is outside AFLEWO, say: "I don't have that information — please contact us via our social channels or visit aflewo.org."
- Keep answers warm, faith-grounded, and concise.
- For joining/registration: always direct to /join.
- For event details: give date, location, and brief description.
- Never fabricate dates, locations, or names not in this document.
- ALWAYS format references to site pages as Markdown hyperlinks using exact paths. Example: [Media page](/media) or [Join us](/join). Do not output plain text page names.
- If the user has low bandwidth (indicated by [LOW_BANDWIDTH] flag), respond in minimal text only: no greetings, no pleasantries, just the essential fact in one sentence.
`;
}

// ─── Whitelisted navigation actions ──────────────────────────────────────────
const ALLOWED_ROUTES = SITE_ROUTES.map(r => r.path);
const ALLOWED_ANCHORS = ["hero", "about", "chapters", "events", "media", "stories", "join"];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "assistant";
    content: string;
}

interface NavigationAction {
    type: "navigate_to" | "scroll_to";
    target: string;
}

interface IslandTrigger {
    mode: "map" | "waveform" | "ticket" | "idle";
    payload?: {
        lat?: number;
        lng?: number;
        label?: string;
        items?: string[];
    };
}

// ─── Output Sanitizer / Degeneration Gatekeeper ─────────────────────────────
// Intercepts token degeneration, Unicode soup, and repetitive gibberish before
// it ever reaches the user. Returns a clean fallback string if the response
// is deemed unsafe for display.
const DEGENERATION_FALLBACK = "I'm sorry, I ran into a technical issue. Could you please ask your question again?";

function sanitizeResponse(text: string): string {
    if (!text || text.trim().length === 0) return DEGENERATION_FALLBACK;

    // 1. Reject if response is abnormally short after stripping whitespace
    const stripped = text.replace(/\s+/g, " ").trim();
    if (stripped.length < 10) return DEGENERATION_FALLBACK;

    // 2. Detect high-density repetition: any single word appearing > 6 times
    // ("soap soap soap soap soap soap soap" is a classic degeneration pattern)
    const words = stripped.toLowerCase().split(/\s+/);
    const wordFreq: Record<string, number> = {};
    for (const w of words) {
        if (w.length < 3) continue; // skip tiny particles
        wordFreq[w] = (wordFreq[w] || 0) + 1;
        if (wordFreq[w] > 6) {
            console.error(`[AFLEWO AI] 🚨 Degeneration detected — word "${w}" repeated ${wordFreq[w]} times. Suppressing.`);
            return DEGENERATION_FALLBACK;
        }
    }

    // 3. Detect non-ASCII / Unicode garbage: reject if > 15% of chars are non-Latin
    const nonLatinCount = (text.match(/[^\x00-\x7F\u00C0-\u024F\u2018-\u201D\u2026\u2014\u2013\u00B7]/g) || []).length;
    const nonLatinRatio = nonLatinCount / text.length;
    if (nonLatinRatio > 0.15) {
        console.error(`[AFLEWO AI] 🚨 Unicode soup detected (${(nonLatinRatio * 100).toFixed(1)}% non-Latin). Suppressing.`);
        return DEGENERATION_FALLBACK;
    }

    // 4. Detect token flooding: extremely high density of short (2-5 char) capitalised tokens
    // e.g. "soap FR titan Arn EG soap BIO" — hallucinated vocab fragments
    const shortCapsTokens = words.filter(w => w.length <= 5 && /^[A-Z]{2,}$/.test(w));
    const capsRatio = shortCapsTokens.length / Math.max(words.length, 1);
    if (words.length > 15 && capsRatio > 0.2) {
        console.error(`[AFLEWO AI] 🚨 Token flooding detected (${(capsRatio * 100).toFixed(1)}% caps fragments). Suppressing.`);
        return DEGENERATION_FALLBACK;
    }

    return text;
}

// ─── Simple rule-based action extractor ──────────────────────────────────────
function extractNavigationAction(text: string): NavigationAction | null {
    const routeMatch = text.match(/\[navigate_to:\s*([^\]]+)\]/i);
    if (routeMatch) {
        const route = routeMatch[1].trim();
        if (ALLOWED_ROUTES.includes(route)) {
            return { type: "navigate_to", target: route };
        }
    }

    const anchorMatch = text.match(/\[scroll_to:\s*([^\]]+)\]/i);
    if (anchorMatch) {
        const anchor = anchorMatch[1].trim();
        if (ALLOWED_ANCHORS.includes(anchor)) {
            return { type: "scroll_to", target: anchor };
        }
    }

    return null;
}

// ─── Offline Manifest extraction ─────────────────────────────────────────────
// Detect if the response contains logistical info worth caching offline.
// Returns a minimal structured package or null.
interface OfflineManifest {
    title: string;
    items: string[];
    cachedAt: string;
}

function extractOfflineManifest(query: string, response: string): OfflineManifest | null {
    const logisticalKeywords = ["rehearsal", "audition", "event", "time", "venue", "location", "parking", "nairobi", "eldoret", "nakuru", "mombasa", "nyeri", "zoom"];
    const lowerQuery = query.toLowerCase();
    const isLogistical = logisticalKeywords.some(kw => lowerQuery.includes(kw));
    if (!isLogistical) return null;

    // Strip markdown links, navigation tags, and split into digestible lines
    const clean = response
        .replace(/\[navigate_to:[^\]]+\]/gi, "")
        .replace(/\[scroll_to:[^\]]+\]/gi, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links -> plain text
        .trim();

    const lines = clean.split(/[.\n]/).map(l => l.trim()).filter(l => l.length > 4);

    if (lines.length === 0) return null;

    return {
        title: "AFLEWO Logistical Info",
        items: lines.slice(0, 5), // max 5 bullet points to keep it lean
        cachedAt: new Date().toISOString(),
    };
}

// ─── Air-Gapped Vectorize Sandbox Query ──────────────────────────────────────
// This NEVER touches Supabase. It queries the isolated Cloudflare Vectorize
// index that was seeded by the one-way cron pipeline (sync-knowledge-cron).
async function queryVectorizeSandbox(query: string): Promise<string> {
    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const indexName = process.env.CF_VECTORIZE_INDEX || "aflewo-knowledge";

    if (!cfToken || !cfAccountId) return "";

    try {
        // Step 1: Generate an embedding for the user query via Workers AI
        const embeddingRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/baai/bge-small-en-v1.5`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({ text: [query] }),
            }
        );

        if (!embeddingRes.ok) return "";
        const embeddingData = await embeddingRes.json();
        const vector: number[] = embeddingData?.result?.data?.[0];
        if (!vector || vector.length === 0) return "";

        // Step 2: Query the Vectorize index with the embedding
        const vectorizeRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/vectorize/v2/indexes/${indexName}/query`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({
                    vector,
                    topK: 4,
                    returnMetadata: "all",
                }),
            }
        );

        if (!vectorizeRes.ok) return "";
        const vectorizeData = await vectorizeRes.json();
        const matches = vectorizeData?.result?.matches || [];

        if (matches.length === 0) return "";

        // Extract text from metadata and join
        const retrieved = matches
            .filter((m: { score: number }) => m.score > 0.65) // only high-confidence matches
            .map((m: { metadata?: { text?: string } }) => m.metadata?.text || "")
            .filter(Boolean)
            .join("\n\n");

        return retrieved;
    } catch {
        // Silent fail — sandbox unavailable, fallback to static context
        return "";
    }
}

// ─── Legacy Supabase RAG (graceful fallback only) ─────────────────────────────
// Only called if Vectorize returns nothing — kept for transition period.
async function retrieveRAGContext(query: string): Promise<string> {
    // First try the air-gapped Vectorize sandbox (preferred)
    const vectorizeResult = await queryVectorizeSandbox(query);
    if (vectorizeResult) return vectorizeResult;

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from("aflewo_knowledge")
            .select("content, similarity")
            .limit(3);

        if (error || !data || data.length === 0) return "";
        return data.map((d: { content: string }) => d.content).join("\n\n");
    } catch {
        return "";
    }
}

// ─── Map trigger extractor ───────────────────────────────────────────────────
// Parses [SHOW_MAP: lat, lng, "Label"] tags from the raw AI response.
// Returns a typed IslandTrigger or null. Never exposed to the client as raw text.
function extractIslandTrigger(text: string): IslandTrigger | null {
    const mapMatch = text.match(/\[SHOW_MAP:\s*(-?[\d.]+),\s*(-?[\d.]+),\s*"([^"]+)"\s*\]/i);
    if (mapMatch) {
        return {
            mode: "map",
            payload: {
                lat: parseFloat(mapMatch[1]),
                lng: parseFloat(mapMatch[2]),
                label: mapMatch[3],
            },
        };
    }
    const waveformMatch = text.match(/\[SHOW_WAVEFORM\]/i);
    if (waveformMatch) return { mode: "waveform" };

    const ticketMatch = text.match(/\[SYNC_ITINERARY\]/i);
    if (ticketMatch) return { mode: "ticket" };

    return null;
}

// ─── Main response generation using OpenAI-compatible endpoint ───────────────
async function generateResponse(
    messages: Message[],
    ragContext: string,
    currentPath?: string,
    lowBandwidth?: boolean
): Promise<string> {
    const locationContext = currentPath
        ? `\nUSER'S CURRENT LOCATION: The user is on "${currentPath}". Do NOT suggest navigating there — they are already there. Scroll to relevant sections instead.\n`
        : "";

    const bandwidthContext = lowBandwidth
        ? "\n[LOW_BANDWIDTH] User has a weak connection. Respond in one ultra-short sentence of pure fact only.\n"
        : "";

    // ── BEHAVIORAL CALIBRATION (must appear ABOVE knowledge context) ──────────
    // These rules are read by the model BEFORE it sees any AFLEWO data,
    // ensuring the constraint is set before the material that tempts over-sharing.
    const calibrationBlock = `
CALIBRATION — READ THIS BEFORE ANYTHING ELSE:

Match response length to the question, not to available token space.

- A greeting or acknowledgment ("hi", "hey", "thanks", "okay") gets a one-sentence reply in kind. No context. No history. No offer of what you can help with unless asked.
- A specific factual or logistics question gets a direct answer, two to three sentences, containing only what was asked.
- A request for background, history, theology, or anything phrased as "tell me about" or "explain" gets a fuller answer drawing on the full context provided.
- If a question is ambiguous between a short factual answer and a longer explanation, default to the short answer and note that more detail is available if wanted.
- Never volunteer facts, dates, chapter names, or history the user did not ask about — even if they are directly relevant to something nearby in the conversation. Relevance is not the same as being asked.
- Do not pad a short answer with unsolicited context to seem more thorough. A complete short answer is the goal, not an incomplete long one.

FEW-SHOT EXAMPLES (follow this behavior exactly):

User: hi
Assistant: Hey! What can I help you with?

User: when's rehearsal this week
Assistant: Nakuru chapter rehearsal is on Saturdays. Let me know which chapter you need or if you want the full schedule.

User: tell me about how AFLEWO started
Assistant: Africa Let's Worship was founded in 2004 as a continental interdenominational movement with one mission — stirring up hope in Jesus through a united African voice. It now spans 7 chapters across Kenya, Tanzania, and Rwanda, all rooted in the tagline "One God. One People. One Africa." Would you like to know more about a specific chapter or event?

User: thanks
Assistant: Of course! Anything else I can help with?
`;

    const systemPrompt = `You are a helpful assistant for AFLEWO (Africa Let's Worship). You speak with warmth, faith, and clarity.${locationContext}${bandwidthContext}

${calibrationBlock}

${getSiteMapContext()}

${ragContext ? `ADDITIONAL RETRIEVED CONTEXT (from secure knowledge sandbox):\n${ragContext}` : ""}

FORMATTING RULES:
- When you want to navigate the user to a page, append [navigate_to: /path] at the very end of your response.
- When you want to scroll to a section, append [scroll_to: sectionId] at the very end.
- When the user asks for directions or venue location, append [SHOW_MAP: lat, lng, "Venue Name"] at the very end.
- When the user asks for their schedule or itinerary, append [SYNC_ITINERARY] at the very end.
- These tags are stripped from the displayed text — they are never shown to the user.
- Never answer outside the scope of AFLEWO unless it's a general Christian faith question.
- ${lowBandwidth ? "MINIMAL MODE: One sentence maximum. Facts only." : ""}`;

    const env = process.env;

    // History window: 20 messages
    const finalMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20),
    ];

    // Fixed ceiling backstop: 400 tokens. Not a steering wheel — calibration prompt does that.
    const MAX_TOKENS = 400;

    const providers = [
        // 1. Google Gemini (Best quality)
        {
            name: "Gemini",
            url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            key: env.AFLEWO_GEMINI_API_KEY || env.GEMINI_API_KEY,
            body: { model: "gemini-2.5-flash", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.4 }
        },
        // 2. Groq (Fastest inference - ideal for low-bandwidth)
        {
            name: "Groq",
            url: "https://api.groq.com/openai/v1/chat/completions",
            key: env.AFLEWO_GROQ_API_KEY,
            body: { model: "llama-3.3-70b-versatile", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.4 }
        },
        // 3. Cerebras
        {
            name: "Cerebras",
            url: "https://api.cerebras.ai/v1/chat/completions",
            key: env.AFLEWO_CEREBRAS_API_KEY,
            body: { model: "llama3.1-70b", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.4 }
        },
        // 4. Mistral
        {
            name: "Mistral",
            url: "https://api.mistral.ai/v1/chat/completions",
            key: env.AFLEWO_MISTRAL_API_KEY,
            body: { model: "open-mistral-7b", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.4 }
        }
    ];

    for (const provider of providers) {
        if (!provider.key) continue;
        try {
            const response = await fetch(provider.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${provider.key}`,
                },
                body: JSON.stringify(provider.body),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices?.[0]?.message?.content) {
                    const raw = data.choices[0].message.content;
                    const safe = sanitizeResponse(raw);
                    if (safe === DEGENERATION_FALLBACK) {
                        // Log and try next provider instead of returning garbage
                        console.warn(`[AFLEWO AI] ${provider.name} response failed sanitization — falling through to next provider.`);
                        continue;
                    }
                    console.log(`[AFLEWO AI] Served by ${provider.name} | LowBW: ${lowBandwidth}`);
                    return safe;
                }
            } else {
                console.warn(`[AFLEWO AI] ${provider.name} failed: ${response.status}`);
            }
        } catch (e) {
            console.error(`[AFLEWO AI] ${provider.name} error:`, e);
        }
    }

    // Cloudflare Workers AI (Last Resort)
    const cfToken = env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = env.CLOUDFLARE_ACCOUNT_ID;
    if (cfToken && cfAccountId) {
        try {
            const model = messages.length <= 3
                ? "@cf/mistral/mistral-7b-instruct-v0.1"
                : "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

            const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${model}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({
                    messages: finalMessages,
                    max_tokens: MAX_TOKENS,
                    temperature: 0.4,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.result?.response) {
                    const rawCf = data.result.response;
                    const safeCf = sanitizeResponse(rawCf);
                    if (safeCf !== DEGENERATION_FALLBACK) {
                        console.log(`[AFLEWO AI] Served by Cloudflare Workers AI (${model})`);
                        return safeCf;
                    }
                    console.warn(`[AFLEWO AI] Cloudflare Workers AI response failed sanitization.`);
                }
            }
        } catch (e) {
            console.error("[AFLEWO AI] Cloudflare Workers AI fallback error:", e);
        }
    }

    console.log("[AFLEWO AI] Served by Rule-Based Fallback");
    return fallbackResponse(messages);
}

// ─── Rule-based fallback ──────────────────────────────────────────────────────
function fallbackResponse(messages: Message[]): string {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";

    if (lastMsg.includes("join") || lastMsg.includes("audition") || lastMsg.includes("choir")) {
        return "To join AFLEWO, you can register for auditions at our Join page. We hold auditions for Choir, Band, Media, Ushering, Security, and Dancing teams. [navigate_to: /join]";
    }
    if (lastMsg.includes("event") || lastMsg.includes("nairobi") || lastMsg.includes("when")) {
        return "Our next major event is the Main Nairobi Event on October 3-4, 2026 — an all-night worship experience at Winners' Chapel International. [scroll_to: events]";
    }
    if (lastMsg.includes("chapter") || lastMsg.includes("location") || lastMsg.includes("where")) {
        return "AFLEWO has 7 chapters across East Africa: Nairobi, Eldoret, Nakuru, Mombasa, and Nyeri in Kenya — plus Tanzania and Rwanda. [scroll_to: chapters]";
    }
    if (lastMsg.includes("about") || lastMsg.includes("mission") || lastMsg.includes("who")) {
        return "Africa Let's Worship (AFLEWO) is a continental interdenominational worship movement founded in 2004. Our mission: One God. One People. One Africa. [scroll_to: about]";
    }
    if (lastMsg.includes("media") || lastMsg.includes("video") || lastMsg.includes("watch") || lastMsg.includes("archive")) {
        return "You can watch our worship archive and past event recordings in the Media section. [navigate_to: /media]";
    }
    if (lastMsg.includes("story") || lastMsg.includes("testimon")) {
        return "Hear powerful testimonies and stories from AFLEWO members across Africa. [navigate_to: /testimonies]";
    }
    if (lastMsg.includes("donate") || lastMsg.includes("support") || lastMsg.includes("partner")) {
        return "Thank you for your heart to support! You can partner with AFLEWO through our Join page. [navigate_to: /join]";
    }
    if (lastMsg.includes("hello") || lastMsg.includes("hi") || lastMsg.includes("hey") || lastMsg.includes("good")) {
        return "Habari! Welcome to AFLEWO — Africa Let's Worship. I'm here to help you explore our movement, find events, or help you join us. What can I do for you?";
    }

    return "I'm here to help with anything about AFLEWO — our events, chapters, how to join, our music archive, or our mission. What would you like to know?";
}

// ─── API Route Handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const messages: Message[] = body.messages || [];
        const currentPath: string | undefined = body.currentPath || undefined;
        const lowBandwidth: boolean = body.lowBandwidth === true;

        if (!messages.length) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        // Retrieve context from the air-gapped Vectorize sandbox (with Supabase fallback)
        const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
        const ragContext = await retrieveRAGContext(lastUserMsg);

        // Generate response with expanded context window
        const rawResponse = await generateResponse(messages, ragContext, currentPath, lowBandwidth);

        // Extract navigation action if present
        const action = extractNavigationAction(rawResponse);

        // Extract island/map trigger if present
        const islandTrigger = extractIslandTrigger(rawResponse);

        // Strip all action and trigger tags from displayed text
        const displayText = rawResponse
            .replace(/\[navigate_to:[^\]]+\]/gi, "")
            .replace(/\[scroll_to:[^\]]+\]/gi, "")
            .replace(/\[SHOW_MAP:[^\]]+\]/gi, "")
            .replace(/\[SHOW_WAVEFORM\]/gi, "")
            .replace(/\[SYNC_ITINERARY\]/gi, "")
            .trim();

        // Build offline manifest if this response contains logistical data
        const offlineManifest = extractOfflineManifest(lastUserMsg, displayText);

        return NextResponse.json({
            message: displayText,
            action: action || null,
            islandTrigger: islandTrigger || null,
            offlineManifest: offlineManifest || null,
        });
    } catch (err) {
        console.error("[AFLEWO AI] Error:", err);
        return NextResponse.json(
            { message: "I'm here to help — could you ask that again?", action: null, offlineManifest: null },
            { status: 200 }
        );
    }
}
