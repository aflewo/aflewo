import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Whitelisted routing config ──────────────────────────────────────────────
const SITE_ROUTES = [
    { path: "/", name: "Home", description: "Main landing page" },
    { path: "/about", name: "About", description: "Vision, history, leadership" },
    { path: "/media", name: "Media", description: "Worship archive, recordings, videos" },
    { path: "/testimonies", name: "Testimonies", description: "Community stories" },
    { path: "/join", name: "Join / Connect", description: "Audition registration, choir, band, media team, usher, security, dance" },
    { path: "/stories", name: "Stories", description: "Echo testimonies" },
    { path: "/alumni", name: "Alumni", description: "Past members and alumni network" },
    { path: "/chapters", name: "Chapters detail", description: "Detailed chapter information" },
    { path: "/auth", name: "Sign In / Register", description: "Authentication portal" },
    { path: "/profile", name: "Profile", description: "User dashboard and settings" }
];

// ─── AFLEWO Site Knowledge Base ───────────────────────────────────────────────
const SITE_MAP_CONTEXT = `
AFLEWO (Africa Let's Worship) — Site Knowledge Base

IDENTITY:
- Full name: Africa Let's Worship (AFLEWO)
- Founded: 2004
- Type: Continental interdenominational worship movement
- Mission: Stirring up hope in Jesus through a united African voice
- Tagline: "One God. One People. One Africa."

CHAPTERS (7 total):
- Nairobi, Kenya — flagship chapter, main annual event at Winners' Chapel International
- Eldoret, Kenya — regional hub, auditions held annually
- Nakuru, Kenya — Deliverance Church base, active rehearsals
- Mombasa, Kenya — Zoom-based nightly prayer circle
- Nyeri, Kenya — Mt. Kenya region, PCEA Nyamachaki
- Tanzania — CCC Upanga Church, Dar es Salaam
- Rwanda — Christian Life Assembly, Kigali (reconciliation focus)

SITE PAGES & PATHS:
${SITE_ROUTES.map(r => `- ${r.name}: ${r.path} (${r.description})`).join("\n")}

NAVIGATION SECTIONS (home page scroll):
- #hero — landing video section, main headline
- #about — vision and history
- #chapters — all 7 chapters
- #events — event calendar
- #media — archive preview
- #stories — echo testimonies
- #join — connect / join CTA

EVENTS (2026 season):
- Eldoret Auditions: Feb 15, 2026 — choir, band, media, ushering, security, dance
- Nakuru Rehearsals: Mar 02, 2026 — registered members only
- Mombasa Prayer Circle: Nightly on Zoom at 09:00 PM
- Nairobi Pre-Launch: Apr 10, 2026 — Winners' Chapel International
- Tanzania Worship Night: Mar 21, 2026 — CCC Upanga, Dar es Salaam
- Rwanda Commemoration: Apr 07, 2026 — healing and reconciliation service, Kigali
- Nyeri Regional Gathering: May 15, 2026 — PCEA Nyamachaki
- Main Nairobi Event: Oct 03-04, 2026 — flagship all-night worship, Winners' Chapel

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
        ? "\n[LOW_BANDWIDTH] User has a weak connection. Strip all pleasantries. Respond in one ultra-short sentence of pure fact only.\n"
        : "";

    const systemPrompt = `You are a helpful assistant for AFLEWO (Africa Let's Worship). You speak with warmth, faith, and clarity. You have deep knowledge of AFLEWO's mission, chapters, events, and how people can get involved.${locationContext}${bandwidthContext}

${SITE_MAP_CONTEXT}

${ragContext ? `ADDITIONAL RETRIEVED CONTEXT (from secure knowledge sandbox):\n${ragContext}` : ""}

IMPORTANT FORMATTING RULES:
- When you want to navigate the user to a page, include [navigate_to: /path] in your response.
- When you want to scroll to a section, include [scroll_to: sectionId] in your response.
- Strip these tags from your spoken/displayed response but act on them.
- Never answer outside the scope of AFLEWO unless it's a general Christian faith question.
- ${lowBandwidth ? "MINIMAL MODE: One sentence maximum. Facts only." : "Be concise. 1-3 sentences max unless the user asks for more detail."}`;

    const env = process.env;

    // Expanded context window: 20 messages (was 8)
    const finalMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20),
    ];

    // Expanded token budget: 800 (was 300)
    const MAX_TOKENS = lowBandwidth ? 120 : 800;

    const providers = [
        // 1. Google Gemini (Best quality)
        {
            name: "Gemini",
            url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            key: env.AFLEWO_GEMINI_API_KEY || env.GEMINI_API_KEY,
            body: { model: "gemini-2.5-flash", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.6 }
        },
        // 2. Groq (Fastest inference - ideal for low-bandwidth)
        {
            name: "Groq",
            url: "https://api.groq.com/openai/v1/chat/completions",
            key: env.AFLEWO_GROQ_API_KEY,
            body: { model: "llama-3.3-70b-versatile", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.6 }
        },
        // 3. Cerebras
        {
            name: "Cerebras",
            url: "https://api.cerebras.ai/v1/chat/completions",
            key: env.AFLEWO_CEREBRAS_API_KEY,
            body: { model: "llama3.1-70b", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.6 }
        },
        // 4. Mistral
        {
            name: "Mistral",
            url: "https://api.mistral.ai/v1/chat/completions",
            key: env.AFLEWO_MISTRAL_API_KEY,
            body: { model: "open-mistral-7b", messages: finalMessages, max_tokens: MAX_TOKENS, temperature: 0.6 }
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
                    console.log(`[AFLEWO AI] Served by ${provider.name} | LowBW: ${lowBandwidth}`);
                    return data.choices[0].message.content;
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
                    temperature: 0.6,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.result?.response) {
                    console.log(`[AFLEWO AI] Served by Cloudflare Workers AI (${model})`);
                    return data.result.response;
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

        // Strip action tags from displayed text
        const displayText = rawResponse
            .replace(/\[navigate_to:[^\]]+\]/gi, "")
            .replace(/\[scroll_to:[^\]]+\]/gi, "")
            .trim();

        // Build offline manifest if this response contains logistical data
        const offlineManifest = extractOfflineManifest(lastUserMsg, displayText);

        return NextResponse.json({
            message: displayText,
            action: action || null,
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
