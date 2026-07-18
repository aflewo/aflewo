import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Knowledge Sync Route ─────────────────────────────────────────────────────
// This route is the one-way ETL pipeline from Supabase -> Cloudflare Vectorize.
// It is called on a schedule (Vercel Cron, every 12 hours) and is secured by
// a bearer token. It NEVER exposes any data to the client.
//
// Data flow:
//   Supabase (public logistics tables)
//     → This route extracts & sanitizes
//     → Cloudflare Workers AI (generates embeddings)
//     → Cloudflare Vectorize (stores vectors)
//
// The AI assistant queries ONLY Vectorize. Supabase stays fully air-gapped from
// the frontend AI chat.

// Public-safe tables that contain logistical/onboarding data
const ALLOWED_TABLES = [
    "event_schedules",
    "chapter_faqs",
    "onboarding_rules",
    "aflewo_knowledge",   // existing table (fallback seed data)
] as const;

// Columns to extract per table (hard-coded whitelist — no dynamic queries)
const TABLE_COLUMNS: Record<string, string> = {
    event_schedules: "title,description,date,time,location,chapter",
    chapter_faqs: "question,answer,chapter",
    onboarding_rules: "category,rule,chapter",
    aflewo_knowledge: "content",
};

interface VectorizeVector {
    id: string;
    values: number[];
    metadata: { text: string; table: string; syncedAt: string };
}

async function generateEmbedding(text: string, cfToken: string, cfAccountId: string): Promise<number[] | null> {
    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/baai/bge-small-en-v1.5`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({ text: [text] }),
            }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data?.result?.data?.[0] || null;
    } catch {
        return null;
    }
}

async function upsertVectors(
    vectors: VectorizeVector[],
    cfToken: string,
    cfAccountId: string,
    indexName: string
): Promise<boolean> {
    try {
        // Vectorize upsert accepts batches of up to 1000 vectors
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/vectorize/v2/indexes/${indexName}/upsert`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cfToken}`,
                },
                body: JSON.stringify({ vectors }),
            }
        );
        return res.ok;
    } catch {
        return false;
    }
}

export async function GET(req: NextRequest) {
    // Secure this endpoint — only callable with the correct cron secret
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cfToken = process.env.CLOUDFLARE_API_TOKEN;
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const indexName = process.env.CF_VECTORIZE_INDEX || "aflewo-knowledge";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!cfToken || !cfAccountId) {
        return NextResponse.json({ error: "Cloudflare credentials not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const syncedAt = new Date().toISOString();
    const results: Record<string, { synced: number; errors: number }> = {};
    const vectors: VectorizeVector[] = [];

    // Extract from each whitelisted table
    for (const table of ALLOWED_TABLES) {
        const columns = TABLE_COLUMNS[table];
        if (!columns) continue;

        results[table] = { synced: 0, errors: 0 };

        try {
            const { data, error } = await supabase
                .from(table)
                .select(columns)
                .limit(200); // Safety cap per table

            if (error || !data) {
                console.warn(`[Sync] Could not read ${table}:`, error?.message);
                continue;
            }

            for (const row of data) {
                // Flatten row into a single text string for embedding
                const text = Object.values(row)
                    .filter(v => v !== null && v !== undefined)
                    .map(v => String(v))
                    .join(" | ");

                if (text.trim().length < 10) continue;

                const embedding = await generateEmbedding(text, cfToken, cfAccountId);
                if (!embedding) {
                    results[table].errors++;
                    continue;
                }

                vectors.push({
                    id: `${table}-${Buffer.from(text.slice(0, 64)).toString("base64url")}`,
                    values: embedding,
                    metadata: { text, table, syncedAt },
                });

                results[table].synced++;
            }
        } catch (e) {
            console.error(`[Sync] Error processing ${table}:`, e);
        }
    }

    // Upsert all vectors in one batch
    if (vectors.length > 0) {
        const success = await upsertVectors(vectors, cfToken, cfAccountId, indexName);
        if (!success) {
            console.error("[Sync] Vectorize upsert failed");
        }
    }

    console.log(`[Sync] Complete. Total vectors: ${vectors.length}. Results:`, results);

    return NextResponse.json({
        status: "complete",
        vectorsUpserted: vectors.length,
        tables: results,
        syncedAt,
    });
}
