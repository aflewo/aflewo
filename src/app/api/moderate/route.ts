import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Moderation Gatekeeper ────────────────────────────────────────────────────
// This route silently scans user-submitted content (testimonies, prayer requests)
// for spam, malicious links, and profanity.
// It NEVER deletes or publishes content. It only sets a `is_flagged` column.
// All final moderation decisions are made by a human admin.

// Hard-coded blocklist patterns (no external API calls needed for basic filtering)
const PROFANITY_PATTERNS = [
    /\b(fuck|shit|ass|bitch|damn|crap|hell|bastard)\b/gi,
];

const SPAM_PATTERNS = [
    /https?:\/\/[^\s]+/gi,                    // any URL in the text
    /\b(buy now|click here|free money|earn \$|make money fast|crypto|bitcoin)\b/gi,
    /(.)\1{6,}/g,                              // repeated characters: "heeeeey"
    /[A-Z]{10,}/g,                             // excessive ALL CAPS
];

const MALICIOUS_PATTERNS = [
    /<script[\s\S]*?>/gi,                      // script tags
    /javascript:/gi,                           // js protocol injection
    /on\w+\s*=/gi,                             // event handler injection (onclick=)
    /SELECT\s+.*\s+FROM/gi,                    // SQL injection patterns
    /DROP\s+TABLE/gi,
    /INSERT\s+INTO/gi,
];

interface ModerationResult {
    isFlagged: boolean;
    reasons: string[];
    confidence: "low" | "medium" | "high";
}

function runLocalModeration(text: string): ModerationResult {
    const reasons: string[] = [];

    for (const pattern of PROFANITY_PATTERNS) {
        if (pattern.test(text)) {
            reasons.push("profanity");
            break;
        }
    }

    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(text)) {
            reasons.push("spam");
            break;
        }
    }

    for (const pattern of MALICIOUS_PATTERNS) {
        if (pattern.test(text)) {
            reasons.push("malicious_injection");
            break;
        }
    }

    // Length heuristic — very short or extremely long may indicate bot
    if (text.trim().length < 10) reasons.push("too_short");
    if (text.trim().length > 5000) reasons.push("excessive_length");

    const isFlagged = reasons.length > 0;
    const confidence = reasons.includes("malicious_injection") ? "high"
        : reasons.length >= 2 ? "medium"
        : reasons.length === 1 ? "low"
        : "low";

    return { isFlagged, reasons, confidence };
}

// ─── Optional AI moderation layer ────────────────────────────────────────────
// Only called for borderline cases (low confidence from local scan).
// Uses a single cheap AI call — returns true if content should be flagged.
async function runAIModeration(text: string): Promise<boolean> {
    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!cfToken || !cfAccountId) return false;

    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/mistral/mistral-7b-instruct-v0.1`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are a moderation assistant for AFLEWO (Africa Let's Worship), a Christian worship platform.
You must only reply with a single word: "SAFE" or "FLAG".
Flag content that contains: profanity, spam links, hate speech, offensive material, sexual content, or anything inappropriate for a faith-based community.
Do NOT flag: prayer requests, testimonies, event questions, or strong but appropriate expressions of faith.`
                        },
                        { role: "user", content: `Moderate this content:\n\n${text.slice(0, 500)}` }
                    ],
                    max_tokens: 5,
                    temperature: 0,
                }),
            }
        );

        if (!res.ok) return false;
        const data = await res.json();
        const verdict = data?.result?.response?.trim().toUpperCase();
        return verdict === "FLAG";
    } catch {
        return false;
    }
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, table, recordId } = body;

        // Validate inputs
        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }
        if (!table || !["testimonies", "prayer_requests", "stories"].includes(table)) {
            return NextResponse.json({ error: "Invalid table target" }, { status: 400 });
        }
        if (!recordId) {
            return NextResponse.json({ error: "No record ID provided" }, { status: 400 });
        }

        // Step 1: Run fast local moderation
        const localResult = runLocalModeration(text);

        let finalFlagged = localResult.isFlagged;
        let finalReasons = localResult.reasons;

        // Step 2: If local scan is uncertain (low confidence) escalate to AI
        if (!localResult.isFlagged || localResult.confidence === "low") {
            const aiFlagged = await runAIModeration(text);
            if (aiFlagged) {
                finalFlagged = true;
                finalReasons = [...finalReasons, "ai_moderation"];
            }
        }

        // Step 3: If flagged, mark in the database — only the `is_flagged` and `flag_reasons` columns
        if (finalFlagged) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { error } = await supabase
                .from(table)
                .update({
                    is_flagged: true,
                    flag_reasons: finalReasons,
                    flagged_at: new Date().toISOString(),
                })
                .eq("id", recordId);

            if (error) {
                console.error("[AFLEWO Moderator] DB update error:", error.message);
                // Don't expose DB errors to client
            } else {
                console.log(`[AFLEWO Moderator] Flagged record ${recordId} in ${table}. Reasons: ${finalReasons.join(", ")}`);
            }
        }

        // Always return a safe, non-revealing response to the client
        return NextResponse.json({
            status: "reviewed",
            flagged: finalFlagged,
        });
    } catch (err) {
        console.error("[AFLEWO Moderator] Error:", err);
        // Return 200 always — never expose internal errors
        return NextResponse.json({ status: "reviewed", flagged: false }, { status: 200 });
    }
}
