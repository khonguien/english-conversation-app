import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const runtime = "nodejs";

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
  // If OpenAI key is set, use real ChatGPT tts-1 voice
  const openAiBuffer = await tryOpenAITTS(text, voice, rate);
  if (openAiBuffer) {
    return openAiBuffer;
  }
  // Otherwise use Microsoft Edge Neural TTS (en-US-AvaNeural / en-US-AndrewNeural)
  return generateEdgeAudio(text, voice, rate);
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
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("TTS POST error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
