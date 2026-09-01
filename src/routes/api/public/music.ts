import { createFileRoute } from "@tanstack/react-router";

const MUSIC_PROMPT =
  "Soft gentle romantic wedding background music loop: warm felt piano melody with soft legato strings and airy ambient pads, serene, slow tempo, calming, instrumental, no vocals, no drums, seamless smooth loop.";

let cachedAudio: ArrayBuffer | null = null;
let pending: Promise<ArrayBuffer> | null = null;

async function generateMusic(): Promise<ArrayBuffer> {
  if (cachedAudio) return cachedAudio;
  if (pending) return pending;

  pending = (async () => {
    const apiKey = process.env["ELEVENLABS_API_KEY"];
    if (!apiKey) throw new Error("ElevenLabs is not connected to this project");

    const response = await fetch(
      "https://api.elevenlabs.io/v1/sound-generation",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: MUSIC_PROMPT,
          duration_seconds: 22,
          prompt_influence: 0.5,
          loop: true,
        }),
      },
    );

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
