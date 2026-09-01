import { createFileRoute } from "@tanstack/react-router";

const MUSIC_PROMPT =
  "Soft, gentle instrumental background music for an elegant wedding invitation website. Warm felt piano, soft legato strings, subtle oud, airy pads. Serene, romantic, slow tempo, calming ambient mood. No vocals, no drums, seamless gentle feel.";

let cachedAudio: ArrayBuffer | null = null;
let pending: Promise<ArrayBuffer> | null = null;

async function generateMusic(): Promise<ArrayBuffer> {
  if (cachedAudio) return cachedAudio;
  if (pending) return pending;

  pending = (async () => {
    const apiKey = process.env["ELEVENLABS_API_KEY"];
    if (!apiKey) throw new Error("ElevenLabs is not connected to this project");

    const response = await fetch("https://api.elevenlabs.io/v1/music", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: MUSIC_PROMPT,
        duration_seconds: 90,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Music generation failed [${response.status}]: ${err}`);
    }

    cachedAudio = await response.arrayBuffer();
    pending = null;
    return cachedAudio;
  })().catch((e) => {
    pending = null;
    throw e;
  });

  return pending;
}

export const Route = createFileRoute("/api/public/music")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const audio = await generateMusic();
          return new Response(audio, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          console.error(message);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
