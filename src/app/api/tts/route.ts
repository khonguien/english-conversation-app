import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const runtime = "nodejs";

async function generateEdgeAudio(text: string, voice: string = "en-US-JennyNeural", rate: number = 1.0): Promise<Buffer> {
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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get("text");
    const voice = searchParams.get("voice") || "en-US-JennyNeural";
    const rate = Number(searchParams.get("rate") || "1.0");

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing text query param" }, { status: 400 });
    }

    const audioBuffer = await generateEdgeAudio(text, voice, rate);

    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("Edge TTS GET error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "en-US-JennyNeural", rate = 1.0 } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Missing text in body" }, { status: 400 });
    }

    const audioBuffer = await generateEdgeAudio(text, voice, Number(rate));

    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    console.error("Edge TTS POST error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
