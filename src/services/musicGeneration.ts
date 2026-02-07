const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export interface GenerationResult {
  audioUrl: string;
  duration: number;
  audioBlob: Blob;
  mimeType: string;
}

export interface GenerationError {
  message: string;
  details?: string;
}

/**
 * Generates music using ElevenLabs API via edge function
 * Returns a blob URL that can be used with <audio> elements
 */
export async function generateMusic(
  prompt: string,
  duration: number = 30
): Promise<GenerationResult> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("Prompt is required");
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ prompt: prompt.trim(), duration }),
  });

  // Check for JSON error responses
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Music generation failed");
  }

  if (!response.ok) {
    throw new Error(`Music generation failed: ${response.status}`);
  }

  const audioBlob = await response.blob();
  
  if (audioBlob.size === 0) {
    throw new Error("No audio was generated");
  }

  const audioUrl = URL.createObjectURL(audioBlob);
  const mimeType = response.headers.get("content-type") || audioBlob.type || "audio/mpeg";

  return {
    audioUrl,
    duration,
    audioBlob,
    mimeType,
  };
}

/**
 * Cleans up a generated audio URL to free memory
 */
export function revokeAudioUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
