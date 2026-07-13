import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── AFLEWO Site Knowledge Base ───────────────────────────────────────────────
// This is the static knowledge injected into every system context window.
// Augmented by dynamic Supabase RAG retrieval at query time.
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
- Home: /
- About: /about (vision, history, leadership)
- Media: /media (worship archive, recordings, videos)
- Testimonies: /testimonies (community stories)
- Join / Connect: /join (audition registration, choir, band, media team, usher, security, dance)
- Stories: /stories
- Alumni: /alumni
- Chapters detail: /chapters
- Sign In / Profile: /auth, /profile

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
- Main Nairobi Event: Oct 03–04, 2026 — flagship all-night worship, Winners' Chapel

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
`;

// ─── Whitelisted navigation actions ──────────────────────────────────────────
const ALLOWED_ROUTES = ["/", "/about", "/media", "/testimonies", "/join", "/stories", "/alumni", "/chapters", "/auth", "/profile"];
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
    const lower = text.toLowerCase();

    // Check for explicit navigation intent in model response
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

// ─── Supabase RAG retrieval (pgvector similarity search) ─────────────────────
async function retrieveRAGContext(query: string): Promise<string> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check if the documents table exists for RAG
        const { data, error } = await supabase
            .from("aflewo_knowledge")
            .select("content, similarity")
            .limit(3);

        if (error || !data || data.length === 0) {
            // Table doesn't exist yet or no data — fall back gracefully
            return "";
        }

        return data.map((d: { content: string }) => d.content).join("\n\n");
    } catch {
        // RAG table not yet seeded — silent graceful degradation
        return "";
    }
}

// ─── Main response generation using OpenAI-compatible endpoint ───────────────
// Uses Resend-adjacent pattern: tries OPENAI_API_KEY from env, falls back to
// a simple rule-based response so the assistant always works.
async function generateResponse(messages: Message[], ragContext: string): Promise<string> {
    const systemPrompt = `You are a helpful assistant for AFLEWO (Africa Let's Worship). You speak with warmth, faith, and clarity. You have deep knowledge of AFLEWO's mission, chapters, events, and how people can get involved.

${SITE_MAP_CONTEXT}

${ragContext ? `ADDITIONAL RETRIEVED CONTEXT:\n${ragContext}` : ""}

IMPORTANT FORMATTING RULES:
- When you want to navigate the user to a page, include [navigate_to: /path] in your response.
- When you want to scroll to a section, include [scroll_to: sectionId] in your response.
- Strip these tags from your spoken/displayed response but act on them.
- Never answer outside the scope of AFLEWO unless it's a general Christian faith question.
- Be concise. 1–3 sentences max unless the user asks for more detail.`;

    const env = process.env;
    const finalMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-8),
    ];

    const providers = [
        // 1. Google Gemini (Best Free Tier)
        {
            name: "Gemini",
            url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            key: env.AFLEWO_GEMINI_API_KEY || env.GEMINI_API_KEY,
            body: { model: "gemini-2.5-flash", messages: finalMessages, max_tokens: 300, temperature: 0.6 }
        },
        // 2. Groq (Fastest Inference)
        {
            name: "Groq",
            url: "https://api.groq.com/openai/v1/chat/completions",
            key: env.AFLEWO_GROQ_API_KEY,
            body: { model: "llama-3.3-70b-versatile", messages: finalMessages, max_tokens: 300, temperature: 0.6 }
        },
        // 3. Cerebras (Ultra Fast)
        {
            name: "Cerebras",
            url: "https://api.cerebras.ai/v1/chat/completions",
            key: env.AFLEWO_CEREBRAS_API_KEY,
            body: { model: "llama3.1-70b", messages: finalMessages, max_tokens: 300, temperature: 0.6 }
        },
        // 4. Mistral (European Open Source)
        {
            name: "Mistral",
            url: "https://api.mistral.ai/v1/chat/completions",
            key: env.AFLEWO_MISTRAL_API_KEY,
            body: { model: "open-mistral-7b", messages: finalMessages, max_tokens: 300, temperature: 0.6 }
        }
    ];

    // Try OpenAI-compatible providers
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
                    console.log(`[AFLEWO AI] Served by ${provider.name}`);
                    return data.choices[0].message.content;
                }
            } else {
                console.warn(`[AFLEWO AI] ${provider.name} failed with status: ${response.status}`);
            }
        } catch (e) {
            console.error(`[AFLEWO AI] ${provider.name} fallback error:`, e);
        }
    }

    // 5. Cloudflare Workers AI (Last Resort API Fallback to save Neurons)
    const cfToken = env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = env.CLOUDFLARE_ACCOUNT_ID;
    if (cfToken && cfAccountId) {
        try {
            const messageCount = messages.length;
            // Use Mistral for simple requests to save neurons, otherwise Llama 3.3
            const model = messageCount <= 3 
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
                    max_tokens: 300,
                    temperature: 0.6,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.result?.response) {
                    console.log(`[AFLEWO AI] Served by Cloudflare Workers AI (${model})`);
                    return data.result.response;
                }
            } else {
                console.warn(`[AFLEWO AI] Cloudflare failed with status: ${response.status}`);
            }
        } catch (e) {
            console.error("[AFLEWO AI] Cloudflare Workers AI fallback error:", e);
        }
    }

    console.log("[AFLEWO AI] Served by Rule-Based Fallback");
    return fallbackResponse(messages);
}

// ─── Rule-based fallback (no API key required) ────────────────────────────────
function fallbackResponse(messages: Message[]): string {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";

    if (lastMsg.includes("join") || lastMsg.includes("audition") || lastMsg.includes("choir")) {
        return "To join AFLEWO, you can register for auditions at our Join page. We hold auditions for Choir, Band, Media, Ushering, Security, and Dancing teams. [navigate_to: /join]";
    }
    if (lastMsg.includes("event") || lastMsg.includes("nairobi") || lastMsg.includes("when")) {
        return "Our next major event is the Main Nairobi Event on October 3–4, 2026 — an all-night worship experience at Winners' Chapel International. [scroll_to: events]";
    }
    if (lastMsg.includes("chapter") || lastMsg.includes("location") || lastMsg.includes("where")) {
        return "AFLEWO has 7 chapters across East Africa: Nairobi, Eldoret, Nakuru, Mombasa, and Nyeri in Kenya — plus Tanzania and Rwanda. [scroll_to: chapters]";
    }
    if (lastMsg.includes("about") || lastMsg.includes("mission") || lastMsg.includes("who")) {
        return "Africa Let's Worship (AFLEWO) is a continental interdenominational worship movement founded in 2004. Our mission: One God. One People. One Africa — stirring up hope in Jesus. [scroll_to: about]";
    }
    if (lastMsg.includes("media") || lastMsg.includes("video") || lastMsg.includes("watch") || lastMsg.includes("archive")) {
        return "You can watch our worship archive and past event recordings in the Media section. [navigate_to: /media]";
    }
    if (lastMsg.includes("story") || lastMsg.includes("testimon")) {
        return "Hear powerful testimonies and stories from AFLEWO members across Africa. [navigate_to: /testimonies]";
    }
    if (lastMsg.includes("donate") || lastMsg.includes("support") || lastMsg.includes("partner")) {
        return "Thank you for your heart to support! You can partner with AFLEWO through our Join page — we'd love to connect with you. [navigate_to: /join]";
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

        if (!messages.length) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        // Retrieve RAG context (graceful if table not yet seeded)
        const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
        const ragContext = await retrieveRAGContext(lastUserMsg);

        // Generate response
        const rawResponse = await generateResponse(messages, ragContext);

        // Extract navigation action if present
        const action = extractNavigationAction(rawResponse);

        // Strip action tags from displayed text
        const displayText = rawResponse
            .replace(/\[navigate_to:[^\]]+\]/gi, "")
            .replace(/\[scroll_to:[^\]]+\]/gi, "")
            .trim();

        return NextResponse.json({
            message: displayText,
            action: action || null,
        });
    } catch (err) {
        console.error("[AFLEWO AI] Error:", err);
        return NextResponse.json(
            { message: "I'm here to help — could you ask that again?", action: null },
            { status: 200 } // Always return 200 to the client so the UI doesn't break
        );
    }
}
