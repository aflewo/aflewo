require("dotenv").config();
const fs = require("fs");
const speech = require("@google-cloud/speech");

// Parse credentials safely
let rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
if (rawCreds.startsWith('{"{')) {
    rawCreds = rawCreds.substring(2, rawCreds.length - 2);
}

let credentials;
try {
    credentials = JSON.parse(rawCreds);
    // Fix literal \n strings in private key
    if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
} catch (e) {
    console.error("Failed to parse credentials:", e);
    process.exit(1);
}

const client = new speech.SpeechClient({
    credentials,
    projectId: credentials.project_id
});

// The provided audio file
const fileName = "C:\\Users\\Administrator\\Downloads\\voice-recorder-2026-07-13--12-56-35.wav";

// Check if file exists
if (!fs.existsSync(fileName)) {
    console.error(`File not found: ${fileName}`);
    process.exit(1);
}

const file = fs.readFileSync(fileName);
const audioBytes = file.toString("base64");

const request = {
    audio: {
        content: audioBytes,
    },
    config: {
        encoding: "LINEAR16",
        sampleRateHertz: 44100,
        languageCode: "sw-KE",
        alternativeLanguageCodes: ["en-KE"],
        enableAutomaticPunctuation: true
    },
};

async function runTest() {
    console.log("Analyzing audio for Swahili/English/Sheng code-switching...");
    try {
        const [response] = await client.recognize(request);
        
        if (!response.results || response.results.length === 0) {
            console.log("No transcription returned (could be silence or unrecognizable audio).");
            return;
        }

        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join("\n");
        
        console.log("\n======================================");
        console.log("📝 STT TRANSCRIPT RESULT");
        console.log("======================================");
        console.log(transcription);
        console.log("======================================\n");
    } catch (e) {
        console.error("❌ Google STT API Error:", e);
    }
}

runTest();
