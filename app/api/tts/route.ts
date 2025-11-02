import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/tts
// Body: { text: "hello world", voiceId?: "optional custom voice" }

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = process.env.ELEVEN_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" } = await req.json();

    if (!process.env.ELEVEN_API_KEY) {
      return NextResponse.json({ error: "Missing ELEVEN_API_KEY" }, { status: 500 });
    }

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // ✨ Friendly, lively tone with expressive dynamics
    const voiceSettings = {
      stability: 0.25,          // lower = more emotion
      similarity_boost: 0.9,    // stay close to the base voice tone
      style: 0.8,               // more “storytelling” energy
      use_speaker_boost: true,  // boost clarity and projection
    };

    // ElevenLabs API call
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY!,
        "accept": "audio/mpeg",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVEN_MODEL_ID || "eleven_turbo_v2",
        voice_settings: voiceSettings,
      }),
    });

    if (!r.ok || !r.body) {
      return NextResponse.json({ error: `ElevenLabs error: ${r.status}` }, { status: 502 });
    }

    // Stream audio back to browser
    return new NextResponse(r.body as any, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
