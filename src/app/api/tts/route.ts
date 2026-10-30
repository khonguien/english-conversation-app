import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { getEdgeSynthUrl } from "@/utils/edgeDrm";

export const runtime = "nodejs";

// Patch MsEdgeTTS.getSynthUrl with Sec-MS-GEC v2 token calculation to bypass Microsoft 403 Forbidden
(MsEdgeTTS as any).getSynthUrl = async function () {
  return getEdgeSynthUrl();
};

// Optional OpenAI TTS (real ChatGPT voice) if user configures OPENAI_API_KEY in .env.local
async function tryOpenAITTS(text: string, voice: string, rate: number): Promise<Buffer | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const openaiVoice = voice.includes("Andrew") || voice.includes("Guy") || voice.includes("Brian") ? "onyx" : "nova";
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: openaiVoice,
        input: text.trim(),
        speed: rate,
      }),
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    console.warn("OpenAI TTS failed, falling back to Edge Neural TTS:", err);
  }
  return null;
}

// Server-side fallback using Google TTS endpoint in case of Edge service glitches
async function fetchGoogleTTS(text: string): Promise<Buffer | null> {
  try {
    const encoded = encodeURIComponent(text.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
  } catch (e) {
    console.warn("Google TTS fallback failed:", e);
  }
  return null;
}

// Microsoft Edge Neural TTS with high-quality expressive voices (Ava, Andrew, Emma, Brian)
async function generateEdgeAudio(text: string, voice: string = "en-US-AvaNeural", rate: number = 1.0): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const ratePercent = Math.round((Number(rate) - 1.0) * 100);
  const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

  const { audioStream } = tts.toStream(text.trim(), {
    rate: rateStr,
  });

  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
    audioStream.on("end", () => resolve(Buffer.concat(chunks)));
    audioStream.on("error", (err: Error) => reject(err));
  });
}

async function getAudioBuffer(text: string, voice: string, rate: number): Promise<Buffer> {
  // 1. If OpenAI key is set, use real ChatGPT tts-1 voice
  const openAiBuffer = await tryOpenAITTS(text, voice, rate);
  if (openAiBuffer) {
    return openAiBuffer;
  }

  // 2. Otherwise use Microsoft Edge Neural TTS (en-US-AvaNeural / en-US-AndrewNeural)
  try {
    return await generateEdgeAudio(text, voice, rate);
  } catch (edgeErr) {
    console.warn("Edge TTS failed, using server Google TTS fallback:", edgeErr);
  }

  // 3. Fallback to Google TTS to guarantee 100% audio availability
  const googleBuffer = await fetchGoogleTTS(text);
  if (googleBuffer) {
    return googleBuffer;
  }

  throw new Error("All TTS backends failed to synthesize audio");
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get("text");
    const voice = searchParams.get("voice") || "en-US-AvaNeural";
    const rate = Number(searchParams.get("rate") || "1.0");

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing text query param" }, { status: 400 });
    }

    const audioBuffer = await getAudioBuffer(text, voice, rate);

    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("TTS GET error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "en-US-AvaNeural", rate = 1.0 } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Missing text in body" }, { status: 400 });
    }

    const audioBuffer = await getAudioBuffer(text, voice, Number(rate));

    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("TTS POST error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
