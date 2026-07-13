import { NextRequest, NextResponse } from "next/server";
import { SpeechClient } from "@google-cloud/speech";

let cachedClient: SpeechClient | null = null;

function getClient() {
    if (cachedClient) return cachedClient;

    let rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "";
    let credentials;
    try {
        credentials = JSON.parse(rawCreds);
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
    } catch (e) {
        console.error("Failed to parse credentials:", e);
        throw new Error("Server Configuration Error");
    }

    cachedClient = new SpeechClient({
        credentials,
        projectId: credentials.project_id
    });
    return cachedClient;
}

export async function POST(req: NextRequest) {
    try {
        const client = getClient();

        const formData = await req.formData();
        const file = formData.get("file") as Blob;
        
        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const audioBytes = Buffer.from(arrayBuffer).toString("base64");

        const request = {
            audio: {
                content: audioBytes,
            },
            config: {
                // By omitting encoding and sampleRate we let the V1 API auto-detect browser formats (webm/mp4).
                // MediaRecorder hardcodes OPUS headers to 48000Hz regardless of the getUserMedia constraint.
                languageCode: "sw-KE",
                alternativeLanguageCodes: ["en-KE"],
                enableAutomaticPunctuation: true,
            },
        };

        const [response] = await client.recognize(request);
        
        if (!response.results || response.results.length === 0) {
            return NextResponse.json({ text: "", language: "sw-KE" });
        }

        const transcription = response.results
            .map(result => result.alternatives?.[0]?.transcript)
            .filter(Boolean)
            .join("\n");

        return NextResponse.json({ text: transcription.trim(), language: "sw-KE" });
    } catch (error: any) {
        console.error("STT API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
