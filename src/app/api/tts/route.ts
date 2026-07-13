import { NextRequest, NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

let cachedClient: textToSpeech.TextToSpeechClient | null = null;

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

    cachedClient = new textToSpeech.TextToSpeechClient({
        credentials,
        projectId: credentials.project_id
    });
    return cachedClient;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const client = getClient();

        const request = {
            input: { text: text },
            voice: { languageCode: 'sw-KE', name: 'sw-KE-Standard-A' }, // sw-KE does not have a Neural2 voice
            audioConfig: { audioEncoding: 'MP3' as const },
        };

        const [response] = await client.synthesizeSpeech(request);
        
        if (!response.audioContent) {
            return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
        }

        // Return the binary audio file with appropriate headers
        return new NextResponse(response.audioContent, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": response.audioContent.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("TTS API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
